import * as XLSX from "xlsx";
import { sanityConfig } from "@/lib/config";
import { sanityFetchServer } from "@/lib/sanity/read.server";
import { sanityCreateOrReplace } from "@/lib/sanity/write.server";
import {
  IMPORT_SHEETS,
  type ImportAnalysis,
  type ImportChange,
  type ImportIssue,
  type ImportResult,
  type ImportSheetName,
} from "./types";

/**
 * Server-only Excel import.
 *
 * One workbook (Teams / Players / Trainings / Locations / ParserData) is parsed,
 * validated and mapped onto the Sanity documents the website already reads. The
 * ids are deterministic (`team.<teamId>`, `location.<venueId>`), so an import is
 * idempotent and Sanity keeps the revision history.
 *
 * Images stay CMS-managed: the existing `photo` asset of a team is never touched,
 * only its alt text can come from Excel. Documents that are absent from the
 * workbook are left alone — an import never deletes.
 */

type Row = Record<string, string>;

const SHEET_NAMES = Object.keys(IMPORT_SHEETS) as ImportSheetName[];

function normalizeKey(value: string): string {
  return value.replace(/\s+/g, "").replace(/[()]/g, "").toLowerCase();
}

/** Reads one sheet as `{ canonicalColumn: value }` rows, tolerant on headers. */
function readSheet(workbook: XLSX.WorkBook, sheet: ImportSheetName): Row[] {
  const name = workbook.SheetNames.find((candidate) => normalizeKey(candidate) === normalizeKey(sheet));
  if (!name) return [];
  const worksheet = workbook.Sheets[name];
  if (!worksheet) return [];

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });
  const headerRow = matrix[0] ?? [];
  const columns = IMPORT_SHEETS[sheet].columns;
  const headers = headerRow.map((cell) => {
    const key = normalizeKey(String(cell ?? ""));
    return columns.find((column) => normalizeKey(column) === key) ?? "";
  });

  const rows: Row[] = [];
  for (let i = 1; i < matrix.length; i += 1) {
    const raw = matrix[i] ?? [];
    const row: Row = {};
    let hasValue = false;
    headers.forEach((header, index) => {
      if (!header) return;
      const cell = raw[index];
      const value = cell === null || cell === undefined ? "" : String(cell).trim();
      row[header] = value;
      if (value) hasValue = true;
    });
    if (hasValue) rows.push(row);
  }
  return rows;
}

function bool(value: string | undefined): boolean | null {
  const raw = (value ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (["true", "waar", "ja", "yes", "1", "x"].includes(raw)) return true;
  if (["false", "onwaar", "nee", "no", "0"].includes(raw)) return false;
  return null;
}

function numberOr(value: string | undefined, fallback: number | null = null): number | null {
  const raw = (value ?? "").trim().replace(",", ".");
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/* --- existing Sanity state ---------------------------------------------- */

interface ExistingTeam {
  _id: string;
  teamId?: string;
  slug?: { current?: string };
  name?: string;
  shortName?: string;
  category?: string;
  level?: string;
  shortDescription?: string;
  description?: string;
  photo?: unknown;
  coach?: string;
  assistantCoach?: string;
  order?: number;
  players?: unknown[];
  trainings?: unknown[];
  parser?: Record<string, unknown>;
}

interface ExistingLocation {
  _id: string;
  venueId?: string;
  name?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  googleMapsUrl?: string;
  notes?: string;
}

const EXISTING_QUERY = `{
  "teams": *[_type == "team"]{ ..., "photo": photo },
  "locations": *[_type == "location"]{ ... }
}`;

async function loadExisting(): Promise<{ teams: ExistingTeam[]; locations: ExistingLocation[] }> {
  if (!sanityConfig.enabled) return { teams: [], locations: [] };
  const result = await sanityFetchServer<{
    teams?: ExistingTeam[];
    locations?: ExistingLocation[];
  }>(EXISTING_QUERY, {});
  return { teams: result?.teams ?? [], locations: result?.locations ?? [] };
}

/* --- mapping ------------------------------------------------------------- */

type SanityDoc = Record<string, unknown> & { _id: string; _type: string };

/** Keeps Studio-only fields of an existing document, drops Sanity system fields. */
function withoutSystemFields(
  current: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!current) return {};
  return Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith("_")));
}

/**
 * Order-insensitive, key-insensitive comparison value: object keys are sorted,
 * `_key`/`_type` helpers are dropped and empty values collapse to null, so a
 * re-import of unchanged data is correctly reported as "unchanged".
 */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "_key" && key !== "_type")
      .map(([key, item]) => [key, canonical(item)] as const)
      .filter(([, item]) => item !== null)
      .sort(([a], [b]) => a.localeCompare(b));
    return entries.length === 0 ? null : Object.fromEntries(entries);
  }
  if (value === "" || value === undefined) return null;
  return value ?? null;
}

function diffFields(next: SanityDoc, current: Record<string, unknown> | undefined): string[] {
  if (!current) return Object.keys(next).filter((key) => !key.startsWith("_"));
  const changed: string[] = [];
  for (const [key, value] of Object.entries(next)) {
    if (key.startsWith("_")) continue;
    if (JSON.stringify(canonical(current[key])) !== JSON.stringify(canonical(value))) {
      changed.push(key);
    }
  }
  return changed;
}

interface BuildOutput {
  documents: SanityDoc[];
  changes: ImportChange[];
  errors: ImportIssue[];
  warnings: ImportIssue[];
  rowCounts: Record<string, number>;
  sheetsFound: string[];
}

function buildDocuments(
  workbook: XLSX.WorkBook,
  existing: { teams: ExistingTeam[]; locations: ExistingLocation[] },
): BuildOutput {
  const errors: ImportIssue[] = [];
  const warnings: ImportIssue[] = [];
  const rows = {
    Teams: readSheet(workbook, "Teams"),
    Players: readSheet(workbook, "Players"),
    Trainings: readSheet(workbook, "Trainings"),
    Locations: readSheet(workbook, "Locations"),
    ParserData: readSheet(workbook, "ParserData"),
  };

  const sheetsFound = SHEET_NAMES.filter((sheet) =>
    workbook.SheetNames.some((name) => normalizeKey(name) === normalizeKey(sheet)),
  );
  for (const sheet of SHEET_NAMES) {
    if (!sheetsFound.includes(sheet)) {
      warnings.push({ sheet, message: `Blad "${sheet}" ontbreekt — wordt overgeslagen.` });
    }
  }
  if (rows.Teams.length === 0) {
    errors.push({ sheet: "Teams", message: "Geen ploegen gevonden: het blad Teams is verplicht." });
  }

  /* Locations */
  const locationDocs: SanityDoc[] = [];
  const venueIds = new Set<string>();
  rows.Locations.forEach((row, index) => {
    const line = index + 2;
    const venueId = row["venueId"] ?? "";
    if (!venueId) {
      errors.push({ sheet: "Locations", row: line, message: "venueId is verplicht." });
      return;
    }
    if (venueIds.has(venueId)) {
      errors.push({ sheet: "Locations", row: line, message: `Dubbele venueId "${venueId}".` });
      return;
    }
    if (!row["name"]) {
      errors.push({ sheet: "Locations", row: line, message: "name is verplicht." });
      return;
    }
    venueIds.add(venueId);
    locationDocs.push({
      _id: `location.${venueId}`,
      _type: "location",
      venueId,
      name: row["name"] ?? "",
      address: row["address"] ?? "",
      postalCode: row["postalCode"] ?? "",
      city: row["city"] ?? "",
      googleMapsUrl: row["googleMapsUrl"] ?? "",
      notes: row["notes"] ?? "",
    });
  });

  /* Teams */
  const teamIds = new Set<string>();
  const teamRows: Row[] = [];
  rows.Teams.forEach((row, index) => {
    const line = index + 2;
    const teamId = row["teamId"] ?? "";
    if (!teamId) {
      errors.push({ sheet: "Teams", row: line, message: "teamId is verplicht." });
      return;
    }
    if (teamIds.has(teamId)) {
      errors.push({ sheet: "Teams", row: line, message: `Dubbele teamId "${teamId}".` });
      return;
    }
    if (!row["slug"]) errors.push({ sheet: "Teams", row: line, message: "slug is verplicht." });
    if (!row["name"]) errors.push({ sheet: "Teams", row: line, message: "name is verplicht." });
    const category = (row["category"] ?? "").toLowerCase();
    if (category !== "competitief" && category !== "recreatief") {
      errors.push({
        sheet: "Teams",
        row: line,
        message: 'category moet "competitief" of "recreatief" zijn.',
      });
    }
    teamIds.add(teamId);
    teamRows.push(row);
  });

  /* Players per team */
  const playersByTeam = new Map<string, Array<Record<string, unknown>>>();
  rows.Players.forEach((row, index) => {
    const line = index + 2;
    const teamId = row["teamId"] ?? "";
    if (!teamId || !teamIds.has(teamId)) {
      errors.push({
        sheet: "Players",
        row: line,
        message: `Onbekende teamId "${teamId}" — bestaat niet in het blad Teams.`,
      });
      return;
    }
    if (!row["name"]) {
      errors.push({ sheet: "Players", row: line, message: "name is verplicht." });
      return;
    }
    const number = numberOr(row["number"]);
    const list = playersByTeam.get(teamId) ?? [];
    list.push({
      _type: "player",
      _key: `p-${teamId}-${list.length + 1}`,
      name: row["name"] ?? "",
      ...(number !== null ? { number } : {}),
      ...(row["position"] ? { position: row["position"] } : {}),
    });
    playersByTeam.set(teamId, list);
  });

  /* Trainings per team */
  const trainingsByTeam = new Map<string, Array<Record<string, unknown>>>();
  const knownVenueIds = new Set<string>([
    ...venueIds,
    ...existing.locations.map((location) => String(location.venueId ?? "")).filter(Boolean),
  ]);
  rows.Trainings.forEach((row, index) => {
    const line = index + 2;
    const teamId = row["teamId"] ?? "";
    if (!teamId || !teamIds.has(teamId)) {
      errors.push({
        sheet: "Trainings",
        row: line,
        message: `Onbekende teamId "${teamId}" — bestaat niet in het blad Teams.`,
      });
      return;
    }
    if (!row["day"]) {
      errors.push({ sheet: "Trainings", row: line, message: "day is verplicht." });
      return;
    }
    const venueId = row["venueId"] ?? "";
    if (venueId && !knownVenueIds.has(venueId)) {
      errors.push({
        sheet: "Trainings",
        row: line,
        message: `Onbekende venueId "${venueId}" — voeg de zaal toe aan het blad Locations.`,
      });
      return;
    }
    if (!venueId) {
      warnings.push({ sheet: "Trainings", row: line, message: "Geen venueId ingevuld." });
    }
    const list = trainingsByTeam.get(teamId) ?? [];
    list.push({
      _type: "training",
      _key: `t-${teamId}-${list.length + 1}`,
      day: (row["day"] ?? "").toLowerCase(),
      startTime: row["startTime"] ?? "",
      endTime: row["endTime"] ?? "",
      ...(venueId
        ? { venue: { _type: "reference", _ref: `location.${venueId}` } }
        : {}),
    });
    trainingsByTeam.set(teamId, list);
  });

  /* ParserData per team — ids only, never URLs. */
  const parserByTeam = new Map<string, Record<string, unknown>>();
  rows.ParserData.forEach((row, index) => {
    const line = index + 2;
    const teamId = row["teamId"] ?? "";
    if (!teamId || !teamIds.has(teamId)) {
      errors.push({
        sheet: "ParserData",
        row: line,
        message: `Onbekende teamId "${teamId}" — bestaat niet in het blad Teams.`,
      });
      return;
    }
    const enabled = bool(row["parserEnabled"]);
    if (enabled === null) {
      errors.push({
        sheet: "ParserData",
        row: line,
        message: "parserEnabled moet WAAR/ONWAAR (ja/nee) zijn.",
      });
      return;
    }
    const ids = {
      volleyClubId: row["volleyClubId"] ?? "",
      volleyTeamId: row["volleyTeamId"] ?? "",
      volleySeriesId: row["volleySeriesId"] ?? "",
    };
    if (enabled) {
      const missing = Object.entries(ids)
        .filter(([, value]) => !value)
        .map(([key]) => key);
      if (missing.length > 0) {
        errors.push({
          sheet: "ParserData",
          row: line,
          message: `parserEnabled staat aan, maar ${missing.join(", ")} ontbreekt.`,
        });
        return;
      }
    }
    for (const [key, value] of Object.entries(ids)) {
      if (value && !/^[A-Za-z0-9_-]+$/.test(value)) {
        errors.push({ sheet: "ParserData", row: line, message: `Ongeldige ${key}: "${value}".` });
        return;
      }
    }
    parserByTeam.set(teamId, {
      _type: "parserData",
      parserEnabled: enabled,
      ...ids,
      competitionCode: row["competitionCode"] ?? "",
      divisionCode: row["divisionCode"] ?? "",
    });
  });

  /* Team documents */
  const existingTeams = new Map(
    existing.teams
      .filter((team) => team.teamId)
      .map((team) => [`team.${team.teamId}`, team as unknown as Record<string, unknown>]),
  );
  const existingLocations = new Map(
    existing.locations
      .filter((location) => location.venueId)
      .map((location) => [
        `location.${location.venueId}`,
        location as unknown as Record<string, unknown>,
      ]),
  );

  const teamDocs: SanityDoc[] = teamRows.map((row) => {
    const teamId = row["teamId"] ?? "";
    const current = existingTeams.get(`team.${teamId}`);
    const photo = current?.["photo"];
    const photoAlt = row["photoAlt"] ?? "";
    const order = numberOr(row["order"], 99) ?? 99;
    // Fields the Studio owns (notes on the parser config) survive an import.
    const currentParser = (current?.["parser"] ?? {}) as Record<string, unknown>;
    const parser = parserByTeam.get(teamId) ?? { _type: "parserData", parserEnabled: false };

    return {
      _id: `team.${teamId}`,
      _type: "team",
      teamId,
      slug: { _type: "slug", current: row["slug"] ?? "" },
      name: row["name"] ?? "",
      shortName: row["shortName"] ?? "",
      category: (row["category"] ?? "").toLowerCase(),
      level: row["level"] ?? "",
      shortDescription: row["shortDescription"] ?? "",
      description: row["description"] ?? "",
      coach: row["coach"] ?? "",
      assistantCoach: row["assistantCoach"] ?? "",
      order,
      players: playersByTeam.get(teamId) ?? [],
      trainings: trainingsByTeam.get(teamId) ?? [],
      parser: currentParser["notes"] ? { ...parser, notes: currentParser["notes"] } : parser,
      // Photos stay managed in the Studio: the existing asset is preserved and
      // only the alt text can be updated from Excel.
      ...(photo
        ? { photo: photoAlt ? { ...(photo as object), alt: photoAlt } : (photo as object) }
        : {}),
    } satisfies SanityDoc;
  });

  const changes: ImportChange[] = [];
  const documents: SanityDoc[] = [];

  for (const mapped of [...teamDocs, ...locationDocs]) {
    const current =
      mapped._type === "team"
        ? existingTeams.get(mapped._id)
        : existingLocations.get(mapped._id);
    // Studio-only extras on the existing document survive the import.
    const doc: SanityDoc = { ...withoutSystemFields(current), ...mapped };
    const fields = diffFields(mapped, current);
    const kind = !current ? "new" : fields.length > 0 ? "changed" : "unchanged";
    changes.push({
      documentId: doc._id,
      type: doc._type === "team" ? "team" : "location",
      label: String(doc["name"] ?? doc._id),
      kind,
      fields,
    });
    if (kind !== "unchanged") documents.push(doc);
  }

  return {
    documents,
    changes,
    errors,
    warnings,
    rowCounts: Object.fromEntries(
      SHEET_NAMES.map((sheet) => [sheet, rows[sheet].length]),
    ) as Record<string, number>,
    sheetsFound,
  };
}

/* --- public API ---------------------------------------------------------- */

function decode(base64: string): Uint8Array {
  const binary = atob(base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function analyze(input: { fileName: string; base64: string }) {
  const workbook = XLSX.read(decode(input.base64), { type: "array" });
  const existing = await loadExisting();
  const built = buildDocuments(workbook, existing);

  const summary = {
    new: built.changes.filter((change) => change.kind === "new").length,
    changed: built.changes.filter((change) => change.kind === "changed").length,
    unchanged: built.changes.filter((change) => change.kind === "unchanged").length,
  };

  const analysis: ImportAnalysis = {
    ok: built.errors.length === 0,
    fileName: input.fileName,
    sheetsFound: built.sheetsFound,
    rowCounts: built.rowCounts,
    errors: built.errors,
    warnings: built.warnings,
    changes: built.changes,
    summary,
  };

  return { analysis, documents: built.documents };
}

/** Validation + preview only: nothing is written. */
export async function analyzeExcelWorkbook(input: {
  fileName: string;
  base64: string;
}): Promise<ImportAnalysis> {
  const { analysis } = await analyze(input);
  return analysis;
}

/** Re-validates and, when valid, writes the changed documents to Sanity. */
export async function applyExcelWorkbook(input: {
  fileName: string;
  base64: string;
}): Promise<ImportResult> {
  const { analysis, documents } = await analyze(input);
  if (!analysis.ok) {
    return { ok: false, written: 0, errors: analysis.errors, analysis };
  }
  if (documents.length === 0) {
    return { ok: true, written: 0, errors: [], analysis };
  }
  await sanityCreateOrReplace(documents);
  return { ok: true, written: documents.length, errors: [], analysis };
}
