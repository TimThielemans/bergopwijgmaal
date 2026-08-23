import { defineArrayMember, defineField, defineType } from "sanity";

export const activity = defineType({
  name: "activity",
  title: "Activiteit",
  type: "document",
  fields: [
    defineField({
      name: "activityId",
      title: "Activity ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "Datum", type: "date" }),
    defineField({ name: "endDate", title: "Einddatum", type: "date" }),
    defineField({ name: "location", title: "Plaats", type: "string" }),
    defineField({ name: "excerpt", title: "Korte tekst", type: "text", rows: 3 }),
    defineField({
      name: "body",
      title: "Inhoud",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "Beeld",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
    defineField({ name: "ctaLabel", title: "CTA-label", type: "string" }),
    defineField({ name: "ctaUrl", title: "CTA-link", type: "url" }),
  ],
  preview: { select: { title: "title", subtitle: "date" } },
});

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "sponsorId",
      title: "Sponsor ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "websiteUrl", title: "Website", type: "url" }),
    defineField({
      name: "tier",
      title: "Niveau",
      type: "string",
      options: { list: ["hoofdsponsor", "partner", "supporter"] },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
  ],
  preview: { select: { title: "name", subtitle: "tier" } },
});

export const boardMember = defineType({
  name: "boardMember",
  title: "Bestuurslid",
  type: "document",
  fields: [
    defineField({ name: "memberId", title: "Member ID", type: "string" }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Functie", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "phone", title: "Telefoon", type: "string" }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
    }),
    defineField({ name: "order", title: "Sortering", type: "number", initialValue: 99 }),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});

export const storyBlock = defineType({
  name: "storyBlock",
  title: "Verhaalblok",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({ name: "body", title: "Tekst", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "title" } },
});

export const clubValue = defineType({
  name: "clubValue",
  title: "Clubwaarde",
  type: "object",
  fields: [
    defineField({ name: "valueId", title: "Value ID", type: "string" }),
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({ name: "description", title: "Omschrijving", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title" } },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Sociale link",
  type: "object",
  fields: [
    defineField({ name: "platform", title: "Platform", type: "string" }),
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

export const clubInfo = defineType({
  name: "clubInfo",
  title: "Clubinfo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Clubnaam", type: "string" }),
    defineField({ name: "tagline", title: "Slogan", type: "string" }),
    defineField({ name: "foundingYear", title: "Opgericht", type: "number" }),
    defineField({ name: "mission", title: "Missie", type: "text", rows: 4 }),
    defineField({
      name: "storyBlocks",
      title: "Verhaalblokken",
      type: "array",
      of: [defineArrayMember({ type: "storyBlock" })],
    }),
    defineField({
      name: "values",
      title: "Waarden",
      type: "array",
      of: [defineArrayMember({ type: "clubValue" })],
    }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "phone", title: "Telefoon", type: "string" }),
    defineField({
      name: "socials",
      title: "Sociale kanalen",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Clubinfo" }) },
});
