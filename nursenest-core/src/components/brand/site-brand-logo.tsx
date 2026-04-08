"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  LOCAL_BRAND_MARK_PATH,
  brandLogoMarkPresentation,
  brandLogoRasterContrastClass,
  type BrandLogoMarkVariant,
} from "@/lib/branding/logo-config";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware brand mark: `useThemeLogo` → `getHeaderBrandLogoLoadChain` (local PNG → CDN → proxy → SVG/legacy).
 * Presentation: {@link brandLogoMarkPresentation}; optional `className` merges onto the slot (legacy homepage override is deprecated).
 */
export function SiteBrandLogoMark({
  className = DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  variant = "header",
  onMarkState,
}: {
  className?: string;
  /** Shared sizing contract: header (default), footer, auth, learner shell. */
  variant?: BrandLogoMarkVariant;
  onMarkState?: (state: BrandMarkLoadState) => void;
}) {
  const { slotClassName, imgClassName } = brandLogoMarkPresentation(variant);
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
        className={`${slotClassName} ${className}`.trim()}
        aria-label={BRAND_NAME}
      >
        <span className="text-lg font-semibold leading-none tracking-tight text-primary sm:text-xl lg:text-2xl">
          {BRAND_NAME}
        </span>
      </span>
    );
  }

  return (
    <span className={`${slotClassName} ${className}`.trim()}>
      <img
        key={`${themeId}-${safeIndex}-${src}`}
        src={src}
        alt={BRAND_NAME}
        loading="eager"
        decoding="async"
        className={`${imgClassName} ${brandLogoRasterContrastClass(themeId)}`.trim()}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
