import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, HeartPulse } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/praktisch/")({
  head: () => ({
    meta: pageMeta({
      title: "Praktisch — BOW",
      description: "Praktische info voor leden van BOW: verzekering bij blessures en de procedure voor thuismatchen.",
    }),
  }),
  component: PracticalPage,
});

const CARDS = [
  {
    to: "/praktisch/verzekering" as const,
    icon: HeartPulse,
    title: "Ben je geblesseerd?",
    body: "Lees hier wat je moet doen voor de verzekering.",
    cta: "Naar verzekering",
  },
  {
    to: "/praktisch/match" as const,
    icon: ClipboardList,
    title: "Zaal klaarzetten voor een match?",
    body: "Ben je nog niet vertrouwd met het klaarzetten van de zaal? Vind hier heel de procedure voor de thuisploeg en markeerders.",
    cta: "Naar matchprocedure",
  },
];

function PracticalPage() {
  return (
    <>
      <PageHero eyebrow="Praktisch" title="Goed om te weten" intro="Kort en concreet: waar vind je wat als je het nodig hebt." />
      <Section size="compact">
        <div className="grid gap-5 sm:grid-cols-2">
          {CARDS.map(({ to, icon: Icon, title, body, cta }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-club"
            >
              <Icon aria-hidden="true" className="h-8 w-8 text-club" />
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 flex-1 text-muted-foreground">{body}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-club">
                {cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
