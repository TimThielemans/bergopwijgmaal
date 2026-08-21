import { useSuspenseQuery } from "@tanstack/react-query";
import type { Venue } from "@/content/types";
import { text } from "@/lib/safe";
import { siteContentQuery } from "@/lib/providers";
import type { SiteContent } from "@/lib/providers/types";

/**
 * Shared editorial content (club info, venues, activities, sponsors, board).
 *
 * Prefetched in the root/route loaders and read here from the React Query
 * cache, so components stay source-agnostic: Sanity when configured, mock
 * content otherwise.
 */
export function useSiteContent(): SiteContent {
  return useSuspenseQuery(siteContentQuery()).data;
}

export function useClubInfo(): SiteContent["clubInfo"] {
  return useSiteContent().clubInfo;
}

export function findVenue(venues: Venue[], venueId: string | undefined): Venue | undefined {
  const wanted = text(venueId);
  if (!wanted) return undefined;
  return venues.find((venue) => text(venue?.venueId) === wanted);
}

export function primaryVenue(venues: Venue[]): Venue | null {
  return venues[0] ?? null;
}
