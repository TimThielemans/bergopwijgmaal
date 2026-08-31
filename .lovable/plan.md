# Site Information (singleton) + Lidgeld-sectie op de clubpagina

Nieuw CMS-type voor algemene clubinformatie die niet bij een ploeg, hal, sponsor of activiteit hoort. Eerste toepassing: lidgelden per seizoen.

## 1. Nieuw contenttype `siteInfo`

Eén document (singleton), naast Clubinfo in de Studio.

Velden:
- `currentSeason` (string, bv. "2026-2027")
- `membershipFeeRecreational` (number)
- `membershipFeeProvincialCompetition` (number)
- `membershipFeeNationalCompetition` (number)
- `membershipInfo` (rich text / block content) — uitleg over betaling, verzekering, kortingen, blessures, ...

Opzet is uitbreidbaar: toekomstige algemene clubinfo (openingsuren, privacy, praktische info) kan als extra veld in ditzelfde type.

## 2. Studio

- Schema toevoegen in `studio/schemaTypes/` en registreren in `schemaTypes/index.ts`.
- Studio direct opnieuw deployen naar https://bergop-wijgmaal.sanity.studio zodat de velden meteen invulbaar zijn.
- Eén startdocument aanmaken met seizoen 2026-2027 en placeholder-bedragen, zodat je enkel nog de juiste cijfers en tekst invult.

## 3. Website-integratie

- `SiteInfo` type in `src/content/types.ts`, mockwaarden als fallback (zelfde patroon als Clubinfo).
- GROQ-query `SITE_INFO_QUERY` + mapping in `sanity-cms.ts`; mock-provider levert de fallback.
- `getSiteInfo()` toevoegen aan `CmsProvider` en aan de bestaande `siteContentQuery`, zodat de clubpagina het via `useSiteContent()` krijgt.
- Rich text: renderen met `@portabletext/react` (kleine dependency) zodat titels, lijstjes en links uit de CMS-tekst correct tonen.

## 4. Clubpagina: sectie "Lidgeld"

Nieuwe sectie op `/club`, geplaatst **vóór** "Het bestuur":

- Titel: "Lidgeld", intro: "Voor het seizoen {currentSeason} gelden de volgende lidgelden."
- Drie kaarten/rijen: Recreatie, Competitie provinciaal, Competitie nationaal, met bedrag in euro-notatie (`€ 195`).
- Daaronder de CMS-tekst uit `membershipInfo`.
- Sectie verbergt zich als er geen bedragen én geen tekst zijn; individuele bedragen die leeg zijn worden overgeslagen. Mobile-first: kaarten stapelen onder elkaar.

## Technische details

- Bestanden: `studio/schemaTypes/siteInfo.ts` (nieuw), `studio/schemaTypes/index.ts`, `src/content/types.ts`, `src/content/club.ts` (mock), `src/lib/sanity/queries.ts`, `src/lib/providers/{types,mock-cms,sanity-cms,index}.ts`, `src/lib/site-content.ts`, `src/routes/club.tsx`, nieuwe component `src/components/club/MembershipSection.tsx`.
- Geen database, geen backend-service: alles loopt via de bestaande server-side Sanity fetch.
- Bedragen blijven getallen in de CMS; opmaak gebeurt in de frontend, dus elk seizoen enkel CMS-aanpassing.
