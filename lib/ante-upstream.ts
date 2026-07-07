/** Server-side Ante REST helpers — upstream auth uses secret keys (payments:write). */
import "server-only";

import type { AnteCredentialMode } from "@/lib/ante-credential-mode";
import { merchantId, resolveSecretKey } from "@/lib/ante-credentials";

export const ANTE_API_BASE = "https://splitante.com/api/v1";

const FORWARD_HEADERS = [
  "content-type",
  "x-ante-signature",
  "x-ante-cart-signature",
  "x-ante-sdk-version",
  "x-ante-react-sdk-version",
] as const;

export function secretKeyForSessions(mode: AnteCredentialMode): string {
  const secretKey = resolveSecretKey(mode);
  if (!secretKey) {
    throw new Error(
      mode === "live"
        ? "ANTE_SECRET_KEY or ANTE_SECRET_KEY_LIVE is not configured. Session create requires a server secret key (ante_sk_live_*)."
        : "ANTE_SECRET_KEY_TEST is not configured. Session create requires a server secret key (ante_sk_test_*).",
    );
  }
  if (!secretKey.startsWith("ante_sk_")) {
    throw new Error("Secret API key should start with ante_sk_test_ or ante_sk_live_.");
  }
  return secretKey;
}

/** Build upstream headers for /sessions* — swaps publishable bearer for secret key server-side. */
export function buildUpstreamSessionHeaders(
  mode: AnteCredentialMode,
  request: Request,
): Headers {
  const secretKey = secretKeyForSessions(mode);
  const id = merchantId();
  if (!id) {
    throw new Error("NEXT_PUBLIC_ANTE_MERCHANT_ID is not configured.");
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${secretKey}`);
  headers.set("X-Merchant-ID", id);

  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  return headers;
}
