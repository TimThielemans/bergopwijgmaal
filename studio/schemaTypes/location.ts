import { defineField, defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Locatie",
  type: "document",
  fields: [
    defineField({
      name: "venueId",
      title: "Venue ID",
      type: "string",
      description: "Stabiele sleutel, gebruikt door trainingen en de Excel-import.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "address", title: "Adres", type: "string" }),
    defineField({ name: "postalCode", title: "Postcode", type: "string" }),
    defineField({ name: "city", title: "Gemeente", type: "string" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps", type: "url" }),
    defineField({ name: "notes", title: "Nota", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});
