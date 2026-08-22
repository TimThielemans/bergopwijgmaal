import type {
  Activity,
  BoardMember,
  ClubInfo,
  Player,
  Sponsor,
  Team,
  TrainingSlot,
  Venue,
} from "@/content/types";
import { sanityConfig } from "@/lib/config";
import { list, num, text } from "@/lib/safe";
import { sanityImageUrl } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/fetch.functions";
import {
  ACTIVITIES_QUERY,
  BOARD_MEMBERS_QUERY,
  CLUB_INFO_QUERY,
  SPONSORS_QUERY,
  TEAMS_QUERY,
  TEAM_BY_SLUG_QUERY,
  VENUES_QUERY,
} from "@/lib/sanity/queries";
import { mockCmsProvider } from "./mock-cms";
import type { CmsProvider } from "./types";

/**
 * Sanity CMS provider — the single source of truth once configured.
 *
 * Reads go through a server function (`sanityFetch`) because the Sanity project
 * requires an authenticated read token; the token stays server-side. Every read
 * is mapped onto the website view models, so components stay unchanged. If a
 * query fails or returns nothing, the typed mock content is used instead: the
 * site keeps rendering, never a blank page.
 */

async function fetchOr<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!sanityConfig.enabled) return fallback;
  try {
    const result = await sanityFetch({ data: { query, params } });
    return (result ?? fallback) as T;
  } catch (error) {
    console.error("[sanity] query mislukt, mock content wordt gebruikt:", error);
    return fallback;
  }
}

type RawTeam = {
  teamId?: string;
  slug?: string;
  name?: string;
  shortName?: string;
  category?: string;
  level?: string;
  shortDescription?: string;
  description?: string;
  photo?: unknown;
  photoAlt?: string;
  coach?: string;
  assistantCoach?: string;
  order?: number;
  trainings?: Array<{ day?: string; startTime?: string; endTime?: string; venueId?: string }>;
  players?: Array<{ name?: string; number?: number; position?: string }>;
  parser?: {
    volleyScoresUrl?: string;
    rankingUrl?: string;
    calendarUrl?: string;
    competitionCode?: string;
    divisionCode?: string;
    parserEnabled?: boolean;
  };
};

function mapTeam(raw: RawTeam | null | undefined): Team | null {
  const teamId = text(raw?.teamId);
  const slug = text(raw?.slug);
  if (!teamId || !slug) return null;

  const name = text(raw?.name, "Ploeg");
  const coach = text(raw?.coach);
  const assistant = text(raw?.assistantCoach);
  const photoUrl = sanityImageUrl(raw?.photo, 1200);

  const trainings: TrainingSlot[] = list(raw?.trainings)
    .map((slot) => {
      const day = text(slot?.day);
      if (!day) return null;
      return {
        day,
        startTime: text(slot?.startTime),
        endTime: text(slot?.endTime),
        venueId: text(slot?.venueId),
      } satisfies TrainingSlot;
    })
    .filter((slot): slot is TrainingSlot => slot !== null);

  const players: Player[] = list(raw?.players)
    .map((player) => {
      const playerName = text(player?.name);
      if (!playerName) return null;
      return {
        name: playerName,
        ...(typeof player?.number === "number" ? { number: player.number } : {}),
        ...(text(player?.position) ? { position: text(player?.position) } : {}),
      } satisfies Player;
    })
    .filter((player): player is Player => player !== null);

  return {
    teamId,
    slug,
    name,
    shortName: text(raw?.shortName, name.slice(0, 3).toUpperCase()),
    category: raw?.category === "recreatief" ? "recreatief" : "competitief",
    level: text(raw?.level),
    shortDescription: text(raw?.shortDescription),
    description: text(raw?.description),
    ...(photoUrl ? { photo: { url: photoUrl, alt: text(raw?.photoAlt, `Ploegfoto ${name}`) } } : {}),
    coach: coach ? { name: coach, role: "Hoofdcoach" } : { name: "" },
    ...(assistant ? { assistantCoach: { name: assistant, role: "Assistent" } } : {}),
    trainings,
    players,
    parser: {
      teamId,
      slug,
      ...(text(raw?.parser?.volleyScoresUrl)
        ? { volleyScoresUrl: text(raw?.parser?.volleyScoresUrl) }
        : {}),
      ...(text(raw?.parser?.rankingUrl) ? { rankingUrl: text(raw?.parser?.rankingUrl) } : {}),
      ...(text(raw?.parser?.calendarUrl) ? { calendarUrl: text(raw?.parser?.calendarUrl) } : {}),
      ...(text(raw?.parser?.competitionCode)
        ? { competitionCode: text(raw?.parser?.competitionCode) }
        : {}),
      ...(text(raw?.parser?.divisionCode) ? { divisionCode: text(raw?.parser?.divisionCode) } : {}),
      parserEnabled: raw?.parser?.parserEnabled === true,
    },
    order: num(raw?.order, 99),
  };
}

export const sanityCmsProvider: CmsProvider = {
  async getTeams() {
    const raw = await fetchOr<RawTeam[]>(TEAMS_QUERY, {}, []);
    const teams = list(raw)
      .map(mapTeam)
      .filter((team): team is Team => team !== null)
      .sort((a, b) => a.order - b.order);
    return teams.length > 0 ? teams : mockCmsProvider.getTeams();
  },

  async getTeamBySlug(slug) {
    const wanted = text(slug);
    if (!wanted) return null;
    const raw = await fetchOr<RawTeam | null>(TEAM_BY_SLUG_QUERY, { slug: wanted }, null);
    return mapTeam(raw) ?? mockCmsProvider.getTeamBySlug(wanted);
  },

  async getVenues() {
    const raw = await fetchOr<Venue[]>(VENUES_QUERY, {}, []);
    const venues = list(raw).filter((venue) => text(venue?.venueId).length > 0);
    return venues.length > 0 ? venues : mockCmsProvider.getVenues();
  },

  async getActivities() {
    type RawActivity = Omit<Activity, "image"> & { image?: unknown };
    const raw = await fetchOr<RawActivity[]>(ACTIVITIES_QUERY, {}, []);
    const activities = list(raw)
      .filter((item) => text(item?.title).length > 0)
      .map((item) => {
        const imageUrl = sanityImageUrl(item?.image, 1200);
        const { image: _image, ...rest } = item;
        return {
          ...rest,
          id: text(item?.id, text(item?.slug)),
          slug: text(item?.slug, text(item?.id)),
          ...(imageUrl ? { image: { url: imageUrl, alt: text(item?.title) } } : {}),
        } satisfies Activity;
      });
    return activities.length > 0 ? activities : mockCmsProvider.getActivities();
  },

  async getSponsors() {
    type RawSponsor = Omit<Sponsor, "logo"> & { logo?: unknown };
    const raw = await fetchOr<RawSponsor[]>(SPONSORS_QUERY, {}, []);
    const sponsors = list(raw)
      .filter((item) => text(item?.name).length > 0)
      .map((item) => {
        const logoUrl = sanityImageUrl(item?.logo, 400);
        const { logo: _logo, ...rest } = item;
        return {
          ...rest,
          id: text(item?.id, text(item?.name)),
          websiteUrl: text(item?.websiteUrl),
          tier: item?.tier ?? "supporter",
          ...(logoUrl ? { logo: { url: logoUrl, alt: text(item?.name) } } : {}),
        } satisfies Sponsor;
      });
    return sponsors.length > 0 ? sponsors : mockCmsProvider.getSponsors();
  },

  async getBoardMembers() {
    const raw = await fetchOr<BoardMember[]>(BOARD_MEMBERS_QUERY, {}, []);
    const members = list(raw)
      .filter((member) => text(member?.name).length > 0)
      .map((member) => ({ ...member, order: num(member?.order, 99) }))
      .sort((a, b) => a.order - b.order);
    return members.length > 0 ? members : mockCmsProvider.getBoardMembers();
  },

  async getClubInfo() {
    const raw = await fetchOr<ClubInfo | null>(CLUB_INFO_QUERY, {}, null);
    const fallback = await mockCmsProvider.getClubInfo();
    if (!raw || !text(raw.name)) return fallback;
    return {
      ...fallback,
      ...raw,
      storyBlocks: list(raw.storyBlocks).length > 0 ? list(raw.storyBlocks) : fallback.storyBlocks,
      values: list(raw.values).length > 0 ? list(raw.values) : fallback.values,
      socials: list(raw.socials).length > 0 ? list(raw.socials) : fallback.socials,
      foundingYear: num(raw.foundingYear, fallback.foundingYear),
    };
  },
};
