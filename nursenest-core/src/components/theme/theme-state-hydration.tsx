"use client";

import { useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";
import {
  getThemePaletteTokens,
  PALETTE_ROLE_KEYS,
  type ThemePaletteTokens,
} from "@/lib/theme/theme-palette-tokens";

const ALLOWED_THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));
const LIGHT_THEME_IDS = new Set(THEME_OPTIONS.filter((o) => o.group === "light").map((o) => o.id));
const DARK_THEME_IDS = new Set(THEME_OPTIONS.filter((o) => o.group === "dark").map((o) => o.id));

const PINK_NAV_THEMES = new Set([
  "blush",
  "pastel-blush",
  "strawberry",
  "rose-gold",
  "coral",
  "petal-pop",
  "cotton-candy",
  "pink-skies",
  "rose-quartz",
  "strawberry-cream",
  "dusty-rose",
  "coral-sunset",
]);

const BERRY_NAV_THEMES = new Set(["berry", "berry-bonbon", "violet-night", "plum-mist", "plum-velvet"]);
const INDIGO_NAV_THEMES = new Set([
  "indigo",
  "lavender",
  "pastel-lavender",
  "pastel-lilac",
  "lavender-dream",
  "deep-twilight",
  "midnight-indigo",
]);
const GREEN_NAV_THEMES = new Set([
  "mint",
  "pastel-mint",
  "teal",
  "forest",
  "soft-sage",
  "sage-garden",
  "evergreen-steel",
  "clinical-light",
  "dark-clinical",
]);
const STABLE_ANCHOR_NAV_THEMES = new Set([
  "multi-pastel",
  "pastel-party",
  "rainbow-sherbet",
  "sunny-lilac",
  "sky-kiss",
  "bluebird",
  "mint-breeze",
]);

function parseHexColor(value: string): { r: number; g: number; b: number } | null {
  const hex = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(base: string, overlay: string, overlayRatio: number): string {
  const baseRgb = parseHexColor(base);
  const overlayRgb = parseHexColor(overlay);
  if (!baseRgb || !overlayRgb) return base;
  const ratio = Math.max(0, Math.min(1, overlayRatio));
  return rgbToHex({
    r: baseRgb.r * (1 - ratio) + overlayRgb.r * ratio,
    g: baseRgb.g * (1 - ratio) + overlayRgb.g * ratio,
    b: baseRgb.b * (1 - ratio) + overlayRgb.b * ratio,
  });
}

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminanceFromHex(a);
  const l2 = relativeLuminanceFromHex(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickReadableText(background: string, darkText: string, lightText: string): string {
  return contrastRatio(background, lightText) >= contrastRatio(background, darkText)
    ? lightText
    : darkText;
}

function resolveLightThemeNavAnchor(themeId: string, palette: ThemePaletteTokens): string {
  if (themeId === "mint-breeze") {
    // Product requirement: Mint Breeze nav anchor must be blue, not mint.
    return mixHex(palette.accent, "#0f172a", 0.34);
  }
  if (STABLE_ANCHOR_NAV_THEMES.has(themeId)) {
    return mixHex(palette.primaryDeep, "#0f172a", 0.42);
  }
  if (PINK_NAV_THEMES.has(themeId) || BERRY_NAV_THEMES.has(themeId)) {
    return mixHex(palette.primaryDeep, "#0f172a", 0.44);
  }
  if (INDIGO_NAV_THEMES.has(themeId)) {
    return mixHex(palette.primaryDeep, "#0f172a", 0.4);
  }
  if (GREEN_NAV_THEMES.has(themeId)) {
    return mixHex(palette.primaryDeep, "#052e2b", 0.38);
  }
  return mixHex(palette.primaryDeep, "#0f172a", 0.36);
}

function normalizeLightThemeHierarchy(themeId: string, palette: ThemePaletteTokens): ThemePaletteTokens {
  // Keep light themes soft but increase luminance separation between page, surfaces, and chrome.
  const background = mixHex(palette.background, "#ffffff", 0.5);
  let surface = mixHex(background, palette.primaryDeep, 0.1);
  if (contrastRatio(background, surface) < 1.12) {
    surface = mixHex(background, palette.primaryDeep, 0.18);
  }

  let surfaceAlt = mixHex(surface, palette.primaryDeep, 0.2);
  if (contrastRatio(surface, surfaceAlt) < 1.08) {
    surfaceAlt = mixHex(surface, palette.primaryDeep, 0.24);
  }
  const surfaceStrong = mixHex(surfaceAlt, palette.primaryDeep, 0.16);

  let border = mixHex(palette.border, palette.primaryDeep, 0.16);
  if (contrastRatio(surface, border) < 1.2) {
    border = mixHex(surface, palette.primaryDeep, 0.3);
  }
  const borderStrong = mixHex(palette.borderStrong, palette.primaryDeep, 0.2);

  const navBackground = resolveLightThemeNavAnchor(themeId, palette);
  const navBorder = mixHex(navBackground, palette.primaryDeep, 0.34);
  const navText = pickReadableText(navBackground, "#0f172a", palette.logoOnDark);
  const navTextMuted = mixHex(navText, navBackground, 0.32);
  const navHover = mixHex(navBackground, palette.primaryDeep, 0.18);
  const navActive = mixHex(navBackground, palette.accent, 0.2);

  const badge = mixHex(palette.badge, palette.primaryDeep, 0.16);
  const buttonSecondary = mixHex(palette.buttonSecondary, palette.primaryDeep, 0.18);
  const buttonSecondaryText = pickReadableText(buttonSecondary, palette.heading, palette.logoOnDark);

  return {
    ...palette,
    background,
    surface,
    surfaceAlt,
    surfaceStrong,
    border,
    borderStrong,
    navBackground,
    navBorder,
    navText,
    navTextMuted,
    navHover,
    navActive,
    badge,
    buttonSecondary,
    buttonSecondaryText,
  };
}

function getEffectivePalette(themeId: string, palette: ThemePaletteTokens): ThemePaletteTokens {
  if (DARK_THEME_IDS.has(themeId)) return palette;
  if (!LIGHT_THEME_IDS.has(themeId)) return palette;
  return normalizeLightThemeHierarchy(themeId, palette);
}

/**
 * next-themes initializes `theme` as undefined on the server (no localStorage).
 * After hydration, sync React state + document from localStorage / data-theme so
 * `setTheme` and CSS consumers see a consistent id before first paint where possible.
 */
export function ThemeStateHydration() {
  const { theme, setTheme } = useTheme();
  const didSync = useRef(false);

  const applyPaletteRoles = (themeId: string) => {
    const rawPalette = getThemePaletteTokens(themeId);
    if (!rawPalette) return;
    const palette = getEffectivePalette(themeId, rawPalette);
    const root = document.documentElement;
    const toCssVar = (key: string) =>
      `--palette-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    for (const key of PALETTE_ROLE_KEYS) {
      root.style.setProperty(toCssVar(key), palette[key]);
    }

    // Required semantic role aliases (centralized, component-safe contract).
    root.style.setProperty("--palette-nav", palette.navBackground);
    root.style.setProperty("--text-primary", palette.text);
    root.style.setProperty("--text-muted", palette.textMuted);
    root.style.setProperty("--text-on-accent", pickReadableText(palette.navBackground, "#0f172a", palette.logoOnDark));
    root.style.setProperty("--border-subtle", palette.border);
    root.style.setProperty("--accent-primary", palette.buttonPrimary);
    root.style.setProperty("--accent-secondary", palette.accent);

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
    setIfHex("--palette-nav-background", palette.navBackground);
    setIfHex("--theme-nav-border", palette.navBorder);
    setIfHex("--theme-nav-text", palette.navText);
    setIfHex("--palette-nav-text", palette.navText);
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
    const logoText = pickReadableText(palette.navBackground, palette.logoOnLight, palette.logoOnDark);
    setIfHex("--logo-text", logoText);
    setIfHex("--logo-on-dark", palette.logoOnDark);
    setIfHex("--header-on-dark", palette.logoOnDark);
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
