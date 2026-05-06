import { CANONICAL_STUDY_CATEGORIES, type CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

const CANON = new Set<string>(CANONICAL_STUDY_CATEGORIES.map((c) => c.id));

export function parseStudyToolsCategoryParam(raw: string | null | undefined): CanonicalStudyCategoryId[] {
  if (!raw?.trim()) return [];
  const out: CanonicalStudyCategoryId[] = [];
  for (const p of raw.split(",")) {
    const id = p.trim();
    if (CANON.has(id)) out.push(id as CanonicalStudyCategoryId);
  }
  return out;
}
