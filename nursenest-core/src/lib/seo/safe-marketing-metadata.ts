import type { Metadata } from "next";
import {
  crawlSurfaceErrorCode,
  logCrawlSurfaceEvent,
} from "@/lib/observability/crawl-surface-observability";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { localeRobotsOverride } from "@/lib/i18n/language-readiness";
import {
  classifySeoHttpValidationFailureReason,
  SeoHttpValidationStrictError,
  seoHttpValidationEnvironmentName,
  isSeoHttpValidationStrict,
  validateMetadataAlternatesHttp,
} from "@/lib/seo/seo-http-emit-validation";

const METADATA_SLOW_MS = 2000;

/** Marketing copy / strict metadata failures must surface in development (not replaced by generic site fallback). */
export function isStrictPublicMarketingMetadataGenerationError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const msg = e.message;
  return (
    msg.includes("[marketing-i18n]") ||
    msg.includes("[marketing-metadata-strict]") ||
    msg.includes("[marketing] forbidden")
  );
}

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
  fallbackMetadata?: Metadata;
};

function fallbackMetadataForContext(ctx: SafeMetadataContext): Metadata {
  return ctx.fallbackMetadata ?? FALLBACK_SITE_METADATA;
}

function logNonfatalMetadataValidationFailure(
  ctx: SafeMetadataContext,
  reason: string,
  durationMs: number,
): void {
  const pathname = ctx.pathname ?? "/";
  safeServerLog("seo", "metadata_validation_failed_nonfatal", {
    pathname,
    route_group: ctx.routeGroup,
    strict_requested: isSeoHttpValidationStrict(),
    environmentName: seoHttpValidationEnvironmentName(),
    reason,
    fallback_used: true,
  });
  logCrawlSurfaceEvent({
    routeType: "metadata.generation",
    pathname,
    durationMs,
    outcome: "fallback",
    routeGroup: ctx.routeGroup,
    fallback: true,
    errorCode: `metadata_validation_failed_nonfatal:${reason}`.slice(0, 120),
  });
}

/**
 * Global guard: `generateMetadata` must not throw for ordinary failures. Logs `metadata_generation_failed` on errors.
 * Page metadata HTTP validation is observe-only in request rendering: validation failures are logged and converted
 * into fallback metadata instead of taking down the route.
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
  const fallbackMetadata = fallbackMetadataForContext(ctx);
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
      return fallbackMetadata;
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
    try {
      const validation = await validateMetadataAlternatesHttp(result, {
        pathname: ctx.pathname ?? "/",
        routeGroup: ctx.routeGroup,
        sourceFile: "src/lib/seo/safe-marketing-metadata.ts",
        generator: "safeGenerateMetadata",
      });
      if (validation.failures.length > 0) {
        logNonfatalMetadataValidationFailure(ctx, validation.reason ?? "unknown", Date.now() - t0);
        return fallbackMetadata;
      }
    } catch (ve) {
      if (ve instanceof SeoHttpValidationStrictError) {
        logNonfatalMetadataValidationFailure(ctx, classifySeoHttpValidationFailureReason(ve.failures), Date.now() - t0);
        return fallbackMetadata;
      }
      safeServerLog("seo", "metadata_http_validate_unexpected", {
        detail: ve instanceof Error ? ve.message.slice(0, 200) : String(ve).slice(0, 200),
      });
    }
    return result;
  } catch (e) {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev && isStrictPublicMarketingMetadataGenerationError(e)) {
      throw e;
    }
    if (e instanceof SeoHttpValidationStrictError) {
      logNonfatalMetadataValidationFailure(ctx, classifySeoHttpValidationFailureReason(e.failures), Date.now() - t0);
      return fallbackMetadata;
    }
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
    return fallbackMetadata;
  }
}

/** @deprecated Prefer {@link safeGenerateMetadata} with routeGroup `marketing.exam_hub`. */
export async function safeExamHubMetadata(
  run: () => Promise<Metadata>,
  ctx: { pathname?: string; locale?: string },
): Promise<Metadata> {
  return safeGenerateMetadata(run, { ...ctx, routeGroup: "marketing.exam_hub" });
}
