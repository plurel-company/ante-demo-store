/** Allowed fields for checkout client-log telemetry (no arbitrary client keys). */
const ALLOWED_FIELDS = ["stage", "ua", "href", "online", "name", "message", "ts"] as const;

const MAX_STRING_LEN = 500;
const MAX_HREF_LEN = 2000;

export type ClientLogPayload = {
  stage: string;
  ua?: string;
  href?: string;
  online?: boolean | null;
  name?: string;
  message?: string;
  ts?: string;
};

export function sanitizeClientLogPayload(
  input: Record<string, unknown>,
): ClientLogPayload {
  const out: ClientLogPayload = {
    stage: "unknown",
  };

  for (const key of ALLOWED_FIELDS) {
    const value = input[key];
    if (value === undefined) continue;

    if (key === "online") {
      out.online = typeof value === "boolean" ? value : null;
      continue;
    }

    if (typeof value === "string") {
      const max = key === "href" ? MAX_HREF_LEN : MAX_STRING_LEN;
      const trimmed = value.slice(0, max);
      if (key === "stage") {
        out.stage = trimmed || "unknown";
      } else {
        out[key] = trimmed;
      }
    }
  }

  return out;
}

/** Reject cross-origin posts to the public client-log endpoint. */
export function isSameOriginRequest(request: Request): boolean {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === requestOrigin;
  }

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === requestOrigin;
  } catch {
    return false;
  }
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

/** Best-effort per-IP rate limit (per serverless instance). */
export function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(clientKey);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

export function resetClientLogRateLimitsForTests(): void {
  rateBuckets.clear();
}
