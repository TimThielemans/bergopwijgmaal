# Sanity architecture review (no implementation yet)

## 1. Do I have access to the Sanity schemas?

Yes — the Sanity connection works. Project **Berg-Op Wijgmaal** (`utlbxtd6`), dataset `production` (public ACL). There are **no deployed schemas yet**, so nothing exists in Sanity today. That is good news: we design the schemas from the website model, exactly as you want, with no legacy to work around.

## 2. Alignment: website model vs Excel workbook

The workbook matches the current website record types almost 1:1 (same ids, same column names).

```text
Excel sheet   website record    verdict
Teams      -> TeamRecord        match, 3 fields missing (below)
Players    -> PlayerRecord      full match
Trainings  -> TrainingRecord    full match
Locations  -> VenueRecord       match, `notes` missing
ParserData -> ParserRecord      full match (+ extra `notes` column)
```

Gaps found, all small:

- **Teams sheet misses `shortDescription`** — the website uses it on team cards and the homepage overview. Today it falls back to empty.
- **Teams sheet misses `order`** — the site sorts teams by an explicit order; without it teams fall back to order 99 (unstable ordering).
- **Teams sheet misses `photoAlt`** — accessibility/SEO alt text; the site auto-generates "Ploegfoto <name>" as fallback, acceptable.
- **`photoUrl` is empty for all rows** — with Sanity, team photos should be real image assets uploaded in the Studio, not a URL string.
- **Locations misses `notes`**; **ParserData has an extra `notes`** column the website ignores.
- `Teams.category` and `ParserData.parserEnabled` are present and typed correctly (`competitief`/`recreatief`, boolean).

So: the Excel structure **is sufficient** for future imports once `shortDescription` and `order` are added to the Teams sheet.

## 3. Proposed Sanity structure (website model drives it)

Two document types only, matching your assumption:

```text
document  team
  teamId (slug-safe string, unique)   slug
  name  shortName  category  level
  shortDescription  description
  photo (image asset, with alt)       coach  assistantCoach
  order
  players[]   -> object player   { name, number, position }
  trainings[] -> object training { day, startTime, endTime, venue -> ref location }
  parser      -> object parserData { volleyScoresUrl, rankingUrl, calendarUrl,
                                     competitionCode, divisionCode, parserEnabled, notes }

document  location
  venueId (unique)  name  address  postalCode  city  googleMapsUrl  notes
```

Deliberate deviations from the raw Excel, chosen to keep the frontend simple:

- **`venueId` becomes a real reference** on the training object instead of a plain string. The importer resolves `venueId` -> document ref; the frontend keeps reading a `venueId`-shaped value from the query projection.
- **`teamId`/`slug` on ParserData are dropped** inside the object — they are redundant once ParserData lives in the team. The provider re-injects them when building the view model (it already does this today).
- **`photo` becomes a Sanity image** with an `alt` field, resolved to `{ url, alt }` by `@sanity/image-url` — the same `ImageRef` shape components already consume.

Nothing in the component layer changes: the new `sanity-cms.ts` provider returns the exact `Team` view model the mock provider returns today.

## 4. What I recommend before building the import

1. **Add `shortDescription` and `order` columns** to the Teams sheet (and optionally `photoAlt`); align `notes` on Locations. I can produce the updated template workbook.
2. **Decide the photo policy**: keep photos Studio-managed (recommended — Excel never carries images) so the importer never touches the `photo` field and manual uploads are not overwritten.
3. **Decide import semantics**: I recommend `teamId`/`venueId` as deterministic document `_id`s (`team.heren-a`, `location.ymeria`) so a re-import is an idempotent upsert rather than a duplicate-creating insert, and child arrays (players/trainings) are replaced wholesale per team.
4. **Decide where the importer runs**: a Studio-side script/tool or a small server route. Either way it needs a write token — worth agreeing before we build, since public reads need none.
5. **Lock the read path**: `VITE_SANITY_PROJECT_ID` flips `contentSource` to Sanity; the mock provider stays as fallback so the site never goes blank during migration. CORS origin for the preview + published domain must be added (I can do this through the connection).

## 5. Suggested build order (for the next round)

```text
step 1  deploy team + location schemas to Sanity
step 2  seed the current mock content into Sanity (one-off, from existing sheets)
step 3  add sanity-cms.ts provider + GROQ projections; flip via env
step 4  build the Excel -> Sanity importer against the agreed template
```

## Out of scope for this review

No schema deployment, no provider code, no Excel parsing yet.
