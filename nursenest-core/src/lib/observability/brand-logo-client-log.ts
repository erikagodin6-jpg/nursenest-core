"use client";

import * as Sentry from "@sentry/nextjs";

/**
 * Logs a failed raster load for the site brand mark (before advancing to the next URL in the chain).
 */
export function logBrandLogoLoadFailure(attemptedUrl: string, themeId: string, candidateIndex: number): void {
  const payload = { attemptedUrl, themeId, candidateIndex, feature: "brand_logo" as const };
  console.error("[brand_logo] image failed to load", payload);
  Sentry.captureMessage("brand_logo_image_failed", {
    level: "warning",
    extra: payload as Record<string, unknown>,
  });
}
