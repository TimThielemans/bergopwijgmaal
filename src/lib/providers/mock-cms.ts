import { PARSER_RECORDS, PLAYER_RECORDS, TEAM_RECORDS, TRAINING_RECORDS } from "@/content";
import type {
  ParserRecord,
  Player,
  PlayerRecord,
  Team,
  TeamRecord,
  TrainingRecord,
  TrainingSlot,
} from "@/content/types";
import { list, num, text } from "@/lib/safe";
import type { CmsProvider } from "./types";

/**
 * Mock CMS provider.
 *
 * The sheet records (Teams / Players / Trainings / Locations / ParserData) are
 * the storage shape — exactly what a future Excel → CMS import will write.
 * This provider joins them by stable ids into the `Team` view model that
 * components consume. Swapping the record sources for Sanity queries is a
 * one-file change; the `normalize*` steps guarantee complete, renderable
 * shapes (arrays never undefined) whatever the CMS returns.
 */

function normalizeTraining(row: Partial<TrainingRecord> | undefined | null): TrainingSlot | null {
  const day = text(row?.day);
  if (!day) return null;
  return {
    day,
    startTime: text(row?.startTime),
    endTime: text(row?.endTime),
    venueId: text(row?.venueId),
  };
}

function normalizePlayer(row: Partial<PlayerRecord> | undefined | null): Player | null {
  const name = text(row?.name);
  if (!name) return null;
  return {
    name,
    ...(typeof row?.number === "number" ? { number: row.number } : {}),
    ...(text(row?.position) ? { position: text(row?.position) } : {}),
  };
}

function normalizeParser(row: Partial<ParserRecord> | undefined, teamId: string, slug: string): ParserRecord {
  return {
    teamId,
    slug,
    ...(text(row?.volleyScoresUrl) ? { volleyScoresUrl: text(row?.volleyScoresUrl) } : {}),
    ...(text(row?.rankingUrl) ? { rankingUrl: text(row?.rankingUrl) } : {}),
    ...(text(row?.calendarUrl) ? { calendarUrl: text(row?.calendarUrl) } : {}),
    ...(text(row?.competitionCode) ? { competitionCode: text(row?.competitionCode) } : {}),
    ...(text(row?.divisionCode) ? { divisionCode: text(row?.divisionCode) } : {}),
    parserEnabled: row?.parserEnabled === true,
  };
}

export function normalizeTeam(raw: Partial<TeamRecord> | null | undefined): Team | null {
  const teamId = text(raw?.teamId);
  const slug = text(raw?.slug);
  if (!teamId || !slug) return null;

  const trainings = list(TRAINING_RECORDS)
    .filter((row) => text(row?.teamId) === teamId)
    .map(normalizeTraining)
    .filter((slot): slot is TrainingSlot => slot !== null);

  const players = list(PLAYER_RECORDS)
    .filter((row) => text(row?.teamId) === teamId)
    .map(normalizePlayer)
    .filter((player): player is Player => player !== null);

  const parserRow = list(PARSER_RECORDS).find((row) => text(row?.teamId) === teamId);
  const coach = text(raw?.coach);
  const assistant = text(raw?.assistantCoach);
  const photoUrl = text(raw?.photoUrl);
  const name = text(raw?.name, "Ploeg");

  return {
    teamId,
    slug,
    name,
    shortName: text(raw?.shortName, name.slice(0, 3).toUpperCase()),
    category: raw?.category === "recreatief" ? "recreatief" : "competitief",
    level: text(raw?.level),
    shortDescription: text(raw?.shortDescription),
    description: text(raw?.description),
    ...(photoUrl
      ? { photo: { url: photoUrl, alt: text(raw?.photoAlt, `Ploegfoto ${name}`) } }
      : {}),
    coach: coach ? { name: coach, role: "Hoofdcoach" } : { name: "" },
    ...(assistant ? { assistantCoach: { name: assistant, role: "Assistent" } } : {}),
    trainings,
    players,
    parser: normalizeParser(parserRow, teamId, slug),
    order: num(raw?.order, 99),
  };
}

function allTeams(): Team[] {
  return list(TEAM_RECORDS)
    .map((team) => normalizeTeam(team))
    .filter((team): team is Team => team !== null);
}

export const mockCmsProvider: CmsProvider = {
  async getTeams() {
    return allTeams().sort((a, b) => a.order - b.order);
  },
  async getTeamBySlug(slug) {
    const wanted = text(slug);
    if (!wanted) return null;
    return allTeams().find((team) => team.slug === wanted) ?? null;
  },
};
