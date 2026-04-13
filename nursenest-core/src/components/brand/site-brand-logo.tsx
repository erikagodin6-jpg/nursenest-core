"use client";

import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  brandLogoMarkPresentation,
  type BrandLogoMarkVariant,
} from "@/lib/branding/logo-config";
import { resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";
import type { ThemeLogoVariant } from "@/lib/theme/theme-logo-url";

export type BrandMarkLoadState = "loading" | "ready" | "error";

/**
 * Theme-aware brand mark. URL is resolved from an explicit theme->CDN map.
 * Missing map keys and image failures are surfaced loudly instead of silently
 * swapping to text branding.
 *
 * `variant`     — presentation slot sizing (header / footer / auth / learner / hero).
 * `logoVariant` — reserved for future full vs leaf assets; same resolver key today.
 */
export function SiteBrandLogoMark({
  className = DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  variant = "header",
  logoVariant = "full",
  onMarkState,
}: {
  className?: string;
  variant?: BrandLogoMarkVariant;
  logoVariant?: ThemeLogoVariant;
  onMarkState?: (state: BrandMarkLoadState) => void;
}) {
  const { slotClassName, imgClassName } = brandLogoMarkPresentation(variant);
  const { themeId, registeredThemeId, rawThemeId, url, kind } = useThemeLogo(logoVariant);
  const fallbackUrl = resolveThemeLogo(NURSENEST_DEFAULT_THEME, logoVariant).url;
  const resolvedUrl = url ?? fallbackUrl;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedUrl, kind]);

  const handleLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- dev diagnostic
      console.debug("[logo-debug] loaded", { themeId, registeredThemeId, rawThemeId, url: resolvedUrl });
    }
    onMarkState?.("ready");
  }, [onMarkState, themeId, registeredThemeId, rawThemeId, resolvedUrl]);

  const handleError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- dev diagnostic
      console.debug("[logo-debug] image error", { themeId, url: resolvedUrl });
    }
    if (resolvedUrl) logBrandLogoLoadFailure(resolvedUrl, themeId, 0);
    event.currentTarget.style.display = "none";
    setImageFailed(true);
    onMarkState?.("error");
  }, [onMarkState, themeId, resolvedUrl]);

  const isMappingMissing = kind === "text-fallback" || !resolvedUrl;
  const finalUrl = imageFailed && resolvedUrl !== fallbackUrl ? fallbackUrl : resolvedUrl;

  useEffect(() => {
    if (!isMappingMissing) return;
    // eslint-disable-next-line no-console -- intentional loud signal for missing explicit mapping
    console.error("[brand-logo-map-missing]", {
      rawThemeId,
      registeredThemeId,
      themeId,
      reason: "theme key missing explicit logo URL mapping",
    });
  }, [isMappingMissing, rawThemeId, registeredThemeId, themeId]);

  if (!finalUrl) return null;

  return (
    <span className={`${slotClassName} ${className}`.trim()}>
      <img
        key={`${themeId}-${finalUrl}`}
        src={finalUrl}
        alt={BRAND_NAME}
        width={320}
        height={96}
        loading="eager"
        decoding="async"
        className={imgClassName}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
