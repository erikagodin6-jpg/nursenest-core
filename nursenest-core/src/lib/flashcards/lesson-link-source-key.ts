/**
 * Parses `lessonlink:v1|…` {@link FlashcardStudySelectRow.sourceKey} tokens without pulling i18n / server-only graphs.
 */
export function parseLessonLinkSourceKey(sourceKey: string | null | undefined): {
  sectionKind: string;
  cardType: string;
  difficulty: number;
} | null {
  const sk = sourceKey ?? "";
  if (!sk.startsWith("lessonlink:v1|")) return null;
  const parts = sk.split("|");
  if (parts.length < 7) return null;
  const sectionKind = parts[3] ?? "";
  const cardType = parts[4] ?? "";
  const d = Number(parts[5]);
  return { sectionKind, cardType, difficulty: Number.isFinite(d) ? d : 3 };
}
