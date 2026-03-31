import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

function firstSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s+/)[0];
  return (cut ?? t).trim();
}

function bulletsFromSection(s: PathwayLessonSection): string[] {
  const out: string[] = [];
  const head = s.heading?.trim();
  const one = firstSentence(typeof s.body === "string" ? s.body : "");
  if (head && one) out.push(`${head}: ${one}`);
  else if (one) out.push(one);
  return out;
}

/** Condensed lines for revision (subscriber UI). */
export function buildQuickReviewBullets(lesson: PathwayLessonRecord): string[] {
  const lines: string[] = [];
  for (const s of lesson.sections) {
    if (s.kind === "exam_focus" && s.examFocus) {
      const { howTested, commonTraps, prioritizationCues } = s.examFocus;
      if (howTested) lines.push(`How tested: ${firstSentence(howTested)}`);
      if (commonTraps) lines.push(`Traps: ${firstSentence(commonTraps)}`);
      if (prioritizationCues) lines.push(`Prioritize: ${firstSentence(prioritizationCues)}`);
      continue;
    }
    lines.push(...bulletsFromSection(s));
  }
  return lines.filter(Boolean).slice(0, 24);
}
