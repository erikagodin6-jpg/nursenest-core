export type LaunchClinicalThemeId =
  | "ocean"
  | "midnight"
  | "blossom"
  | "aurora"
  | "sunset"
  | "forest";

export type ClinicalThemeMood =
  | "Soft, motivating, elegant"
  | "Focused, deep, minimal"
  | "Clean, professional, clinical"
  | "Grounded, focused, calm"
  | "Cheerful, premium, clinically bright"
  | "Warm, optimistic, uplifting";

export type ClinicalThemeMeta = {
  id: LaunchClinicalThemeId;
  label: string;
  mood: ClinicalThemeMood;
  group: "light" | "dark";
  swatches: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
};

export const LAUNCH_CLINICAL_THEME_IDS = [
  "ocean",
  "midnight",
  "blossom",
  "aurora",
  "sunset",
  "forest",
] as const;

/**
 * Curated NurseNest study atmospheres.
 * Raw values are allowed here because this file is a token source map; page components
 * should consume CSS variables / registry metadata instead of hardcoded palette values.
 */
export const CLINICAL_THEME_META: Record<LaunchClinicalThemeId, ClinicalThemeMeta> = {
  ocean: {
    id: "ocean",
    label: "Ocean",
    mood: "Clean, professional, clinical",
    group: "light",
    swatches: {
      primary: "#1D9BD7",
      secondary: "#14B8A6",
      accent: "#7DD3FC",
      surface: "#F6FBFF",
    },
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    mood: "Focused, deep, minimal",
    group: "dark",
    swatches: {
      primary: "#0B1220",
      secondary: "#38BDF8",
      accent: "#60A5FA",
      surface: "#111827",
    },
  },
  blossom: {
    id: "blossom",
    label: "Blossom",
    mood: "Soft, motivating, elegant",
    group: "light",
    swatches: {
      primary: "#8E75FF",
      secondary: "#7DD3FC",
      accent: "#E8A87C",
      surface: "#FAF7FC",
    },
  },
  aurora: {
    id: "aurora",
    label: "Aurora",
    mood: "Cheerful, premium, clinically bright",
    group: "light",
    swatches: {
      primary: "#9B72FF",
      secondary: "#4A90E2",
      accent: "#E14D8F",
      surface: "#FAF8FF",
    },
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    mood: "Warm, optimistic, uplifting",
    group: "light",
    swatches: {
      primary: "#E07862",
      secondary: "#38BDF8",
      accent: "#E8B44F",
      surface: "#FFF8F3",
    },
  },
  forest: {
    id: "forest",
    label: "Forest",
    mood: "Grounded, focused, calm",
    group: "light",
    swatches: {
      primary: "#12805C",
      secondary: "#0F766E",
      accent: "#D9A441",
      surface: "#F7FBF7",
    },
  },
};

export function getClinicalThemeMeta(themeId: string | null | undefined): ClinicalThemeMeta | null {
  if (!themeId || !LAUNCH_CLINICAL_THEME_IDS.includes(themeId as LaunchClinicalThemeId)) {
    return null;
  }
  return CLINICAL_THEME_META[themeId as LaunchClinicalThemeId];
}
