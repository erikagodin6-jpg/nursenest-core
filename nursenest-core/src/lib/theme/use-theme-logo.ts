"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { headerLogoModeForTheme } from "@/lib/branding/theme-logo-map";
import { resolveThemeLogo, type ThemeLogoVariant } from "@/lib/branding/resolve-theme-logo";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";
import { NURSENEST_DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }
  const el = document.documentElement;
  const mo = new MutationObserver(() => onChange());
  mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    mo.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

/** Raw `data-theme` / storage value (may be non-registry during hydration edge cases). */
function readDomThemeRaw(): string {
  if (typeof document === "undefined") return NURSENEST_DEFAULT_THEME;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr && attr.length > 0) return attr.trim();
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v) return v.trim();
  } catch {
    /* ignore */
  }
  return NURSENEST_DEFAULT_THEME;
}

function getServerSnapshot(): string {
  return NURSENEST_DEFAULT_THEME;
}

/**
 * Active theme logo follows `data-theme` (and the same localStorage key as the boot script), not
 * next-themes React state alone. That keeps the raster aligned with CSS variables and avoids a
 * brief wrong-theme logo when the DOM is already set after `beforeInteractive` boot.
 */
export function useThemeLogo(logoVariant: ThemeLogoVariant = "full"): {
  /** Registry id when `data-theme` is valid; otherwise null. */
  registeredThemeId: string | null;
  /** Raw theme string from DOM / storage (diagnostics). */
  rawThemeId: string;
  /** Prefer registered id for logs; falls back to raw when unregistered. */
  themeId: string;
  mappedSpaceKey: string | null;
  headerLogoMode: "dark-header" | "light-header";
  url: string | null;
  kind: "local" | "text-fallback";
  /** Theme id whose CDN key was used (may differ when borrowing a sibling logo). */
  assetThemeId: string | null;
} {
  const rawThemeId = useSyncExternalStore(subscribe, readDomThemeRaw, getServerSnapshot);
  const registeredThemeId = useMemo(() => parseRegisteredThemeId(rawThemeId), [rawThemeId]);
  const themeId = registeredThemeId ?? rawThemeId;
  const headerTarget = registeredThemeId ?? NURSENEST_DEFAULT_THEME;
  const headerLogoMode = useMemo(() => headerLogoModeForTheme(headerTarget), [headerTarget]);
  const resolved = useMemo(
    () => resolveThemeLogo(registeredThemeId, logoVariant),
    [registeredThemeId, logoVariant],
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.debug("[theme-logo]", {
      themeId: registeredThemeId ?? rawThemeId,
      resolvedLogoUrl: resolved.url,
      assetThemeId: resolved.assetThemeId,
      borrowedLogo: Boolean(
        registeredThemeId && resolved.assetThemeId && registeredThemeId !== resolved.assetThemeId,
      ),
      textFallback: resolved.kind === "text-fallback",
    });
  }, [registeredThemeId, rawThemeId, resolved.url, resolved.kind, resolved.assetThemeId]);

  return {
    registeredThemeId,
    rawThemeId,
    themeId,
    mappedSpaceKey: resolved.objectKey,
    headerLogoMode,
    url: resolved.url,
    kind: resolved.kind,
    assetThemeId: resolved.assetThemeId,
  };
}
