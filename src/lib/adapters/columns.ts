/**
 * Tolerant column lookup for raw VolleyScores rows.
 *
 * The exports use Dutch headers with inconsistent casing, accents and typos
 * (`Sporthall`). Instead of matching exact strings, every key is normalised so a
 * small change upstream does not silently drop a whole column.
 */

export function normalizeKey(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Repairs Latin-1 bytes that were decoded as UTF-8 by the export
 * (`La LouviÃ¨re` -> `La Louvière`). Safe no-op for correct strings.
 */
export function fixEncoding(value: string): string {
  if (!/[ÃÂ][\u0080-\u00bf]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from(Array.from(value, (char) => char.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return decoded.includes("\ufffd") ? value : decoded;
  } catch {
    return value;
  }
}

export interface RowLookup {
  /** First matching column value for any of the given header candidates. */
  get(...candidates: string[]): string;
  /** Value by zero-based column position (`Kolom1`, `Kolom2`, …). */
  at(index: number): string;
  keys(): string[];
  isEmpty(): boolean;
}

export function rowLookup(record: Record<string, string>): RowLookup {
  const byKey = new Map<string, string>();
  const ordered: string[] = [];
  for (const [key, value] of Object.entries(record ?? {})) {
    const clean = fixEncoding(String(value ?? "")).trim();
    byKey.set(normalizeKey(key), clean);
    ordered.push(key);
  }

  return {
    get(...candidates: string[]): string {
      for (const candidate of candidates) {
        const hit = byKey.get(normalizeKey(candidate));
        if (hit) return hit;
      }
      // Fall back to a "contains" match, e.g. "Sporthall" vs "Sporthal thuis".
      for (const candidate of candidates) {
        const wanted = normalizeKey(candidate);
        if (!wanted) continue;
        for (const [key, value] of byKey.entries()) {
          if (value && (key.includes(wanted) || wanted.includes(key))) return value;
        }
      }
      return "";
    },
    at(index: number): string {
      return byKey.get(normalizeKey(`Kolom${index + 1}`)) ?? "";
    },
    keys: () => ordered,
    isEmpty: () => Array.from(byKey.values()).every((value) => value.length === 0),
  };
}

/** Parses `"63"`, `"1 234"`, `"3,5"` into a number; returns 0 when unusable. */
export function toNumber(value: unknown): number {
  const raw = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(raw.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
