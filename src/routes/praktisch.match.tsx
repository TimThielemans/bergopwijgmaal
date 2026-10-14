import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  Package,
  RotateCcw,
  Tablet,
  Users,
  Wrench,
} from "lucide-react";
import type { HallSpot, MatchFaq, MatchStep, NetSetupStep, ScorerPhase } from "@/content/types";
import { useSiteContent } from "@/lib/site-content";
import { list, safeUrl, text } from "@/lib/safe";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/praktisch/match")({
  head: () => ({
    meta: pageMeta({
      title: "Matchprocedure: zaal & markeerders — BOW",
      description:
        "Stap voor stap de zaal klaarzetten en opruimen als thuisploeg, plus de VolleySpike-tijdlijn voor markeerders.",
    }),
  }),
  component: MatchProcedurePage,
});

const SPOTS: Record<HallSpot, { label: string; className: string }> = {
  ballenkot: { label: "Ballenkot", className: "bg-club/15 text-club border-club/40" },
  verzorging: { label: "Verzorgingsruimte", className: "bg-win/15 text-win-deep border-win/40" },
  berging: { label: "Berging/zaal", className: "bg-loss-soft/15 text-loss-soft-deep border-loss-soft/40" },
};

const SETUP: MatchStep[] = [
  { text: "Wedstrijdtafel klaarzetten: 1 tafel + 2 stoelen aan de dubbele deur" },
  { text: "Stekkerdoos op de tafel leggen" },
  { text: "Matchbak halen", location: "ballenkot" },
  { text: "Elektronisch scorebord halen", location: "verzorging" },
  { text: "Wisselzone: 2 hoge banken per ploeg + 1 stoel voor de coach" },
  { text: "Net opzetten: net met groene koorden, antennes, 2 palen en 2 rode paalbeschermers", location: "ballenkot" },
  { text: "Scheidsrechterstoel halen", location: "berging" },
  { text: "2 tablets aanzetten en laten opladen op de wedstrijdtafel" },
  { text: "Scorebord in het stopcontact, 'nieuwe match – volleybal' kiezen" },
  { text: "Elektronisch fluitje op tafel leggen" },
  { text: "Matchbak veilig achter de tafel zetten" },
];

const CLEANUP: MatchStep[] = [
  { text: "Achtergebleven afval in de grote grijze container (aan de nooduitgang)", location: "verzorging" },
  { text: "Stoelen, banken en tafels terug op hun plaats" },
  { text: "Net ordelijk opbergen", location: "ballenkot" },
  { text: "Scheidsrechterstoel terug op zijn plaats rijden", location: "berging" },
  { text: "Scorebord opbergen", location: "verzorging" },
  { text: "Matchbak controleren op volledigheid en terugzetten", location: "ballenkot" },
];

/** Standaardtijdlijn — te verfijnen via de CMS. */
const SCORER: ScorerPhase[] = [
  {
    title: "Voorbereiding",
    when: "45 min voor de match",
    steps: ["Tablets aanzetten en verbinden met wifi/hotspot", "VolleySpike openen en aanmelden", "De wedstrijd downloaden"],
  },
  {
    title: "Voor de toss",
    when: "± 20 min voor de match",
    steps: ["Scheidsrechters registreren", "Spelers en licenties van beide ploegen controleren", "Kapiteins en coaches aanduiden"],
  },
  {
    title: "Na de toss",
    when: "Vlak voor de start",
    steps: ["Toss: veldkeuze en opslag ingeven", "Opstellingen van beide coaches ingeven"],
  },
  {
    title: "Tijdens de match",
    steps: ["Punten, wissels en time-outs bijhouden", "Bij twijfel: altijd eerst de scheidsrechter vragen"],
  },
  {
    title: "Na de wedstrijd",
    steps: ["Wedstrijd afsluiten in VolleySpike", "Handtekeningen van scheidsrechter en kapiteins", "Blad doorsturen en tablets terug in de matchbak"],
  },
];

const MATCHBOX = [
  "2 tablets + opladers",
  "Pompje en drukmeter",
  "Elektronisch fluitje",
  "Reservebatterij voor het fluitje",
  "Old school fluitje",
  "Rotatieformulieren",
  "Lijst met alle licentienummers",
];

/** Standaardstappen — te verfijnen via de CMS (met optionele foto per stap). */
const NET_SETUP: NetSetupStep[] = [
  { text: "Haal het net met de groene koorden, de antennes, 2 palen en 2 rode paalbeschermers uit het ballenkot", location: "ballenkot" },
  { text: "Plaats de palen in de vloerankers en zet ze stevig vast" },
  { text: "Hang het net op tussen de palen en span de groene koorden" },
  { text: "Bevestig de antennes boven het net, ter hoogte van de zijlijnen" },
  { text: "Plaats de rode paalbeschermers rond beide palen" },
  { text: "Controleer de nethoogte en de spanning van de koorden" },
];

const HOME_FAQS: MatchFaq[] = [
  { question: "Is er een EHBO-koffer?", answer: "Ja, er ligt een EHBO-koffer achter de toog in het BOW kaffee." },
];

const SCORER_FAQS: MatchFaq[] = [
  { question: "Wat als ik twijfel tijdens het markeren?", answer: "Vraag eerst de scheidsrechter voordat je verdergaat." },
];

function ProcedureFaq({ items }: { items: MatchFaq[] }) {
  const faqs = list(items).filter((item) => text(item?.question) && text(item?.answer));
  if (!faqs.length) return null;
  return (
    <section className="mt-8" aria-label="Veelgestelde vragen">
      <h2 className="text-eyebrow text-club">Wat als … ?</h2>
      <Accordion type="multiple" className="mt-4 border-t border-border">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="gap-4 font-display text-base font-semibold">{faq.question}</AccordionTrigger>
            <AccordionContent className="max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function useChecklist(key: string) {
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setDone(JSON.parse(raw) as number[]);
    } catch {
      /* ignore */
    }
  }, [key]);
  const save = (next: number[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  return {
    done,
    toggle: (i: number) => save(done.includes(i) ? done.filter((d) => d !== i) : [...done, i]),
    reset: () => save([]),
  };
}

function SpotBadge({ spot }: { spot?: HallSpot | undefined }) {
  const s = spot ? SPOTS[spot] : undefined;
  if (!s) return null;
  return (
    <span className={cn("inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.className)}>
      {s.label}
    </span>
  );
}

function Checklist({ id, title, steps }: { id: string; title: string; steps: MatchStep[] }) {
  const { done, toggle, reset } = useChecklist(`bow-check-${id}`);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {done.length}/{steps.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-club transition-all" style={{ width: `${steps.length ? (done.length / steps.length) * 100 : 0}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step, i) => {
          const checked = done.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:bg-secondary",
                  checked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-border",
                    checked && "border-club bg-club text-primary-foreground",
                  )}
                >
                  {checked ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className={cn("flex-1", checked && "line-through")}>{step.text}</span>
                <SpotBadge spot={step.location} />
              </button>
            </li>
          );
        })}
      </ul>
      {done.length > 0 ? (
        <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3.5 w-3.5" /> Opnieuw beginnen
        </button>
      ) : null}
    </div>
  );
}

function MatchProcedurePage() {
  const { siteInfo } = useSiteContent();
  const [role, setRole] = useState<"thuis" | "markeerder">("thuis");
  const setup = list(siteInfo?.matchSetupSteps).filter((s) => text(s?.text));
  const cleanup = list(siteInfo?.matchCleanupSteps).filter((s) => text(s?.text));
  const phases = list(siteInfo?.scorerPhases).filter((p) => text(p?.title));
  const notice = text(siteInfo?.matchdayNotice);
  const manual = safeUrl(siteInfo?.volleyspikeManualUrl);
  const matchbox = list(siteInfo?.matchboxContents).filter((item) => text(item));
  const netSetup = list(siteInfo?.netSetupSteps).filter((s) => text(s?.text));

  return (
    <>
      <PageHero
        eyebrow="Praktisch"
        title="Zaal & wedstrijd"
        intro="Alles wat de thuisploeg en de markeerders moeten doen, van klaarzetten tot opruimen."
      />
      <Section size="compact">
        {notice ? (
          <div className="mb-6 flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-destructive" />
            <p>{notice}</p>
          </div>
        ) : null}

        <div role="tablist" aria-label="Kies je rol" className="grid grid-cols-2 gap-2 rounded-full bg-secondary p-1.5">
          {([
            ["thuis", "Thuisploeg", Users],
            ["markeerder", "Markeerder", Tablet],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              role="tab"
              aria-selected={role === key}
              onClick={() => setRole(key)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-semibold transition-colors",
                role === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {role === "thuis" ? (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-eyebrow text-club">Waar vinden we wat?</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(SPOTS) as HallSpot[]).map((s) => (
                  <SpotBadge key={s} spot={s} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-club/40 bg-club/5 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Package aria-hidden="true" className="h-6 w-6 text-club" />
                <h3 className="font-display text-lg font-bold">Wat zit er in de matchbak?</h3>
                <SpotBadge spot="ballenkot" />
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {(matchbox.length ? matchbox : MATCHBOX).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-club" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Na gebruik veilig achter de tafel zetten — rondvliegende ballen!
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-eyebrow text-club">Wat moeten we allemaal doen?</h2>
              <div className="grid gap-6 lg:grid-cols-2">
              <Checklist id="setup" title="Voor de match: klaarzetten" steps={setup.length ? setup : SETUP} />
              <div className="space-y-4">
                <Checklist id="cleanup" title="Na de match: opruimen" steps={cleanup.length ? cleanup : CLEANUP} />
                <p className="rounded-2xl bg-ink p-5 text-center font-display text-lg font-bold text-ink-foreground">
                  Op naar het BOW kaffee! 🍻
                </p>
              </div>
              </div>
            </div>

            <div>
              <h2 className="text-eyebrow text-club">Hoe zetten we het net op?</h2>
              <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(netSetup.length ? netSetup : NET_SETUP).map((step, i) => (
                  <li key={i} className="flex flex-col rounded-2xl border border-border bg-card p-5">
                    {step.photo ? (
                      <img
                        src={step.photo.url}
                        alt={step.photo.alt}
                        loading="lazy"
                        className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"
                      />
                    ) : null}
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-club font-display text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <p className="text-sm">{step.text}</p>
                    </div>
                    {step.location ? (
                      <div className="mt-3">
                        <SpotBadge spot={step.location} />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
            <ProcedureFaq items={siteInfo?.homeTeamFaqs ?? HOME_FAQS} />
          </div>
        ) : (
          <div className="mt-8">
            <ol className="relative space-y-6 border-l-2 border-club/40 pl-6">
              {(phases.length ? phases : SCORER).map((phase, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.15rem] flex h-7 w-7 items-center justify-center rounded-full bg-club font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-bold">{phase.title}</h3>
                      {text(phase.when) ? <span className="text-sm text-club">{phase.when}</span> : null}
                    </div>
                    <ul className="mt-3 space-y-1.5 text-muted-foreground">
                      {list(phase.steps).map((s, j) => (
                        <li key={j} className="flex gap-2">
                          <Wrench aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 text-club" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            {manual ? (
              <a
                href={manual}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-club px-5 py-3 font-display text-sm font-semibold text-primary-foreground"
              >
                <BookOpen aria-hidden="true" className="h-4 w-4" /> VolleySpike-handleiding
              </a>
            ) : null}
            <ProcedureFaq items={siteInfo?.scorerFaqs ?? SCORER_FAQS} />
          </div>
        )}
      </Section>
    </>
  );
}
