import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Handshake, Info, LogOut, Users } from "lucide-react";
import { sanityConfig } from "@/lib/config";
import { useAdminAuth } from "@/lib/admin/auth";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Beheer — VC Berg-Op Wijgmaal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const CARDS = [
  { icon: Users, title: "Ploegen", body: "Ploegen, kern, coaches en trainingsuren." },
  { icon: CalendarDays, title: "Activiteiten", body: "Clubweekend, pastaverkoop en andere events." },
  { icon: Handshake, title: "Sponsors", body: "Logo's, links en sponsorniveaus." },
  { icon: Info, title: "Clubinfo", body: "Clubverhaal, waarden, bestuur en contactgegevens." },
];

function AdminDashboard() {
  const { session, signOut } = useAdminAuth();

  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Beheeroverzicht"
        intro="Deze omgeving is voorbereid op contentbeheer via Sanity. Er is nog niets om te bewerken."
      />

      <Section size="compact">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Aangemeld als <span className="font-semibold text-foreground">{session?.email ?? "onbekend"}</span>
          </p>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 font-display text-sm font-semibold transition-colors hover:border-club"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Afmelden
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link to="/admin/excel-import" className="surface-card h-full p-6 transition-transform hover:scale-[1.01]">
            <FileSpreadsheet aria-hidden="true" className="h-6 w-6 text-club-deep" />
            <h2 className="mt-3 font-display text-lg font-bold">Excel-import</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Werkwijze en verwachte structuur van het Excel-werkboek met alle sportieve data.
            </p>
            <span className="mt-4 inline-block rounded-full bg-club/15 px-3 py-1 text-xs font-semibold text-club-deep">
              Documentatie bekijken
            </span>
          </Link>

          {CARDS.map((card) => (
            <article key={card.title} className="surface-card h-full p-6">
              <card.icon aria-hidden="true" className="h-6 w-6 text-club-deep" />
              <h2 className="mt-3 font-display text-lg font-bold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                Binnenkort via Sanity
              </span>
            </article>
          ))}
        </div>


        <div className="surface-card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Sanity Studio</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {sanityConfig.enabled
              ? `Project ${sanityConfig.projectId} · dataset ${sanityConfig.dataset}`
              : "Nog geen Sanity-project geconfigureerd (VITE_SANITY_PROJECT_ID ontbreekt)."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/studio"
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-display text-sm font-semibold text-ink-foreground"
            >
              Naar studio-route
            </Link>
            {sanityConfig.studioUrl ? (
              <a
                href={sanityConfig.studioUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-5 font-display text-sm font-semibold"
              >
                Externe studio openen
              </a>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
