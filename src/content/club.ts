import type { Activity, BoardMember, ClubInfo, Sponsor } from "./types";

export const CLUB_INFO: ClubInfo = {
  name: "Volleybalclub Berg-Op Wijgmaal",
  tagline: "Familiale volleybalclub met sportieve ambitie",
  foundingYear: 1972,
  mission:
    "Iedereen die graag volleybal speelt een plek geven van Nationale 3 tot recreatief in een club die aanvoelt als een tweede thuis.",
  storyBlocks: [
    {
      title: "Ontstaan in Wijgmaal",
      body: "Berg-Op werd in 1972 opgericht door een handvol Wijgmaalse volleyballiefhebbers die een eigen ploeg wilden. Meer dan vijftig jaar later spelen we nog altijd in dezelfde sporthal, met dezelfde mentaliteit: hard werken, samen plezier maken. Gelukkig hebben we wel al eens een nieuwe vloer gekregen in onze Ymeria ;) ",
    },
    {
      title: "Gegroeid, nooit vervreemd",
      body: "Van één ploeg naar een volwaardige club met competitieve en recreatieve teams. De sfeer blijft familiaal. Wie hier binnenkomt, kent na twee trainingen de halve club.",
    },
    {
      title: "Ambitie voor de toekomst",
      body: "We willen sportief blijven groeien met een sterke A-kern én de instap laagdrempelig houden. Elke speler krijgt bij Berg-Op de kans om te spelen op het niveau dat bij hem of haar past. Voor jeugdwerking is er helaas geen plaats in de zaal, we verwijzen je hiervoor naar nabijgelegen clubs met een uitstekende jeugdwerking (e.g. VHLeuven, Lizards Lubbeek, KREG Rotselaar)",
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
      description: "Stuur ons een berichtje of kom gewoon eens langs.",
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
    title: "Clubweekend",
    date: "2026-09-04",
    endDate: "2026-09-05",
    location: "Kattevennen, Genk",
    excerpt:
      "De traditionele seizoensstart van BOW, met de hele club op weekend. Vrijdagavond een gemengd toernooi, stevig feestje achteraf. Zaterdag nog een oefenmatch of lichte training en vooral tijd voor teambuilding.",
  },
  {
    id: "startdag-2026",
    slug: "Startdag",
    title: "Startdag competitie",
    date: "2026-09-12",
    location: "Sporthal Ymeria",
    excerpt:
      "Al onze competitieve damesploegen starten hun competitie op zaterdag 12 september met een thuismatch! Om 16u trapt Dames C af in Promo 2, en om 20u30 staan Dames A en Dames B tegenover elkaar voor de eerste topmatch in Promo 1.",
  },

  {
    id: "sinterklaasactie-2026",
    slug: "sinterklaasactie",
    title: "Sinterklaasactie",
    date: "2026-12-05",
    location: "BOW Kaffee",
    excerpt:
      "Sinterklaassnoepgoed heb je altijd nodig toch? Bestel hier alvast je chocolade, koekjes, etc. en steun tegelijk onze club",
    ctaLabel: "Bestellen",
    ctaUrl: "",
  },
  {
    id: "pastaverkoop-2027",
    slug: "pastaverkoop",
    title: "Pastaverkoop",
    date: "2027-03-17",
    location: "BOW Kaffee",
    excerpt:
      "Onze bekendste en lekkerste actie: verse pastasauzen bereid door onze lieftallige Dames C, op te halen in het BOW kaffee.",
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
