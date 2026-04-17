import type { Metadata } from "next";
import {
  crawlSurfaceErrorCode,
  logCrawlSurfaceEvent,
} from "@/lib/observability/crawl-surface-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { localeRobotsOverride } from "@/lib/i18n/language-readiness";

const METADATA_SLOW_MS = 2000;

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
  const t0 = Date.now();
  try {
    const m = await run();
    const durationMs = Date.now() - t0;
    if (m == null || typeof m !== "object") {
      logCrawlSurfaceEvent({
        routeType: "metadata.generation",
        pathname: ctx.pathname ?? "",
        durationMs,
        outcome: "fallback",
        routeGroup: ctx.routeGroup,
        fallback: true,
        errorCode: "metadata_null_or_non_object",
      });
      return FALLBACK_SITE_METADATA;
    }
    // Preserve intentional `{}` so layouts/parent metadata can apply (e.g. unresolved pathway before notFound).
    if (Object.keys(m).length === 0) {
      return m;
    }
    const normalized = { ...m, title: stripDuplicateBrandSuffix(m.title) };
    const isExamPathwayRoute = ctx.routeGroup?.startsWith("marketing.exam_hub") ?? false;
    let result: Metadata = normalized;
    // Enforce noindex for non-indexable **marketing i18n** locales only — not pathway country segments.
    if (ctx.locale && !isExamPathwayRoute) {
      const robotsOverride = localeRobotsOverride(ctx.locale);
      if (robotsOverride) {
        result = { ...normalized, robots: robotsOverride };
      }
    }
    if (durationMs >= METADATA_SLOW_MS && ctx.routeGroup) {
      logCrawlSurfaceEvent({
        routeType: "metadata.generation",
        pathname: ctx.pathname ?? "",
        durationMs,
        outcome: "ok_slow",
        routeGroup: ctx.routeGroup,
        slow: true,
      });
    }
    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const durationMs = Date.now() - t0;
    safeServerLog("metadata", "metadata_generation_failed", {
      event: "metadata_generation_failed",
      pathname: ctx.pathname,
      route_group: ctx.routeGroup,
      locale: ctx.locale,
      detail: message.slice(0, 400),
    });
    logCrawlSurfaceEvent({
      routeType: "metadata.generation",
      pathname: ctx.pathname ?? "",
      durationMs,
      outcome: "fallback",
      routeGroup: ctx.routeGroup,
      fallback: true,
      errorCode: crawlSurfaceErrorCode(e),
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
