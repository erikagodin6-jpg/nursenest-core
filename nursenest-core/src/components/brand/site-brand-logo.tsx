"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  brandLogoMarkPresentation,
  type BrandLogoMarkVariant,
} from "@/lib/branding/logo-config";
import { getThemeLogoPathForThemeId } from "@/lib/branding/theme-logo-map";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";
import type { ThemeLogoVariant } from "@/lib/theme/theme-logo-url";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware brand mark.
 *
 * `variant`     — presentation slot sizing (header / footer / auth / learner / hero).
 * `logoVariant` — which asset: "full" (default) = leaf + wordmark; "leaf" = icon only.
 *
 * Usage rules:
 *   header / footer / auth → logoVariant="full"  (default, no prop needed)
 *   404 / error pages      → logoVariant="leaf"
 *   compact / badge / icon → logoVariant="leaf"
 */
export function SiteBrandLogoMark({
  className = DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  variant = "header",
  logoVariant = "full",
  onMarkState,
  exactSourceOnly = false,
}: {
  className?: string;
  /** Presentation slot (sizing). */
  variant?: BrandLogoMarkVariant;
  /** Content: "full" = leaf + wordmark (default); "leaf" = icon only. */
  logoVariant?: ThemeLogoVariant;
  onMarkState?: (state: BrandMarkLoadState) => void;
  /**
   * When true, only loadChain[0] (the CDN primary URL) is tried.
   * On failure the component goes straight to text fallback — no legacy
   * committed PNGs or SVGs can win. Use on the site header and 404 page.
   */
  exactSourceOnly?: boolean;
}) {
  const { slotClassName, imgClassName } = brandLogoMarkPresentation(variant);
  const { themeId, loadChain } = useThemeLogo(logoVariant);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setShowTextFallback(false);
  }, [themeId, loadChain]);

  const safeIndex = Math.min(candidateIndex, Math.max(0, loadChain.length - 1));
  const chainSrc = loadChain[safeIndex] ?? loadChain[0] ?? getThemeLogoPathForThemeId(themeId);
  const src = chainSrc;

  useEffect(() => {
    onMarkState?.("loading");
  }, [onMarkState, src]);

  const handleLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      // Classify the resolved source so it's easy to spot which asset won.
      const source =
        src.startsWith("/logos/") && src.endsWith("-brandlogo.png") ? "canonical-local-png"
        : src.startsWith("/branding/theme-logos/") ? "committed-branding-png"
        : src.startsWith("http") ? "cdn"
        : src.endsWith(".svg") ? "local-svg"
        : "unknown";
      console.debug(`[logo-debug] theme=${themeId} resolved=${src} source=${source}`);
    }
    onMarkState?.("ready");
  }, [onMarkState, src, themeId]);

  const handleError = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      const next = exactSourceOnly ? "text-fallback" : (loadChain[candidateIndex + 1] ?? "none");
      console.debug(`[logo-debug] theme=${themeId} failed=${src} trying=${next}`);
    }
    logBrandLogoLoadFailure(src, themeId, safeIndex);
    if (!exactSourceOnly && candidateIndex < loadChain.length - 1) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    setShowTextFallback(true);
    onMarkState?.("error");
  }, [exactSourceOnly, candidateIndex, loadChain.length, onMarkState, src, themeId, safeIndex]);

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
        className={imgClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
