"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  emitPathwayLessonProgress,
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { SuccessLeaf } from "@/components/ui/success-leaf";
import { practiceTestsWeakFocusHref } from "@/lib/learner/study-loop-recommendations";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import type { MarketingPathwayLessonActionsClientProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

/** Ids + flags only — no lesson bodies (contract: `marketing-pathway-lesson-client-contract.ts`). */
export function PathwayLessonActions({
  pathwayId,
  lessonSlug,
  topicCode,
  topicLabel,
  userId,
  canMarkComplete,
  initialProgress = "not_started",
  catAdaptiveAvailable,
  allLessonsHrefOverride,
}: MarketingPathwayLessonActionsClientProps) {
  const { t } = useMarketingI18n();
  const [progress, setProgress] = useState<PathwayLessonProgressStatus>(initialProgress);
  const [pending, setPending] = useState<"idle" | "complete" | "uncomplete">("idle");
  const [error, setError] = useState(false);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const d = (e as CustomEvent<PathwayLessonProgressEventDetail>).detail;
      if (d?.pathwayId === pathwayId && d?.lessonSlug === lessonSlug) setProgress(d.status);
    };
    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
  }, [pathwayId, lessonSlug]);

  async function markComplete() {
    if (!userId || !canMarkComplete) return;
    setPending("complete");
    setError(false);
    try {
      const res = await fetch("/api/lessons/pathway-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathwayId, lessonSlug, action: "complete" }),
      });
      if (!res.ok) throw new Error("save_failed");
      setProgress("completed");
      emitPathwayLessonProgress({ pathwayId, lessonSlug, status: "completed", source: "manual" });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
      }
    } catch {
      setError(true);
    } finally {
      setPending("idle");
    }
  }

  async function markUncomplete() {
    if (!userId || !canMarkComplete) return;
    setPending("uncomplete");
    setError(false);
    try {
      const res = await fetch("/api/lessons/pathway-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathwayId, lessonSlug, action: "uncomplete" }),
      });
      if (!res.ok) throw new Error("save_failed");
      setProgress("in_progress");
      emitPathwayLessonProgress({ pathwayId, lessonSlug, status: "in_progress", source: "manual" });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
      }
    } catch {
      setError(true);
    } finally {
      setPending("idle");
    }
  }

  const topicCodeParam = topicCode?.trim() ? `&topicCode=${encodeURIComponent(topicCode.trim())}` : "";
  const topicLabelParam = topicLabel?.trim() ? `&topic=${encodeURIComponent(topicLabel.trim())}` : "";
  const qbHref = `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}${topicCodeParam}${topicLabelParam}&preset=topic_drill`;
  const catWeakHref = practiceTestsWeakFocusHref(pathwayId);
  const showCatCta = catAdaptiveAvailable;
  const pathwayDef = getExamPathwayById(pathwayId);
  const allLessonsHref =
    allLessonsHrefOverride?.trim() ||
    (pathwayDef ? marketingPathwayLessonsIndexPath(pathwayDef) : "/lessons");
  const flashcardsHref = topicCode?.trim()
    ? `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}&topicCode=${encodeURIComponent(topicCode.trim())}`
    : `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`;

  const saving = pending !== "idle";

  return (
    <section
      className="mt-8 border-t border-[var(--semantic-border-soft)] pt-6"
      aria-label="Continue studying"
    >
      <p className="nn-lesson-module-eyebrow">{t("learner.lessons.detail.studyActionsEyebrow")}</p>

      <div className="mt-3 flex flex-col gap-3">
        <Link
          href={qbHref}
          data-testid="pathway-lesson-cta-practice-topic"
          data-nn-pathway-id={pathwayId}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--semantic-brand)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--text-on-dark)] shadow-sm transition hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:w-auto sm:min-w-[12rem]"
        >
          {t("learner.studyLoop.practiceThisTopicCta")}
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
          <Link
            href={flashcardsHref}
            data-testid="pathway-lesson-cta-flashcards"
            data-nn-pathway-id={pathwayId}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_94%,var(--semantic-surface)_6%)] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:min-w-[10rem] sm:flex-none"
          >
            {t("learner.studyLoop.sameTopicFlashcards")}
          </Link>
          {showCatCta ? (
            <Link
              href={catWeakHref}
              data-testid="pathway-lesson-cta-cat-practice"
              data-nn-pathway-id={pathwayId}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-chart-2)_12%)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--theme-page-bg))] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-chart-2)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:min-w-[10rem] sm:flex-none"
            >
              {t("learner.studyLoop.catFromLesson")}
            </Link>
          ) : null}
          <Link
            href={allLessonsHref}
            data-testid="pathway-lesson-cta-all-lessons"
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-page-bg)_94%,var(--semantic-surface)_6%)] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:min-w-[10rem] sm:flex-none"
          >
            {t("learner.lessons.detail.allLessons")}
          </Link>
        </div>

        {!userId ? (
          <p className="text-sm text-muted">
            <Link href="/login" className="nn-marketing-body-sm font-semibold text-primary underline">
              {t("learner.studyLoop.signIn")}
            </Link>{" "}
            {t("learner.studyLoop.signInProgressHint")}
          </p>
        ) : canMarkComplete ? (
          <div className="mt-1 flex flex-col gap-1 border-t border-dashed border-[var(--semantic-border-soft)] pt-4 sm:flex-row sm:items-center sm:gap-3">
            {progress === "completed" ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => void markUncomplete()}
                className="inline-flex min-h-9 items-center justify-center self-start rounded-md px-2 text-sm font-medium text-[var(--theme-muted-text)] underline-offset-2 transition hover:text-[var(--theme-heading-text)] hover:underline disabled:opacity-60"
              >
                <SuccessLeaf show size={16} />
                <span className="ml-1.5">
                  {pending === "uncomplete" ? t("learner.studyLoop.markStudiedUndoSaving") : t("learner.studyLoop.markStudiedUndo")}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={() => void markComplete()}
                className="inline-flex min-h-9 items-center justify-center self-start rounded-md border border-[var(--semantic-border-soft)] bg-transparent px-3 py-1.5 text-sm font-medium text-[var(--theme-muted-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] hover:text-[var(--theme-heading-text)] disabled:opacity-60"
              >
                {pending === "complete" ? t("learner.studyLoop.markStudiedSaving") : t("learner.studyLoop.markStudied")}
              </button>
            )}
            {error ? <span className="text-xs text-amber-800">{t("learner.studyLoop.markStudiedError")}</span> : null}
          </div>
        ) : (
          <p className="text-sm text-muted">{t("learner.studyLoop.subscribePathwayHint")}</p>
        )}
      </div>
    </section>
  );
}
