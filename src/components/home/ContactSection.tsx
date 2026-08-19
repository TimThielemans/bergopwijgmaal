import { Mail, Phone } from "lucide-react";
import { CLUB_INFO, getPrimaryVenue } from "@/content";
import { list, safeUrl, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function ContactSection() {
  const hall = getPrimaryVenue();
  const email = text(CLUB_INFO?.email);
  const phone = text(CLUB_INFO?.phone);
  const socials = list(CLUB_INFO?.socials).slice(0, 2);
  const hallAddress = hall
    ? `${text(hall.postalCode)} ${text(hall.city)}`.trim()
    : "";

  return (
    <Section id="contact" tone="tint" eyebrow="Contact" title="Kom eens langs" intro="Zo kan je ons bereiken">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="surface-card p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold">Sporthal</h3>
          {hall ? (
            <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">{text(hall.name, "Sporthal")}</p>
              {text(hall.address) ? <p>{text(hall.address)}</p> : null}
              {hallAddress ? <p>{hallAddress}</p> : null}
              {text(hall.notes) ? <p className="pt-2">{text(hall.notes)}</p> : null}
            </address>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Sporthalinfo volgt binnenkort.</p>
          )}

          {email || phone ? (
            <>
              <h3 className="mt-8 font-display text-xl font-bold">Rechtstreeks</h3>
              <div className="mt-3 space-y-2 text-sm">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-club-deep"
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 text-club-deep" />
                    {email}
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-club-deep"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4 text-club-deep" />
                    {phone}
                  </a>
                ) : null}
              </div>
            </>
          ) : null}

          {socials.filter((social) => safeUrl(social?.url)).length > 0 ? (
            <>
              <h3 className="mt-8 font-display text-xl font-bold">Volg ons</h3>
              <SocialLinks socials={socials} className="mt-3" />
            </>
          ) : null}
        </Reveal>

        {hall ? (
          <Reveal delay={120}>
            <MapPlaceholder venue={hall} />
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
