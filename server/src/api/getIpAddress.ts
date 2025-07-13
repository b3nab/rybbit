import { FastifyRequest } from "fastify";

/**
 * Helper function to get IP address.
 * Handles various proxy headers in the correct order of priority.
 *
 * @param request The Fastify request object
 * @returns The client's real IP address
 */
export function getIpAddress(request: FastifyRequest): string {
  // Priority 1: Cloudflare header (already validated by CF)
  const cfConnectingIp = request.headers["cf-connecting-ip"];
  if (cfConnectingIp && typeof cfConnectingIp === "string") {
    return cfConnectingIp.trim();
  }

  // Priority 2: X-Forwarded-For - use the first IP (original client)
  const forwardedFor = request.headers["x-forwarded-for"];
  if (forwardedFor && typeof forwardedFor === "string") {
    const ips = forwardedFor
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);
    if (ips.length > 0) {
      // Always use the first IP - the original client
      return ips[0];
    }
  }

  // Priority 3: X-Real-IP header
  const realIp = request.headers["x-real-ip"];
  if (realIp && typeof realIp === "string") {
    return realIp.trim();
  }

  // Fallback to Fastify's IP detection
  return request.ip;
}