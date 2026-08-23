import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Trophy } from "lucide-react";
import type { RankingEntry, Team } from "@/content/types";
import { formatPosition } from "@/lib/format";
import { list, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormStreak } from "@/components/shared/FormStreak";
import { Reveal } from "@/components/shared/Reveal";

interface Props {
  standings?: RankingEntry[] | null;
  teams?: Team[] | null;
  lastUpdated?: string | null;
}

/**
 * Primary homepage feature: every competitive team's position and form at once.
 * Row count comes from the data, never hardcoded.
 */
export function RankingsSection({ standings, teams, lastUpdated }: Props) {
  const teamById = new Map(list(teams).map((team) => [team.teamId, team]));
  const rows = list(standings).filter((entry) => teamById.has(entry.teamId));

  return (
    <Section
      id="stand"
      tone="ink"
      eyebrow="Klassement"
      title="Stand & vorm"
      intro="Positie in de reeks en de laatste vijf wedstrijden van elke competitieploeg."
    >
      {rows.length === 0 ? (
        <EmptyState
          tone="ink"
          message="De standen zijn beschikbaar eens de competitie is gestart."
          hint="Zodra de klassementen ingelezen zijn, verschijnen ze hier."
          icon={Trophy}
        />
      ) : (
        <div className="grid gap-3">
          {rows.map((entry, index) => {
            const team = teamById.get(entry.teamId);
            if (!team) return null;
            const slug = text(team.slug);
            if (!slug) return null;
            const meta = [
              text(entry.division),
              entry.played > 0 ? `${entry.points} punten uit ${entry.played} wedstrijden` : "",
            ]
              .filter((value) => value.length > 0)
              .join(" · ");

            return (
              <Reveal key={entry.teamId} delay={index * 70}>
                <Link
                  to="/ploegen/$slug"
                  params={{ slug }}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-ink-foreground/12 bg-ink-foreground/5 p-4 transition-colors hover:border-club/60 hover:bg-ink-foreground/10 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-6 sm:p-5"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-club/15 font-display text-base font-bold text-club sm:h-14 sm:w-14 sm:text-lg">
                    {formatPosition(entry.position)}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg font-bold sm:text-xl">
                      <span className="sm:hidden">{text(team.shortName, text(team.name, "Ploeg"))}</span>
                      <span className="hidden sm:inline">{text(team.name, "Ploeg")}</span>
                    </span>
                    {meta ? <span className="mt-0.5 block truncate text-sm text-ink-foreground/60">{meta}</span> : null}
                  </span>

                  <span className="col-span-2 col-start-2 sm:col-span-1 sm:col-start-3">
                    <FormStreak form={entry.form} />
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden h-5 w-5 shrink-0 text-club transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
      {lastUpdated ? <p className="mt-6 text-xs text-ink-foreground/45">{lastUpdated}</p> : null}
    </Section>
  );
}
