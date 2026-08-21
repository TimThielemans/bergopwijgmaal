import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  ExternalLink,
  FileSpreadsheet,
  Handshake,
  Info,
  LogOut,
  MapPin,
  Users,
} from "lucide-react";
import { contentSource, sanityConfig } from "@/lib/config";
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
  {
    icon: Users,
    title: "Ploegen",
    body: "Ploegen, kern, coaches en trainingsuren. Spelers en trainingen staan in de ploeg zelf.",
    type: "team",
  },
  {
    icon: MapPin,
    title: "Locaties",
    body: "Sporthallen met adres en Google Maps-link, gekoppeld aan trainingen.",
    type: "location",
  },
  {
    icon: CalendarDays,
    title: "Activiteiten",
    body: "Clubweekend, pastaverkoop en andere events.",
    type: "activity",
  },
  { icon: Handshake, title: "Sponsors", body: "Logo's, links en sponsorniveaus.", type: "sponsor" },
  {
    icon: Info,
    title: "Clubinfo & bestuur",
    body: "Clubverhaal, waarden, contactgegevens en bestuursleden.",
    type: "clubInfo",
  },
];

/** Deep link into the Studio when its URL is known, otherwise naar sanity.io/manage. */
function editUrl(type: string): string {
  if (sanityConfig.studioUrl) {
    return `${sanityConfig.studioUrl.replace(/\/$/, "")}/structure/${type}`;
  }
  if (sanityConfig.projectId) {
    return `https://www.sanity.io/manage/project/${sanityConfig.projectId}`;
  }
  return "";
}

function AdminDashboard() {
  const { session, signOut } = useAdminAuth();
  const live = contentSource === "sanity";

  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Beheeroverzicht"
        intro={
          live
            ? "De website leest haar content live uit Sanity. Bewerk je content in de Studio; de site volgt automatisch."
            : "Er is nog geen Sanity-project geconfigureerd. De website toont voorlopig de ingebouwde voorbeeldcontent."
        }
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

        <div className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-lg font-bold">Databron</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {live
                ? `Sanity · project ${sanityConfig.projectId} · dataset ${sanityConfig.dataset}`
                : "Ingebouwde voorbeeldcontent (VITE_SANITY_PROJECT_ID ontbreekt)."}
            </p>
            {live ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Zolang de dataset geen publieke leesrechten heeft, valt de site automatisch terug op de
                ingebouwde voorbeeldcontent. Zet in sanity.io/manage de dataset op publiek.
              </p>
            ) : null}
          </div>
          <span
            className={
              live
                ? "rounded-full bg-club/15 px-3 py-1 text-xs font-semibold text-club-deep"
                : "rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground"
            }
          >
            {live ? "Live via Sanity" : "Voorbeeldcontent"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => {
            const href = live ? editUrl(card.type) : "";
            return (
              <article key={card.title} className="surface-card h-full p-6">
                <card.icon aria-hidden="true" className="h-6 w-6 text-club-deep" />
                <h2 className="mt-3 font-display text-lg font-bold">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1 rounded-full bg-club/15 px-3 py-1 text-xs font-semibold text-club-deep"
                  >
                    Bewerken in Sanity
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Binnenkort via Sanity
                  </span>
                )}
              </article>
            );
          })}

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
        </div>

        <div className="surface-card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Sanity Studio</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Foto's van ploegen, activiteiten en sponsorlogo's beheer je uitsluitend in de Studio.
            Excel levert later enkel tekstuele data en de alt-teksten aan.
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
            ) : sanityConfig.projectId ? (
              <a
                href={`https://www.sanity.io/manage/project/${sanityConfig.projectId}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-5 font-display text-sm font-semibold"
              >
                Sanity-project openen
              </a>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
