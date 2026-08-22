# Fix: Sanity content is not reaching the site

Two separate causes, both verified. Note up front: this is **not** a CORS issue — the tests below were run server-side with no `Origin` header at all, so the CORS allowlist never applies to them.

## Exact evidence (re-run at 20:22)

- **projectId**: `utlbxtd6`
- **dataset**: `production` (only dataset in the project; management API reports `aclMode: public`)
- **apiVersion**: `2024-01-01`

Query executed (identical to `TEAMS_QUERY` in `src/lib/sanity/queries.ts`):

```text
*[_type == "team" && defined(teamId)]{teamId,"slug":slug.current,name}
```

Response, `GET https://utlbxtd6.api.sanity.io/v2024-01-01/data/query/production` (no token), HTTP 200:

```json
{"query":"*[_type == \"team\" && defined(teamId)]{...}","result":[],"syncTags":["s1:FnjUcw"],"ms":6}
```

Same empty result on `apicdn.sanity.io`. Single-document fetch is explicit about why:

```json
GET /v2024-01-01/data/doc/production/team.dames-a  ->  HTTP 200
{"documents":[],"omitted":[{"id":"team.dames-a","reason":"permission"}]}
```

The same query **with** the MCP connector's authenticated session returns the data: 7 published team documents (`team.dames-a`, `team.dames-b`, `team.dames-recrea`, …), 0 drafts, 0 release versions, 28 published documents in total across `team`, `location`, `activity`, `sponsor`, `boardMember`, `clubInfo`.

So: there is no error message and no HTTP failure. Sanity silently strips every document from a token-less read (`reason: "permission"`). An authenticated read is required, regardless of the dataset ACL and regardless of CORS.

Second, independent cause:

- **There is no `.env` file** in the project — only `.env.example`. So `VITE_SANITY_PROJECT_ID` is undefined at runtime, `sanityConfig.enabled` is `false`, `contentSource` stays `"mock"`, and the Sanity provider is never even selected. That is why you also never saw a query error in the browser: no query is being made.


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
