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
    defineField({
      name: "matchdayNotice",
      title: "Matchprocedure: actuele mededeling",
      type: "text",
      rows: 2,
      description: "Optioneel, bv. 'Stopcontact aan de nooduitgang tijdelijk defect'. Leeg = niets tonen.",
    }),
    defineField({
      name: "matchSetupSteps",
      title: "Matchprocedure: klaarzetten (thuisploeg)",
      type: "array",
      description: "Leeg = standaardprocedure van de website.",
      of: [defineArrayMember({ type: "object", name: "matchStep", fields: [
        defineField({ name: "text", title: "Stap", type: "string" }),
        defineField({ name: "location", title: "Waar", type: "string", options: { list: [
          { title: "Ballenkot", value: "ballenkot" },
          { title: "Verzorgingsruimte", value: "verzorging" },
          { title: "Berging/zaal", value: "berging" },
        ] } }),
      ] })],
    }),
    defineField({
      name: "matchCleanupSteps",
      title: "Matchprocedure: na de match (thuisploeg)",
      type: "array",
      description: "Leeg = standaardprocedure van de website.",
      of: [defineArrayMember({ type: "object", name: "matchCleanupStep", fields: [
        defineField({ name: "text", title: "Stap", type: "string" }),
        defineField({ name: "location", title: "Waar", type: "string", options: { list: [
          { title: "Ballenkot", value: "ballenkot" },
          { title: "Verzorgingsruimte", value: "verzorging" },
          { title: "Berging/zaal", value: "berging" },
        ] } }),
      ] })],
    }),
    defineField({
      name: "scorerPhases",
      title: "Matchprocedure: markeerders (VolleySpike)",
      type: "array",
      description: "Tijdlijn per fase. Leeg = standaardtijdlijn van de website.",
      of: [defineArrayMember({ type: "object", name: "scorerPhase", fields: [
        defineField({ name: "title", title: "Fase", type: "string" }),
        defineField({ name: "when", title: "Wanneer", type: "string" }),
        defineField({ name: "steps", title: "Stappen", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ] })],
    }),
    defineField({
      name: "matchboxContents",
      title: "Matchprocedure: inhoud van de matchbak",
      type: "array",
      description: "Leeg = standaardlijst van de website.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "netSetupSteps",
      title: "Matchprocedure: hoe zetten we het net op?",
      type: "array",
      description: "Per stap een optionele foto. Leeg = standaardstappen van de website.",
      of: [defineArrayMember({ type: "object", name: "netSetupStep", fields: [
        defineField({ name: "text", title: "Stap", type: "string" }),
        defineField({ name: "location", title: "Waar", type: "string", options: { list: [
          { title: "Ballenkot", value: "ballenkot" },
          { title: "Verzorgingsruimte", value: "verzorging" },
          { title: "Berging/zaal", value: "berging" },
        ] } }),
        defineField({ name: "photo", title: "Foto (optioneel)", type: "image" }),
      ] })],
    }),
    defineField({
      name: "homeTeamFaqs",
      title: "Matchprocedure: veelgestelde vragen thuisploeg",
      type: "array",
      description: "Vragen en antwoorden onder Wat als … ? Lege lijst = geen vragen tonen.",
      of: [defineArrayMember({ type: "object", name: "matchFaq", fields: [
        defineField({ name: "question", title: "Vraag", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "answer", title: "Antwoord", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      ] })],
    }),
    defineField({
      name: "scorerFaqs",
      title: "Matchprocedure: veelgestelde vragen markeerders",
      type: "array",
      description: "Vragen en antwoorden onder Wat als … ? Lege lijst = geen vragen tonen.",
      of: [defineArrayMember({ type: "object", name: "matchFaq", fields: [
        defineField({ name: "question", title: "Vraag", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "answer", title: "Antwoord", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
      ] })],
    }),
    defineField({
      name: "volleyspikeManualFile",
      title: "Matchprocedure: VolleySpike-handleiding (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "volleyspikeManualUrl",
      title: "Matchprocedure: link VolleySpike-handleiding",
      type: "url",
      description: "Gebruikt als er geen PDF is opgeladen.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site-informatie" }) },
});
