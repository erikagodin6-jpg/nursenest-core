import {
  CANONICAL_STUDY_CATEGORIES,
  isCanonicalStudyCategoryId,
  type CanonicalStudyCategoryId,
} from "@/lib/study/normalize-study-category";

const CANONICAL_ORDER = new Map(CANONICAL_STUDY_CATEGORIES.map((category, index) => [category.id, index]));

export function normalizeFlashcardsHubSystemSelection(
  ids: readonly string[],
): CanonicalStudyCategoryId[] {
  const selected = new Set<CanonicalStudyCategoryId>();
  for (const id of ids) {
    if (isCanonicalStudyCategoryId(id)) selected.add(id);
  }
  return [...selected].sort((a, b) => (CANONICAL_ORDER.get(a) ?? 999) - (CANONICAL_ORDER.get(b) ?? 999));
}

export function toggleFlashcardsHubSystemSelection(
  current: readonly string[],
  systemId: string,
): CanonicalStudyCategoryId[] {
  const next = new Set(normalizeFlashcardsHubSystemSelection(current));
  if (!isCanonicalStudyCategoryId(systemId)) return [...next];
  if (next.has(systemId)) {
    next.delete(systemId);
  } else {
    next.add(systemId);
  }
  return normalizeFlashcardsHubSystemSelection([...next]);
}
