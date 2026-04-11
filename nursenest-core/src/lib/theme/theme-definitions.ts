/**
 * Named theme definitions — source of truth for all color values.
 *
 * Each theme specifies:
 *   - Core UI tokens (primary, secondary, accent, surface, border, text)
 *   - Lesson section role backgrounds (per-section semantic colors)
 *   - Logo recoloring tokens (mark, accent, wordmark)
 *
 * CSS custom properties in `theme-palettes.css` must mirror these values exactly.
 * Do not approximate or generate colors — every hex is hand-picked for the theme identity.
 */

export interface NurseNestThemeColors {
  /** Core UI */
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surfaceSoft: string;
  border: string;
  text: string;
  textMuted: string;

  /** Lesson section role backgrounds */
  lessonSummary: string;
  lessonKeyConcepts: string;
  lessonSignsSymptoms: string;
  lessonAssessment: string;
  lessonDiagnostics: string;
  lessonInterventions: string;
  lessonMedications: string;
  lessonPatientTeaching: string;
  lessonExamTips: string;
  lessonRedFlags: string;
  lessonClinicalPearls: string;
  lessonNotes: string;

  /** Logo recoloring */
  logoPrimary: string;
  logoAccent: string;
  logoText: string;
}

export interface NurseNestThemeDefinition {
  id: string;
  label: string;
  group: "light" | "dark";
  colors: NurseNestThemeColors;
}

export const NAMED_THEMES: NurseNestThemeDefinition[] = [
  {
    id: "blueberry-sherbet",
    label: "Blueberry Sherbet",
    group: "light",
    colors: {
      primary: "#3852B4",
      secondary: "#5E7AC4",
      accent: "#F3BE7A",
      surface: "#F8F9FF",
      surfaceSoft: "#E7ECFF",
      border: "#D6DCFF",
      text: "#1F2A44",
      textMuted: "#5A678C",

      lessonSummary: "#E7ECFF",
      lessonKeyConcepts: "#DCE4FF",
      lessonSignsSymptoms: "#FFE3E3",
      lessonAssessment: "#E6F4F1",
      lessonDiagnostics: "#EAF0FF",
      lessonInterventions: "#DFF3EB",
      lessonMedications: "#FFF1E6",
      lessonPatientTeaching: "#E8F7F0",
      lessonExamTips: "#FFF6E6",
      lessonRedFlags: "#FFE3E3",
      lessonClinicalPearls: "#F3EEFF",
      lessonNotes: "#F1F3F9",

      logoPrimary: "#3852B4",
      logoAccent: "#F3BE7A",
      logoText: "#1F2A44",
    },
  },
  {
    id: "strawberry-cream",
    label: "Strawberry Cream",
    group: "light",
    colors: {
      primary: "#EA7B7B",
      secondary: "#D25353",
      accent: "#FFEAD3",
      surface: "#FFF6F6",
      surfaceSoft: "#FFE3E3",
      border: "#FFD1D1",
      text: "#5A2A2A",
      textMuted: "#8C4A4A",

      lessonSummary: "#FFE3E3",
      lessonKeyConcepts: "#FFD6D6",
      lessonSignsSymptoms: "#FFCACA",
      lessonAssessment: "#E6F4F1",
      lessonDiagnostics: "#FCE8EC",
      lessonInterventions: "#E8F7F0",
      lessonMedications: "#FFF1E6",
      lessonPatientTeaching: "#F7EFE5",
      lessonExamTips: "#FFF5E6",
      lessonRedFlags: "#FFCACA",
      lessonClinicalPearls: "#F9E8F0",
      lessonNotes: "#F4F1F1",

      logoPrimary: "#EA7B7B",
      logoAccent: "#FFEAD3",
      logoText: "#5A2A2A",
    },
  },
  {
    id: "ocean-mist",
    label: "Ocean Mist",
    group: "light",
    colors: {
      primary: "#1D546D",
      secondary: "#5F9598",
      accent: "#B0E4CC",
      surface: "#F7FBFC",
      surfaceSoft: "#E6F2F3",
      border: "#D4E6E8",
      text: "#0F2E3A",
      textMuted: "#4F6F7A",

      lessonSummary: "#E6F2F3",
      lessonKeyConcepts: "#D9EBEE",
      lessonSignsSymptoms: "#FCE8EC",
      lessonAssessment: "#E0F2F1",
      lessonDiagnostics: "#EAF3F5",
      lessonInterventions: "#DFF3EB",
      lessonMedications: "#F1FAF9",
      lessonPatientTeaching: "#E8F7F0",
      lessonExamTips: "#FFF6E6",
      lessonRedFlags: "#FAD4D4",
      lessonClinicalPearls: "#EAF7F5",
      lessonNotes: "#F1F5F6",

      logoPrimary: "#1D546D",
      logoAccent: "#B0E4CC",
      logoText: "#0F2E3A",
    },
  },
  {
    id: "lavender-dream",
    label: "Lavender Dream",
    group: "light",
    colors: {
      primary: "#BDA6CE",
      secondary: "#9B8EC7",
      accent: "#F2EAE0",
      surface: "#FBF8FF",
      surfaceSoft: "#EFE7F7",
      border: "#E0D6F0",
      text: "#3E2F5B",
      textMuted: "#6C5A8C",

      lessonSummary: "#EFE7F7",
      lessonKeyConcepts: "#E6DBF2",
      lessonSignsSymptoms: "#FFE3E3",
      lessonAssessment: "#E6F4F1",
      lessonDiagnostics: "#F0EBFA",
      lessonInterventions: "#E8F7F0",
      lessonMedications: "#F7EFE5",
      lessonPatientTeaching: "#F4F1F9",
      lessonExamTips: "#FFF6E6",
      lessonRedFlags: "#FFD6D6",
      lessonClinicalPearls: "#F3EEFF",
      lessonNotes: "#F5F3F9",

      logoPrimary: "#9B8EC7",
      logoAccent: "#F2EAE0",
      logoText: "#3E2F5B",
    },
  },
  {
    id: "midnight-indigo",
    label: "Midnight Indigo",
    group: "dark",
    colors: {
      primary: "#021A54",
      secondary: "#1A2E7A",
      accent: "#FF85BB",
      surface: "#0B1535",
      surfaceSoft: "#14204F",
      border: "#1E2D66",
      text: "#F5F7FF",
      textMuted: "#AAB4E0",

      lessonSummary: "#14204F",
      lessonKeyConcepts: "#1C2A66",
      lessonSignsSymptoms: "#3A1F2E",
      lessonAssessment: "#183D3F",
      lessonDiagnostics: "#1E2D66",
      lessonInterventions: "#1F4D45",
      lessonMedications: "#3D2A2A",
      lessonPatientTeaching: "#2A3F3F",
      lessonExamTips: "#3A3520",
      lessonRedFlags: "#4A1F2A",
      lessonClinicalPearls: "#2A2A4F",
      lessonNotes: "#1A1F35",

      logoPrimary: "#FF85BB",
      logoAccent: "#1A2E7A",
      logoText: "#F5F7FF",
    },
  },
];

/** Lookup a named theme by id. */
export function getNamedTheme(id: string): NurseNestThemeDefinition | undefined {
  return NAMED_THEMES.find((t) => t.id === id);
}

/** All named theme ids for validation. */
export const NAMED_THEME_IDS = NAMED_THEMES.map((t) => t.id) as string[];
