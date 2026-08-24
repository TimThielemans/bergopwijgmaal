import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { adminConfig } from "@/lib/config";
import { useAdminAuth } from "@/lib/admin/auth";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";

/**
 * Admin layout: keeps auth concerns in one place. The gate is client-side and
 * intentionally lightweight — there is no protected data behind it yet.
 */
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Beheer — BOW" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { ready, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      void navigate({ to: "/login", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  if (!adminConfig.enabled) {
    return (
      <>
        <PageHero eyebrow="Beheer" title="Beheer is uitgeschakeld" />
        <Section size="compact">
          <EmptyState
            message="Beheer is niet geactiveerd"
            hint="Zet VITE_ADMIN_ENABLED op true om de beheeromgeving te tonen."
          />
        </Section>
      </>
    );
  }

  if (!ready || !isAuthenticated) {
    return (
      <Section size="compact">
        <EmptyState message="Even controleren of je aangemeld bent…" />
      </Section>
    );
  }

  return <Outlet />;
}
