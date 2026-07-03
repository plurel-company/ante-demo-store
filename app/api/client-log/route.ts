/** POST /api/client-log — temporary checkout-failure telemetry.
 *  Same-origin so it works even when cross-origin API calls fail on-device;
 *  entries land in Vercel runtime logs. Remove once the mobile failure is solved. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    console.error("[client-error]", JSON.stringify(body).slice(0, 2000));
  } catch {
    console.error("[client-error] unparseable payload");
  }
  return new Response(null, { status: 204 });
}
