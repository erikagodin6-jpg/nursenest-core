"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  brandLogoMarkPresentation,
  type BrandLogoMarkVariant,
} from "@/lib/branding/logo-config";
import { logBrandLogoLoadFailure } from "@/lib/observability/brand-logo-client-log";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";
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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [url, kind]);

  const handleLoad = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- dev diagnostic
      console.debug("[logo-debug] loaded", { themeId, registeredThemeId, rawThemeId, url });
    }
    onMarkState?.("ready");
  }, [onMarkState, themeId, registeredThemeId, rawThemeId, url]);

  const handleError = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- dev diagnostic
      console.debug("[logo-debug] image error", { themeId, url });
    }
    if (url) logBrandLogoLoadFailure(url, themeId, 0);
    setImageFailed(true);
    onMarkState?.("error");
  }, [onMarkState, themeId, url]);

  const isMappingMissing = kind === "text-fallback" || !url;
  const showMissingPlaceholder = isMappingMissing || imageFailed;

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

  if (showMissingPlaceholder) {
    return (
      <span className={`${slotClassName} ${className}`.trim()} aria-label={`${BRAND_NAME} logo unavailable`}>
        <span
          className="inline-flex h-full min-h-8 items-center rounded-md border border-[var(--nav-border,var(--border-subtle))] bg-[var(--surface,var(--bg-card))] px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text,var(--text-muted))]"
          title={`Missing logo mapping for theme: ${registeredThemeId ?? rawThemeId}`}
        >
          {`Missing logo: ${registeredThemeId ?? rawThemeId}`}
        </span>
      </span>
    );
  }

  return (
    <span className={`${slotClassName} ${className}`.trim()}>
      <img
        key={`${themeId}-${url}`}
        src={url}
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
