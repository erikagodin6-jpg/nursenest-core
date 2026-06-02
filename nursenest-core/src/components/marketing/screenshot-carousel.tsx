"use client";

/**
 * ScreenshotCarousel — registry-driven wrapper around MarketingHeroCarousel.
 *
 * Accepts screenshot IDs from the central registry and renders them using
 * the existing CDN image chain, error-fallback, autoplay, and dot navigation
 * that MarketingHeroCarousel already provides.
 *
 * Usage:
 *   import { ScreenshotCarousel } from "@/components/marketing/screenshot-carousel";
 *   import { SCREENSHOT_GROUPS } from "@/lib/marketing/screenshot-registry";
 *
 *   // Named group (recommended):
 *   <ScreenshotCarousel group="practice" captionOverlay />
 *
 *   // Explicit IDs (for custom orderings):
 *   <ScreenshotCarousel ids={SCREENSHOT_GROUPS.pricingPreview} captionOverlay={false} />
 *
 *   // Single feature type:
 *   <ScreenshotCarousel feature="cat-exam" mediaFrame="hero" />
 *
 * Do NOT call MarketingHeroCarousel directly with hardcoded CDN URLs.
 * Always go through this component or ScreenshotGrid for registered screenshots.
 */

import { useMemo } from "react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import type { MarketingHeroCarouselProps } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_GROUPS,
  toSlideIndices,
  type ScreenshotId,
  type ScreenshotFeature,
} from "@/lib/marketing/screenshot-registry";

// Re-export for convenience
export type { ScreenshotId, ScreenshotFeature };

type ScreenshotCarouselBaseProps = Omit<
  MarketingHeroCarouselProps,
  "slides"
> & {
  /** Optional testId prefix forwarded to MarketingHeroCarousel (default: "screenshot-carousel") */
  testIdPrefix?: string;
  /** Optional img testId prefix (default: "screenshot") */
  imgTestIdPrefix?: string;
};

type ByIds = ScreenshotCarouselBaseProps & {
  /** Ordered list of 1-based screenshot IDs from the registry */
  ids: readonly ScreenshotId[];
  group?: never;
  feature?: never;
};

type ByGroup = ScreenshotCarouselBaseProps & {
  /** Named group from SCREENSHOT_GROUPS */
  group: keyof typeof SCREENSHOT_GROUPS;
  ids?: never;
  feature?: never;
};

type ByFeature = ScreenshotCarouselBaseProps & {
  /** Render all screenshots tagged with this feature (ordered by registry position) */
  feature: ScreenshotFeature;
  ids?: never;
  group?: never;
};

export type ScreenshotCarouselProps = ByIds | ByGroup | ByFeature;

/**
 * Resolves props → ordered array of 1-based screenshot IDs.
 */
function resolveIds(props: ScreenshotCarouselProps): readonly ScreenshotId[] {
  if ("ids" in props && props.ids) return props.ids;
  if ("group" in props && props.group) return SCREENSHOT_GROUPS[props.group];
  if ("feature" in props && props.feature) {
    const feat = props.feature;
    return SCREENSHOT_REGISTRY.filter((s) => s.feature === feat).map((s) => s.id);
  }
  return [];
}

/**
 * Registry-driven screenshot carousel.
 *
 * Slide copy (title, caption) comes from the marketing i18n system
 * (`components.homeHeroCarousel.slide{NN}.title/caption`), exactly as the
 * existing hero and platform-preview carousels do. Ensure i18n keys are
 * populated for every screenshot ID you use.
 */
export function ScreenshotCarousel({
  testIdPrefix = "screenshot-carousel",
  imgTestIdPrefix = "screenshot",
  mediaFrame = "default",
  captionOverlay = true,
  autoplayIntervalMs = 5000,
  className,
  onMediaUnavailable,
  ...rest
}: ScreenshotCarouselProps) {
  const { t, locale } = useMarketingI18n();

  const ids = resolveIds(rest as ScreenshotCarouselProps);
  const slideIndices = useMemo(() => toSlideIndices(ids), [ids]);

  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, slideIndices),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, locale, slideIndices.join(",")],
  );

  return (
    <MarketingHeroCarousel
      slides={slides}
      mediaFrame={mediaFrame}
      captionOverlay={captionOverlay}
      autoplayIntervalMs={autoplayIntervalMs}
      className={className}
      testIdPrefix={testIdPrefix}
      imgTestIdPrefix={imgTestIdPrefix}
      onMediaUnavailable={onMediaUnavailable}
    />
  );
}

/**
 * Convenience: renders a single screenshot (no carousel chrome, no dots, no autoplay).
 * Wraps a 1-item ScreenshotCarousel — dots and autoplay are disabled automatically.
 */
export function ScreenshotSingle({
  id,
  captionOverlay = false,
  mediaFrame = "default",
  testIdPrefix = "screenshot-single",
  ...rest
}: Omit<ScreenshotCarouselBaseProps, "ids" | "group" | "feature"> & {
  id: ScreenshotId;
}) {
  return (
    <ScreenshotCarousel
      ids={[id]}
      captionOverlay={captionOverlay}
      mediaFrame={mediaFrame}
      testIdPrefix={testIdPrefix}
      autoplayIntervalMs={0}
      {...rest}
    />
  );
}
