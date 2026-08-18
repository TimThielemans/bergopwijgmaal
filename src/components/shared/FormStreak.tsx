import type { FormResult } from "@/content/types";
import { list } from "@/lib/safe";
import { cn } from "@/lib/utils";

/** Visualises the last five results, oldest first. */
export function FormStreak({
  form,
  className,
}: {
  form?: FormResult[] | null;
  className?: string;
}) {
  const results = list(form).filter((result) => result === "W" || result === "L");

  if (results.length === 0) {
    return <span className="text-xs text-muted-foreground">Geen vorm beschikbaar</span>;
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">
        Laatste wedstrijden: {results.map((r) => (r === "W" ? "gewonnen" : "verloren")).join(", ")}
      </span>
      {results.map((result, index) => (
        <span
          key={`${result}-${index}`}
          aria-hidden="true"
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-md font-display text-[0.7rem] font-bold",
            result === "W"
              ? "bg-win/15 text-win ring-1 ring-win/30"
              : "bg-loss/12 text-loss ring-1 ring-loss/25",
          )}
        >
          {result === "W" ? "W" : "V"}
        </span>
      ))}
    </div>
  );
}
