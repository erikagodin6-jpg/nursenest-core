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
      return "Pre/post lesson tests are off, so this lesson opens straight into the content.";
    }
    if (hasPre && hasPost) {
      return postTestReady
        ? "Pre-test ran before the lesson; your post-test is ready below."
        : "Pre-test runs first, then the lesson. Complete the lesson to unlock the post-test.";
    }
    if (hasPre) return "Pre-test runs before the lesson content.";
    if (hasPost) {
      return postTestReady
        ? "Post-test is active below."
        : "Post-test unlocks after you complete the lesson.";
    }
    return "No lesson tests are attached to this lesson yet.";
  }, [enabled, hasPost, hasPre, postTestReady]);

  if (!hasAnyAssessments) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      <section className="mx-auto max-w-5xl rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_94%,var(--semantic-panel-warm)_6%)] p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-text-secondary)]">
              Lesson checks
            </p>
            <h2 className="mt-1.5 text-lg font-semibold text-[var(--theme-heading-text)]">Pre/post lesson tests</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--theme-muted-text)]">{statusCopy}</p>
          </div>
          {assessmentsEnabled ? (
            <div
              className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-1"
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
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  enabled
                    ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
                    : "text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]"
                }`}
              >
                Tests On
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
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !enabled
                    ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
                    : "text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]"
                }`}
              >
                Tests Off
              </button>
            </div>
          ) : (
            <p className="max-w-sm text-sm leading-6 text-[var(--theme-muted-text)]">
              Pre/post lesson quizzes are off in your study settings.
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
