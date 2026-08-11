import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pageMeta } from "@/lib/seo";
import { teamsQuery } from "@/lib/providers";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { TeamCard } from "@/components/teams/TeamCard";

const TITLE = "Ploegen — VC Berg-Op Wijgmaal";
const DESCRIPTION =
  "Alle ploegen van VC Berg-Op Wijgmaal: competitieve teams van nationaal tot provinciaal en recreatieve ploegen in Wijgmaal, Leuven.";

export const Route = createFileRoute("/ploegen/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(teamsQuery()),
  head: () => ({ meta: pageMeta({ title: TITLE, description: DESCRIPTION }) }),
  component: TeamsPage,
});

function TeamsPage() {
  const { data: teams } = useSuspenseQuery(teamsQuery());
  const groups = [
    {
      key: "competitief" as const,
      title: "Competitieploegen",
      intro: "Twee trainingen per week, een vaste kern en duidelijke sportieve doelstellingen.",
    },
    {
      key: "recreatief" as const,
      title: "Recreatieve ploegen",
      intro: "Volleybal om het spel: één training per week, wedstrijden zonder klassementsdruk.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Ploegen"
        title="Elke speler een ploeg op maat"
        intro={DESCRIPTION}
      />

      {groups.map((group, index) => {
        const teamsInGroup = teams.filter((team) => team.category === group.key);
        if (teamsInGroup.length === 0) return null;
        return (
          <Section
            key={group.key}
            id={group.key}
            tone={index % 2 === 1 ? "tint" : "paper"}
            eyebrow={`${teamsInGroup.length} ploegen`}
            title={group.title}
            intro={group.intro}
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teamsInGroup.map((team, cardIndex) => (
                <Reveal key={team.id} delay={cardIndex * 60}>
                  <TeamCard team={team} />
                </Reveal>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
