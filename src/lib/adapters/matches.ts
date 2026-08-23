/**
 * Raw match rows -> the site's `Match` model.
 *
 * Pure: no fetching, no Sanity, never throws. Rows that cannot be normalised are
 * dropped and reported as a warning.
 */

import type { Match, MatchStatus, Team, Venue } from "@/content/types";
import { rowToRecord, type RawTeamBlock } from "@/lib/parser/types";
import { rowLookup } from "./columns";
import { toIsoDateTime } from "./dates";
import { parseResult } from "./scores";
import { matchSides, matchVenue } from "./teams";

export interface AdaptMatchesInput {
  blocks: RawTeamBlock[];
  teams: Team[];
  venues: Venue[];
  seasonId: string;
}

export interface AdaptMatchesOutput {
  matches: Match[];
  warnings: string[];
}

export function adaptMatches({
  blocks,
  teams,
  venues,
  seasonId,
}: AdaptMatchesInput): AdaptMatchesOutput {
  const warnings: string[] = [];
  const matches: Match[] = [];
  const knownTeams = new Map(teams.map((team) => [team.teamId, team]));

  for (const block of blocks ?? []) {
    const teamId = String(block?.teamId ?? "").trim();
    const team = knownTeams.get(teamId);
    if (!teamId || !team) {
      if (teamId) warnings.push(`Wedstrijden: onbekende ploeg "${teamId}" overgeslagen`);
      continue;
    }

    for (const row of block.rows ?? []) {
      const cells = rowLookup(rowToRecord(row));
      if (cells.isEmpty()) continue;

      const dateTime = toIsoDateTime(cells.get("Datum"), cells.get("Uur", "Aanvang"));
      if (!dateTime) {
        warnings.push(`${team.name}: ongeldige datum "${cells.get("Datum")}" overgeslagen`);
        continue;
      }

      const sides = matchSides(cells.get("Thuis", "Thuisploeg"), cells.get("Bezoekers", "Bezoeker"), team);
      if (!sides) {
        warnings.push(
          `${team.name}: geen eigen ploeg gevonden in "${cells.get("Thuis")} - ${cells.get("Bezoekers")}"`,
        );
        continue;
      }

      const parsed = parseResult(cells.get("Uitslag"), cells.get("Setstanden"));
      const postponed = Boolean(cells.get("Uitgesteld"));
      const status: MatchStatus = parsed ? "played" : postponed ? "postponed" : "scheduled";

      const result = parsed
        ? {
            setsFor: sides.isHome ? parsed.setsHome : parsed.setsAway,
            setsAgainst: sides.isHome ? parsed.setsAway : parsed.setsHome,
            ...(parsed.scoreLine ? { scoreLine: parsed.scoreLine } : {}),
          }
        : undefined;

      const matchNumber = cells.get("Wedstrijdnr", "Wedstrijdnummer", "Nr");

      matches.push({
        // Include the teamId: a derby shares one match number across two blocks.
        id: matchNumber ? `${teamId}-vs-${matchNumber}` : `${teamId}-${dateTime}`,
        teamId,
        seasonId,
        dateTime,
        opponent: sides.opponent,
        isHome: sides.isHome,
        venue: matchVenue(cells.get("Sporthall", "Sporthal", "Zaal"), venues),
        competition: cells.get("Reeks", "Competitie") || team.level,
        ...(result ? { result } : {}),
        status,
        ...(matchNumber ? { sourceId: matchNumber } : {}),
      });
    }
  }

  matches.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Same match number can appear in two team blocks (derby): keep the first.
  const seen = new Set<string>();
  const unique = matches.filter((match) => {
    const key = `${match.teamId}|${match.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { matches: unique, warnings };
}
