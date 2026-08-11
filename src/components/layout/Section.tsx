import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "paper" | "ink" | "tint";
  className?: string;
  size?: "default" | "compact";
}

/** Consistent section shell: generous whitespace, optional header, tone variants. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  tone = "paper",
  size = "default",
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        size === "compact" ? "py-14 sm:py-16" : "py-20 sm:py-28 lg:py-32",
        tone === "ink" && "bg-ink text-ink-foreground",
        tone === "tint" && "bg-secondary/60",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {(eyebrow || title || intro || action) && (
          <Reveal className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0 max-w-2xl">
              {eyebrow ? (
                <span className={cn("text-eyebrow", tone === "ink" ? "text-club" : "text-club-deep")}>
                  {eyebrow}
                </span>
              ) : null}
              {title ? <h2 className="mt-3 text-display-lg">{title}</h2> : null}
              {intro ? (
                <p
                  className={cn(
                    "mt-4 text-base leading-relaxed sm:text-lg",
                    tone === "ink" ? "text-ink-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {intro}
                </p>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
