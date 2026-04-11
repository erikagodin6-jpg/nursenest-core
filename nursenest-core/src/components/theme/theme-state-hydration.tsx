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
    setIfHex("--theme-secondary", palette.primaryDeep);
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
    setIfHex("--theme-nav-text", palette.navText);
    setIfHex("--theme-menu-text", palette.navText);
    setIfHex("--theme-menu-hover-bg", palette.navHover);
    setIfHex("--theme-menu-active-bg", palette.navActive);
    setIfHex("--theme-menu-hover-text", palette.navText);
    setIfHex("--theme-topbar-bg", palette.topBarBackground);
    setIfHex("--theme-topbar-text", palette.topBarText);
    setIfHex("--theme-card-border", palette.border);
    setIfHex("--theme-separator", palette.borderStrong);
    setIfHex("--theme-focus-ring", palette.ring);
    setIfHex("--theme-primary-foreground", palette.buttonPrimaryText);
    setIfHex("--logo-primary", palette.logoPrimary);
    setIfHex("--logo-text", palette.logoOnLight);
    setIfHex("--logo-on-dark", palette.logoOnDark);
    setIfHex("--state-success", palette.success);
    setIfHex("--state-warning", palette.warning);
    setIfHex("--state-danger-soft", palette.danger);

    // Lesson semantic mapping (fixed roles from product requirement).
    setIfHex("--lesson-summary", palette.box1);
    setIfHex("--lesson-key-concepts", palette.box2);
    setIfHex("--lesson-signs-symptoms", palette.box3);
    setIfHex("--lesson-interventions", palette.box4);
    setIfHex("--lesson-diagnostics", palette.box5); // labs
    setIfHex("--lesson-medications", palette.box6); // pharmacology
    setIfHex("--lesson-clinical-pearls", palette.box7); // complications
    setIfHex("--lesson-patient-teaching", palette.box8);
    setIfHex("--lesson-exam-tips", palette.box9);
    setIfHex("--lesson-red-flags", palette.danger); // warnings
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
