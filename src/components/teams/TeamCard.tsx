import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/content/types";
import { text } from "@/lib/safe";
import { BrandTile } from "@/components/shared/BrandGraphic";
import { SafeImage } from "@/components/shared/SafeImage";

export function TeamCard({ team }: { team: Team }) {
  const name = text(team?.name, "Ploeg");
  const level = text(team?.level);
  const shortName = text(team?.shortName, name.slice(0, 3).toUpperCase());
  const description = text(team?.shortDescription);
  const slug = text(team?.slug);

  if (!slug) return null;

  return (
    <Link
      to="/ploegen/$slug"
      params={{ slug }}
      className="surface-card lift-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          image={team?.photo}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          fallback={
            <BrandTile label={shortName} caption={level || undefined} className="h-full w-full" />
          }
        />
        {level ? (
          <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-eyebrow text-ink-foreground backdrop-blur">
            {level}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold sm:text-2xl">{name}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-display text-sm font-semibold text-club-deep">
          Naar de ploeg
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
