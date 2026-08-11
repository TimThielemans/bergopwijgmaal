import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CLUB_INFO } from "@/content";
import { Section } from "@/components/layout/Section";
import { BrandGraphic } from "@/components/shared/BrandGraphic";
import { Reveal } from "@/components/shared/Reveal";

export function AboutSection() {
  return (
    <Section id="over-ons">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <Reveal>
          <span className="text-eyebrow text-club-deep">Over Berg-Op</span>
          <h2 className="mt-3 text-display-lg">Een club waar je thuiskomt</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {CLUB_INFO.storyBlocks[0]?.body}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {CLUB_INFO.storyBlocks[1]?.body}
          </p>
          <Link
            to="/club"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground transition-transform hover:scale-[1.02]"
          >
            Meer over de club
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={120} className="grid gap-4 sm:grid-cols-2">
          {CLUB_INFO.values.map((value) => (
            <article
              key={value.id}
              className="surface-card relative isolate overflow-hidden p-5 sm:p-6"
            >
              <BrandGraphic
                variant="dots"
                className="absolute -right-8 -top-8 h-28 w-28 text-club"
              />
              <h3 className="font-display text-lg font-bold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
