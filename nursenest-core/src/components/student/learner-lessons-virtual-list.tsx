import Link from "next/link";
import { LessonCard, LessonCardChip } from "@/components/student/product/lesson-card";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export type LearnerLessonVirtualRow = {
  id: string;
  title: string;
  summary: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  bodySystem?: string | null;
  pathwayMeta?: { pathwayId: string; slug: string };
};

export function LearnerLessonsVirtualList({
  lessons,
  progressByRowId,
  openLessonCta,
  activeTopic,
  activeTopicSlug,
  onTopicSelect,
  onTopicPrefetch,
}: {
  lessons: LearnerLessonVirtualRow[];
  progressByRowId: Record<string, PathwayLessonProgressStatus>;
  openLessonCta: string;
  activeTopic?: string | null;
  activeTopicSlug?: string | null;
  onTopicSelect?: (topic: { topic: string; topicSlug?: string | null }) => void;
  onTopicPrefetch?: (topic: { topic: string; topicSlug?: string | null }) => void;
}) {
  if (lessons.length === 0) return null;

  return (
    <div
      className="nn-premium-lessons-app-list rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_22%,var(--semantic-surface))] px-4 pb-5 pt-4 shadow-[var(--semantic-shadow-soft)] sm:px-5 sm:pb-6 sm:pt-5"
      data-nn-premium-lessons-hub-body=""
    >
      <div className="grid gap-4 sm:gap-[1.125rem]">
        {lessons.map((lesson) => {
          const topic = lesson.topic?.trim() || "";
          const topicSlug = lesson.topicSlug?.trim() || "";
          const topicActive =
            (topicSlug && activeTopicSlug === topicSlug.toLowerCase()) ||
            (!topicSlug && topic && activeTopic?.toLowerCase() === topic.toLowerCase());
          const chips =
            topic || lesson.bodySystem?.trim() ? (
              <>
                {topic ? (
                  onTopicSelect ? (
                    <button
                      type="button"
                      onClick={() => onTopicSelect({ topic, topicSlug: topicSlug || null })}
                      onFocus={() => onTopicPrefetch?.({ topic, topicSlug: topicSlug || null })}
                      onMouseEnter={() => onTopicPrefetch?.({ topic, topicSlug: topicSlug || null })}
                      aria-pressed={topicActive}
                      data-active={topicActive}
                      className="max-w-full rounded-full text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]"
                    >
                      <LessonCardChip
                        variant="category"
                        className={topicActive ? "ring-1 ring-[color-mix(in_srgb,var(--semantic-info)_45%,transparent)]" : ""}
                      >
                        {topic}
                      </LessonCardChip>
                    </button>
                  ) : (
                    <LessonCardChip variant="category">{topic}</LessonCardChip>
                  )
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
