# UI verbeteringen: vorm, klassement, wedstrijdrijen, hero

## 1. Vormindicatoren met 4 kleuren

Vandaag is vorm enkel "W" of "L". Dat wordt uitgebreid naar vier resultaatklassen, afgeleid uit de setstand:

| Setstand | Klasse | Kleur |
|---|---|---|
| 3-0 / 3-1 | volle winst | groen |
| 3-2 | winst | lichtgroen |
| 2-3 | verlies | oranje |
| 1-3 / 0-3 | zwaar verlies | rood |

- Nieuwe tokens in `src/styles.css`: `--win`, `--win-soft`, `--loss-soft`, `--loss` (bestaande win/loss blijven, twee nieuwe erbij).
- Het vormtype krijgt de waarden `W3 | W2 | L2 | L3`; de oude `W`/`L` waarden uit statische JSON worden getolereerd en gemapt op volle winst / zwaar verlies.
- Eén gedeelde helper bepaalt klasse + kleur + label, zodat vormstreak en wedstrijdbadges identiek kleuren.
- Blokjes tonen nog steeds W/V; kleur draagt de nuance, met screenreadertekst die de setstand benoemt.

## 2. Kolomvolgorde volledig klassement

Kolomvolgorde wordt: **WED | PTN | W+ | W- | S+ | S-** (gespeeld, punten, gewonnen, verloren, sets voor, sets tegen). Alleen koppen en celvolgorde wijzigen; data en highlighting blijven. De legende onderaan wordt aangepast aan de nieuwe afkortingen.

## 3. Gespeelde wedstrijden (teampagina)

Wedstrijdrij krijgt een variant voor gespeelde wedstrijden:
- geen thuis/uit-label, geen uur;
- setstand blijft zichtbaar;
- resultaat als klein gekleurd badge in dezelfde stijl als het huidige thuis/uit-badge, met de kleur uit de tabel hierboven (bv. "Winst 3-1" groen, "Verlies 2-3" oranje).

## 4. Komende wedstrijden (teampagina)

Zelfde rij, andere variant: geen thuis/uit-label, uur blijft, tegenstander/zaal/competitie blijven, nog steeds de eerstvolgende 4.

Op de homepagina blijft het thuis/uit-label wél staan (daar is thuis/uit relevant voor bezoekers).

## 5. Homepagina: komende 14 dagen, minimum 5

De homepagina toont alle wedstrijden binnen 14 dagen; zijn dat er minder dan 5, dan wordt aangevuld met de eerstvolgende wedstrijden tot er 5 staan (of minder als er niet meer zijn). Een absoluut maximum (bv. 14) voorkomt een eindeloze lijst in drukke weken.

Technisch: de bestaande upcoming-query krijgt een `withinDays`- en `minCount`-optie, filtering gebeurt in de query-laag zodat providers ongewijzigd blijven. De "volgende thuismatch"-kaart in de hero blijft werken op dezelfde lijst.

## 6. Hero rond het BOW-merk

Nieuwe opbouw links in de hero:

```text
VOLLEYBAL IN WIJGMAAL · LEUVEN
Welkom bij
B O W          <- zeer groot, clubaccentkleur
[CMS intro/missie, secundair]
[Onze ploegen] [Volgende wedstrijden]
```

- "BOW" wordt het dominante element: display-font, extra bold, sterk vergroot (schalend van ~5rem mobiel tot ~10rem desktop), in de clubaccentkleur met lichte glow/omtrekaccent, strakke letterafstand.
- "Welkom bij" staat er klein en licht boven; de eyebrow blijft.
- De CMS-missie blijft eronder als secundaire tekst.
- Kaart met volgende thuismatch, knoppen en statistiekenband blijven ongewijzigd.
- Voor SEO blijft de H1 semantisch volledig ("Welkom bij BOW — VC Berg-Op Wijgmaal") met visueel verborgen aanvulling waar nodig.

## Technische noten

- Aangepast: `src/content/types.ts` (vormtype), `src/lib/adapters/rankings.ts` (vorm afleiden uit setstand), `src/components/shared/FormStreak.tsx`, nieuw `src/components/shared/ResultBadge.tsx` + `src/lib/form.ts` (kleur/labelhelper), `src/components/shared/MatchRow.tsx` (varianten), `src/components/teams/RankingTable.tsx`, `src/components/teams/TeamDetail.tsx`, `src/lib/providers/index.ts` + `types.ts` (venster-opties), `src/routes/index.tsx`, `src/components/home/HeroSection.tsx`, `src/styles.css` (tokens).
- Geen backend-, schema- of parserwijzigingen; raw data en Sanity blijven ongemoeid.
