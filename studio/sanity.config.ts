import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

/**
 * Sanity Studio for VC Berg-Op Wijgmaal.
 *
 * Hosted separately from the website (bergop-wijgmaal.sanity.studio) but kept in
 * this repository so the schema stays versioned next to the data model in
 * src/content/types.ts. The website itself never imports anything from here.
 */
export default defineConfig({
  name: "default",
  title: "VC Berg-Op Wijgmaal",
  projectId: "utlbxtd6",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
