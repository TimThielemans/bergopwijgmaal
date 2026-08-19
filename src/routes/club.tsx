import { createFileRoute } from "@tanstack/react-router";
import { Building2, HeartHandshake, Target } from "lucide-react";
import { BOARD_MEMBERS, CLUB_INFO, getPrimaryVenue } from "@/content";
import { list, text } from "@/lib/safe";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { BrandGraphic } from "@/components/shared/BrandGraphic";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Reveal } from "@/components/shared/Reveal";

const TITLE = "De club — VC Berg-Op Wijgmaal";
const DESCRIPTION =
  "Het verhaal van VC Berg-Op Wijgmaal: familiale volleybalclub uit Wijgmaal bij Leuven, met clubwaarden, bestuur, sporthal en sportieve ambities.";

export const Route = createFileRoute("/club")({
  head: () => ({ meta: pageMeta({ title: TITLE, description: DESCRIPTION }) }),
  component: ClubPage,
});

function ClubPage() {
  const hall = getPrimaryVenue();
  const storyBlocks = list(CLUB_INFO?.storyBlocks);
  const values = list(CLUB_INFO?.values);
  const board = list(BOARD_MEMBERS);

  return (
    <>
      <PageHero
        eyebrow="De club"
        title="Meer dan vijftig jaar volleybal in Wijgmaal"
        {...(text(CLUB_INFO?.mission) ? { intro: text(CLUB_INFO.mission) } : {})}
      />

      {storyBlocks.length > 0 ? (
        <Section eyebrow="Ons verhaal" title="Hoe Berg-Op groeide">
          <div className="grid gap-5 md:grid-cols-3">
            {storyBlocks.map((block, index) => (
              <Reveal key={`${text(block?.title)}-${index}`} delay={index * 80}>
                <article className="surface-card h-full p-6 sm:p-8">
                  <span className="font-display text-sm font-bold text-club-deep">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold">
                    {text(block?.title, "Ons verhaal")}
                  </h3>
                  {text(block?.body) ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {text(block.body)}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {values.length > 0 ? (
        <Section
          tone="ink"
          eyebrow="Waarden"
          title="Waar we voor staan"
          intro="De principes die bepalen hoe we trainen, spelen en met elkaar omgaan."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={text(value?.id, `value-${index}`)} delay={index * 70}>
                <article className="relative isolate h-full overflow-hidden rounded-2xl border border-ink-foreground/12 bg-ink-foreground/5 p-6 sm:p-8">
                  <BrandGraphic
                    variant="stroke"
                    className="absolute -right-16 -top-10 h-48 w-48 text-club"
                  />
                  <h3 className="font-display text-xl font-bold">
                    {text(value?.title, "Clubwaarde")}
                  </h3>
                  {text(value?.description) ? (
                    <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
                      {text(value.description)}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}


      <Section
        tone="tint"
        eyebrow="Ambitie & sfeer"
        title="Familiaal én sportief"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="surface-card h-full p-6 sm:p-8">
              <HeartHandshake aria-hidden="true" className="h-7 w-7 text-club-deep" />
              <h3 className="mt-4 font-display text-xl font-bold">Familiale sfeer</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ploegen trainen naast elkaar, supporteren voor elkaar en zitten na de wedstrijd
                samen in de cafetaria. Nieuwe leden worden meteen opgenomen — leeftijd of niveau
                maakt niets uit.
              </p>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="surface-card h-full p-6 sm:p-8">
              <Target aria-hidden="true" className="h-7 w-7 text-club-deep" />
              <h3 className="mt-4 font-display text-xl font-bold">Sportieve ambitie</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Onze eerste ploegen willen bovenin meedraaien en doorstromen naar een hoger
                niveau. Daarvoor investeren we in coaching, een degelijke trainingsopbouw en een
                brede kern.
              </p>
            </article>
          </Reveal>
        </div>
      </Section>

      {board.length > 0 ? (
        <Section eyebrow="Bestuur" title="Het bestuur">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((member, index) => {
              const name = text(member?.name, "Bestuurslid");
              const initials = name
                .split(" ")
                .map((part) => part[0] ?? "")
                .slice(0, 2)
                .join("");
              const email = text(member?.email);
              return (
                <Reveal key={`${name}-${index}`} delay={index * 60}>
                  <article className="surface-card flex h-full items-center gap-4 p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-club/15 font-display text-sm font-bold text-club-deep">
                      {initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base font-bold">{name}</span>
                      {text(member?.role) ? (
                        <span className="block truncate text-sm text-muted-foreground">
                          {text(member.role)}
                        </span>
                      ) : null}
                      {email ? (
                        <a
                          href={`mailto:${email}`}
                          className="mt-1 block truncate text-xs text-club-deep hover:underline"
                        >
                          {email}
                        </a>
                      ) : null}
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Section>
      ) : null}

      {hall ? (
        <Section tone="tint" eyebrow="Sporthal" title="Waar we spelen">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <Reveal className="surface-card p-6 sm:p-8">
              <Building2 aria-hidden="true" className="h-7 w-7 text-club-deep" />
              <h3 className="mt-4 font-display text-xl font-bold">{text(hall.name, "Sporthal")}</h3>
              <address className="mt-3 space-y-1 text-sm not-italic text-muted-foreground">
                {text(hall.address) ? <p>{text(hall.address)}</p> : null}
                <p>{`${text(hall.postalCode)} ${text(hall.city)}`.trim()}</p>
              </address>
              {text(hall.notes) ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {text(hall.notes)}
                </p>
              ) : null}
            </Reveal>
            <Reveal delay={100}>
              <MapPlaceholder venue={hall} />
            </Reveal>
          </div>
        </Section>
      ) : null}

    </>
  );
}
