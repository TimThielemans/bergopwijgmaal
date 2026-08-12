import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import heroImage from "@/assets/brand-hero.jpg";
import { CLUB_INFO } from "@/content";
import { BrandGraphic } from "@/components/shared/BrandGraphic";
import { Reveal } from "@/components/shared/Reveal";

export function HeroSection({ teamCount, playerCount }: { teamCount: number; playerCount: number }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/40" />
      <BrandGraphic variant="dots" className="absolute -bottom-24 -left-24 h-96 w-96 text-club opacity-40" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-36">
        <Reveal>
          <span className="text-eyebrow text-club">Volleybal in Wijgmaal · Leuven</span>
          <h1 className="mt-5 max-w-3xl text-display-xl">
            Familiale volleybalclub met <span className="text-club">sportieve ambitie</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/75 sm:text-lg">
            {CLUB_INFO.mission}
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
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

        <Reveal delay={220} className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-ink-foreground/15 pt-8">
          {[
            { value: `${new Date().getFullYear() - CLUB_INFO.foundingYear}+`, label: "jaar club" },
            { value: String(teamCount), label: "ploegen" },
            { value: String(playerCount), label: "Actieve leden" },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0">
              <span className="block font-display text-2xl font-bold text-club sm:text-3xl">{stat.value}</span>
              <span className="mt-1 block text-xs leading-snug text-ink-foreground/60 sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
