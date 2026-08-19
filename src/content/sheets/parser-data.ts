import type { ParserRecord } from "../types";

/**
 * Sheet: ParserData — join keys and configuration for the future
 * VolleyDataParser (static JSON exports today, no live API assumed).
 * Rows in `src/data/*.json` are matched onto teams through these keys.
 */
export const PARSER_RECORDS: ParserRecord[] = [
  {
    teamId: "heren-a",
    slug: "heren-a",
    volleyScoresUrl: "https://www.volleyscores.be/team/heren-a",
    rankingUrl: "https://www.volleyscores.be/team/heren-a/klassement",
    calendarUrl: "https://www.volleyscores.be/team/heren-a/kalender",
    competitionCode: "NAT3",
    divisionCode: "NAT3 A",
    parserEnabled: true,
  },
  {
    teamId: "dames-a",
    slug: "dames-a",
    volleyScoresUrl: "https://www.volleyscores.be/team/dames-a",
    rankingUrl: "https://www.volleyscores.be/team/dames-a/klassement",
    calendarUrl: "https://www.volleyscores.be/team/dames-a/kalender",
    competitionCode: "PROMO1",
    divisionCode: "PROMO 1 B",
    parserEnabled: true,
  },
  {
    teamId: "heren-b",
    slug: "heren-b",
    volleyScoresUrl: "https://www.volleyscores.be/team/heren-b",
    rankingUrl: "https://www.volleyscores.be/team/heren-b/klassement",
    calendarUrl: "https://www.volleyscores.be/team/heren-b/kalender",
    competitionCode: "PROMO2",
    divisionCode: "PROMO 2 A",
    parserEnabled: true,
  },
  {
    teamId: "dames-b",
    slug: "dames-b",
    volleyScoresUrl: "https://www.volleyscores.be/team/dames-b",
    rankingUrl: "https://www.volleyscores.be/team/dames-b/klassement",
    calendarUrl: "https://www.volleyscores.be/team/dames-b/kalender",
    competitionCode: "PROMO3",
    divisionCode: "PROMO 3 C",
    parserEnabled: true,
  },
  { teamId: "recrea-mix-1", slug: "recrea-mix-1", parserEnabled: false },
  { teamId: "recrea-mix-2", slug: "recrea-mix-2", parserEnabled: false },
  { teamId: "dames-recrea", slug: "dames-recrea", parserEnabled: false },
];
