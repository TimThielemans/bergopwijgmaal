import type { ParserRecord } from "../types";

/**
 * Sheet: ParserData — ID-based configuration for the VolleyDataParser.
 *
 * Only `ci` (club), `ti` (team) and `ssi` (series) vary between exports; every
 * VolleyScores URL is built from them in `src/lib/parser/urls.ts`. These mock
 * values are placeholders: the real ids live in Sanity (`team.parserData`).
 */
export const PARSER_RECORDS: ParserRecord[] = [
  {
    teamId: "heren-a",
    slug: "heren-a",
    parserEnabled: true,
    competitionCode: "NAT3",
    divisionCode: "NAT3 A",
  },
  {
    teamId: "dames-a",
    slug: "dames-a",
    parserEnabled: true,
    competitionCode: "PROMO1",
    divisionCode: "PROMO 1 B",
  },
  {
    teamId: "heren-b",
    slug: "heren-b",
    parserEnabled: true,
    competitionCode: "PROMO2",
    divisionCode: "PROMO 2 A",
  },
  {
    teamId: "dames-b",
    slug: "dames-b",
    parserEnabled: true,
    competitionCode: "PROMO3",
    divisionCode: "PROMO 3 C",
  },
  { teamId: "recrea-mix-1", slug: "recrea-mix-1", parserEnabled: false },
  { teamId: "recrea-mix-2", slug: "recrea-mix-2", parserEnabled: false },
  { teamId: "dames-recrea", slug: "dames-recrea", parserEnabled: false },
];
