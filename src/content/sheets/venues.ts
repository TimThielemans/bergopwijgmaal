import type { VenueRecord } from "../types";

/**
 * Sheet: Locations — one row per venue, keyed by `venueId`.
 * Trainings and matches reference this id instead of duplicating addresses.
 */
export const VENUE_RECORDS: VenueRecord[] = [
  {
    venueId: "sporthal-wijgmaal",
    name: "Sporthal Ymeria",
    address: "Pastoor Bellonstraat 29",
    postalCode: "3018",
    city: "Wijgmaal (Leuven)",
    googleMapsUrl:
      "https://www.google.com/maps/place/Sportcentrum+Ymeria/@50.9258217,4.7037821,1841m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47c15e1a4a36e29f:0x443ac624152b673e!8m2!3d50.9258217!4d4.706357!16s%2Fg%2F11c54f5fhr?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
    notes: "Onze thuiszaal met 1 volleybalunit, tribune en eigen BOW Kaffee.",
  },
  {
    venueId: "sportoase-wilsele",
    name: "Sportoase Philipssite",
    address: "Pastoor Eralystraat 2",
    postalCode: "3012",
    city: "Wilsele-Putkapel",
    googleMapsUrl:
      "https://www.google.com/maps/dir//Sportoase+Wilsele-Putkapel,+Pastoor+Eralystraat+2,+3012+Leuven/@50.8667299,4.6753913,7373m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x47c15dda622ff279:0x9ead1619badea21c!2m2!1d4.7248446!2d50.9283516?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
    notes: "Extra trainingsuren voor Dames A en occassionele thuiswedstrijden voor Heren A.",
  },
];
