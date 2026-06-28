export type AnteKeyMode = "sandbox" | "live" | null;

export function publishableKeyMode(key: string | undefined): AnteKeyMode {
  if (!key) return null;
  if (key.startsWith("ante_pk_test_")) return "sandbox";
  if (key.startsWith("ante_pk_live_")) return "live";
  return null;
}

export function anteEnvironmentFromKey(key: string): "sandbox" | "production" {
  return publishableKeyMode(key) === "live" ? "production" : "sandbox";
}

export function explainAnteApiError(status: number, apiError: string): string {
  if (apiError.includes("Invalid cart signature")) {
    return "Signing secret mismatch — update ANTE_SIGNING_SECRET from Ante → Developers → Signing and redeploy.";
  }

  if (apiError.includes("Invalid or revoked API key") || apiError.includes("Invalid API key format")) {
    return "Publishable key is invalid or revoked. Create a new sandbox key in the dashboard and paste the full key (not just the prefix).";
  }

  if (apiError.includes("X-Merchant-ID does not match")) {
    return "Merchant ID does not match the publishable key. Use the ante_merch_* ID from the same merchant account.";
  }

  if (apiError.includes("does not match merchant mode")) {
    return "Key mode mismatch — use ante_pk_test_* for sandbox merchants or ante_pk_live_* for live merchants.";
  }

  if (apiError.includes("Set up payouts")) {
    return "Finish payout setup in the Ante merchant dashboard before accepting payments.";
  }

  if (apiError === "Unauthorized" && status === 401) {
    return "Ante accepted your API key and cart signature, but session creation failed on splitante.com (internal auth). Ensure SHOPIFY_INTERNAL_WRITE_SECRET matches on Vercel and Convex, or redeploy ante-web after the platform fix.";
  }

  if (status === 401) {
    return "Authentication failed — confirm merchant ID, publishable key, and signing secret are from the same Ante merchant.";
  }

  return apiError;
}
