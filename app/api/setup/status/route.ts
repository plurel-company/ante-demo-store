import { publishableKeyMode } from "@/lib/ante-env";

export async function GET() {
  const merchantId = process.env.NEXT_PUBLIC_ANTE_MERCHANT_ID?.trim() ?? "";
  const publishableKey = process.env.NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY?.trim() ?? "";
  const signingSecret = process.env.ANTE_SIGNING_SECRET?.trim() ?? "";
  const webhookSecret = process.env.ANTE_WEBHOOK_SECRET?.trim() ?? "";
  const keyMode = publishableKeyMode(publishableKey);

  const issues: string[] = [];

  if (!merchantId) {
    issues.push("Set NEXT_PUBLIC_ANTE_MERCHANT_ID (ante_merch_… from the dashboard).");
  } else if (!merchantId.startsWith("ante_merch_")) {
    issues.push("Merchant ID should start with ante_merch_.");
  }

  if (!publishableKey) {
    issues.push("Set NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY (ante_pk_test_… sandbox key).");
  } else if (!keyMode) {
    issues.push("Publishable key should start with ante_pk_test_ (sandbox) or ante_pk_live_.");
  } else if (keyMode === "live") {
    issues.push(
      "This demo expects sandbox keys (ante_pk_test_*). Live keys only work for merchants in live mode with payout setup complete.",
    );
  }

  if (!signingSecret) {
    issues.push(
      "Set ANTE_SIGNING_SECRET on the server (Developers → Signing). Without it, checkout cannot sign carts.",
    );
  } else if (!signingSecret.startsWith("ante_sign_")) {
    issues.push("ANTE_SIGNING_SECRET should start with ante_sign_.");
  }

  if (!webhookSecret) {
    issues.push("Optional: set ANTE_WEBHOOK_SECRET (whsec_…) to receive group.funded events.");
  }

  return Response.json({
    ok: issues.length === 0,
    merchantId: Boolean(merchantId),
    publishableKey: Boolean(publishableKey),
    publishableKeyMode: keyMode,
    signingSecret: Boolean(signingSecret),
    webhookSecret: Boolean(webhookSecret),
    issues,
  });
}
