import type { Sponsor } from "@/content/types";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SponsorWall } from "@/components/shared/SponsorWall";

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <Section id="sponsors" size="compact" eyebrow="Sponsors" title="Zij steunen Berg-Op">
      <Reveal>
        <SponsorWall sponsors={sponsors} />
      </Reveal>
    </Section>
  );
}
