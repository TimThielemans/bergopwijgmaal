# Legacy VolleyDataParser (PHP) — enkel referentie

`get_and_convert_xls_files.php` en `convert.php` zijn de originele PHP-scripts.
Ze worden **niet** uitgevoerd door de website en staan hier alleen als
documentatie van het oorspronkelijke gedrag.

Wat we eruit hebben overgenomen:

- Wedstrijd-exports lezen de kolomnamen op **rij 0**, standen-exports op **rij 1**.
- VolleyScores levert XLS-exports via `index.php` met `a=me` (matches) en
  `a=re` (ranking), telkens met `f=1&lng=nl&v=2&isActiveSeason=1`.
- Lege rijen en volledig lege kolommen worden weggefilterd.

Wat bewust anders is in de moderne versie:

| Legacy (PHP) | Nu (TypeScript) |
| --- | --- |
| Hardcoded URL's per ploeg bovenaan het script | `parser.volleyClubId/volleyTeamId/volleySeriesId` in het Team-document in Sanity |
| Losse XLS- en JSON-bestanden op de server | Twee Sanity-singletons: `volleyMatchesRaw` en `volleyRankingsRaw` |
| Eén JSON-bestand per ploeg | Één geconsolideerde envelope met een blok per ploeg, elk blok en elke rij draagt `teamId` |
| Manueel via shell/cron op de webhost | Knop op `/admin/volleydata` + beveiligde cron-route `/api/public/refresh-volley-data` |

De URL-opbouw staat op één plek: `src/lib/parser/urls.ts`.
