import { Link } from "@tanstack/react-router";
import logo from "@/assets/bow-logo.png.asset.json";
import { CLUB_INFO, VENUES } from "@/content";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function SiteFooter() {
  const hall = VENUES[0]!;

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 object-contain" />
            <span className="font-display text-lg font-bold">Berg-Op Wijgmaal</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
            {CLUB_INFO.tagline}. Volleybal in Wijgmaal sinds {CLUB_INFO.foundingYear}, voor
            competitie én recreatie.
          </p>
          <SocialLinks socials={CLUB_INFO.socials.slice(0, 2)} className="mt-6" />
        </div>

        <nav aria-label="Footernavigatie">
          <h2 className="text-eyebrow text-club">Navigatie</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="transition-colors hover:text-club">
                Home
              </Link>
            </li>
            <li>
              <Link to="/ploegen" className="transition-colors hover:text-club">
                Ploegen
              </Link>
            </li>
            <li>
              <Link to="/club" className="transition-colors hover:text-club">
                Club
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-club">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-eyebrow text-club">Sporthal</h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-ink-foreground/70">
            <p>{hall.name}</p>
            <p>{hall.street}</p>
            <p>
              {hall.postalCode} {hall.city}
            </p>
          </address>
          <a
            href={`mailto:${CLUB_INFO.email}`}
            className="mt-4 inline-block text-sm transition-colors hover:text-club"
          >
            {CLUB_INFO.email}
          </a>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {CLUB_INFO.name}
          </p>
          <p>Wedstrijden en standen worden automatisch aangevuld.</p>
        </div>
      </div>
    </footer>
  );
}
