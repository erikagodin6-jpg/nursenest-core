import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

/**
 * Palette roles for each NurseNest theme.
 *
 * IMPORTANT:
 * - User-provided theme hexes are treated as PRIMARY ANCHORS only.
 * - The rest of each palette (secondary/accent/surfaces/nav/topbar/buttons/badges)
 *   is deliberately coordinated to avoid monochromatic UI wash.
 * - Light themes keep breathable neutral backgrounds; color is concentrated on
 *   emphasis surfaces and actions.
 */

export type ThemePaletteTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  heading: string;
  border: string;
  ring: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  badge: string;
  badgeText: string;
  navBackground: string;
  navBorder: string;
  topBarBackground: string;
  topBarText: string;
};

export const PALETTE_ROLE_KEYS: (keyof ThemePaletteTokens)[] = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "surfaceAlt",
  "text",
  "textMuted",
  "heading",
  "border",
  "ring",
  "buttonPrimary",
  "buttonPrimaryText",
  "buttonSecondary",
  "buttonSecondaryText",
  "badge",
  "badgeText",
  "navBackground",
  "navBorder",
  "topBarBackground",
  "topBarText",
];

const LIGHT_DEFAULT: ThemePaletteTokens = {
  primary: "var(--theme-primary)",
  secondary: "color-mix(in srgb, var(--theme-secondary) 72%, var(--theme-accent) 28%)",
  accent: "color-mix(in srgb, var(--theme-accent) 68%, var(--theme-primary) 32%)",
  background: "color-mix(in srgb, #ffffff 97%, var(--theme-secondary) 3%)",
  surface: "color-mix(in srgb, #ffffff 90%, var(--theme-secondary) 10%)",
  surfaceAlt: "color-mix(in srgb, #ffffff 82%, var(--theme-secondary) 18%)",
  text: "var(--theme-body-text)",
  textMuted: "var(--theme-muted-text)",
  heading: "var(--theme-heading-text)",
  border: "color-mix(in srgb, var(--theme-border) 82%, #d1d5db)",
  ring: "var(--theme-ring)",
  buttonPrimary: "color-mix(in srgb, var(--theme-primary) 84%, var(--theme-secondary) 16%)",
  buttonPrimaryText: "var(--theme-primary-foreground)",
  buttonSecondary: "color-mix(in srgb, var(--theme-secondary) 34%, #ffffff)",
  buttonSecondaryText: "var(--theme-heading-text)",
  badge: "color-mix(in srgb, var(--theme-accent) 20%, #ffffff)",
  badgeText: "color-mix(in srgb, var(--theme-accent-foreground) 82%, var(--theme-heading-text))",
  navBackground: "color-mix(in srgb, var(--theme-secondary) 14%, #ffffff)",
  navBorder: "color-mix(in srgb, var(--theme-border) 60%, #d1d5db)",
  topBarBackground: "color-mix(in srgb, var(--theme-primary) 82%, var(--theme-secondary) 18%)",
  topBarText: "var(--theme-primary-foreground)",
};

const DARK_DEFAULT: ThemePaletteTokens = {
  primary: "var(--theme-primary)",
  secondary: "color-mix(in srgb, var(--theme-secondary) 74%, var(--theme-accent) 26%)",
  accent: "color-mix(in srgb, var(--theme-accent) 70%, var(--theme-primary) 30%)",
  background: "color-mix(in srgb, #0b1020 80%, var(--theme-primary) 20%)",
  surface: "color-mix(in srgb, #1b2438 74%, var(--theme-secondary) 26%)",
  surfaceAlt: "color-mix(in srgb, #26354f 68%, var(--theme-accent) 32%)",
  text: "var(--theme-body-text)",
  textMuted: "var(--theme-muted-text)",
  heading: "var(--theme-heading-text)",
  border: "color-mix(in srgb, var(--theme-border) 78%, var(--theme-page-bg))",
  ring: "var(--theme-ring)",
  buttonPrimary: "color-mix(in srgb, var(--theme-primary) 82%, var(--theme-accent) 18%)",
  buttonPrimaryText: "#ffffff",
  buttonSecondary: "color-mix(in srgb, var(--theme-secondary) 40%, var(--theme-card-bg) 60%)",
  buttonSecondaryText: "var(--theme-heading-text)",
  badge: "color-mix(in srgb, var(--theme-accent) 28%, var(--theme-card-bg))",
  badgeText: "var(--theme-heading-text)",
  navBackground: "color-mix(in srgb, var(--theme-card-bg) 78%, var(--theme-primary) 22%)",
  navBorder: "color-mix(in srgb, var(--theme-border) 82%, var(--theme-page-bg))",
  topBarBackground: "color-mix(in srgb, var(--theme-secondary) 74%, var(--theme-primary) 26%)",
  topBarText: "var(--theme-heading-text)",
};

/**
 * Reference-standard curated palettes to avoid monochromatic wash.
 * These themes intentionally use separate anchor/support/accent families.
 */
const REFERENCE_OVERRIDES: Record<string, Partial<ThemePaletteTokens>> = {
  mint: {
    primary: "#66b2b2",
    secondary: "#5b8fa8",
    accent: "#2f7fa1",
    background: "#f7fbfc",
    surface: "#f0f6f8",
    surfaceAlt: "#dfeef4",
    text: "#334a56",
    textMuted: "#5b7280",
    heading: "#111827",
    border: "#c9dbe2",
    ring: "#2f7fa1",
    buttonPrimary: "#2f7fa1",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#e5f0f5",
    buttonSecondaryText: "#1f3a49",
    badge: "#d9ecf2",
    badgeText: "#1f4b5e",
    navBackground: "#f2f8fa",
    navBorder: "#c7d8e0",
    topBarBackground: "#1f5e77",
    topBarText: "#ffffff",
  },
  blush: {
    primary: "#e899b0",
    secondary: "#b98aa5",
    accent: "#7b5476",
    background: "#fdf9fb",
    surface: "#f7eef3",
    surfaceAlt: "#f0e0e9",
    text: "#5f4554",
    textMuted: "#7f6371",
    heading: "#111827",
    border: "#e3ced8",
    ring: "#7b5476",
    buttonPrimary: "#92506b",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#f4e6ec",
    buttonSecondaryText: "#5a3346",
    badge: "#f0dde6",
    badgeText: "#6f3d54",
    navBackground: "#fbf3f7",
    navBorder: "#e0c8d4",
    topBarBackground: "#7d3e58",
    topBarText: "#ffffff",
  },
  slate: {
    primary: "#64748b",
    secondary: "#7f8fb0",
    accent: "#546f9f",
    background: "#f8fafd",
    surface: "#eff3f7",
    surfaceAlt: "#e1e8f1",
    text: "#3f4f63",
    textMuted: "#66758a",
    heading: "#111827",
    border: "#cdd8e6",
    ring: "#546f9f",
    buttonPrimary: "#465f86",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#e8eef5",
    buttonSecondaryText: "#31445f",
    badge: "#dde7f3",
    badgeText: "#3b5275",
    navBackground: "#f2f6fb",
    navBorder: "#c8d5e4",
    topBarBackground: "#33445d",
    topBarText: "#ffffff",
  },
  "lavender-dream": {
    primary: "#bda6ce",
    secondary: "#9284bb",
    accent: "#6b5ea4",
    background: "#fbf8ff",
    surface: "#f4eff9",
    surfaceAlt: "#e8def4",
    text: "#5a4f76",
    textMuted: "#7b6f96",
    heading: "#3e2f5b",
    border: "#ddd3ee",
    ring: "#6b5ea4",
    buttonPrimary: "#6b5ea4",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#ece6f7",
    buttonSecondaryText: "#4e4174",
    badge: "#e5def4",
    badgeText: "#584a85",
    navBackground: "#f6f1fc",
    navBorder: "#d8cfee",
    topBarBackground: "#5a4a84",
    topBarText: "#ffffff",
  },
  "soft-sage": {
    primary: "#7da87d",
    secondary: "#6f8f98",
    accent: "#3f6673",
    background: "#f8fbf8",
    surface: "#eef4f0",
    surfaceAlt: "#dfebe4",
    text: "#405a4a",
    textMuted: "#5f7869",
    heading: "#111827",
    border: "#cbdccd",
    ring: "#3f6673",
    buttonPrimary: "#456e67",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#e5f0ea",
    buttonSecondaryText: "#35554d",
    badge: "#dceae3",
    badgeText: "#3f665c",
    navBackground: "#f2f8f4",
    navBorder: "#c5d8cb",
    topBarBackground: "#3f665c",
    topBarText: "#ffffff",
  },
  "neutral-sand": {
    primary: "#a08060",
    secondary: "#8c9f7e",
    accent: "#6c7c66",
    background: "#fcfaf7",
    surface: "#f4eee7",
    surfaceAlt: "#e9dfd3",
    text: "#5a4a3a",
    textMuted: "#7a6a58",
    heading: "#111827",
    border: "#dfd3c3",
    ring: "#6c7c66",
    buttonPrimary: "#7b6b53",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#eee6dc",
    buttonSecondaryText: "#5b4a36",
    badge: "#e6ddd1",
    badgeText: "#6c5a44",
    navBackground: "#f8f4ee",
    navBorder: "#d9cebe",
    topBarBackground: "#6b5a46",
    topBarText: "#ffffff",
  },
  forest: {
    primary: "#10b981",
    secondary: "#2f9a8f",
    accent: "#2c6f86",
    background: "#f6fbf9",
    surface: "#edf5f2",
    surfaceAlt: "#dbeae4",
    text: "#2f5a4f",
    textMuted: "#507567",
    heading: "#111827",
    border: "#c2dfd5",
    ring: "#2c6f86",
    buttonPrimary: "#1b7a67",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#e0f1ec",
    buttonSecondaryText: "#245a52",
    badge: "#d5ebe3",
    badgeText: "#2a6a60",
    navBackground: "#eef8f4",
    navBorder: "#bcd8cd",
    topBarBackground: "#1b6b5c",
    topBarText: "#ffffff",
  },
  "clinical-light": {
    primary: "#3b82f6",
    secondary: "#4f93d8",
    accent: "#2563eb",
    background: "#f7faff",
    surface: "#eef3f9",
    surfaceAlt: "#dde7f6",
    text: "#2f4e73",
    textMuted: "#527090",
    heading: "#111827",
    border: "#c7d8f4",
    ring: "#2563eb",
    buttonPrimary: "#2563eb",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#e4ecfb",
    buttonSecondaryText: "#244d8a",
    badge: "#dbe8fb",
    badgeText: "#285393",
    navBackground: "#f1f6fd",
    navBorder: "#bed1f0",
    topBarBackground: "#1e4fa8",
    topBarText: "#ffffff",
  },
  "dark-clinical": {
    primary: "#06b6d4",
    secondary: "#2f7fa8",
    accent: "#35c6e0",
    background: "#0f1624",
    surface: "#1a2638",
    surfaceAlt: "#243449",
    text: "#d8e6f5",
    textMuted: "#9ab4cd",
    heading: "#f1f5f9",
    border: "#2f435d",
    ring: "#35c6e0",
    buttonPrimary: "#1f8fb3",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#223248",
    buttonSecondaryText: "#dbe8f6",
    badge: "#203246",
    badgeText: "#b9d6ec",
    navBackground: "#141f31",
    navBorder: "#2b4059",
    topBarBackground: "#11263c",
    topBarText: "#d5ecff",
  },
  "dark-academia": {
    primary: "#8b7355",
    secondary: "#5e6f7c",
    accent: "#b59666",
    background: "#18120e",
    surface: "#2a211a",
    surfaceAlt: "#352a22",
    text: "#dbcab3",
    textMuted: "#ac9880",
    heading: "#faf5ef",
    border: "#4a3d31",
    ring: "#b59666",
    buttonPrimary: "#8f6d45",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#32271f",
    buttonSecondaryText: "#e9d8c2",
    badge: "#382c24",
    badgeText: "#d9c2a2",
    navBackground: "#231a14",
    navBorder: "#47382c",
    topBarBackground: "#1d150f",
    topBarText: "#e7d6bf",
  },
};

export const THEME_PALETTE_TOKENS: Record<string, ThemePaletteTokens> = Object.fromEntries(
  THEME_OPTIONS.map((theme) => {
    const base = theme.group === "dark" ? DARK_DEFAULT : LIGHT_DEFAULT;
    const override = REFERENCE_OVERRIDES[theme.id] ?? {};
    return [theme.id, { ...base, ...override } satisfies ThemePaletteTokens];
  }),
);

export function getThemePaletteTokens(themeId: string): ThemePaletteTokens | null {
  return THEME_PALETTE_TOKENS[themeId] ?? null;
}
