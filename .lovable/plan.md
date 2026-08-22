# Fix: Sanity content is not reaching the site

You are right on the first point, and there is a second, deeper cause. Both are verified.

## What I verified just now

1. **There is no `.env` file** in the project — only `.env.example`. So `VITE_SANITY_PROJECT_ID` is undefined at runtime, `sanityConfig.enabled` is `false`, `contentSource` stays `"mock"`, and the Sanity provider is never selected. Confirmed by listing the project root.
2. **The content is in Sanity and published.** Dataset `production` of project `utlbxtd6` contains 28 published documents (`team`, `location`, `activity`, `sponsor`, `boardMember`, `clubInfo`) and 0 drafts. Team ids look like `team.dames-a`.
3. **Anonymous (token-free) reads are refused**, even though the dataset ACL is `public`:
   - `GET /data/query/production` for `*[_type=="team"]` returns `result: []` (no error).
   - `GET /data/doc/production/team.dames-a` returns `omitted: [{ reason: "permission" }]`.

   So even after fixing `.env`, a browser-side `@sanity/client` with no token would render empty content. The project requires an authenticated read.

## Proposed fix — two steps

### Step 1: real environment file

Create `.env` (git-ignored) alongside `.env.example`:

```
VITE_SANITY_PROJECT_ID=utlbxtd6
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_USE_CDN=true
VITE_SANITY_STUDIO_URL=
VITE_ADMIN_ENABLED=true
```

`.env.example` stays as the documented template (no ids). This alone flips `contentSource` to `"sanity"`.

### Step 2: read content through a server function with a viewer token

Because the project denies anonymous reads, the token cannot live in the browser bundle. Minimal-change approach, no database, no auth system:

- Add a Sanity **Viewer** read token as a project secret, `SANITY_READ_TOKEN` (server-only, never `VITE_`-prefixed).
- Add `src/lib/sanity/fetch.functions.ts`: one `createServerFn` (`sanityFetch`) taking `{ query, params }`, executing it against `https://<projectId>.api.sanity.io` with the token read inside the handler, and returning the raw result.
- `src/lib/providers/sanity-cms.ts` keeps its current shape and GROQ queries; only the transport swaps from the browser client to `sanityFetch`. All existing fallbacks to mock content stay, so an expired/absent token degrades to the current behaviour instead of an empty site.
- `src/lib/sanity/client.ts` remains for `@sanity/image-url` URL building (image URLs on a public dataset need no token).

No component, route or data-model changes.

### Alternative (only if you prefer zero token)

In sanity.io/manage → project → API → check whether the project has token-only/restricted read enabled and switch it off. If public anonymous reads start working, Step 2 is unnecessary and the existing browser client works as originally designed. I can retest that in seconds after you toggle it.

## Verification after building

- Print the resolved config at startup (project id + selected source) and confirm `contentSource === "sanity"`.
- Browser pass over `/`, `/ploegen`, one team detail page, `/club`, `/contact` to confirm the rendered team names/levels come from Sanity (e.g. by changing one team title in the Studio and seeing it appear).
- Confirm no token value ends up in the client bundle.
