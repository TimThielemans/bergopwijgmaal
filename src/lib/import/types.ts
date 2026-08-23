/**
 * Excel → Sanity import contract.
 *
 * The workbook is the *storage* shape (one sheet per record type, stable ids);
 * these types describe what the server reports back to the admin UI. Both the
 * preview and the apply step use the exact same analysis, so what the admin
 * confirms is what gets written.
 */

export type ImportSheetName = "Teams" | "Players" | "Trainings" | "Locations" | "ParserData";

export const IMPORT_SHEETS: Record<ImportSheetName, { columns: string[]; required: string[] }> = {
  Teams: {
    columns: [
      "teamId",
      "slug",
      "name",
      "shortName",
      "category",
      "level",
      "shortDescription",
      "description",
      "photoAlt",
      "coach",
      "assistantCoach",
      "order",
    ],
    required: ["teamId", "slug", "name", "category"],
  },
  Players: {
    columns: ["teamId", "name", "number", "position"],
    required: ["teamId", "name"],
  },
  Trainings: {
    columns: ["teamId", "day", "startTime", "endTime", "venueId"],
    required: ["teamId", "day"],
  },
  Locations: {
    columns: ["venueId", "name", "address", "postalCode", "city", "googleMapsUrl", "notes"],
    required: ["venueId", "name"],
  },
  ParserData: {
    columns: [
      "teamId",
      "slug",
      "parserEnabled",
      "volleyClubId",
      "volleyTeamId",
      "volleySeriesId",
      "competitionCode",
      "divisionCode",
    ],
    required: ["teamId", "parserEnabled"],
  },
};

export interface ImportIssue {
  sheet: string;
  /** 1-based row number as shown in Excel (header = row 1). */
  row?: number;
  message: string;
}

export type ImportChangeKind = "new" | "changed" | "unchanged";

export interface ImportChange {
  documentId: string;
  type: "team" | "location";
  label: string;
  kind: ImportChangeKind;
  /** Field names that differ from the current Sanity document. */
  fields: string[];
}

export interface ImportAnalysis {
  ok: boolean;
  fileName: string;
  sheetsFound: string[];
  rowCounts: Record<string, number>;
  errors: ImportIssue[];
  warnings: ImportIssue[];
  changes: ImportChange[];
  summary: { new: number; changed: number; unchanged: number };
}

export interface ImportResult {
  ok: boolean;
  written: number;
  errors: ImportIssue[];
  analysis: ImportAnalysis;
}
