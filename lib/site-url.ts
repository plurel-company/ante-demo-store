/** Canonical production origin for Split Shop. */
export const PRODUCTION_SITE_URL = "https://splitshop.dev";

/**
 * Resolves the public site origin for metadata and absolute asset URLs.
 * Prefers NEXT_PUBLIC_SITE_URL, then the current Vercel deployment host on
 * non-production deploys, then the production canonical URL.
 */
export function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const vercelEnv = process.env.VERCEL_ENV;
  const vercelHost = process.env.VERCEL_URL?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  // Preview / local Vercel deploys should not advertise production.
  if (vercelHost && vercelEnv !== "production") {
    return `https://${vercelHost}`;
  }

  return PRODUCTION_SITE_URL;
}
