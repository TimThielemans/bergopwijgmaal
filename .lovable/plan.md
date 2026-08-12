# Hero upgrade + team page refinements

## 1. Homepage hero — more alive, less empty

Two-column layout on large screens (single column stacked on mobile), same dark premium look:

- Left: eyebrow, headline, mission, the two buttons — tightened vertical spacing so the section reads denser.
- Right: a "Volgende thuiswedstrijd" insert card:
  - Eyebrow "Volgende thuismatch", team name vs opponent, weekday + short date + time ("Za 13 sep · 20u"), sporthal name, and an inviting line ("Kom supporteren in Wijgmaal").
  - The whole card is a link to `#wedstrijden` (the Volgende wedstrijden section).
  - Rendered only when a home match exists; otherwise the right column shows a compact abstract brand panel so the layout stays strong.
- Statistics band: bigger type, clearer separation (bordered stat cells), and an animated count-up from 0 to the value over ~1s, easing out, starting when the band scrolls into view. Runs once, respects `prefers-reduced-motion` (shows final value instantly), and renders the final value in SSR/no-JS HTML.

## 2. Clickable team in upcoming matches

In the match rows, the Berg-Op team name becomes a link to that team's page (`/ploegen/$slug`). Opponent stays plain text. Rows on the team detail page keep the same component but the self-link is harmless; it stays enabled for consistency.

## 3. Team page

- Section order becomes: Trainingen & kern → Stand & vorm → Kalender.
- Kalender section gets a "Volledig overzicht" button linking to the team's online calendar (opens in a new tab). New optional field on the team data (`externalRefs.calendarUrl`); when empty or missing, no button is rendered. Sample URLs filled in for the competitive teams, left empty for recreational.

## 4. Quiet fix

Match times currently render with the server's timezone and the browser's, producing a hydration mismatch (20:00 vs 18:00). Date/time formatting will be pinned to Europe/Brussels so server and client agree.

## Technical notes

- New: `src/components/home/NextHomeMatchCard.tsx`, `src/components/shared/CountUp.tsx` (IntersectionObserver + rAF, no new dependency).
- Edited: `HeroSection.tsx`, `src/routes/index.tsx` (pass next home match from existing upcoming-matches query, no new provider call), `MatchRow.tsx`, `TeamDetail.tsx`, `src/content/types.ts` (`calendarUrl?: string`), `src/content/teams.ts`, `src/lib/format.ts` (fixed timeZone/locale).
- No backend, no schema, no new data source; static-JSON-first provider strategy untouched.
