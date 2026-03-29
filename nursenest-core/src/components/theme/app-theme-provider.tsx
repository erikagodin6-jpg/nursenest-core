"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";
import { ThemeStateHydration } from "@/components/theme/theme-state-hydration";

/**
 * Single root for NurseNest theming (do not nest a second ThemeProvider).
 * Default is lavender (brand baseline).
 * Persistence: localStorage via next-themes; first-visit preference is seeded in root layout script.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={NURSENEST_DEFAULT_THEME}
      themes={THEME_OPTIONS.map((o) => o.id)}
      enableSystem={false}
      enableColorScheme={false}
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      <ThemeStateHydration />
      {children}
    </ThemeProvider>
  );
}
