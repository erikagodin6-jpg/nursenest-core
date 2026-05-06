import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { bodyStringToContentJson } from "@/lib/prisma/content-item-body";
import type { PathwayLessonSection, PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

/**
 * Turn admin plain-text / markdown lesson body into `pathway_lessons.sections` JSON (intro/core blocks).
 */
export function pathwaySectionsFromPlainBody(body: string, title: string): PathwayLessonSection[] {
  const json = bodyStringToContentJson(body) as Prisma.JsonValue;
  return pathwaySectionsFromContentJson(json, title);
}

export function pathwaySectionsFromContentJson(
  content: Prisma.JsonValue,
  fallbackHeading: string,
): PathwayLessonSection[] {
  const kinds: PathwayLessonSectionKind[] = ["intro", "core"];
  if (content !== null && Array.isArray(content) && content.length > 0) {
    const sections: PathwayLessonSection[] = [];
    let i = 0;
    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const o = block as { sectionTitle?: unknown; content?: unknown };
      const heading =
        typeof o.sectionTitle === "string" && o.sectionTitle.trim()
          ? o.sectionTitle.trim()
          : i === 0
            ? fallbackHeading
            : `Section ${i + 1}`;
      const blockBody = typeof o.content === "string" ? o.content : String(o.content ?? "");
      const kind = i === 0 ? kinds[0]! : kinds[1]!;
      sections.push({ id: randomUUID(), heading, kind, body: blockBody });
      i += 1;
    }
    if (sections.length > 0) return sections;
  }
  const body =
    typeof content === "string"
      ? content
      : content !== null && typeof content === "object" && !Array.isArray(content)
        ? JSON.stringify(content)
        : "";
  return [{ id: randomUUID(), heading: fallbackHeading, kind: "intro", body }];
}

/** Flatten pathway section bodies into a single textarea-friendly string for admin editors. */
export function plainBodyFromPathwaySectionsJson(sections: unknown): string {
  if (!Array.isArray(sections)) return "";
  const parts: string[] = [];
  for (const s of sections) {
    if (!s || typeof s !== "object") continue;
    const body = typeof (s as { body?: unknown }).body === "string" ? (s as { body: string }).body : "";
    if (body.trim()) parts.push(body);
  }
  return parts.join("\n\n");
}
