/** POST /api/client-log — dev-only checkout telemetry fallback when Sentry is not configured. */
import {
  isRateLimited,
  isSameOriginRequest,
  sanitizeClientLogPayload,
} from "@/lib/client-log-payload";

export async function POST(request: Request) {
  // Production checkout errors are captured in the browser via Sentry + /monitoring tunnel.
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  if (!isSameOriginRequest(request)) {
    return new Response(null, { status: 403 });
  }

  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientKey)) {
    return new Response(null, { status: 429 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = { message: "unparseable payload" };
  }

  const sanitized = sanitizeClientLogPayload(body);
  console.error("[client-error]", JSON.stringify(sanitized));

  return new Response(null, { status: 204 });
}
