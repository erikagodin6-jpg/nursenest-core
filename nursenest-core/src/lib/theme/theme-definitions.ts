/**
 * Named theme definitions — source of truth for all color values.
 *
 * Each theme specifies every token explicitly. No runtime derivation.
 *   - Core UI tokens (primary, secondary, accent, surface, border, text)
 *   - Lesson section role backgrounds (per-section semantic colors)
 *   - State colors (success, warning, info, dangerSoft)
 *   - Logo recoloring tokens (mark, accent, wordmark)
 *
 * CSS custom properties in `theme-palettes.css` must mirror these values exactly.
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

  /** State colors */
  success: string;
  warning: string;
  info: string;
  dangerSoft: string;

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
  // ── 1. Blueberry Sherbet ──────────────────────────────────────────────
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
      lessonRedFlags: "#FFD6D6",
      lessonClinicalPearls: "#F3EEFF",
      lessonNotes: "#F1F3F9",

      success: "#DFF3EB",
      warning: "#FFF1E6",
      info: "#EAF0FF",
      dangerSoft: "#FFE3E3",

      logoPrimary: "#3852B4",
      logoAccent: "#F3BE7A",
      logoText: "#1F2A44",
    },
  },

  // ── 2. Strawberry Cream ───────────────────────────────────────────────
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

      success: "#E8F7F0",
      warning: "#FFF5E6",
      info: "#FCE8EC",
      dangerSoft: "#FFCACA",

      logoPrimary: "#EA7B7B",
      logoAccent: "#FFEAD3",
      logoText: "#5A2A2A",
    },
  },

  // ── 3. Ocean Mist ─────────────────────────────────────────────────────
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

      success: "#DFF3EB",
      warning: "#FFF6E6",
      info: "#EAF3F5",
      dangerSoft: "#FAD4D4",

      logoPrimary: "#1D546D",
      logoAccent: "#B0E4CC",
      logoText: "#0F2E3A",
    },
  },

  // ── 4. Lavender Dream ─────────────────────────────────────────────────
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

      success: "#E8F7F0",
      warning: "#FFF6E6",
      info: "#F0EBFA",
      dangerSoft: "#FFD6D6",

      logoPrimary: "#9B8EC7",
      logoAccent: "#F2EAE0",
      logoText: "#3E2F5B",
    },
  },

  // ── 5. Midnight Indigo (dark) ─────────────────────────────────────────
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

      success: "#1F4D45",
      warning: "#3A3520",
      info: "#1E2D66",
      dangerSoft: "#4A1F2A",

      logoPrimary: "#FF85BB",
      logoAccent: "#1A2E7A",
      logoText: "#F5F7FF",
    },
  },

  // ── 6. Mint Breeze ────────────────────────────────────────────────────
  {
    id: "mint-breeze",
    label: "Mint Breeze",
    group: "light",
    colors: {
      primary: "#3A9E8F",
      secondary: "#6DB8A8",
      accent: "#F7D9A4",
      surface: "#F6FCFA",
      surfaceSoft: "#E2F5F0",
      border: "#C8E6DE",
      text: "#1A3A34",
      textMuted: "#4E7A6E",

      lessonSummary: "#E2F5F0",
      lessonKeyConcepts: "#D4EDE5",
      lessonSignsSymptoms: "#FDE8E8",
      lessonAssessment: "#DFF0EE",
      lessonDiagnostics: "#E4F2F5",
      lessonInterventions: "#D8F2E4",
      lessonMedications: "#FFF2E8",
      lessonPatientTeaching: "#E0F5E9",
      lessonExamTips: "#FEF6E0",
      lessonRedFlags: "#FDD8D8",
      lessonClinicalPearls: "#E8F0F5",
      lessonNotes: "#EEF4F2",

      success: "#D8F2E4",
      warning: "#FFF2E8",
      info: "#E4F2F5",
      dangerSoft: "#FDE8E8",

      logoPrimary: "#3A9E8F",
      logoAccent: "#F7D9A4",
      logoText: "#1A3A34",
    },
  },

  // ── 7. Rose Quartz ────────────────────────────────────────────────────
  {
    id: "rose-quartz",
    label: "Rose Quartz",
    group: "light",
    colors: {
      primary: "#C4788A",
      secondary: "#D4929F",
      accent: "#F5E0C8",
      surface: "#FDF8F9",
      surfaceSoft: "#F5E6EA",
      border: "#EACFD6",
      text: "#4A2230",
      textMuted: "#7A4E5A",

      lessonSummary: "#F5E6EA",
      lessonKeyConcepts: "#EED9DF",
      lessonSignsSymptoms: "#FDDADA",
      lessonAssessment: "#E4F0ED",
      lessonDiagnostics: "#F2E8F0",
      lessonInterventions: "#E2F2E8",
      lessonMedications: "#FFF0E4",
      lessonPatientTeaching: "#E8F2EC",
      lessonExamTips: "#FEF5E2",
      lessonRedFlags: "#FDD0D0",
      lessonClinicalPearls: "#F2E8F4",
      lessonNotes: "#F5F0F2",

      success: "#E2F2E8",
      warning: "#FFF0E4",
      info: "#F2E8F0",
      dangerSoft: "#FDDADA",

      logoPrimary: "#C4788A",
      logoAccent: "#F5E0C8",
      logoText: "#4A2230",
    },
  },

  // ── 8. Golden Hour ────────────────────────────────────────────────────
  {
    id: "golden-hour",
    label: "Golden Hour",
    group: "light",
    colors: {
      primary: "#B8860B",
      secondary: "#D4A84B",
      accent: "#FAE6B8",
      surface: "#FDFBF5",
      surfaceSoft: "#F5EDDA",
      border: "#E8DCC0",
      text: "#3D2E0A",
      textMuted: "#7A6530",

      lessonSummary: "#F5EDDA",
      lessonKeyConcepts: "#F0E5CC",
      lessonSignsSymptoms: "#FDE4E0",
      lessonAssessment: "#E4F0E8",
      lessonDiagnostics: "#F0EEDC",
      lessonInterventions: "#E0F0E4",
      lessonMedications: "#FFF4E4",
      lessonPatientTeaching: "#E8F0E6",
      lessonExamTips: "#FEF2D0",
      lessonRedFlags: "#FDD8D4",
      lessonClinicalPearls: "#F4EEE0",
      lessonNotes: "#F4F2EC",

      success: "#E0F0E4",
      warning: "#FFF4E4",
      info: "#F0EEDC",
      dangerSoft: "#FDE4E0",

      logoPrimary: "#B8860B",
      logoAccent: "#FAE6B8",
      logoText: "#3D2E0A",
    },
  },

  // ── 9. Sage Garden ────────────────────────────────────────────────────
  {
    id: "sage-garden",
    label: "Sage Garden",
    group: "light",
    colors: {
      primary: "#6B8E6B",
      secondary: "#8BAA8B",
      accent: "#F0E0C8",
      surface: "#F8FAF7",
      surfaceSoft: "#E6EEE4",
      border: "#CCD8CA",
      text: "#2A3C28",
      textMuted: "#5A6E58",

      lessonSummary: "#E6EEE4",
      lessonKeyConcepts: "#DCE6D8",
      lessonSignsSymptoms: "#FCE6E4",
      lessonAssessment: "#DEF0EA",
      lessonDiagnostics: "#E4ECE8",
      lessonInterventions: "#D8ECE0",
      lessonMedications: "#F8F0E4",
      lessonPatientTeaching: "#E0EEE4",
      lessonExamTips: "#FCF4DE",
      lessonRedFlags: "#F8D8D4",
      lessonClinicalPearls: "#E8EEE8",
      lessonNotes: "#EFF2EE",

      success: "#D8ECE0",
      warning: "#F8F0E4",
      info: "#E4ECE8",
      dangerSoft: "#FCE6E4",

      logoPrimary: "#6B8E6B",
      logoAccent: "#F0E0C8",
      logoText: "#2A3C28",
    },
  },

  // ── 10. Coral Sunset ──────────────────────────────────────────────────
  {
    id: "coral-sunset",
    label: "Coral Sunset",
    group: "light",
    colors: {
      primary: "#E07050",
      secondary: "#E8907A",
      accent: "#FCE4B8",
      surface: "#FFF9F6",
      surfaceSoft: "#FDE8E2",
      border: "#F4D0C4",
      text: "#4A1E14",
      textMuted: "#8A5040",

      lessonSummary: "#FDE8E2",
      lessonKeyConcepts: "#FADDD4",
      lessonSignsSymptoms: "#FCD4CC",
      lessonAssessment: "#E2F2EE",
      lessonDiagnostics: "#F8E8E4",
      lessonInterventions: "#E0F0E6",
      lessonMedications: "#FFF2E2",
      lessonPatientTeaching: "#E6F0E8",
      lessonExamTips: "#FCF0D8",
      lessonRedFlags: "#FCC8C0",
      lessonClinicalPearls: "#F4E8E0",
      lessonNotes: "#F6F0EE",

      success: "#E0F0E6",
      warning: "#FFF2E2",
      info: "#F8E8E4",
      dangerSoft: "#FCD4CC",

      logoPrimary: "#E07050",
      logoAccent: "#FCE4B8",
      logoText: "#4A1E14",
    },
  },

  // ── 11. Arctic Frost ──────────────────────────────────────────────────
  {
    id: "arctic-frost",
    label: "Arctic Frost",
    group: "light",
    colors: {
      primary: "#4A7A9B",
      secondary: "#6E9AB8",
      accent: "#D4E8F0",
      surface: "#F6FAFC",
      surfaceSoft: "#E4F0F6",
      border: "#C8DDE8",
      text: "#1A2E40",
      textMuted: "#4E6A7E",

      lessonSummary: "#E4F0F6",
      lessonKeyConcepts: "#D8E8F0",
      lessonSignsSymptoms: "#F8E2E4",
      lessonAssessment: "#E0EEF0",
      lessonDiagnostics: "#DEE8F4",
      lessonInterventions: "#DCF0E6",
      lessonMedications: "#F4F0E4",
      lessonPatientTeaching: "#E2F0EA",
      lessonExamTips: "#F8F2DE",
      lessonRedFlags: "#F4D6D8",
      lessonClinicalPearls: "#E4ECF4",
      lessonNotes: "#EEF2F6",

      success: "#DCF0E6",
      warning: "#F4F0E4",
      info: "#DEE8F4",
      dangerSoft: "#F8E2E4",

      logoPrimary: "#4A7A9B",
      logoAccent: "#D4E8F0",
      logoText: "#1A2E40",
    },
  },

  // ── 12. Plum Velvet ───────────────────────────────────────────────────
  {
    id: "plum-velvet",
    label: "Plum Velvet",
    group: "light",
    colors: {
      primary: "#7A4A8A",
      secondary: "#9A6EAA",
      accent: "#F0DDE8",
      surface: "#FBF8FC",
      surfaceSoft: "#F0E6F4",
      border: "#DEC8E8",
      text: "#30183A",
      textMuted: "#6A4878",

      lessonSummary: "#F0E6F4",
      lessonKeyConcepts: "#E8DCEE",
      lessonSignsSymptoms: "#FCE0E4",
      lessonAssessment: "#E2F0EC",
      lessonDiagnostics: "#ECE4F4",
      lessonInterventions: "#E0EEE6",
      lessonMedications: "#F8EEE4",
      lessonPatientTeaching: "#E8EEF0",
      lessonExamTips: "#FAF2DE",
      lessonRedFlags: "#F8D4D8",
      lessonClinicalPearls: "#EDE4F2",
      lessonNotes: "#F2EEF4",

      success: "#E0EEE6",
      warning: "#F8EEE4",
      info: "#ECE4F4",
      dangerSoft: "#FCE0E4",

      logoPrimary: "#7A4A8A",
      logoAccent: "#F0DDE8",
      logoText: "#30183A",
    },
  },

  // ── 13. Honey Cream ───────────────────────────────────────────────────
  {
    id: "honey-cream",
    label: "Honey Cream",
    group: "light",
    colors: {
      primary: "#A07840",
      secondary: "#C09868",
      accent: "#F8E8CC",
      surface: "#FDFAF4",
      surfaceSoft: "#F4ECE0",
      border: "#E4D4BE",
      text: "#3A2A10",
      textMuted: "#7A6440",

      lessonSummary: "#F4ECE0",
      lessonKeyConcepts: "#EEE4D4",
      lessonSignsSymptoms: "#FAE0DC",
      lessonAssessment: "#E2EEEA",
      lessonDiagnostics: "#F0E8DE",
      lessonInterventions: "#DEF0E4",
      lessonMedications: "#FFF4E0",
      lessonPatientTeaching: "#E6EEE6",
      lessonExamTips: "#FCF0D4",
      lessonRedFlags: "#F6D4D0",
      lessonClinicalPearls: "#F0E8E0",
      lessonNotes: "#F4F0EA",

      success: "#DEF0E4",
      warning: "#FFF4E0",
      info: "#F0E8DE",
      dangerSoft: "#FAE0DC",

      logoPrimary: "#A07840",
      logoAccent: "#F8E8CC",
      logoText: "#3A2A10",
    },
  },

  // ── 14. Dusty Rose ────────────────────────────────────────────────────
  {
    id: "dusty-rose",
    label: "Dusty Rose",
    group: "light",
    colors: {
      primary: "#B07080",
      secondary: "#C89098",
      accent: "#F4E0D8",
      surface: "#FCF8F6",
      surfaceSoft: "#F2E4E4",
      border: "#E4CED0",
      text: "#3E1E24",
      textMuted: "#7A4E58",

      lessonSummary: "#F2E4E4",
      lessonKeyConcepts: "#ECDAD8",
      lessonSignsSymptoms: "#F8D4D4",
      lessonAssessment: "#E2EEEA",
      lessonDiagnostics: "#F0E4E8",
      lessonInterventions: "#DEF0E6",
      lessonMedications: "#FCF0E4",
      lessonPatientTeaching: "#E8EEE8",
      lessonExamTips: "#FAF0DC",
      lessonRedFlags: "#F4CACA",
      lessonClinicalPearls: "#EEE4E8",
      lessonNotes: "#F2EEEE",

      success: "#DEF0E6",
      warning: "#FCF0E4",
      info: "#F0E4E8",
      dangerSoft: "#F8D4D4",

      logoPrimary: "#B07080",
      logoAccent: "#F4E0D8",
      logoText: "#3E1E24",
    },
  },

  // ── 15. Deep Twilight (dark) ──────────────────────────────────────────
  {
    id: "deep-twilight",
    label: "Deep Twilight",
    group: "dark",
    colors: {
      primary: "#2A1E4A",
      secondary: "#3E2E6A",
      accent: "#E8A060",
      surface: "#141020",
      surfaceSoft: "#1E1838",
      border: "#2E2650",
      text: "#F0EAF8",
      textMuted: "#B0A8C8",

      lessonSummary: "#1E1838",
      lessonKeyConcepts: "#262050",
      lessonSignsSymptoms: "#3A1828",
      lessonAssessment: "#1A3830",
      lessonDiagnostics: "#222040",
      lessonInterventions: "#1E4238",
      lessonMedications: "#382820",
      lessonPatientTeaching: "#243838",
      lessonExamTips: "#38301A",
      lessonRedFlags: "#441A24",
      lessonClinicalPearls: "#282244",
      lessonNotes: "#1C1830",

      success: "#1E4238",
      warning: "#38301A",
      info: "#222040",
      dangerSoft: "#441A24",

      logoPrimary: "#E8A060",
      logoAccent: "#3E2E6A",
      logoText: "#F0EAF8",
    },
  },
];

/** Lookup a named theme by id. */
export function getNamedTheme(id: string): NurseNestThemeDefinition | undefined {
  return NAMED_THEMES.find((t) => t.id === id);
}

/** All named theme ids for validation. */
export const NAMED_THEME_IDS = NAMED_THEMES.map((t) => t.id) as string[];
