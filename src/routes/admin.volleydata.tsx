import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { getVolleyDataStatus, refreshVolleyData } from "@/lib/parser/refresh.functions";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/admin/volleydata")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Volley-data verversen — VC Berg-Op Wijgmaal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VolleyDataAdmin,
});

function formatMoment(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("nl-BE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Brussels",
  }).format(date);
}

function VolleyDataAdmin() {
  const fetchStatus = useServerFn(getVolleyDataStatus);
  const runRefresh = useServerFn(refreshVolleyData);

  const status = useQuery({
    queryKey: ["volleydata", "status"],
    queryFn: () => fetchStatus(),
  });

  const adapter = useQuery({
    queryKey: ["volleydata", "adapter", refresh_key],
    queryFn: () => loadAdaptedVolleyData(),
  });


  const refresh = useMutation({
    mutationFn: () => runRefresh(),
    onSettled: () => {
      void status.refetch();
    },
  });

  const result = refresh.data;

  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Volley-data verversen"
        intro="De parser haalt kalenders en standen op bij VolleyScores op basis van de ids in elke ploeg (ci/ti/ssi) en bewaart het resultaat rechtstreeks in Sanity. Geen bestanden, geen redeploy."
      />

      <Section size="compact">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Terug naar beheeroverzicht
        </Link>

        <div className="surface-card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-lg font-bold">Nu verversen</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Alle ploegen met een actieve parser worden tegelijk opgehaald. Dit duurt doorgaans
              enkele seconden.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-display text-sm font-semibold text-ink-foreground disabled:opacity-60"
          >
            <RefreshCw
              aria-hidden="true"
              className={refresh.isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
            {refresh.isPending ? "Bezig…" : "Volley-data verversen"}
          </button>
        </div>

        {refresh.isError ? (
          <div className="surface-card mt-4 flex items-start gap-3 p-6 text-sm">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 text-destructive" />
            <p>
              Verversen mislukt:{" "}
              {refresh.error instanceof Error ? refresh.error.message : "onbekende fout"}
            </p>
          </div>
        ) : null}

        {result ? (
          <div className="surface-card mt-4 p-6">
            <div className="flex items-center gap-2">
              {result.ok ? (
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-club-deep" />
              ) : (
                <AlertTriangle aria-hidden="true" className="h-5 w-5 text-destructive" />
              )}
              <h2 className="font-display text-lg font-bold">
                {result.ok ? "Verversen geslaagd" : "Verversen met opmerkingen"}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatMoment(result.generatedAt)} · {result.matches.rowCount} wedstrijdrijen (
              {result.matches.teamCount} ploegen) · {result.rankings.rowCount} standrijen (
              {result.rankings.teamCount} ploegen)
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4">Ploeg</th>
                    <th className="py-2 pr-4">Wedstrijden</th>
                    <th className="py-2 pr-4">Stand</th>
                    <th className="py-2">Opmerkingen</th>
                  </tr>
                </thead>
                <tbody>
                  {result.perTeam.map((team) => (
                    <tr key={team.teamId} className="border-t border-border">
                      <td className="py-2 pr-4 font-semibold">{team.teamName}</td>
                      <td className="py-2 pr-4">{team.matchRows}</td>
                      <td className="py-2 pr-4">{team.rankingRows}</td>
                      <td className="py-2 text-muted-foreground">
                        {team.errors.length > 0 ? team.errors.join(" · ") : "—"}
                      </td>
                    </tr>
                  ))}
                  {result.perTeam.length === 0 ? (
                    <tr className="border-t border-border">
                      <td colSpan={4} className="py-3 text-muted-foreground">
                        Geen ploegen met een actieve parser gevonden.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="surface-card mt-4 p-6">
          <h2 className="font-display text-lg font-bold">Laatste opslag in Sanity</h2>
          {status.isLoading ? (
            <p className="mt-2 text-sm text-muted-foreground">Status wordt opgehaald…</p>
          ) : status.isError ? (
            <p className="mt-2 text-sm text-muted-foreground">Status kon niet worden opgehaald.</p>
          ) : (
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase text-muted-foreground">volleyMatchesRaw</dt>
                <dd className="mt-1 text-sm">
                  {status.data?.matches
                    ? `${formatMoment(status.data.matches.generatedAt)} · ${status.data.matches.rowCount} rijen`
                    : "Nog geen data"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">volleyRankingsRaw</dt>
                <dd className="mt-1 text-sm">
                  {status.data?.rankings
                    ? `${formatMoment(status.data.rankings.generatedAt)} · ${status.data.rankings.rowCount} rijen`
                    : "Nog geen data"}
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="surface-card mt-4 p-6">
          <h2 className="font-display text-lg font-bold">Parserconfiguratie per ploeg</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vul de VolleyScores-ids in de Studio in bij de ploeg zelf: clubId (ci), teamId (ti) en
            seriesId (ssi). De export-URL's worden daaruit opgebouwd.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {(status.data?.teams ?? []).map((team) => (
              <li key={team.teamId} className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{team.teamName}</span>
                {team.missingIds.length === 0 ? (
                  <span className="rounded-full bg-club/15 px-3 py-1 text-xs font-semibold text-club-deep">
                    Volledig geconfigureerd
                  </span>
                ) : (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Ontbreekt: {team.missingIds.join(", ")}
                  </span>
                )}
              </li>
            ))}
            {(status.data?.teams ?? []).length === 0 ? (
              <li className="text-muted-foreground">
                Geen ploegen met een actieve parser in Sanity.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="surface-card mt-4 p-6">
          <h2 className="font-display text-lg font-bold">Adapter (ruwe data → website)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            De ruwe documenten blijven ongewijzigd. De adapterlaag zet ze om naar het
            websitemodel: datums in Brusselse tijd, setstanden, tegenstander en vorm. Enkel het
            hoofdklassement wordt gebruikt, het reserveklassement wordt genegeerd.
          </p>

          {adapter.isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Adapter wordt uitgevoerd…</p>
          ) : adapter.isError ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Adapter kon niet worden uitgevoerd:{" "}
              {adapter.error instanceof Error ? adapter.error.message : "onbekende fout"}
            </p>
          ) : (
            <>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Wedstrijden</dt>
                  <dd className="mt-1 text-sm">
                    {adapter.data?.matches.length ?? 0} omgezet · bron:{" "}
                    {adapter.data?.matchSource === "sanity" ? "Sanity (ruwe data)" : "fallback JSON"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Standen</dt>
                  <dd className="mt-1 text-sm">
                    {adapter.data?.rankings.length ?? 0} omgezet · bron:{" "}
                    {adapter.data?.rankingSource === "sanity"
                      ? "Sanity (ruwe data)"
                      : "fallback JSON"}
                  </dd>
                </div>
              </dl>

              {(adapter.data?.tables ?? []).length > 0 ? (
                <ul className="mt-4 space-y-1 text-sm">
                  {(adapter.data?.tables ?? []).map((table) => (
                    <li key={`${table.teamId}-${table.division}`} className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{table.teamId}</span> ·{" "}
                      {table.division || "reeks onbekend"} · {table.rows.length} ploegen in het
                      hoofdklassement
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nog geen gepubliceerd klassement (voorseizoen).
                </p>
              )}

              {(adapter.data?.warnings ?? []).length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-xs uppercase text-muted-foreground">Meldingen</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {(adapter.data?.warnings ?? []).slice(0, 12).map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>

      </Section>
    </>
  );
}
