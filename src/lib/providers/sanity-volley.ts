import { CURRENT_SEASON_ID } from "@/content";
import type { Match, RankingEntry } from "@/content/types";
import { adaptVolleyData, type AdaptVolleyOutput } from "@/lib/adapters";
import { contentSource } from "@/lib/config";
import type { RawEnvelope } from "@/lib/parser/types";
import { sanityFetch } from "@/lib/sanity/fetch.functions";
import { VOLLEY_RAW_QUERY } from "@/lib/sanity/queries";
import { text } from "@/lib/safe";
import { mockCmsProvider } from "./mock-cms";
import { sanityCmsProvider } from "./sanity-cms";
import { staticJsonMatchProvider, staticJsonRankingProvider } from "./static-json";
import type { MatchProvider, RankingProvider, UpcomingMatchesQuery } from "./types";

/**
 * Sanity-backed match & ranking providers.
 *
 * Reads the raw parser envelopes (`volleyMatchesRaw` / `volleyRankingsRaw`),
 * runs the pure adapter layer and exposes the result through the exact same
 * contracts the components already use. When no raw rows are available (fresh
 * project, preseason, network hiccup) it transparently falls back to the
 * committed static JSON, so the site never renders empty.
 */

const cms = contentSource === "sanity" ? sanityCmsProvider : mockCmsProvider;

export interface AdaptedVolleyData extends AdaptVolleyOutput {
  /** "sanity" when adapted raw data is used, "static-json" for the fallback. */
  matchSource: "sanity" | "static-json";
  rankingSource: "sanity" | "static-json";
}

let cache: Promise<AdaptedVolleyData> | null = null;

async function loadRaw(): Promise<{ matches: RawEnvelope | null; rankings: RawEnvelope | null }> {
  try {
    const result = (await sanityFetch({ data: { query: VOLLEY_RAW_QUERY } })) as unknown as {
      matches?: RawEnvelope | null;
      rankings?: RawEnvelope | null;
    } | null;
    return { matches: result?.matches ?? null, rankings: result?.rankings ?? null };
  } catch {
    return { matches: null, rankings: null };
  }
}

export function loadAdaptedVolleyData(): Promise<AdaptedVolleyData> {
  if (!cache) {
    cache = (async () => {
      const [raw, teams, venues] = await Promise.all([
        loadRaw(),
        cms.getTeams().catch(() => []),
        cms.getVenues().catch(() => []),
      ]);

      const adapted = adaptVolleyData({
        matchesRaw: raw.matches,
        rankingsRaw: raw.rankings,
        teams,
        venues,
        seasonId: CURRENT_SEASON_ID,
      });

      return {
        ...adapted,
        matchSource: adapted.matches.length > 0 ? "sanity" : "static-json",
        rankingSource: adapted.rankings.length > 0 ? "sanity" : "static-json",
      } satisfies AdaptedVolleyData;
    })().catch((error) => {
      cache = null;
      throw error;
    });
  }
  return cache;
}

function byDateAsc(a: Match, b: Match) {
  return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
}

export const sanityVolleyMatchProvider: MatchProvider = {
  async getUpcoming(query: UpcomingMatchesQuery = {}) {
    const { limit = 5, teamId, seasonId = CURRENT_SEASON_ID } = query;
    const data = await loadAdaptedVolleyData();
    if (data.matchSource !== "sanity") return staticJsonMatchProvider.getUpcoming(query);

    const now = Date.now();
    const max = Number.isFinite(limit) && limit > 0 ? limit : 5;
    return data.matches
      .filter((match) => match.seasonId === seasonId)
      .filter((match) => match.status !== "played")
      .filter((match) => (teamId ? match.teamId === teamId : true))
      .filter((match) => new Date(match.dateTime).getTime() >= now - 1000 * 60 * 60 * 4)
      .sort(byDateAsc)
      .slice(0, max);
  },
  async getCalendar(teamId, seasonId = CURRENT_SEASON_ID) {
    if (!text(teamId)) return [];
    const data = await loadAdaptedVolleyData();
    if (data.matchSource !== "sanity") return staticJsonMatchProvider.getCalendar(teamId, seasonId);
    return data.matches
      .filter((match) => match.teamId === teamId && match.seasonId === seasonId)
      .sort(byDateAsc);
  },
  async getLastUpdated() {
    const data = await loadAdaptedVolleyData();
    if (data.matchSource !== "sanity") return staticJsonMatchProvider.getLastUpdated();
    return data.generatedAt || null;
  },
};

export const sanityVolleyRankingProvider: RankingProvider = {
  async getStanding(teamId, seasonId = CURRENT_SEASON_ID) {
    if (!text(teamId)) return null;
    const data = await loadAdaptedVolleyData();
    if (data.rankingSource !== "sanity") {
      return staticJsonRankingProvider.getStanding(teamId, seasonId);
    }
    return (
      data.rankings.find((entry) => entry.teamId === teamId && entry.seasonId === seasonId) ?? null
    );
  },
  async getAllStandings(seasonId = CURRENT_SEASON_ID): Promise<RankingEntry[]> {
    const data = await loadAdaptedVolleyData();
    if (data.rankingSource !== "sanity") return staticJsonRankingProvider.getAllStandings(seasonId);
    return data.rankings.filter((entry) => entry.seasonId === seasonId);
  },
  async getLastUpdated() {
    const data = await loadAdaptedVolleyData();
    if (data.rankingSource !== "sanity") return staticJsonRankingProvider.getLastUpdated();
    return data.rankingsGeneratedAt || data.generatedAt || null;
  },
};
