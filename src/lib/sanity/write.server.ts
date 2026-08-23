import { sanityConfig } from "@/lib/config";

/**
 * Server-only Sanity write.
 *
 * Uses `createOrReplace` on fixed document ids, so a parser run is idempotent and
 * Sanity keeps the revision history (rollback via Studio). The Editor token is
 * read here only and never reaches the browser bundle.
 */
export async function sanityCreateOrReplace(
  documents: Array<Record<string, unknown> & { _id: string; _type: string }>,
): Promise<void> {
  const { projectId, dataset, apiVersion } = sanityConfig;
  const token = process.env["SANITY_WRITE_TOKEN"];
  if (!projectId) throw new Error("Geen Sanity-project geconfigureerd");
  if (!token) throw new Error("SANITY_WRITE_TOKEN ontbreekt — schrijven naar Sanity is niet mogelijk");

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mutations: documents.map((doc) => ({ createOrReplace: doc })),
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sanity-mutatie mislukt (${response.status}): ${body}`);
  }
}
