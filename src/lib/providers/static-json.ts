import matchesFile from "@/data/matches.json";
import rankingsFile from "@/data/rankings.json";
import { CURRENT_SEASON_ID, TEAMS } from "@/content";
import type { DataEnvelope, FormResult, Match, MatchStatus, RankingEntry } from "@/content/types";
import { isValidDate, list, num, text } from "@/lib/safe";
import type { MatchProvider, RankingProvider, UpcomingMatchesQuery } from "./types";

/**
 * Static-JSON providers.
 *
 * Generated volleyball data (VolleyDataParser output) is read from
 * `src/data/*.json` at build time. No live API access is assumed.
 * Rows are only kept when they can be joined onto a known team, either through
 * `teamId` or through `sourceId` <-> `externalRefs.volleyScoresTeamId`, AND when
 * they normalise into a complete, renderable shape.
 */

const teams = list(TEAMS);

function knownTeamId(row: { teamId?: string; sourceId?: string }): string | null {
  const byId = teams.find((team) => team.id === row?.teamId);
  if (byId) return byId.id;
  const source = text(row?.sourceId);
  const bySource = source
    ? teams.find((team) => team.externalRefs?.volleyScoresTeamId === source)
    : undefined;
  return bySource ? bySource.id : null;
}

function readEnvelope<T>(file: unknown): DataEnvelope<T> {
  const envelope = (file ?? {}) as Partial<DataEnvelope<T>>;
  return {
    version: num(envelope.version, 1),
    generatedAt: text(envelope.generatedAt),
    seasonId: text(envelope.seasonId, CURRENT_SEASON_ID),
    source: text(envelope.source, "unknown"),
    items: list(envelope.items),
  };
}

const matchEnvelope = readEnvelope<Partial<Match>>(matchesFile);
const rankingEnvelope = readEnvelope<Partial<RankingEntry>>(rankingsFile);

const STATUSES: MatchStatus[] = ["scheduled", "played", "postponed"];

function normalizeMatch(row: Partial<Match>, teamId: string, fallbackSeason: string): Match | null {
  if (!isValidDate(row?.dateTime)) return null;
  const status = STATUSES.includes(row?.status as MatchStatus)
    ? (row.status as MatchStatus)
    : "scheduled";
  const result =
    row?.result && (typeof row.result.setsFor === "number" || typeof row.result.setsAgainst === "number")
      ? {
          setsFor: num(row.result.setsFor),
          setsAgainst: num(row.result.setsAgainst),
          ...(text(row.result.scoreLine) ? { scoreLine: text(row.result.scoreLine) } : {}),
        }
      : undefined;

  return {
    id: text(row?.id, `${teamId}-${row?.dateTime}`),
    teamId,
    seasonId: text(row?.seasonId, fallbackSeason),
    dateTime: text(row?.dateTime),
    opponent: text(row?.opponent, "Tegenstander nog niet gekend"),
    isHome: row?.isHome === true,
    venue: {
      id: text(row?.venue?.id),
      name: text(row?.venue?.name, "Locatie nog niet gekend"),
      ...(text(row?.venue?.city) ? { city: text(row?.venue?.city) } : {}),
    },
    competition: text(row?.competition),
    ...(typeof row?.matchday === "number" ? { matchday: row.matchday } : {}),
    ...(result ? { result } : {}),
    status,
    ...(text(row?.sourceId) ? { sourceId: text(row?.sourceId) } : {}),
  };
}

function normalizeRanking(
  row: Partial<RankingEntry>,
  teamId: string,
  fallbackSeason: string,
): RankingEntry {
  const form = list(row?.form).filter((value): value is FormResult => value === "W" || value === "L");
  return {
    teamId,
    seasonId: text(row?.seasonId, fallbackSeason),
    position: num(row?.position, 0),
    division: text(row?.division),
    played: num(row?.played),
    won: num(row?.won),
    lost: num(row?.lost),
    points: num(row?.points),
    setsFor: num(row?.setsFor),
    setsAgainst: num(row?.setsAgainst),
    form: form.slice(-5),
    updatedAt: text(row?.updatedAt),
    ...(text(row?.sourceId) ? { sourceId: text(row?.sourceId) } : {}),
  };
}

const matches: Match[] = matchEnvelope.items
  .map((row) => {
    const teamId = knownTeamId(row ?? {});
    return teamId ? normalizeMatch(row ?? {}, teamId, matchEnvelope.seasonId) : null;
  })
  .filter((row): row is Match => row !== null);

const rankings: RankingEntry[] = rankingEnvelope.items
  .map((row) => {
    const teamId = knownTeamId(row ?? {});
    return teamId ? normalizeRanking(row ?? {}, teamId, rankingEnvelope.seasonId) : null;
  })
  .filter((row): row is RankingEntry => row !== null);

function byDateAsc(a: Match, b: Match) {
  return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
}

export const staticJsonMatchProvider: MatchProvider = {
  async getUpcoming({ limit = 5, teamId, seasonId = CURRENT_SEASON_ID }: UpcomingMatchesQuery = {}) {
    const now = Date.now();
    const max = Number.isFinite(limit) && limit > 0 ? limit : 5;
    return matches
      .filter((match) => match.seasonId === seasonId)
      .filter((match) => match.status !== "played")
      .filter((match) => (teamId ? match.teamId === teamId : true))
      .filter((match) => new Date(match.dateTime).getTime() >= now - 1000 * 60 * 60 * 4)
      .sort(byDateAsc)
      .slice(0, max);
  },
  async getCalendar(teamId, seasonId = CURRENT_SEASON_ID) {
    if (!text(teamId)) return [];
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
    if (!text(teamId)) return null;
    return (
      rankings.find((entry) => entry.teamId === teamId && entry.seasonId === seasonId) ?? null
    );
  },
  async getAllStandings(seasonId = CURRENT_SEASON_ID) {
    const order = new Map(teams.map((team) => [team.id, num(team.order, 99)]));
    return rankings
      .filter((entry) => entry.seasonId === seasonId)
      .sort((a, b) => (order.get(a.teamId) ?? 99) - (order.get(b.teamId) ?? 99));
  },
  async getLastUpdated() {
    return rankingEnvelope.generatedAt || null;
  },
};
