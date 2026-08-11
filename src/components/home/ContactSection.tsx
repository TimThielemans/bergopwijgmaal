import { Mail, Phone } from "lucide-react";
import { CLUB_INFO, VENUES } from "@/content";
import { Section } from "@/components/layout/Section";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function ContactSection() {
  const hall = VENUES[0]!;

  return (
    <Section
      id="contact"
      tone="tint"
      eyebrow="Contact"
      title="Kom eens langs"
      intro="Twee gratis proeftrainingen, daarna beslis je zelf. Laat gewoon iets weten en we zetten je bij de juiste ploeg."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="surface-card p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold">Sporthal</h3>
          <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">{hall.name}</p>
            <p>{hall.street}</p>
            <p>
              {hall.postalCode} {hall.city}
            </p>
            {hall.notes ? <p className="pt-2">{hall.notes}</p> : null}
          </address>

          <h3 className="mt-8 font-display text-xl font-bold">Rechtstreeks</h3>
          <div className="mt-3 space-y-2 text-sm">
            <a
              href={`mailto:${CLUB_INFO.email}`}
              className="flex min-h-11 items-center gap-3 transition-colors hover:text-club-deep"
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-club-deep" />
              {CLUB_INFO.email}
            </a>
            <a
              href={`tel:${CLUB_INFO.phone.replace(/\s/g, "")}`}
              className="flex min-h-11 items-center gap-3 transition-colors hover:text-club-deep"
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-club-deep" />
              {CLUB_INFO.phone}
            </a>
          </div>

          <h3 className="mt-8 font-display text-xl font-bold">Volg ons</h3>
          <SocialLinks socials={CLUB_INFO.socials.slice(0, 2)} className="mt-3" />
        </Reveal>

        <Reveal delay={120}>
          <MapPlaceholder venue={hall} />
        </Reveal>
      </div>
    </Section>
  );
}
