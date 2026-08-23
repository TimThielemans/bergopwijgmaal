# Adapter layer: raw VolleyScores data → frontend model

The raw documents stay exactly as they are. `volleyMatchesRaw` and `volleyRankingsRaw`
remain the source of truth for the parser output; nothing in the parser output shape changes.
A new adapter layer sits between them and the existing `Match` / `RankingEntry` model that
`matches.json` / `rankings.json` currently supply.

## Current state (verified)

- `volleyMatchesRaw`: 90 rows across 4 team blocks, generated 23/08 18:38. Columns per row:
  `Reeks, Wedstrijdnr, Datum (19/09/2026), Uur (16:30), Thuis, Bezoekers, Sporthall, Uitslag,
  Setstanden, Uitslag reserven, Setstanden reserven, Uitgesteld`.
  Each block contains only the matches of that team (home + away), not the full series.
- `volleyRankingsRaw`: still 0 rows — it is preseason, so no ranking is published yet for the
  current series. `se=13` stays in the ranking URL; nothing about the URL builder is changed.
- Validation happens against the Heren A test export (last season, `se=12`, `ti=96174`),
  which returns a real ranking sheet: title row 0, header row 1
  (`Ploeg, Ptn, # Wed, Gew. 3-0/3-1, Gew. 3-2, Verl. 3-0/3-1, Verl. 3-2, Gew. sets,
  Verl. sets, Forfaits`), position in column 0 as `01. `, `05a. ` (ties possible).
  After the main table come two blank rows, a `… (reserven)` title and a second table with
  header `Reserve` — the **reserve classement, which is ignored**.


## 1. Adapter layer

New folder `src/lib/adapters/` — pure, side-effect-free functions, unit-testable,
no Sanity and no fetch inside:

| File | Responsibility |
| --- | --- |
| `columns.ts` | Column-name lookup: tolerant matching of the Dutch headers (case/accents/typos such as `Sporthall`), so a renamed column does not silently drop data. |
| `dates.ts` | `19/09/2026` + `16:30` → ISO date-time in `Europe/Brussels` (correct DST offset), plus validity checks. |
| `scores.ts` | `Uitslag` (`3-1`) → `setsFor`/`setsAgainst` from the club's perspective; `Setstanden` (`25-20 22-25 …`) → `scoreLine`. |
| `teams.ts` | Team matching: raw `Thuis`/`Bezoekers` strings → our own team (`isHome`, opponent name), and venue matching of `Sporthall` onto the `location` documents with a text fallback. |
| `matches.ts` | `RawTeamBlock[]` → `Match[]`: stable `id` from `Wedstrijdnr`, `status` (`played` when a result exists, `postponed` when `Uitgesteld` is filled, otherwise `scheduled`), `competition` from `Reeks`, `sourceId`. |
| `rankings.ts` | Ranking rows → `RankingEntry[]`: **only the main classement** — reading stops at the first blank row after the main table, so the `(reserven)` block and its `Reserve` header row are never imported. Position from `01. ` / `05a. ` (letters stripped, ties kept), `points` from `Ptn`, `played` from `# Wed`, `won` = `Gew. 3-0/3-1` + `Gew. 3-2`, `lost` = `Verl. 3-0/3-1` + `Verl. 3-2`, `setsFor`/`setsAgainst` from `Gew./Verl. sets`, `division` from the title row. Only the row matching our own club name becomes a `RankingEntry`; the full table is kept available for a possible later series view. `form` is derived from the last five played matches of that team in the adapted matches, oldest first. |
| `index.ts` | `adaptVolleyData({ matchesRaw, rankingsRaw, teams, venues, seasonId })` → `{ matches, rankings, generatedAt, warnings }`. |

Rules that apply everywhere: never throw, drop a row instead and collect a warning;
only keep rows that can be attributed to a known `teamId`; sort matches ascending by date.

## 2. Wiring it into the site

- `src/lib/providers/sanity-volley.ts`: new provider implementing `MatchProvider` and
  `RankingProvider`. Reads both raw singletons server-side (existing `read.server.ts` +
  a server function, same pattern as the CMS provider), runs the adapter, caches the
  result per request.
- `src/lib/providers/index.ts`: `matchProvider` / `rankingProvider` use the Sanity-backed
  provider when raw data with rows is available and fall back to the existing
  `static-json` providers otherwise. The committed `src/data/*.json` stays as fallback,
  so the site never renders empty.
- No changes to components, routes or query options: the derived data
  (`getUpcoming`, `getCalendar`, `getStanding`, `getAllStandings`, `getLastUpdated`)
  keeps the same contract, so home page, team page and rankings section work unchanged.

## 3. Admin visibility

`/admin/volleydata` gets an "Adapter" block below the refresh result: number of adapted
matches and ranking rows per team, which source is active (Sanity raw or fallback JSON),
and the adapter warnings (unmatched team names, invalid dates, unparsable scores).
Purely read-only.

## 4. Ranking URL and validation

- The ranking URL keeps `se=13`; `buildRankingExportUrl` is left as is. No change there.
- Heren A is the reference team: the existing test export (last season) is used to validate
  the whole ranking flow end to end — refresh → `volleyRankingsRaw` → adapter → team page.
- Because it is preseason, the other teams will legitimately produce no ranking rows. The
  adapter treats "no ranking yet" as a normal state: the team page shows the existing
  "geen stand beschikbaar" state instead of an error, and the rankings section only lists
  teams that do have a standing.
- Text encoding: the export delivers Latin-1 bytes (`La LouviÃ¨re`), so the adapter
  repairs the encoding of team names before matching and display.


## Out of scope

- No change to the raw documents, the Studio schema, the parser or the cron route.
- No database, no new secrets.
