import type { Sponsor } from "@/content/types";

/** Compact, quiet logo wall. Wordmark fallback keeps it strong without logo files. */
export function SponsorWall({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {sponsors.map((sponsor) => (
        <li key={sponsor.id}>
          <a
            href={sponsor.websiteUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex min-h-20 items-center justify-center rounded-xl border border-border bg-card px-4 py-4 text-center transition-colors hover:border-club/50 hover:bg-club/5"
          >
            {sponsor.logo ? (
              <img
                src={sponsor.logo.url}
                alt={sponsor.logo.alt}
                loading="lazy"
                className="max-h-10 w-auto opacity-70 transition-opacity group-hover:opacity-100"
              />
            ) : (
              <span className="font-display text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                {sponsor.name}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
