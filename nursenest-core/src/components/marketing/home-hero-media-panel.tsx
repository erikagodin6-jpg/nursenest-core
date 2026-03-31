"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";
import { getMarketingHeroImageUrlChain, MARKETING_HERO_LOCAL_FALLBACK } from "@/lib/marketing-hero-image";

function HeroImage({
  slide,
  priority,
  testId,
  className,
  imgClassName,
}: {
  slide: HomeHeroSlide;
  priority: boolean;
  testId: string;
  className?: string;
  imgClassName: string;
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
    setTier((t) => (t < chain.length - 1 ? t + 1 : t));
  }, [chain.length]);

  return (
    <div className={className}>
      <img
        src={src}
        alt={slide.alt}
        width={1200}
        height={750}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "low"}
        referrerPolicy="no-referrer"
        className={imgClassName}
        data-testid={testId}
        onError={onError}
      />
    </div>
  );
}

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
      <div
        className="flex items-center gap-2 border-b border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--theme-muted-surface)_88%,var(--theme-page-bg))] px-3 py-2.5 sm:px-4"
        aria-hidden
      >
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md bg-[var(--theme-card-bg)]/90 px-3 py-1 text-center text-[10px] font-medium text-[var(--theme-muted-text)] shadow-inner sm:text-[11px]">
          NurseNest — exam prep
        </span>
      </div>
      {children}
    </div>
  );
}

/**
 * Hero-only layout: one large primary screenshot (fills the column) + optional two-up row with captions.
 * Uses `object-cover` so the frame stays full — reads as product marketing, not a broken carousel.
 */
export function HomeHeroMediaPanel({
  slides,
  primaryIndex = 0,
  secondaryIndices = [1, 2],
}: {
  slides: readonly HomeHeroSlide[];
  primaryIndex?: number;
  secondaryIndices?: number[];
}) {
  const primary = slides[primaryIndex];
  const secondaries = secondaryIndices.map((i) => slides[i]).filter(Boolean) as HomeHeroSlide[];

  if (!primary) {
    return (
      <div
        className="rounded-2xl border border-dashed border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-10 text-center text-sm text-[var(--theme-muted-text)]"
        data-testid="hero-media-panel-empty"
      >
        Product preview unavailable.
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5" data-testid="hero-media-panel">
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-1 -z-10 rounded-[1.35rem] bg-gradient-to-br from-primary/[0.12] via-transparent to-secondary/[0.15] blur-2xl md:-inset-3"
          aria-hidden
        />
        <BrowserChrome>
          <div className="relative w-full overflow-hidden bg-[var(--theme-muted-surface)]">
            <div className="aspect-[16/10] w-full min-h-[14rem] sm:min-h-[17rem] md:min-h-[18rem] lg:min-h-[20rem]">
              <HeroImage
                slide={primary}
                priority
                testId="img-hero-media-primary"
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </BrowserChrome>
        <div className="mt-3 px-1">
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{primary.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--theme-body-text)]">{primary.caption}</p>
        </div>
      </div>

      {secondaries.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {secondaries.map((slide, i) => (
            <div
              key={`${slide.objectKey}-sec-${i}`}
              className="overflow-hidden rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-card)]"
            >
              <div className="aspect-[16/10] w-full min-h-[7.5rem] overflow-hidden bg-[var(--theme-muted-surface)] sm:min-h-[8rem]">
                <HeroImage
                  slide={slide}
                  priority={false}
                  testId={`img-hero-media-secondary-${i}`}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover object-top"
                />
              </div>
              <div className="border-t border-[var(--theme-card-border)]/80 px-3 py-2.5">
                <p className="text-xs font-semibold text-[var(--theme-heading-text)]">{slide.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--theme-body-text)]">{slide.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
