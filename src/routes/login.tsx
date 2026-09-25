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
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
        intro="Deze aanmelding is voorbehouden voor clubbeheerders."
      />
      <Section size="compact">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try {
              const ok = await signIn(email, password);
              if (ok) void navigate({ to: "/admin", replace: true });
              else setError("E-mailadres of wachtwoord is onjuist.");
            } catch {
              setError("Aanmelden lukt momenteel niet. Probeer later opnieuw.");
            } finally {
              setBusy(false);
            }
          }}
          className="surface-card mx-auto w-full max-w-md p-6 sm:p-8"
        >
          <label htmlFor="admin-email" className="font-display text-sm font-semibold">
            E-mailadres
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-club"
          />

          <label htmlFor="admin-password" className="mt-4 block font-display text-sm font-semibold">
            Wachtwoord
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-club"
          />

          {error ? (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            {busy ? "Bezig…" : "Aanmelden"}
          </button>
        </form>
      </Section>
    </>
  );
}
