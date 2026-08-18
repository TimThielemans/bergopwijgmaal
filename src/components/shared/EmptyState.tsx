import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Short, friendly Dutch message. */
  message: string;
  hint?: string;
  icon?: LucideIcon;
  /** "ink" for dark sections, "paper" (default) for light surfaces. */
  tone?: "paper" | "ink";
  className?: string;
}

/** One consistent, branded empty state — used wherever content can be absent. */
export function EmptyState({
  message,
  hint,
  icon: Icon = Info,
  tone = "paper",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-dashed px-5 py-8 text-center",
        tone === "ink" ? "border-ink-foreground/20 text-ink-foreground/65" : "border-border text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn("h-5 w-5", tone === "ink" ? "text-club" : "text-club-deep")} />
      <p className="font-display text-sm font-semibold">{message}</p>
      {hint ? <p className="max-w-sm text-xs leading-relaxed opacity-80">{hint}</p> : null}
    </div>
  );
}
