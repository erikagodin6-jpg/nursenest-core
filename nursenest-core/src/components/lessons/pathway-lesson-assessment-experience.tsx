"use client";

import { useEffect, useMemo, useState } from "react";
import { PathwayLessonLegacyStudyShell } from "@/components/lessons/pathway-lesson-legacy-study-shell";
import {
  readLearnerStudyDefaults,
  writeLearnerStudyDefaults,
} from "@/lib/student/learner-study-defaults";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import type { MarketingPathwayLessonAssessmentShellProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

function storageUserId(userId: string): string {
  const trimmed = userId.trim();
  return trimmed.length > 0 ? trimmed : "public";
}

/**
 * Marketing pathway lesson assessments — matches learner app flow:
 * controls → **pre-test (before article)** → lesson content → post-test (after completion).
 */
export function PathwayLessonAssessmentExperience({
  userId,
  pathwayId,
  lessonSlug,
  initialProgress,
  preTest,
  postTest,
  fullAccess,
  assessmentsEnabled = true,
  sectionAnchors,
  children,
}: MarketingPathwayLessonAssessmentShellProps) {
  const hasPre = Boolean(preTest?.length);
  const hasPost = Boolean(postTest?.length);
  const hasAnyAssessments = hasPre || hasPost;
  const [enabled, setEnabled] = useState(true);
  const [progress, setProgress] = useState<PathwayLessonProgressStatus>(initialProgress);
  const effectiveUserId = storageUserId(userId);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    if (!hasAnyAssessments) return;
    setEnabled(assessmentsEnabled);
  }, [assessmentsEnabled, effectiveUserId, hasAnyAssessments]);

  useEffect(() => {
    if (!hasAnyAssessments) return;
    const onEvt = (event: Event) => {
      const detail = (event as CustomEvent<PathwayLessonProgressEventDetail>).detail;
      if (detail?.pathwayId === pathwayId && detail.lessonSlug === lessonSlug) {
        setProgress(detail.status);
      }
    };

    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
  }, [hasAnyAssessments, lessonSlug, pathwayId]);

  const postTestReady = progress === "completed";
  const statusCopy = useMemo(() => {
    if (!enabled) {
      return "Lesson checks are off — you are reading without the readiness and reinforcement blocks.";
    }
    if (hasPre && hasPost) {
      return postTestReady
        ? "Reinforcement is open at the bottom of the lesson when you are ready."
        : "Finish reading, then mark studied to unlock reinforcement.";
    }
    if (hasPre) return "Readiness runs first; then continue through the lesson.";
    if (hasPost) {
      return postTestReady
        ? "Reinforcement is open below."
        : "Mark studied after reading to unlock reinforcement.";
    }
    return "No lesson checks are attached yet.";
  }, [enabled, hasPost, hasPre, postTestReady]);

  if (!hasAnyAssessments) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-page-bg)_96%,var(--semantic-panel-muted)_4%)] px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="nn-lesson-module-eyebrow">Lesson checks</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">{statusCopy}</p>
          </div>
          {assessmentsEnabled ? (
            <div
              className="inline-flex shrink-0 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-0.5"
              role="tablist"
              aria-label="Lesson assessments"
            >
              <button
                type="button"
                role="tab"
                aria-selected={enabled ? "true" : "false"}
                onClick={() => {
                  const current = readLearnerStudyDefaults(effectiveUserId);
                  const next = {
                    ...current,
                    lessonAssessments: { enabled: true },
                  };
                  writeLearnerStudyDefaults(effectiveUserId, next);
                  setEnabled(true);
                }}
                className={`min-h-9 rounded-[0.375rem] px-3 py-1.5 text-xs font-semibold transition sm:min-h-10 sm:px-3.5 sm:text-sm ${
                  enabled
                    ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
                    : "text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]"
                }`}
              >
                On
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!enabled ? "true" : "false"}
                onClick={() => {
                  const current = readLearnerStudyDefaults(effectiveUserId);
                  const next = {
                    ...current,
                    lessonAssessments: { enabled: false },
                  };
                  writeLearnerStudyDefaults(effectiveUserId, next);
                  setEnabled(false);
                }}
                className={`min-h-9 rounded-[0.375rem] px-3 py-1.5 text-xs font-semibold transition sm:min-h-10 sm:px-3.5 sm:text-sm ${
                  !enabled
                    ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
                    : "text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]"
                }`}
              >
                Off
              </button>
            </div>
          ) : (
            <p className="max-w-sm text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
              Lesson checks are disabled in study settings.
            </p>
          )}
        </div>
      </section>

      {enabled && hasAnyAssessments ? (
        <PathwayLessonLegacyStudyShell
          pathwayId={pathwayId}
          lessonSlug={lessonSlug}
          initialProgress={progress}
          preTest={hasPre ? preTest : undefined}
          postTest={hasPost ? postTest : undefined}
          fullAccess={fullAccess}
          postTestReady={postTestReady}
          sectionAnchors={sectionAnchors}
        >
          {children}
        </PathwayLessonLegacyStudyShell>
      ) : (
        children
      )}
    </div>
  );
}
