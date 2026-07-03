/** Same-origin proxy for the Ante sessions API.
 *
 *  Some devices block cross-site fetch outright (content blockers, lockdown
 *  modes, filtered networks) — the browser reports `TypeError: Load failed`
 *  before the request leaves the device. Routing the SDK through this
 *  same-origin path removes the cross-site request entirely; the forward to
 *  splitante.com happens server-side, which is never blocked. */

const UPSTREAM = "https://splitante.com/api/v1";
/** Only the session endpoints the storefront SDK actually uses. */
const ALLOWED_PATH = /^sessions(\/|$)?/;
const FORWARD_HEADERS = [
  "authorization",
  "content-type",
  "x-merchant-id",
  "x-ante-signature",
  "x-ante-cart-signature",
  "x-ante-sdk-version",
  "x-ante-react-sdk-version",
];

type RouteParams = { params: Promise<{ path: string[] }> };

async function forward(request: Request, { params }: RouteParams) {
  const { path } = await params;
  const joined = (path ?? []).join("/");
  if (!ALLOWED_PATH.test(joined)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const search = new URL(request.url).search;
  const headers = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const upstream = await fetch(`${UPSTREAM}/${joined}${search}`, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}

export async function GET(request: Request, ctx: RouteParams) {
  return forward(request, ctx);
}

export async function POST(request: Request, ctx: RouteParams) {
  return forward(request, ctx);
}
