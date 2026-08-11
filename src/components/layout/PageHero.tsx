import type { ReactNode } from "react";
import { BrandGraphic } from "@/components/shared/BrandGraphic";

/** Compact page header for the sub-pages, purely graphic — no photography needed. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <BrandGraphic
        variant="stroke"
        className="absolute -right-24 -top-32 h-[150%] w-auto text-club"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <span className="text-eyebrow text-club">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl text-display-lg">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75 sm:text-lg">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
