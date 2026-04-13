export function resolveFlashcardRelatedLessonHref(input: {
  sourceKey?: string | null;
  topic?: string | null;
  pathwayId?: string | null;
}): string {
  const sourceKey = input.sourceKey?.trim() ?? "";
  if (sourceKey.startsWith("lesson:")) {
    const parts = sourceKey.split(":").map((part) => part.trim()).filter(Boolean);
    const lessonSlug = parts[1] ?? "";
    if (lessonSlug) {
      const params = new URLSearchParams();
      if (input.pathwayId?.trim()) params.set("pathwayId", input.pathwayId.trim());
      params.set("topic", lessonSlug.replace(/-/g, " "));
      return `/app/lessons?${params.toString()}`;
    }
  }

  const params = new URLSearchParams();
  if (input.pathwayId?.trim()) params.set("pathwayId", input.pathwayId.trim());
  if (input.topic?.trim()) params.set("topic", input.topic.trim());
  const query = params.toString();
  return query ? `/app/lessons?${query}` : "/app/lessons";
}
