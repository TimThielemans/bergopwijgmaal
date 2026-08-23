/**
 * Score/set extraction.
 *
 * `Uitslag` is always written from the home team's perspective (`3-1`), the
 * adapter flips it to our own team's perspective. `Setstanden` becomes the
 * readable score line the site already renders.
 */

export interface ParsedResult {
  setsHome: number;
  setsAway: number;
  scoreLine: string;
}

export function parseResult(uitslag: string, setstanden: string): ParsedResult | null {
  const match = /^(\d{1,2})\s*[-–/]\s*(\d{1,2})$/.exec(String(uitslag ?? "").trim());
  if (!match) return null;
  const setsHome = Number(match[1]);
  const setsAway = Number(match[2]);
  if (!Number.isFinite(setsHome) || !Number.isFinite(setsAway)) return null;
  if (setsHome + setsAway === 0) return null;

  return { setsHome, setsAway, scoreLine: parseScoreLine(setstanden) };
}

/** `25-20 22-25  25-18` -> `25-20, 22-25, 25-18`. */
export function parseScoreLine(setstanden: string): string {
  const raw = String(setstanden ?? "").trim();
  if (!raw) return "";
  const sets = raw.match(/\d{1,3}\s*[-–]\s*\d{1,3}/g);
  if (!sets) return "";
  return sets.map((set) => set.replace(/\s*[-–]\s*/, "-")).join(", ");
}
