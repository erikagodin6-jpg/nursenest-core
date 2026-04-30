/**
 * Derives a **pathway catalog lesson slug** from flashcard DB fields without duplicating lesson bodies.
 * `lessonId` may store a slug for pipeline-authored cards; `sourceKey` carries `lesson:` / `lessonlink:v1|…` tokens.
 */

function looksLikeTechnicalId(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (/^c[a-z0-9]{20,}$/i.test(v)) return true;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) return true;
  return false;
}

/**
 * Returns a catalog `slug` suitable for `/app/lessons?lessonSlug=` deep links, or null when unknown.
 */
export function pathwayLessonSlugFromFlashcardFields(input: {
  lessonId?: string | null;
  sourceKey?: string | null;
}): string | null {
  const lid = typeof input.lessonId === "string" ? input.lessonId.trim() : "";
  if (lid && !looksLikeTechnicalId(lid)) return lid;

  const sk = typeof input.sourceKey === "string" ? input.sourceKey.trim() : "";
  if (!sk) return null;

  if (sk.startsWith("lessonlink:v1|")) {
    const parts = sk.split("|");
    const slug = parts[2]?.trim();
    return slug || null;
  }

  if (sk.startsWith("lesson:")) {
    const parts = sk.split(":").map((p) => p.trim()).filter(Boolean);
    // lesson:{slug}:{section}:{pos}
    if (parts.length >= 2 && parts[1] && !parts[1].startsWith("v")) return parts[1];
  }

  return null;
}
