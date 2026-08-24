import type { FormResult } from "@/content/types";

/**
 * Result classes based on the league points system:
 * 3-0/3-1 = full win, 3-2 = win, 2-3 = loss, 1-3/0-3 = heavy loss.
 */
export interface FormStyle {
  /** Short letter shown in the streak blocks. */
  letter: "W" | "V";
  /** Readable Dutch label, e.g. "Winst 3-1". */
  label: string;
  /** Tailwind classes for a filled badge/chip. */
  chipClass: string;
}

const STYLES: Record<FormResult, FormStyle> = {
  W3: {
    letter: "W",
    label: "Winst (3 punten)",
    chipClass: "bg-win/15 text-win-deep ring-1 ring-win/35",
  },
  W2: {
    letter: "W",
    label: "Winst na vijf sets (2 punten)",
    chipClass: "bg-win-soft/25 text-win-deep ring-1 ring-win-soft/50",
  },
  L2: {
    letter: "V",
    label: "Verlies na vijf sets (1 punt)",
    chipClass: "bg-loss-soft/20 text-loss-soft-deep ring-1 ring-loss-soft/40",
  },
  L3: {
    letter: "V",
    label: "Verlies (0 punten)",
    chipClass: "bg-loss/12 text-loss ring-1 ring-loss/30",
  },
};

/** Tolerates the legacy "W"/"L" values coming from static JSON. */
export function normalizeFormResult(value: unknown): FormResult | null {
  switch (value) {
    case "W3":
    case "W2":
    case "L2":
    case "L3":
      return value;
    case "W":
      return "W3";
    case "L":
      return "L3";
    default:
      return null;
  }
}

export function formResultFromSets(setsFor: number, setsAgainst: number): FormResult {
  const forSets = Number(setsFor) || 0;
  const againstSets = Number(setsAgainst) || 0;
  if (forSets > againstSets) return againstSets >= 2 ? "W2" : "W3";
  return forSets >= 2 ? "L2" : "L3";
}

export function formStyle(result: FormResult): FormStyle {
  return STYLES[result] ?? STYLES.L3;
}
