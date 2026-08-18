import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/bow-logo.png.asset.json";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/ploegen", label: "Ploegen" },
  { to: "/club", label: "Club" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo.url} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold leading-tight sm:text-base">
              Berg-Op Wijgmaal
            </span>
            <span className="block truncate text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
              Volleybalclub
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hoofdnavigatie">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {adminConfig.enabled ? (
            <Link
              to="/admin"
              title="Beheer (clubbeheerders)"
              className="ml-2 inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              <Lock aria-hidden="true" className="h-3 w-3" />
              Beheer
            </Link>
          ) : null}
        </nav>


        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          className="grid h-11 w-11 place-items-center rounded-full border border-border md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4" aria-label="Mobiele navigatie">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="flex min-h-12 items-center rounded-xl px-4 font-display text-base font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
