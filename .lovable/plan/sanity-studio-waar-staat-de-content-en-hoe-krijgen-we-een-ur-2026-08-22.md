# Sanity Studio: waar staat de content en hoe krijgen we een URL

## Antwoorden op je vragen

**Waar zijn de documenten gemaakt?**
Ik heb ze zelf aangemaakt tijdens Iteratie A, via de Sanity MCP-connector (server-side API-writes op project `utlbxtd6`, dataset `production`). Ze zijn dus niet via een Studio ingetypt. De inhoud komt 1-op-1 uit de mockcontent in `src/content/` (ploegen, locaties, activiteiten, sponsors, bestuur, clubinfo).

**Staat er een Studio online?**
Nee. `get_project_studios` geeft voor dit project geen enkele studio-applicatie terug — er is geen `*.sanity.studio` host. Het schema is wel gedeployed (workspace `default`, MCP-beheerd), maar zonder Studio-app.

**Waar kan je nu al documenten bekijken?**
Voorlopig enkel via het beheerportaal: `https://www.sanity.io/manage/project/utlbxtd6` (daar zie je datasets, API, tokens en de Vision-query-tool om documenten op te vragen). Documenten browsen/bewerken in een echte content-UI vereist een gedeployde Studio.

## Voorstel: Studio deployen

1. Studio deployen via de connector (`deploy_studio`) op het bestaande schema-workspace `default`:
   - `appHost`: `bergop-wijgmaal` → URL `https://bergop-wijgmaal.sanity.studio`
   - `title`: `VC Berg-Op Wijgmaal`
   - project `utlbxtd6`, dataset `production`
   Als die subdomeinnaam globaal al bezet is, val ik terug op `vc-bergop-wijgmaal`.
2. De resulterende URL in `.env` zetten als `VITE_SANITY_STUDIO_URL`, zodat het `/admin`-overzicht en de "Bewerken in Sanity"-knoppen rechtstreeks naar de juiste documenttypes linken in plaats van naar sanity.io/manage.
3. `.env.example` en `docs/sanity-integration.md` bijwerken met de echte Studio-URL en de opmerking dat de Studio los van de website gehost wordt.
4. Verifiëren dat de Studio de 28 gepubliceerde documenten toont en dat een tekstwijziging in de Studio op de site verschijnt (server-side lezen met `SANITY_READ_TOKEN` werkt al).

## Technische noot

De gedeployde Studio is een gehoste app van Sanity op hun eigen domein; ze verandert niets aan de website-build, blijft buiten je GitHub-repo en heeft geen invloed op de Vercel-deploy. Aanmelden gebeurt met je Sanity-account, dus alleen leden van het project kunnen content bewerken. De route `/studio` in de app blijft een placeholder/verwijzing.
