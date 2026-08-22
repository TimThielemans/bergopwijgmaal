# Sanity integration & admin roadmap

The app is deliberately frontend-only: typed mock content plus generated JSON.
Everything below describes how to connect a real CMS later without touching
components.

## 1. Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_SANITY_PROJECT_ID` | for Sanity | – | Project id; when set, the content source switches to Sanity |
| `VITE_SANITY_DATASET` | no | `production` | Dataset name |
| `VITE_SANITY_API_VERSION` | no | `2024-01-01` | API date string |
| `VITE_SANITY_STUDIO_URL` | no | `https://bergop-wijgmaal.sanity.studio` | Hosted studio URL, linked from `/admin` |
| `VITE_SANITY_USE_CDN` | no | `true` | Cached reads for public content |
| `VITE_ADMIN_ENABLED` | no | `true` | Mounts `/admin` + `/login` and the small header link |
| `VITE_ADMIN_PROVIDER` | no | – | Future auth provider id |
| `VITE_ADMIN_REDIRECT_URL` | no | `/admin` | Post-login destination |

All values are read in one place: `src/lib/config.ts`. It applies safe defaults
and logs a single clear error listing missing critical variables when the app is
configured for Sanity but incomplete. Never read `import.meta.env` elsewhere.

## 2. Connecting the CMS

1. `bun add @sanity/client @sanity/image-url`
2. Add `src/lib/providers/sanity-cms.ts` implementing the existing `CmsProvider`
   interface (`getTeams`, `getTeamBySlug`), creating the client from
   `sanityConfig` — never from literals.
3. In `src/lib/providers/index.ts`, select it based on `contentSource`:

   ```ts
   export const cmsProvider: CmsProvider =
     contentSource === "sanity" ? sanityCmsProvider : mockCmsProvider;
   ```

4. Keep the normalisation step: providers must return complete shapes
   (`players: []`, `trainings: []`, `externalRefs: {}`, …). Components rely on
   this contract and on the helpers in `src/lib/safe.ts`, so optional Sanity
   fields can never break rendering.
5. Add the app origin as a CORS origin in sanity.io/manage → API → CORS origins.

No component or route changes are needed: routes read data through
`src/lib/providers` query options only.

## 3. Volleyball data (matches & rankings)

`staticJsonMatchProvider` / `staticJsonRankingProvider` stay in place. Generated
VolleyDataParser output is committed to `src/data/matches.json` and
`src/data/rankings.json` in the documented envelope shape. Rows are joined onto
teams by `teamId` or by `sourceId` ↔ `externalRefs.volleyScoresTeamId`, and rows
that cannot be joined (or have an invalid date) are dropped rather than rendered.

## 4. Studio & admin

- `/studio` is reserved for the embedded studio. Mount it client-only there and
  configure it from `sanityConfig`.
- `/login` and `/admin` are placeholders. `src/lib/admin/auth.tsx` is the single
  auth seam: replace `signIn`, `signOut` and the session restore with the real
  provider and the rest of the app keeps working via `useAdminAuth()`.
- The current flow is **not** a security boundary — there is no backend and no
  protected data. Any future write access must be authorised server-side by the
  CMS itself.
- `/admin`, `/login` and `/studio` are `noindex, nofollow` and disallowed in
  `public/robots.txt`.
