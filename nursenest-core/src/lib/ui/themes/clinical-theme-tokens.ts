export type LaunchClinicalThemeId =
  | "ocean"
  | "midnight"
  | "blossom"
  | "mint-blossom"
  | "aurora"
  | "sunset"
  | "alpine"
  | "sage"
  | "forest";

export type ClinicalThemeMood =
  | "Soft, motivating, elegant"
  | "Focused, deep, minimal"
  | "Clean, professional, clinical"
  | "Modern, intelligent, clean"
  | "Grounded, focused, calm"
  | "Professional, clinical, calming"
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
  "mint-blossom",
  "aurora",
  "sunset",
  "alpine",
  "sage",
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
      primary: "#007BFF",
      secondary: "#06B6D4",
      accent: "#16A34A",
      surface: "#F8FCFF",
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
  "mint-blossom": {
    id: "mint-blossom",
    label: "Mint Blossom",
    mood: "Soft, motivating, elegant",
    group: "light",
    swatches: {
      primary: "#FFB7D5",
      secondary: "#B7EFD1",
      accent: "#D6F0FF",
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
  alpine: {
    id: "alpine",
    label: "Alpine",
    mood: "Modern, intelligent, clean",
    group: "light",
    swatches: {
      primary: "#2F5E87",
      secondary: "#5F86A8",
      accent: "#9CC3E8",
      surface: "#F7F9FB",
    },
  },
  sage: {
    id: "sage",
    label: "Sage",
    mood: "Professional, clinical, calming",
    group: "light",
    swatches: {
      primary: "#5F8F79",
      secondary: "#7FA79A",
      accent: "#3D6B5B",
      surface: "#F7F8F6",
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
