import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { BOARD_MEMBERS, CLUB_INFO, getPrimaryVenue } from "@/content";
import { list, safeUrl, text } from "@/lib/safe";
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
  const hall = getPrimaryVenue();
  const email = text(CLUB_INFO?.email);
  const phone = text(CLUB_INFO?.phone);
  const socials = list(CLUB_INFO?.socials).filter((social) => safeUrl(social?.url));
  const contactPeople = list(BOARD_MEMBERS)
    .filter((member) => text(member?.email).length > 0)
    .slice(0, 3);

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
            {email || phone ? (
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
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Contactgegevens worden binnenkort toegevoegd.
              </p>
            )}

            {hall ? (
              <>
                <h3 className="mt-8 font-display text-xl font-bold">Sporthal</h3>
                <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">{text(hall.name, "Sporthal")}</p>
                  {text(hall.address) ? <p>{text(hall.address)}</p> : null}
                  <p>{`${text(hall.postalCode)} ${text(hall.city)}`.trim()}</p>
                </address>
              </>
            ) : null}

            {socials.length > 0 ? (
              <>
                <h3 className="mt-8 font-display text-xl font-bold">Sociale media</h3>
                <SocialLinks socials={socials} variant="list" className="mt-3" />
              </>
            ) : null}
          </Reveal>

          {hall ? (
            <Reveal delay={100}>
              <MapPlaceholder venue={hall} />
            </Reveal>
          ) : null}
        </div>
      </Section>

      {contactPeople.length > 0 ? (
        <Section tone="tint" eyebrow="Wie helpt je verder" title="Direct de juiste persoon">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactPeople.map((member, index) => {
              const memberEmail = text(member.email);
              return (
                <Reveal key={`${text(member.name)}-${index}`} delay={index * 70}>
                  <article className="surface-card h-full p-5 sm:p-6">
                    {text(member.role) ? (
                      <span className="text-eyebrow text-club-deep">{text(member.role)}</span>
                    ) : null}
                    <h3 className="mt-2 font-display text-lg font-bold">
                      {text(member.name, "Bestuurslid")}
                    </h3>
                    <a
                      href={`mailto:${memberEmail}`}
                      className="mt-2 inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-club-deep"
                    >
                      {memberEmail}
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Section>
      ) : null}
    </>
  );
}

