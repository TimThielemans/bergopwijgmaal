/**
 * Adapter layer: raw VolleyScores envelopes -> the site's frontend model.
 *
 * The raw documents (`volleyMatchesRaw` / `volleyRankingsRaw`) stay the source of
 * truth and are never rewritten. This layer is pure and side-effect free, so it
 * can run on the server and in tests.
 */

import type { Match, RankingEntry, Team, Venue } from "@/content/types";
import type { RawEnvelope } from "@/lib/parser/types";
import { adaptMatches } from "./matches";
import { adaptRankings, type RankingTable } from "./rankings";

export interface AdaptVolleyInput {
  matchesRaw: RawEnvelope | null;
  rankingsRaw: RawEnvelope | null;
  teams: Team[];
  venues: Venue[];
  seasonId: string;
}

export interface AdaptVolleyOutput {
  matches: Match[];
  rankings: RankingEntry[];
  tables: RankingTable[];
  generatedAt: string;
  rankingsGeneratedAt: string;
  warnings: string[];
}

export function adaptVolleyData({
  matchesRaw,
  rankingsRaw,
  teams,
  venues,
  seasonId,
}: AdaptVolleyInput): AdaptVolleyOutput {
  const generatedAt = String(matchesRaw?.generatedAt ?? "");
  const rankingsGeneratedAt = String(rankingsRaw?.generatedAt ?? "");

  const matchResult = adaptMatches({
    blocks: matchesRaw?.blocks ?? [],
    teams,
    venues,
    seasonId,
  });

  const rankingResult = adaptRankings({
    blocks: rankingsRaw?.blocks ?? [],
    teams,
    matches: matchResult.matches,
    seasonId,
    generatedAt: rankingsGeneratedAt || generatedAt,
  });

  return {
    matches: matchResult.matches,
    rankings: rankingResult.rankings,
    tables: rankingResult.tables,
    generatedAt,
    rankingsGeneratedAt,
    warnings: [...matchResult.warnings, ...rankingResult.warnings],
  };
}

export { adaptMatches } from "./matches";
export { adaptRankings, type RankingTable, type RankingTableRow } from "./rankings";
