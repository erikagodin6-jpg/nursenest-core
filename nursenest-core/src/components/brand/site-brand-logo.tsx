"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  HEADER_BRAND_LOGO_IMG_CLASSNAME,
  LOCAL_BRAND_MARK_PATH,
} from "@/lib/branding/logo-config";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware brand mark: `useThemeLogo` (tracks `data-theme`) → `getHeaderBrandLogoLoadChain` (CDN/proxy → default-theme rasters → local SVG → legacy).
 * Uses {@link DEFAULT_BRAND_LOGO_MARK_CLASSNAME} on the wrapper; raster uses {@link HEADER_BRAND_LOGO_IMG_CLASSNAME} on the `<img>`.
 */
export function SiteBrandLogoMark({
  className = DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  onMarkState,
}: {
  className?: string;
  onMarkState?: (state: BrandMarkLoadState) => void;
}) {
  const { themeId, mappedSpaceKey, loadChain } = useThemeLogo();
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setShowTextFallback(false);
  }, [themeId, loadChain]);

  const safeIndex = Math.min(candidateIndex, Math.max(0, loadChain.length - 1));
  const chainSrc = loadChain[safeIndex] ?? loadChain[0] ?? LOCAL_BRAND_MARK_PATH;
  const src = chainSrc;

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
    logBrandLogoLoadFailure(src, themeId, safeIndex);
    if (candidateIndex < loadChain.length - 1) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    setShowTextFallback(true);
    onMarkState?.("error");
  }, [candidateIndex, loadChain.length, onMarkState, src, themeId, safeIndex]);

  if (showTextFallback) {
    return (
      <span
        className={`inline-flex min-h-[3.25rem] flex-none items-center overflow-visible sm:min-h-16 md:min-h-[5.25rem] lg:min-h-24 xl:min-h-[6.75rem] ${className}`}
        aria-label={BRAND_NAME}
      >
        <span className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">{BRAND_NAME}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex w-auto max-w-none flex-none items-center justify-start overflow-visible ${className}`}>
      <img
        key={`${themeId}-${safeIndex}-${src}`}
        src={src}
        alt={BRAND_NAME}
        loading="eager"
        decoding="async"
        className={HEADER_BRAND_LOGO_IMG_CLASSNAME}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
