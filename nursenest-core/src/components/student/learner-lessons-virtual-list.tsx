import Link from "next/link";
import { LessonCard, LessonCardChip } from "@/components/student/product/lesson-card";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export type LearnerLessonVirtualRow = {
  id: string;
  title: string;
  summary: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  pathwayMeta?: { pathwayId: string; slug: string };
};

export function LearnerLessonsVirtualList({
  lessons,
  progressByRowId,
  openLessonCta,
}: {
  lessons: LearnerLessonVirtualRow[];
  progressByRowId: Record<string, PathwayLessonProgressStatus>;
  openLessonCta: string;
}) {
  if (lessons.length === 0) return null;

  return (
    <div
      className="nn-premium-lessons-app-list rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_22%,var(--semantic-surface))] px-4 pb-5 pt-4 shadow-[var(--semantic-shadow-soft)] sm:px-5 sm:pb-6 sm:pt-5"
      data-nn-premium-lessons-hub-body=""
    >
      <div className="grid gap-4 sm:gap-[1.125rem]">
        {lessons.map((lesson) => {
          const chips =
            lesson.topic?.trim() || lesson.bodySystem?.trim() ? (
              <>
                {lesson.topic?.trim() ? (
                  <LessonCardChip variant="category">{lesson.topic.trim()}</LessonCardChip>
                ) : null}
                {lesson.bodySystem?.trim() ? (
                  <LessonCardChip variant="body">{lesson.bodySystem.trim()}</LessonCardChip>
                ) : null}
              </>
            ) : undefined;

          const href = `/app/lessons/${encodeURIComponent(lesson.id)}`;

          return (
            <LessonCard
              key={lesson.id}
              href={href}
              title={cleanLessonTitleForDisplay(lesson.title)}
              summary={lesson.summary}
              chips={chips}
              progressStatus={
                lesson.pathwayMeta ? (progressByRowId[lesson.id] ?? "not_started") : undefined
              }
              footer={
                <Link
                  href={href}
                  className="inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
                >
                  {openLessonCta}
                </Link>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
