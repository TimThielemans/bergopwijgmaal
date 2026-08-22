/**
 * Single source of runtime configuration.
 *
 * Everything comes from `import.meta.env` (see `.env.example`). No CMS value is
 * hardcoded anywhere else in the app. The site must keep working with no `.env`
 * at all: mock content and generated JSON are the default data sources, so the
 * Sanity settings are optional until a Sanity-backed provider is selected.
 */

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  const raw = str(value).toLowerCase();
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return fallback;
}

const env = (import.meta.env ?? {}) as Record<string, string | undefined>;

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  studioUrl: string;
  useCdn: boolean;
  /** True when the minimum required Sanity variables are present. */
  enabled: boolean;
}

export interface AdminConfig {
  enabled: boolean;
  /** Future auth provider id, e.g. "sanity" or "oauth". Empty = placeholder flow. */
  provider: string;
  redirectUrl: string;
}

export const sanityConfig: SanityConfig = (() => {
  const projectId = str(env["VITE_SANITY_PROJECT_ID"], "utlbxtd6");

  const dataset = str(env["VITE_SANITY_DATASET"], "production");

  const apiVersion = str(env["VITE_SANITY_API_VERSION"], "2024-01-01");

  return {
    projectId,
    dataset,
    apiVersion,

    studioUrl: str(env["VITE_SANITY_STUDIO_URL"], "https://bergop-wijgmaal.sanity.studio"),

    useCdn: bool(env["VITE_SANITY_USE_CDN"], true),

    enabled: true,
  };
})();

export const adminConfig: AdminConfig = {
  enabled: bool(env["VITE_ADMIN_ENABLED"], true),
  provider: str(env["VITE_ADMIN_PROVIDER"]),
  redirectUrl: str(env["VITE_ADMIN_REDIRECT_URL"], "/admin"),
};

/** Which content source the providers should use. */
export const contentSource: "mock" | "sanity" = sanityConfig.enabled ? "sanity" : "mock";

/**
 * Validates configuration for the *selected* source only.
 * Returns the list of missing variables; logs a single clear message when the
 * app is configured to use Sanity but critical values are absent.
 */
export function validateConfig(): string[] {
  const missing: string[] = [];

  if (contentSource === "sanity") {
    if (!sanityConfig.projectId) missing.push("VITE_SANITY_PROJECT_ID");
    if (!sanityConfig.dataset) missing.push("VITE_SANITY_DATASET");
    if (!sanityConfig.apiVersion) missing.push("VITE_SANITY_API_VERSION");
  }

  if (missing.length > 0) {
    console.error(
      `[config] Ontbrekende omgevingsvariabelen: ${missing.join(", ")}. ` +
        "Vul ze in .env aan (zie .env.example). De site valt terug op mockdata.",
    );
  }

  return missing;
}

validateConfig();
