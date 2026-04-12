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
 *
 * `exactSourceOnly` — bypass the fallback chain and use a single direct CDN URL.
 *   Pass on the site header and 404 page to prevent legacy assets from winning.
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
   * When true, the component renders from `singleSrc` — one direct CDN/proxy URL
   * computed from the theme logo map. No chain iteration, no committed PNG fallback,
   * no SVG substitution, no cross-theme fallback. On failure goes straight to text.
   * Use on the site header (full) and 404 page (leaf).
   */
  exactSourceOnly?: boolean;
}) {
  const { slotClassName, imgClassName } = brandLogoMarkPresentation(variant);
  const { themeId, loadChain, singleSrc } = useThemeLogo(logoVariant);

  // ── Exact-source path (header / 404): no chain, no candidateIndex ──────────
  const [exactFailed, setExactFailed] = useState(false);

  useEffect(() => {
    setExactFailed(false);
  }, [singleSrc]);

  const handleExactLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[logo-debug] exact theme=${themeId} resolved=${singleSrc}`);
    }
    onMarkState?.("ready");
  }, [onMarkState, singleSrc, themeId]);

  const handleExactError = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[logo-debug] exact theme=${themeId} failed=${singleSrc} → text-fallback`);
    }
    logBrandLogoLoadFailure(singleSrc, themeId, 0);
    setExactFailed(true);
    onMarkState?.("error");
  }, [onMarkState, singleSrc, themeId]);

  if (exactSourceOnly) {
    if (exactFailed) {
      return (
        <span className={`${slotClassName} ${className}`.trim()} aria-label={BRAND_NAME}>
          <span className="text-lg font-semibold leading-none tracking-tight text-primary sm:text-xl lg:text-2xl">
            {BRAND_NAME}
          </span>
        </span>
      );
    }
    return (
      <span className={`${slotClassName} ${className}`.trim()}>
        <img
          key={`${themeId}-exact-${singleSrc}`}
          src={singleSrc}
          alt={BRAND_NAME}
          loading="eager"
          decoding="async"
          className={imgClassName}
          onLoad={handleExactLoad}
          onError={handleExactError}
        />
      </span>
    );
  }

  // ── Chain path (footer / auth / learner / other surfaces) ──────────────────
  return <SiteBrandLogoMarkChain
    className={className}
    slotClassName={slotClassName}
    imgClassName={imgClassName}
    themeId={themeId}
    loadChain={loadChain}
    onMarkState={onMarkState}
  />;
}

/** Internal chain-walking renderer used for non-header surfaces only. */
function SiteBrandLogoMarkChain({
  className,
  slotClassName,
  imgClassName,
  themeId,
  loadChain,
  onMarkState,
}: {
  className: string;
  slotClassName: string;
  imgClassName: string;
  themeId: string;
  loadChain: string[];
  onMarkState?: (state: BrandMarkLoadState) => void;
}) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setShowTextFallback(false);
  }, [themeId, loadChain]);

  const safeIndex = Math.min(candidateIndex, Math.max(0, loadChain.length - 1));
  const src = loadChain[safeIndex] ?? loadChain[0] ?? getThemeLogoPathForThemeId(themeId);

  useEffect(() => {
    onMarkState?.("loading");
  }, [onMarkState, src]);

  const handleLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      const source =
        src.startsWith("/logos/") && src.endsWith("-brandlogo.png") ? "canonical-local-png"
        : src.startsWith("/branding/theme-logos/") ? "committed-branding-png"
        : src.startsWith("http") ? "cdn"
        : src.endsWith(".svg") ? "local-svg"
        : "unknown";
      console.debug(`[logo-debug] chain theme=${themeId} resolved=${src} source=${source}`);
    }
    onMarkState?.("ready");
  }, [onMarkState, src, themeId]);

  const handleError = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[logo-debug] chain theme=${themeId} failed=${src} trying=${loadChain[candidateIndex + 1] ?? "none"}`);
    }
    logBrandLogoLoadFailure(src, themeId, safeIndex);
    if (candidateIndex < loadChain.length - 1) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    setShowTextFallback(true);
    onMarkState?.("error");
  }, [candidateIndex, loadChain, onMarkState, src, themeId, safeIndex]);

  if (showTextFallback) {
    return (
      <span className={`${slotClassName} ${className}`.trim()} aria-label={BRAND_NAME}>
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
