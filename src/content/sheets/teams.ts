import teamA from "@/assets/team-a.jpg";
import teamB from "@/assets/team-b.jpg";
import teamC from "@/assets/team-c.jpg";
import type { TeamRecord } from "../types";

/**
 * Sheet: Teams — one flat row per team, keyed by `teamId`.
 * Players, trainings and parser links live in their own sheets and reference
 * this id. Photos are temporary placeholders: `photoUrl` is optional and every
 * layout has a branded fallback.
 */
export const TEAM_RECORDS: TeamRecord[] = [
  {
    teamId: "heren-a",
    slug: "heren-a",
    name: "Heren A",
    shortName: "HA",
    category: "competitief",
    level: "Nationale 3",
    shortDescription: "Onze eerste herenploeg in Nationale 3.",
    description:
      "Heren A is het sportieve uitstalraam van Berg-Op. De ploeg combineert eigen opgeleide spelers met ervaren versterking en speelt elke thuiswedstrijd voor een volle tribune in Wijgmaal.",
    photoUrl: teamA,
    photoAlt: "Spelers van Heren A in de sporthal",
    coach: "Tom Vandenberghe",
    assistantCoach: "Bram Cools",
    order: 1,
  },
  {
    teamId: "dames-a",
    slug: "dames-a",
    name: "Dames A",
    shortName: "DA",
    category: "competitief",
    level: "Promo 1",
    shortDescription: "Ambitieuze damesploeg in Promo 1.",
    description:
      "Dames A speelt een snelle, agressieve volleybalstijl en mikt dit seizoen op de top drie. De kern is grotendeels samen opgegroeid binnen de club.",
    photoUrl: teamB,
    photoAlt: "Aanval aan het net tijdens een wedstrijd",
    coach: "Katrien Boone",
    order: 2,
  },
  {
    teamId: "heren-b",
    slug: "heren-b",
    name: "Heren B",
    shortName: "HB",
    category: "competitief",
    level: "Promo 2",
    shortDescription: "Doorgroeiploeg richting Heren A.",
    description:
      "Heren B is de brug tussen recreatie en nationaal niveau. Spelers krijgen hier speelminuten en groeien door naar de A-kern, in een sfeer die altijd familiaal blijft.",
    coach: "Pieter Goossens",
    order: 3,
  },
  {
    teamId: "dames-b",
    slug: "dames-b",
    name: "Dames B",
    shortName: "DB",
    category: "competitief",
    level: "Promo 3",
    shortDescription: "Jonge damesploeg met veel groeimarge.",
    description:
      "Dames B combineert competitie met plezier. De ploeg bestaat uit spelers die net de stap naar seniorenvolleybal zetten en elke week beter worden.",
    coach: "Sofie Delporte",
    order: 4,
  },
  {
    teamId: "recrea-mix-1",
    slug: "recrea-mix-1",
    name: "Recrea Mix 1",
    shortName: "RM1",
    category: "recreatief",
    level: "Recreatief gemengd",
    shortDescription: "Gemengd recreatievolleybal met wekelijkse wedstrijden.",
    description:
      "Recrea Mix 1 speelt in een regionale recreatiereeks. Techniek en tactiek blijven belangrijk, maar de derde helft in de cafetaria hoort er evenzeer bij.",
    photoUrl: teamC,
    photoAlt: "Recreatieploeg in overleg tijdens de training",
    coach: "Geert Lambrechts",
    order: 5,
  },
  {
    teamId: "recrea-mix-2",
    slug: "recrea-mix-2",
    name: "Recrea Mix 2",
    shortName: "RM2",
    category: "recreatief",
    level: "Recreatief gemengd",
    shortDescription: "Instapploeg voor wie (opnieuw) wil beginnen.",
    description:
      "Nooit eerder gevolleybald of jaren gestopt? Recrea Mix 2 is de plek om rustig in te stappen. Begeleiding op maat, geen verplichtingen, veel plezier.",
    coach: "Ann Verstraeten",
    order: 6,
  },
  {
    teamId: "dames-recrea",
    slug: "dames-recrea",
    name: "Dames Recrea",
    shortName: "DR",
    category: "recreatief",
    level: "Recreatief dames",
    shortDescription: "Recreatieve damesploeg met vaste vriendengroep.",
    description:
      "Een groep die al jaren samen speelt en nieuwe spelers met open armen ontvangt. Eén training per week, aangevuld met vriendschappelijke tornooien.",
    coach: "Veerle Janssen",
    order: 7,
  },
];
