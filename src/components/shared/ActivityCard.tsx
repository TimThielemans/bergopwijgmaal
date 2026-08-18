import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Activity } from "@/content/types";
import { formatDateRange } from "@/lib/format";
import { isValidDate, safeUrl, text } from "@/lib/safe";
import { BrandGraphic } from "./BrandGraphic";

export function ActivityCard({ activity }: { activity: Activity }) {
  if (!activity) return null;

  const id = text(activity.id, "activity");
  const title = text(activity.title, "Activiteit");
  const location = text(activity.location);
  const excerpt = text(activity.excerpt);
  const ctaUrl = safeUrl(activity.ctaUrl);
  const hasDate = isValidDate(activity.date);

  return (
    <article className="surface-card lift-hover relative isolate flex flex-col overflow-hidden">
      <div className="relative h-32 overflow-hidden bg-navy text-club sm:h-40">
        <BrandGraphic
          variant={id.length % 2 === 0 ? "stroke" : "dots"}
          className="absolute -right-10 -top-12 h-[180%] w-auto"
        />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="text-eyebrow text-club">
            {hasDate ? formatDateRange(activity.date, activity.endDate) : "Datum volgt"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold sm:text-2xl">{title}</h3>
        {location ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        ) : null}
        {excerpt ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
        ) : null}

        <div className="mt-auto pt-5">
          {ctaUrl ? (
            <a
              href={ctaUrl}
              className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-club-deep transition-colors hover:text-ink"
            >
              {text(activity.ctaLabel, "Meer info")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              Details volgen
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
