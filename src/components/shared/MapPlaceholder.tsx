import { ExternalLink, MapPin } from "lucide-react";
import type { Venue } from "@/content/types";
import { BrandGraphic } from "./BrandGraphic";

/** Map placeholder: branded, no third-party embed, ready to swap for a real map. */
export function MapPlaceholder({ venue }: { venue: Venue }) {
  return (
    <div className="surface-card relative isolate flex min-h-64 flex-col justify-end overflow-hidden bg-navy text-ink-foreground">
      <BrandGraphic variant="grid" className="absolute inset-0 h-full w-full text-club" />
      <div className="relative z-10 p-6 sm:p-8">
        <span className="text-eyebrow text-club">Locatie</span>
        <h3 className="mt-2 font-display text-2xl font-bold">{venue.name}</h3>
        <p className="mt-1 text-sm text-ink-foreground/75">
          {venue.street}, {venue.postalCode} {venue.city}
        </p>
        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-club px-4 py-2 font-display text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
        >
          <MapPin aria-hidden="true" className="h-4 w-4" />
          Route bekijken
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
