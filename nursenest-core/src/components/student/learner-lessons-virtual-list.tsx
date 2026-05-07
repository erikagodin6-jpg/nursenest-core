"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: lessons.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 192,
    overscan: 6,
  });

  if (lessons.length === 0) return null;

  return (
    <div
      ref={parentRef}
      className="max-h-[min(70vh,880px)] overflow-auto rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_22%,var(--semantic-surface))] px-3 pb-5 pt-3 shadow-[var(--semantic-shadow-soft)] sm:px-4 sm:pb-6 sm:pt-4"
      style={{ contain: "strict" }}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((vRow) => {
          const lesson = lessons[vRow.index];
          if (!lesson) return null;
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
          return (
            <div
              key={lesson.id}
              ref={virtualizer.measureElement}
              data-index={vRow.index}
              className="absolute left-0 top-0 w-full pb-3.5 sm:pb-4"
              style={{ transform: `translateY(${vRow.start}px)` }}
            >
              <LessonCard
                href={`/app/lessons/${lesson.id}`}
                title={cleanLessonTitleForDisplay(lesson.title)}
                summary={lesson.summary}
                chips={chips}
                progressStatus={
                  lesson.pathwayMeta ? (progressByRowId[lesson.id] ?? "not_started") : undefined
                }
                footer={
                  <Link
                    href={`/app/lessons/${lesson.id}`}
                    className="inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
                  >
                    {openLessonCta}
                  </Link>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
