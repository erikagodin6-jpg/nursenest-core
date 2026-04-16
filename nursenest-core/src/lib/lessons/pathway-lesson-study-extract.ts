import type { PathwayLessonExamFocus, PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

function clipLine(text: string, max = 200): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function examFocusToLines(examFocus: PathwayLessonExamFocus): string[] {
  const out: string[] = [];
  if (examFocus.howTested?.trim()) {
    out.push(`How tested: ${clipLine(examFocus.howTested, 220)}`);
  }
  if (examFocus.prioritizationCues?.trim()) {
    out.push(`Prioritization: ${clipLine(examFocus.prioritizationCues, 180)}`);
  }
  return out;
}

/**
 * High-yield exam cues from `exam_focus` sections — short lines for the study rail (no full article bodies).
 */
export function extractExamFocusHighYieldLines(lesson: PathwayLessonRecord, maxLines = 6): string[] {
  const lines: string[] = [];
  for (const s of lesson.sections) {
    if (s.kind !== "exam_focus" || !s.examFocus) continue;
    lines.push(...examFocusToLines(s.examFocus));
    if (lines.length >= maxLines) break;
  }
  return lines.slice(0, maxLines);
}

/** First-line / short bullets from non–exam_focus sections when no structured exam_focus exists (retention fallback). */
export function extractSecondaryExamContextLines(sections: PathwayLessonSection[], maxLines = 3): string[] {
  const prefer = new Set<PathwayLessonSection["kind"]>(["exam_relevance", "exam_tips", "clinical_pearls"]);
  const out: string[] = [];
  for (const s of sections) {
    if (prefer.has(s.kind) && typeof s.body === "string") {
      const one = s.body.trim().split(/\n+/)[0]?.trim();
      if (one) out.push(clipLine(one, 160));
    }
    if (out.length >= maxLines) break;
  }
  return out;
}
