import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Raw VolleyScores output, written by the website parser.
 *
 * Structured (not a stringified blob) so the content is readable in the Studio:
 * one block per team, every block and every row carries its originating teamId.
 * These documents are machine-written — edit them only to troubleshoot.
 */

export const rawCell = defineType({
  name: "rawCell",
  title: "Cel",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Kolom", type: "string" }),
    defineField({ name: "value", title: "Waarde", type: "string" }),
  ],
  preview: { select: { title: "key", subtitle: "value" } },
});

export const rawRow = defineType({
  name: "rawRow",
  title: "Rij",
  type: "object",
  fields: [
    defineField({ name: "teamId", title: "Team ID", type: "string" }),
    defineField({
      name: "cells",
      title: "Cellen",
      type: "array",
      of: [defineArrayMember({ type: "rawCell" })],
    }),
  ],
  preview: { select: { title: "teamId" } },
});

export const rawTeamBlock = defineType({
  name: "rawTeamBlock",
  title: "Ploegblok",
  type: "object",
  fields: [
    defineField({ name: "teamId", title: "Team ID", type: "string" }),
    defineField({ name: "teamSlug", title: "Slug", type: "string" }),
    defineField({ name: "teamName", title: "Ploegnaam", type: "string" }),
    defineField({ name: "sourceUrl", title: "Bron-URL", type: "string" }),
    defineField({ name: "columns", title: "Kolommen", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "rows",
      title: "Rijen",
      type: "array",
      of: [defineArrayMember({ type: "rawRow" })],
    }),
  ],
  preview: { select: { title: "teamName", subtitle: "teamId" } },
});

export const rawError = defineType({
  name: "rawError",
  title: "Fout",
  type: "object",
  fields: [
    defineField({ name: "teamId", title: "Team ID", type: "string" }),
    defineField({ name: "kind", title: "Soort", type: "string" }),
    defineField({ name: "message", title: "Bericht", type: "string" }),
  ],
  preview: { select: { title: "message", subtitle: "teamId" } },
});

function rawEnvelope(name: string, title: string, kind: "matches" | "rankings") {
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({ name: "kind", title: "Soort", type: "string", initialValue: kind, readOnly: true }),
      defineField({ name: "generatedAt", title: "Gegenereerd op", type: "datetime" }),
      defineField({ name: "season", title: "Seizoen", type: "string" }),
      defineField({ name: "teamCount", title: "Aantal ploegen", type: "number" }),
      defineField({ name: "rowCount", title: "Aantal rijen", type: "number" }),
      defineField({
        name: "blocks",
        title: "Ploegblokken",
        type: "array",
        of: [defineArrayMember({ type: "rawTeamBlock" })],
      }),
      defineField({
        name: "errors",
        title: "Fouten",
        type: "array",
        of: [defineArrayMember({ type: "rawError" })],
      }),
    ],
    preview: {
      select: { subtitle: "generatedAt" },
      prepare: ({ subtitle }: { subtitle?: string }) => ({ title, subtitle }),
    },
  });
}

export const volleyMatchesRaw = rawEnvelope(
  "volleyMatchesRaw",
  "Volley — wedstrijden (raw)",
  "matches",
);

export const volleyRankingsRaw = rawEnvelope(
  "volleyRankingsRaw",
  "Volley — standen (raw)",
  "rankings",
);
