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
    defineField({
      name: "insuranceFormFile",
      title: "Verzekering: aangifteformulier (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
      description: "Blanco ongevalsaangifte / medisch attest. Heeft voorrang op de link hieronder.",
    }),
    defineField({
      name: "insuranceFormUrl",
      title: "Verzekering: link naar aangifteformulier",
      type: "url",
      description: "Gebruikt als er geen PDF is opgeladen.",
    }),
    defineField({
      name: "insuranceDeclarationUrl",
      title: "Verzekering: online ongevalsaangifte",
      type: "url",
    }),
    defineField({
      name: "insurancePolicyUrl",
      title: "Verzekering: polisvoorwaarden",
      type: "url",
    }),
    defineField({
      name: "insuranceEmail",
      title: "Verzekering: contact e-mail",
      type: "string",
      description: "Leeg = algemeen club-e-mailadres.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site-informatie" }) },
});
