import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ACTIVITIES, SPONSORS } from "@/content";
import { formatRelativeUpdate } from "@/lib/format";
import { list } from "@/lib/safe";

import { jsonLdScript, pageMeta, sportsClubJsonLd } from "@/lib/seo";
import { matchProvider, rankingProvider, standingsQuery, teamsQuery, upcomingMatchesQuery } from "@/lib/providers";
import { HeroSection } from "@/components/home/HeroSection";
import { UpcomingMatchesSection } from "@/components/home/UpcomingMatchesSection";
import { RankingsSection } from "@/components/home/RankingsSection";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { TeamsOverviewSection } from "@/components/home/TeamsOverviewSection";
import { AboutSection } from "@/components/home/AboutSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { ContactSection } from "@/components/home/ContactSection";

const TITLE = "Berg-Op Wijgmaal — familiale volleybalclub in Leuven";
const DESCRIPTION =
  "Volleybal in Wijgmaal bij Leuven: competitieve en recreatieve ploegen, wedstrijdkalender, standen en clubactiviteiten";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [, , , matchesUpdatedAt, rankingsUpdatedAt] = await Promise.all([
      context.queryClient.ensureQueryData(teamsQuery()),
      context.queryClient.ensureQueryData(upcomingMatchesQuery({ limit: 5 })),
      context.queryClient.ensureQueryData(standingsQuery()),
      matchProvider.getLastUpdated().catch(() => null),
      rankingProvider.getLastUpdated().catch(() => null),
    ]);
    return { matchesUpdatedAt, rankingsUpdatedAt };
  },
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION }),
    scripts: [jsonLdScript(sportsClubJsonLd)],
  }),
  component: HomePage,
});

function HomePage() {
  const { matchesUpdatedAt, rankingsUpdatedAt } = Route.useLoaderData();
  const { data: teamsData } = useSuspenseQuery(teamsQuery());
  const { data: matchesData } = useSuspenseQuery(upcomingMatchesQuery({ limit: 5 }));
  const { data: standingsData } = useSuspenseQuery(standingsQuery());
  const teams = list(teamsData);
  const matches = list(matchesData);
  const standings = list(standingsData);
  const nextHomeMatch = matches.find((match) => match.isHome === true);
  const nextHomeMatchTeam = nextHomeMatch
    ? teams.find((team) => team.teamId === nextHomeMatch.teamId)
    : undefined;
  const activeMembers = teams.reduce((total, team) => total + list(team?.players).length, 0);


  return (
    <>
      <HeroSection
        teamCount={teams.length}
        playerCount={activeMembers}
        nextHomeMatch={nextHomeMatch}
        nextHomeMatchTeam={nextHomeMatchTeam}
      />
      <UpcomingMatchesSection matches={matches} teams={teams} lastUpdated={formatRelativeUpdate(matchesUpdatedAt)} />
      <RankingsSection standings={standings} teams={teams} lastUpdated={formatRelativeUpdate(rankingsUpdatedAt)} />
      <ActivitiesSection activities={ACTIVITIES} />
      <TeamsOverviewSection teams={teams} />
      <AboutSection />
      <SponsorsSection sponsors={SPONSORS} />
      <ContactSection />
    </>
  );
}
