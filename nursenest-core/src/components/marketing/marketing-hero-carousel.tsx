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
  MARKETING_PHOTO_QUALITY,
  marketingImageShouldUnoptimize,
} from "@/lib/marketing-image-delivery";

export type MarketingHeroCarouselProps = {
  slides: readonly HomeHeroSlide[];
  onMediaUnavailable?: () => void;
  /**
   * `hero` — tall, viewport-aware frame for the homepage column (fills beside long copy).
   * `default` — fixed 16:10 box (e.g. “Platform in Action”).
   */
  mediaFrame?: "default" | "hero";
  /** Merged onto the outer wrapper (layout flex/min-height). */
  className?: string;
  /** Root `data-testid` (default `hero-carousel`). */
  testIdPrefix?: string;
  /** Slide images: `img-${imgTestIdPrefix}-slide-{i}` (default `hero` → `img-hero-slide-0`). */
  imgTestIdPrefix?: string;
  autoplayIntervalMs?: number;
  /**
   * When true, title and caption render as a lightweight bottom gradient strip over the image
   * (homepage platform preview). When false, copy sits below the frame (legacy layout).
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
/** Hero column: bounded height (parent also caps with md:max-h-*); avoid flex-1 stretch filling the grid row. */
const heroMediaFrameClass =
  "relative aspect-[16/10] w-full max-h-[min(18rem,48vh)] min-h-[10rem] shrink-0 overflow-hidden sm:max-h-[min(19rem,50vh)] md:aspect-auto md:max-h-[min(20rem,56vh)] md:min-h-[12rem]";

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
    setExtraSlidesMounted(false);
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
      : "relative aspect-[16/10] w-full max-h-[min(15rem,42vh)] min-h-[9rem] sm:min-h-[9.5rem]";

  const carouselSizes = mediaFrame === "hero" ? MARKETING_HERO_LCP_SIZES : MARKETING_CAROUSEL_SIZES;

  if (validCount === 0) {
    return (
      <div className="relative w-full min-w-0" data-testid={fallbackWrapperTestId}>
        <div
          className={`${frameShell} overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]`}
        >
          <Image
            src={MARKETING_HERO_LOCAL_FALLBACK}
            alt=""
            fill
            unoptimized
            className="pointer-events-none object-contain bg-[var(--theme-muted-surface)]"
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
        className={`${frameShell} relative overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]`}
        style={{ overflowAnchor: "none" }}
        aria-busy={!hasLoaded && mediaOk}
      >
        {!hasLoaded && mediaOk ? (
          <div
            className={`absolute inset-0 bg-gradient-to-br from-[var(--theme-separator)] via-[var(--theme-muted-surface)] to-[var(--theme-input-border)] ${
              reducedMotion ? "opacity-90" : "nn-skeleton-fade animate-pulse"
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
          return (
            <Image
              key={`${slide.objectKey}-${index}-${tier}`}
              src={src}
              alt={slide.alt}
              fill
              sizes={carouselSizes}
              quality={MARKETING_PHOTO_QUALITY}
              priority={lcp}
              unoptimized={marketingImageShouldUnoptimize(src)}
              className={`pointer-events-none object-contain bg-[var(--theme-muted-surface)] nn-carousel-slide-crossfade will-change-[opacity] ${
                active ? "opacity-100" : "opacity-0"
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
        {hasLoaded && mediaOk && captionOverlay && currentSlide ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
            data-testid={captionTestId}
            aria-hidden
          >
            <div className="bg-gradient-to-t from-[color-mix(in_srgb,var(--palette-heading)_88%,transparent)] via-[color-mix(in_srgb,var(--palette-heading)_38%,transparent)] to-transparent px-3 pb-2.5 pt-8 sm:px-4 sm:pb-3 sm:pt-10">
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
          {currentSlide && !captionOverlay ? (
            <div className="mt-3 space-y-1 px-2 text-center sm:px-1" data-testid={captionTestId}>
              <p className="nn-marketing-h4 text-balance break-words">{currentSlide.title}</p>
              <p className="nn-marketing-caption text-balance break-words text-[var(--theme-body-text)]">{currentSlide.caption}</p>
            </div>
          ) : null}
          {extraSlidesMounted || slides.length <= 1 ? (
            <div className="mt-3 flex flex-wrap justify-center gap-2" data-testid={dotsTestId}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={failed.has(index)}
                  onClick={() => {
                    if (!failed.has(index)) setCurrent(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current ? "w-6 bg-role-cta" : "w-2 bg-[var(--theme-muted-text)]/35 hover:bg-[var(--theme-muted-text)]/55"
                  } ${failed.has(index) ? "cursor-not-allowed opacity-40" : ""}`}
                  aria-label={t("components.marketingHeroCarousel.goToSlide", { n: index + 1 })}
                  data-testid={
                    testIdPrefix === "hero-carousel" ? `button-carousel-dot-${index}` : `button-${testIdPrefix}-dot-${index}`
                  }
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
