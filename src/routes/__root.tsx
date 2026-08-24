import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminAuthProvider } from "@/lib/admin/auth";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { siteContentQuery } from "@/lib/providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-club-deep">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Deze pagina bestaat niet</h2>
        <p className="mt-2 text-sm text-muted-foreground">De pagina die je zoekt is verplaatst of bestaat niet meer.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight">Deze pagina kon niet laden</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Er ging iets mis aan onze kant. Probeer opnieuw of ga terug naar de startpagina.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-display text-sm font-semibold text-ink-foreground"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 font-display text-sm font-semibold"
          >
            Naar home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Shared editorial content (club info, venues, activities, sponsors, board)
  // is prefetched once so header, footer and sections render on the server.
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery()),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BOW — Volleybal in Leuven" },
      {
        name: "description",
        content: "Familiale volleybalclub uit Wijgmaal (Leuven) met competitieve en recreatieve ploegen.",
      },
      { property: "og:site_name", content: "BOW" },
      { property: "og:locale", content: "nl_BE" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl-BE">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Enables scroll-reveal only when JS runs; SSR HTML stays fully visible.
  useEffect(() => {
    document.documentElement.setAttribute("data-js", "ready");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-ink-foreground"
        >
          Naar hoofdinhoud
        </a>
        <SiteHeader />
        <main id="main">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
