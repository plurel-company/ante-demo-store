/** GET /api/setup/status — report env configuration for the active test/live mode. */
import {
  credentialAvailability,
  merchantId,
  parseAnteCredentialMode,
  resolvePublishableKey,
  resolveSecretKey,
  resolveWebhookSecret,
  signingSecret,
  ANTE_KEY_MODE_HEADER,
} from "@/lib/ante-credentials";
import { publishableKeyMode, validateCredentialShapes } from "@/lib/ante-env";

export async function GET(req: Request) {
  const mode = parseAnteCredentialMode(req.headers.get(ANTE_KEY_MODE_HEADER));
  const id = merchantId();
  const publishableKey = resolvePublishableKey(mode);
  const secret = signingSecret();
  const secretKey = resolveSecretKey(mode);
  const webhookSecret = resolveWebhookSecret(mode);
  const keyMode = publishableKeyMode(publishableKey);
  const availability = credentialAvailability();

  const issues: string[] = validateCredentialShapes({
    merchantId: id,
    publishableKey,
    signingSecret: secret,
  });

  if (!id) {
    issues.push("Set NEXT_PUBLIC_ANTE_MERCHANT_ID (ante_merch_… from the dashboard).");
  }
  if (!publishableKey) {
    issues.push(
      mode === "live"
        ? "Set NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY or NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY_LIVE (ante_pk_live_*)."
        : "Set NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY_TEST (ante_pk_test_*).",
    );
  }
  if (!secret) {
    issues.push(
      "Set ANTE_SIGNING_SECRET on the server (Developers → Signing). Without it, checkout cannot sign carts.",
    );
  }
  if (!secretKey) {
    issues.push(
      mode === "live"
        ? "Set ANTE_SECRET_KEY or ANTE_SECRET_KEY_LIVE (ante_sk_live_*) on the server. Session create requires payments:write."
        : "Set ANTE_SECRET_KEY_TEST (ante_sk_test_*) on the server. Session create requires payments:write.",
    );
  }
  if (!webhookSecret) {
    issues.push(
      mode === "live"
        ? "Optional: set ANTE_WEBHOOK_SECRET or ANTE_WEBHOOK_SECRET_LIVE (whsec_…) for live group.funded events."
        : "Optional: set ANTE_WEBHOOK_SECRET_TEST (whsec_…) for test webhooks.",
    );
  }

  return Response.json({
    ok: issues.length === 0,
    mode,
    merchantId: Boolean(id),
    publishableKey: Boolean(publishableKey),
    publishableKeyMode: keyMode,
    publishableKeyLength: publishableKey.length,
    signingSecret: Boolean(secret),
    secretKey: Boolean(secretKey),
    webhookSecret: Boolean(webhookSecret),
    testKey: availability.testKey,
    liveKey: availability.liveKey,
    issues,
  });
}
