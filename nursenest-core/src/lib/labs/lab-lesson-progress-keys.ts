import type { LabCategorySlug, LabTrack } from "@/lib/labs/labs-engine";

/** Stable Progress.lessonId for Labs workstation lessons (no schema change). */
export function syntheticLabLessonId(track: LabTrack, category: LabCategorySlug, slug: string): string {
  return `labs:${track}:${category}:${slug}`;
}

export function parseSyntheticLabLessonId(
  lessonId: string,
): { track: LabTrack; category: LabCategorySlug; slug: string } | null {
  const parts = lessonId.split(":");
  if (parts.length !== 4 || parts[0] !== "labs") return null;
  const track = parts[1];
  const category = parts[2];
  const slug = parts.slice(3).join(":");
  if (!track || !category || !slug) return null;
  if (!["rn", "pn", "np", "allied"].includes(track)) return null;
  return { track: track as LabTrack, category: category as LabCategorySlug, slug };
}
