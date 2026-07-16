# Plurel Pay Demo Store

**Live sandbox:** [https://ante-demo-store.vercel.app](https://ante-demo-store.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

**Reference implementation** for [Plurel Pay](https://plurelpay.com) merchants — a minimal Next.js storefront that shows cart signing, hosted group checkout, and webhook fulfillment. Copy patterns from this repo into your own stack; it is not a production e-commerce platform.

Official docs: [plurelpay.com/docs](https://plurelpay.com/docs)

**Repository access:** This repo is **public** — anyone can clone or fork it. Only [Plurel](https://github.com/plurel-company) organization members can push to `main`. Merchants should fork into their own GitHub account or copy files into an existing project.

## What this demonstrates

| Flow | Implementation |
| --- | --- |
| Product catalog + cart | `lib/catalog.ts`, `lib/cart.ts`, React context |
| Server-side cart signing | `POST /api/cart/sign` with `@plurel/sdk/signing` |
| Hosted checkout modal | `@plurel/react-sdk` (`PlurelButton` — CTA: **split with plurel**) |
| Test vs live credentials | Header switch + `lib/ante-credentials.ts` |
| Order fulfillment | `POST /api/webhooks/plurel` on `group.funded` |
| Setup diagnostics | `GET /api/setup/status`, `POST /api/setup/verify` |

Legacy `/api/ante/*` and `/api/webhooks/ante` routes remain as thin re-exports for existing webhook registrations.

## Quick start

```bash
cp .env.example .env.local
# Add credentials from the Plurel Pay merchant dashboard (Developers tab)

pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), add items, and click **split with plurel**.

### Sandbox test card

Use Stripe test card `4242 4242 4242 4242` inside the Plurel Pay modal. Pay every share to trigger `group.funded`.

## Architecture

```
Browser                         Next.js server                    Plurel Pay (plurelpay.com)
───────                         ──────────────                    ──────────────────────────
Cart state ──► buildPlurelCart ──► POST /api/cart/sign ──► HMAC ──► PlurelButton opens modal
                     │                    │                              │
                     │                    └── registerPendingOrder       │
                     │                                                       │
Webhook poll ◄── GET /api/orders/[ref] ◄── markOrderFunded ◄── POST /api/webhooks/plurel
```

**Fulfill on `group.funded`**, not on client callbacks alone.

### In-memory order store (demo only)

`lib/order-store.ts` keeps pending and funded orders in a **process-local `Map`**. That is fine for local dev and single-instance demos, but it is **not** production-safe:

- Restarts wipe all orders.
- Serverless / multi-instance hosts may route the webhook and the browser poll to **different** instances, so funding never appears in the UI.
- There is no cross-region durability or replay protection beyond idempotent webhook handling in this route.

**Production pattern:** persist orders in Postgres, Redis, or your OMS before opening checkout; fulfill inside the webhook with idempotent updates keyed by `order_ref` (and optionally `event.id`). The demo's fail-closed checks (registered pending order, matching credential mode, minimum `total`) should carry over unchanged.

| Pattern | Demo behavior | Production recommendation |
| --- | --- | --- |
| Cart prices | Signed server-side in `/api/cart/sign` | **Always** sign carts on your server; never trust browser prices |
| Webhook auth | Verifies against **all** configured secrets | Use separate test/live webhook secrets; do not pick secret from client headers |
| Order fulfillment | Requires a registered **pending** order + valid `total` | Fail closed on unknown `order_ref` or underpayment |
| Order store | In-memory map | Durable database with idempotent webhook handling |

See [`lib/ante-credentials.ts`](./lib/ante-credentials.ts) (`verifyPlurelWebhookSignature`) and [`app/api/webhooks/plurel/route.ts`](./app/api/webhooks/plurel/route.ts).

## Environment variables

Primary names use the `PLUREL_*` prefix. Legacy `ANTE_*` / `NEXT_PUBLIC_ANTE_*` names still work as fallbacks.

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_PLUREL_MERCHANT_ID` | Client | `plurel_merch_*` from dashboard |
| `NEXT_PUBLIC_PLUREL_PUBLISHABLE_KEY` | Client | **Live** — `plurel_pk_live_*` (Vercel Production/Preview) |
| `NEXT_PUBLIC_PLUREL_PUBLISHABLE_KEY_TEST` | Client | **Test** — `plurel_pk_test_*` for sandbox checkout |
| `NEXT_PUBLIC_SITE_URL` | Client | Origin for absolute product image URLs |
| `PLUREL_SIGNING_SECRET` | Server only | `plurel_sign_*` for cart HMAC (shared across modes) |
| `PLUREL_SECRET_KEY` | Server only | **Live** — `plurel_sk_live_*` for session create/cancel (payments:write) |
| `PLUREL_SECRET_KEY_TEST` | Server only | **Test** — `plurel_sk_test_*` for sandbox sessions |
| `PLUREL_WEBHOOK_SECRET` | Server only | **Live** — `whsec_*` for live webhook deliveries |
| `PLUREL_WEBHOOK_SECRET_TEST` | Server only | **Test** — `whsec_*` for sandbox webhooks |
| `NEXT_PUBLIC_SENTRY_DSN` | Client | Optional — Sentry error reporting (checkout failures, etc.) |

Optional aliases: `NEXT_PUBLIC_PLUREL_PUBLISHABLE_KEY_LIVE`, `PLUREL_WEBHOOK_SECRET_LIVE`, `PLUREL_SECRET_KEY_LIVE`, `SENTRY_DSN`. Legacy `ANTE_*` / `NEXT_PUBLIC_ANTE_*` equivalents are also accepted.

The browser SDK still uses the **publishable** key. Session create/cancel is proxied through `/api/plurel/v1` and authenticated upstream with the **secret** key (`payments:write`).

Use the **Test / Live** switch in the store header to pick which publishable key the SDK uses. Your choice is remembered in the browser.

Never commit real secrets. Never put signing or webhook secrets in client code.

See [`.env.example`](./.env.example) for commented templates.

## Webhooks (local dev)

Plurel Pay needs a public HTTPS URL. Use a tunnel (ngrok, Cloudflare Tunnel, etc.):

```bash
ngrok http 3000
```

Register `https://YOUR_TUNNEL/api/webhooks/plurel` in the merchant dashboard and subscribe to `group.funded`. The legacy path `/api/webhooks/ante` also works.

## Troubleshooting checkout

### `Invalid cart signature (X-Plurel-Signature)`

Plurel Pay returns this with a `details` array listing common causes. It does **not** always mean the signing secret is wrong.

1. Use **`PLUREL_SIGNING_SECRET`** (`plurel_sign_…`) — not `plurel_sk_…` or `whsec_…`.
2. Copy the **full** secret, redeploy after env changes, and update immediately if you rotated in the dashboard.
3. Sign with **`createCartSignature`** from `@plurel/sdk/signing` (**≥ 1.0.0**). Plurel Pay always includes `fees: []` in the HMAC when the cart has no custom fees.
4. Re-sign at checkout click if the cart changed after signing.

Docs: [Cart signing](https://plurelpay.com/docs/cart-signing) · [Troubleshooting](https://plurelpay.com/docs/troubleshooting)

Use **Verify credentials** on the storefront, or:

```bash
curl -X POST http://localhost:3000/api/setup/verify \
  -H "x-plurel-key-mode: sandbox"
```

### `PLUREL_SIGNING_SECRET is not configured`

Add the server env var on your deployment. Local dev: copy `.env.example` → `.env.local`.

### `API key missing scope: payments:write`

Publishable keys (`plurel_pk_*`) are read-only. Session create needs `payments:write`, which only secret keys (`plurel_sk_*`) have. Add `PLUREL_SECRET_KEY_TEST` (sandbox) and/or `PLUREL_SECRET_KEY` (live) on the server. This demo proxies `/api/plurel/v1/sessions` and swaps in the secret key upstream — the browser never sees it.

## Project layout

```
app/
  page.tsx                      # Storefront shell + credential gate
  api/cart/sign/route.ts        # Cart HMAC signing
  api/setup/status/route.ts     # Env configuration check
  api/setup/verify/route.ts     # Probe Plurel Pay credentials
  api/webhooks/plurel/route.ts  # Webhook verification + fulfillment
  api/plurel/v1/[...path]/route.ts # Same-origin session proxy
  api/orders/[orderRef]/route.ts # Order status polling
components/
  plurel-mode-provider.tsx      # Test/live key switch context
  ui/format-usd.ts              # Shared USD display helper
  store/                        # Product cards (UI agents)
lib/
  types.ts                      # Shared TypeScript types
  catalog.ts                    # Demo product catalog
  cart.ts                       # Cart → Plurel payload builders
  store.ts                      # Barrel re-export
  cart-signing.ts               # SDK signing re-export
  ante-credentials.ts           # Test/live env resolution
  ante-env.ts                   # Key parsing + error messages
  order-store.ts                # In-memory pending/funded orders
hooks/use-order-funding-poll.ts  # Poll until webhook marks funded
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit tests (`lib/*.test.ts`) |

## Deploy

Works on Vercel or any Node 20+ host. Set the same env vars in your deployment dashboard.

## Contributing

This is a reference implementation maintained by Plurel. The repo is public for **read and clone**; direct pushes to `main` are limited to Plurel org maintainers. If you are integrating Plurel Pay in your own stack, fork the repo or copy patterns into your codebase. PRs from forks that improve integration clarity are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Links

- [Getting started](https://plurelpay.com/docs/getting-started)
- [JavaScript SDK](https://plurelpay.com/docs/sdk)
- [Cart signing](https://plurelpay.com/docs/cart-signing)
- [Webhooks](https://plurelpay.com/docs/webhooks)
- [@plurel/sdk on npm](https://www.npmjs.com/package/@plurel/sdk)
