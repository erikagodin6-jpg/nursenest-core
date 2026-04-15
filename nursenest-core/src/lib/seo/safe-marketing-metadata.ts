import type { Metadata } from "next";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { localeRobotsOverride } from "@/lib/i18n/language-readiness";

export const FALLBACK_SITE_METADATA: Metadata = {
  title: "NurseNest | Nursing exam prep",
  description: "Adaptive practice, lessons, and exam-focused prep for nursing candidates.",
};

const BRAND_SUFFIX = "| NurseNest";

function stripDuplicateBrandSuffix(title: Metadata["title"]): Metadata["title"] {
  if (typeof title !== "string") return title;
  const trimmed = title.trim();
  if (!trimmed.endsWith(BRAND_SUFFIX)) return title;
  return trimmed.slice(0, -BRAND_SUFFIX.length).trimEnd();
}

export type SafeMetadataContext = {
  pathname?: string;
  /** e.g. marketing.exam_hub, marketing.blog, app.learner */
  routeGroup?: string;
  locale?: string;
};

/**
 * Global guard: `generateMetadata` must never throw. Logs `metadata_generation_failed` on errors.
 *
 * Automatically injects `robots: { index: false, follow: true }` for locales that are
 * not yet fully indexed (tier=partial or tier=incomplete). This prevents thin-content
 * or mostly-English pages from being indexed before a language is fully translated.
 * Full-tier (active) locales are unaffected.
 *
 * **Exam pathway routes** (`routeGroup` `marketing.exam_hub*`) pass the **country URL segment**
 * (`us` | `canada`), not a marketing i18n locale — those must **not** use this override or every hub would be noindexed.
 */
export async function safeGenerateMetadata(
  run: () => Promise<Metadata>,
  ctx: SafeMetadataContext = {},
): Promise<Metadata> {
  try {
    const m = await run();
    if (m == null || typeof m !== "object") {
      return FALLBACK_SITE_METADATA;
    }
    // Preserve intentional `{}` so layouts/parent metadata can apply (e.g. unresolved pathway before notFound).
    if (Object.keys(m).length === 0) {
      return m;
    }
    const normalized = { ...m, title: stripDuplicateBrandSuffix(m.title) };
    const isExamPathwayRoute = ctx.routeGroup?.startsWith("marketing.exam_hub") ?? false;
    // Enforce noindex for non-indexable **marketing i18n** locales only — not pathway country segments.
    if (ctx.locale && !isExamPathwayRoute) {
      const robotsOverride = localeRobotsOverride(ctx.locale);
      if (robotsOverride) {
        return { ...normalized, robots: robotsOverride };
      }
    }
    return normalized;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("metadata", "metadata_generation_failed", {
      event: "metadata_generation_failed",
      pathname: ctx.pathname,
      route_group: ctx.routeGroup,
      locale: ctx.locale,
      detail: message.slice(0, 400),
    });
    return FALLBACK_SITE_METADATA;
  }
}

/** @deprecated Prefer {@link safeGenerateMetadata} with routeGroup `marketing.exam_hub`. */
export async function safeExamHubMetadata(
  run: () => Promise<Metadata>,
  ctx: { pathname?: string; locale?: string },
): Promise<Metadata> {
  return safeGenerateMetadata(run, { ...ctx, routeGroup: "marketing.exam_hub" });
}
