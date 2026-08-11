import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { BOARD_MEMBERS, CLUB_INFO, VENUES } from "@/content";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Reveal } from "@/components/shared/Reveal";
import { SocialLinks } from "@/components/shared/SocialLinks";

const TITLE = "Contact — Berg-Op Wijgmaal";
const DESCRIPTION = "Contacteer BOW, sporthallen, e-mail, telefoon en sociale media";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta({ title: TITLE, description: DESCRIPTION }) }),
  component: ContactPage,
});

function ContactPage() {
  const hall = VENUES[0]!;
  const contactPeople = BOARD_MEMBERS.filter((member) => member.email).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Wij zijn bereikbaar."
        intro="Vragen, suggesties, ... stuur ons een berichtje."
      />

      <Section eyebrow="Bereik ons" title="Contactgegevens">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="surface-card p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold">Algemeen</h3>
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

            <h3 className="mt-8 font-display text-xl font-bold">Sporthal</h3>
            <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">{hall.name}</p>
              <p>{hall.street}</p>
              <p>
                {hall.postalCode} {hall.city}
              </p>
            </address>

            <h3 className="mt-8 font-display text-xl font-bold">Sociale media</h3>
            <SocialLinks socials={CLUB_INFO.socials} variant="list" className="mt-3" />
          </Reveal>

          <Reveal delay={100}>
            <MapPlaceholder venue={hall} />
          </Reveal>
        </div>
      </Section>

      <Section tone="tint" eyebrow="Wie helpt je verder" title="Direct de juiste persoon">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactPeople.map((member, index) => (
            <Reveal key={member.name} delay={index * 70}>
              <article className="surface-card h-full p-5 sm:p-6">
                <span className="text-eyebrow text-club-deep">{member.role}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{member.name}</h3>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-2 inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-club-deep"
                >
                  {member.email}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
