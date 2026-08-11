import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/content/types";
import { BrandTile } from "@/components/shared/BrandGraphic";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      to="/ploegen/$slug"
      params={{ slug: team.slug }}
      className="surface-card lift-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {team.photo ? (
          <img
            src={team.photo.url}
            alt={team.photo.alt}
            width={team.photo.width}
            height={team.photo.height}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <BrandTile label={team.shortName} caption={team.level} className="h-full w-full" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-eyebrow text-ink-foreground backdrop-blur">
          {team.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold sm:text-2xl">{team.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{team.shortDescription}</p>
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
