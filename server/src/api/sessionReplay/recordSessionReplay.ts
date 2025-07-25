import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { SessionReplayIngestService } from "../../services/replay/sessionReplayIngestService.js";
import { RecordSessionReplayRequest } from "../../types/sessionReplay.js";
import { getIpAddress } from "../getIpAddress.js";

const recordSessionReplaySchema = z.object({
  userId: z.string(),
  events: z.array(
    z.object({
      type: z.union([z.string(), z.number()]),
      data: z.any(),
      timestamp: z.number(),
    })
  ),
  metadata: z
    .object({
      pageUrl: z.string(),
      viewportWidth: z.number().optional(),
      viewportHeight: z.number().optional(),
      language: z.string().optional(),
    })
    .optional(),
});

export async function recordSessionReplay(
  request: FastifyRequest<{
    Params: { site: string };
    Body: RecordSessionReplayRequest;
  }>,
  reply: FastifyReply
) {
  try {
    const siteId = Number(request.params.site);
    const body = recordSessionReplaySchema.parse(
      request.body
    ) as RecordSessionReplayRequest;

    // Extract request metadata for tracking
    const userAgent = request.headers["user-agent"] || "";
    const ipAddress = getIpAddress(request);
    const origin = request.headers.origin || "";
    const referrer = request.headers.referer || "";

    const sessionReplayService = new SessionReplayIngestService();
    await sessionReplayService.recordEvents(siteId, body, {
      userAgent,
      ipAddress,
      origin,
      referrer,
    });

    return reply.send({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors });
    }
    console.error("Error recording session replay:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
}


