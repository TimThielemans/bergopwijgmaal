import { queryOptions } from "@tanstack/react-query";
import { CURRENT_SEASON_ID } from "@/content";
import { contentSource } from "@/lib/config";
import { mockCmsProvider } from "./mock-cms";
import { sanityCmsProvider } from "./sanity-cms";
import { sanityVolleyMatchProvider, sanityVolleyRankingProvider } from "./sanity-volley";
import { staticJsonMatchProvider, staticJsonRankingProvider } from "./static-json";
import type { CmsProvider, MatchProvider, RankingProvider, SiteContent, UpcomingMatchesQuery } from "./types";

/**
 * Active provider selection — the only place to change when the data source changes.
 *
 * matches/rankings -> raw VolleyScores data in Sanity, transformed by the adapter
 *                     layer, with the generated static JSON as fallback
 * teams/content    -> Sanity CMS when VITE_SANITY_PROJECT_ID is set, otherwise
 *                     the typed mock modules in src/content/
 */
export const matchProvider: MatchProvider =
  contentSource === "sanity" ? sanityVolleyMatchProvider : staticJsonMatchProvider;
export const rankingProvider: RankingProvider =
  contentSource === "sanity" ? sanityVolleyRankingProvider : staticJsonRankingProvider;

export const cmsProvider: CmsProvider = contentSource === "sanity" ? sanityCmsProvider : mockCmsProvider;

export type { CmsProvider, MatchProvider, RankingProvider, SiteContent, UpcomingMatchesQuery };

/* Query options — shared by route loaders and components. */

export const siteContentQuery = () =>
  queryOptions({
    queryKey: ["site-content", contentSource] as const,
    queryFn: async (): Promise<SiteContent> => {
      const [clubInfo, venues, activities, sponsors, boardMembers] = await Promise.all([
        cmsProvider.getClubInfo(),
        cmsProvider.getVenues(),
        cmsProvider.getActivities(),
        cmsProvider.getSponsors(),
        cmsProvider.getBoardMembers(),
      ]);
      return { clubInfo, venues, activities, sponsors, boardMembers };
    },
  });

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
      query.limit ?? 8,
      query.withinDays ?? 0,
      query.minCount ?? 0,
    ] as const,
    queryFn: async () => {
      const matches = await matchProvider.getUpcoming(query);
      if (!query.withinDays) return matches;

      const deadline = Date.now() + query.withinDays * 24 * 60 * 60 * 1000;
      const inWindow = matches.filter((match) => new Date(match.dateTime).getTime() <= deadline);
      const minCount = query.minCount ?? 0;
      return inWindow.length >= minCount ? inWindow : matches.slice(0, minCount);
    },
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

/** Complete classement of the division the team plays in. */
export const rankingTableQuery = (teamId: string, seasonId: string = CURRENT_SEASON_ID) =>
  queryOptions({
    queryKey: ["ranking-table", seasonId, teamId] as const,
    queryFn: () => rankingProvider.getTable(teamId, seasonId),
  });
