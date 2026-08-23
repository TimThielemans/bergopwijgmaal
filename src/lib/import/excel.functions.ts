import { createServerFn } from "@tanstack/react-start";
import type { ImportAnalysis, ImportResult } from "./types";

/**
 * Server functions for the Excel-import admin page. All parsing, validation and
 * writing happens in the server-only module, imported inside the handler.
 */

interface WorkbookInput {
  fileName: string;
  base64: string;
}

function validateInput(data: unknown): WorkbookInput {
  const input = (data ?? {}) as Partial<WorkbookInput>;
  const base64 = typeof input.base64 === "string" ? input.base64 : "";
  if (!base64) throw new Error("Geen bestand ontvangen");
  // ~20 MB base64 ceiling: workbooks of this kind are a few hundred kB.
  if (base64.length > 28_000_000) throw new Error("Bestand is te groot (max. 20 MB)");
  return { fileName: typeof input.fileName === "string" ? input.fileName : "werkboek.xlsx", base64 };
}

export const analyzeExcelImport = createServerFn({ method: "POST" })
  .inputValidator(validateInput)
  .handler(async ({ data }): Promise<ImportAnalysis> => {
    const { analyzeExcelWorkbook } = await import("./excel.server");
    return analyzeExcelWorkbook(data);
  });

export const applyExcelImport = createServerFn({ method: "POST" })
  .inputValidator(validateInput)
  .handler(async ({ data }): Promise<ImportResult> => {
    const { applyExcelWorkbook } = await import("./excel.server");
    return applyExcelWorkbook(data);
  });
