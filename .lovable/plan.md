# VC Berg-Op Wijgmaal — Architecture & Implementation Plan

Dutch-language, mobile-first, premium sports-club site. React 19 + TypeScript + Tailwind v4 on TanStack Start (file-based routing, plain repo, deployable to Vercel/Cloudflare from GitHub). No backend, no database, no auth. All content comes from typed mock modules that mirror future Sanity documents.

## 1. Visual identity (from the logo)

Palette derived from the uploaded mark: club blue (`#5AA3D6`-family), near-black ink (`#141414`), warm off-white paper, plus a deeper "court navy" for contrast blocks and a single sand/amber accent for highlights (rankings, streaks, CTAs).

- Typography: one geometric-humanist display face for headlines (tight tracking, heavy weights, uppercase for eyebrow labels) + a highly legible sans for body. Loaded via `<link>` in the root route.
- Motifs: the brush-stroke "W" used as a large watermark/section divider; the blue dot from the logo reused as a bullet, streak indicator and hover accent.
- Surfaces: generous whitespace, large rounded cards, soft layered shadows, gradient "court light" washes, hairline borders. No municipal/federation look, no crowded tables.
- Motion: scroll-reveal fades with small upward offset, staggered card entrances, smooth hover lifts, animated ranking/streak bars. Respects `prefers-reduced-motion`.
- Imagery: abstract brand graphics (gradient + stroke compositions) for hero and section backdrops; AI-generated volleyball action shots as team-card and team-detail placeholders, all referenced through the data layer so real photos drop in later.

## 2. Site architecture & page hierarchy

```text
/                     Home (8 sections)
/ploegen              Teams overview (competitive + recreational)
/ploegen/$slug        Team detail template
/club                 Club story, values, board, hall
/contact              Contact, hall address, socials, map
/studio               Reserved placeholder for Sanity Studio (static notice, no auth)
/* (splat)            404
```

Shared chrome (sticky translucent header with active-route highlighting, mobile drawer nav, footer with sponsors + socials) lives in `src/routes/__root.tsx`.

Home sections in order: Hero → Volgende wedstrijden → Stand & vorm → Clubactiviteiten → Onze ploegen → Over Berg-Op → Sponsors → Contact.

## 3. Folder structure

```text
src/
  routes/
    __root.tsx
    index.tsx
    ploegen.tsx            (layout: <Outlet />)
    ploegen.index.tsx
    ploegen.$slug.tsx
    club.tsx
    contact.tsx
    studio.tsx
  components/
    layout/        SiteHeader, MobileNav, SiteFooter, Section, PageHero
    home/          HeroSection, UpcomingMatchesSection, RankingsSnapshotSection,
                   ActivitiesSection, TeamsOverviewSection, AboutSection,
                   SponsorsSection, ContactSection
    teams/         TeamCard, TeamGrid, TeamHeader, SquadList, TrainingSchedule,
                   RankingTable, MatchList, MatchCalendar
    club/          ValueCard, BoardMemberCard, StoryTimeline, VenueCard
    shared/        MatchRow, HomeAwayBadge, FormStreak, ActivityCard, SponsorLogo,
                   MapPlaceholder, SocialLinks, RevealOnScroll, BrandMark
    ui/            existing shadcn primitives
  content/
    types.ts       all content interfaces (the CMS contract)
    teams.ts  matches.ts  rankings.ts  activities.ts  sponsors.ts
    board.ts  club.ts  venue.ts  sponsors/  index.ts (barrel: getTeams(), getUpcomingMatches(), …)
  lib/
    providers/     match-provider.ts, ranking-provider.ts, cms-provider.ts (mock impls)
    format.ts      Dutch date/time helpers (nl-BE)
    seo.ts         head() builders + JSON-LD helpers
  assets/          generated brand graphics & team placeholders (CDN pointers)
```

Every section component receives its data as props; routes do the fetching from `src/content`. No component reads mock data directly, so swapping in Sanity touches only the provider layer.

## 4. Data models (Sanity-ready)

Field names and shapes are chosen to map 1:1 onto future Sanity documents; each has `_id`/`slug` and image objects rather than raw string paths.

- **Team** — `id`, `slug`, `name`, `category: "competitief" | "recreatief"`, `level` (e.g. "Nat 3", "Promo 1"), `shortDescription`, `description`, `photo: ImageRef`, `coach: Person`, `assistantCoach?`, `trainings: TrainingSlot[]`, `players: Player[]`, `externalRefs: { rankingId?, calendarId? }`, `order`.
- **Player** — `name`, `number?`, `position?`, `photo?`.
- **TrainingSlot** — `day`, `startTime`, `endTime`, `venueId`.
- **Match** — `id`, `teamId`, `dateTime` (ISO), `opponent`, `isHome`, `venue: VenueRef`, `competition`, `result?: { setsFor, setsAgainst, scoreLine? }`, `status: "scheduled" | "played" | "postponed"`, `sourceId?`.
- **RankingEntry** — `teamId`, `position`, `division`, `played`, `points`, `setsFor`, `setsAgainst`, `form: ("W" | "L")[]` (last 5), `updatedAt`, `sourceId?`.
- **Activity** — `id`, `slug`, `title`, `date`/`dateRange`, `location`, `excerpt`, `body?`, `image?`, `ctaUrl?`.
- **Sponsor** — `id`, `name`, `logo: ImageRef`, `websiteUrl`, `tier: "hoofdsponsor" | "partner" | "supporter"`.
- **BoardMember** — `name`, `role`, `email?`, `photo?`, `order`.
- **Venue** — `id`, `name`, `street`, `postalCode`, `city`, `mapUrl`, `notes`.
- **ClubInfo** — story blocks, values, mission, foundingYear, contact email/phone, socials.
- **ImageRef** — `{ url, alt, width?, height? }` so a Sanity image asset maps cleanly.

Collections are always rendered by mapping over arrays — team counts, section counts and sponsor counts are never hardcoded.

## 5. Future integrations

- `src/lib/providers/` defines async interfaces: `MatchProvider.getUpcoming(limit, teamId?)`, `MatchProvider.getCalendar(teamId, season)`, `RankingProvider.getStanding(teamId)`, `CmsProvider.getTeams()`. Today each resolves mock data; later they call a parser endpoint or Sanity client — component props don't change.
- Loaders use `context.queryClient.ensureQueryData(queryOptions)` with per-entity query keys (`["matches","upcoming"]`, `["ranking",teamId]`), so live sources gain caching/refetch for free.
- `externalRefs`/`sourceId` fields carry federation IDs so parsed rows can be matched to CMS teams.
- `/studio` stays a static placeholder page until Sanity Studio is mounted (Studio brings its own login; nothing auth-related is built now).

## 6. Mobile-first strategy

Base styles target ~375px and scale up at `sm`/`md`/`lg`. Single-column stacks by default; grids promote at `md`. Match rows render as compact stacked cards on mobile and align into a row grid on desktop — never a horizontally scrolling table. Header/text rows use `grid-cols-[minmax(0,1fr)_auto]` with `min-w-0` + `shrink-0` per the responsive rules. Touch targets ≥44px, thumb-reachable mobile nav, fluid type via `clamp()`, hover effects gated behind `@media (hover: hover)`.

## 7. SEO strategy

- Real routes per section (not hash anchors); every leaf route defines its own `head()` with unique Dutch title (<60 chars), description (<160), `og:title`, `og:description`, plus `og:image`/`twitter:image` on pages with a real hero asset. `og:type`/`twitter:card` on root.
- `lang="nl"`, single `<h1>` per page, semantic `<header>/<main>/<section>/<article>`, descriptive alt text, canonical links.
- JSON-LD: `SportsClub` (with `address`, `sameAs`) on home/contact, `SportsTeam` on team detail, `Event` for matches and activities.
- Team detail pages get dynamic per-team metadata from the slug; a `notFound()` team returns a generic title + `noindex`.
- Lazy-loaded below-fold imagery, `robots.txt` and sitemap-friendly route list, minimal client JS.

## 8. Build order

1. Design tokens, fonts, brand graphics, root layout + nav/footer.
2. Content types, mock data, provider layer, formatting helpers.
3. Home page sections.
4. Teams overview + team detail template.
5. Club and Contact pages, `/studio` placeholder, 404.
6. SEO metadata, JSON-LD, accessibility and responsive pass.
