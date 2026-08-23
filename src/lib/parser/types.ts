/**
 * Raw VolleyDataParser shapes.
 *
 * The parser keeps the original VolleyScores columns untouched: every row is a
 * list of `{ key, value }` cells where `key` is the exact Dutch column header.
 * That keeps the data structured (and visible in Sanity Studio) without needing
 * a schema per column. Every block *and* every row carries its `teamId`, so a
 * row stays attributable even when blocks are flattened.
 */

export interface RawCell {
  key: string;
  value: string;
}

export interface RawRow {
  teamId: string;
  cells: RawCell[];
}

export interface RawTeamBlock {
  teamId: string;
  slug: string;
  teamName: string;
  volleyClubId: string;
  volleyTeamId: string;
  volleySeriesId: string;
  competitionCode: string;
  divisionCode: string;
  /** Built at run time from the ids; stored for traceability only. */
  sourceUrl: string;
  rows: RawRow[];
}

export type RawErrorKind = "config" | "download" | "parse" | "write";

export interface RawError {
  teamId: string;
  kind: RawErrorKind;
  message: string;
}

export interface RawEnvelope {
  version: number;
  generatedAt: string;
  source: string;
  teamCount: number;
  rowCount: number;
  blocks: RawTeamBlock[];
  errors: RawError[];
}

export interface RefreshResult {
  ok: boolean;
  generatedAt: string;
  matches: { teamCount: number; rowCount: number };
  rankings: { teamCount: number; rowCount: number };
  perTeam: Array<{
    teamId: string;
    teamName: string;
    matchRows: number;
    rankingRows: number;
    errors: string[];
  }>;
  errors: RawError[];
}

export interface VolleyDataStatus {
  configured: boolean;
  matches: { generatedAt: string; teamCount: number; rowCount: number; errorCount: number } | null;
  rankings: { generatedAt: string; teamCount: number; rowCount: number; errorCount: number } | null;
  teams: Array<{
    teamId: string;
    teamName: string;
    parserEnabled: boolean;
    missingIds: string[];
  }>;
}

/** `cells` -> plain object, for the later adapter step. */
export function rowToRecord(row: RawRow | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const cell of row?.cells ?? []) {
    const key = typeof cell?.key === "string" ? cell.key.trim() : "";
    if (key) out[key] = typeof cell?.value === "string" ? cell.value : "";
  }
  return out;
}

/** Plain object -> `cells`, dropping empty headers exactly like the PHP did. */
export function recordToCells(record: Record<string, unknown>): RawCell[] {
  return Object.entries(record)
    .filter(([key]) => key.trim().length > 0)
    .map(([key, value]) => ({
      key: key.trim(),
      value: value === null || value === undefined ? "" : String(value),
    }));
}
