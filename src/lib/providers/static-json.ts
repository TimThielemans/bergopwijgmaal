import matchesFile from "@/data/matches.json";
import rankingsFile from "@/data/rankings.json";
import { CURRENT_SEASON_ID, TEAMS } from "@/content";
import type { DataEnvelope, Match, RankingEntry } from "@/content/types";
import type { MatchProvider, RankingProvider, UpcomingMatchesQuery } from "./types";

/**
 * Static-JSON providers.
 *
 * Generated volleyball data (VolleyDataParser output) is read from
 * `src/data/*.json` at build time. No live API access is assumed.
 * Rows are only kept when they can be joined onto a known team, either through
 * `teamId` or through `sourceId` <-> `externalRefs.volleyScoresTeamId`.
 */

function knownTeamId(row: { teamId?: string; sourceId?: string }): string | null {
  const byId = TEAMS.find((team) => team.id === row.teamId);
  if (byId) return byId.id;
  const bySource = row.sourceId
    ? TEAMS.find((team) => team.externalRefs.volleyScoresTeamId === row.sourceId)
    : undefined;
  return bySource ? bySource.id : null;
}

function readEnvelope<T>(file: unknown): DataEnvelope<T> {
  const envelope = file as Partial<DataEnvelope<T>>;
  if (!envelope || !Array.isArray(envelope.items)) {
    return { version: 0, generatedAt: "", seasonId: CURRENT_SEASON_ID, source: "unknown", items: [] };
  }
  return {
    version: envelope.version ?? 1,
    generatedAt: envelope.generatedAt ?? "",
    seasonId: envelope.seasonId ?? CURRENT_SEASON_ID,
    source: envelope.source ?? "unknown",
    items: envelope.items,
  };
}

const matchEnvelope = readEnvelope<Match>(matchesFile);
const rankingEnvelope = readEnvelope<RankingEntry>(rankingsFile);

const matches: Match[] = matchEnvelope.items
  .map((row) => {
    const teamId = knownTeamId(row);
    return teamId ? { ...row, teamId } : null;
  })
  .filter((row): row is Match => row !== null);

const rankings: RankingEntry[] = rankingEnvelope.items
  .map((row) => {
    const teamId = knownTeamId(row);
    return teamId ? { ...row, teamId } : null;
  })
  .filter((row): row is RankingEntry => row !== null);

function byDateAsc(a: Match, b: Match) {
  return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
}

export const staticJsonMatchProvider: MatchProvider = {
  async getUpcoming({ limit = 5, teamId, seasonId = CURRENT_SEASON_ID }: UpcomingMatchesQuery = {}) {
    const now = Date.now();
    return matches
      .filter((match) => match.seasonId === seasonId)
      .filter((match) => match.status !== "played")
      .filter((match) => (teamId ? match.teamId === teamId : true))
      .filter((match) => new Date(match.dateTime).getTime() >= now - 1000 * 60 * 60 * 4)
      .sort(byDateAsc)
      .slice(0, limit);
  },
  async getCalendar(teamId, seasonId = CURRENT_SEASON_ID) {
    return matches
      .filter((match) => match.teamId === teamId && match.seasonId === seasonId)
      .sort(byDateAsc);
  },
  async getLastUpdated() {
    return matchEnvelope.generatedAt || null;
  },
};

export const staticJsonRankingProvider: RankingProvider = {
  async getStanding(teamId, seasonId = CURRENT_SEASON_ID) {
    return (
      rankings.find((entry) => entry.teamId === teamId && entry.seasonId === seasonId) ?? null
    );
  },
  async getAllStandings(seasonId = CURRENT_SEASON_ID) {
    const order = new Map(TEAMS.map((team) => [team.id, team.order]));
    return rankings
      .filter((entry) => entry.seasonId === seasonId)
      .sort((a, b) => (order.get(a.teamId) ?? 99) - (order.get(b.teamId) ?? 99));
  },
  async getLastUpdated() {
    return rankingEnvelope.generatedAt || null;
  },
};
