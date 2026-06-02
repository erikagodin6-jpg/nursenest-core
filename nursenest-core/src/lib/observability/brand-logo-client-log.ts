"use client";

import { captureClientMessageIfEnabled } from "@/lib/observability/sentry-if-enabled";

/**
 * Logs a failed raster load for the site brand mark (before advancing to the next URL in the chain).
 */
const MAX_URL_LOG_LEN = 160;

export function logBrandLogoLoadFailure(attemptedUrl: string, themeId: string, candidateIndex: number): void {
  const urlForLog =
    attemptedUrl.length > MAX_URL_LOG_LEN ? `${attemptedUrl.slice(0, MAX_URL_LOG_LEN)}…` : attemptedUrl;
  const payload = {
    attemptedUrl: urlForLog,
    themeId,
    candidateIndex,
    feature: "brand_logo" as const,
  };
  console.error("[brand_logo] image failed to load", payload);
  captureClientMessageIfEnabled("brand_logo_image_failed", {
    level: "warning",
    tags: { feature: "brand_logo", theme_id: themeId.slice(0, 48) },
    fingerprint: ["brand_logo_image_failed", themeId],
    extra: payload as Record<string, unknown>,
  });
}
