"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";
import {
  getMarketingHeroImageUrlChain,
  MARKETING_HERO_LOCAL_FALLBACK,
} from "@/lib/marketing-hero-image";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  MARKETING_CAROUSEL_SIZES,
  MARKETING_HERO_LCP_SIZES,
  MARKETING_HOME_SCREENSHOT_SECTION_SIZES,
  MARKETING_PHOTO_QUALITY,
  MARKETING_PHOTO_QUALITY_HERO,
  MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION,
  marketingImageShouldUnoptimize,
} from "@/lib/marketing-image-delivery";

export type MarketingHeroCarouselProps = {
  slides: readonly HomeHeroSlide[];
  onMediaUnavailable?: () => void;
  /**
   * `hero` — tall, viewport-aware frame for the homepage column (fills beside long copy).
   * `section` — screenshot strip under the hero (`max-w-3xl` in parent); 4:3 frame, sharp, lazy, no LCP priority.
   * `default` — fixed 16:10 box (e.g. “Platform in Action”).
   */
  mediaFrame?: "default" | "hero" | "section";
  /** Merged onto the outer wrapper (layout flex/min-height). */
  className?: string;
  /** Root `data-testid` (default `hero-carousel`). */
  testIdPrefix?: string;
  /** Slide images: `img-${imgTestIdPrefix}-slide-{i}` (default `hero` → `img-hero-slide-0`). */
  imgTestIdPrefix?: string;
  autoplayIntervalMs?: number;
  /**
   * When true, title and caption render as a lightweight bottom gradient strip over the image.
   * Section screenshots still force copy below the frame to keep the product proof unobstructed.
   */
  captionOverlay?: boolean;
  /** Fires when the visible slide changes (autoplay, dots, or swipe) — for conversion analytics. */
  onActiveSlideAnalytics?: (slide: HomeHeroSlide) => void;
};

/**
 * Shared homepage carousel: optimized WebP → legacy PNG → proxy → local SVG via `getMarketingHeroImageUrlChain`,
 * autoplay with hover pause, dot navigation, skeleton until first load, full fallback if all slides fail.
 * Used by the hero and by “See the Platform in Action” with different `slides` only.
 */
/** Hero column: stable 16:10, larger than the compact carousel frame; height capped for fold balance. */
const heroMediaFrameClass =
  "relative aspect-[16/10] w-full min-h-[11rem] max-h-[min(28rem,62vh)] shrink-0 overflow-hidden sm:min-h-[12rem] sm:max-h-[min(30rem,65vh)] md:min-h-[13rem] md:max-h-[min(34rem,68vh)]";

/** Below-hero screenshot strip: 4:3 for a compact product-card feel; width comes from the parent shell. */
const sectionMediaFrameClass = "relative aspect-[4/3] w-full shrink-0 overflow-hidden";

/** Section mode: subtle frame only so the screenshot stays dominant. */
const sectionFrameChromeClass =
  "rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_82%,white)] bg-[var(--page-bg)] shadow-[0_12px_32px_-24px_color-mix(in_srgb,var(--palette-heading)_40%,transparent)]";

const defaultFrameChromeClass =
  "rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] shadow-sm";

export function MarketingHeroCarousel({
  slides,
  onMediaUnavailable,
  mediaFrame = "default",
  className,
  testIdPrefix = "hero-carousel",
  imgTestIdPrefix = "hero",
  autoplayIntervalMs = 5000,
  captionOverlay = false,
  onActiveSlideAnalytics,
}: MarketingHeroCarouselProps) {
  const { t } = useMarketingI18n();
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const failedRef = useRef(failed);
  const [heroTierByIndex, setHeroTierByIndex] = useState<Record<number, number>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [extraSlidesMounted, setExtraSlidesMounted] = useState(false);
  const loadedOnceRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unavailableReported = useRef(false);
  const lastSlideFingerprintRef = useRef<string | null>(null);
  const lastAnalyticsSlideIndex = useRef<number | null>(null);

  const slideFingerprint = slides.map((s) => `${s.objectKey}\u0001${s.publicUrl}`).join("\u0002");

  useEffect(() => {
    if (lastSlideFingerprintRef.current === slideFingerprint) return;
    lastSlideFingerprintRef.current = slideFingerprint;
    loadedOnceRef.current = false;
    unavailableReported.current = false;
    queueMicrotask(() => {
      setHasLoaded(false);
      setHeroTierByIndex({});
      setFailed(new Set());
      setCurrent(0);
      lastAnalyticsSlideIndex.current = null;
    });
  }, [slideFingerprint, slides.length]);

  const currentSlide = slides[current];

  useEffect(() => {
    if (!onActiveSlideAnalytics || !currentSlide || !hasLoaded) return;
    if (lastAnalyticsSlideIndex.current === currentSlide.index) return;
    lastAnalyticsSlideIndex.current = currentSlide.index;
    onActiveSlideAnalytics(currentSlide);
  }, [currentSlide, hasLoaded, onActiveSlideAnalytics]);

  useEffect(() => {
    failedRef.current = failed;
  }, [failed]);

  const validCount = slides.length - failed.size;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const f = failedRef.current;
        for (let step = 1; step <= slides.length; step++) {
          const idx = (prev + step) % slides.length;
          if (!f.has(idx)) return idx;
        }
        return prev;
      });
    }, autoplayIntervalMs);
  }, [slides.length, autoplayIntervalMs]);

  useEffect(() => {
    if (!hasLoaded || validCount === 0) return;
    if (!extraSlidesMounted && slides.length > 1) return;
    if (!isHovered) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, startTimer, hasLoaded, validCount, slides.length, extraSlidesMounted]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setExtraSlidesMounted(false));
    const run = () => setExtraSlidesMounted(true);
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 320));
    const id = ric(run);
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id as unknown as number);
      } else {
        window.clearTimeout(id as unknown as number);
      }
    };
  }, [slideFingerprint]);

  useEffect(() => {
    if (slides.length === 0 || !failed.has(current)) return;
    for (let step = 0; step < slides.length; step++) {
      const idx = (current + step) % slides.length;
      if (!failed.has(idx)) {
        queueMicrotask(() => setCurrent(idx));
        return;
      }
    }
  }, [failed, current, slides.length]);

  useLayoutEffect(() => {
    if (slides.length === 0) return;
    if (validCount > 0) return;
    if (!unavailableReported.current) {
      unavailableReported.current = true;
      onMediaUnavailable?.();
    }
  }, [validCount, slides.length, onMediaUnavailable]);

  const handleImgError = useCallback((index: number) => {
    setFailed((prev) => new Set(prev).add(index));
  }, []);

  const handleImgLoad = useCallback(() => {
    if (!loadedOnceRef.current) {
      loadedOnceRef.current = true;
      setHasLoaded(true);
    }
  }, []);

  if (slides.length === 0) {
    return (
      <div
        className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-5 text-center text-sm leading-relaxed text-muted-foreground"
        data-testid={`${testIdPrefix}-empty`}
      >
        {t("components.homeConversionSections.platformCarouselEmpty")}
      </div>
    );
  }

  const captionTestId = testIdPrefix === "hero-carousel" ? "hero-carousel-caption" : `${testIdPrefix}-caption`;
  const dotsTestId = testIdPrefix === "hero-carousel" ? "hero-carousel-dots" : `${testIdPrefix}-dots`;
  const fallbackWrapperTestId = testIdPrefix === "hero-carousel" ? "hero-carousel-fallback" : `${testIdPrefix}-fallback`;

  const frameShell =
    mediaFrame === "hero"
      ? heroMediaFrameClass
      : mediaFrame === "section"
        ? sectionMediaFrameClass
        : "relative aspect-[16/10] w-full max-h-[min(15rem,42vh)] min-h-[9rem] sm:min-h-[9.5rem]";

  const carouselSizes =
    mediaFrame === "hero"
      ? MARKETING_HERO_LCP_SIZES
      : mediaFrame === "section"
        ? MARKETING_HOME_SCREENSHOT_SECTION_SIZES
        : MARKETING_CAROUSEL_SIZES;
  const photoQuality =
    mediaFrame === "hero"
      ? MARKETING_PHOTO_QUALITY_HERO
      : mediaFrame === "section"
        ? MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION
        : MARKETING_PHOTO_QUALITY;

  const isBelowFoldSection = mediaFrame === "section";
  const shouldOverlayCaption = captionOverlay && !isBelowFoldSection;
  const frameChromeClass = isBelowFoldSection ? sectionFrameChromeClass : defaultFrameChromeClass;
  const slideImageBgClass = isBelowFoldSection ? "bg-[var(--page-bg)]" : "bg-[var(--theme-muted-surface)]";

  if (validCount === 0) {
    return (
      <div className="relative w-full min-w-0" data-testid={fallbackWrapperTestId}>
        <div className={`${frameShell} overflow-hidden ${frameChromeClass}`}>
          <Image
            src={MARKETING_HERO_LOCAL_FALLBACK}
            alt=""
            fill
            unoptimized
            className={`pointer-events-none object-contain ${slideImageBgClass}`}
            sizes={carouselSizes}
          />
        </div>
      </div>
    );
  }

  const mediaOk = validCount > 0;

  return (
    <div
      className={`relative flex min-h-0 w-full min-w-0 flex-col ${className ?? ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={testIdPrefix}
    >
      <div
        className={`${frameShell} relative overflow-hidden ${frameChromeClass}`}
        style={{ overflowAnchor: "none" }}
        aria-busy={!hasLoaded && mediaOk}
      >
        {!hasLoaded && mediaOk ? (
          <div
            className={`absolute inset-0 bg-[var(--theme-muted-surface)] ${
              isBelowFoldSection
                ? reducedMotion
                  ? "opacity-100"
                  : "nn-skeleton-fade"
                : `bg-gradient-to-br from-[var(--theme-separator)] via-[var(--theme-muted-surface)] to-[var(--theme-input-border)] ${
                    reducedMotion ? "opacity-90" : "nn-skeleton-fade nn-skeleton-soft-pulse"
                  }`
            }`}
            aria-hidden
          />
        ) : null}
        {slides.map((slide, index) => {
          if (failed.has(index)) return null;
          if (index > 0 && !extraSlidesMounted) return null;
          const chain = getMarketingHeroImageUrlChain({
            objectKey: slide.objectKey,
            publicCdnUrl: slide.publicUrl,
          });
          const tier = Math.min(heroTierByIndex[index] ?? 0, chain.length - 1);
          const src = chain[tier];
          const active = index === current;
          const lcp = mediaFrame === "hero" && index === 0;
          const loadLazy = isBelowFoldSection ? index > 0 : !lcp && index > 0;
          const slideMotionClass = isBelowFoldSection
            ? "nn-carousel-slide-crossfade nn-carousel-slide-crossfade--depth"
            : "nn-carousel-slide-crossfade";
          return (
            <Image
              key={`${slide.objectKey}-${index}-${tier}`}
              src={src}
              alt={slide.alt}
              fill
              sizes={carouselSizes}
              quality={photoQuality}
              priority={lcp}
              loading={loadLazy ? "lazy" : undefined}
              fetchPriority={isBelowFoldSection && index === 0 ? "low" : undefined}
              unoptimized={marketingImageShouldUnoptimize(src)}
              className={`pointer-events-none object-contain ${slideImageBgClass} ${slideMotionClass} ${
                active
                  ? "z-[1] scale-100 opacity-100"
                  : isBelowFoldSection
                    ? "z-0 scale-[0.96] opacity-0"
                    : "z-0 opacity-0"
              }`}
              data-testid={`img-${imgTestIdPrefix}-slide-${index}`}
              aria-hidden={!active}
              referrerPolicy="no-referrer"
              onError={() => {
                if (tier < chain.length - 1) {
                  setHeroTierByIndex((prev) => ({ ...prev, [index]: tier + 1 }));
                  return;
                }
                handleImgError(index);
              }}
              onLoad={handleImgLoad}
            />
          );
        })}
        {hasLoaded && mediaOk && shouldOverlayCaption && currentSlide ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
            data-testid={captionTestId}
            aria-hidden
          >
            <div className="bg-gradient-to-t from-[color-mix(in_srgb,var(--palette-heading)_55%,transparent)] via-[color-mix(in_srgb,var(--palette-heading)_22%,transparent)] to-transparent px-3 pb-2.5 pt-7 sm:px-4 sm:pb-3 sm:pt-9">
              <p className="line-clamp-4 text-left text-sm font-semibold leading-snug text-[var(--text-on-accent)] text-balance break-words drop-shadow-sm sm:text-base">
                {currentSlide.title}
              </p>
              <p className="mt-0.5 line-clamp-3 text-left text-xs leading-snug text-[color-mix(in_srgb,var(--text-on-accent)_92%,transparent)] text-balance break-words sm:line-clamp-4 sm:text-sm">
                {currentSlide.caption}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      {hasLoaded && mediaOk ? (
        <>
          {extraSlidesMounted || slides.length <= 1 ? (
            <div
              className={`flex flex-wrap justify-center ${isBelowFoldSection ? "mt-2 gap-2" : "mt-3 gap-2"}`}
              data-testid={dotsTestId}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={failed.has(index)}
                  onClick={() => {
                    if (!failed.has(index)) setCurrent(index);
                  }}
                  className={`rounded-full transition-all duration-[var(--brand-motion-normal)] ease-[var(--brand-motion-ease-luxury)] ${
                    isBelowFoldSection
                      ? index === current
                        ? "h-1.5 w-5 bg-role-cta opacity-100"
                        : "h-1.5 w-1.5 bg-[var(--theme-muted-text)]/28 hover:bg-[var(--theme-muted-text)]/45"
                      : index === current
                        ? "h-2 w-6 bg-role-cta"
                        : "h-2 w-2 bg-[var(--theme-muted-text)]/35 hover:bg-[var(--theme-muted-text)]/55"
                  } ${failed.has(index) ? "cursor-not-allowed opacity-40" : ""}`}
                  aria-label={t("components.marketingHeroCarousel.goToSlide", { n: index + 1 })}
                  data-testid={
                    testIdPrefix === "hero-carousel" ? `button-carousel-dot-${index}` : `button-${testIdPrefix}-dot-${index}`
                  }
                />
              ))}
            </div>
          ) : null}
          {currentSlide && !shouldOverlayCaption ? (
            <div
              className={`px-0 text-center ${isBelowFoldSection ? "mt-2 space-y-1" : "mt-2 space-y-1"}`}
              data-testid={captionTestId}
            >
              <p
                className={
                  isBelowFoldSection
                    ? "line-clamp-1 text-balance break-words text-sm font-semibold leading-snug text-[var(--palette-heading)] sm:line-clamp-2"
                    : "nn-marketing-h4 text-balance break-words"
                }
              >
                {currentSlide.title}
              </p>
              <p
                className={
                  isBelowFoldSection
                    ? "mx-auto max-w-xl line-clamp-2 text-balance break-words text-xs leading-snug text-[var(--palette-text-muted)] sm:text-[0.8125rem]"
                    : "nn-marketing-caption text-balance break-words text-[var(--theme-body-text)]"
                }
              >
                {currentSlide.caption}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
