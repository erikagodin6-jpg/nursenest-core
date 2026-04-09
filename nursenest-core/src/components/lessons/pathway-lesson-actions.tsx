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
import { practiceTestsWeakFocusHref } from "@/lib/learner/study-loop-recommendations";

export function PathwayLessonActions({
  pathwayId,
  lessonSlug,
  topicCode,
  topicLabel,
  userId,
  canMarkComplete,
  initialProgress = "not_started",
}: {
  pathwayId: string;
  lessonSlug: string;
  topicCode?: string | null;
  topicLabel?: string | null;
  userId: string;
  canMarkComplete: boolean;
  initialProgress?: PathwayLessonProgressStatus;
}) {
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
  const flashcardsHref = topicCode?.trim()
    ? `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}&topicCode=${encodeURIComponent(topicCode.trim())}`
    : `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`;

  const saving = pending !== "idle";

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-[var(--theme-separator)] pt-8 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={qbHref}
        data-testid="pathway-lesson-cta-practice-topic"
        data-nn-pathway-id={pathwayId}
        className="inline-flex justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
      >
        {t("learner.studyLoop.practiceThisTopicCta")}
      </Link>
      <Link
        href={flashcardsHref}
        data-testid="pathway-lesson-cta-flashcards"
        data-nn-pathway-id={pathwayId}
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        {t("learner.studyLoop.sameTopicFlashcards")}
      </Link>
      <Link
        href={catWeakHref}
        data-testid="pathway-lesson-cta-cat-practice"
        data-nn-pathway-id={pathwayId}
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        {t("learner.studyLoop.catFromLesson")}
      </Link>
      <Link
        href="/app/exams"
        data-testid="pathway-lesson-cta-timed-exams"
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        {t("learner.studyLoop.timedMocksHistory")}
      </Link>
      {!userId ? (
        <p className="text-sm text-muted">
          <Link href="/login" className="nn-marketing-body-sm font-semibold text-primary underline">
            {t("learner.studyLoop.signIn")}
          </Link>{" "}
          {t("learner.studyLoop.signInProgressHint")}
        </p>
      ) : canMarkComplete ? (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          {progress === "completed" ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void markUncomplete()}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              {pending === "uncomplete" ? t("learner.studyLoop.markStudiedUndoSaving") : t("learner.studyLoop.markStudiedUndo")}
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => void markComplete()}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
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
  );
}
