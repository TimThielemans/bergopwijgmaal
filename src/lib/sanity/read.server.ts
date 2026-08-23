import { sanityConfig } from "@/lib/config";

/**
 * Server-only Sanity read.
 *
 * The project denies anonymous reads, so every query runs on the server with a
 * read-only Viewer token (`SANITY_READ_TOKEN`). Shared by the public server
 * function (`fetch.functions.ts`) and by server-only code such as the parser.
 */
export async function sanityFetchServer<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const { projectId, dataset, apiVersion } = sanityConfig;
  if (!projectId || !query) return null;

  const token = process.env["SANITY_READ_TOKEN"];
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error(`Sanity query mislukt (${response.status})`);
  }
  const body = (await response.json()) as { result?: T };
  return body.result ?? null;
}
