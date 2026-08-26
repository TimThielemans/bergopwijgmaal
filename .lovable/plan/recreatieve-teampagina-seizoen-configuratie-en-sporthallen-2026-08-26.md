# Recreatieve teampagina, seizoen-configuratie en sporthallen

Drie afgebakende updates, zo klein mogelijk gehouden.

## 1. Aparte variant voor recreatieve ploegen

De teamdetailpagina krijgt een variant voor `category === "recreatief"`. Competitieve ploegen blijven exact zoals nu.

Recreatief:
- Hero: naam, beschrijving, foto, coach. De statistiek-blokjes "Spelers" en "Stand" verdwijnen (positie/klassement is niet relevant).
- In plaats van "Stand & Vorm" + volledige klassementstabel + vormstreak: één infokaart met de tekst "Kalender, uitslagen en standen vind je hier." en een CTA-knop naar de publieke URL uit de CMS (bv. `https://www.vlmbrabant.be/competitieKalender.html`). Geen hardcoded URL in code; valt weg als het veld leeg is.
- Het trainingsblok toont dezelfde data (dag, uur, sporthal uit Trainingen in de CMS) maar onder de titel "Thuismatchen".
- Kalendersectie met wedstrijden/uitslagen wordt niet getoond voor recreatieve ploegen (er is geen parserdata).

## 2. Team-CMS: publieke URL + seizoen-id

In `parserData` (Sanity + het lokale datamodel) komen twee velden bij:
- `publicUrl` — de publieke overzichtspagina (VolleyScores voor competitie, VLM Brabant voor recrea). De knop "Volledig overzicht" op de teampagina gebruikt dit veld; enkel als er niets ingevuld is, valt hij terug op de opgebouwde VolleyScores-link.
- `volleySeasonId` (SE) — vervangt de hardcoded `se=13` in de URL-builder. Zonder waarde blijft er een neutrale default gelden, zodat bestaande data niet stilvalt.

De URL-builder en de parser lezen het seizoen dus per ploeg uit de CMS. Nieuw seizoen = veld aanpassen in de CMS, geen codewijziging.
Het Excel-importsjabloon en de importmapping krijgen dezelfde twee kolommen, zodat Excel → Sanity gelijk blijft lopen.

## 3. Sporthallen consistenter gebruiken

- Contactpagina: alle sporthallen uit de CMS in plaats van alleen de eerste — elk met naam, adres, postcode/gemeente, eventuele nota en Google Maps-link. De kaart/placeholder hoort bij de hoofdhal.
- Footer en homepage-contactblok blijven bij de hoofdhal (bewust compact), maar gebruiken dezelfde helper zodat de naamgeving overal identiek is.
- Trainingen/thuismatchen en wedstrijdrijen blijven de zaal via `venueId` opzoeken; waar nu "Sporthal" als fallback staat, tonen we niets liever dan een verkeerde naam.

## Technische details

- `src/components/teams/TeamDetail.tsx` splitst in de bestaande competitieve weergave plus een recreatieve variant (gedeelde hero- en trainingsblokken, aparte informatiekaart). Route `ploegen.$slug.tsx` blijft dezelfde data laden; voor recrea worden klassement-queries overgeslagen.
- `src/lib/parser/urls.ts`: `VolleyIds` krijgt `volleySeasonId`; `buildUrl` zet `se` uit de config. `buildPublicOverviewUrl` geeft de CMS-URL terug wanneer die bestaat.
- `src/content/types.ts` (`ParserRecord`), `studio/schemaTypes/parserData.ts`, `src/lib/sanity/queries.ts`, `src/lib/import/excel.server.ts` en het voorbeeldwerkboek krijgen de velden `publicUrl` en `volleySeasonId`. Schema wordt opnieuw gedeployed.
- `src/lib/site-content.ts`: helper voor "alle zalen" naast `primaryVenue`; `src/routes/contact.tsx` gebruikt die.

## Inschatting

Kleine, geïsoleerde build: ongeveer 8–12 bestanden, één schema-deploy, geen migraties of backendwerk. Verwachte omvang: één build-iteratie (laag credit-gebruik), waarvan punt 1 het grootste stuk is.
