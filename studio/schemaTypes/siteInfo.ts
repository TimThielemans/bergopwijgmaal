import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Site-informatie (singleton).
 *
 * Algemene clubinformatie die niet bij een ploeg, locatie, sponsor of
 * activiteit hoort. Eerste toepassing: lidgelden per seizoen. Nieuwe algemene
 * info kan hier als extra veld bij, zonder nieuw documenttype.
 */
export const siteInfo = defineType({
  name: "siteInfo",
  title: "Site-informatie",
  type: "document",
  fields: [
    defineField({
      name: "currentSeason",
      title: "Huidig seizoen",
      type: "string",
      description: 'Bijvoorbeeld "2026-2027".',
    }),
    defineField({
      name: "membershipFeeRecreational",
      title: "Lidgeld recreatie (€)",
      type: "number",
    }),
    defineField({
      name: "membershipFeeProvincialCompetition",
      title: "Lidgeld competitie provinciaal (€)",
      type: "number",
    }),
    defineField({
      name: "membershipFeeNationalCompetition",
      title: "Lidgeld competitie nationaal (€)",
      type: "number",
    }),
    defineField({
      name: "membershipInfo",
      title: "Uitleg lidgeld",
      type: "array",
      description: "Betaling, verzekering, kortingen, blessures, ...",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Site-informatie" }) },
});
