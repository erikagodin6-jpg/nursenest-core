"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";
import { getMarketingHeroImageUrlChain, MARKETING_HERO_LOCAL_FALLBACK } from "@/lib/marketing-hero-image";
import {
  MARKETING_PHOTO_QUALITY_BELOW_FOLD,
  MARKETING_STACK_SHOT_SIZES,
  marketingImageShouldUnoptimize,
} from "@/lib/marketing-image-delivery";

function ScreenshotFrame({
  slide,
  priority,
  testId,
}: {
  slide: HomeHeroSlide;
  priority: boolean;
  testId: string;
}) {
  const chain = useMemo(
    () =>
      getMarketingHeroImageUrlChain({
        objectKey: slide.objectKey,
        publicCdnUrl: slide.publicUrl,
      }),
    [slide.objectKey, slide.publicUrl],
  );
  const [tier, setTier] = useState(0);
  const src = chain[Math.min(tier, chain.length - 1)] ?? MARKETING_HERO_LOCAL_FALLBACK;
  const maxTierIndex = chain.length - 1;

  const unoptimized = marketingImageShouldUnoptimize(src);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]"
        style={{ aspectRatio: "16 / 10" }}
      >
        <Image
          key={`${slide.objectKey}-${tier}`}
          src={src}
          alt={slide.alt}
          fill
          sizes={MARKETING_STACK_SHOT_SIZES}
          quality={MARKETING_PHOTO_QUALITY}
          priority={priority}
          unoptimized={unoptimized}
          referrerPolicy="no-referrer"
          className="object-cover object-top bg-[var(--theme-muted-surface)]"
          data-testid={testId}
          onError={() => setTier((t) => (t < maxTierIndex ? t + 1 : t))}
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
 * Static screenshot column/grid using the same optimized WebP → PNG → proxy → local chain as the hero carousel.
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
