import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

/**
 * Reserved route for the future Sanity Studio.
 * When Sanity is added, this route hosts the embedded studio (client-only).
 */
export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — VC Berg-Op Wijgmaal" },
      { name: "description", content: "Beheeromgeving van VC Berg-Op Wijgmaal." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Studio"
        intro="Deze route is voorbehouden voor de contentbeheeromgeving (Sanity Studio). Ze wordt niet geïndexeerd door zoekmachines."
      />
      <Section size="compact">
        <div className="surface-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Nog niet geactiveerd</h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Zodra Sanity CMS gekoppeld wordt, verschijnt hier de studio waarin ploegen,
            activiteiten, sponsors en clubinfo beheerd worden. De site leest die content via de
            bestaande providers, dus er zijn geen wijzigingen nodig in de componenten.
          </p>
        </div>
      </Section>
    </>
  );
}
