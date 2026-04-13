"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { QuestionType } from "@prisma/client";
import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import type { ExamStartEmptyDiagnostics } from "@/lib/questions/exam-start-empty-diagnostics";
import {
  ExamProgressBar,
  ExamSessionShell,
  ExamSessionTopBar,
  ExamTimerReadout,
} from "@/components/exam/exam-session-shell";
import type { EmptyCopyI18n } from "@/lib/student/gated-state-messages-i18n";
import { examPoolEmptyKeys, examStartFailureKey } from "@/lib/student/gated-state-messages-i18n";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { readLearnerStudyDefaults } from "@/lib/student/learner-study-defaults";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";
import { PostSessionExamInsights } from "@/components/student/post-session-exam-insights";
import { PostTestStudyNextCard } from "@/components/student/post-test-study-next-card";
import { SessionFeedbackStrip } from "@/components/student/session-feedback-strip";
import { generateClientSessionFeedback } from "@/lib/learner/session-feedback-client";
import type { StudySettings } from "@/lib/learner/study-settings";

type ExamQuestion = {
  id: string;
  stem: string;
  options: unknown;
  displayOptions?: string[] | null;
  questionType: QuestionType;
};

function storageKeys(namespace?: string) {
  const sfx = namespace ? `_${namespace}` : "";
  return {
    session: `nursenest_exam_session_id${sfx}`,
    exam: `nursenest_exam_session_exam_id${sfx}`,
  };
}

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

/** Bound client memory for long mocks (per-question fetch already avoids bulk load). */
const MAX_EXAM_QUESTION_CACHE = 24;

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "N/A";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export function ExamPracticeClient({
  examId,
  examTitle,
  questionTag,
  sessionNamespace,
  userId,
  /** Suggested countdown length when learner picks timed mode (NCLEX-style full mocks often use 5h). */
  timedSuggestedMinutes = 90,
  studySettings,
}: {
  examId: string | null;
  examTitle?: string | null;
  /** When set, server draws a shuffled pool of published questions with this tag (e.g. mixed practice preset). */
  questionTag?: string | null;
  /** Suffix for localStorage keys when multiple exam widgets exist on one page. */
  sessionNamespace?: string;
  /** When set, timed vs untimed button order follows Settings & study preferences. */
  userId?: string | null;
  timedSuggestedMinutes?: number;
  studySettings: StudySettings;
}) {
  const { t } = useMarketingI18n();
  const { session: STORAGE_SESSION, exam: STORAGE_EXAM } = storageKeys(sessionNamespace);
  const adaptivePlanEnabled = studySettings.enableAdaptivePlan;
  const [phase, setPhase] = useState<"loading" | "pickMode" | "ready" | "empty" | "error">("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resolvedExamId, setResolvedExamId] = useState<string | null>(examId);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, ExamQuestion>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{
    score: number;
    total: number;
    attemptId: string;
    review: ExamReviewJson | null;
    studyNext: PostTestStudyNextBundle | null;
  } | null>(null);
  const [qLoading, setQLoading] = useState(false);
  const [blockingError, setBlockingError] = useState<string | null>(null);
  const [poolEmptyCopy, setPoolEmptyCopy] = useState<EmptyCopyI18n | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Record<string, ExamQuestion>>({});
  cacheRef.current = cache;

  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [timedPreferredFirst, setTimedPreferredFirst] = useState(false);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  /** Flag items for review (client-side; helps pacing habits, not persisted to server). */
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [sessionPhase, setSessionPhase] = useState<"active" | "review">("active");
  const sessionStartMsRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const answersRef = useRef<Record<string, unknown>>({});
  currentIndexRef.current = currentIndex;
  answersRef.current = answers;

  useEffect(() => {
    if (!userId) {
      setTimedPreferredFirst(false);
      return;
    }
    setTimedPreferredFirst(readLearnerStudyDefaults(userId).practiceExam.timedPreferred);
  }, [userId]);

  const total = questionIds.length;

  const flushSave = useCallback(
    (sid: string, idx: number, ans: Record<string, unknown>, useKeepalive = false) => {
      const elapsedMs =
        sessionStartMsRef.current != null ? Math.max(0, Date.now() - sessionStartMsRef.current) : undefined;
      const body = JSON.stringify({
        sessionId: sid,
        currentIndex: idx,
        answers: ans,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      });
      void fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: useKeepalive,
      }).catch(() => {});
    },
    [],
  );

  useEffect(() => {
    if (!sessionId || phase !== "ready") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      flushSave(sessionId, currentIndex, answers, false);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [sessionId, phase, currentIndex, answers, flushSave]);

  useEffect(() => {
    if (!sessionId || phase !== "ready") return;
    const flush = () => flushSave(sessionId, currentIndexRef.current, answersRef.current, true);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    return () => {
      window.removeEventListener("beforeunload", flush);
    };
  }, [sessionId, phase, flushSave]);

  useEffect(() => {
    if (!timedMode || phase !== "ready" || timeLimitSec == null || remainingSec === null) return;
    const tick = window.setInterval(() => {
      setRemainingSec((r) => {
        if (r == null) return null;
        return r <= 0 ? 0 : r - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [timedMode, phase, timeLimitSec, remainingSec]);

  const fetchQuestion = useCallback(async (sid: string, index: number, signal: AbortSignal) => {
    const res = await fetch(
      `/api/exams/session/question?sessionId=${encodeURIComponent(sid)}&index=${index}`,
      { signal },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { question: ExamQuestion };
    return data.question;
  }, []);

  useEffect(() => {
    if (phase !== "ready" || !sessionId || total === 0) return;
    const qid = questionIds[currentIndex];
    if (!qid || cacheRef.current[qid]) return;

    const ac = new AbortController();
    setQLoading(true);
    void (async () => {
      const q = await fetchQuestion(sessionId, currentIndex, ac.signal);
      if (!q) {
        if (!ac.signal.aborted) {
          setBlockingError(t("learner.examPractice.loadQuestionFailed"));
          setPhase("error");
        }
        setQLoading(false);
        return;
      }
      setCache((c) => {
        const next = { ...c, [q.id]: q };
        if (Object.keys(next).length <= MAX_EXAM_QUESTION_CACHE) return next;
        const half = Math.floor(MAX_EXAM_QUESTION_CACHE / 2);
        const lo = Math.max(0, currentIndex - half);
        const hi = Math.min(questionIds.length - 1, currentIndex + half);
        const keep = new Set<string>();
        for (let i = lo; i <= hi; i++) {
          const id = questionIds[i];
          if (id && next[id]) keep.add(id);
        }
        const trimmed: Record<string, ExamQuestion> = {};
        for (const id of keep) trimmed[id] = next[id]!;
        return trimmed;
      });
      setQLoading(false);
    })();

    return () => ac.abort();
  }, [phase, sessionId, currentIndex, questionIds, total, fetchQuestion, t]);

  const applySessionPayload = useCallback(
    (data: {
      sessionId: string;
      examId: string | null;
      currentIndex: number;
      answers: Record<string, unknown>;
      questionIds: string[];
      timedMode?: boolean;
      timeLimitSec?: number | null;
      elapsedMs?: number | null;
    }) => {
      setSessionId(data.sessionId);
      setResolvedExamId(data.examId ?? examId);
      setQuestionIds(data.questionIds);
      setCurrentIndex(data.currentIndex);
      setAnswers(data.answers ?? {});
      setCache({});
      setBlockingError(null);
      setSessionPhase("active");
      setFlagged({});
      const tm = Boolean(data.timedMode);
      setTimedMode(tm);
      const tls = typeof data.timeLimitSec === "number" ? data.timeLimitSec : null;
      setTimeLimitSec(tls);
      const elapsed = typeof data.elapsedMs === "number" ? data.elapsedMs : 0;
      sessionStartMsRef.current = Date.now() - elapsed;
      if (tm && tls != null) {
        const usedSec = Math.floor(elapsed / 1000);
        setRemainingSec(Math.max(0, tls - usedSec));
      } else {
        setRemainingSec(null);
      }
    },
    [examId],
  );

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    async function tryResumeThenPick() {
      try {
        const storedSession = typeof window !== "undefined" ? localStorage.getItem(STORAGE_SESSION) : null;
        const storedExam = typeof window !== "undefined" ? localStorage.getItem(STORAGE_EXAM) : null;

        if (storedSession && storedExam && (!examId || storedExam === examId)) {
          const res = await fetch(
            `/api/exams/session?sessionId=${encodeURIComponent(storedSession)}&mode=minimal`,
            { signal: ac.signal },
          );
          if (res.status === 404) {
            localStorage.removeItem(STORAGE_SESSION);
            localStorage.removeItem(STORAGE_EXAM);
          }
          if (res.ok) {
            const data = (await res.json()) as {
              sessionId: string;
              examId: string | null;
              currentIndex: number;
              answers: Record<string, unknown>;
              questionIds: string[];
              total: number;
              poolEmpty?: boolean;
              timedMode?: boolean;
              timeLimitSec?: number | null;
              elapsedMs?: number | null;
            };
            if (cancelled) return;
            if (data.questionIds.length > 0) {
              applySessionPayload(data);
              setPoolEmptyCopy(null);
              setPhase("ready");
              localStorage.setItem(STORAGE_SESSION, data.sessionId);
              localStorage.setItem(STORAGE_EXAM, data.examId ?? examId ?? "");
              return;
            }
            setPoolEmptyCopy(examPoolEmptyKeys(undefined));
            setPhase("empty");
            return;
          }
        }

        if (!cancelled) setPhase("pickMode");
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === "AbortError")) return;
        setPhase("pickMode");
      }
    }

    void tryResumeThenPick();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [STORAGE_SESSION, STORAGE_EXAM, examId, applySessionPayload]);

  async function startExamSession(useTimed: boolean) {
    setPhase("loading");
    setBlockingError(null);
    const limitSec = useTimed ? Math.round(timedSuggestedMinutes * 60) : null;
    try {
      const start = await fetch("/api/exams/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examId ?? undefined,
          questionTag: questionTag ?? undefined,
          hydrate: "window",
          timedMode: useTimed,
          timeLimitSec: useTimed ? limitSec : null,
        }),
      });
      let payload = {} as {
        sessionId?: string;
        examId?: string | null;
        questionIds?: string[];
        questions?: ExamQuestion[];
        poolEmpty?: boolean;
        code?: string;
        diagnostics?: ExamStartEmptyDiagnostics;
        timedMode?: boolean;
        timeLimitSec?: number | null;
        elapsedMs?: number | null;
      };
      try {
        payload = (await start.json()) as typeof payload;
      } catch {
        /* ignore */
      }
      if (!start.ok) {
        setBlockingError(t(examStartFailureKey(start.status, payload.code)));
        setPhase("error");
        return;
      }
      if (!payload.sessionId || payload.poolEmpty || !payload.questionIds?.length) {
        setPoolEmptyCopy(examPoolEmptyKeys(payload.diagnostics));
        setPhase("empty");
        return;
      }
      applySessionPayload({
        sessionId: payload.sessionId,
        examId: payload.examId ?? examId,
        currentIndex: 0,
        answers: {},
        questionIds: payload.questionIds,
        timedMode: payload.timedMode,
        timeLimitSec: payload.timeLimitSec,
        elapsedMs: payload.elapsedMs ?? 0,
      });
      const seed: Record<string, ExamQuestion> = {};
      if (payload.questions?.[0]) {
        seed[payload.questions[0].id] = payload.questions[0];
      }
      setCache(seed);
      setPhase("ready");
      localStorage.setItem(STORAGE_SESSION, payload.sessionId);
      localStorage.setItem(STORAGE_EXAM, payload.examId ?? examId ?? "");
    } catch {
      setBlockingError(t("learner.examPractice.networkStart"));
      setPhase("error");
    }
  }

  const qid = questionIds[currentIndex];
  const q = qid ? cache[qid] : undefined;

  async function submitExam() {
    const examIdForSubmit = resolvedExamId ?? examId;
    if (!sessionId || !examIdForSubmit) return;
    setSubmitting(true);
    try {
      const elapsedMs =
        sessionStartMsRef.current != null ? Math.max(0, Date.now() - sessionStartMsRef.current) : undefined;
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examIdForSubmit,
          sessionId,
          answers,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        }),
      });
      const data = (await res.json()) as {
        attempt?: { id: string; score: number; total: number };
        review?: ExamReviewJson | null;
        studyNext?: PostTestStudyNextBundle | null;
        error?: string;
      };
      if (!res.ok) {
        setBlockingError(t("learner.examPractice.recordAttemptFailed"));
        setPhase("error");
        return;
      }
      if (data.attempt) {
        setDone({
          score: data.attempt.score,
          total: data.attempt.total,
          attemptId: data.attempt.id,
          review: data.review ?? null,
          studyNext: data.studyNext ?? null,
        });
        localStorage.removeItem(STORAGE_SESSION);
        localStorage.removeItem(STORAGE_EXAM);
      }
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (remainingSec !== 0 || phase !== "ready" || !timedMode || submitting) return;
    void submitExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- submit once when timer hits 0
  }, [remainingSec]);

  if (phase === "loading") {
    return <p className="text-sm text-muted">{t("learner.examPractice.preparing")}</p>;
  }

  if (phase === "pickMode") {
    return (
      <div className="nn-card mt-4 space-y-4 p-6">
        {examTitle ? <p className="text-sm font-medium text-muted">{examTitle}</p> : null}
        <p className="text-sm text-muted">{t("learner.examPractice.chooseMode")}</p>
        <p className="text-xs text-muted">{t("learner.examPractice.disclaimer")}</p>
        <div className="flex flex-wrap gap-2">
          {timedPreferredFirst ? (
            <>
              <button
                type="button"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                onClick={() => void startExamSession(true)}
              >
                {t("learner.examPractice.timedButton", { minutes: timedSuggestedMinutes })}
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-primary/5"
                onClick={() => void startExamSession(false)}
              >
                {t("learner.examPractice.untimed")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-primary/5"
                onClick={() => void startExamSession(false)}
              >
                {t("learner.examPractice.untimed")}
              </button>
              <button
                type="button"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                onClick={() => void startExamSession(true)}
              >
                {t("learner.examPractice.timedButton", { minutes: timedSuggestedMinutes })}
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-muted">{t("learner.examPractice.timedModeHint")}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">
          {blockingError ?? t("learner.examPractice.sessionLoadFailed")}
        </p>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          {t("learner.examPractice.retry")}
        </button>
      </div>
    );
  }

  if (phase === "empty") {
    const keys = poolEmptyCopy ?? examPoolEmptyKeys(undefined);
    const title = t(keys.titleKey, keys.bodyParams);
    const body = t(keys.bodyKey, keys.bodyParams);
    return (
      <div className="mt-4 space-y-2 text-sm text-muted">
        <p className="font-medium text-foreground">{title}</p>
        <p>
          {body}{" "}
          <Link href="/app/questions" className="font-medium text-primary underline">
            {t("examAttempt.openQuestionBank")}
          </Link>{" "}
          {t("learner.examPractice.emptySuffix")}
        </p>
      </div>
    );
  }

  if (done) {
    const r = done.review;
    const sessionFeedback = generateClientSessionFeedback({
      score: done.score,
      total: done.total,
      accuracyPct: r?.accuracyPct ?? null,
      byTopic: r?.byTopic ?? null,
    });
    return (
      <div className="nn-card mt-4 space-y-4 p-6">
        <p className="font-semibold">{t("examAttempt.recorded")}</p>
        <SessionFeedbackStrip feedback={sessionFeedback} />
        <p className="text-sm text-muted">
          {r?.accuracyPct != null
            ? t("examAttempt.scoreWithPct", { score: done.score, total: done.total, pct: r.accuracyPct })
            : t("examAttempt.scoreLine", { score: done.score, total: done.total })}
        </p>
        {r?.elapsedMs != null ? (
          <p className="text-sm text-muted">
            {t("examAttempt.timeLabel", { time: formatDuration(r.elapsedMs) })}
            {r.timedMode && r.timeLimitSec != null
              ? ` · ${t("examAttempt.timeLimitLabel", { time: formatDuration(r.timeLimitSec * 1000) })}`
              : ""}
          </p>
        ) : null}
        {r?.byTopic && Object.keys(r.byTopic).length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("examAttempt.byTopicHeading")}</p>
            <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-muted">
              {Object.entries(r.byTopic).map(([topic, row]) => (
                <li key={topic}>
                  <span className="text-foreground">{topic}</span>: {row.correct}/{row.total}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {adaptivePlanEnabled ? (
          <>
            <PostSessionExamInsights review={r ?? null} studyNext={done.studyNext ?? null} />
            {done.studyNext ? <PostTestStudyNextCard bundle={done.studyNext} /> : null}
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-card/80 p-4 text-sm text-muted">
            Adaptive recommendations are turned off in your study settings, so this summary sticks to your results and leaves the next step up to you.
          </div>
        )}
        <p className="text-sm text-muted">
          Re-run missed topics in practice, then shore up systems with{" "}
          <Link href="/lessons" className="font-medium text-primary underline">
            lessons matched to your exam
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/exams/attempts/${done.attemptId}`}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {t("examAttempt.fullReportCta")}
          </Link>
          <Link
            href="/app/questions"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Back to practice
          </Link>
          <Link
            href="/lessons"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Find lessons for your exam
          </Link>
        </div>
      </div>
    );
  }

  const unansweredCount = questionIds.filter((id) => {
    const v = answers[id];
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }).length;

  if (phase === "ready" && sessionPhase === "review") {
    return (
      <ExamSessionShell className="mt-6 overflow-hidden" neutralPalette>
        <ExamSessionTopBar
          left={<span className="font-medium text-foreground">Review before scoring</span>}
          center={<span>Pre-submit checklist</span>}
          right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
        />
        <ExamProgressBar current={total} total={total} />
        <div className="space-y-4 p-5 md:p-6">
          <p className="text-sm tabular-nums text-muted-foreground">
            Unanswered: <span className="font-semibold text-foreground">{unansweredCount}</span>
            {" · "}
            Marked for review:{" "}
            <span className="font-semibold text-foreground">
              {Object.values(flagged).filter(Boolean).length}
            </span>
          </p>
          <ul className="max-h-64 space-y-1.5 overflow-y-auto text-sm">
            {questionIds.map((id, i) => {
              const v = answers[id];
              const answered = v != null && (!Array.isArray(v) || v.length > 0);
              return (
                <li
                  key={id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <button
                    type="button"
                    className="min-w-0 text-left font-medium text-foreground underline decoration-border underline-offset-2 transition hover:text-primary hover:decoration-primary"
                    onClick={() => {
                      setSessionPhase("active");
                      setCurrentIndex(i);
                    }}
                  >
                    Item {i + 1}
                  </button>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        answered
                          ? "bg-muted text-muted-foreground"
                          : "border border-role-warning-border bg-role-warning-soft text-role-warning-text"
                      }`}
                    >
                      {answered ? "Answered" : "Unanswered"}
                    </span>
                    {flagged[id] ? (
                      <span className="rounded border border-primary/30 bg-primary/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                        Marked
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              type="button"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setSessionPhase("active")}
            >
              Back to items
            </button>
            <button
              type="button"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
              onClick={() => void submitExam()}
            >
              {submitting ? "Submitting…" : "Submit for scoring"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Rationales and explanations appear only after scoring, same discipline as many high-stakes exams.
          </p>
        </div>
      </ExamSessionShell>
    );
  }

  if (!q && (qLoading || !qid)) {
    return (
      <ExamSessionShell className="mt-6 overflow-hidden" neutralPalette>
        <ExamSessionTopBar
          left={examTitle ? <span className="font-medium text-foreground">{examTitle}</span> : null}
          center={<span>Loading</span>}
          right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
        />
        {total > 0 ? <ExamProgressBar current={Math.min(currentIndex + 1, total)} total={total} /> : null}
        <div className="p-6">
          <p className="text-sm text-muted-foreground">Loading question…</p>
        </div>
      </ExamSessionShell>
    );
  }

  if (!q) {
    return null;
  }

  const optsCanonical = parseOptions(q.options);
  const optsDisplay =
    Array.isArray(q.displayOptions) && q.displayOptions.length === optsCanonical.length
      ? q.displayOptions.map((x) => String(x))
      : optsCanonical;
  const raw = answers[q.id];

  return (
      <ExamSessionShell className="mt-6 overflow-hidden" neutralPalette>
        <ExamSessionTopBar
          left={
            <div>
              <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                Item {currentIndex + 1} of {total}
              </p>
              {unansweredCount > 0 ? (
                <p className="mt-1 nn-marketing-caption text-[var(--theme-muted-text)]">{unansweredCount} still unanswered</p>
              ) : (
                <p className="mt-1 nn-marketing-caption text-[var(--theme-muted-text)]">All items have a selection</p>
              )}
            </div>
          }
          center={examTitle ? <span className="line-clamp-2 normal-case nn-marketing-body-sm">{examTitle}</span> : null}
          right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
        />
        <ExamProgressBar current={currentIndex + 1} total={total} />
        <div className="nn-question-session space-y-6">
          <div className="nn-question-stem-wrap min-h-[3rem]">
            <p className="nn-question-stem">{q.stem}</p>
          </div>

          {q.questionType === "SATA" ? (
            <ul className="nn-qopt-list" role="group" aria-label={t("learner.qbank.examUi.answersHeading")}>
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
                return (
                  <li key={canonical}>
                    <label
                      className={`flex min-h-[3.25rem] cursor-pointer items-start gap-3 px-4 py-3.5 text-base leading-relaxed transition sm:min-h-[3.5rem] nn-qopt-surface nn-qopt-surface--interactive ${
                        selected ? "nn-qopt-surface--selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const prev = Array.isArray(raw) ? [...raw] : [];
                          const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
                          setAnswers((a) => ({ ...a, [q.id]: next }));
                        }}
                        className="mt-1 size-[1.125rem] shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary/30 sm:size-4"
                      />
                      <QuestionChoiceLetter index={i} />
                      <span className="min-w-0 flex-1 text-[var(--theme-body-text)]">{label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="nn-qopt-list" role="radiogroup" aria-label={t("learner.qbank.examUi.answersHeading")}>
              {optsCanonical.map((canonical, i) => {
                const label = optsDisplay[i] ?? canonical;
                const picked = raw === canonical;
                return (
                  <li key={canonical}>
                    <button
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: canonical }))}
                      className={`flex min-h-[3.25rem] w-full items-start gap-3 px-4 py-4 text-left text-base font-normal leading-relaxed text-[var(--theme-body-text)] transition sm:min-h-[3.5rem] sm:px-5 nn-qopt-surface nn-qopt-surface--interactive ${
                        picked ? "nn-qopt-surface--selected" : ""
                      }`}
                    >
                      <QuestionChoiceLetter index={i} />
                      <span className={`min-w-0 flex-1 ${picked ? "font-semibold" : ""}`}>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="nn-question-nav-actions border-t-0 pt-0">
            <button
              type="button"
              aria-pressed={Boolean(flagged[q.id])}
              className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                flagged[q.id]
                  ? "border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_7%,var(--theme-card-bg))] text-[var(--theme-heading-text)]"
                  : "border-border text-[var(--theme-muted-text)] hover:bg-muted/40"
              }`}
              onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
            >
              {flagged[q.id] ? "Marked for review" : "Mark for review"}
            </button>
          </div>

          <div className="nn-question-nav-actions">
            <button
              type="button"
              className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-semibold disabled:opacity-40"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            >
              Previous
            </button>
            {currentIndex < total - 1 ? (
              <button
                type="button"
                className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none"
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none"
                onClick={() => setSessionPhase("review")}
              >
                Review answers
              </button>
            )}
          </div>
          <p className="nn-marketing-caption text-[var(--theme-muted-text)]">
            Progress saves automatically. You can refresh and resume.
          </p>
        </div>
      </ExamSessionShell>
  );
}
