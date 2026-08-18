/**
 * Defensive helpers for optional CMS/parser content.
 *
 * Content can arrive from mock modules today and from Sanity or generated JSON
 * later. Optional fields may be missing, empty, or the wrong type. These helpers
 * make "missing" a normal, renderable state instead of a runtime exception.
 */

/** Always an array: `[]` for undefined, null or non-array input. */
export function list<T>(value: readonly T[] | null | undefined): T[] {
  return Array.isArray(value) ? [...value] : [];
}

/** Number of items, safe on undefined/null. */
export function count(value: readonly unknown[] | null | undefined): number {
  return Array.isArray(value) ? value.length : 0;
}

/** Trimmed string, or `fallback` (default empty string) when there is nothing useful. */
export function text(value: string | null | undefined, fallback = ""): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : fallback;
}

/** True when the value carries meaningful content. */
export function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return Boolean(value);
}

/** Finite number or the given fallback (0 by default). */
export function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Only http(s), mailto and tel links pass; anything else is treated as absent. */
export function safeUrl(value: string | null | undefined): string | null {
  const raw = text(value);
  if (!raw) return null;
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  if (raw.startsWith("/") || raw.startsWith("#")) return raw;
  return null;
}

/** True when the string parses to a real date. */
export function isValidDate(value: string | null | undefined): boolean {
  const raw = text(value);
  if (!raw) return false;
  return !Number.isNaN(new Date(raw).getTime());
}
