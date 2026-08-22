# Fix: Sanity config missing in the published deployment

## What's happening

Verified in this project:

- `.env` exists locally but `.gitignore` contains `.env` — so the file is **not** part of the repository and is **not** part of the published build.
- `src/lib/config.ts` reads `VITE_SANITY_PROJECT_ID` from `import.meta.env` with **no fallback**, and `contentSource` is `"sanity"` only when that value is non-empty.

Consequence for the published deployment:

```text
sanityConfig.projectId = ""            (empty)
sanityConfig.dataset   = "production"  (default in config.ts)
contentSource          = "mock"
```

In preview it works because the sandbox has the real `.env` on disk.

Answer to the direct question: the published runtime does **not** receive `.env`
(gitignored, never uploaded). It does receive **runtime secrets** (e.g.
`SANITY_READ_TOKEN`) inside server code, but those are server-only and are not
`VITE_*` build variables.

## Fix

`projectId`, `dataset`, `apiVersion` and the Studio URL are public, non-secret
values. Make them committed defaults so any checkout (GitHub, Vercel, Lovable
publish) works without a local `.env`, while `.env` can still override them.

1. In `src/lib/config.ts`, add fallbacks:
   - `projectId`: `VITE_SANITY_PROJECT_ID` or `"utlbxtd6"`
   - `dataset`: unchanged default `"production"`
   - `apiVersion`: unchanged default `"2024-01-01"`
   - `studioUrl`: fallback `"https://bergop-wijgmaal.sanity.studio"`
2. Keep `SANITY_READ_TOKEN` server-only: read inside the `sanityFetch` handler
   (already the case) and stored as a project secret, never as `VITE_*`.
   Confirm the secret is set for the published environment; if not, add it.
3. Add a tiny diagnostics block to `/admin` (admin-only, already `noindex`)
   showing `contentSource`, `projectId`, `dataset` and whether the server read
   succeeded — so the exact runtime values are visible on any deployment
   instead of being guessed.
4. Update `.env.example` and `docs/sanity-integration.md`: the Sanity values are
   now built-in defaults; `.env` is optional and only overrides them. Document
   that `SANITY_READ_TOKEN` must be configured as a hosting env var on Vercel
   for a portable self-hosted deploy.

## Verification

- Rebuild and check `/admin` diagnostics report `sanity` + `utlbxtd6` + `production`.
- Confirm a Sanity-only value (e.g. a team's short description edited in Studio)
  renders on `/ploegen` in the published deployment, not the mock text.

## Notes

No schema, database or backend service changes. Only config defaults, one admin
diagnostics panel, and documentation.
