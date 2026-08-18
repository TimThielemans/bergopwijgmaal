import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CLUB_INFO } from "@/content";
import { list, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { BrandGraphic } from "@/components/shared/BrandGraphic";
import { Reveal } from "@/components/shared/Reveal";

export function AboutSection() {
  const storyBlocks = list(CLUB_INFO?.storyBlocks);
  const paragraphs = [text(storyBlocks[0]?.body), text(storyBlocks[1]?.body)].filter(
    (body) => body.length > 0,
  );
  const values = list(CLUB_INFO?.values).slice(0, 4);
  const intro =
    paragraphs.length > 0
      ? paragraphs
      : [text(CLUB_INFO?.mission, "Volleybal in Wijgmaal, voor competitie én recreatie.")];

  return (
    <Section id="over-ons">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <Reveal>
          <span className="text-eyebrow text-club-deep">Over Berg-Op</span>
          <h2 className="mt-3 text-display-lg">Een club waar je thuiskomt</h2>
          {intro.map((body, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
                  : "mt-4 text-base leading-relaxed text-muted-foreground"
              }
            >
              {body}
            </p>
          ))}
          <Link
            to="/club"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground transition-transform hover:scale-[1.02]"
          >
            Meer over de club
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Reveal>

        {values.length > 0 ? (
          <Reveal delay={120} className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <article
                key={text(value?.id, `value-${index}`)}
                className="surface-card relative isolate overflow-hidden p-5 sm:p-6"
              >
                <BrandGraphic
                  variant="dots"
                  className="absolute -right-8 -top-8 h-28 w-28 text-club"
                />
                <h3 className="font-display text-lg font-bold">
                  {text(value?.title, "Clubwaarde")}
                </h3>
                {text(value?.description) ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {text(value.description)}
                  </p>
                ) : null}
              </article>
            ))}
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
