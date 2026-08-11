import teamA from "@/assets/team-a.jpg";
import teamB from "@/assets/team-b.jpg";
import teamC from "@/assets/team-c.jpg";
import type { Team } from "./types";

/**
 * Mock team content. Replace with a Sanity query later — the shape is identical.
 * Photos are temporary placeholders: `photo` is optional and every layout has a
 * branded fallback, so these can simply be removed once real photos exist.
 */
export const TEAMS: Team[] = [
  {
    id: "heren-a",
    slug: "heren-a",
    name: "Heren A",
    shortName: "HA",
    category: "competitief",
    level: "Nationale 3",
    shortDescription: "Onze eerste herenploeg in Nationale 3.",
    description:
      "Heren A is het sportieve uitstalraam van Berg-Op. De ploeg combineert eigen opgeleide spelers met ervaren versterking en speelt elke thuiswedstrijd voor een volle tribune in Wijgmaal.",
    photo: { url: teamA, alt: "Spelers van Heren A in de sporthal", width: 1024, height: 768 },
    coach: { name: "Tom Vandenberghe", role: "Hoofdcoach" },
    assistantCoach: { name: "Bram Cools", role: "Assistent" },
    trainings: [
      { day: "Maandag", startTime: "20:30", endTime: "22:30", venueId: "sporthal-wijgmaal" },
      { day: "Woensdag", startTime: "20:30", endTime: "22:30", venueId: "sporthal-wijgmaal" },
    ],
    players: [
      { name: "Jonas Peeters", number: 1, position: "Spelverdeler" },
      { name: "Wout Claes", number: 4, position: "Hoekaanvaller" },
      { name: "Simon Maes", number: 6, position: "Midden" },
      { name: "Ruben Janssens", number: 7, position: "Hoekaanvaller" },
      { name: "Elias Vermeulen", number: 9, position: "Libero" },
      { name: "Daan De Smet", number: 11, position: "Midden" },
      { name: "Milan Coppens", number: 13, position: "Opposite" },
      { name: "Arne Willems", number: 15, position: "Spelverdeler" },
    ],
    externalRefs: { volleyScoresTeamId: "VS-BOW-H1", division: "NAT3 A" },
    order: 1,
  },
  {
    id: "dames-a",
    slug: "dames-a",
    name: "Dames A",
    shortName: "DA",
    category: "competitief",
    level: "Promo 1",
    shortDescription: "Ambitieuze damesploeg in Promo 1.",
    description:
      "Dames A speelt een snelle, agressieve volleybalstijl en mikt dit seizoen op de top drie. De kern is grotendeels samen opgegroeid binnen de club.",
    photo: { url: teamB, alt: "Aanval aan het net tijdens een wedstrijd", width: 1024, height: 768 },
    coach: { name: "Katrien Boone", role: "Hoofdcoach" },
    trainings: [
      { day: "Dinsdag", startTime: "20:00", endTime: "22:00", venueId: "sporthal-wijgmaal" },
      { day: "Donderdag", startTime: "20:00", endTime: "22:00", venueId: "sporthal-wijgmaal" },
    ],
    players: [
      { name: "Lien Vermeersch", number: 2, position: "Spelverdeler" },
      { name: "Fien Dockx", number: 3, position: "Hoekaanvaller" },
      { name: "Nore Aerts", number: 5, position: "Midden" },
      { name: "Hanne Luyten", number: 8, position: "Libero" },
      { name: "Marie Segers", number: 10, position: "Opposite" },
      { name: "Julie Wouters", number: 12, position: "Hoekaanvaller" },
      { name: "Elke Nijs", number: 14, position: "Midden" },
    ],
    externalRefs: { volleyScoresTeamId: "VS-BOW-D1", division: "PROMO 1 B" },
    order: 2,
  },
  {
    id: "heren-b",
    slug: "heren-b",
    name: "Heren B",
    shortName: "HB",
    category: "competitief",
    level: "Promo 2",
    shortDescription: "Doorgroeiploeg richting Heren A.",
    description:
      "Heren B is de brug tussen recreatie en nationaal niveau. Spelers krijgen hier speelminuten en groeien door naar de A-kern, in een sfeer die altijd familiaal blijft.",
    coach: { name: "Pieter Goossens", role: "Hoofdcoach" },
    trainings: [
      { day: "Maandag", startTime: "20:30", endTime: "22:30", venueId: "sportoase-leuven" },
    ],
    players: [
      { name: "Thomas Hermans", number: 3, position: "Hoekaanvaller" },
      { name: "Nathan Roels", number: 5, position: "Midden" },
      { name: "Kobe Verhoeven", number: 8, position: "Spelverdeler" },
      { name: "Louis Van Damme", number: 9, position: "Libero" },
      { name: "Sander Bruyninckx", number: 12, position: "Opposite" },
      { name: "Jelle Verbeeck", number: 16, position: "Midden" },
    ],
    externalRefs: { volleyScoresTeamId: "VS-BOW-H2", division: "PROMO 2 A" },
    order: 3,
  },
  {
    id: "dames-b",
    slug: "dames-b",
    name: "Dames B",
    shortName: "DB",
    category: "competitief",
    level: "Promo 3",
    shortDescription: "Jonge damesploeg met veel groeimarge.",
    description:
      "Dames B combineert competitie met plezier. De ploeg bestaat uit spelers die net de stap naar seniorenvolleybal zetten en elke week beter worden.",
    coach: { name: "Sofie Delporte", role: "Hoofdcoach" },
    trainings: [
      { day: "Dinsdag", startTime: "20:00", endTime: "22:00", venueId: "sportoase-leuven" },
    ],
    players: [
      { name: "Amber Vints", number: 2, position: "Hoekaanvaller" },
      { name: "Lotte Michiels", number: 4, position: "Midden" },
      { name: "Sarah Timmermans", number: 6, position: "Spelverdeler" },
      { name: "Noor Van Loo", number: 7, position: "Libero" },
      { name: "Britt Ceulemans", number: 11, position: "Opposite" },
    ],
    externalRefs: { volleyScoresTeamId: "VS-BOW-D2", division: "PROMO 3 C" },
    order: 4,
  },
  {
    id: "recrea-mix-1",
    slug: "recrea-mix-1",
    name: "Recrea Mix 1",
    shortName: "RM1",
    category: "recreatief",
    level: "Recreatief gemengd",
    shortDescription: "Gemengd recreatievolleybal met wekelijkse wedstrijden.",
    description:
      "Recrea Mix 1 speelt in een regionale recreatiereeks. Techniek en tactiek blijven belangrijk, maar de derde helft in de cafetaria hoort er evenzeer bij.",
    photo: { url: teamC, alt: "Recreatieploeg in overleg tijdens de training", width: 1024, height: 768 },
    coach: { name: "Geert Lambrechts", role: "Ploegverantwoordelijke" },
    trainings: [
      { day: "Woensdag", startTime: "20:30", endTime: "22:00", venueId: "sporthal-wijgmaal" },
    ],
    players: [
      { name: "Ellen Devos" },
      { name: "Bart Peeters" },
      { name: "Karolien Smets" },
      { name: "Jef Vanhove" },
      { name: "Nele Baeten" },
      { name: "Steven Mertens" },
    ],
    externalRefs: {},
    order: 5,
  },
  {
    id: "recrea-mix-2",
    slug: "recrea-mix-2",
    name: "Recrea Mix 2",
    shortName: "RM2",
    category: "recreatief",
    level: "Recreatief gemengd",
    shortDescription: "Instapploeg voor wie (opnieuw) wil beginnen.",
    description:
      "Nooit eerder gevolleybald of jaren gestopt? Recrea Mix 2 is de plek om rustig in te stappen. Begeleiding op maat, geen verplichtingen, veel plezier.",
    coach: { name: "Ann Verstraeten", role: "Ploegverantwoordelijke" },
    trainings: [
      { day: "Vrijdag", startTime: "20:00", endTime: "21:30", venueId: "sporthal-wijgmaal" },
    ],
    players: [
      { name: "Tine Robberechts" },
      { name: "Koen Fransen" },
      { name: "Charlotte Dries" },
      { name: "Maarten Op de Beeck" },
      { name: "Isabel Cuypers" },
    ],
    externalRefs: {},
    order: 6,
  },
  {
    id: "dames-recrea",
    slug: "dames-recrea",
    name: "Dames Recrea",
    shortName: "DR",
    category: "recreatief",
    level: "Recreatief dames",
    shortDescription: "Recreatieve damesploeg met vaste vriendengroep.",
    description:
      "Een groep die al jaren samen speelt en nieuwe spelers met open armen ontvangt. Eén training per week, aangevuld met vriendschappelijke tornooien.",
    coach: { name: "Veerle Janssen", role: "Ploegverantwoordelijke" },
    trainings: [
      { day: "Donderdag", startTime: "20:30", endTime: "22:00", venueId: "sportoase-leuven" },
    ],
    players: [
      { name: "Griet Van Rompaey" },
      { name: "Sarah Leys" },
      { name: "Inge Wauters" },
      { name: "Machteld Coenen" },
      { name: "Evelien Bogaerts" },
    ],
    externalRefs: {},
    order: 7,
  },
];
