import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import heroImage from "@/assets/brand-hero.jpg";
import { CLUB_INFO } from "@/content";
import { num, text } from "@/lib/safe";
import { cn } from "@/lib/utils";
import type { Match, Team } from "@/content/types";
import { BrandGraphic, BrandTile } from "@/components/shared/BrandGraphic";
import { CountUp } from "@/components/shared/CountUp";
import { Reveal } from "@/components/shared/Reveal";
import { NextHomeMatchCard } from "./NextHomeMatchCard";

interface HeroSectionProps {
  teamCount?: number | undefined;
  playerCount?: number | undefined;
  nextHomeMatch?: Match | undefined;
  nextHomeMatchTeam?: Team | undefined;
}

export function HeroSection({
  teamCount,
  playerCount,
  nextHomeMatch,
  nextHomeMatchTeam,
}: HeroSectionProps) {
  const foundingYear = num(CLUB_INFO?.foundingYear, 0);
  const years = foundingYear > 1900 ? new Date().getFullYear() - foundingYear : 0;
  const stats = [
    ...(years > 0 ? [{ value: years, suffix: "+", label: "jaar club" }] : []),
    { value: num(teamCount), suffix: "", label: "ploegen" },
    { value: num(playerCount), suffix: "", label: "actieve leden" },
  ].filter((stat) => stat.value > 0);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/50" />
      <BrandGraphic variant="dots" className="absolute -bottom-24 -left-24 h-96 w-96 text-club opacity-40" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_minmax(0,0.85fr)] lg:items-center lg:gap-14">
          <div>
            <Reveal>
              <span className="text-eyebrow text-club">Volleybal in Wijgmaal · Leuven</span>
              <h1 className="mt-4 max-w-2xl text-display-xl">
                Familiale volleybalclub met <span className="text-club">sportieve ambitie</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75 sm:text-lg">
                {text(CLUB_INFO?.mission, "Volleybal in Wijgmaal, voor competitie én recreatie.")}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ploegen"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-club px-6 font-display text-base font-semibold text-ink transition-transform hover:scale-[1.02]"
              >
                Onze ploegen
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href="#wedstrijden"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink-foreground/25 px-6 font-display text-base font-semibold text-ink-foreground transition-colors hover:border-club hover:text-club"
              >
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                Volgende wedstrijden
              </a>
            </Reveal>
          </div>

          <Reveal delay={180}>
            {nextHomeMatch ? (
              <NextHomeMatchCard match={nextHomeMatch} team={nextHomeMatchTeam} />
            ) : (
              <BrandTile label="BOW" caption="Berg-Op Wijgmaal" className="aspect-[4/3] w-full rounded-2xl" />
            )}
          </Reveal>
        </div>

        {stats.length > 0 ? (
          <Reveal
            delay={240}
            className={cn(
              "mt-12 grid divide-x divide-ink-foreground/15 rounded-2xl border border-ink-foreground/15 bg-ink-foreground/[0.04]",
              stats.length >= 3 ? "grid-cols-3" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0 px-4 py-6 sm:px-7 sm:py-8">
                <span className="block font-display text-4xl font-bold leading-none text-club sm:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 block text-xs leading-snug text-ink-foreground/60 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </Reveal>
        ) : null}

      </div>
    </section>
  );
}
