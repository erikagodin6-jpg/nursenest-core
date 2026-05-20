import { getThemePaletteTokens } from "@/lib/theme/theme-palette-tokens";
import {
  NURSENEST_DEFAULT_THEME,
  THEME_OPTIONS,
  type ThemeOption,
} from "@/lib/theme/theme-registry";

export type RegisteredThemeId = (typeof THEME_OPTIONS)[number]["id"];

/**
 * Static public paths for the vector wordmark (`/public/logos/{id}-brandlogo.svg`), one per registry theme.
 */
export const THEME_LOGOS = Object.fromEntries(
  THEME_OPTIONS.map((t: ThemeOption) => [t.id, `/logos/${t.id}-brandlogo.svg`]),
) as { readonly [K in RegisteredThemeId]: string };

export interface ThemeColors {
  primary: string;
  heading: string;
  background: string;
}

export interface ThemeLogoEntry extends ThemeColors {
  logoPath: string;
  logoColor: string;
}

export const THEME_LOGO_CONFIG: Record<string, ThemeLogoEntry> = Object.fromEntries(
  THEME_OPTIONS.map((theme) => {
    const palette = getThemePaletteTokens(theme.id);
    const entry: ThemeLogoEntry = {
      primary: palette?.primary ?? theme.color,
      heading: palette?.heading ?? "#111827",
      background: palette?.background ?? "#ffffff",
      logoColor: palette?.logoPrimary ?? theme.color,
      logoPath: THEME_LOGOS[theme.id as RegisteredThemeId],
    };
    return [theme.id, entry];
  }),
);

export function getThemeLogoPath(themeId: string): string | null {
  return (THEME_LOGOS as Record<string, string | undefined>)[themeId] ?? null;
}

/** Same-origin path for the active theme’s SVG, or the default theme if `themeId` is unknown. */
export function getLocalThemeBrandLogoPublicPath(themeId: string): string {
  return (
    (THEME_LOGOS as Record<string, string | undefined>)[themeId] ??
    THEME_LOGOS[NURSENEST_DEFAULT_THEME as RegisteredThemeId]
  );
}

/** Alias for {@link getLocalThemeBrandLogoPublicPath}. */
export const getLocalThemeBrandLogoPath = getLocalThemeBrandLogoPublicPath;

export function getThemeColors(themeId: string): ThemeColors | null {
  const entry = THEME_LOGO_CONFIG[themeId];
  if (!entry) return null;
  return { primary: entry.primary, heading: entry.heading, background: entry.background };
}
