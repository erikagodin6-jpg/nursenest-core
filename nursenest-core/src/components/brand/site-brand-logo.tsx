"use client";

import { useCallback, useEffect, useState } from "react";
import { BRAND_NAME, DEFAULT_BRAND_LOGO_MARK_CLASSNAME, LOCAL_BRAND_MARK_PATH } from "@/lib/branding/logo-config";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware brand mark: `useThemeLogo` (tracks `data-theme`) → `getHeaderBrandLogoLoadChain` (CDN/proxy → default-theme rasters → local SVG → legacy).
 * Uses {@link DEFAULT_BRAND_LOGO_MARK_CLASSNAME} for consistent header/footer sizing and reserved height (reduces CLS).
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
        className={`inline-flex min-h-[40px] min-w-0 max-w-[min(100%,16rem)] shrink-0 items-center md:min-h-[56px] ${className}`}
        aria-label={BRAND_NAME}
      >
        <span className="text-xl font-extrabold tracking-tight text-primary md:text-2xl">{BRAND_NAME}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex w-auto min-w-0 max-w-[min(100%,16rem)] shrink-0 items-center justify-start ${className}`}
    >
      <img
        key={`${themeId}-${safeIndex}-${src}`}
        src={src}
        alt={BRAND_NAME}
        width={180}
        height={56}
        loading="eager"
        decoding="async"
        className="h-full max-h-full w-auto min-w-0 object-contain object-left"
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
