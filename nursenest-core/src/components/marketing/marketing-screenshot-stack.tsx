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

type FitMode = "cover" | "contain";

/**
 * Reliable below-fold product still: same URL chain as hero (PNG first → WebP → proxy → local SVG).
 * Use for any homepage section that previously relied on `MARKETING_SCREENSHOT_SOURCES` WebP bundles (often 403).
 */
export function MarketingChainScreenshot({
  objectKey,
  publicUrl,
  alt,
  sizes = MARKETING_STACK_SHOT_SIZES,
  className = "",
  imgClassName = "",
  fit = "contain",
  aspectRatio = "16 / 10",
  rounded = "rounded-2xl",
}: {
  objectKey: string;
  publicUrl: string;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  fit?: FitMode;
  aspectRatio?: string;
  rounded?: string;
}) {
  const chain = useMemo(
    () =>
      getMarketingHeroImageUrlChain({
        objectKey,
        publicCdnUrl: publicUrl,
      }),
    [objectKey, publicUrl],
  );
  const [tier, setTier] = useState(0);
  const maxTierIndex = Math.max(0, chain.length - 1);
  const src = chain[Math.min(tier, maxTierIndex)] ?? MARKETING_HERO_LOCAL_FALLBACK;
  const unoptimized = marketingImageShouldUnoptimize(src);
  const arNorm = aspectRatio.replace(/\s/g, "");
  const fillW = arNorm === "4/3" ? 1200 : 1600;
  const fillH = arNorm === "4/3" ? 900 : 1000;

  const objectClass =
    fit === "contain" ?
      "object-contain object-center"
    : "object-cover object-top";

  return (
    <div
      className={`relative w-full overflow-hidden border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] shadow-[var(--shadow-elevated)] ${rounded} ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        key={`${objectKey}-${tier}-${src}`}
        src={src}
        alt={alt}
        width={fillW}
        height={fillH}
        fill
        sizes={sizes}
        quality={MARKETING_PHOTO_QUALITY_BELOW_FOLD}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        unoptimized={unoptimized}
        referrerPolicy="no-referrer"
        className={`${objectClass} ${imgClassName}`.trim()}
        onError={() => setTier((t) => (t < maxTierIndex ? t + 1 : t))}
      />
    </div>
  );
}

function ScreenshotFrame({ slide }: { slide: HomeHeroSlide }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <MarketingChainScreenshot
        objectKey={slide.objectKey}
        publicUrl={slide.publicUrl}
        alt={slide.alt}
        sizes={MARKETING_STACK_SHOT_SIZES}
        fit="contain"
        rounded="rounded-2xl"
      />
      <div className="space-y-1 px-0.5">
        {slide.label ? (
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {slide.label}
          </p>
        ) : null}
        <p className="nn-marketing-h4 leading-snug">{slide.title}</p>
        <p className="nn-marketing-body-sm mt-1">{slide.caption}</p>
      </div>
    </div>
  );
}

/**
 * Static screenshot column/grid using the same PNG-first chain as the hero carousel.
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
        className="nn-marketing-body-sm rounded-xl border border-dashed border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-6 text-center text-[var(--theme-muted-text)]"
        data-testid={`${testIdPrefix}-empty`}
      >
        Screenshots unavailable.
      </div>
    );
  }

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-6 md:gap-7 ${className ?? ""}`}
      data-testid={testIdPrefix}
    >
      {picks.map((slide, i) => (
        <div key={`${slide.objectKey}-${i}`} data-testid={`${testIdPrefix}-frame-${i}`}>
          <ScreenshotFrame slide={slide} />
        </div>
      ))}
    </div>
  );
}
