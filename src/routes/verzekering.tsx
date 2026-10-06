import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bus,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  HeartPulse,
  Mail,
  Megaphone,
  PartyPopper,
  Phone,
  Receipt,
  Send,
  ShieldCheck,
  Trophy,
  Volleyball,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/lib/site-content";
import { safeUrl, text } from "@/lib/safe";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TITLE = "Verzekering — BOW";
const DESCRIPTION =
  "Ongeval bij BOW? Zo ben je verzekerd via Volley Vlaanderen/Ethias en dit zijn de stappen voor je aangifte.";

/** Fallbacks zolang er niets in de CMS staat. */
const VV_URL = "https://www.volleyvlaanderen.be";
const VV_INSURANCE_URL = "https://www.volleyvlaanderen.be/verzekering";

export const Route = createFileRoute("/verzekering")({
  head: () => ({ meta: pageMeta({ title: TITLE, description: DESCRIPTION }) }),
  component: InsurancePage,
});

type Item = { icon: LucideIcon; title: string; body: string };

const COVERED: Item[] = [
  { icon: Volleyball, title: "Trainingen", body: "Alle officiële trainingen van de club." },
  {
    icon: Trophy,
    title: "Wedstrijden",
    body: "Competitie-, beker- en vriendschappelijke wedstrijden binnen de federatie.",
  },
  { icon: PartyPopper, title: "Clubactiviteiten", body: "Officiële activiteiten georganiseerd door de club." },
  { icon: Bus, title: "Onderweg", body: "Het normale traject van en naar de training, wedstrijd of activiteit." },
];

const REMEMBER: Item[] = [
  {
    icon: CalendarClock,
    title: "Binnen 5 kalenderdagen",
    body: "Dien de aangifte zo snel mogelijk in bij de secretaris (Guy), binnen de 5 kalenderdagen.",
  },
  { icon: FileText, title: "Bewaar documenten", body: "Houd medische attesten, voorschriften en verslagen bij." },
  {
    icon: Receipt,
    title: "Bewaar facturen",
    body: "Bewaar alle bewijsstukken en betalingsbewijzen van medische kosten.",
  },
  {
    icon: Phone,
    title: "Meld het aan de club",
    body: "Breng je trainer, je ploegverantwoordelijke en de clubsecretaris op de hoogte.",
  },
];

const STEPS: Item[] = [
  {
    icon: HeartPulse,
    title: "Zorg voor medische hulp",
    body: "Laat de blessure zo nodig meteen behandelen door een arts of spoeddienst, laat het aangifteformulier (Ethias) ook meteen invullen door de behandelende arts.",
  },
  {
    icon: Megaphone,
    title: "Meld het ongeval",
    body: "Breng de club secretaris (Guy) op de hoogte van het ongeval en uiteraard ook je trainer.",
  },
  {
    icon: FileText,
    title: "Vul de aangifte in",
    body: "Vul het formulier volledig in  (het medische gedeelte in luik C door de arts).",
  },
  {
    icon: Send,
    title: "Bezorg alle documenten",
    body: "Bezorg de aangifte en medische documenten zo snel mogelijk aan Guy via secretariaat@bergopwijgmaal.be.",
  },
  {
    icon: CheckCircle2,
    title: "Opvolging",
    body: "Na verwerking ontvang je verdere informatie over de afhandeling van je dossier.",
  },
];

const FAQ = [
  {
    q: "Welke 'luiken' van het aangifteformulier moet ik zelf invullen?.",
    a: "Luik A moet je zelf invullen, Luik B is niet echt relevant, Luik C laat je door de behandelende arts invullen. Indien de arts een ander attest bezorgd, dien je dit mee te sturen naar de clubsecretaris.",
  },
  {
    q: "Moet ik de gegevens van betrokken speler delen als het gaat over een typische volleybalblessure?.",
    a: "Neen. Stel dat je bijvoorbeeld op iemand zijn/haar voet landt, is het niet nodig om zijn/haar contactgegevens te vermelden. Dit is een typische volleybalblessure en komt niet door het toedoen van iemand anders. We zijn geen voetballers he ;)",
  },
  {
    q: "Moet ik de aangifte onmiddellijk indienen?",
    a: "Ja. Doe het zo snel mogelijk, stuur de aangifte ten laatste 5 kalenderdagen na het ongeval naar onze clubsecretaris zodat hij het tijdig bij Ethias online kan indienen.",
  },
  {
    q: "Wat als het niet op 'het wedstrijdblad' staat vermeld?.",
    a: "Geen probleem, sinds we markeren met een tablet is dit niet meer nodig en hoef je het niet op het wedstrijdblad vermelden wanneer het tijdens een match gebeurd.",
  },
  {
    q: "Moet ik facturen bewaren?",
    a: "Ja. Bewaar alle medische attesten, facturen, betalingsbewijzen en andere relevante documenten.",
  },
  {
    q: "Wie zorgt er voor de registratie van het ongevul bij Ethias?",
    a: "Dit kan enkel de clubsecretaris doen. Daarom bezorg je hem zo snel mogelijk het ingevulde aangifteformulier via mail of op papier. Eens de registratie is voltooid, verloopt de verdere communicatie rechtstreeks tussen de speler/speelsters en Ethias.",
  },
  {
    q: "Ben ik verzekerd tijdens trainingen?",
    a: "Ja, tijdens officiële trainingen, wedstrijden en clubactiviteiten, en op het normale traject ernaartoe.",
  },
  {
    q: "Waar vind ik de volledige polisvoorwaarden?",
    a: "Via Volley Vlaanderen. Gebruik de link bij 'Nuttige links' hieronder.",
  },
];

function InsurancePage() {
  const { clubInfo, siteInfo } = useSiteContent();
  const formUrl = safeUrl(siteInfo?.insuranceFormUrl);
  const declarationUrl = safeUrl(siteInfo?.insuranceDeclarationUrl) ?? VV_INSURANCE_URL;
  const policyUrl = safeUrl(siteInfo?.insurancePolicyUrl) ?? VV_INSURANCE_URL;
  const email = text(siteInfo?.insuranceEmail, text(clubInfo?.email));

  const links = [
    ...(formUrl
      ? [
          {
            icon: Download,
            title: "Aangifteformulier (PDF)",
            body: "Blanco formulier met medisch attest om mee te nemen naar de arts.",
            label: "Download formulier",
            href: formUrl,
          },
        ]
      : []),
    {
      icon: Volleyball,
      title: "Volley Vlaanderen",
      body: "Meer over de federatie en de verzekering.",
      label: "Bezoek website",
      href: VV_URL,
    },
    {
      icon: ShieldCheck,
      title: "Polisvoorwaarden",
      body: "Raadpleeg de actuele verzekeringsvoorwaarden.",
      label: "Bekijk voorwaarden",
      href: policyUrl,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Verzekering"
        title="Verzekering"
        intro="Als aangesloten lid van BOW ben je via Volley Vlaanderen verzekerd tijdens trainingen, wedstrijden en officiële clubactiviteiten."
      >
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-club px-4 py-2 text-sm font-bold text-ink">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" /> Verzekerd via Volley Vlaanderen
          </span>
          {formUrl ? (
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 px-4 py-2 text-sm font-bold transition-colors hover:border-club hover:text-club"
            >
              <Download aria-hidden="true" className="h-4 w-4" /> Aangifteformulier
            </a>
          ) : null}
        </div>
      </PageHero>

      <Section eyebrow="Dekking" title="Wanneer ben je verzekerd?">
        <CardGrid items={COVERED} />
        <p className="mt-5 text-xs text-muted-foreground">
          De exacte waarborgen, tussenkomsten en voorwaarden worden bepaald door de polis van Volley Vlaanderen bij
          Ethias. Zie verder voor de link.
        </p>
      </Section>

      <Section eyebrow="Snel overzicht" title="Belangrijk om te onthouden" tone="tint">
        <CardGrid items={REMEMBER} compact />
      </Section>

      <Section eyebrow="Stappenplan" title="Wat te doen bij een ongeval?">
        <ol className="relative space-y-4 border-l-2 border-club/40 pl-6 sm:pl-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
              <li className="relative">
                <span className="absolute -left-[2.35rem] top-4 flex h-8 w-8 items-center justify-center rounded-full bg-club font-display text-sm font-bold text-ink sm:-left-[2.85rem]">
                  {i + 1}
                </span>
                <div className="surface-card flex items-start gap-4 p-5">
                  <step.icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-club-deep" />
                  <div>
                    <h3 className="font-display text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section eyebrow="FAQ" title="Veelgestelde vragen" tone="tint">
        <Accordion type="single" collapsible className="surface-card px-5 sm:px-6">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className={i === FAQ.length - 1 ? "border-b-0" : ""}>
              <AccordionTrigger className="text-left font-display font-bold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section eyebrow="Downloads & links" title="Nuttige links">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link, i) => (
            <Reveal key={link.title} delay={i * 60}>
              <article className="surface-card flex h-full flex-col p-5">
                <link.icon aria-hidden="true" className="h-6 w-6 text-club-deep" />
                <h3 className="mt-3 font-display text-base font-bold">{link.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{link.body}</p>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold text-club-deep hover:underline"
                >
                  {link.label} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Contact" title="Nog vragen?" tone="tint">
        <Reveal className="surface-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Vragen over een schadegeval of niet zeker welke stappen je moet volgen? Neem contact op met Guy
            (clubsecretaris). Het is ook aan Guy dat je het aangifteformulier snel moet bezorgen na het ongeval.
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2 font-display text-sm font-bold text-ink-foreground transition-colors hover:bg-club hover:text-ink"
            >
              <Mail aria-hidden="true" className="h-4 w-4" /> secretariaat@bergopwijgmaal.be
            </a>
          ) : null}
        </Reveal>
      </Section>
    </>
  );
}

function CardGrid({ items, compact = false }: { items: Item[]; compact?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 60}>
          <article className={`surface-card h-full ${compact ? "p-5" : "p-6"}`}>
            <item.icon aria-hidden="true" className="h-7 w-7 text-club-deep" />
            <h3 className="mt-3 font-display text-base font-bold">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
