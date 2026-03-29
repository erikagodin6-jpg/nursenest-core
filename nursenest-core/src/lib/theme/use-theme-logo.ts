"use client";

import { useTheme } from "next-themes";
import { useMemo, useSyncExternalStore } from "react";
import { getThemeLogoObjectKeyFromNormalizedId } from "@/lib/branding/theme-brand-logo-cdn";
import { getHeaderBrandLogoLoadChain } from "@/lib/theme/theme-logo-url";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";
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

function readDomThemeId(): string {
  if (typeof document === "undefined") return NURSENEST_DEFAULT_THEME;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr && attr.length > 0) return normalizeThemeIdForLogo(attr);
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v) return normalizeThemeIdForLogo(v);
  } catch {
    /* ignore */
  }
  return NURSENEST_DEFAULT_THEME;
}

function getServerSnapshot(): string {
  return NURSENEST_DEFAULT_THEME;
}

/**
 * Active theme logo: `resolvedTheme ?? theme` from next-themes when hydrated, otherwise
 * `data-theme` / localStorage (via sync external store) so the first paint matches the boot script.
 */
export function useThemeLogo(): {
  /** Canonical theme id used for logo mapping. */
  themeId: string;
  /** Spaces object key for the active theme mark (`branding/themes/logo-*.png`). */
  mappedSpaceKey: string;
  /** Ordered URLs: same-origin proxy first, then public CDN, then fallbacks. */
  loadChain: string[];
} {
  const { resolvedTheme, theme } = useTheme();
  const domThemeId = useSyncExternalStore(subscribe, readDomThemeId, getServerSnapshot);
  const raw = resolvedTheme ?? theme ?? domThemeId;
  const activeId = normalizeThemeIdForLogo(raw);
  const mappedSpaceKey = useMemo(() => getThemeLogoObjectKeyFromNormalizedId(activeId), [activeId]);
  const loadChain = useMemo(() => getHeaderBrandLogoLoadChain(activeId), [activeId]);

  return {
    themeId: activeId,
    mappedSpaceKey,
    loadChain,
  };
}
