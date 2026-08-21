import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { sanityConfig } from "@/lib/config";

/**
 * Read-only Sanity client.
 *
 * Configuration comes exclusively from `import.meta.env` (see `.env.example`).
 * When no project id is configured the client is `null` and the providers fall
 * back to the typed mock content — the site never breaks on a missing CMS.
 */
export const sanityClient: SanityClient | null = sanityConfig.enabled
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn,
      perspective: "published",
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

type ImageSource = Parameters<NonNullable<typeof builder>["image"]>[0];

/** Builds an image URL, or "" when no image / no client is available. */
export function sanityImageUrl(source: unknown, width = 1200): string {
  if (!builder || !source) return "";
  try {
    return builder
      .image(source as ImageSource)
      .width(width)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return "";
  }
}
