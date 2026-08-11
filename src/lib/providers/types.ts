import type { Match, RankingEntry, Team } from "@/content/types";

/**
 * Provider contracts.
 *
 * Everything the site renders goes through these interfaces. Today they are
 * backed by static JSON files (`src/data/*.json`) and typed mock content
 * (`src/content/*.ts`). A Sanity client or an HTTP endpoint can be dropped in
 * later without touching a single component.
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
  getLastUpdated(): Promise<string | null>;
}

export interface CmsProvider {
  getTeams(): Promise<Team[]>;
  getTeamBySlug(slug: string): Promise<Team | null>;
}
