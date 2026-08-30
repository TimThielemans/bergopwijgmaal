# Sanity Studio deployen vanuit Lovable

## Doel
De gehoste Sanity Studio voor project `utlbxtd6` / dataset `production` publiceren naar `https://bergop-wijgmaal.sanity.studio`, zodat je de nieuwe velden (`volleySeasonId`, `publicUrl`) kunt bewerken zonder lokale CLI.

## Huidige situatie
- Het schema is MCP-beheerd in workspace `default`.
- `studio/sanity.config.ts` en `studio/sanity.cli.ts` zijn klaar met `studioHost: "bergop-wijgmaal"`.
- Eerdere poging via `npx sanity deploy` faalde met een rechtenprobleem op het token.

## Stappenplan

1. **Deploy poging via Lovable MCP**
   - Tool: `mcp_sanity_h8oap--deploy_studio`
   - Parameters:
     - `resource.projectId`: `utlbxtd6`
     - `resource.dataset`: `production`
     - `workspaceName`: `default`
     - `title`: `VC Berg-Op Wijgmaal`
     - `appHost`: `bergop-wijgmaal`
   - Bij succes wordt de URL `https://bergop-wijgmaal.sanity.studio` teruggegeven.

2. **Configuratie bijwerken**
   - `.env`: `VITE_SANITY_STUDIO_URL=https://bergop-wijgmaal.sanity.studio`
   - `docs/sanity-integration.md`: echte URL vermelden.

3. **Rechtenfout afhandelen (indien stap 1 faalt)**
   - De Lovable-connector gebruikt je Sanity-gebruikerstoken.
   - `deployStudio` vereist dat je in het project minstens **Admin** bent (Owner of Admin).
   - Editor/Viewer/Read-only rollen mogen schema's bewerken of documenten lezen, maar kunnen geen gehoste Studio deployen.
   - Opties om rechten te geven:
     a. Ga naar `https://www.sanity.io/manage/project/utlbxtd6` → **Settings → Members** en zorg dat je rol **Admin** is.
     b. Vraag de project-eigenaar om je rol te verhogen.
     c. Alternatief: maak in `sanity.io/manage/project/utlbxtd6` → **API → Tokens** een token aan met de **Deploy Studio**-scope en geef dat token veilig door aan Lovable ( Secrets), zodat toekomstige deploys via dat token lopen.

4. **Schema-verificatie**
   - Na succesvolle deploy controleren of `parserData` in de Studio de velden `volleySeasonId` en `publicUrl` toont.
   - Indien niet: opnieuw `mcp_sanity_h8oap--deploy_schema` aanroepen met de bijgewerkte `parserData.ts`.

## Wat je hoeft niet te doen
- Lokaal `sanity deploy` draaien.
- Zelf een Studio-project aanmaken; het bestaande project `utlbxtd6` wordt hergebruikt.
