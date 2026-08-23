import { sanityFetchServer } from "@/lib/sanity/read.server";
import { PARSER_TEAMS_QUERY, VOLLEY_RAW_STATUS_QUERY } from "@/lib/sanity/queries";
import { sanityCreateOrReplace } from "@/lib/sanity/write.server";
import { sanityConfig } from "@/lib/config";
import { fetchSheetRows } from "./sheet.server";
import { type RawEnvelope, type RawError, type RawTeamBlock, type RefreshResult, type VolleyDataStatus } from "./types";
import { buildMatchesExportUrl, buildRankingExportUrl, missingParserIds, rankingTestUrl } from "./urls";

/**
 * Shared VolleyDataParser runner — used by the admin button and by the cron
 * endpoint, so both paths behave identically.
 *
 * Configuration comes exclusively from `team.parserData` in Sanity (ci/ti/ssi).
 * Output is written to the two singletons `volleyMatchesRaw` / `volleyRankingsRaw`.
 * Nothing is written to disk; no generated data is stored anywhere else.
 */

export const MATCHES_DOC_ID = "volleyMatchesRaw";
export const RANKINGS_DOC_ID = "volleyRankingsRaw";
const SOURCE = "VolleyDataParser (VolleyScores)";

interface ParserTeam {
  teamId?: string;
  slug?: string;
  name?: string;
  parser?: {
    parserEnabled?: boolean;
    volleyClubId?: string;
    volleyTeamId?: string;
    volleySeriesId?: string;
    competitionCode?: string;
    divisionCode?: string;
  };
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function envelope(blocks: RawTeamBlock[], errors: RawError[], generatedAt: string): RawEnvelope {
  return {
    version: 1,
    generatedAt,
    source: SOURCE,
    teamCount: blocks.length,
    rowCount: blocks.reduce((total, block) => total + block.rows.length, 0),
    blocks,
    errors,
  };
}

async function loadParserTeams(): Promise<ParserTeam[]> {
  const result = await sanityFetchServer<ParserTeam[]>(PARSER_TEAMS_QUERY, {});
  return Array.isArray(result) ? result : [];
}

/** Runs the parser and stores both raw envelopes in Sanity. */
export async function runVolleyDataRefresh(): Promise<RefreshResult> {
  const generatedAt = new Date().toISOString();
  const teams = await loadParserTeams();

  const matchBlocks: RawTeamBlock[] = [];
  const rankingBlocks: RawTeamBlock[] = [];
  const errors: RawError[] = [];
  const perTeam: RefreshResult["perTeam"] = [];

  await Promise.all(
    teams.map(async (team) => {
      const teamId = str(team.teamId);
      const teamName = str(team.name) || teamId;
      if (!teamId) return;

      const ids = {
        volleyClubId: str(team.parser?.volleyClubId),
        volleyTeamId: str(team.parser?.volleyTeamId),
        volleySeriesId: str(team.parser?.volleySeriesId),
      };
      const teamErrors: string[] = [];
      const missing = missingParserIds(ids);
      if (missing.length > 0) {
        const message = `Ontbrekende parser-ids: ${missing.join(", ")}`;
        errors.push({ teamId, kind: "config", message });
        teamErrors.push(message);
      }

      const base = {
        teamId,
        slug: str(team.slug),
        teamName,
        ...ids,
        competitionCode: str(team.parser?.competitionCode),
        divisionCode: str(team.parser?.divisionCode),
      };

      const matchesUrl = buildMatchesExportUrl(ids);
      const rankingUrl = buildRankingExportUrl(ids);

      console.log(`[VolleyParser][${teamName}] Matches URL:`, matchesUrl);
      console.log(`[VolleyParser][${teamName}] Ranking URL:`, rankingUrl);
      let matchRows = 0;
      let rankingRows = 0;

      if (matchesUrl) {
        try {
          const rows = await fetchSheetRows({ url: matchesUrl, headerRowIndex: 0, teamId });
          matchRows = rows.length;
          matchBlocks.push({ ...base, sourceUrl: matchesUrl, rows });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Onbekende fout";
          errors.push({ teamId, kind: "download", message: `Wedstrijden: ${message}` });
          teamErrors.push(`Wedstrijden: ${message}`);
        }
      }

      if (rankingUrl) {
        try {
          let usedUrl = rankingUrl;
          let rows = await fetchSheetRows({ url: rankingUrl, headerRowIndex: 1, teamId });
          if (rows.length === 0) {
            // Preseason: no ranking published yet. Fall back to the validation
            // export when one is configured for this team.
            const testUrl = rankingTestUrl(teamId);
            if (testUrl) {
              const testRows = await fetchSheetRows({ url: testUrl, headerRowIndex: 1, teamId });
              if (testRows.length > 0) {
                rows = testRows;
                usedUrl = testUrl;
              }
            }
          }
          rankingRows = rows.length;
          rankingBlocks.push({ ...base, sourceUrl: usedUrl, rows });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Onbekende fout";
          errors.push({ teamId, kind: "download", message: `Stand: ${message}` });
          teamErrors.push(`Stand: ${message}`);
        }
      }

      teamErrors.push(`Matches URL: ${matchesUrl}`);
      teamErrors.push(`Ranking URL: ${rankingUrl}`);


      perTeam.push({
        teamId,
        teamName,
        matchRows,
        rankingRows,
        errors: teamErrors,
      });
    }),
  );

  perTeam.sort((a, b) => a.teamName.localeCompare(b.teamName));

  const matchesEnvelope = envelope(matchBlocks, errors, generatedAt);
  const rankingsEnvelope = envelope(rankingBlocks, errors, generatedAt);

  await sanityCreateOrReplace([
    { _id: MATCHES_DOC_ID, _type: "volleyMatchesRaw", ...matchesEnvelope },
    { _id: RANKINGS_DOC_ID, _type: "volleyRankingsRaw", ...rankingsEnvelope },
  ]);

  return {
    ok: errors.length === 0,
    generatedAt,
    matches: { teamCount: matchesEnvelope.teamCount, rowCount: matchesEnvelope.rowCount },
    rankings: { teamCount: rankingsEnvelope.teamCount, rowCount: rankingsEnvelope.rowCount },
    perTeam,
    errors,
  };
}

/** Read-only status for the admin page: last run + configuration per team. */
export async function readVolleyDataStatus(): Promise<VolleyDataStatus> {
  if (!sanityConfig.enabled) {
    return { configured: false, matches: null, rankings: null, teams: [] };
  }

  const [status, teams] = await Promise.all([
    sanityFetchServer<{
      matches: { generatedAt?: string; teamCount?: number; rowCount?: number; errorCount?: number } | null;
      rankings: { generatedAt?: string; teamCount?: number; rowCount?: number; errorCount?: number } | null;
    } | null>(VOLLEY_RAW_STATUS_QUERY, {}),
    loadParserTeams(),
  ]);

  const summarize = (
    raw: { generatedAt?: string; teamCount?: number; rowCount?: number; errorCount?: number } | null | undefined,
  ) =>
    raw
      ? {
          generatedAt: str(raw.generatedAt),
          teamCount: Number(raw.teamCount ?? 0),
          rowCount: Number(raw.rowCount ?? 0),
          errorCount: Number(raw.errorCount ?? 0),
        }
      : null;

  return {
    configured: true,
    matches: summarize(status?.matches),
    rankings: summarize(status?.rankings),
    teams: teams
      .filter((team) => str(team.teamId).length > 0)
      .map((team) => ({
        teamId: str(team.teamId),
        teamName: str(team.name) || str(team.teamId),
        parserEnabled: team.parser?.parserEnabled === true,
        missingIds: missingParserIds({
          volleyClubId: str(team.parser?.volleyClubId),
          volleyTeamId: str(team.parser?.volleyTeamId),
          volleySeriesId: str(team.parser?.volleySeriesId),
        }),
      })),
  };
}
