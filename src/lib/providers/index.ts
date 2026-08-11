import { queryOptions } from "@tanstack/react-query";
import { CURRENT_SEASON_ID } from "@/content";
import { mockCmsProvider } from "./mock-cms";
import { staticJsonMatchProvider, staticJsonRankingProvider } from "./static-json";
import type { CmsProvider, MatchProvider, RankingProvider, UpcomingMatchesQuery } from "./types";

/**
 * Active provider selection — the only place to change when the data source changes.
 *
 * matches/rankings -> generated static JSON (VolleyDataParser output)
 * teams/content    -> typed mock modules (future: Sanity CMS)
 */
export const matchProvider: MatchProvider = staticJsonMatchProvider;
export const rankingProvider: RankingProvider = staticJsonRankingProvider;
export const cmsProvider: CmsProvider = mockCmsProvider;

export type { CmsProvider, MatchProvider, RankingProvider, UpcomingMatchesQuery };

/* Query options — shared by route loaders and components. */

export const teamsQuery = () =>
  queryOptions({
    queryKey: ["teams"] as const,
    queryFn: () => cmsProvider.getTeams(),
  });

export const teamQuery = (slug: string) =>
  queryOptions({
    queryKey: ["team", slug] as const,
    queryFn: () => cmsProvider.getTeamBySlug(slug),
  });

export const upcomingMatchesQuery = (query: UpcomingMatchesQuery = {}) =>
  queryOptions({
    queryKey: [
      "matches",
      "upcoming",
      query.seasonId ?? CURRENT_SEASON_ID,
      query.teamId ?? "all",
      query.limit ?? 5,
    ] as const,
    queryFn: () => matchProvider.getUpcoming(query),
  });

export const teamCalendarQuery = (teamId: string, seasonId: string = CURRENT_SEASON_ID) =>
  queryOptions({
    queryKey: ["matches", "calendar", seasonId, teamId] as const,
    queryFn: () => matchProvider.getCalendar(teamId, seasonId),
  });

export const standingsQuery = (seasonId: string = CURRENT_SEASON_ID) =>
  queryOptions({
    queryKey: ["rankings", seasonId] as const,
    queryFn: () => rankingProvider.getAllStandings(seasonId),
  });

export const standingQuery = (teamId: string, seasonId: string = CURRENT_SEASON_ID) =>
  queryOptions({
    queryKey: ["ranking", seasonId, teamId] as const,
    queryFn: () => rankingProvider.getStanding(teamId, seasonId),
  });
