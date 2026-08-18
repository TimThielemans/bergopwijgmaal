import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { list, text } from "@/lib/safe";
import { pageMeta } from "@/lib/seo";
import { teamsQuery } from "@/lib/providers";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
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

const GROUPS = [
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

function TeamsPage() {
  const { data } = useSuspenseQuery(teamsQuery());
  const teams = list(data).filter((team) => text(team?.slug).length > 0);
  const grouped = GROUPS.map((group) => ({
    ...group,
    teams: teams.filter((team) => team.category === group.key),
  })).filter((group) => group.teams.length > 0);
  const ungrouped = teams.filter(
    (team) => !GROUPS.some((group) => group.key === team.category),
  );

  return (
    <>
      <PageHero eyebrow="Ploegen" title="Elke speler een ploeg op maat" intro={DESCRIPTION} />

      {teams.length === 0 ? (
        <Section>
          <EmptyState
            message="Ploeginfo wordt binnenkort toegevoegd"
            hint="De ploegen voor dit seizoen worden momenteel samengesteld."
            icon={Users}
          />
        </Section>
      ) : null}

      {grouped.map((group, index) => (
        <Section
          key={group.key}
          id={group.key}
          tone={index % 2 === 1 ? "tint" : "paper"}
          eyebrow={`${group.teams.length} ${group.teams.length === 1 ? "ploeg" : "ploegen"}`}
          title={group.title}
          intro={group.intro}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.teams.map((team, cardIndex) => (
              <Reveal key={team.id} delay={cardIndex * 60}>
                <TeamCard team={team} />
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {ungrouped.length > 0 ? (
        <Section
          tone={grouped.length % 2 === 1 ? "tint" : "paper"}
          eyebrow={`${ungrouped.length} ploegen`}
          title="Overige ploegen"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ungrouped.map((team, cardIndex) => (
              <Reveal key={team.id} delay={cardIndex * 60}>
                <TeamCard team={team} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
