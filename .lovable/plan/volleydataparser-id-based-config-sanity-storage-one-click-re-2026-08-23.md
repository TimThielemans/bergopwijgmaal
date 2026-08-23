# VolleyDataParser — ID-based config, Sanity storage & one-click refresh

## 1. Analyse of the uploaded PHP

`get_and_convert_xls_files.php`:

1. A hardcoded `$xlsurls` map (VolleyScores URL -> local filename), manually split
   into match files and ranking files. The sample URLs point to another club (Osta
   Berchem) and the rankings TODO is unresolved.
2. Downloads each URL with `fopen`/`file_put_contents`, then a blind `sleep(13)`.
3. Converts each file with PhpSpreadsheet: active sheet to array, take a header
   row, map every following row to `{header: value}`, write one JSON per XLS.

`convert.php` is the same conversion for one test file.

Details worth preserving:

- **Matches use header row index 0; rankings use header row index 1** (ranking
  exports carry an extra title row).
- Rows are keyed by the exact Dutch VolleyScores column headers.
- The URLs are fully deterministic: only `ci` (club), `ti` (team) and `ssi`
  (series) vary; `a=me` gives matches, `a=re` gives the ranking.

Removed: hardcoded URLs, per-team files, temp files, the blind sleep, no error
handling, no team identity in the output.

PHP cannot run on this stack. Both files are committed to `docs/legacy/` as
reference documentation only, with a README stating they are never executed.

## 2. ID-based parser configuration

`team.parserData` in Sanity replaces the URL fields. Everything except
`parserEnabled` is optional (and ignored) when the parser is off:

```ts
{
  parserEnabled: boolean;
  volleyClubId?: string;    // ci
  volleyTeamId?: string;    // ti
  volleySeriesId?: string;  // ssi
  competitionCode?: string;
  divisionCode?: string;
}
```

No full VolleyScores URLs are stored anywhere. A shared builder is the single
source of truth:

```ts
// src/lib/parser/urls.ts
buildMatchesExportUrl({ clubId, teamId, seriesId })
// https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&a=me&ci=..&ti=..&ssi=..&f=1&lng=nl

buildRankingExportUrl({ seriesId })
// https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&a=re&ssi=..&f=1&lng=nl
```

The public "Volledig overzicht" link on the team page is derived from the same
ids through the same module, so nothing needs a stored URL. Teams missing a
required id are reported as a configuration error instead of being fetched.

Migration: the Sanity `parser`/`parserData` object type is redeployed with the
new fields, the existing team documents get their ids filled in, and the local
mock `ParserRecord` type in `src/content/types.ts` +
`src/content/sheets/parser-data.ts` is updated to the same ID-based shape so the
fallback content stays consistent.

## 3. Target flow

```text
Sanity team.parserData (ci/ti/ssi)
        |
        v
refreshVolleyData (admin button)   <---- same runner called by cron route
        |- buildMatchesExportUrl -> fetch -> parse sheet (header row 0)
        |- buildRankingExportUrl -> fetch -> parse sheet (header row 1)
        v
Sanity singletons volleyMatchesRaw / volleyRankingsRaw   (write token)
        |
        v
website reads them server-side (adapter step) -> live update, no redeploy
```

## 4. Sanity storage — structured, not stringified

Two singleton documents, written with `createOrReplace` on a fixed `_id` so a
refresh is idempotent and Studio keeps revision history for rollback.

```text
volleyMatchesRaw / volleyRankingsRaw
  generatedAt: datetime
  source: string
  teamCount, rowCount: number
  blocks: [ rawTeamBlock ]
  errors: [ { teamId, kind, message } ]

rawTeamBlock
  teamId        (always present — every block carries its originating team)
  slug, teamName
  volleyClubId, volleyTeamId, volleySeriesId
  competitionCode, divisionCode
  sourceUrl     (built at run time, stored for traceability only)
  rows: [ rawRow ]

rawRow
  teamId        (repeated on every row, so rows stay attributable when flattened)
  cells: [ { key: string, value: string } ]   // key = original Dutch column header
```

`cells` as key/value pairs is what keeps this *structured* while still tolerating
arbitrary VolleyScores column headers — Sanity documents cannot hold free-form
object keys, and this avoids a stringified blob that Studio can't show. TypeScript
helpers (`rowToRecord`, `recordToCells`) convert between `cells` and a plain
`Record<string, string>` so the later adapter works with ordinary objects.

Writes need a new **server-only** secret `SANITY_WRITE_TOKEN` (Editor role), read
inside the handler and never `VITE_`-prefixed.

## 5. Refresh triggers

- **Admin button** on `/admin/volleydata`: "Volley-data verversen", showing the
  last run timestamp, per-team row counts and any errors (including teams with
  `parserEnabled` but missing ids).
- **Scheduled refresh**: `src/routes/api/public/refresh-volley-data.ts` (`POST`)
  requiring an `x-cron-secret` header compared timing-safely against a new
  `CRON_SECRET`; it calls the same runner. Configure a nightly call to
  `https://project--<id>.lovable.app/api/public/refresh-volley-data`.

Both paths share one server-only module, so behaviour cannot drift.

## 6. Files

| File | Purpose |
| --- | --- |
| `src/lib/parser/urls.ts` | `buildMatchesExportUrl`, `buildRankingExportUrl`, id validation |
| `src/lib/parser/types.ts` | `RawRow`, `RawTeamBlock`, `RawEnvelope`, `RefreshResult`, cell helpers |
| `src/lib/parser/sheet.server.ts` | download + SheetJS -> rows (header row index param) |
| `src/lib/parser/refresh.server.ts` | shared runner: read config, parallel fetch, build blocks, write singletons |
| `src/lib/parser/refresh.functions.ts` | `refreshVolleyData` + `getVolleyDataStatus` server fns |
| `src/lib/sanity/write.server.ts` | `createOrReplace` mutation with `SANITY_WRITE_TOKEN` |
| `src/lib/sanity/queries.ts` | `PARSER_TEAMS_QUERY` (ids only), `VOLLEY_RAW_STATUS_QUERY` |
| `src/content/types.ts`, `src/content/sheets/parser-data.ts` | ID-based `ParserRecord` |
| `src/components/teams/TeamDetail.tsx` | calendar link built from ids instead of a stored URL |
| `src/routes/admin.volleydata.tsx` | refresh button, per-team result, last-run info |
| `src/routes/admin.index.tsx` | extra card linking to `/admin/volleydata` |
| `src/routes/api/public/refresh-volley-data.ts` | secret-protected cron endpoint |
| `docs/legacy/` | the two PHP files + README (reference only) |
| `docs/volleydata-parser.md` | architecture, ids, secrets, cron setup |

Dependency: `bun add xlsx` (pure JS, worker-safe, also reads the HTML-table "xls"
responses VolleyScores sometimes returns).

## 7. Scope of this step vs next

This step: ID-based config, parser, Sanity storage, admin button, cron endpoint.
The website still renders matches/rankings from `src/data/*.json`, so the visible
site is unchanged apart from the calendar link source.

Next step (separate approval): the adapter that maps raw blocks onto the existing
`Match` / `RankingEntry` shapes and lets `matchProvider` / `rankingProvider` read
the Sanity singletons, with the committed JSON as fallback. From then on the admin
button visibly refreshes the site.

## 8. Security

- `SANITY_WRITE_TOKEN` and `CRON_SECRET` are server-only, read inside handlers.
- URLs are built from ids by our own builder and pinned to
  `https://www.volleyscores.be`, so no user-supplied URL is ever fetched — the
  endpoint cannot be abused as a proxy.
- `/admin/*` stays `noindex, nofollow` behind the existing admin gate; the cron
  route returns 401 without the secret and never returns data.
- No database, no personal data.
