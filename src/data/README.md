# Volleybaldata (statische JSON)

Deze map bevat de **gegenereerde** volleybaldata van de club. Er is geen live API:
een externe parser (VolleyDataParser) schrijft deze bestanden en de site leest ze in
tijdens de build.

## Bestanden

| Bestand | Inhoud | Type |
| --- | --- | --- |
| `matches.json` | Alle wedstrijden (alle seizoenen, alle ploegen) | `DataEnvelope<Match>` |
| `rankings.json` | Standen per ploeg (alle seizoenen) | `DataEnvelope<RankingEntry>` |

## Envelope

```json
{
  "version": 1,
  "generatedAt": "ISO 8601",
  "seasonId": "2026-2027",
  "source": "VolleyDataParser",
  "items": []
}
```

## Koppeling met ploegen

Rijen worden aan een ploeg gekoppeld via `teamId` (zie `src/content/teams.ts`) of via
`slug` ↔ `ParserData.slug`. Rijen zonder match met een
bestaande ploeg worden genegeerd, niet gerenderd.

## Seizoenen

Elke wedstrijd en elke standrij bevat `seasonId`. `CURRENT_SEASON_ID` in
`src/content/club-basics.ts` bepaalt wat standaard getoond wordt. Een nieuw seizoen
toevoegen is puur een data-aanpassing.
