"use client";

/**
 * Guided study loop for pathway lesson pages: optional bank-backed pre/post quiz,
 * subtle phase indicator, score comparison, and integration with catalog assessments
 * (catalog pre/post suppressed when this loop is active).
 */

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import type { LessonBankStudyRecord } from "@/lib/lessons/lesson-bank-study-loop-store";
import { LessonAssessmentQuiz, QuizScoreSummary } from "@/components/lessons/lesson-assessment-quiz";
import {
  readLearnerStudyDefaults,
  writeLearnerStudyDefaults,
} from "@/lib/student/learner-study-defaults";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), Math.imul(h | 1, 2246822519)) >>> 0;
    h ^= h + Math.imul(h ^ (h >>> 7), 3266489917) >>> 0;
    const j = (h >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function StudyLoopPhaseRail({
  active,
}: {
  active: "check" | "lesson" | "review";
}) {
  const steps = [
    { key: "check" as const, label: "Quick check" },
    { key: "lesson" as const, label: "Lesson" },
    { key: "review" as const, label: "Review quiz" },
  ];
  return (
    <nav
      aria-label="Lesson study steps"
      className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ color: "var(--semantic-text-muted)" }}
    >
      {steps.map((s, i) => {
        const on = s.key === active;
        return (
          <span key={s.key} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" style={{ color: "var(--semantic-border-soft)" }}>
                /
              </span>
            ) : null}
            <span
              className="rounded-full px-2.5 py-1"
              style={{
                background: on
                  ? "color-mix(in srgb, var(--semantic-chart-2) 14%, var(--semantic-surface))"
                  : "transparent",
                color: on ? "var(--semantic-chart-2)" : "var(--semantic-text-muted)",
                border: on ? "1px solid color-mix(in srgb, var(--semantic-chart-2) 35%, transparent)" : "1px solid transparent",
              }}
            >
              {s.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

async function fetchBankRecord(lessonId: string): Promise<LessonBankStudyRecord> {
  const res = await fetch(`/api/learner/lesson-bank-study-loop?lessonId=${encodeURIComponent(lessonId)}`);
  if (!res.ok) return { pre: null, post: null };
  const body = (await res.json()) as { record?: LessonBankStudyRecord };
  return body.record ?? { pre: null, post: null };
}

async function postBankAttempt(payload: {
  lessonId: string;
  pathwayId: string;
  topic: string;
  type: "pre" | "post";
  questionIds: string[];
  score: number;
  total: number;
  answers: Record<string, number>;
  wrongQuestionIds: string[];
}): Promise<LessonBankStudyRecord | null> {
  try {
    const res = await fetch("/api/learner/lesson-bank-study-loop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { record?: LessonBankStudyRecord };
    return body.record ?? null;
  } catch {
    return null;
  }
}

export function PathwayLessonStudyLoopOrchestrator({
  userId,
  lessonId,
  pathwayId,
  lessonSlug,
  topic,
  shuffleSeed,
  bankItems,
  questionIds,
  poolCount,
  initialProgress,
  defaultLoopEnabled,
  stemPreviewByQuestionId,
  children,
}: {
  userId: string;
  lessonId: string;
  pathwayId: string;
  lessonSlug: string;
  topic: string;
  /** Stable seed (e.g. pathwayId + lessonSlug) for post-quiz shuffle. */
  shuffleSeed: string;
  bankItems: LessonBankQuizItem[];
  questionIds: string[];
  poolCount: number;
  initialProgress: PathwayLessonProgressStatus;
  defaultLoopEnabled: boolean;
  stemPreviewByQuestionId?: Record<string, string>;
  children: ReactNode;
}) {
  const effectiveUserId = userId.trim() || "public";
  const skipKey = `nn_lesson_bank_loop_skip_${lessonId}`;

  const [loopOn, setLoopOn] = useState(defaultLoopEnabled);
  const [step, setStep] = useState<"intro" | "pre" | "lesson" | "post" | "review">("intro");
  const [preSub, setPreSub] = useState<"idle" | "running" | "done" | "skipped">("idle");
  const [postSub, setPostSub] = useState<"locked" | "idle" | "running" | "done" | "skipped">("locked");
  const [progress, setProgress] = useState<PathwayLessonProgressStatus>(initialProgress);
  const [prior, setPrior] = useState<LessonBankStudyRecord | null>(null);
  const [preScore, setPreScore] = useState<{ score: number; total: number } | null>(null);
  const [postScore, setPostScore] = useState<{ score: number; total: number } | null>(null);
  const [postWeakIds, setPostWeakIds] = useState<string[]>([]);
  const [loadingPrior, setLoadingPrior] = useState(true);

  const preQuizItems = useMemo(
    () =>
      seededShuffle(bankItems as PathwayLessonQuizItem[], `pre:${shuffleSeed}:${questionIds.join("|")}`).slice(0, 15),
    [bankItems, questionIds, shuffleSeed],
  );

  const postQuizItems = useMemo(
    () =>
      seededShuffle(bankItems as PathwayLessonQuizItem[], `post:${shuffleSeed}:${questionIds.join("|")}`).slice(0, 15),
    [bankItems, questionIds, shuffleSeed],
  );

  const answersRef = useRef<Record<string, number>>({});
  const wrongRef = useRef<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(skipKey) === "1") {
      setStep("lesson");
      setPreSub("skipped");
      setPostSub("locked");
    }
  }, [skipKey]);

  useEffect(() => {
    if (!userId) return;
    setLoadingPrior(true);
    fetchBankRecord(lessonId)
      .then(setPrior)
      .finally(() => setLoadingPrior(false));
  }, [lessonId, userId]);

  useEffect(() => {
    const onEvt = (event: Event) => {
      const detail = (event as CustomEvent<PathwayLessonProgressEventDetail>).detail;
      if (detail?.pathwayId === pathwayId && detail.lessonSlug === lessonSlug) {
        setProgress(detail.status);
      }
    };
    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
  }, [lessonSlug, pathwayId]);

  useEffect(() => {
    if (step === "intro" && loopOn) {
      trackClientEvent(PH.learnerLessonStudyLoopShown, {
        pathway_id: pathwayId,
        lesson_slug: lessonSlug,
        question_count: preQuizItems.length,
        pool_count: poolCount,
      });
    }
  }, [lessonSlug, loopOn, pathwayId, poolCount, preQuizItems.length, step]);

  const lessonComplete = progress === "completed";

  useEffect(() => {
    if (lessonComplete && postSub === "locked" && step === "lesson") {
      setPostSub("idle");
    }
  }, [lessonComplete, postSub, step]);

  const persistLoopOff = useCallback(async () => {
    try {
      await fetch("/api/learner/study-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonStudyLoopEnabled: false }),
      });
    } catch {
      /* best-effort */
    }
    const cur = readLearnerStudyDefaults(effectiveUserId);
    writeLearnerStudyDefaults(effectiveUserId, { ...cur, lessonAssessments: { enabled: false } });
    trackClientEvent(PH.learnerLessonStudyLoopDisabledToggle, { pathway_id: pathwayId, lesson_slug: lessonSlug });
  }, [effectiveUserId, lessonSlug, pathwayId]);

  const handleDisableLoop = useCallback(() => {
    setLoopOn(false);
    setStep("lesson");
    setPreSub("skipped");
    setPostSub("skipped");
    void persistLoopOff();
  }, [persistLoopOff]);

  const railActive = step === "intro" || step === "pre" ? "check" : step === "lesson" ? "lesson" : "review";

  if (!loopOn) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <StudyLoopPhaseRail active={railActive} />
        <button
          type="button"
          className="self-start text-[11px] font-semibold underline-offset-2 hover:underline sm:self-auto"
          style={{ color: "var(--semantic-text-muted)" }}
          onClick={handleDisableLoop}
        >
          Turn off guided study loop
        </button>
      </div>

      {step === "intro" ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-chart-3) 7%, var(--semantic-surface))",
            borderColor: "color-mix(in srgb, var(--semantic-chart-3) 28%, var(--semantic-border-soft))",
          }}
          aria-labelledby="study-loop-intro-heading"
        >
          <p
            id="study-loop-intro-heading"
            className="text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--semantic-chart-3)" }}
          >
            Optional · diagnostic
          </p>
          <h2 className="mt-1 text-base font-semibold" style={{ color: "var(--theme-heading-text)" }}>
            Test yourself before you start
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
            {preQuizItems.length} quick questions from your question bank, matched to this lesson
            {poolCount < 12 ? ` (we found ${poolCount} related items; using the strongest matches).` : "."} Estimated{" "}
            {Math.max(3, Math.ceil(preQuizItems.length * 0.6))} minutes. You can skip anytime; the lesson is not blocked.
          </p>
          {prior?.pre && !loadingPrior ? (
            <p className="mt-2 text-xs" style={{ color: "var(--semantic-text-muted)" }}>
              Last baseline: {prior.pre.accuracyPct}% ({prior.pre.score}/{prior.pre.total}).
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--semantic-chart-3)", color: "var(--text-inverse, #fff)" }}
              onClick={() => {
                trackClientEvent(PH.learnerLessonStudyLoopPreStarted, {
                  pathway_id: pathwayId,
                  lesson_slug: lessonSlug,
                  n: preQuizItems.length,
                });
                setStep("pre");
                setPreSub("running");
              }}
            >
              Start quick quiz
            </button>
            <button
              type="button"
              className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-secondary)" }}
              onClick={() => {
                try {
                  sessionStorage.setItem(skipKey, "1");
                } catch {
                  /* */
                }
                trackClientEvent(PH.learnerLessonStudyLoopPreSkipped, { pathway_id: pathwayId, lesson_slug: lessonSlug });
                trackClientEvent(PH.learnerLessonStudyLoopLessonSkipped, { pathway_id: pathwayId, lesson_slug: lessonSlug });
                setStep("lesson");
                setPreSub("skipped");
                setPostSub("locked");
              }}
            >
              Skip to lesson
            </button>
          </div>
        </section>
      ) : null}

      {step === "pre" && preSub === "running" ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-panel-cool) 55%, var(--theme-page-bg))",
            borderColor: "var(--semantic-border-soft)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--semantic-info)" }}>
            Quick check
          </p>
          <LessonAssessmentQuiz
            items={preQuizItems}
            onItemGraded={({ item, correct, selectedIndex }) => {
              const id = item.examQuestionId;
              if (id) {
                answersRef.current[id] = selectedIndex;
                if (!correct) wrongRef.current.push(id);
              }
            }}
            onComplete={async ({ score, total }) => {
              setPreScore({ score, total });
              setPreSub("done");
              const wrong = [...new Set(wrongRef.current)];
              const answersSnap = { ...answersRef.current };
              wrongRef.current = [];
              answersRef.current = {};
              if (userId) {
                const record = await postBankAttempt({
                  lessonId,
                  pathwayId,
                  topic,
                  type: "pre",
                  questionIds: preQuizItems
                    .map((q) => (q as LessonBankQuizItem).examQuestionId)
                    .filter((id): id is string => Boolean(id)),
                  score,
                  total,
                  answers: answersSnap,
                  wrongQuestionIds: wrong,
                });
                if (record) setPrior(record);
              }
              trackClientEvent(PH.learnerLessonStudyLoopPreCompleted, {
                pathway_id: pathwayId,
                lesson_slug: lessonSlug,
                score,
                total,
              });
            }}
          />
        </section>
      ) : null}

      {step === "pre" && preSub === "done" && preScore ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 6%, var(--semantic-surface))",
            borderColor: "color-mix(in srgb, var(--semantic-success) 22%, var(--semantic-border-soft))",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--semantic-success)" }}>
            Quick check complete
          </p>
          <div className="mt-3">
            <QuizScoreSummary score={preScore.score} total={preScore.total} label="Baseline" />
          </div>
          <button
            type="button"
            className="mt-5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--role-cta, var(--semantic-brand))", color: "var(--role-cta-foreground, #fff)" }}
            onClick={() => setStep("lesson")}
          >
            Continue to lesson
          </button>
        </section>
      ) : null}

      {step === "lesson" || (step === "post" && postSub !== "running") || step === "review" ? (
        <div className="space-y-6">{children}</div>
      ) : null}

      {step === "lesson" && postSub === "idle" && lessonComplete ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-chart-4) 7%, var(--semantic-surface))",
            borderColor: "color-mix(in srgb, var(--semantic-chart-4) 26%, var(--semantic-border-soft))",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--semantic-chart-4)" }}>
            Retention
          </p>
          <h3 className="mt-1 text-base font-semibold" style={{ color: "var(--theme-heading-text)" }}>
            Retake to lock it in
          </h3>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
            Same topics, reshuffled — compare with your quick check score.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--semantic-chart-4)", color: "var(--text-inverse, #fff)" }}
              onClick={() => {
                trackClientEvent(PH.learnerLessonStudyLoopPostStarted, { pathway_id: pathwayId, lesson_slug: lessonSlug });
                setStep("post");
                setPostSub("running");
              }}
            >
              Start review quiz
            </button>
            <button
              type="button"
              className="rounded-full border px-5 py-2.5 text-sm font-medium"
              style={{ borderColor: "var(--semantic-border-soft)", color: "var(--semantic-text-muted)" }}
              onClick={() => {
                setPostSub("skipped");
                setStep("review");
              }}
            >
              Not now
            </button>
          </div>
        </section>
      ) : null}

      {step === "post" && postSub === "running" ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-panel-warm) 40%, var(--theme-page-bg))",
            borderColor: "var(--semantic-border-soft)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--semantic-warning)" }}>
            Review quiz
          </p>
          <LessonAssessmentQuiz
            items={postQuizItems}
            onItemGraded={({ item, correct, selectedIndex }) => {
              const id = item.examQuestionId;
              if (id) {
                answersRef.current[id] = selectedIndex;
                if (!correct) wrongRef.current.push(id);
              }
            }}
            onComplete={async ({ score, total }) => {
              setPostScore({ score, total });
              const wrong = [...new Set(wrongRef.current)];
              wrongRef.current = [];
              const answersSnapshot = { ...answersRef.current };
              answersRef.current = {};
              setPostWeakIds(wrong);
              setPostSub("done");
              setStep("review");
              if (userId) {
                const record = await postBankAttempt({
                  lessonId,
                  pathwayId,
                  topic,
                  type: "post",
                  questionIds: postQuizItems
                    .map((q) => (q as LessonBankQuizItem).examQuestionId)
                    .filter((id): id is string => Boolean(id)),
                  score,
                  total,
                  answers: answersSnapshot,
                  wrongQuestionIds: wrong,
                });
                if (record) setPrior(record);
              }
              const prePct = preScore && preScore.total > 0 ? Math.round((preScore.score / preScore.total) * 100) : null;
              const postPct = total > 0 ? Math.round((score / total) * 100) : null;
              trackClientEvent(PH.learnerLessonStudyLoopPostCompleted, {
                pathway_id: pathwayId,
                lesson_slug: lessonSlug,
                score,
                total,
              });
              if (prePct != null && postPct != null) {
                trackClientEvent(PH.learnerLessonStudyLoopScoreDelta, {
                  pathway_id: pathwayId,
                  lesson_slug: lessonSlug,
                  pre_pct: prePct,
                  post_pct: postPct,
                  delta: postPct - prePct,
                });
              }
            }}
          />
        </section>
      ) : null}

      {step === "review" && (preScore || postScore) ? (
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-panel-positive) 35%, var(--theme-page-bg))",
            borderColor: "var(--semantic-border-soft)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--semantic-success)" }}>
            How you did
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {preScore ? <QuizScoreSummary score={preScore.score} total={preScore.total} label="Pre score" /> : null}
            {postScore ? <QuizScoreSummary score={postScore.score} total={postScore.total} label="Post score" /> : null}
          </div>
          {preScore && postScore ? (
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--theme-heading-text)" }}>
              Change:{" "}
              {Math.round((postScore.score / postScore.total) * 100) - Math.round((preScore.score / preScore.total) * 100) >= 0
                ? "+"
                : ""}
              {Math.round((postScore.score / postScore.total) * 100) - Math.round((preScore.score / preScore.total) * 100)}{" "}
              percentage points
            </p>
          ) : null}
          {postWeakIds.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
                Still tricky
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
                {postWeakIds.slice(0, 6).map((id) => {
                  const prev = stemPreviewByQuestionId?.[id];
                  return (
                    <li key={id}>
                      {prev ? <span>{prev}</span> : <span className="font-mono text-[11px] opacity-70">{id.slice(0, 8)}…</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
