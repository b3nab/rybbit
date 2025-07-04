import { clickhouse } from "../../db/clickhouse/clickhouse.js";
import {
  SessionReplayMetadata,
  SessionReplayListItem,
  GetSessionReplayEventsResponse,
} from "../../types/sessionReplay.js";
import {
  processResults,
  getTimeStatement,
  getFilterStatement,
} from "../../api/analytics/utils.js";
import { FilterParams } from "@rybbit/shared";
import { r2Storage } from "../storage/r2StorageService.js";

/**
 * Service responsible for querying/retrieving session replay data
 * Handles listing sessions and getting replay events
 */
export class SessionReplayQueryService {
  async getSessionReplayList(
    siteId: number,
    options: {
      limit?: number;
      offset?: number;
      userId?: string;
      minDuration?: number;
    } & Pick<
      FilterParams,
      | "startDate"
      | "endDate"
      | "timeZone"
      | "pastMinutesStart"
      | "pastMinutesEnd"
      | "filters"
    >
  ): Promise<SessionReplayListItem[]> {
    const { limit = 50, offset = 0, userId, minDuration } = options;

    const timeStatement = getTimeStatement(options).replace(
      /timestamp/g,
      "start_time"
    );

    const filterStatement = getFilterStatement(options.filters || "");

    let whereConditions = [`site_id = {siteId:UInt16}`];
    const queryParams: any = { siteId, limit, offset };

    if (userId) {
      whereConditions.push(`user_id = {userId:String}`);
      queryParams.userId = userId;
    }

    if (minDuration !== undefined) {
      whereConditions.push(`duration_ms >= {minDuration:UInt32}`);
      queryParams.minDuration = minDuration * 1000; // Convert seconds to milliseconds
    }

    // Build the base query for session IDs that have replay events
    let sessionIdsSubquery = `
      SELECT DISTINCT session_id
      FROM session_replay_events
      WHERE site_id = {siteId:UInt16} AND event_type = '2'
    `;

    // If filters are present, we need to further filter by sessions that match the filter criteria
    if (filterStatement) {
      sessionIdsSubquery = `
        SELECT DISTINCT srm.session_id
        FROM session_replay_metadata srm
        FINAL
        WHERE srm.site_id = {siteId:UInt16}
          AND srm.session_id IN (
            SELECT DISTINCT session_id
            FROM session_replay_events
            WHERE site_id = {siteId:UInt16} AND event_type = '2'
          )
          AND srm.session_id IN (
            SELECT DISTINCT session_id
            FROM events
            WHERE site_id = {siteId:UInt16}
              ${filterStatement}
          )
      `;
    }

    const query = `
      SELECT 
        session_id,
        user_id,
        start_time,
        end_time,
        duration_ms,
        page_url,
        event_count,
        country,
        region,
        city,
        browser,
        browser_version,
        operating_system,
        operating_system_version,
        device_type,
        screen_width,
        screen_height
      FROM session_replay_metadata
      FINAL
      WHERE ${whereConditions.join(" AND ")}
        AND event_count >= 2
        AND session_id IN (${sessionIdsSubquery})
      ${timeStatement}
      ORDER BY start_time DESC
      LIMIT {limit:UInt32}
      OFFSET {offset:UInt32}
    `;

    const result = await clickhouse.query({
      query,
      query_params: queryParams,
      format: "JSONEachRow",
    });

    const rawResults = await processResults<any>(result);

    const finalResults = rawResults;

    return finalResults;
  }

  async getSessionReplayEvents(
    siteId: number,
    sessionId: string
  ): Promise<GetSessionReplayEventsResponse> {
    const startTime = Date.now();
    console.log(`[ReplayTelemetry] Loading events for session ${sessionId}`);
    
    // Get metadata
    const metadataStart = Date.now();
    const metadataResult = await clickhouse.query({
      query: `
        SELECT *
        FROM session_replay_metadata
        FINAL
        WHERE site_id = {siteId:UInt16} 
          AND session_id = {sessionId:String}
        LIMIT 1
      `,
      query_params: { siteId, sessionId },
      format: "JSONEachRow",
    });

    const metadataResults = await processResults<any>(metadataResult);
    const metadata = metadataResults[0];
    console.log(`[ReplayTelemetry] Metadata query took ${Date.now() - metadataStart}ms`);

    if (!metadata) {
      throw new Error("Session replay not found");
    }

    // Get events
    const eventsQueryStart = Date.now();
    const eventsResult = await clickhouse.query({
      query: `
        SELECT 
          toUnixTimestamp64Milli(timestamp) as timestamp,
          event_type as type,
          event_data as data,
          event_data_key,
          batch_index
        FROM session_replay_events
        WHERE site_id = {siteId:UInt16} 
          AND session_id = {sessionId:String}
        ORDER BY timestamp ASC, sequence_number ASC
      `,
      query_params: { siteId, sessionId },
      format: "JSONEachRow",
    });

    type EventRow = {
      timestamp: number;
      type: string;
      data: string;
      event_data_key: string | null;
      batch_index: number | null;
    };

    const eventsResults = await processResults<EventRow>(eventsResult);
    console.log(`[ReplayTelemetry] Events query took ${Date.now() - eventsQueryStart}ms, found ${eventsResults.length} events`);

    // Group events by batch key for efficient R2 retrieval
    const eventsByBatch = new Map<string | null, EventRow[]>();
    eventsResults.forEach(event => {
      const key = event.event_data_key;
      if (!eventsByBatch.has(key)) {
        eventsByBatch.set(key, []);
      }
      eventsByBatch.get(key)!.push(event);
    });
    
    const r2BatchKeys = Array.from(eventsByBatch.keys()).filter(k => k !== null);
    console.log(`[ReplayTelemetry] Found ${r2BatchKeys.length} R2 batches to fetch`);

    // Process batches and reconstruct events
    const events = [];
    const r2FetchStart = Date.now();
    let r2FetchCount = 0;
    
    for (const [batchKey, batchEvents] of eventsByBatch) {
      if (batchKey && r2Storage.isEnabled()) {
        // Fetch event data from R2
        try {
          const batchFetchStart = Date.now();
          const eventDataArray = await r2Storage.getBatch(batchKey);
          r2FetchCount++;
          console.log(`[ReplayTelemetry] R2 batch ${batchKey} fetch took ${Date.now() - batchFetchStart}ms`);
          
          // Map R2 data back to events
          for (const event of batchEvents) {
            if (event.batch_index !== null && eventDataArray[event.batch_index]) {
              events.push({
                timestamp: event.timestamp,
                type: event.type,
                data: eventDataArray[event.batch_index],
              });
            }
          }
        } catch (error) {
          console.error(`Failed to fetch R2 batch ${batchKey}:`, error);
          // Skip this batch if R2 fetch fails
        }
      } else {
        // Traditional ClickHouse storage
        for (const event of batchEvents) {
          events.push({
            timestamp: event.timestamp,
            type: event.type,
            data: JSON.parse(event.data),
          });
        }
      }
    }

    // Sort events by timestamp (in case batches were processed out of order)
    events.sort((a, b) => a.timestamp - b.timestamp);
    
    if (r2FetchCount > 0) {
      console.log(`[ReplayTelemetry] Total R2 fetch time: ${Date.now() - r2FetchStart}ms for ${r2FetchCount} batches`);
    }
    
    console.log(`[ReplayTelemetry] Total load time: ${Date.now() - startTime}ms for ${events.length} events`);

    return {
      events,
      metadata,
    };
  }

  async getSessionReplayMetadata(
    siteId: number,
    sessionId: string
  ): Promise<SessionReplayMetadata | null> {
    const result = await clickhouse.query({
      query: `
        SELECT *
        FROM session_replay_metadata
        FINAL
        WHERE site_id = {siteId:UInt16} 
          AND session_id = {sessionId:String}
        LIMIT 1
      `,
      query_params: { siteId, sessionId },
      format: "JSONEachRow",
    });

    const results = await processResults<SessionReplayMetadata>(result);
    return results[0] || null;
  }
}
