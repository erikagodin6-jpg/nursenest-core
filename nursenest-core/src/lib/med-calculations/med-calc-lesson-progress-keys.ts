import type { MedCalcCategorySlug, MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";

/** Stable Progress.lessonId for Medication calculations workstation lessons (no schema change). */
export function syntheticMedCalcLessonId(
  track: MedCalcTrack,
  category: MedCalcCategorySlug,
  slug: string,
): string {
  return `med-calc:${track}:${category}:${slug}`;
}

export function parseSyntheticMedCalcLessonId(
  lessonId: string,
): { track: MedCalcTrack; category: MedCalcCategorySlug; slug: string } | null {
  const parts = lessonId.split(":");
  if (parts.length !== 4 || parts[0] !== "med-calc") return null;
  const track = parts[1];
  const category = parts[2];
  const slug = parts.slice(3).join(":");
  if (!track || !category || !slug) return null;
  if (!["rn", "pn", "np", "allied"].includes(track)) return null;
  return { track: track as MedCalcTrack, category: category as MedCalcCategorySlug, slug };
}
