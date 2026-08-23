# VolleyDataParser

Moderne TypeScript-vervanger van de PHP-scripts in `docs/legacy/`. Haalt kalenders
en standen op bij VolleyScores en bewaart ze in Sanity.

## Flow

```text
Sanity (team.parser: ci/ti/ssi)
      ↓  PARSER_TEAMS_QUERY (parserEnabled == true)
XLS-export downloaden per ploeg (matches: a=me, ranking: a=re)
      ↓  SheetJS — matches: headerrij 0, standen: headerrij 1
Geconsolideerde envelope (blok per ploeg, teamId op blok én rij)
      ↓  createOrReplace
volleyMatchesRaw  +  volleyRankingsRaw  (Sanity singletons)
      ↓
Website leest server-side → geen redeploy nodig
```

## Configuratie in de CMS

Per ploeg, in `Ploeg → ParserData`:

| Veld | VolleyScores-param | Verplicht |
| --- | --- | --- |
| `parserEnabled` | — | ja (schakelaar) |
| `volleyClubId` | `ci` | ja voor kalender |
| `volleyTeamId` | `ti` | ja voor kalender |
| `volleySeriesId` | `ssi` | ja voor kalender én stand |
| `competitionCode` | — | nee |
| `divisionCode` | — | nee |

Er worden **geen volledige URL's** in Sanity bewaard. `src/lib/parser/urls.ts` is de
enige plaats waar URL's opgebouwd worden:

- kalender-export: `…/index.php?v=2&isActiveSeason=1&a=me&ci=…&ti=…&ssi=…&f=1&lng=nl`
- stand-export: `…/index.php?v=2&isActiveSeason=1&a=re&ssi=…&f=1&lng=nl`

Dezelfde ids voeden ook de publieke "Volledig overzicht"-knop op de ploegpagina.

## Verversen

- Handmatig: `/admin/volleydata` → **Volley-data verversen**. Het rapport toont per
  ploeg het aantal rijen en eventuele fouten.
- Gepland: `POST /api/public/refresh-volley-data` met header `x-cron-secret: <CRON_SECRET>`.
  Zonder geldig secret geeft de route 401 (of 503 als er geen secret ingesteld is).

## Benodigde server-variabelen

| Variabele | Doel |
| --- | --- |
| `SANITY_READ_TOKEN` | lezen (Viewer) — het project staat anonieme reads niet toe |
| `SANITY_WRITE_TOKEN` | schrijven van de twee raw-singletons (Editor) |
| `CRON_SECRET` | beveiligt de geplande refresh-route |

Alle drie zijn server-only: nooit met `VITE_`-prefix.

## Bestanden

| Bestand | Rol |
| --- | --- |
| `src/lib/parser/urls.ts` | URL-builder + id-validatie (single source of truth) |
| `src/lib/parser/types.ts` | envelope-, blok- en rij-types + rij-helpers |
| `src/lib/parser/sheet.server.ts` | download + XLS-parsing (SheetJS) |
| `src/lib/parser/refresh.server.ts` | runner: lezen, parsen, wegschrijven, rapport |
| `src/lib/parser/refresh.functions.ts` | server functions voor de beheerpagina |
| `src/routes/admin.volleydata.tsx` | beheerpagina met knop, rapport en status |
| `src/routes/api/public/refresh-volley-data.ts` | cron-route met shared secret |
| `studio/schemaTypes/` | versiebeheerde Sanity-schema's (parserData, raw-types) |

## Adapterlaag (ruwe data → websitemodel)

De ruwe documenten `volleyMatchesRaw` en `volleyRankingsRaw` blijven de bron van waarheid en
worden nooit herschreven. De omzetting naar het websitemodel (`Match` / `RankingEntry`) gebeurt
in `src/lib/adapters/`:

| Bestand | Verantwoordelijkheid |
| --- | --- |
| `columns.ts` | Tolerante kolomnamen + herstel van Latin-1 tekens (`La LouviÃ¨re` → `La Louvière`). |
| `dates.ts` | `19/09/2026` + `16:30` → ISO met de juiste Brusselse offset (zomer/winteruur). |
| `scores.ts` | `Uitslag` (`3-1`) en `Setstanden` → sets en leesbare setlijn. |
| `teams.ts` | Eigen ploeg vs. tegenstander (ook bij derby's) en matching van de sporthal. |
| `matches.ts` | Rijen → `Match[]` met stabiele id op basis van wedstrijdnummer + teamId. |
| `rankings.ts` | Rijen → `RankingEntry[]`, **enkel het hoofdklassement**: het lezen stopt zodra het reserveklassement begint. Vorm wordt afgeleid uit de laatste vijf gespeelde wedstrijden. |
| `index.ts` | `adaptVolleyData(...)` → `{ matches, rankings, tables, warnings }`. |

`src/lib/providers/sanity-volley.ts` leest de ruwe documenten, voert de adapter uit en valt
automatisch terug op `src/data/*.json` wanneer er nog geen ruwe rijen zijn.

### Voorseizoen

`se=13` blijft deel van de stand-URL. Zolang er nog geen klassement gepubliceerd is voor de
huidige reeks, levert die export geen rijen op. Voor validatie is er één tijdelijke
testexport (Heren A, vorig seizoen) in `RANKING_TEST_URLS`; die wordt enkel gebruikt wanneer de
echte export leeg is en verdwijnt zodra het klassement live staat.
