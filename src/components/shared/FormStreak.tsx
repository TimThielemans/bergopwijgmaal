import type { FormResult } from "@/content/types";
import { formStyle, normalizeFormResult } from "@/lib/form";
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
  const results = list(form)
    .map((result) => normalizeFormResult(result))
    .filter((result): result is FormResult => result !== null);

  if (results.length === 0) {
    return <span className="text-xs text-muted-foreground">Geen vorm beschikbaar</span>;
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">
        Laatste wedstrijden: {results.map((result) => formStyle(result).label).join(", ")}
      </span>
      {results.map((result, index) => {
        const style = formStyle(result);
        return (
          <span
            key={`${result}-${index}`}
            aria-hidden="true"
            title={style.label}
            className={cn(
              "grid h-6 w-6 shrink-0 place-items-center rounded-md font-display text-[0.7rem] font-bold",
              style.chipClass,
            )}
          >
            {style.letter}
          </span>
        );
      })}
    </div>
  );
}
