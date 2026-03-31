"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";
import { getMarketingHeroImageUrlChain, MARKETING_HERO_LOCAL_FALLBACK } from "@/lib/marketing-hero-image";

function ScreenshotFrame({
  slide,
  priority,
  testId,
}: {
  slide: HomeHeroSlide;
  priority: boolean;
  testId: string;
}) {
  const chain = getMarketingHeroImageUrlChain({
    objectKey: slide.objectKey,
    publicCdnUrl: slide.publicUrl,
  });
  const [tier, setTier] = useState(0);
  const src = chain[Math.min(tier, chain.length - 1)] ?? MARKETING_HERO_LOCAL_FALLBACK;

  useEffect(() => {
    setTier(0);
  }, [slide.objectKey, slide.publicUrl]);

  const onError = useCallback(() => {
    if (tier < chain.length - 1) setTier((t) => t + 1);
  }, [chain.length, tier]);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]"
        style={{ aspectRatio: "16 / 10" }}
      >
        <img
          src={src}
          alt={slide.alt}
          width={1200}
          height={750}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "low"}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top bg-[var(--theme-muted-surface)]"
          data-testid={testId}
          onError={onError}
        />
      </div>
      <div className="space-y-0.5 px-0.5">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{slide.title}</p>
        <p className="text-xs leading-relaxed text-[var(--theme-body-text)]">{slide.caption}</p>
      </div>
    </div>
  );
}

/**
 * Static screenshot column/grid using the same CDN → proxy → local chain as the legacy carousel.
 * Prefer over autoplay carousel when a stacked layout should fill the hero.
 */
export function MarketingScreenshotStack({
  slides,
  /** 0-based indices into `slides` (e.g. [0,1,2] for screenshot1–3). */
  pickIndices,
  className,
  testIdPrefix = "screenshot-stack",
}: {
  slides: readonly HomeHeroSlide[];
  pickIndices: number[];
  className?: string;
  testIdPrefix?: string;
}) {
  const picks = pickIndices.map((i) => slides[i]).filter(Boolean) as HomeHeroSlide[];
  if (picks.length === 0) {
    return (
      <div
        className="rounded-xl border border-dashed border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-6 text-center text-sm text-[var(--theme-muted-text)]"
        data-testid={`${testIdPrefix}-empty`}
      >
        Screenshots unavailable.
      </div>
    );
  }

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-4 md:gap-5 ${className ?? ""}`}
      data-testid={testIdPrefix}
    >
      {picks.map((slide, i) => (
        <ScreenshotFrame
          key={`${slide.objectKey}-${i}`}
          slide={slide}
          priority={i === 0}
          testId={`img-${testIdPrefix}-${i}`}
        />
      ))}
    </div>
  );
}
