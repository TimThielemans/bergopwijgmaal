import type { Activity, BoardMember, ClubInfo, Sponsor } from "./types";

export const CLUB_INFO: ClubInfo = {
  name: "Volleybalclub Berg-Op Wijgmaal",
  tagline: "Familiale volleybalclub met sportieve ambitie",
  foundingYear: 1972,
  mission:
    "Iedereen die graag volleybal speelt een plek geven — van Nationale 3 tot recreatief — in een club die aanvoelt als een tweede thuis.",
  storyBlocks: [
    {
      title: "Ontstaan in Wijgmaal",
      body: "Berg-Op werd in 1972 opgericht door een handvol Wijgmaalse volleyballiefhebbers die een eigen ploeg wilden. Meer dan vijftig jaar later spelen we nog altijd in dezelfde sporthal, met dezelfde mentaliteit: hard werken, samen plezier maken.",
    },
    {
      title: "Gegroeid, nooit vervreemd",
      body: "Van één ploeg naar een volwaardige club met competitieve en recreatieve teams. De structuur werd professioneler, de sfeer bleef familiaal. Wie hier binnenkomt, kent na twee trainingen de halve club.",
    },
    {
      title: "Ambitie voor de toekomst",
      body: "We willen sportief blijven groeien met een sterke A-kern én de instap laagdrempelig houden. Elke speler krijgt bij Berg-Op de kans om te spelen op het niveau dat bij hem of haar past.",
    },
  ],
  values: [
    {
      id: "familiaal",
      title: "Familiaal",
      description:
        "Spelers, ouders, supporters en bestuur kennen elkaar bij naam. Na de wedstrijd blijft iedereen nog even in de cafetaria.",
    },
    {
      id: "ambitieus",
      title: "Ambitieus",
      description:
        "We spelen om te winnen. Onze eerste ploegen trainen twee keer per week met duidelijke sportieve doelstellingen.",
    },
    {
      id: "toegankelijk",
      title: "Toegankelijk",
      description:
        "Beginner of ex-nationaal: er is een ploeg voor jou. Twee gratis proeftrainingen, zonder verplichtingen.",
    },
    {
      id: "betrouwbaar",
      title: "Betrouwbaar",
      description:
        "Duidelijke afspraken, correcte communicatie en een bestuur dat bereikbaar is. Zo blijft een club gezond.",
    },
  ],
  email: "info@bergopwijgmaal.be",
  phone: "+32 476 12 34 56",
  socials: [
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/" },
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { platform: "email", label: "info@bergopwijgmaal.be", url: "mailto:info@bergopwijgmaal.be" },
    { platform: "phone", label: "+32 476 12 34 56", url: "tel:+32476123456" },
  ],
};

export const BOARD_MEMBERS: BoardMember[] = [
  { name: "Dirk Van Eyken", role: "Voorzitter", email: "voorzitter@bergopwijgmaal.be", order: 1 },
  { name: "Els Vandeput", role: "Secretaris", email: "secretariaat@bergopwijgmaal.be", order: 2 },
  { name: "Wim Struyf", role: "Schatbewaarder", order: 3 },
  { name: "Nathalie Ceuremans", role: "Sportieve cel", order: 4 },
  { name: "Jonas Peeters", role: "Ploegverantwoordelijken", order: 5 },
  { name: "Marc Devroye", role: "Evenementen & sponsoring", order: 6 },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "clubweekend-2026",
    slug: "clubweekend",
    title: "Clubweekend in de Ardennen",
    date: "2026-09-05",
    endDate: "2026-09-06",
    location: "Durbuy",
    excerpt:
      "Twee dagen trainen, wandelen en samen tafelen met alle ploegen. De traditionele seizoensstart van Berg-Op.",
    ctaLabel: "Inschrijven",
    ctaUrl: "mailto:info@bergopwijgmaal.be?subject=Clubweekend",
  },
  {
    id: "pastaverkoop-2026",
    slug: "pastaverkoop",
    title: "Pastaverkoop",
    date: "2026-10-17",
    location: "Sporthal Wijgmaal",
    excerpt:
      "Onze bekendste actie: verse pasta en saus, opgehaald in de cafetaria. Volledige opbrengst gaat naar nieuw trainingsmateriaal.",
    ctaLabel: "Bestellen",
    ctaUrl: "mailto:info@bergopwijgmaal.be?subject=Pastaverkoop",
  },
  {
    id: "sinterklaasactie-2026",
    slug: "sinterklaasactie",
    title: "Sinterklaasactie",
    date: "2026-12-05",
    location: "Wijgmaal centrum",
    excerpt:
      "Chocolade en speculaas aan de deur, met de jongste spelers als hulpjes van de Sint. Altijd uitverkocht.",
  },
  {
    id: "kersttornooi-2026",
    slug: "kersttornooi",
    title: "Kersttornooi & receptie",
    date: "2026-12-27",
    location: "Sporthal Wijgmaal",
    excerpt:
      "Gemengde ploegen, gelegenheidsopstellingen en een nieuwjaarsreceptie voor spelers, familie en sponsors.",
  },
];

export const SPONSORS: Sponsor[] = [
  { id: "bouwwerken-claes", name: "Bouwwerken Claes", websiteUrl: "https://example.com", tier: "hoofdsponsor" },
  { id: "bakkerij-de-vaart", name: "Bakkerij De Vaart", websiteUrl: "https://example.com", tier: "partner" },
  { id: "garage-wijgmaal", name: "Garage Wijgmaal", websiteUrl: "https://example.com", tier: "partner" },
  { id: "fysio-leuven", name: "Fysio Leuven Noord", websiteUrl: "https://example.com", tier: "partner" },
  { id: "brouwerij-kom", name: "Brouwerij Vaartkom", websiteUrl: "https://example.com", tier: "supporter" },
  { id: "immo-dijle", name: "Immo Dijle", websiteUrl: "https://example.com", tier: "supporter" },
  { id: "it-partner", name: "Novanet IT", websiteUrl: "https://example.com", tier: "supporter" },
  { id: "verzekeringen-peeters", name: "Verzekeringen Peeters", websiteUrl: "https://example.com", tier: "supporter" },
];
