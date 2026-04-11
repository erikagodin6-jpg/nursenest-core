/**
 * Canonical local brand logo assets used across header/auth/dashboard shells.
 * These are the NurseNest-approved files in `/public/logos`.
 */
import { NURSENEST_DEFAULT_THEME, getThemeLogoVariant, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

export const CORE_THEME_LOGO_PATHS = {
  lavender: "/logos/lavender-brandlogo.png",
  forest: "/logos/forest-brandlogo.png",
  sand: "/logos/neutral-sand-brandlogo.png",
  blue: "/logos/clinical-light-brandlogo.png",
} as const;

type CoreThemeLogoKey = keyof typeof CORE_THEME_LOGO_PATHS;

const VARIANT_TO_CORE_LOGO: Record<string, CoreThemeLogoKey> = {
  blue: "blue",
  mint: "forest",
  neutral: "sand",
  blush: "lavender",
  rose: "lavender",
  strawberry: "lavender",
  multi: "lavender",
  dark: "blue",
};

export function getThemeLogoPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const variant = getThemeLogoVariant(canonicalThemeId);
  const logoKey = VARIANT_TO_CORE_LOGO[variant] ?? "blue";
  return CORE_THEME_LOGO_PATHS[logoKey];
}

export const THEME_LOGO_MAP: Record<string, string> = Object.fromEntries(
  THEME_OPTIONS.map((theme) => [theme.id, getThemeLogoPathForThemeId(theme.id)]),
);
