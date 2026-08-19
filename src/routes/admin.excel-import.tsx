import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, FileSpreadsheet, Table2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

/**
 * Documentation-only page: describes the future Excel → CMS → website flow.
 * No upload or import logic yet; the data model already matches these sheets.
 */
export const Route = createFileRoute("/admin/excel-import")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Excel-import — Beheer VC Berg-Op Wijgmaal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminExcelImport,
});

const SHEETS: { name: string; columns: string[]; body: string }[] = [
  {
    name: "Teams",
    columns: [
      "teamId",
      "slug",
      "name",
      "shortName",
      "level",
      "description",
      "photoUrl",
      "coach",
      "assistantCoach",
    ],
    body: "Eén rij per ploeg. teamId is de stabiele sleutel waar alle andere bladen naar verwijzen.",
  },
  {
    name: "Players",
    columns: ["teamId", "name", "number", "position"],
    body: "Eén rij per speler. De kern van een ploeg wordt samengesteld via teamId.",
  },
  {
    name: "Trainings",
    columns: ["teamId", "day", "startTime", "endTime", "venueId"],
    body: "Eén rij per trainingsmoment, met verwijzing naar ploeg én locatie.",
  },
  {
    name: "Locations",
    columns: ["venueId", "name", "address", "postalCode", "city", "googleMapsUrl"],
    body: "Alle zalen op één plek. Adressen worden nooit gedupliceerd in andere bladen.",
  },
  {
    name: "ParserData",
    columns: [
      "teamId",
      "slug",
      "volleyScoresUrl",
      "rankingUrl",
      "calendarUrl",
      "competitionCode",
      "divisionCode",
      "parserEnabled",
    ],
    body: "Koppelsleutels voor de wedstrijd- en klassementparser. parserEnabled zet de koppeling per ploeg aan of uit.",
  },
];

const STEPS = [
  "Beheerder werkt één Excel-werkboek bij met alle sportieve data.",
  "Het werkboek wordt hier opgeladen (nog niet beschikbaar).",
  "Elk blad wordt gevalideerd op verplichte kolommen en stabiele id's.",
  "De rijen worden gesynchroniseerd naar de CMS (Sanity) als documenten.",
  "De website leest de CMS-data via dezelfde providers als vandaag — geen codewijziging nodig.",
];

function AdminExcelImport() {
  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Excel-import"
        intro="Voorbereiding voor het beheren van alle sportieve data via één Excel-werkboek."
      />

      <Section size="compact">
        <Link
          to="/admin"
          className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Terug naar beheeroverzicht
        </Link>

        <div className="surface-card mt-6 p-6 sm:p-8">
          <FileSpreadsheet aria-hidden="true" className="h-7 w-7 text-club-deep" />
          <h2 className="mt-3 font-display text-xl font-bold">Toekomstige werkwijze</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xs font-bold text-foreground">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <span className="mt-6 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            Upload en import volgen later
          </span>
        </div>

        <h2 className="mt-10 font-display text-xl font-bold">Verwachte structuur van het werkboek</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          De datastructuur van de website volgt exact deze bladen. Zolang de kolomnamen en id&apos;s
          behouden blijven, kan een import later toegevoegd worden zonder de site aan te passen.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SHEETS.map((sheet) => (
            <article key={sheet.name} className="surface-card h-full p-6">
              <div className="flex items-center gap-2">
                <Table2 aria-hidden="true" className="h-5 w-5 text-club-deep" />
                <h3 className="font-display text-lg font-bold">{sheet.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sheet.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {sheet.columns.map((column) => (
                  <li
                    key={column}
                    className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-foreground"
                  >
                    {column}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="surface-card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Synchronisatie naar de CMS</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            De rijen uit het werkboek worden uiteindelijk documenten in Sanity, met dezelfde
            stabiele id&apos;s (teamId, venueId). De site blijft alles via de bestaande providers
            lezen, zodat de bron kan wisselen van mockdata naar CMS zonder herbouw van componenten.
            Wedstrijden en klassementen komen apart binnen via de gegenereerde JSON-bestanden van de
            parser, gekoppeld op teamId.
          </p>
        </div>
      </Section>
    </>
  );
}
