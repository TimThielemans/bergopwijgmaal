import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Euro, ShieldCheck } from "lucide-react";
import type { SiteInfo } from "@/content/types";
import { list, num, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Lidgeld-sectie — volledig CMS-gestuurd (Site-informatie singleton).
 * Bedragen zijn getallen in de CMS; de opmaak gebeurt hier, zodat een nieuw
 * seizoen enkel een CMS-aanpassing vraagt.
 */

const FEE_LABELS = [
  { key: "membershipFeeRecreational", label: "Recreatie" },
  { key: "membershipFeeProvincialCompetition", label: "Competitie provinciaal" },
  { key: "membershipFeeNationalCompetition", label: "Competitie nationaal" },
] as const;

function euro(value: number): string {
  return `€ ${new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 2 }).format(value)}`;
}

export function MembershipSection({ siteInfo }: { siteInfo: SiteInfo | undefined }) {
  const fees = FEE_LABELS.map(({ key, label }) => ({ label, amount: num(siteInfo?.[key], 0) })).filter(
    (fee) => fee.amount > 0,
  );
  const info = list(siteInfo?.membershipInfo) as PortableTextBlock[];
  if (fees.length === 0 && info.length === 0) return null;

  const season = text(siteInfo?.currentSeason);

  return (
    <Section
      eyebrow="Lidgeld"
      title="Lidgeld"
      {...(season ? { intro: `Voor het seizoen ${season} gelden de volgende lidgelden.` } : {})}
    >
      {fees.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fees.map((fee, index) => (
            <Reveal key={fee.label} delay={index * 70}>
              <article className="surface-card flex h-full items-center justify-between gap-4 p-5 sm:p-6">
                <span className="min-w-0">
                  <Euro aria-hidden="true" className="h-6 w-6 text-club-deep" />
                  <span className="mt-3 block font-display text-base font-bold">{fee.label}</span>
                </span>
                <span className="shrink-0 font-display text-2xl font-bold text-club-deep">{euro(fee.amount)}</span>
              </article>
            </Reveal>
          ))}
        </div>
      ) : null}
      {info.length > 0 ? (
        <Reveal delay={120}>
          <div className="surface-card mt-5 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8 [&_a]:text-club-deep [&_a]:underline [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
            <PortableText value={info} />
          </div>
        </Reveal>
      ) : null}
      <Reveal delay={160}>
        <div className="surface-card mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-club-deep" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Verzekerd via Volley Vlaanderen.</strong> Ongeval
              tijdens training of wedstrijd? Lees wat je moet doen.
            </p>
          </div>
          <Link
            to="/verzekering"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-display text-sm font-bold text-club-deep hover:underline"
          >
            Meer over de verzekering <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
