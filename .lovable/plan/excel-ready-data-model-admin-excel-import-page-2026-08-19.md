# Excel-ready data model + admin Excel Import page

## 1. Sheet-shaped data model

Today one `Team` object holds everything (players, trainings, external refs, photo object) and venues use `street`/`mapUrl`. The new model mirrors the future workbook: five flat, ID-keyed record sets that are joined at the provider layer.

### Source record sets (one file per future sheet)

```text
src/content/sheets/
  teams.ts      -> TeamRecord[]      teamId, slug, name, shortName, level,
                                     description, shortDescription, category,
                                     photoUrl?, coach?, assistantCoach?, order
  players.ts    -> PlayerRecord[]    teamId, name, number?, position?
  trainings.ts  -> TrainingRecord[]  teamId, day, startTime, endTime, venueId
  venues.ts     -> VenueRecord[]     venueId, name, address, postalCode, city,
                                     googleMapsUrl, notes?
  parser-data.ts-> ParserRecord[]    teamId, slug, volleyScoresUrl, rankingUrl,
                                     calendarUrl, competitionCode, divisionCode,
                                     parserEnabled
```

Rules applied: stable IDs everywhere (`teamId`, `venueId`), references instead of duplication (players/trainings/parser rows point at `teamId`; trainings point at `venueId`), and no field is required beyond its ID so partial Excel rows never break rendering.

### Composed view model

`Team` stays the shape components consume, but becomes a *derived* type assembled by the CMS provider:

- `team.id` -> `teamId` (kept as `id` alias-free: components switch to `teamId`)
- `team.players` / `team.trainings` -> joined from the player/training records
- `team.photo` -> built from `photoUrl` with a generated alt text (still optional; brand fallback unchanged)
- `team.externalRefs` -> replaced by `team.parser` (the ParserData record), so the calendar button reads `team.parser?.calendarUrl` and only renders when present and `parserEnabled`
- Venue lookups return the new `Venue` shape (`venueId`, `address`, `googleMapsUrl`); `getVenue`/`getPrimaryVenue` keep working

### Providers

- `mock-cms.ts`: joins the five record sets, normalises every field (existing defensive helpers stay), sorts by `order`, and exposes the same `getTeams` / `getTeamBySlug` contract. Adds `getVenues()` for future use.
- `static-json.ts`: match/ranking rows join onto teams via `teamId` first, then via ParserData (`competitionCode`/`divisionCode`/slug) instead of the removed `volleyScoresTeamId`. Season fields on `Match`/`RankingEntry` are unchanged.
- `src/data/matches.json` and `rankings.json` source ids are updated to the new join keys so the homepage and team pages keep showing the same content.

### Touched consumers

`TeamCard`, `TeamDetail`, team routes, home sections (rankings, upcoming, teams overview), `MapPlaceholder`, contact/club pages — updated only where a renamed field is read. No visual change intended.

## 2. Admin: Excel Import page

New route `src/routes/admin.excel-import.tsx` inside the existing `/admin` layout (same auth gate, `noindex`, same `PageHero` + `Section` styling). Content:

- Short explanation of the workflow: one workbook -> validation -> CMS sync -> website.
- A table of the expected sheets and their columns (Teams, Players, Trainings, Locations, ParserData), matching the model above.
- A note that ParserData drives the future rankings/calendar parser and that `parserEnabled` acts as a per-team switch.
- A disabled placeholder "Workbook uploaden" control with a "Binnenkort" badge — no upload or import logic.

Navigation: add an "Excel Import" card/link to the existing admin dashboard card grid and a small link row in the admin layout, leaving the rest of the admin area untouched.

```text
/admin                -> existing dashboard (+ Excel Import entry)
/admin/excel-import   -> new documentation page
```

## Out of scope

No Sanity client, no Excel parsing/upload, no backend, no schema changes to activities/sponsors/board content.
