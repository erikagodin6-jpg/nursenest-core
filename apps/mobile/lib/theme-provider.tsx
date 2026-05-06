import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { NurseNestColors, NurseNestDarkColors, type NurseNestPalette } from "./theme";

type ThemeCtx = { readonly palette: NurseNestPalette; readonly isDark: boolean };

const ThemeContext = createContext<ThemeCtx | null>(null);

export function AppThemeProvider({ children }: { readonly children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const value = useMemo<ThemeCtx>(
    () => ({
      isDark,
      palette: (isDark ? NurseNestDarkColors : NurseNestColors) as NurseNestPalette,
    }),
    [isDark],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { isDark: false, palette: NurseNestColors };
  }
  return ctx;
}
