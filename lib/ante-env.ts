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
    return "Publishable key is invalid or revoked. Create a new key in the dashboard and paste the full value (not just the prefix).";
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
    return "Your API key and cart signature were accepted, but Ante failed to create the session on splitante.com (server internal auth). Set ANTE_INTERNAL_SECRET (or ANTE_INTERNAL_WRITE_SECRET) to the same value on splitante.com Vercel and Convex, then redeploy ante-web.";
  }

  if (status === 401) {
    return "Authentication failed — confirm merchant ID, publishable key, and signing secret are from the same Ante merchant.";
  }

  return apiError;
}
