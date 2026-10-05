import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled VolleyDataParser refresh.
 *
 * Public route (no site auth), so it is protected by a shared secret in the
 * `x-cron-secret` header. Without a valid secret it returns 401 and no data.
 * Point a nightly cron job at:
 *   POST https://project--<project-id>.lovable.app/api/public/refresh-volley-data
 */

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function handleRefresh(request: Request): Promise<Response> {
  const secret = process.env["CRON_SECRET"];
  if (!secret) {
    return new Response("Not configured", { status: 503 });
  }
  // Accept both our custom header and Vercel Cron's `Authorization: Bearer <CRON_SECRET>`.
  const auth = request.headers.get("authorization") ?? "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const provided = request.headers.get("x-cron-secret") ?? bearer;
  if (!provided || !timingSafeEqual(provided, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { runVolleyDataRefresh } = await import("@/lib/parser/refresh.server");
    const result = await runVolleyDataRefresh();
    return Response.json({
      ok: result.ok,
      generatedAt: result.generatedAt,
      matchRows: result.matches.rowCount,
      rankingRows: result.rankings.rowCount,
      errorCount: result.errors.length,
    });
  } catch (error) {
    console.error("[volleydata] cron refresh mislukt:", error);
    return new Response("Refresh failed", { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/refresh-volley-data")({
  server: {
    handlers: {
      // Vercel Cron always sends GET.
      GET: async ({ request }) => handleRefresh(request),
      POST: async ({ request }) => handleRefresh(request),
    },
  },
});
