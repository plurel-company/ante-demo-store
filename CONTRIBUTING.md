# Contributing

Thank you for improving the Ante demo store. This project is a **reference implementation** for merchants integrating [Ante](https://splitante.com) — keep changes focused on clarity and correctness, not production storefront features.

## Getting started

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Run `pnpm typecheck` before opening a pull request.

## What to change

- **Backend integration** (`lib/`, `app/api/`) — cart signing, webhooks, credential helpers
- **Docs** — README, env examples, troubleshooting
- **Small shared utilities** (`components/ui/`) — formatting helpers, not layout redesigns

## What to avoid

- Large visual redesigns without discussion (UI agents may be working in parallel)
- Breaking changes to cart signing canonicalization or webhook verification
- Committing secrets or real merchant credentials

## Pull requests

1. Describe the merchant-facing behavior you changed (or document-only updates).
2. Confirm checkout still works in **Test** mode with sandbox credentials.
3. Link related [Ante docs](https://splitante.com/docs) when adding integration patterns.

Questions? Open an issue on GitHub.
