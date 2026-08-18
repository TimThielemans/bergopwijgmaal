import type { Season, Venue } from "./types";

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

export const VENUES: Venue[] = [
  {
    id: "sporthal-wijgmaal",
    name: "Sporthal Ymeria",
    street: "Pastoor Bellonstraat 29",
    postalCode: "3018",
    city: "Wijgmaal (Leuven)",
    mapUrl:
      "https://www.google.com/maps/place/Sportcentrum+Ymeria/@50.9258217,4.7037821,1841m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47c15e1a4a36e29f:0x443ac624152b673e!8m2!3d50.9258217!4d4.706357!16s%2Fg%2F11c54f5fhr?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
    notes: "Onze thuiszaal met 1 volleybalunit, tribune en eigen BOW Kaffee.",
  },
  {
    id: "sportoase-wilsele",
    name: "Sportoase Philipssite",
    street: "Pastoor Eralystraat 2",
    postalCode: "3012",
    city: "Wilsele-Putkapel",
    mapUrl:
      "https://www.google.com/maps/dir//Sportoase+Wilsele-Putkapel,+Pastoor+Eralystraat+2,+3012+Leuven/@50.8667299,4.6753913,7373m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x47c15dda622ff279:0x9ead1619badea21c!2m2!1d4.7248446!2d50.9283516?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
    notes: "Extra trainingsuren voor Dames A en occassionele thuiswedstrijden voor Heren A.",
  },
];

export function getVenue(id: string): Venue | undefined {
  return VENUES.find((venue) => venue.id === id);
}

/** Main hall, or null when no venues are configured (never throws). */
export function getPrimaryVenue(): Venue | null {
  return VENUES[0] ?? null;
}

