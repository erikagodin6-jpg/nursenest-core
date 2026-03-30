"use client";

import { useCallback, useEffect, useState } from "react";
import { BRAND_NAME, SITE_LOGO_FALLBACK_PATH } from "@/lib/branding/logo-config";
import { THEME_LOGO_MAP } from "@/lib/branding/theme-logo-map";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware header mark: `useThemeLogo` → `getHeaderBrandLogoLoadChain` (per-theme raster + fallbacks).
 * Advances through the chain on `onError` (bounded); then same-origin default raster, then SVG.
 */
export function SiteBrandLogoMark({
  className = "",
  onMarkState,
}: {
  className?: string;
  onMarkState?: (state: BrandMarkLoadState) => void;
}) {
  const { themeId, mappedSpaceKey, loadChain } = useThemeLogo();
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [extraFallbackStep, setExtraFallbackStep] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
    setExtraFallbackStep(0);
  }, [themeId, loadChain]);

  const safeIndex = Math.min(candidateIndex, Math.max(0, loadChain.length - 1));
  const chainSrc = loadChain[safeIndex] ?? loadChain[0];
  const src =
    extraFallbackStep === 0
      ? chainSrc
      : extraFallbackStep === 1
        ? THEME_LOGO_MAP.default
        : SITE_LOGO_FALLBACK_PATH;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[SiteBrandLogo]", {
        normalizedThemeId: themeId,
        mappedSpacesKey: mappedSpaceKey,
        firstAttemptUrl: loadChain[0],
        resolvedSrc: src,
        fallbackCandidateIndex: safeIndex,
        chainLength: loadChain.length,
      });
    }
  }, [themeId, mappedSpaceKey, src, safeIndex, loadChain]);

  useEffect(() => {
    onMarkState?.("loading");
  }, [onMarkState, src]);

  const handleLoad = useCallback(() => {
    onMarkState?.("ready");
  }, [onMarkState]);

  const handleError = useCallback(() => {
    if (candidateIndex < loadChain.length - 1) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    if (extraFallbackStep === 0) {
      setExtraFallbackStep(1);
      return;
    }
    if (extraFallbackStep === 1) {
      setExtraFallbackStep(2);
      return;
    }
    onMarkState?.("error");
  }, [candidateIndex, loadChain.length, extraFallbackStep, onMarkState]);

  return (
    <span className="inline-flex h-[40px] w-auto min-w-0 max-w-[min(100%,16rem)] shrink-0 items-center p-0 md:h-14 md:min-h-[56px] [&>img]:block">
      <img
        key={`${themeId}-${safeIndex}-${extraFallbackStep}-${src}`}
        src={src}
        alt={BRAND_NAME}
        width={180}
        height={56}
        loading="eager"
        decoding="sync"
        className={`h-full max-h-[42px] w-auto max-w-[min(100%,16rem)] object-contain object-left md:max-h-[56px] ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
