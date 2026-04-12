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
  getThemeSurfaceContrastTokens,
  PALETTE_ROLE_KEYS,
} from "@/lib/theme/theme-palette-tokens";

const ALLOWED_THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

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
    const semantic = getThemeSurfaceContrastTokens(themeId);
    if (!palette || !semantic) return;
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
    root.style.setProperty("--text-on-accent", semantic.textOnBrand);
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
    setIfHex("--theme-page-bg", semantic.background);
    setIfHex("--theme-card-bg", semantic.surface);
    setIfHex("--theme-heading-text", semantic.heading);
    setIfHex("--theme-body-text", semantic.text);
    setIfHex("--theme-muted-text", semantic.textMuted);
    setIfHex("--theme-border", semantic.border);
    setIfHex("--theme-ring", palette.ring);
    setIfHex("--theme-nav-bg", semantic.navBackground);
    setIfHex("--palette-nav-background", semantic.navBackground);
    setIfHex("--theme-nav-border", semantic.navBorder);
    setIfHex("--theme-nav-text", semantic.navForeground);
    setIfHex("--palette-nav-text", semantic.navForeground);
    setIfHex("--theme-menu-text", semantic.navForeground);
    setIfHex("--theme-menu-hover-bg", semantic.navHover);
    setIfHex("--theme-menu-active-bg", semantic.navHover);
    setIfHex("--theme-menu-hover-text", semantic.navForeground);
    setIfHex("--theme-topbar-bg", palette.topBarBackground);
    setIfHex("--theme-topbar-text", palette.topBarText);
    setIfHex("--theme-card-border", semantic.border);
    setIfHex("--theme-separator", semantic.borderStrong);
    setIfHex("--theme-focus-ring", palette.ring);
    setIfHex("--theme-primary-foreground", semantic.primaryButtonText);
    setIfHex("--logo-primary", palette.logoPrimary);
    const logoText = pickReadableText(semantic.navBackground, semantic.logoOnLight, semantic.logoOnDark);
    setIfHex("--logo-text", logoText);
    setIfHex("--logo-on-dark", semantic.logoOnDark);
    setIfHex("--header-on-dark", semantic.textOnBrand);
    setIfHex("--state-success", palette.success);
    setIfHex("--state-warning", palette.warning);
    setIfHex("--state-danger-soft", palette.danger);

    // Canonical surface/contrast token contract (single source of truth for themed UI layers).
    setIfHex("--theme-background", semantic.background);
    setIfHex("--theme-background-subtle", semantic.backgroundSubtle);
    setIfHex("--theme-surface", semantic.surface);
    setIfHex("--theme-surface-strong", semantic.surfaceStrong);
    setIfHex("--theme-border-strong", semantic.borderStrong);
    setIfHex("--theme-text-on-brand", semantic.textOnBrand);
    setIfHex("--theme-brand", semantic.brand);
    setIfHex("--theme-brand-strong", semantic.brandStrong);
    setIfHex("--theme-nav-background", semantic.navBackground);
    setIfHex("--theme-nav-foreground", semantic.navForeground);
    setIfHex("--theme-nav-hover", semantic.navHover);
    setIfHex("--theme-nav-border-strong", semantic.navBorder);
    setIfHex("--theme-primary-button-bg", semantic.primaryButtonBg);
    setIfHex("--theme-primary-button-text", semantic.primaryButtonText);
    setIfHex("--theme-primary-button-hover", semantic.primaryButtonHover);
    root.style.setProperty("--theme-secondary-button-bg", semantic.secondaryButtonBg);
    setIfHex("--theme-secondary-button-text", semantic.secondaryButtonText);
    setIfHex("--theme-secondary-button-border", semantic.secondaryButtonBorder);
    setIfHex("--theme-secondary-button-hover", semantic.secondaryButtonHover);
    setIfHex("--theme-pill-bg", semantic.pillBg);
    setIfHex("--theme-pill-text", semantic.pillText);
    setIfHex("--theme-pill-border", semantic.pillBorder);
    setIfHex("--theme-logo-on-light", semantic.logoOnLight);
    setIfHex("--theme-logo-on-dark", semantic.logoOnDark);

    // CTA role system now inherits directly from canonical theme interactive tokens.
    root.style.setProperty("--role-cta", semantic.primaryButtonBg);
    root.style.setProperty("--role-cta-foreground", semantic.primaryButtonText);
    root.style.setProperty("--role-cta-hover", semantic.primaryButtonHover);
    root.style.setProperty("--role-cta-pressed", mixHex(semantic.primaryButtonHover, semantic.heading, 0.16));
    root.style.setProperty("--role-cta-shadow", `color-mix(in srgb, ${semantic.primaryButtonBg} 38%, transparent)`);
    root.style.setProperty("--role-cta-soft", `color-mix(in srgb, ${semantic.primaryButtonBg} 11%, ${semantic.surface})`);
    root.style.setProperty("--role-cta-on-soft", semantic.pillText);
    root.style.setProperty("--role-secondary-action-bg", semantic.secondaryButtonBg);
    root.style.setProperty("--role-secondary-action-text", semantic.secondaryButtonText);
    root.style.setProperty("--role-secondary-action-border", semantic.secondaryButtonBorder);
    root.style.setProperty("--role-secondary-action-hover-bg", semantic.secondaryButtonHover);

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
