import type { Prisma } from "@prisma/client";

/**
 * Best-effort: first HTTPS image URL from `exam_questions.images` JSON for flashcard / study UIs.
 */
export function firstHttpsImageUrlFromExamQuestionImages(images: Prisma.JsonValue | null | undefined): string | null {
  if (images == null) return null;
  const tryString = (s: string): string | null => {
    const t = s.trim();
    if (!t.startsWith("https://") && !t.startsWith("http://")) return null;
    return t.startsWith("https://") ? t : null;
  };

  if (typeof images === "string") {
    return tryString(images);
  }

  if (Array.isArray(images)) {
    for (const entry of images) {
      if (typeof entry === "string") {
        const hit = tryString(entry);
        if (hit) return hit;
      }
      if (entry && typeof entry === "object") {
        const o = entry as Record<string, unknown>;
        const url =
          (typeof o.url === "string" && o.url) ||
          (typeof o.src === "string" && o.src) ||
          (typeof o.href === "string" && o.href) ||
          "";
        const hit = tryString(url);
        if (hit) return hit;
      }
    }
    return null;
  }

  if (typeof images === "object") {
    const o = images as Record<string, unknown>;
    const url =
      (typeof o.url === "string" && o.url) ||
      (typeof o.src === "string" && o.src) ||
      (typeof o.primary === "string" && o.primary) ||
      "";
    return tryString(url);
  }

  return null;
}
