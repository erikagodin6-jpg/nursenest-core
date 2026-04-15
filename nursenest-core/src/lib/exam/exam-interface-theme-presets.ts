import { THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";

/**
 * Eight exam-interface presets aligned with legacy `client/src/pages/mock-exams.tsx` `EXAM_THEMES`
 * (Pastel Lilac → High Contrast). Each entry maps to a production `data-theme` id — no raw legacy hex.
 */
export const EXAM_INTERFACE_THEME_IDS = [
  "pastel-lilac",
  "pastel-blush",
  "sky-kiss",
  "pastel-mint",
  "golden-hour",
  "plum-mist",
  "neutral-slate",
  "indigo",
] as const;

export type ExamInterfaceThemeId = (typeof EXAM_INTERFACE_THEME_IDS)[number];

export function getExamInterfaceThemePresets(): ThemeOption[] {
  const map = new Map(THEME_OPTIONS.map((t) => [t.id, t]));
  return EXAM_INTERFACE_THEME_IDS.map((id) => {
    const opt = map.get(id);
    if (!opt) {
      throw new Error(`exam-interface-theme-presets: missing THEME_OPTIONS entry for "${id}"`);
    }
    return opt;
  });
}

export function normalizeExamInterfaceThemeId(id: string | null | undefined): ExamInterfaceThemeId {
  if (id && (EXAM_INTERFACE_THEME_IDS as readonly string[]).includes(id)) {
    return id as ExamInterfaceThemeId;
  }
  return "plum-mist";
}
