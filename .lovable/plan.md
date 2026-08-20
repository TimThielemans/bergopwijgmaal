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

1. **Add `shortDescription` and `order` columns** to the Teams sheet; add `photoAlt` column; align `notes` on Locations. Remove `photoUrl` from the Excel template — photos are Studio-managed only. I can produce the updated template workbook.
2. **Photo policy confirmed**: photos are uploaded and managed in Sanity Studio. The Excel importer never creates or overwrites images; it only reads the optional `photoAlt` value from the Teams sheet and applies it to the existing image asset if one is present.
3. **Import semantics confirmed**: idempotent upsert. Document `_id`s are deterministic (`team.heren-a`, `location.ymeria`). A re-import patches top-level team/location fields and **replaces** child arrays (`players`, `trainings`) and the nested `parser` object wholesale. No duplicate teams are created.
4. **Import location**: the easy and most convenient route is a small server route under `/api/admin/import-excel` in the TanStack Start app. It accepts the parsed workbook payload, validates it with Zod, and writes to Sanity with a server-side write token. This keeps everything in one codebase and avoids Studio-plugin deployment complexity. The actual file parsing can happen client-side with `xlsx` before posting, or server-side after upload — we can decide tomorrow.
5. **Lock the read path**: `VITE_SANITY_PROJECT_ID` flips `contentSource` to Sanity; the mock provider stays as fallback so the site never goes blank during migration. CORS origin for the preview + published domain must be added (I can do this through the connection).

## 5. CMS strategy for the rest of the site (activities, sponsors, club info, board)

These sections are currently in `src/content/club.ts`. They should move into Sanity as well, but they do NOT come from the Excel workbook. I recommend keeping them in a separate "club" content area so the Excel importer never touches them.

### Proposed Sanity document types

```text
document  activity
  id (slug-safe string, unique)  slug  title  date  endDate  location
  excerpt  body (portable text)  image  ctaLabel  ctaUrl

document  sponsor
  id (slug-safe string, unique)  name  websiteUrl  tier
  logo (image asset)

document  boardMember
  id (slug-safe string, unique)  name  role  email  phone  photo  order

singleton  clubInfo
  name  tagline  foundingYear  mission
  storyBlocks[] { title, body }
  values[] { id, title, description }
  email  phone  socials[] { platform, label, url }
```

### Why separate from the Excel flow

- Activities, sponsors and board members are edited independently from the sports-data cycle.
- They benefit from rich fields (portable text body, image uploads, social links) that Excel does not express well.
- A singleton `clubInfo` document lets non-technical club members edit the about/contact copy without touching code.

### Frontend impact

- Add a `clubProvider` or extend the CMS provider with `getActivities`, `getSponsors`, `getBoardMembers`, `getClubInfo`.
- Keep the same view model shapes (`Activity`, `Sponsor`, `BoardMember`, `ClubInfo`) so components do not change.
- The mock provider continues to serve these from `src/content/club.ts` until `VITE_SANITY_PROJECT_ID` is set.

### Admin board adjustments once CMS is implemented

The existing `/admin` dashboard should reflect the new content sources:

```text
/admin
  -> Teams & Locaties   link to Sanity Studio (team/location documents)
  -> Clubgegevens       link to Sanity Studio (clubInfo singleton + board/activities/sponsors)
  -> Excel Import        keep as documentation + future upload trigger
  -> Website preview     link to published/preview URL
  -> Uitloggen          existing auth action
```

- Remove any mock-only actions that imply editing local files.
- The Excel Import card stays but changes its CTA from "Binnenkort" to a flow that parses the workbook and posts to `/api/admin/import-excel`.
- Add direct links to the relevant Studio sections so board members can edit club content without hunting through Sanity.

### Build order with the rest

```text
step 1  deploy team + location + activity + sponsor + boardMember + clubInfo schemas
step 2  seed current mock content into Sanity (teams from sheets, club from club.ts)
step 3  add sanity-cms.ts provider + GROQ projections; flip via env
step 4  build the Excel -> Sanity importer for team + location only
step 5  update /admin dashboard cards and links for CMS-based editing
step 6  (later) build Studio customisations / validation rules for club content
```

## Out of scope for this review

No schema deployment, no provider code, no Excel parsing yet.
