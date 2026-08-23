import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { text } from "@/lib/safe";
import { jsonLdScript, pageMeta, sportsTeamJsonLd } from "@/lib/seo";

import { rankingTableQuery, standingQuery, teamCalendarQuery, teamQuery, upcomingMatchesQuery } from "@/lib/providers";
import { TeamDetail } from "@/components/teams/TeamDetail";

export const Route = createFileRoute("/ploegen/$slug")({
  loader: async ({ context, params }) => {
    const team = await context.queryClient.ensureQueryData(teamQuery(params.slug));
    if (!team) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(standingQuery(team.teamId)),
      context.queryClient.ensureQueryData(rankingTableQuery(team.teamId)),
      context.queryClient.ensureQueryData(upcomingMatchesQuery({ teamId: team.teamId, limit: 7 })),
      context.queryClient.ensureQueryData(teamCalendarQuery(team.teamId)),
    ]);
    return {
      teamId: team.teamId,
      name: text(team.name, "Ploeg"),
      level: text(team.level),
      summary: text(team.shortDescription, text(team.description)),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Ploeg niet gevonden — VC Berg-Op Wijgmaal" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = loaderData.level
      ? `${loaderData.name} (${loaderData.level}) — VC Berg-Op Wijgmaal`
      : `${loaderData.name} — VC Berg-Op Wijgmaal`;
    const description =
      loaderData.summary || `Kalender, kern, coaching en klassement van ${loaderData.name} bij VC Berg-Op Wijgmaal.`;
    return {
      meta: pageMeta({ title, description }),
      scripts: [jsonLdScript(sportsTeamJsonLd(loaderData.name, description))],
    };
  },
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { slug } = Route.useParams();
  const { teamId } = Route.useLoaderData();
  const { data: team } = useSuspenseQuery(teamQuery(slug));
  const { data: standing } = useSuspenseQuery(standingQuery(teamId));
  const { data: rankingTable } = useSuspenseQuery(rankingTableQuery(teamId));
  const { data: upcoming } = useSuspenseQuery(upcomingMatchesQuery({ teamId, limit: 4 }));
  const { data: calendar } = useSuspenseQuery(teamCalendarQuery(teamId));

  if (!team) return null;

  return (
    <TeamDetail team={team} standing={standing} rankingTable={rankingTable} upcoming={upcoming} calendar={calendar} />
  );
}
