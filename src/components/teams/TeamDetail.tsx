import { Link } from "@tanstack/react-router";
import { CalendarDays, ExternalLink, Trophy, Users } from "lucide-react";
import type { Match, RankingEntry, Team } from "@/content/types";
import { getVenue } from "@/content";
import { formatPosition } from "@/lib/format";
import { Section } from "@/components/layout/Section";
import { BrandGraphic, BrandTile } from "@/components/shared/BrandGraphic";
import { FormStreak } from "@/components/shared/FormStreak";
import { MatchRow } from "@/components/shared/MatchRow";
import { Reveal } from "@/components/shared/Reveal";

interface TeamDetailProps {
  team: Team;
  standing: RankingEntry | null;
  upcoming: Match[];
  calendar: Match[];
}

export function TeamDetail({ team, standing, upcoming, calendar }: TeamDetailProps) {
  const played = calendar.filter((match) => match.status === "played");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <BrandGraphic
          variant="grid"
          className="absolute inset-0 h-full w-full text-club opacity-60"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <Link
              to="/ploegen"
              className="text-eyebrow text-club transition-opacity hover:opacity-70"
            >
              ← Alle ploegen
            </Link>
            <h1 className="mt-5 text-display-lg">{team.name}</h1>
            <p className="mt-3 font-display text-lg font-semibold text-club">{team.level}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75">
              {team.description}
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ink-foreground/15 pt-6 text-sm">
              <div>
                <dt className="text-ink-foreground/55">Coach</dt>
                <dd className="mt-1 font-display font-semibold">{team.coach.name}</dd>
              </div>
              <div>
                <dt className="text-ink-foreground/55">Spelers</dt>
                <dd className="mt-1 font-display font-semibold">{team.players.length}</dd>
              </div>
              <div>
                <dt className="text-ink-foreground/55">Stand</dt>
                <dd className="mt-1 font-display font-semibold">
                  {standing ? formatPosition(standing.position) : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl">
            {team.photo ? (
              <img
                src={team.photo.url}
                alt={team.photo.alt}
                width={team.photo.width}
                height={team.photo.height}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <BrandTile
                label={team.shortName}
                caption={team.level}
                className="aspect-[4/3] w-full"
              />
            )}
          </div>
        </div>
      </section>

      <Section eyebrow="Praktisch" title="Trainingen & kern">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="surface-card p-6 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Trainingen
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {team.trainings.map((slot) => (
                <li
                  key={`${slot.day}-${slot.startTime}`}
                  className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="font-display font-semibold">
                    {slot.day} · {slot.startTime}–{slot.endTime}
                  </span>
                  <span className="text-muted-foreground">
                    {getVenue(slot.venueId)?.name ?? "Sporthal"}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 flex items-center gap-2 font-display text-xl font-bold">
              <Trophy aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Coaching
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {team.coach.name}
              {team.coach.role ? ` — ${team.coach.role}` : ""}
              {team.assistantCoach ? ` · ${team.assistantCoach.name} (assistent)` : ""}
            </p>
          </Reveal>

          <Reveal delay={100} className="surface-card p-6 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <Users aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Kern
            </h3>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {team.players.map((player) => (
                <li
                  key={player.name}
                  className="flex items-center gap-3 rounded-xl bg-secondary/70 px-3 py-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink font-display text-xs font-bold text-ink-foreground">
                    {player.number ?? team.shortName}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-semibold">
                      {player.name}
                    </span>
                    {player.position ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {player.position}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section
        tone="tint"
        eyebrow="Klassement"
        title="Stand & vorm"
        intro={standing ? `${standing.division}, seizoen in uitvoering.` : undefined}
      >
        {standing ? (
          <Reveal className="surface-card grid gap-6 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            <div>
              <span className="text-eyebrow text-muted-foreground">Positie</span>
              <p className="mt-2 font-display text-4xl font-bold text-club-deep">
                {formatPosition(standing.position)}
              </p>
            </div>
            <div>
              <span className="text-eyebrow text-muted-foreground">Punten</span>
              <p className="mt-2 font-display text-4xl font-bold">{standing.points}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {standing.won} gewonnen · {standing.lost} verloren
              </p>
            </div>
            <div>
              <span className="text-eyebrow text-muted-foreground">Sets</span>
              <p className="mt-2 font-display text-4xl font-bold">
                {standing.setsFor}
                <span className="text-muted-foreground">/{standing.setsAgainst}</span>
              </p>
            </div>
            <div>
              <span className="text-eyebrow text-muted-foreground">Vorm</span>
              <div className="mt-3">
                <FormStreak form={standing.form} />
              </div>
            </div>
          </Reveal>
        ) : (
          <p className="text-sm text-muted-foreground">
            Deze ploeg speelt geen competitie met klassement.
          </p>
        )}
      </Section>

      <Section
        eyebrow="Kalender"
        title="Volgende wedstrijden"
        intro="De eerstvolgende wedstrijden van deze ploeg."
        action={
          team.externalRefs.calendarUrl ? (
            <a
              href={team.externalRefs.calendarUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
            >
              Volledig overzicht
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : undefined
        }
      >
        <Reveal className="surface-card px-5 py-2 sm:px-8 sm:py-4">
          {upcoming.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Geen geplande wedstrijden.
            </p>
          ) : (
            upcoming.map((match) => <MatchRow key={match.id} match={match} team={team} />)
          )}
        </Reveal>

        {played.length > 0 ? (
          <Reveal delay={100} className="mt-8">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Gespeeld
            </h3>
            <div className="surface-card mt-4 px-5 py-2 sm:px-8 sm:py-4">
              {played.map((match) => (
                <MatchRow key={match.id} match={match} team={team} />
              ))}
            </div>
          </Reveal>
        ) : null}
      </Section>
    </>
  );
}
