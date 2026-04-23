"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Layers, Library, LineChart } from "lucide-react";
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
    <section className="lv-lesson-actions" aria-label="Continue studying">
      <p className="nn-lesson-module-eyebrow">{t("learner.lessons.detail.studyActionsEyebrow")}</p>

      <div className="lv-lesson-actions__primary">
        <Link
          href={qbHref}
          data-testid="pathway-lesson-cta-practice-topic"
          data-nn-pathway-id={pathwayId}
          className="lv-btn-primary w-full sm:w-auto sm:min-w-48"
        >
          <ClipboardList className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
          {t("learner.studyLoop.practiceThisTopicCta")}
        </Link>
      </div>

      <div className="lv-lesson-actions__secondary">
        <Link
          href={flashcardsHref}
          data-testid="pathway-lesson-cta-flashcards"
          data-nn-pathway-id={pathwayId}
          className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none"
        >
          <Layers className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
          {t("learner.studyLoop.sameTopicFlashcards")}
        </Link>
        {showCatCta ? (
          <Link
            href={catWeakHref}
            data-testid="pathway-lesson-cta-cat-practice"
            data-nn-pathway-id={pathwayId}
            className="lv-btn-secondary lv-lesson-actions__btn--cool flex-1 sm:min-w-40 sm:flex-none"
          >
            <LineChart className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
            {t("learner.studyLoop.catFromLesson")}
          </Link>
        ) : null}
        <Link href={allLessonsHref} data-testid="pathway-lesson-cta-all-lessons" className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none">
          <Library className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
          {t("learner.lessons.detail.allLessons")}
        </Link>
      </div>

      {!userId ? (
        <p className="mt-3 text-sm text-lv-text-secondary">
          <Link href="/login" className="nn-marketing-body-sm font-semibold text-lv-primary-500 underline">
            {t("learner.studyLoop.signIn")}
          </Link>{" "}
          {t("learner.studyLoop.signInProgressHint")}
        </p>
      ) : canMarkComplete ? (
        <div className="lv-lesson-actions__meta flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            {progress === "completed" ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => void markUncomplete()}
                className="lv-lesson-actions__meta-btn"
              >
                <SuccessLeaf show size={16} />
                <span className="ml-1.5">
                  {pending === "uncomplete" ? t("learner.studyLoop.markStudiedUndoSaving") : t("learner.studyLoop.markStudiedUndo")}
                </span>
              </button>
            ) : (
              <button type="button" disabled={saving} onClick={() => void markComplete()} className="lv-lesson-actions__meta-btn lv-lesson-actions__meta-btn--outline">
                {pending === "complete" ? t("learner.studyLoop.markStudiedSaving") : t("learner.studyLoop.markStudied")}
              </button>
            )}
            {error ? <span className="lv-lesson-actions__meta-error">{t("learner.studyLoop.markStudiedError")}</span> : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-lv-text-secondary">{t("learner.studyLoop.subscribePathwayHint")}</p>
        )}
    </section>
  );
}
