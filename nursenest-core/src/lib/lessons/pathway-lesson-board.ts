import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  getPathwayLessonBoardConfig,
  type PathwayLessonBoardIconKey,
  type PathwayLessonBoardSectionConfig,
} from "@/lib/lessons/pathway-lesson-board-config";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type PathwayLessonBoardRow = {
  slug: string;
  title: string;
  status: PathwayLessonProgressStatus;
  durationLabel: string;
  difficultyLabel: string;
};

export type PathwayLessonBoardSection = {
  id: string;
  label: string;
  icon: PathwayLessonBoardIconKey;
  accentVar: string;
  rows: PathwayLessonBoardRow[];
  visibleRows: PathwayLessonBoardRow[];
  overflowCount: number;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export function buildPathwayLessonBoard({
  pathway,
  lessons,
  progressMap,
}: {
  pathway: Pick<ExamPathwayDefinition, "roleTrack">;
  lessons: PathwayLessonRecord[];
  progressMap: Record<string, PathwayLessonProgressStatus>;
}): { sections: PathwayLessonBoardSection[] } {
  const config = getPathwayLessonBoardConfig(pathway);
  const sectionBuckets = new Map<string, PathwayLessonBoardSectionConfig>();
  const sectionRows = new Map<string, PathwayLessonBoardRow[]>();

  for (const section of config.sections) {
    sectionBuckets.set(section.id, section);
    sectionRows.set(section.id, []);
  }

  for (const lesson of lessons) {
    const section = matchLessonToBoardSection(lesson, config.sections, config.fallbackSectionId);
    const rows = sectionRows.get(section.id);
    if (!rows) continue;
    rows.push({
      slug: lesson.slug,
      title: lesson.title,
      status: progressMap[lesson.slug] ?? "not_started",
      durationLabel: estimateLessonBoardDuration(lesson),
      difficultyLabel: deriveLessonBoardDifficulty(lesson),
    });
  }

  const sections: PathwayLessonBoardSection[] = [];
  for (const section of config.sections) {
    const rows = sectionRows.get(section.id) ?? [];
    if (rows.length === 0) continue;
    const completedCount = rows.filter((row) => row.status === "completed").length;
    const totalCount = rows.length;
    sections.push({
      id: section.id,
      label: section.label,
      icon: section.icon,
      accentVar: section.accentVar,
      rows,
      visibleRows: rows.slice(0, config.defaultVisibleRows),
      overflowCount: Math.max(0, rows.length - config.defaultVisibleRows),
      completedCount,
      totalCount,
      progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    });
  }

  return { sections };
}

function matchLessonToBoardSection(
  lesson: PathwayLessonRecord,
  sections: PathwayLessonBoardSectionConfig[],
  fallbackSectionId: string,
): PathwayLessonBoardSectionConfig {
  const fallback = sections.find((section) => section.id === fallbackSectionId) ?? sections[0];
  if (!fallback) {
    throw new Error("Board config must define at least one section.");
  }

  const haystack = normalizeLessonBoardSearchText(lesson);
  let bestMatch = fallback;
  let bestScore = 0;

  for (const section of sections) {
    let score = 0;
    for (const keyword of section.keywords) {
      if (haystack.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = section;
    }
  }

  return bestMatch;
}

function normalizeLessonBoardSearchText(lesson: PathwayLessonRecord): string {
  return [
    lesson.title,
    lesson.topic,
    lesson.topicSlug,
    lesson.system,
    lesson.bodySystem,
    lesson.seoDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function estimateLessonBoardDuration(lesson: PathwayLessonRecord): string {
  const sectionCount = lesson.sections.length || lesson.previewSectionCount || 1;
  const minutes = Math.max(6, Math.min(22, sectionCount * 4));
  return `${minutes} min`;
}

function deriveLessonBoardDifficulty(lesson: PathwayLessonRecord): string {
  const sectionCount = lesson.sections.length || lesson.previewSectionCount || 1;
  if (sectionCount >= 6) return "Advanced";
  if (sectionCount >= 4) return "Core";
  return "Quick";
}
