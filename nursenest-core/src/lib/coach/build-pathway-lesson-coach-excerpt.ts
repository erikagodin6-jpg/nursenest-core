import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const MAX_SECTIONS = 3;
const MAX_BODY_PER_SECTION = 1800;
const MAX_HEADING_CHARS = 200;
const MAX_TOTAL_CHARS = 6000;

/**
 * Bounded text for Study Coach `CoachContext.content` on pathway lesson pages.
 * Avoids sending full lesson JSON to the client or API.
 */
export function buildPathwayLessonCoachExcerpt(sections: PathwayLessonSection[]): string {
  if (!sections.length) return "";

  const chunks: string[] = [];
  let total = 0;

  for (const s of sections.slice(0, MAX_SECTIONS)) {
    const heading = (s.heading?.trim() || "Section").slice(0, MAX_HEADING_CHARS);
    let body = typeof s.body === "string" ? s.body.trim() : "";
    if (body.length > MAX_BODY_PER_SECTION) {
      body = `${body.slice(0, MAX_BODY_PER_SECTION)}\n[truncated]`;
    }
    const piece = `## ${heading}\n\n${body}`;
    const nextLen = total + (chunks.length ? 2 : 0) + piece.length;
    if (nextLen > MAX_TOTAL_CHARS) {
      const budget = MAX_TOTAL_CHARS - total - (chunks.length ? 2 : 0) - 20;
      if (budget > 80) {
        chunks.push(`${piece.slice(0, budget)}\n[truncated]`);
      }
      break;
    }
    chunks.push(piece);
    total = nextLen;
  }

  return chunks.join("\n\n").trim();
}
