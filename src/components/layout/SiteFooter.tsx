import { Link } from "@tanstack/react-router";
import logo from "@/assets/bow-logo.png.asset.json";
import { CLUB_INFO, getPrimaryVenue } from "@/content";
import { list, text } from "@/lib/safe";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function SiteFooter() {
  const hall = getPrimaryVenue();
  const email = text(CLUB_INFO?.email);
  const socials = list(CLUB_INFO?.socials).slice(0, 2);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 object-contain" />
            <span className="font-display text-lg font-bold">Berg-Op Wijgmaal</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
            {text(CLUB_INFO?.tagline, "Familiale volleybalclub met sportieve ambitie")}. Volleybal
            in Wijgmaal, voor competitie én recreatie.
          </p>
          <SocialLinks socials={socials} className="mt-6" />
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
          {hall ? (
            <address className="mt-4 space-y-1 text-sm not-italic text-ink-foreground/70">
              <p>{text(hall.name, "Sporthal")}</p>
              {text(hall.street) ? <p>{text(hall.street)}</p> : null}
              <p>{`${text(hall.postalCode)} ${text(hall.city)}`.trim()}</p>
            </address>
          ) : (
            <p className="mt-4 text-sm text-ink-foreground/70">Adres volgt binnenkort.</p>
          )}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-block text-sm transition-colors hover:text-club"
            >
              {email}
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {text(CLUB_INFO?.name, "VC Berg-Op Wijgmaal")}
          </p>
          <p>Wedstrijden en standen worden automatisch aangevuld.</p>
        </div>
      </div>
    </footer>
  );
}
