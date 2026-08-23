import * as XLSX from "xlsx";
import { recordToCells, type RawRow } from "./types";
import { isAllowedExportUrl } from "./urls";

/**
 * Download + convert one VolleyScores export.
 *
 * Replaces the PHP `fopen` + `sleep(13)` + PhpSpreadsheet combination: the file
 * is kept in memory, so there are no temp files and no waiting. SheetJS reads
 * both real XLS files and the HTML-table exports VolleyScores sometimes returns.
 *
 * `headerRowIndex` mirrors the original scripts: 0 for calendars, 1 for rankings
 * (ranking exports carry an extra title row above the header).
 */
export async function fetchSheetRows(options: {
  url: string;
  headerRowIndex: number;
  teamId: string;
}): Promise<RawRow[]> {
  const { url, headerRowIndex, teamId } = options;
  if (!isAllowedExportUrl(url)) {
    throw new Error(`Niet-toegelaten export-URL: ${url}`);
  }

  const response = await fetch(url, {
    headers: { "User-Agent": "VC-Berg-Op-Wijgmaal-VolleyDataParser/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Download mislukt (HTTP ${response.status})`);
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0) {
    throw new Error("Leeg bestand ontvangen");
  }

  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  // Empty headers get a positional name (`Kolom1`, `Kolom2`, …) so leading
  // columns such as the ranking position are preserved instead of dropped.
  const headers = (matrix[headerRowIndex] ?? []).map((cell, index) => {
    const value = cell === null || cell === undefined ? "" : String(cell).trim();
    return value || `Kolom${index + 1}`;
  });

  if (headers.length === 0) return [];

  const rows: RawRow[] = [];
  for (let i = headerRowIndex + 1; i < matrix.length; i += 1) {
    const raw = matrix[i] ?? [];
    const record: Record<string, string> = {};
    let hasValue = false;
    headers.forEach((header, column) => {
      if (!header) return;
      const cell = raw[column];
      const value = cell === null || cell === undefined ? "" : String(cell).trim();
      record[header] = value;
      if (value) hasValue = true;
    });
    if (!hasValue) continue;
    rows.push({ teamId, cells: recordToCells(record) });
  }

  return rows;
}
