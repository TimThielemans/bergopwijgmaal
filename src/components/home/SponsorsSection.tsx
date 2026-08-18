import type { Sponsor } from "@/content/types";
import { list, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SponsorWall } from "@/components/shared/SponsorWall";

export function SponsorsSection({ sponsors }: { sponsors?: Sponsor[] | null }) {
  const items = list(sponsors).filter((sponsor) => text(sponsor?.name).length > 0);
  if (items.length === 0) return null;

  return (
    <Section id="sponsors" size="compact" eyebrow="Sponsors" title="Zij steunen Berg-Op">
      <Reveal>
        <SponsorWall sponsors={items} />
      </Reveal>
    </Section>
  );
}
