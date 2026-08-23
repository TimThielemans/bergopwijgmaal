import { defineArrayMember, defineField, defineType } from "sanity";

export const player = defineType({
  name: "player",
  title: "Speler",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "number", title: "Rugnummer", type: "number" }),
    defineField({ name: "position", title: "Positie", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "position" } },
});

export const training = defineType({
  name: "training",
  title: "Training",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Dag",
      type: "string",
      options: {
        list: ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"],
      },
    }),
    defineField({ name: "startTime", title: "Van", type: "string" }),
    defineField({ name: "endTime", title: "Tot", type: "string" }),
    defineField({
      name: "venue",
      title: "Locatie",
      type: "reference",
      to: [{ type: "location" }],
    }),
  ],
  preview: { select: { title: "day", subtitle: "startTime" } },
});

export const team = defineType({
  name: "team",
  title: "Ploeg",
  type: "document",
  fields: [
    defineField({
      name: "teamId",
      title: "Team ID",
      type: "string",
      description: "Stabiele sleutel, ook gebruikt door de Excel-import. Niet wijzigen.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "shortName", title: "Korte naam", type: "string" }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: { list: ["competitief", "recreatief"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "level", title: "Niveau", type: "string" }),
    defineField({ name: "shortDescription", title: "Korte beschrijving", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Beschrijving", type: "text", rows: 5 }),
    defineField({
      name: "photo",
      title: "Ploegfoto",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
    defineField({ name: "coach", title: "Hoofdcoach", type: "string" }),
    defineField({ name: "assistantCoach", title: "Assistent-coach", type: "string" }),
    defineField({ name: "order", title: "Sortering", type: "number", initialValue: 99 }),
    defineField({
      name: "players",
      title: "Kern",
      type: "array",
      of: [defineArrayMember({ type: "player" })],
    }),
    defineField({
      name: "trainings",
      title: "Trainingen",
      type: "array",
      of: [defineArrayMember({ type: "training" })],
    }),
    defineField({ name: "parser", title: "ParserData", type: "parserData" }),
  ],
  preview: { select: { title: "name", subtitle: "level" } },
});
