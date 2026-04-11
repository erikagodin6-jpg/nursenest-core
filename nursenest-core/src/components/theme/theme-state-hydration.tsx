"use client";

import { useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";
import {
  getThemePaletteTokens,
  PALETTE_ROLE_KEYS,
} from "@/lib/theme/theme-palette-tokens";

const ALLOWED_THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

/**
 * next-themes initializes `theme` as undefined on the server (no localStorage).
 * After hydration, sync React state + document from localStorage / data-theme so
 * `setTheme` and CSS consumers see a consistent id before first paint where possible.
 */
export function ThemeStateHydration() {
  const { theme, setTheme } = useTheme();
  const didSync = useRef(false);

  const applyPaletteRoles = (themeId: string) => {
    const palette = getThemePaletteTokens(themeId);
    if (!palette) return;
    const root = document.documentElement;
    const toCssVar = (key: string) =>
      `--palette-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    for (const key of PALETTE_ROLE_KEYS) {
      root.style.setProperty(toCssVar(key), palette[key]);
    }

    const isHex = (value: string) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value.trim());
    const setIfHex = (name: string, value: string) => {
      if (isHex(value)) root.style.setProperty(name, value);
    };

    // Bridge legacy --theme-* consumers to curated palette roles.
    // This prevents older selectors from reintroducing monochromatic over-application.
    setIfHex("--theme-primary", palette.primary);
    setIfHex("--theme-secondary", palette.secondary);
    setIfHex("--theme-accent", palette.accent);
    setIfHex("--theme-page-bg", palette.background);
    setIfHex("--theme-card-bg", palette.surface);
    setIfHex("--theme-heading-text", palette.heading);
    setIfHex("--theme-body-text", palette.text);
    setIfHex("--theme-muted-text", palette.textMuted);
    setIfHex("--theme-border", palette.border);
    setIfHex("--theme-ring", palette.ring);
    setIfHex("--theme-nav-bg", palette.navBackground);
    setIfHex("--theme-nav-border", palette.navBorder);
    setIfHex("--theme-topbar-bg", palette.topBarBackground);
    setIfHex("--theme-topbar-text", palette.topBarText);
    setIfHex("--theme-primary-foreground", palette.buttonPrimaryText);
  };

  useLayoutEffect(() => {
    if (didSync.current) return;
    if (theme !== undefined && theme !== "") {
      didSync.current = true;
      return;
    }
    try {
      const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
      const fromDom = document.documentElement.getAttribute("data-theme");
      const raw = (fromStorage || fromDom || NURSENEST_DEFAULT_THEME).trim();
      const next = ALLOWED_THEME_IDS.has(raw) ? raw : NURSENEST_DEFAULT_THEME;
      applyPaletteRoles(next);
      setTheme(next);
    } catch {
      applyPaletteRoles(NURSENEST_DEFAULT_THEME);
      setTheme(NURSENEST_DEFAULT_THEME);
    }
    didSync.current = true;
  }, [theme, setTheme]);

  useLayoutEffect(() => {
    const resolved = theme && ALLOWED_THEME_IDS.has(theme) ? theme : NURSENEST_DEFAULT_THEME;
    applyPaletteRoles(resolved);
  }, [theme]);

  return null;
}
