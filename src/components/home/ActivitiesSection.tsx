import type { Activity } from "@/content/types";
import { list, text } from "@/lib/safe";
import { Section } from "@/components/layout/Section";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { Reveal } from "@/components/shared/Reveal";

export function ActivitiesSection({ activities }: { activities?: Activity[] | null }) {
  const items = list(activities).filter((activity) => text(activity?.title).length > 0);
  if (items.length === 0) return null;

  return (
    <Section
      id="activiteiten"
      eyebrow="Clubleven"
      title="Activiteiten"
      intro="Naast de wedstrijden maakt Berg-Op vooral clubleven: weekends, acties en tornooien waar iedereen welkom is."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((activity, index) => (
          <Reveal key={text(activity.id, `${activity.title}-${index}`)} delay={index * 80}>
            <ActivityCard activity={activity} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
