# VolleyDataParser — modernisation & integration layer

## 1. Analyse of the uploaded PHP

`get_and_convert_xls_files.php` does three things:

1. A hardcoded `$xlsurls` map (VolleyScores URL -> local filename), split by hand
   into match files (`heren1.xls`, `dames1.xls`, ...) and ranking files
   (`AHP3A.xls`, `ADP4A.xls`, ...). Note: the sample URLs still point to another
   club (Osta Berchem) and the ranking TODO is unresolved.
2. Downloads each URL with `fopen`/`file_put_contents`, then `sleep(13)` to wait
   for the writes.
3. Converts every file with PhpSpreadsheet: read the active sheet as an array,
   take a header row, map each following row into `{header: value}` objects, and
   write one JSON file per XLS.

Two important details to preserve:

- **Matches use header row index 0; rankings use header row index 1.** The
  ranking export has one extra title row above the header.
- Output is a flat array of row objects keyed by the exact Dutch column headers
  from VolleyScores. That raw shape is what we keep in `*_raw.json`.

Weaknesses to remove: hardcoded URLs, one output file per team, temp files on
disk, the blind `sleep`, no error handling, no team identity in the output (so
you cannot tell which row belongs to which team).

## 2. Target architecture

The parser becomes a server function inside this app. No PHP, no temp files, no
Sanity writes.

```text
Sanity (team.parser)  ->  runVolleyParser (server fn)
                            |- fetch calendarUrl  -> parse sheet -> match rows
                            |- fetch rankingUrl   -> parse sheet -> ranking rows
                            v
                    { matches_raw, rankings_raw }  ->  /admin/parser
                                                        (preview + download)
```

- Configuration source: `TEAMS_QUERY` already projects `parser`. A new
  `PARSER_TEAMS_QUERY` returns only `teamId`, `slug`, `name`, `shortName` and the
  `parser` object, filtered on `parser.parserEnabled == true`.
- Reads go through the existing token-based server fetch, so nothing changes
  about Sanity access.
- Sheet parsing uses SheetJS (`xlsx`, pure JS, works in the worker runtime). It
  reads real XLS and also the HTML-table "xls" responses VolleyScores sometimes
  returns. Header row: 0 for calendars, 1 for rankings, matching the PHP.
- Each team is fetched independently: one failing URL is recorded as an error and
  the rest still produce output. Downloads run in parallel (no `sleep`).

## 3. Output shape

Both files use the same envelope style as the existing `src/data/*.json`, with
raw rows untouched plus the team identity the PHP version lacked:

```json
{
  "version": 1,
  "generatedAt": "2026-08-23T09:00:00.000Z",
  "source": "VolleyDataParser (VolleyScores)",
  "items": [
    {
      "teamId": "heren-a",
      "slug": "heren-a",
      "competitionCode": "AHP3",
      "divisionCode": "A",
      "sourceUrl": "https://www.volleyscores.be/...",
      "rows": [{ "Datum": "13-09-2026", "Thuisploeg": "...", "...": "..." }]
    }
  ],
  "errors": [{ "teamId": "dames-b", "url": "...", "message": "HTTP 500" }]
}
```

`matches_raw.json` groups per team from `calendarUrl`; `rankings_raw.json` from
`rankingUrl`. `volleyScoresUrl` stays untouched (it is the public link used on
the team page).

## 4. Files to add

| File | Purpose |
| --- | --- |
| `src/lib/parser/types.ts` | `RawSheetRow`, `RawTeamBlock`, `RawEnvelope`, `ParserRunResult` |
| `src/lib/parser/sheet.server.ts` | download + SheetJS -> row objects (header index param) |
| `src/lib/parser/run.functions.ts` | `runVolleyParser` server fn: Sanity read, parallel fetch, two envelopes |
| `src/lib/sanity/queries.ts` | add `PARSER_TEAMS_QUERY` |
| `src/routes/admin.parser.tsx` | "Genereer JSON" button, per-team result table, download buttons |
| `src/routes/admin.index.tsx` | one extra card linking to `/admin/parser` |
| `docs/volleydata-parser.md` | how it works, how to refresh the committed JSON |

Dependency: `bun add xlsx`.

## 5. How the JSON reaches the repo

The published app runs in a serverless worker with no writable repo, so the
parser cannot commit files. The admin page therefore offers the two files as
downloads (and shows them inline). Refresh flow: run the parser in `/admin`,
download `matches_raw.json` + `rankings_raw.json`, drop them into `src/data/`.
The later adapter step converts them into the existing `matches.json` /
`rankings.json` shapes, which is where team joins, season ids and form streaks
are produced.

## 6. Out of scope for this step

- No adapter to `matches.json` / `rankings.json` yet.
- No website/component changes; only the new admin page and its link.
- No Sanity writes, no schema changes, no database.

## 7. Security note

`/admin/parser` is `noindex, nofollow` and behind the existing placeholder admin
gate. The server fn only fetches URLs coming from Sanity `team.parser` fields and
only accepts `https://` hosts on `volleyscores.be`, so the endpoint cannot be
used as an open proxy.
