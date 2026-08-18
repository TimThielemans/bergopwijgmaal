import type { Sponsor } from "@/content/types";
import { list, safeUrl, text } from "@/lib/safe";

/** Compact, quiet logo wall. Wordmark fallback keeps it strong without logo files. */
export function SponsorWall({ sponsors }: { sponsors?: Sponsor[] | null }) {
  const items = list(sponsors).filter((sponsor) => text(sponsor?.name).length > 0);
  if (items.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((sponsor, index) => {
        const name = text(sponsor.name, "Sponsor");
        const url = safeUrl(sponsor.websiteUrl);
        const logoUrl = text(sponsor.logo?.url);

        const inner = logoUrl ? (
          <img
            src={logoUrl}
            alt={text(sponsor.logo?.alt, name)}
            loading="lazy"
            className="max-h-10 w-auto opacity-70 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <span className="font-display text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
            {name}
          </span>
        );

        const className =
          "group flex min-h-20 items-center justify-center rounded-xl border border-border bg-card px-4 py-4 text-center transition-colors hover:border-club/50 hover:bg-club/5";

        return (
          <li key={text(sponsor.id, `${name}-${index}`)}>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer noopener" className={className}>
                {inner}
              </a>
            ) : (
              <div className={className}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
