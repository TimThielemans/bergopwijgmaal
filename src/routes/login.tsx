import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { adminConfig } from "@/lib/config";
import { useAdminAuth } from "@/lib/admin/auth";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

/**
 * Placeholder login. No credentials are verified — this only creates a local
 * session so the admin routes can be navigated. See `src/lib/admin/auth.tsx`.
 */
export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Aanmelden — VC Berg-Op Wijgmaal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { ready, isAuthenticated, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) {
      void navigate({ to: "/admin", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  return (
    <>
      <PageHero
        eyebrow="Beheer"
        title="Aanmelden"
        intro="Deze aanmelding is voorbehouden voor clubbeheerders. Contentbeheer volgt zodra het CMS gekoppeld is."
      />
      <Section size="compact">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            await signIn(email);
            setBusy(false);
            void navigate({ to: "/admin", replace: true });
          }}
          className="surface-card mx-auto w-full max-w-md p-6 sm:p-8"
        >
          <label htmlFor="admin-email" className="font-display text-sm font-semibold">
            E-mailadres
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="beheerder@bergopwijgmaal.be"
            className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-club"
          />

          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Aanmelden
          </button>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Voorlopige aanmelding zonder wachtwoordcontrole
            {adminConfig.provider ? ` (provider: ${adminConfig.provider})` : ""}. Er is nog geen
            beveiligde data achter deze pagina.
          </p>
        </form>
      </Section>
    </>
  );
}
