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

/* ------------------------------------------------------------------ *
 * Sheet records — one interface per future Excel worksheet.
 * These are the *storage* shapes: flat rows, stable ids, references
 * instead of nesting. A future Excel → CMS import writes exactly these.
 * ------------------------------------------------------------------ */

/** Sheet: Teams */
export interface TeamRecord {
  teamId: string;
  slug: string;
  name: string;
  /** Compact label for mobile rows, tables and badges, e.g. "HA". */
  shortName: string;
  category: TeamCategory;
  /** Competition level, e.g. "Nationale 3", "Promo 1". */
  level: string;
  shortDescription: string;
  description: string;
  /** Optional on purpose: layouts fall back to a branded tile. */
  photoUrl?: string;
  photoAlt?: string;
  coach?: string;
  assistantCoach?: string;
  order: number;
}

/** Sheet: Players */
export interface PlayerRecord {
  teamId: string;
  name: string;
  number?: number;
  position?: string;
}

/** Sheet: Trainings */
export interface TrainingRecord {
  teamId: string;
  day: string;
  startTime: string;
  endTime: string;
  venueId: string;
}

/** Sheet: Locations */
export interface VenueRecord {
  venueId: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  googleMapsUrl: string;
  notes?: string;
}

/**
 * Sheet: ParserData — ID-based VolleyScores configuration.
 *
 * No full URLs are stored: every export and public link is built from these ids
 * by `src/lib/parser/urls.ts`. All ids are optional; they are only required when
 * `parserEnabled` is true.
 */
export interface ParserRecord {
  teamId: string;
  slug: string;
  parserEnabled: boolean;
  /** VolleyScores club id (query param `ci`). */
  volleyClubId?: string;
  /** VolleyScores team id (query param `ti`). */
  volleyTeamId?: string;
  /** VolleyScores series id (query param `ssi`). */
  volleySeriesId?: string;
  competitionCode?: string;
  divisionCode?: string;
  /** VolleyScores season id (query param `se`). */
  volleySeasonId?: string;
  /** Public overview page (VolleyScores or VLM Brabant) shown to supporters. */
  publicUrl?: string;
}

/* ------------------------------------------------------------------ *
 * View models — what components receive. Assembled from the records
 * above by the CMS provider (see src/lib/providers/mock-cms.ts).
 * ------------------------------------------------------------------ */

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

export interface Team {
  teamId: string;
  slug: string;
  name: string;
  shortName: string;
  category: TeamCategory;
  level: string;
  shortDescription: string;
  description: string;
  photo?: ImageRef;
  coach: Person;
  assistantCoach?: Person;
  trainings: TrainingSlot[];
  players: Player[];
  parser: ParserRecord;
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
  venueId: string;
  name: string;
  city?: string;
}

export type Venue = VenueRecord;

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


/**
 * Result class per match, following the league points system:
 * W3 = 3-0/3-1, W2 = 3-2, L2 = 2-3, L3 = 1-3/0-3.
 */
export type FormResult = "W3" | "W2" | "L2" | "L3";

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

/** Portable Text blocks as delivered by Sanity; rendered by @portabletext/react. */
export type RichText = unknown[];

/**
 * Algemene clubinformatie (singleton) die niet bij een ploeg, locatie, sponsor
 * of activiteit hoort. Eerste toepassing: lidgelden per seizoen.
 */
export interface SiteInfo {
  currentSeason: string;
  membershipFeeRecreational?: number;
  membershipFeeProvincialCompetition?: number;
  membershipFeeNationalCompetition?: number;
  membershipInfo: RichText;
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
