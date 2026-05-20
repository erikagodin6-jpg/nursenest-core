import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type LessonDifficulty = "Core" | "Intermediate" | "Advanced";

function lessonWordCount(lesson: PathwayLessonRecord): number {
  return lesson.sections.reduce((total, section) => {
    const words = section.body.trim().split(/\s+/).filter(Boolean).length;
    return total + words;
  }, 0);
}

export function lessonEstimatedDurationLabel(lesson: PathwayLessonRecord): string {
  const words = lessonWordCount(lesson);
  const minutes = Math.max(4, Math.min(18, Math.round(words / 170) || 4));
  return `${minutes} min`;
}

export function lessonDifficultyLabel(lesson: PathwayLessonRecord): LessonDifficulty {
  const words = lessonWordCount(lesson);
  const sections = lesson.sections.length;

  if (lesson.examRelevance === "specialty" || words >= 1300 || sections >= 7) {
    return "Advanced";
  }
  if (words >= 800 || sections >= 5 || lesson.examRelevance === "high_yield") {
    return "Intermediate";
  }
  return "Core";
}
