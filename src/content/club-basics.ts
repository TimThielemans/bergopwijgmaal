import type { Season, Venue } from "./types";

export const SEASONS: Season[] = [
  {
    id: "2026-2027",
    label: "Seizoen 2026-2027",
    startDate: "2026-09-01",
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


export const VENUES: Venue[] = [
  {
    id: "sporthal-wijgmaal",
    name: "Sporthal Wijgmaal",
    street: "Vaartkom 12",
    postalCode: "3018",
    city: "Wijgmaal (Leuven)",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sporthal+Wijgmaal+Leuven",
    notes: "Twee volleybalvelden, tribune en clubhuis met cafetaria.",
  },
  {
    id: "sportoase-leuven",
    name: "Sportoase Philipssite",
    street: "Philipssite 6",
    postalCode: "3001",
    city: "Leuven",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sportoase+Philipssite+Leuven",
    notes: "Extra trainingsuren voor de jeugd- en recreaploegen.",
  },
];

export function getVenue(id: string): Venue | undefined {
  return VENUES.find((venue) => venue.id === id);
}
