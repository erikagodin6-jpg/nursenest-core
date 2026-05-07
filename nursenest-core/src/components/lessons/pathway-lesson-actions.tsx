"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, Layers, Library, LineChart, ListChecks } from "lucide-react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  emitPathwayLessonProgress,
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { SuccessLeaf } from "@/components/ui/success-leaf";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import type { MarketingPathwayLessonActionsClientProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import {
  buildLegacyLessonActionHrefs,
  buildLinkedLearningHrefPack,
} from "@/lib/lessons/pathway-lesson-linked-learning-hrefs";

function disabledCtaClass(kind: "primary" | "secondary") {
  const base =
    "inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold opacity-60";
  if (kind === "primary") {
    return `${base} border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] text-[var(--semantic-text-secondary)]`;
  }
  return `${base} border-[var(--semantic-border-soft)] bg-transparent text-[var(--semantic-text-secondary)]`;
}

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
  linkedLearningSignals = null,
  linkMode = "learner",
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

  const hrefBudget = useMemo(() => {
    const pathwayDef = getExamPathwayById(pathwayId);
    if (!pathwayId.trim()) {
      return { mode: "none" as const, pathwayDef, pack: null };
    }
    if (linkedLearningSignals) {
      return {
        mode: "linked" as const,
        pathwayDef,
        pack: buildLinkedLearningHrefPack({
          pathwayId,
          pathwayDef,
          topicLabel,
          signals: linkedLearningSignals,
          catAdaptiveAvailable,
          linkMode,
        }),
      };
    }
    return {
      mode: "legacy" as const,
      pathwayDef,
      pack: buildLegacyLessonActionHrefs({
        pathwayId,
        pathwayDef,
        topicCode,
        topicLabel,
        catAdaptiveAvailable,
      }),
    };
  }, [pathwayId, linkedLearningSignals, topicCode, topicLabel, catAdaptiveAvailable, linkMode]);

  const pathwayDef = hrefBudget.pathwayDef;
  const pack = hrefBudget.pack;
  const mode = hrefBudget.mode;

  const allLessonsHref =
    allLessonsHrefOverride?.trim() ||
    (pathwayDef ? marketingPathwayLessonsIndexPath(pathwayDef) : "/lessons");

  const saving = pending !== "idle";

  if (!pathwayId.trim()) return null;

  const primaryLinkedActive =
    mode === "linked" &&
    linkedLearningSignals?.practiceQuestionsLinked === true &&
    Boolean(pack?.questionsHref);
  const primaryLegacyActive = mode === "legacy" && Boolean(pack?.questionsHref);

  return (
    <section
      className="lv-lesson-actions rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] px-4 py-5 shadow-[var(--semantic-shadow-soft)] sm:px-5"
      aria-label="Continue studying"
      data-testid="pathway-lesson-continue-studying"
    >
      <p className="nn-lesson-module-eyebrow">{t("learner.lessons.detail.studyActionsEyebrow")}</p>

      <div className="lv-lesson-actions__primary mt-3">
        {primaryLinkedActive && pack?.questionsHref ? (
          <Link
            href={pack.questionsHref}
            data-testid="pathway-lesson-linked-cta-questions"
            data-nn-pathway-id={pathwayId}
            className="lv-btn-primary w-full sm:w-auto sm:min-w-48"
          >
            <ClipboardList className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
            {t("learner.studyLoop.practiceThisTopicCta")}
          </Link>
        ) : mode === "linked" ? (
          <button
            type="button"
            disabled
            title="Topic-scoped question drill is not linked for this lesson yet."
            className={`${disabledCtaClass("primary")} w-full sm:w-auto sm:min-w-48`}
            data-testid="pathway-lesson-linked-cta-questions-disabled"
          >
            <ClipboardList className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
            {t("learner.studyLoop.practiceThisTopicCta")}
          </button>
        ) : primaryLegacyActive && pack?.questionsHref ? (
          <Link
            href={pack.questionsHref}
            data-testid="pathway-lesson-cta-practice-topic"
            data-nn-pathway-id={pathwayId}
            className="lv-btn-primary w-full sm:w-auto sm:min-w-48"
          >
            <ClipboardList className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
            {t("learner.studyLoop.practiceThisTopicCta")}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="Question bank requires a valid pathway."
            className={`${disabledCtaClass("primary")} w-full sm:w-auto sm:min-w-48`}
            data-testid="pathway-lesson-cta-practice-topic-disabled"
          >
            <ClipboardList className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
            {t("learner.studyLoop.practiceThisTopicCta")}
          </button>
        )}
      </div>

      <div
        className="lv-lesson-actions__secondary"
        {...(mode === "linked" ? { "data-testid": "pathway-lesson-linked-practice-panel" } : {})}
      >
        {mode === "linked" && linkedLearningSignals ? (
          <>
            {linkedLearningSignals.flashcardsLinked && pack?.flashcardsHref ? (
              <Link
                href={pack.flashcardsHref}
                data-testid="pathway-lesson-linked-cta-flashcards"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none"
              >
                <Layers className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.sameTopicFlashcards")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Flashcards are not linked for this lesson topic yet."
                className={`${disabledCtaClass("secondary")} flex-1 sm:min-w-40 sm:flex-none`}
                data-testid="pathway-lesson-linked-cta-flashcards-disabled"
              >
                <Layers className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.sameTopicFlashcards")}
              </button>
            )}
            {linkedLearningSignals.catPoolLinked && pack?.practiceTestsHref ? (
              <Link
                href={pack.practiceTestsHref}
                data-testid="pathway-lesson-linked-cta-practice-tests"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none"
              >
                <ListChecks className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.topicPracticeTestsCta")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="This pathway does not expose topic-scoped practice tests, or the lesson is not linked."
                className={`${disabledCtaClass("secondary")} flex-1 sm:min-w-40 sm:flex-none`}
                data-testid="pathway-lesson-linked-cta-practice-tests-disabled"
              >
                <ListChecks className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.topicPracticeTestsCta")}
              </button>
            )}
            {linkedLearningSignals.adaptiveLearningReadiness &&
            catAdaptiveAvailable &&
            pack?.adaptiveHref ? (
              <Link
                href={pack.adaptiveHref}
                data-testid="pathway-lesson-linked-cta-adaptive"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary lv-lesson-actions__btn--cool flex-1 sm:min-w-40 sm:flex-none"
              >
                <LineChart className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.catFromLesson")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title={
                  !catAdaptiveAvailable
                    ? "Adaptive CAT start is not available for this pathway yet (e.g. waitlist or info-only)."
                    : "Add lesson depth or bank-linked checks to unlock adaptive practice shortcuts."
                }
                className={`${disabledCtaClass("secondary")} lv-lesson-actions__btn--cool flex-1 sm:min-w-40 sm:flex-none`}
                data-testid="pathway-lesson-linked-cta-adaptive-disabled"
              >
                <LineChart className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.catFromLesson")}
              </button>
            )}
          </>
        ) : (
          <>
            {pack?.flashcardsHref ? (
              <Link
                href={pack.flashcardsHref}
                data-testid="pathway-lesson-cta-flashcards"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none"
              >
                <Layers className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.sameTopicFlashcards")}
              </Link>
            ) : null}
            {pack?.practiceTestsHref ? (
              <Link
                href={pack.practiceTestsHref}
                data-testid="pathway-lesson-cta-practice-tests-topic"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary flex-1 sm:min-w-40 sm:flex-none"
              >
                <ListChecks className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.topicPracticeTestsCta")}
              </Link>
            ) : null}
            {pack?.adaptiveHref ? (
              <Link
                href={pack.adaptiveHref}
                data-testid="pathway-lesson-cta-cat-practice"
                data-nn-pathway-id={pathwayId}
                className="lv-btn-secondary lv-lesson-actions__btn--cool flex-1 sm:min-w-40 sm:flex-none"
              >
                <LineChart className="lv-lesson-actions__icon h-4 w-4 shrink-0" aria-hidden />
                {t("learner.studyLoop.catFromLesson")}
              </Link>
            ) : null}
          </>
        )}
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
