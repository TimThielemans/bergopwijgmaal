import type { Match, Team } from "@/content/types";
import { formatDateShort, formatTime, formatWeekday } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HomeAwayBadge } from "./HomeAwayBadge";

interface MatchRowProps {
  match: Match;
  team?: Team | undefined;
  className?: string | undefined;

}

/**
 * One match, readable on 375px and aligned into columns from md up.
 * Never a horizontally scrolling table.
 */
export function MatchRow({ match, team, className }: MatchRowProps) {
  return (
    <article
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-border/70 py-4 last:border-b-0 md:grid-cols-[5.5rem_minmax(0,1fr)_auto_auto] md:gap-x-6",
        className,
      )}
    >
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary md:h-auto md:w-auto md:rounded-2xl md:py-2">
        <span className="text-eyebrow text-muted-foreground">{formatWeekday(match.dateTime)}</span>
        <span className="font-display text-base font-bold leading-tight">
          {formatDateShort(match.dateTime)}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-base font-semibold sm:text-lg">
          {match.isHome ? (
            <>
              {team?.name ?? "Berg-Op"} <span className="text-muted-foreground">—</span>{" "}
              {match.opponent}
            </>
          ) : (
            <>
              {match.opponent} <span className="text-muted-foreground">—</span>{" "}
              {team?.name ?? "Berg-Op"}
            </>
          )}
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {match.competition} · {match.venue.name}
          {match.venue.city ? `, ${match.venue.city}` : ""}
        </p>
      </div>

      <div className="col-start-2 flex items-center gap-3 md:col-start-3">
        <HomeAwayBadge isHome={match.isHome} />
        {match.result ? (
          <span className="font-display text-sm font-bold">
            {match.result.setsFor}–{match.result.setsAgainst}
          </span>
        ) : null}
      </div>

      <span className="col-start-2 font-display text-sm font-semibold tabular-nums text-muted-foreground md:col-start-4 md:text-base md:text-foreground">
        {formatTime(match.dateTime)}
      </span>
    </article>
  );
}
