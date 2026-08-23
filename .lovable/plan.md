# VolleyDataParser — modernisation, Sanity storage & one-click refresh

## 1. Analyse of the uploaded PHP

`get_and_convert_xls_files.php`:

1. A hardcoded `$xlsurls` map (VolleyScores URL -> local filename), manually split
   into match files (`heren1.xls`, ...) and ranking files (`AHP3A.xls`, ...). The
   sample URLs still point to another club (Osta Berchem) and the rankings TODO is
   unresolved.
2. Downloads each URL with `fopen`/`file_put_contents`, then a blind `sleep(13)`.
3. Converts each file with PhpSpreadsheet: active sheet to array, take a header
   row, map every following row into `{header: value}`, write one JSON per XLS.

`convert.php` is the same conversion for a single test file.

Details worth preserving:

- **Matches use header row index 0; rankings use header row index 1** (ranking
  exports have an extra title row).
- Output rows are keyed by the exact Dutch VolleyScores column headers. That raw
  shape is what we keep.

Weaknesses removed: hardcoded URLs, per-team output files, temp files, the blind
sleep, no error handling, no team identity in the rows.

PHP cannot run on this stack (TypeScript, serverless runtime). The two files are
committed to `docs/legacy/` as reference only, with a README noting they are not
executed; the logic is reimplemented in TypeScript.

## 2. Target flow — no manual file handling

```text
Sanity team.parser (config)
        |
        v
refreshVolleyData (server fn, admin button)   <---- also called by cron route
        |- fetch calendarUrl per enabled team -> parse sheet -> match rows
        |- fetch rankingUrl  per enabled team -> parse sheet -> ranking rows
        v
Sanity singletons  volleyMatchesRaw / volleyRankingsRaw   (write token)
        |
        v
website reads them server-side (adapter step) -> live update, no redeploy
```

The generated JSON is stored in two Sanity singleton documents. No download, no
commit, no redeploy. This intentionally reverses the earlier "no generated data
in Sanity" rule, for these two blobs only.

## 3. Sanity storage

Two new document types, one document each:

| Type | Fields |
| --- | --- |
| `volleyMatchesRaw` | `_id: "volleyMatchesRaw"`, `generatedAt`, `source`, `payload` (JSON string), `teamCount`, `rowCount`, `errors[]` |
| `volleyRankingsRaw` | same shape |

- `payload` is a stringified JSON envelope (raw rows), so no Sanity schema has to
  mirror VolleyScores columns and the document stays small and cheap to write.
- Writes use `createOrReplace` on the fixed `_id`, so a refresh is idempotent and
  Sanity keeps the revision history (easy rollback via Studio).
- Requires a new **server-only** secret `SANITY_WRITE_TOKEN` (Editor role).
  Never `VITE_`-prefixed, read inside the handler only.
- Schemas are deployed to the existing Studio so the documents are inspectable.

Envelope inside `payload`:

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
      "rows": [{ "Datum": "13-09-2026", "Thuisploeg": "..." }]
    }
  ],
  "errors": [{ "teamId": "dames-b", "url": "...", "message": "HTTP 500" }]
}
```

## 4. Refresh triggers

- **Admin button** on a new `/admin/volleydata` page: "Volley-data verversen",
  showing per-team result (rows found / error), last run timestamp and row counts
  read back from the singletons.
- **Scheduled refresh** via `src/routes/api/public/refresh-volley-data.ts`
  (`POST`). It requires a `x-cron-secret` header compared timing-safely against a
  new `CRON_SECRET` secret, then calls the same shared runner. Configure a nightly
  call from cron-job.org / pg_cron against
  `https://project--<id>.lovable.app/api/public/refresh-volley-data`.

Both paths share one server-only module, so behaviour cannot drift.

## 5. Files

| File | Purpose |
| --- | --- |
| `src/lib/parser/types.ts` | `RawSheetRow`, `RawTeamBlock`, `RawEnvelope`, `RefreshResult` |
| `src/lib/parser/sheet.server.ts` | download + SheetJS -> row objects (header index param) |
| `src/lib/parser/refresh.server.ts` | shared runner: read config, fetch in parallel, build envelopes, write singletons |
| `src/lib/parser/refresh.functions.ts` | `refreshVolleyData` + `getVolleyDataStatus` server fns for the admin UI |
| `src/lib/sanity/write.server.ts` | `createOrReplace` mutation with `SANITY_WRITE_TOKEN` |
| `src/lib/sanity/queries.ts` | `PARSER_TEAMS_QUERY`, `VOLLEY_RAW_STATUS_QUERY` |
| `src/routes/admin.volleydata.tsx` | refresh button, per-team result, last-run info |
| `src/routes/admin.index.tsx` | one extra card linking to `/admin/volleydata` |
| `src/routes/api/public/refresh-volley-data.ts` | secret-protected cron endpoint |
| `docs/legacy/` | the two PHP files + README (reference only) |
| `docs/volleydata-parser.md` | architecture, secrets, cron setup |

Dependency: `bun add xlsx` (pure JS, worker-safe, also reads the HTML-table "xls"
responses VolleyScores sometimes returns).

## 6. Scope of this step vs next

This step: parser + Sanity storage + both refresh triggers + admin page. The
website still renders from `src/data/*.json`, so nothing visible changes yet.

Next step (adapter, separate approval): map the raw rows onto the existing
`Match` / `RankingEntry` shapes and let `matchProvider` / `rankingProvider` read
the Sanity singletons with the committed JSON as fallback. From that moment the
admin button visibly updates the site.

## 7. Security

- `SANITY_WRITE_TOKEN` and `CRON_SECRET` are server-only secrets, read inside
  handlers.
- The parser only fetches URLs coming from Sanity `team.parser`, restricted to
  `https://` on `volleyscores.be`, so it cannot be abused as an open proxy.
- `/admin/*` stays `noindex, nofollow` and behind the existing admin gate; the
  cron route rejects requests without the correct secret and returns no data.
- No database, no user data involved.
