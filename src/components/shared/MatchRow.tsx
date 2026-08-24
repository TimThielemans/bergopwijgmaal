import { Link } from "@tanstack/react-router";
import type { Match, Team } from "@/content/types";
import { formatDateShort, formatTime, formatWeekday, isValidDateTime } from "@/lib/format";
import { text } from "@/lib/safe";
import { cn } from "@/lib/utils";
import { HomeAwayBadge } from "./HomeAwayBadge";
import { ResultBadge } from "./ResultBadge";

type MatchRowVariant = "default" | "upcoming" | "played";

interface MatchRowProps {
  match: Match;
  team?: Team | undefined;
  /**
   * "default" (homepage) shows the home/away badge and the time,
   * "upcoming" drops the badge, "played" drops badge and time and shows the result.
   */
  variant?: MatchRowVariant;
  className?: string | undefined;
}

/**
 * One match, readable on 375px and aligned into columns from md up.
 * Never a horizontally scrolling table. Tolerates missing optional fields.
 */
export function MatchRow({ match, team, variant = "default", className }: MatchRowProps) {
  if (!match) return null;

  const showHomeAway = variant === "default";
  const showTime = variant !== "played";

  const slug = text(team?.slug);
  const teamName = text(team?.name, "Berg-Op");
  const opponent = text(match.opponent, "Tegenstander nog niet gekend");
  const hasDate = isValidDateTime(match.dateTime);

  const teamLabel = slug ? (
    <Link
      to="/ploegen/$slug"
      params={{ slug }}
      className="underline-offset-4 transition-colors hover:text-club-deep hover:underline"
    >
      {teamName}
    </Link>
  ) : (
    teamName
  );

  const meta = [text(match.competition), text(match.venue?.name)]
    .filter((value) => value.length > 0)
    .join(" · ");
  const city = text(match.venue?.city);

  return (
    <article
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-border/70 py-4 last:border-b-0 md:grid-cols-[5.5rem_minmax(0,1fr)_auto_auto] md:gap-x-6",
        className,
      )}
    >
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary md:h-auto md:w-auto md:rounded-2xl md:py-2">
        {hasDate ? (
          <>
            <span className="text-eyebrow text-muted-foreground">
              {formatWeekday(match.dateTime)}
            </span>
            <span className="font-display text-base font-bold leading-tight">
              {formatDateShort(match.dateTime)}
            </span>
          </>
        ) : (
          <span className="text-eyebrow text-muted-foreground">Datum n.n.b.</span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-base font-semibold sm:text-lg">
          {match.isHome ? (
            <>
              {teamLabel} <span className="text-muted-foreground">—</span> {opponent}
            </>
          ) : (
            <>
              {opponent} <span className="text-muted-foreground">—</span> {teamLabel}
            </>
          )}
        </h3>

        {meta ? (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {meta}
            {city ? `, ${city}` : ""}
          </p>
        ) : null}
      </div>

      <div className="col-start-2 flex items-center gap-3 md:col-start-3">
        <HomeAwayBadge isHome={match.isHome === true} />
        {match.result ? (
          <span className="font-display text-sm font-bold">
            {match.result.setsFor}–{match.result.setsAgainst}
          </span>
        ) : null}
      </div>

      {hasDate ? (
        <span className="col-start-2 font-display text-sm font-semibold tabular-nums text-muted-foreground md:col-start-4 md:text-base md:text-foreground">
          {formatTime(match.dateTime)}
        </span>
      ) : (
        <span className="col-start-2 md:col-start-4" />
      )}
    </article>
  );
}
