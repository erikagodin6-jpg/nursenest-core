/** Simplified canonical theme registry. */
export const NURSENEST_DEFAULT_THEME = "ocean" as const;

export type ThemeGroup = "light" | "dark";

export type ThemeLogoVariant =
  | "blue"
  | "mint"
  | "blush"
  | "rose"
  | "strawberry"
  | "multi"
  | "dark"
  | "neutral";

export type ThemeOption = {
  id: string;
  label: string;
  color: string;
  swatchSecondary?: string;
  swatchAccent?: string;
  group: ThemeGroup;
  logoVariant: ThemeLogoVariant;
  named?: boolean;
};

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "ocean",
    label: "Ocean",
    color: "#1D9BD7",
    swatchSecondary: "#14B8A6",
    swatchAccent: "#7DD3FC",
    group: "light",
    logoVariant: "blue",
    named: true,
  },
  {
    id: "midnight",
    label: "Midnight",
    color: "#0B1220",
    swatchSecondary: "#38BDF8",
    swatchAccent: "#60A5FA",
    group: "dark",
    logoVariant: "dark",
    named: true,
  },
  {
    id: "blossom",
    label: "Blossom",
    color: "#D948A8",
    swatchSecondary: "#9357F2",
    swatchAccent: "#2F80ED",
    group: "light",
    logoVariant: "rose",
    named: true,
  },
  {
    id: "aurora",
    label: "Aurora",
    color: "#9B72FF",
    swatchSecondary: "#4A90E2",
    swatchAccent: "#E14D8F",
    group: "light",
    logoVariant: "rose",
    named: true,
  },
  {
    id: "sunset",
    label: "Sunset",
    color: "#E07862",
    swatchSecondary: "#38BDF8",
    swatchAccent: "#E8B44F",
    group: "light",
    logoVariant: "rose",
    named: true,
  },
  {
    id: "forest",
    label: "Forest",
    color: "#12805C",
    swatchSecondary: "#0F766E",
    swatchAccent: "#D9A441",
    group: "light",
    logoVariant: "mint",
    named: true,
  },
  {
    id: "dark-clinical",
    label: "Clinical High Contrast",
    color: "#06B6D4",
    swatchSecondary: "#22D3EE",
    swatchAccent: "#67E8F9",
    group: "dark",
    logoVariant: "dark",
    named: true,
  },
];

export const THEME_STORAGE_KEY = "nursenest-theme";

export const PUBLIC_MARKETING_THEME_ALLOWLIST = [
  NURSENEST_DEFAULT_THEME,
  "midnight",
  "blossom",
  "aurora",
  "sunset",
  "dark-clinical",
] as const;

export function themeOptionsForPublicMarketingPicker(all: ThemeOption[] = THEME_OPTIONS): ThemeOption[] {
  const allow = new Set<string>(PUBLIC_MARKETING_THEME_ALLOWLIST);
  return all.filter((o) => allow.has(o.id));
}

export function publicMarketingThemeChoiceCount(): number {
  return themeOptionsForPublicMarketingPicker().length;
}

export function getThemeLogoVariant(themeId: string): ThemeLogoVariant {
  return THEME_OPTIONS.find((t) => t.id === themeId)?.logoVariant ?? "blue";
}
