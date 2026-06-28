# Ante Demo Store

Minimal Next.js storefront that demonstrates [Ante](https://splitante.com) group checkout with the official SDK.

- Shop UI with a tiny product catalog and cart
- Server-side cart signing (`POST /api/cart/sign`)
- Hosted Ante checkout modal via `@splitante/react-sdk`
- Webhook handler for `group.funded` (`POST /api/webhooks/ante`)

Docs: https://splitante.com/docs

## Quick start

```bash
cp .env.example .env.local
# Add credentials from the Ante merchant dashboard (Developers tab)

npm install
npm run dev
```

Open http://localhost:3000, add items, and click **Pay with Ante**.

### Sandbox test card

Use Stripe test card `4242 4242 4242 4242` inside the Ante modal. Pay every share to trigger `group.funded`.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_ANTE_MERCHANT_ID` | Client | `ante_merch_*` from dashboard |
| `NEXT_PUBLIC_ANTE_PUBLISHABLE_KEY` | Client | `ante_pk_test_*` publishable key |
| `ANTE_SIGNING_SECRET` | Server only | `ante_sign_*` for cart HMAC |
| `ANTE_WEBHOOK_SECRET` | Server only | `whsec_*` from Webhooks tab |

Never commit real secrets. Never put signing or secret keys in client code.

## Webhooks (local dev)

Ante needs a public HTTPS URL. Use a tunnel (ngrok, Cloudflare Tunnel, etc.):

```bash
ngrok http 3000
```

Register `https://YOUR_TUNNEL/api/webhooks/ante` in the merchant dashboard and subscribe to `group.funded`.

Fulfill orders on `group.funded`, not on client callbacks alone.

## Project layout

```
app/
  page.tsx                 # Storefront
  api/cart/sign/route.ts   # Cart signing
  api/webhooks/ante/       # Webhook verification
components/                # Cart + checkout UI
lib/store.ts               # Products and cart helpers
```

## Deploy

Works on Vercel or any Node 20+ host. Set the same env vars in your deployment dashboard.

## Links

- [Getting started](https://splitante.com/docs/getting-started)
- [JavaScript SDK](https://splitante.com/docs/sdk)
- [Cart signing](https://splitante.com/docs/cart-signing)
- [Webhooks](https://splitante.com/docs/webhooks)
- [@splitante/sdk on npm](https://www.npmjs.com/package/@splitante/sdk)
