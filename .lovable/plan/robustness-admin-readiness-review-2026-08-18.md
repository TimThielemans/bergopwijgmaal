# Robustness & admin-readiness review

Three deliverables: defensive rendering everywhere, a lightweight admin/login foundation, and environment-driven configuration for the future Sanity connection. No CMS, database, or real auth backend is added.

## Part 1 — Defensive programming & graceful degradation

### Shared utilities (new)

- `src/lib/safe.ts` — small helpers used across components:
  - `list(value)` → always returns an array (`[]` for `undefined`/`null`/non-array).
  - `text(value, fallback)` → trimmed string or a Dutch fallback.
  - `isFilled(value)` → guard for "is there meaningful data here".
- `src/components/shared/EmptyState.tsx` — one consistent, branded empty-state block (icon + message, optional hint) replacing the ad-hoc `<p class="py-10 …">` messages currently duplicated in the home matches section and team detail.
- `src/components/shared/SafeImage.tsx` — renders an image only when `url` and `alt` exist, falls back to `BrandTile`/`BrandGraphic`, and swaps to the fallback on `onError` so a dead CMS asset URL never leaves a broken image.

### Data layer hardening

- `src/lib/providers/mock-cms.ts` and `static-json.ts`: normalize rows on read so components always receive complete shapes — `trainings: []`, `players: []`, `form: []`, `externalRefs: {}`, numeric ranking fields defaulted, invalid `dateTime` values dropped instead of producing `Invalid Date`.
- `src/lib/format.ts`: date/time helpers return `"—"` (or `null` for the "last updated" line) instead of throwing on missing or unparsable input.
- Sorting/joining keeps working when `order`, `seasonId`, or `sourceId` are absent.

### Component-by-component fallbacks

- **TeamDetail**: coach → "Coach nog niet gekend"; assistant coach omitted when absent; trainings → empty state; squad → "Nog geen spelers beschikbaar"; stats row hides counts it cannot compute; ranking block already conditional, keeps a friendly message; "Volledig overzicht" button only with a valid `calendarUrl`; photo via `SafeImage`.
- **TeamCard / team listing / home teams overview**: tolerate missing photo, level, description; skip malformed team entries; hide category groups with no teams (already partly done).
- **MatchRow**: no team match → renders opponent as plain text instead of a broken link; missing venue/competition/result segments are omitted, not rendered empty.
- **Upcoming matches, rankings, activities, sponsors sections**: each hides itself or shows an empty state when its collection is empty; rankings skips entries whose team is unknown; sponsors skip entries without a website URL and use the logo fallback.
- **Layout (header, footer, contact, map placeholder, social links)**: guard optional club fields (socials, phone, email, venue address) so an incomplete CMS record does not blank the chrome.
- **News/articles**: no such feature exists in the app today, so nothing to harden there; the utilities above will cover it when it is added.

### SSR/client stability

- Fix the current hydration warning: the inline `data-js="ready"` script in `src/routes/__root.tsx` mutates `<html>` before hydration. Replace it with a hydration-safe approach (set the attribute from an effect / mark the script so it is not part of the diffed tree) so server and client HTML match.
- No `window`/`document` access during render; all reveal/count-up behaviour stays inside effects.

## Part 2 — Admin foundation

- `src/lib/admin/auth.tsx` — isolated auth module: an `AdminAuthProvider` + `useAdminAuth()` exposing `isAuthenticated`, `signIn`, `signOut`. Placeholder implementation, session kept in memory + `sessionStorage`, with a single documented seam where a real provider (Sanity/OAuth) plugs in later. No secrets, no real credential check, clearly marked as placeholder.
- `src/routes/admin.tsx` — layout route: renders `<Outlet />`, `noindex, nofollow`, and redirects to `/login` (client-side, after hydration) when not authenticated.
- `src/routes/admin.index.tsx` — placeholder dashboard: cards for Ploegen / Activiteiten / Sponsors / Clubinfo marked "binnenkort via Sanity", plus a link to the reserved `/studio` route and a sign-out button.
- `src/routes/login.tsx` — minimal branded placeholder login form, `noindex`, redirects to `/admin` when already signed in.
- `src/components/layout/SiteHeader.tsx` — a very small, low-contrast "Login" (or "Beheer" when signed in) link in the header's far corner and at the bottom of the mobile menu; deliberately unobtrusive.
- `public/robots.txt` — disallow `/admin`, `/login`, `/studio`.
- Admin is only mounted/visible when `VITE_ADMIN_ENABLED` is true.

## Part 3 — Environment configuration

- `src/lib/config.ts` — single typed config module reading `import.meta.env`, with safe defaults (`dataset: "production"`, `apiVersion: "2024-01-01"`, `useCdn: true`, `adminEnabled: false`), a `sanityEnabled` flag, and validation that logs one clear startup error listing missing critical variables (only when a Sanity-backed provider is actually selected — the app must still run fully on mock/JSON data with no `.env`).
- `.env.example` with every variable documented: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`, `VITE_SANITY_STUDIO_URL`, `VITE_SANITY_USE_CDN`, `VITE_ADMIN_ENABLED`, `VITE_ADMIN_PROVIDER`, `VITE_ADMIN_REDIRECT_URL`.
- No CMS values hardcoded anywhere; the reserved `/studio` route links to `VITE_SANITY_STUDIO_URL` when set.
- `docs/sanity-integration.md` — short guide: which env vars to fill, where to add the Sanity client, that only `mock-cms.ts` gets replaced (components untouched), how the auth seam becomes real login, and how the JSON match/ranking providers stay in place.

## Technical notes

- Purely frontend: no server functions, no database, no external services. Placeholder auth is explicitly not a security boundary — documented in the code and in the integration guide.
- Verification after implementation: typecheck plus a browser pass over `/`, `/ploegen`, a team detail page, `/club`, `/contact`, `/login`, `/admin`, including a temporary stripped-down team record to prove the empty states render instead of crashing.
