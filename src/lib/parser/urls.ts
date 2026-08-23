/**
 * VolleyScores export URL builder — the single source of truth.
 *
 * No VolleyScores URL is stored in the CMS. Team documents only carry the three
 * ids that actually vary:
 *   ci  -> volleyClubId
 *   ti  -> volleyTeamId
 *   ssi -> volleySeriesId
 * Everything else in the query string is fixed (`a=me` = wedstrijden,
 * `a=re` = stand, `f=1` = XLS-export).
 */

export const VOLLEYSCORES_ORIGIN = "https://www.volleyscores.be";

export interface VolleyIds {
  volleyClubId?: string;
  volleyTeamId?: string;
  volleySeriesId?: string;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildUrl(params: Record<string, string>): string {
  const url = new URL(`${VOLLEYSCORES_ORIGIN}/index.php`);
  url.searchParams.set("v", "2");
  url.searchParams.set("isActiveSeason", "1");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("f", "1");
  url.searchParams.set("lng", "nl");
  return url.toString();
}

/** XLS-export of the match calendar. Returns "" when ids are incomplete. */
export function buildMatchesExportUrl(ids: VolleyIds): string {
  const ci = clean(ids.volleyClubId);
  const ti = clean(ids.volleyTeamId);
  const ssi = clean(ids.volleySeriesId);
  if (!ci || !ti || !ssi) return "";
  return buildUrl({ a: "me", ci, ti, ssi });
}

/** XLS-export of the series ranking. Returns "" when the series id is missing. */
export function buildRankingExportUrl(ids: VolleyIds): string {
  const ssi = clean(ids.volleySeriesId);
  if (!ssi) return "";
  return buildUrl({ a: "re", ssi });
}

/** Public (HTML) overview page for supporters — same ids, no XLS flag. */
export function buildPublicOverviewUrl(ids: VolleyIds): string {
  const ssi = clean(ids.volleySeriesId);
  if (!ssi) return "";
  const url = new URL(`${VOLLEYSCORES_ORIGIN}/index.php`);
  url.searchParams.set("v", "2");
  url.searchParams.set("isActiveSeason", "1");
  url.searchParams.set("a", "me");
  const ci = clean(ids.volleyClubId);
  const ti = clean(ids.volleyTeamId);
  if (ci) url.searchParams.set("ci", ci);
  if (ti) url.searchParams.set("ti", ti);
  url.searchParams.set("ssi", ssi);
  url.searchParams.set("lng", "nl");
  return url.toString();
}

/** Lists the ids that are required but missing for a full parser run. */
export function missingParserIds(ids: VolleyIds): string[] {
  const missing: string[] = [];
  if (!clean(ids.volleyClubId)) missing.push("volleyClubId (ci)");
  if (!clean(ids.volleyTeamId)) missing.push("volleyTeamId (ti)");
  if (!clean(ids.volleySeriesId)) missing.push("volleySeriesId (ssi)");
  return missing;
}

/** Guard: only our own volleyscores.be export URLs may ever be fetched. */
export function isAllowedExportUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "www.volleyscores.be";
  } catch {
    return false;
  }
}
