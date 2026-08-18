import { ArrowRight, MapPin } from "lucide-react";
import type { Match, Team } from "@/content/types";
import { formatDateShort, formatTimeCompact, formatWeekday, isValidDateTime } from "@/lib/format";
import { text } from "@/lib/safe";

interface Props {
  match: Match;
  team?: Team | undefined;
}

/** Hero insert: invites visitors to the next home game. */
export function NextHomeMatchCard({ match, team }: Props) {
  if (!match) return null;

  const opponent = text(match.opponent, "Tegenstander volgt");
  const hasDate = isValidDateTime(match.dateTime);
  const venueName = text(match.venue?.name);
  const venueCity = text(match.venue?.city);

  return (
    <a
      href="#wedstrijden"
      className="group block rounded-2xl border border-ink-foreground/15 bg-ink-foreground/[0.06] p-6 backdrop-blur-sm transition-colors hover:border-club/60 sm:p-7"
    >
      <span className="flex items-center gap-2 text-eyebrow text-club">
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-club opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-club" />
        </span>
        Volgende thuismatch
      </span>

      <p className="mt-4 font-display text-2xl font-bold leading-tight">
        {text(team?.name, "Berg-Op")}
        <span className="text-ink-foreground/45"> vs </span>
        {opponent}
      </p>

      {hasDate ? (
        <p className="mt-3 font-display text-lg font-semibold text-club">
          {formatWeekday(match.dateTime)} {formatDateShort(match.dateTime)} ·{" "}
          {formatTimeCompact(match.dateTime)}
        </p>
      ) : (
        <p className="mt-3 font-display text-lg font-semibold text-club">Datum nog te bepalen</p>
      )}

      {venueName ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-foreground/65">
          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
          {venueName}
          {venueCity ? `, ${venueCity}` : ""}
        </p>
      ) : null}

      <p className="mt-5 flex items-center gap-2 border-t border-ink-foreground/15 pt-4 font-display text-sm font-semibold">
        Kom supporteren in Wijgmaal
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 text-club transition-transform group-hover:translate-x-1"
        />
      </p>
    </a>
  );
}
