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
 * Theme-aware brand mark. Same-origin SVG from {@link resolveThemeLogo}; on error → text only (no chain).
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
      console.debug("[logo-debug] image error → text", { themeId, url });
    }
    if (url) logBrandLogoLoadFailure(url, themeId, 0);
    setImageFailed(true);
    onMarkState?.("error");
  }, [onMarkState, themeId, url]);

  const showText = kind === "text-fallback" || !url || imageFailed;

  if (showText) {
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
        key={`${themeId}-${url}`}
        src={url}
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
