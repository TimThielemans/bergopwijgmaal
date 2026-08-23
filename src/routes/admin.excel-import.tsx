import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, FileSpreadsheet, Table2, Upload } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { analyzeExcelImport, applyExcelImport } from "@/lib/import/excel.functions";
import { IMPORT_SHEETS, type ImportAnalysis, type ImportResult } from "@/lib/import/types";

/**
 * Working Excel → Sanity import.
 *
 * Flow: upload → server validates and previews → confirm → write. Nothing is
 * written without an explicit confirmation, and documents that are absent from
 * the workbook are never deleted.
 */
export const Route = createFileRoute("/admin/excel-import")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Excel-import — Beheer VC Berg-Op Wijgmaal" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminExcelImport,
});

const SHEET_DOCS: { name: keyof typeof IMPORT_SHEETS; body: string }[] = [
  {
    name: "Teams",
    body: "Eén rij per ploeg. teamId is de stabiele sleutel waar alle andere bladen naar verwijzen. Foto's blijven in de Studio; enkel photoAlt komt uit Excel.",
  },
  { name: "Players", body: "Eén rij per speler. De kern wordt samengesteld via teamId." },
  {
    name: "Trainings",
    body: "Eén rij per trainingsmoment, met verwijzing naar ploeg én locatie (venueId).",
  },
  {
    name: "Locations",
    body: "Alle zalen op één plek. Adressen worden nooit gedupliceerd in andere bladen.",
  },
  {
    name: "ParserData",
    body: "VolleyScores-configuratie met ids: clubId (ci), teamId (ti) en seriesId (ssi). Volledige URL's worden nooit opgeslagen — die worden afgeleid. Bij parserEnabled = WAAR zijn ci/ti/ssi verplicht.",
  },
];

function readBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.slice(result.indexOf(",") + 1) : result);
    };
    reader.onerror = () => reject(new Error("Bestand kon niet gelezen worden"));
    reader.readAsDataURL(file);
  });
}

function AdminExcelImport() {
  const queryClient = useQueryClient();
  const analyzeFn = useServerFn(analyzeExcelImport);
  const applyFn = useServerFn(applyExcelImport);

  const [file, setFile] = useState<{ name: string; base64: string } | null>(null);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [readError, setReadError] = useState<string | null>(null);

  const analyze = useMutation({
    mutationFn: (input: { fileName: string; base64: string }) => analyzeFn({ data: input }),
    onSuccess: (data) => {
      setAnalysis(data);
      setResult(null);
    },
  });

  const apply = useMutation({
    mutationFn: (input: { fileName: string; base64: string }) => applyFn({ data: input }),
    onSuccess: async (data) => {
      setResult(data);
      setAnalysis(data.analysis);
      await queryClient.invalidateQueries();
    },
  });

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setReadError(null);
    setAnalysis(null);
    setResult(null);
    if (!selected) {
      setFile(null);
      return;
    }
    try {
      const base64 = await readBase64(selected);
      const next = { name: selected.name, base64 };
      setFile(next);
      analyze.mutate({ fileName: next.name, base64: next.base64 });
    } catch (error) {
      setFile(null);
      setReadError(error instanceof Error ? error.message : "Bestand kon niet gelezen worden");
    }
  }

  const busy = analyze.isPending || apply.isPending;
  const changed = (analysis?.changes ?? []).filter((change) => change.kind !== "unchanged");

  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Excel-import"
        intro="Beheer alle sportieve data via één Excel-werkboek en synchroniseer het naar de CMS."
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
          <h2 className="mt-3 font-display text-xl font-bold">Werkboek opladen</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Het bestand wordt server-side gecontroleerd. Je ziet eerst een voorbeeld van de wijzigingen; er wordt niets
            weggeschreven zonder je bevestiging. Documenten die niet in het werkboek staan, blijven ongewijzigd.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink px-5 font-display text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90">
              <Upload aria-hidden="true" className="h-4 w-4" />
              {file ? "Ander bestand kiezen" : "Kies .xlsx-bestand"}
              <input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                onChange={onFileChange}
                disabled={busy}
              />
            </label>
            <a
              href="/BOWsite-import-voorbeeld.xlsx"
              download
              className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Voorbeeldwerkboek (huidige data)
            </a>
          </div>

          {file ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Gekozen bestand: <span className="font-semibold text-foreground">{file.name}</span>
            </p>
          ) : null}
          {readError ? <p className="mt-3 text-sm text-loss">{readError}</p> : null}
          {analyze.isPending ? (
            <p className="mt-3 text-sm text-muted-foreground">Werkboek wordt gecontroleerd…</p>
          ) : null}
          {analyze.isError ? (
            <p className="mt-3 text-sm text-loss">
              Controle mislukt: {analyze.error instanceof Error ? analyze.error.message : "onbekende fout"}
            </p>
          ) : null}
        </div>

        {analysis ? (
          <div className="surface-card mt-4 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Voorbeeld van de import</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Nieuw</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{analysis.summary.new}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Gewijzigd</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{analysis.summary.changed}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Ongewijzigd</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{analysis.summary.unchanged}</dd>
              </div>
            </dl>

            <p className="mt-4 text-sm text-muted-foreground">
              Rijen per blad:{" "}
              {Object.entries(analysis.rowCounts)
                .map(([sheet, count]) => `${sheet}: ${count}`)
                .join(" · ")}
            </p>

            {analysis.errors.length > 0 ? (
              <div className="mt-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-loss">
                  <AlertTriangle aria-hidden="true" className="h-4 w-4" />
                  Fouten ({analysis.errors.length}) — import geblokkeerd
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {analysis.errors.slice(0, 25).map((issue, index) => (
                    <li key={`${issue.sheet}-${issue.row}-${index}`}>
                      <span className="font-semibold text-foreground">
                        {issue.sheet}
                        {issue.row ? ` rij ${issue.row}` : ""}
                      </span>{" "}
                      — {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {analysis.warnings.length > 0 ? (
              <div className="mt-5">
                <h3 className="font-display text-sm font-bold">Waarschuwingen ({analysis.warnings.length})</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {analysis.warnings.slice(0, 15).map((issue, index) => (
                    <li key={`${issue.sheet}-${issue.row}-w${index}`}>
                      <span className="font-semibold text-foreground">
                        {issue.sheet}
                        {issue.row ? ` rij ${issue.row}` : ""}
                      </span>{" "}
                      — {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {changed.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-4">Document</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Velden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changed.map((change) => (
                      <tr key={change.documentId} className="border-t border-border">
                        <td className="py-2 pr-4 font-semibold">{change.label}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{change.type}</td>
                        <td className="py-2 pr-4">{change.kind === "new" ? "Nieuw" : "Gewijzigd"}</td>
                        <td className="py-2 text-muted-foreground">
                          {change.fields.slice(0, 6).join(", ")}
                          {change.fields.length > 6 ? " …" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">Geen wijzigingen tegenover de huidige CMS-data.</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!analysis.ok || busy || changed.length === 0 || !file}
                onClick={() => file && apply.mutate({ fileName: file.name, base64: file.base64 })}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-club-deep px-5 font-display text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {apply.isPending ? "Wegschrijven…" : "Import bevestigen"}
              </button>
              {!analysis.ok ? (
                <span className="text-sm text-muted-foreground">Los eerst de fouten op in het werkboek.</span>
              ) : null}
            </div>

            {apply.isError ? (
              <p className="mt-3 text-sm text-loss">
                Import mislukt: {apply.error instanceof Error ? apply.error.message : "onbekende fout"}
              </p>
            ) : null}
            {result?.ok ? (
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-club-deep">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                {result.written} document(en) weggeschreven naar de CMS.
              </p>
            ) : null}
          </div>
        ) : null}

        <h2 className="mt-10 font-display text-xl font-bold">Structuur van het werkboek</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          De kolomnamen hieronder zijn wat de import verwacht. Extra kolommen worden genegeerd, de volgorde maakt niet
          uit.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SHEET_DOCS.map((sheet) => (
            <article key={sheet.name} className="surface-card h-full p-6">
              <div className="flex items-center gap-2">
                <Table2 aria-hidden="true" className="h-5 w-5 text-club-deep" />
                <h3 className="font-display text-lg font-bold">{sheet.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sheet.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {IMPORT_SHEETS[sheet.name].columns.map((column) => (
                  <li key={column} className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-foreground">
                    {column}
                    {IMPORT_SHEETS[sheet.name].required.includes(column) ? " *" : ""}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="surface-card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Hoe de synchronisatie werkt</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Elke rij wordt een document in de CMS met een stabiel id (team.&lt;teamId&gt;, location.&lt;venueId&gt;),
            dus opnieuw importeren overschrijft netjes dezelfde documenten en de revisiehistoriek blijft bewaard.
            Wedstrijden en klassementen komen niet uit Excel: die worden opgehaald door de VolleyDataParser op basis van
            de ids uit het blad ParserData.
          </p>
        </div>

        <div className="surface-card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Bekomen van VolleyScores-data</h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Elke ploeg heeft een aantal VolleyScores-identifiers die gebruikt worden door de parser:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong>clubId (ci)</strong>: verkrijg je via <em>Alle wedstrijden van BOW</em>.
            </li>
            <li>
              <strong>teamId (ti)</strong>: verkrijg je via de detailpagina van een ploeg.
            </li>
            <li>
              <strong>seriesId (ssi)</strong>: verkrijg je via de detailpagina van een reeks/klassement.
            </li>
          </ul>

          <p className="mt-4 text-sm text-muted-foreground">
            Open de browser DevTools (F12) en voer onderstaande code uit in de console:
          </p>

          <pre className="mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-xs">
            {`Object.fromEntries(
  [...document.querySelectorAll('.gts')]
    .map(x => [x.dataset.gt, x.value])
)`}
          </pre>

          <p className="mt-4 text-sm text-muted-foreground">
            Voor Berg-op Wijgmaal is de <strong>clubId (ci)</strong> momenteel:
          </p>

          <code className="mt-2 inline-block rounded bg-club/10 px-3 py-1 text-sm font-semibold text-club-deep">
            10754
          </code>
        </div>
      </Section>
    </>
  );
}
