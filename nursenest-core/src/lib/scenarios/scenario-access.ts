import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";

export type OsceScenarioRouteAccessMode = "enabled" | "dev_preview" | "production_blocked";

/**
 * Learner + marketing OSCE/scenario routes:
 * - Flag on → full shell (still noindex in metadata while product is incomplete).
 * - Flag off + production → caller should `notFound()`.
 * - Flag off + non-production → dev-only placeholder shell.
 */
export function resolveOsceScenarioRouteAccessMode(): OsceScenarioRouteAccessMode {
  if (isOsceScenariosPubliclyEnabled()) return "enabled";
  if (process.env.NODE_ENV === "production") return "production_blocked";
  return "dev_preview";
}
