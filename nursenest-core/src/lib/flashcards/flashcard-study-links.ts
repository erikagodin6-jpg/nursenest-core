export type ResolvedFlashcardLessonLink = {
  href: string;
  isExactLesson: boolean;
  label: "Review Lesson" | "Browse Related Lessons";
};

function looksLikeLessonId(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (/^c[a-z0-9]{20,}$/i.test(v)) return true; // cuid/cuid2-like ids
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) return true; // uuid
  return false;
}

export function resolveFlashcardRelatedLessonLink(input: {
  sourceKey?: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  pathwayId?: string | null;
}): ResolvedFlashcardLessonLink {
  const sourceKey = input.sourceKey?.trim() ?? "";
  if (sourceKey.startsWith("lesson:")) {
    const parts = sourceKey.split(":").map((part) => part.trim()).filter(Boolean);
    const lessonRef = parts[1] ?? "";
    if (looksLikeLessonId(lessonRef)) {
      return {
        href: `/app/lessons/${encodeURIComponent(lessonRef)}`,
        isExactLesson: true,
        label: "Review Lesson",
      };
    }
    const embeddedIdPart = parts.find((part) => part.startsWith("id="));
    const embeddedId = embeddedIdPart?.slice(3).trim() ?? "";
    if (looksLikeLessonId(embeddedId)) {
      return {
        href: `/app/lessons/${encodeURIComponent(embeddedId)}`,
        isExactLesson: true,
        label: "Review Lesson",
      };
    }
    if (lessonRef) {
      const params = new URLSearchParams();
      if (input.pathwayId?.trim()) params.set("pathwayId", input.pathwayId.trim());
      params.set("topicSlug", lessonRef);
      return {
        href: `/app/lessons?${params.toString()}`,
        isExactLesson: false,
        label: "Browse Related Lessons",
      };
    }
  }

  const params = new URLSearchParams();
  if (input.pathwayId?.trim()) params.set("pathwayId", input.pathwayId.trim());
  if (input.topicSlug?.trim()) params.set("topicSlug", input.topicSlug.trim());
  else if (input.topic?.trim()) params.set("topic", input.topic.trim());
  const query = params.toString();
  return {
    href: query ? `/app/lessons?${query}` : "/app/lessons",
    isExactLesson: false,
    label: "Browse Related Lessons",
  };
}
