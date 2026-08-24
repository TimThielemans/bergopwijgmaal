import { Trophy } from "lucide-react";
import type { RankingTable as RankingTableData } from "@/lib/adapters";
import { list, text } from "@/lib/safe";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

/**
 * Full classement of a division, straight from the adapter output.
 * The club's own row is highlighted; on small screens the position and team
 * columns stay sticky while the statistics scroll horizontally.
 */
export function RankingTable({
  table,
  className,
}: {
  table?: RankingTableData | null | undefined;
  className?: string;
}) {
  const rows = list(table?.rows);

  if (rows.length === 0) {
    return (
      <EmptyState
        {...(className ? { className } : {})}
        message="Nog geen volledige stand beschikbaar"
        hint="Zodra de reeks een gepubliceerd klassement heeft, verschijnt de volledige tabel hier."
        icon={Trophy}
      />
    );
  }

  const division = text(table?.division);

  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <caption className="px-4 pt-5 text-left font-display text-base font-bold sm:px-6">
            Volledig klassement
            {division ? (
              <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                {division}
              </span>
            ) : null}
          </caption>
          <thead>
            <tr className="text-eyebrow text-muted-foreground">
              <th scope="col" className="sticky left-0 bg-card px-4 py-3 text-left sm:px-6">
                #
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                Ploeg
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                WED
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                PTN
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                W+
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                W-
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                S+
              </th>
              <th scope="col" className="px-3 py-3 pr-4 text-right sm:pr-6">
                S-
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.teamName}-${index}`}
                {...(row.isOwnTeam ? { "aria-current": "true" as const } : {})}
                className={cn(
                  "border-t border-border",
                  row.isOwnTeam ? "bg-club/12 font-semibold text-club-deep" : null,
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 px-4 py-3 text-left font-display font-bold sm:px-6",
                    row.isOwnTeam
                      ? "bg-club/12 text-club-deep before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-club-deep before:content-['']"
                      : "bg-card",
                  )}
                >
                  {text(row.positionLabel, String(row.position))}
                </th>
                <td className="px-3 py-3">
                  {row.teamName}
                  {row.isOwnTeam ? <span className="sr-only"> (onze ploeg)</span> : null}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{row.played}</td>
                <td className="px-3 py-3 text-right font-display font-bold tabular-nums">
                  {row.points}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{row.won}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.lost}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.setsFor}</td>
                <td className="px-3 py-3 pr-4 text-right tabular-nums sm:pr-6">
                  {row.setsAgainst}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 text-xs text-muted-foreground sm:px-6">
        WED = wedstrijden · PTN = punten · W+/W- = gewonnen/verloren · S+/S- = sets voor en tegen.
      </p>
    </div>
  );
}
