import type { Season, Venue } from "./types";
import { VENUE_RECORDS } from "./sheets/venues";

export const SEASONS: Season[] = [
  {
    id: "2026-2027",
    label: "Seizoen 2026-2027",
    startDate: "2026-08-01",
    endDate: "2027-05-31",
    isCurrent: true,
  },
  {
    id: "2025-2026",
    label: "Seizoen 2025-2026",
    startDate: "2025-09-01",
    endDate: "2026-05-31",
    isCurrent: false,
  },
];

export const CURRENT_SEASON_ID = "2026-2027";

/** Venues come straight from the Locations sheet, keyed by `venueId`. */
export const VENUES: Venue[] = VENUE_RECORDS;

export function getVenue(venueId: string): Venue | undefined {
  return VENUES.find((venue) => venue.venueId === venueId);
}

/** Main hall, or null when no venues are configured (never throws). */
export function getPrimaryVenue(): Venue | null {
  return VENUES[0] ?? null;
}
