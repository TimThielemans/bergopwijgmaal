import { createServerFn } from "@tanstack/react-start";
import { sanityConfig } from "@/lib/config";
import type { JsonValue } from "@/lib/sanity/json";

/**
 * Server-side Sanity read.
 *
 * The Sanity project denies anonymous (token-less) reads, so every query is
 * executed on the server with a read-only Viewer token (`SANITY_READ_TOKEN`).
 * The token never reaches the browser bundle: only this handler body reads it.
 */
export const sanityFetch = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string; params?: Record<string, unknown> }) => ({
    query: String(input?.query ?? ""),
    params: (input?.params ?? {}) as Record<string, unknown>,
  }))
  .handler(async ({ data }): Promise<JsonValue> => {
    const { projectId, dataset, apiVersion } = sanityConfig;
    if (!projectId || !data.query) return null;

    const token = process.env["SANITY_READ_TOKEN"];
    const url = new URL(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
    );
    url.searchParams.set("query", data.query);
    url.searchParams.set("perspective", "published");
    for (const [key, value] of Object.entries(data.params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error(`Sanity query mislukt (${response.status})`);
    }
    const body = (await response.json()) as { result?: JsonValue };
    return body.result ?? null;
  });
