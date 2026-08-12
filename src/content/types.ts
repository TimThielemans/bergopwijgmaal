/**
 * Content contract for VC Berg-Op Wijgmaal.
 *
 * These types are the single source of truth for all content in the app and are
 * shaped to map 1:1 onto future Sanity CMS documents. Components never read data
 * modules directly: routes resolve data through `src/lib/providers` and pass it
 * down as props, so swapping mock data for Sanity or a JSON parser output does
 * not require component changes.
 */

export interface ImageRef {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Person {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo?: ImageRef;
}

export type TeamCategory = "competitief" | "recreatief";

export interface Player {
  name: string;
  number?: number;
  position?: string;
  photo?: ImageRef;
}

export interface TrainingSlot {
  day: string;
  startTime: string;
  endTime: string;
  venueId: string;
}

/** Join keys towards external volleyball data sources (VolleyDataParser). */
export interface TeamExternalRefs {
  /** Team id as used by volleyscores/federation exports. */
  volleyScoresTeamId?: string;
  rankingId?: string;
  calendarId?: string;
  /** Public calendar page (volleyscores etc.); when empty no link is shown. */
  calendarUrl?: string;
  division?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  /** Compact label for mobile rows, tables and badges, e.g. "HA". */
  shortName: string;
  category: TeamCategory;
  /** Competition level, e.g. "Nationale 3", "Promo 1". */
  level: string;
  shortDescription: string;
  description: string;
  /** Optional on purpose: layouts fall back to a branded tile without a photo. */
  photo?: ImageRef;
  coach: Person;
  assistantCoach?: Person;
  trainings: TrainingSlot[];
  players: Player[];
  externalRefs: TeamExternalRefs;
  order: number;
}

export interface Season {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface VenueRef {
  id: string;
  name: string;
  city?: string;
}

export interface Venue extends VenueRef {
  street: string;
  postalCode: string;
  city: string;
  mapUrl: string;
  notes?: string;
}

export type MatchStatus = "scheduled" | "played" | "postponed";

export interface MatchResult {
  setsFor: number;
  setsAgainst: number;
  scoreLine?: string;
}

export interface Match {
  id: string;
  teamId: string;
  seasonId: string;
  /** ISO 8601 date-time. */
  dateTime: string;
  opponent: string;
  isHome: boolean;
  venue: VenueRef;
  competition: string;
  matchday?: number;
  result?: MatchResult;
  status: MatchStatus;
  sourceId?: string;
}

export type FormResult = "W" | "L";

export interface RankingEntry {
  teamId: string;
  seasonId: string;
  position: number;
  division: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  setsFor: number;
  setsAgainst: number;
  /** Last five matches, oldest first. */
  form: FormResult[];
  updatedAt: string;
  sourceId?: string;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  excerpt: string;
  body?: string;
  image?: ImageRef;
  ctaUrl?: string;
  ctaLabel?: string;
}

export type SponsorTier = "hoofdsponsor" | "partner" | "supporter";

export interface Sponsor {
  id: string;
  name: string;
  logo?: ImageRef;
  websiteUrl: string;
  tier: SponsorTier;
}

export interface BoardMember extends Person {
  role: string;
  order: number;
}

export interface ClubValue {
  id: string;
  title: string;
  description: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "email" | "phone";
  label: string;
  url: string;
}

export interface ClubInfo {
  name: string;
  tagline: string;
  foundingYear: number;
  storyBlocks: { title: string; body: string }[];
  mission: string;
  values: ClubValue[];
  email: string;
  phone: string;
  socials: SocialLink[];
}

/**
 * Envelope used by generated volleyball JSON files (VolleyDataParser output).
 * Static JSON is the first-class integration shape: no live API is assumed.
 */
export interface DataEnvelope<T> {
  version: number;
  generatedAt: string;
  seasonId: string;
  source: string;
  items: T[];
}
