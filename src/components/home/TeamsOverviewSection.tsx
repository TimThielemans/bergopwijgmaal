import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { TeamCard } from "@/components/teams/TeamCard";

/** Dynamic collection: the grid renders whatever teams the provider returns. */
export function TeamsOverviewSection({ teams }: { teams: Team[] }) {
  return (
    <Section
      id="ploegen"
      tone="tint"
      eyebrow="Ploegen"
      title="Onze ploegen"
      intro="Competitief of recreatief — elke ploeg heeft een eigen niveau, ritme en sfeer."
      action={
        <Link
          to="/ploegen"
          className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
        >
          Alle ploegen
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team, index) => (
          <Reveal key={team.id} delay={index * 60}>
            <TeamCard team={team} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
