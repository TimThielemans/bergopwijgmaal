import { defineField, defineType } from "sanity";

/**
 * ParserData — ID-based VolleyScores configuration.
 *
 * Never store full URLs here: the website builds every export and public link
 * from ci/ti/ssi (see src/lib/parser/urls.ts). All ids are optional and only
 * required when "Parser actief" is on.
 */
export const parserData = defineType({
  name: "parserData",
  title: "ParserData",
  type: "object",
  fields: [
    defineField({
      name: "parserEnabled",
      title: "Parser actief",
      type: "boolean",
      initialValue: false,
      description: "Alleen ploegen met deze schakelaar aan worden opgehaald bij VolleyScores.",
    }),
    defineField({
      name: "volleyClubId",
      title: "VolleyScores club-id (ci)",
      type: "string",
    }),
    defineField({
      name: "volleyTeamId",
      title: "VolleyScores ploeg-id (ti)",
      type: "string",
    }),
    defineField({
      name: "volleySeriesId",
      title: "VolleyScores reeks-id (ssi)",
      type: "string",
    }),
    defineField({
      name: "volleySeasonId",
      title: "VolleyScores seizoen-id (se)",
      type: "string",
      description: "Bv. 13 voor dit seizoen. Elk nieuw seizoen enkel hier aanpassen.",
    }),
    defineField({
      name: "publicUrl",
      title: "Publieke overzichtspagina (URL)",
      type: "url",
      description:
        "Link achter \"Volledig overzicht\": VolleyScores voor competitie, vlmbrabant.be voor recreatief.",
    }),
    defineField({ name: "competitionCode", title: "Competitiecode", type: "string" }),
    defineField({ name: "divisionCode", title: "Reekscode", type: "string" }),
    defineField({ name: "notes", title: "Nota", type: "text", rows: 2 }),
  ],
});
