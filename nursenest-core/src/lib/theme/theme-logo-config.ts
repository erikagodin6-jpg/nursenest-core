import { resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import { getThemePaletteTokens } from "@/lib/theme/theme-palette-tokens";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

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
      logoPath: resolveThemeLogo(theme.id, "full").url ?? "",
    };
    return [theme.id, entry];
  }),
);

export const THEME_LOGOS: Record<string, string> = Object.fromEntries(
  Object.entries(THEME_LOGO_CONFIG).map(([id, entry]) => [id, entry.logoPath]),
);

export function getThemeLogoPath(themeId: string): string | null {
  return THEME_LOGO_CONFIG[themeId]?.logoPath ?? null;
}

export function getThemeColors(themeId: string): ThemeColors | null {
  const entry = THEME_LOGO_CONFIG[themeId];
  if (!entry) return null;
  return { primary: entry.primary, heading: entry.heading, background: entry.background };
}
