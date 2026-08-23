import { Link } from "@tanstack/react-router";
import { CalendarDays, ExternalLink, Trophy, Users } from "lucide-react";
import type { Match, RankingEntry, Team } from "@/content/types";
import { findVenue, useSiteContent } from "@/lib/site-content";
import { formatPosition } from "@/lib/format";
import { list, safeUrl, text } from "@/lib/safe";
import { buildPublicOverviewUrl } from "@/lib/parser/urls";
import { Section } from "@/components/layout/Section";
import { BrandGraphic, BrandTile } from "@/components/shared/BrandGraphic";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormStreak } from "@/components/shared/FormStreak";
import { MatchRow } from "@/components/shared/MatchRow";
import { Reveal } from "@/components/shared/Reveal";
import { SafeImage } from "@/components/shared/SafeImage";

interface TeamDetailProps {
  team: Team;
  standing?: RankingEntry | null;
  upcoming?: Match[] | null;
  calendar?: Match[] | null;
}

export function TeamDetail({ team, standing, upcoming, calendar }: TeamDetailProps) {
  const { venues } = useSiteContent();
  const upcomingMatches = list(upcoming);
  const calendarMatches = list(calendar);
  const played = calendarMatches.filter((match) => match.status === "played");

  const name = text(team?.name, "Ploeg");
  const shortName = text(team?.shortName, name.slice(0, 3).toUpperCase());
  const level = text(team?.level);
  const description = text(team?.description, text(team?.shortDescription));
  const coachName = text(team?.coach?.name);
  const coachRole = text(team?.coach?.role);
  const assistantName = text(team?.assistantCoach?.name);
  const trainings = list(team?.trainings);
  const players = list(team?.players);
  const calendarUrl = safeUrl(buildPublicOverviewUrl(team?.parser ?? {}));

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
            <h1 className="mt-5 text-display-lg">{name}</h1>
            {level ? (
              <p className="mt-3 font-display text-lg font-semibold text-club">{level}</p>
            ) : null}
            {description ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75">
                {description}
              </p>
            ) : null}
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ink-foreground/15 pt-6 text-sm">
              <div>
                <dt className="text-ink-foreground/55">Coach</dt>
                <dd className="mt-1 font-display font-semibold">
                  {coachName || "Nog niet gekend"}
                </dd>
              </div>
              <div>
                <dt className="text-ink-foreground/55">Spelers</dt>
                <dd className="mt-1 font-display font-semibold">
                  {players.length > 0 ? players.length : "—"}
                </dd>
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
            <SafeImage
              image={team?.photo}
              loading="eager"
              className="aspect-[4/3] w-full"
              fallback={
                <BrandTile
                  label={shortName}
                  {...(level ? { caption: level } : {})}
                  className="aspect-[4/3] w-full"
                />
              }
            />
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
            {trainings.length === 0 ? (
              <EmptyState
                className="mt-4"
                message="Trainingsuren nog niet bekend"
                hint="Zodra het trainingsschema vastligt, verschijnt het hier."
                icon={CalendarDays}
              />
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {trainings.map((slot, index) => (
                  <li
                    key={`${text(slot?.day)}-${text(slot?.startTime)}-${index}`}
                    className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="font-display font-semibold">
                      {text(slot?.day, "Dag n.n.b.")}
                      {text(slot?.startTime) && text(slot?.endTime)
                        ? ` · ${text(slot?.startTime)}–${text(slot?.endTime)}`
                        : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {text(findVenue(venues, text(slot?.venueId))?.name, "Sporthal")}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-8 flex items-center gap-2 font-display text-xl font-bold">
              <Trophy aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Coaching
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {coachName ? (
                <>
                  {coachName}
                  {coachRole ? ` — ${coachRole}` : ""}
                  {assistantName ? ` · ${assistantName} (assistent)` : ""}
                </>
              ) : (
                "Coach nog niet gekend"
              )}
            </p>
          </Reveal>

          <Reveal delay={100} className="surface-card p-6 sm:p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <Users aria-hidden="true" className="h-5 w-5 text-club-deep" />
              Kern
            </h3>
            {players.length === 0 ? (
              <EmptyState
                className="mt-5"
                message="Nog geen spelers beschikbaar"
                hint="De kern voor dit seizoen wordt binnenkort aangevuld."
                icon={Users}
              />
            ) : (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {players.map((player, index) => (
                  <li
                    key={`${text(player?.name)}-${index}`}
                    className="flex items-center gap-3 rounded-xl bg-secondary/70 px-3 py-2"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink font-display text-xs font-bold text-ink-foreground">
                      {player?.number ?? shortName}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-semibold">
                        {text(player?.name, "Speler")}
                      </span>
                      {text(player?.position) ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {text(player?.position)}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </Section>

      <Section
        tone="tint"
        eyebrow="Klassement"
        title="Stand & vorm"
        {...(standing && text(standing.division)
          ? { intro: `${text(standing.division)}, seizoen in uitvoering.` }
          : {})}
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
          <EmptyState
            message="Geen klassement beschikbaar"
            hint="Deze ploeg speelt geen competitie met klassement, of de stand is nog niet ingelezen."
            icon={Trophy}
          />
        )}
      </Section>

      <Section
        eyebrow="Kalender"
        title="Volgende wedstrijden"
        intro="De eerstvolgende wedstrijden van deze ploeg."
        {...(calendarUrl
          ? {
              action: (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
                >
                  Volledig overzicht
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              ),
            }
          : {})}
      >
        {upcomingMatches.length === 0 ? (
          <EmptyState
            message="Geen geplande wedstrijden"
            hint="De kalender wordt aangevuld zodra de competitiedata beschikbaar zijn."
            icon={CalendarDays}
          />
        ) : (
          <Reveal className="surface-card px-5 py-2 sm:px-8 sm:py-4">
            {upcomingMatches.map((match) => (
              <MatchRow key={match.id} match={match} team={team} />
            ))}
          </Reveal>
        )}

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
