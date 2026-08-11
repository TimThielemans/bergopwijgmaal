import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jsonLdScript, pageMeta, sportsTeamJsonLd } from "@/lib/seo";
import {
  standingQuery,
  teamCalendarQuery,
  teamQuery,
  upcomingMatchesQuery,
} from "@/lib/providers";
import { TeamDetail } from "@/components/teams/TeamDetail";

export const Route = createFileRoute("/ploegen/$slug")({
  loader: async ({ context, params }) => {
    const team = await context.queryClient.ensureQueryData(teamQuery(params.slug));
    if (!team) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(standingQuery(team.id)),
      context.queryClient.ensureQueryData(upcomingMatchesQuery({ teamId: team.id, limit: 4 })),
      context.queryClient.ensureQueryData(teamCalendarQuery(team.id)),
    ]);
    return { teamId: team.id, name: team.name, level: team.level, summary: team.shortDescription };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Ploeg niet gevonden — VC Berg-Op Wijgmaal" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} (${loaderData.level}) — VC Berg-Op Wijgmaal`;
    return {
      meta: pageMeta({ title, description: loaderData.summary }),
      scripts: [jsonLdScript(sportsTeamJsonLd(loaderData.name, loaderData.summary))],
    };
  },
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { slug } = Route.useParams();
  const { teamId } = Route.useLoaderData();
  const { data: team } = useSuspenseQuery(teamQuery(slug));
  const { data: standing } = useSuspenseQuery(standingQuery(teamId));
  const { data: upcoming } = useSuspenseQuery(upcomingMatchesQuery({ teamId, limit: 4 }));
  const { data: calendar } = useSuspenseQuery(teamCalendarQuery(teamId));

  if (!team) return null;

  return (
    <TeamDetail team={team} standing={standing} upcoming={upcoming} calendar={calendar} />
  );
}
