import type {
  Activity,
  BoardMember,
  ClubInfo,
  Match,
  RankingEntry,
  Sponsor,
  Team,
  Venue,
} from "@/content/types";
import type { RankingTable } from "@/lib/adapters";

/**
 * Provider contracts.
 *
 * Everything the site renders goes through these interfaces. Match and ranking
 * data are backed by generated static JSON (`src/data/*.json`); teams and
 * editorial content come from Sanity when configured, with the typed mock
 * modules (`src/content/*.ts`) as fallback. Components never know the source.
 */

export interface UpcomingMatchesQuery {
  limit?: number;
  teamId?: string;
  seasonId?: string;
}

export interface MatchProvider {
  getUpcoming(query?: UpcomingMatchesQuery): Promise<Match[]>;
  getCalendar(teamId: string, seasonId?: string): Promise<Match[]>;
  /** ISO timestamp of the last data generation, when known. */
  getLastUpdated(): Promise<string | null>;
}

export interface RankingProvider {
  getStanding(teamId: string, seasonId?: string): Promise<RankingEntry | null>;
  getAllStandings(seasonId?: string): Promise<RankingEntry[]>;
  /** Complete classement of the team's division (main table only). */
  getTable(teamId: string, seasonId?: string): Promise<RankingTable | null>;
  getLastUpdated(): Promise<string | null>;
}

export interface CmsProvider {
  getTeams(): Promise<Team[]>;
  getTeamBySlug(slug: string): Promise<Team | null>;
  getVenues(): Promise<Venue[]>;
  getActivities(): Promise<Activity[]>;
  getSponsors(): Promise<Sponsor[]>;
  getBoardMembers(): Promise<BoardMember[]>;
  getClubInfo(): Promise<ClubInfo>;
}

/** Everything the shared layout and editorial sections need in one payload. */
export interface SiteContent {
  clubInfo: ClubInfo;
  venues: Venue[];
  activities: Activity[];
  sponsors: Sponsor[];
  boardMembers: BoardMember[];
}
