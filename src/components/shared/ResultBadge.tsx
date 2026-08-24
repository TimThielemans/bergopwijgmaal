import type { MatchResult } from "@/content/types";
import { formResultFromSets, formStyle } from "@/lib/form";
import { cn } from "@/lib/utils";

/** Small coloured badge showing win/loss nuance for a played match. */
export function ResultBadge({ result, className }: { result: MatchResult; className?: string }) {
  const setsFor = Number(result?.setsFor) || 0;
  const setsAgainst = Number(result?.setsAgainst) || 0;
  const style = formStyle(formResultFromSets(setsFor, setsAgainst));
  const won = setsFor > setsAgainst;

  return (
    <span
      title={style.label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-eyebrow",
        style.chipClass,
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {won ? "Winst" : "Verlies"} {setsFor}–{setsAgainst}
    </span>
  );
}
