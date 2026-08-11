import { TEAMS } from "@/content";
import type { CmsProvider } from "./types";

/**
 * Mock CMS provider: typed content modules stand in for Sanity documents.
 * Replacing this with a Sanity client is a one-file change.
 */
export const mockCmsProvider: CmsProvider = {
  async getTeams() {
    return [...TEAMS].sort((a, b) => a.order - b.order);
  },
  async getTeamBySlug(slug) {
    return TEAMS.find((team) => team.slug === slug) ?? null;
  },
};
