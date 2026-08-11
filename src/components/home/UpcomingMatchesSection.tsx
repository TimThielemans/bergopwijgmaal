import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Match, Team } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { MatchRow } from "@/components/shared/MatchRow";
import { Reveal } from "@/components/shared/Reveal";

interface Props {
  matches: Match[];
  teams: Team[];
  lastUpdated: string | null;
}

/** Primary homepage feature: the next matches across all teams. */
export function UpcomingMatchesSection({ matches, teams, lastUpdated }: Props) {
  const teamById = new Map(teams.map((team) => [team.id, team]));

  return (
    <Section
      id="wedstrijden"
      eyebrow="Kalender"
      title="Volgende wedstrijden"
      intro="Alle eerstvolgende wedstrijden van onze competitieploegen, thuis en op verplaatsing."
      action={
        <Link
          to="/ploegen"
          className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
        >
          Kalender per ploeg
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
    >
      <Reveal className="surface-card px-5 py-2 sm:px-8 sm:py-4">
        {matches.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            De kalender is binnenkort beschikbaar.
          </p>
        ) : (
          matches.map((match) => (
            <MatchRow key={match.id} match={match} team={teamById.get(match.teamId)} />
          ))
        )}
      </Reveal>
      {lastUpdated ? (
        <p className="mt-4 text-xs text-muted-foreground">{lastUpdated}</p>
      ) : null}
    </Section>
  );
}
