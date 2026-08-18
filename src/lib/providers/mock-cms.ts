import { TEAMS } from "@/content";
import type { Person, Player, Team, TeamExternalRefs, TrainingSlot } from "@/content/types";
import { list, num, text } from "@/lib/safe";
import type { CmsProvider } from "./types";

/**
 * Mock CMS provider: typed content modules stand in for Sanity documents.
 * Replacing this with a Sanity client is a one-file change — but keep the
 * `normalizeTeam` step: components rely on complete shapes (arrays never
 * undefined), so optional CMS fields can never break rendering.
 */

function normalizePerson(person: Person | undefined | null): Person | undefined {
  const name = text(person?.name);
  if (!name) return undefined;
  return {
    name,
    ...(text(person?.role) ? { role: text(person?.role) } : {}),
    ...(text(person?.email) ? { email: text(person?.email) } : {}),
    ...(text(person?.phone) ? { phone: text(person?.phone) } : {}),
    ...(person?.photo?.url ? { photo: person.photo } : {}),
  };
}

export function normalizeTeam(raw: Partial<Team> | null | undefined): Team | null {
  const id = text(raw?.id);
  const slug = text(raw?.slug);
  if (!id || !slug) return null;

  const trainings: TrainingSlot[] = list(raw?.trainings).filter(
    (slot) => text(slot?.day).length > 0,
  );
  const players: Player[] = list(raw?.players).filter((player) => text(player?.name).length > 0);
  const externalRefs: TeamExternalRefs = raw?.externalRefs ?? {};
  const coach = normalizePerson(raw?.coach);
  const assistant = normalizePerson(raw?.assistantCoach);

  return {
    id,
    slug,
    name: text(raw?.name, "Ploeg"),
    shortName: text(raw?.shortName, text(raw?.name, "BOW").slice(0, 3).toUpperCase()),
    category: raw?.category === "recreatief" ? "recreatief" : "competitief",
    level: text(raw?.level),
    shortDescription: text(raw?.shortDescription),
    description: text(raw?.description),
    ...(raw?.photo?.url ? { photo: raw.photo } : {}),
    coach: coach ?? { name: "" },
    ...(assistant ? { assistantCoach: assistant } : {}),
    trainings,
    players,
    externalRefs,
    order: num(raw?.order, 99),
  };
}

function allTeams(): Team[] {
  return list(TEAMS)
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
