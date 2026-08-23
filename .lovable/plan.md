# Volgende build: volledige klassementtabel + werkende Excel-import

## 1. Team Detail — volledige klassementtabel

De adapterlaag berekent vandaag al een complete tabel per ploeg (`RankingTable` /
`RankingTableRow` in `src/lib/adapters/rankings.ts`: positie, positielabel, ploegnaam,
punten, gespeeld, gewonnen, verloren, sets voor/tegen en `isOwnTeam`). Die tabel wordt
nog niet doorgegeven aan de site — enkel de samenvattende `RankingEntry`.

Wat er gebeurt:

- Providercontract uitbreiden met `getTable(teamId, seasonId)`.
  - `sanity-volley`: geeft de tabel uit de adapteroutput terug.
  - `static-json`: bouwt een minimale tabel (enkel de eigen ploeg) of geeft `null`,
    zodat de fallback nooit crasht.
- Nieuwe query `rankingTableQuery(teamId)` naast `standingQuery`, meegeladen in de
  loader van `/ploegen/$slug`.
- Nieuwe component `src/components/teams/RankingTable.tsx`:
  - Desktop: echte `<table>` met kolommen Pos · Ploeg · Wed · Gew · Verl · Ptn · Sets V · Sets T.
  - Mobiel: dezelfde tabel met horizontale scroll voor de statistiekkolommen en een
    sticky positie/ploeg-kolom, zodat niets afgesneden wordt.
  - Eigen ploeg krijgt een duidelijke highlight (clubkleur-achtergrond, vette tekst,
    accentrand links) plus `aria-current="true"` voor screenreaders.
  - Reeksnaam als tabelcaption; lege tabel → bestaande `EmptyState` ("nog geen stand").
- `TeamDetail.tsx`: de bestaande "Stand & vorm"-kaart blijft bovenaan staan, de
  volledige tabel komt eronder in dezelfde sectie.

## 2. Excel-import werkend maken

`/admin/excel-import` wordt van documentatiepagina een werkende importpagina.

Flow: **upload → server valideert & toont voorbeeld → bevestigen → wegschrijven naar Sanity**.

- Upload van één `.xlsx`-werkboek in de browser; het bestand gaat als base64 naar een
  server function (`src/lib/import/excel.functions.ts`), het parsen gebeurt server-side
  met de al aanwezige `xlsx`-library.
- Verwachte bladen: `Teams`, `Players`, `Trainings`, `Locations`, `ParserData`.
- Validatie per blad: verplichte kolommen, bestaande `teamId`/`venueId`-verwijzingen,
  dubbele id's, ongeldige booleans. Fouten blokkeren de import, waarschuwingen niet.
- Voorbeeldstap toont per documenttype: nieuw, gewijzigd, ongewijzigd — niets wordt
  weggeschreven zonder expliciete bevestiging.
- Wegschrijven via de bestaande `sanityCreateOrReplace` met deterministische id's
  (`team.<teamId>`, `location.<venueId>`), dus idempotent en met revisiehistoriek.
  Foto's blijven in Sanity beheerd: bestaande `photo`-assets worden nooit overschreven
  (enkel `photoAlt` uit Excel). Documenten die niet in het werkboek staan worden
  **niet** verwijderd.
- Na een succesvolle import worden de site-queries geïnvalideerd.

### ParserData-blad aligneren met de CMS-velden

Het blad beschrijft nu nog URL-kolommen. Die verdwijnen; de kolommen worden exact de
`team.parser`-velden uit Sanity:

```text
teamId | slug | parserEnabled | volleyClubId (ci) | volleyTeamId (ti) | volleySeriesId (ssi) | competitionCode | divisionCode
```

Volledige URL's worden nooit ingelezen of opgeslagen — die blijven afgeleid via
`src/lib/parser/urls.ts`. Bij `parserEnabled = true` zijn ci/ti/ssi verplicht (anders
een blokkerende validatiefout). De documentatiesectie op de pagina en
`src/routes/admin.excel-import.tsx`, `docs/sanity-integration.md` worden hierop
bijgewerkt, samen met een downloadbaar voorbeeldwerkboek dat de huidige data bevat.

## Technische details

- Gewijzigd: `src/lib/providers/types.ts`, `sanity-volley.ts`, `static-json.ts`,
  `index.ts` (nieuwe query), `src/routes/ploegen.$slug.tsx`,
  `src/components/teams/TeamDetail.tsx`, `src/routes/admin.excel-import.tsx`.
- Nieuw: `src/components/teams/RankingTable.tsx`, `src/lib/import/excel.server.ts`
  (parsen + validatie + mapping), `src/lib/import/excel.functions.ts` (server functions),
  `src/lib/import/types.ts`.
- Geen nieuwe dependencies: `xlsx` is al geïnstalleerd.
- Import blijft achter de bestaande admin-guard (`/admin`, `noindex`).
