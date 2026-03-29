"use client";

import { useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

const ALLOWED_THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

/**
 * next-themes initializes `theme` as undefined on the server (no localStorage).
 * After hydration, sync React state + document from localStorage / data-theme so
 * `setTheme` and CSS consumers see a consistent id before first paint where possible.
 */
export function ThemeStateHydration() {
  const { theme, setTheme } = useTheme();
  const didSync = useRef(false);

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
      setTheme(next);
    } catch {
      setTheme(NURSENEST_DEFAULT_THEME);
    }
    didSync.current = true;
  }, [theme, setTheme]);

  return null;
}
