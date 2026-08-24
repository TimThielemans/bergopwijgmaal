/**
 * Raw ranking rows -> the site's `RankingEntry` model.
 *
 * Only the **main classement** is used. A VolleyScores ranking export contains a
 * second table below the first one ("… (reserven)"): reading stops as soon as
 * that block starts, so reserve results never reach the site.
 */

import type { FormResult, Match, RankingEntry, Team } from "@/content/types";
import { rowToRecord, type RawTeamBlock } from "@/lib/parser/types";
import { fixEncoding, rowLookup, toNumber } from "./columns";
import { isOwnClub, teamSuffix } from "./teams";

export interface RankingTableRow {
  position: number;
  positionLabel: string;
  teamName: string;
  points: number;
  played: number;
  won: number;
  lost: number;
  setsFor: number;
  setsAgainst: number;
  isOwnTeam: boolean;
}

export interface RankingTable {
  teamId: string;
  division: string;
  rows: RankingTableRow[];
}

export interface AdaptRankingsInput {
  blocks: RawTeamBlock[];
  teams: Team[];
  matches: Match[];
  seasonId: string;
  generatedAt: string;
}

export interface AdaptRankingsOutput {
  rankings: RankingEntry[];
  tables: RankingTable[];
  warnings: string[];
}

/** True for the row that introduces the reserve classement (or its header). */
function startsReserveBlock(first: string, teamName: string): boolean {
  const value = `${first} ${teamName}`.toLowerCase();
  return value.includes("reserven") || /^\s*reserve\b/.test(first.toLowerCase());
}

/** `05a.` -> 5 ; ties keep their shared position number. */
function parsePosition(label: string): number {
  const match = /(\d{1,2})/.exec(String(label ?? ""));
  return match?.[1] ? Number(match[1]) : 0;
}

function formFor(teamId: string, matches: Match[]): FormResult[] {
  return matches
    .filter((match) => match.teamId === teamId && match.status === "played" && match.result)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(-5)
    .map((match): FormResult =>
      formResultFromSets(match.result?.setsFor ?? 0, match.result?.setsAgainst ?? 0),
    );
}

export function adaptRankings({
  blocks,
  teams,
  matches,
  seasonId,
  generatedAt,
}: AdaptRankingsInput): AdaptRankingsOutput {
  const warnings: string[] = [];
  const rankings: RankingEntry[] = [];
  const tables: RankingTable[] = [];
  const knownTeams = new Map(teams.map((team) => [team.teamId, team]));

  for (const block of blocks ?? []) {
    const teamId = String(block?.teamId ?? "").trim();
    const team = knownTeams.get(teamId);
    if (!teamId || !team) continue;

    const wantedSuffix = teamSuffix(team.name) || teamSuffix(team.shortName);
    const rows: RankingTableRow[] = [];
    let division = fixEncoding(String(block.divisionCode ?? "").trim());

    for (const row of block.rows ?? []) {
      const cells = rowLookup(rowToRecord(row));
      if (cells.isEmpty()) continue;

      const first = cells.at(0);
      const teamName = cells.get("Ploeg", "Team");

      // Title row of a table ("Nationale 3 Heren B"): keep as division label.
      if (first && !teamName) {
        if (startsReserveBlock(first, "")) break;
        if (!division) division = first;
        continue;
      }
      // Repeated header row -> everything below belongs to the reserve table.
      if (/^(ploeg|team)$/i.test(teamName) || startsReserveBlock(first, teamName)) break;
      if (!teamName) continue;

      const position = parsePosition(first) || rows.length + 1;
      const cleanName = fixEncoding(teamName);
      const ownClub = isOwnClub(cleanName);

      rows.push({
        position,
        positionLabel: first.trim().replace(/\.$/, ""),
        teamName: cleanName,
        points: toNumber(cells.get("Ptn", "Punten")),
        played: toNumber(cells.get("# Wed", "Wed", "Wedstrijden")),
        won: toNumber(cells.get("Gew. 3-0/3-1", "Gew. 3-0")) + toNumber(cells.get("Gew. 3-2", "Gew. 2-1")),
        lost:
          toNumber(cells.get("Verl. 3-0/3-1", "Verl. 3-0")) + toNumber(cells.get("Verl. 3-2", "Verl. 2-1")),
        setsFor: toNumber(cells.get("Gew. sets")),
        setsAgainst: toNumber(cells.get("Verl. sets")),
        isOwnTeam: ownClub && (!wantedSuffix || teamSuffix(cleanName) === wantedSuffix),
      });
    }

    if (rows.length === 0) {
      // Preseason: no ranking published yet. Not an error.
      continue;
    }

    tables.push({ teamId, division, rows });

    const ownRow = rows.find((row) => row.isOwnTeam) ?? rows.find((row) => isOwnClub(row.teamName));
    if (!ownRow) {
      warnings.push(`${team.name}: eigen ploeg niet gevonden in de stand`);
      continue;
    }

    rankings.push({
      teamId,
      seasonId,
      position: ownRow.position,
      division: division || team.level,
      played: ownRow.played,
      won: ownRow.won,
      lost: ownRow.lost,
      points: ownRow.points,
      setsFor: ownRow.setsFor,
      setsAgainst: ownRow.setsAgainst,
      form: formFor(teamId, matches),
      updatedAt: generatedAt,
      ...(block.volleySeriesId ? { sourceId: block.volleySeriesId } : {}),
    });
  }

  return { rankings, tables, warnings };
}
