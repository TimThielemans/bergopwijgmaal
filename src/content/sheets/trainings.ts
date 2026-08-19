import type { TrainingRecord } from "../types";

/** Sheet: Trainings — one row per weekly slot, referencing `teamId` + `venueId`. */
export const TRAINING_RECORDS: TrainingRecord[] = [
  { teamId: "heren-a", day: "Maandag", startTime: "20:30", endTime: "22:30", venueId: "sporthal-wijgmaal" },
  { teamId: "heren-a", day: "Woensdag", startTime: "20:30", endTime: "22:30", venueId: "sporthal-wijgmaal" },

  { teamId: "dames-a", day: "Dinsdag", startTime: "20:00", endTime: "22:00", venueId: "sporthal-wijgmaal" },
  { teamId: "dames-a", day: "Donderdag", startTime: "20:00", endTime: "22:00", venueId: "sportoase-wilsele" },

  { teamId: "heren-b", day: "Maandag", startTime: "20:30", endTime: "22:30", venueId: "sportoase-wilsele" },

  { teamId: "dames-b", day: "Dinsdag", startTime: "20:00", endTime: "22:00", venueId: "sportoase-wilsele" },

  { teamId: "recrea-mix-1", day: "Woensdag", startTime: "20:30", endTime: "22:00", venueId: "sporthal-wijgmaal" },

  { teamId: "recrea-mix-2", day: "Vrijdag", startTime: "20:00", endTime: "21:30", venueId: "sporthal-wijgmaal" },

  { teamId: "dames-recrea", day: "Donderdag", startTime: "20:30", endTime: "22:00", venueId: "sportoase-wilsele" },
];
