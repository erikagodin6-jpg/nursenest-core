"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { QuestionType } from "@prisma/client";
import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import type { ExamStartEmptyDiagnostics } from "@/lib/questions/exam-start-empty-diagnostics";
import { ExamSessionShell, ExamSessionTopBar } from "@/components/exam/exam-session-shell";
import { examPoolEmptyCopy, examStartFailureMessage } from "@/lib/student/gated-state-messages";

type ExamQuestion = {
  id: string;
  stem: string;
  options: unknown;
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

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
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
  /** Suggested countdown length when learner picks timed mode (NCLEX-style full mocks often use 5h). */
  timedSuggestedMinutes = 90,
}: {
  examId: string | null;
  examTitle?: string | null;
  /** When set, server draws a shuffled pool of published questions with this tag (e.g. mixed practice preset). */
  questionTag?: string | null;
  /** Suffix for localStorage keys when multiple exam widgets exist on one page. */
  sessionNamespace?: string;
  timedSuggestedMinutes?: number;
}) {
  const { session: STORAGE_SESSION, exam: STORAGE_EXAM } = storageKeys(sessionNamespace);
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
  } | null>(null);
  const [qLoading, setQLoading] = useState(false);
  const [blockingError, setBlockingError] = useState<string | null>(null);
  const [poolEmptyCopy, setPoolEmptyCopy] = useState<{ title: string; body: string } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Record<string, ExamQuestion>>({});
  cacheRef.current = cache;

  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  /** Flag items for review (client-side; helps pacing habits, not persisted to server). */
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [sessionPhase, setSessionPhase] = useState<"active" | "review">("active");
  const sessionStartMsRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const answersRef = useRef<Record<string, unknown>>({});
  currentIndexRef.current = currentIndex;
  answersRef.current = answers;

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
    const t = window.setInterval(() => {
      setRemainingSec((r) => {
        if (r == null) return null;
        return r <= 0 ? 0 : r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
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
          setBlockingError(
            "We couldn’t load this question (connection or temporary server issue). Refresh the page or try again shortly.",
          );
          setPhase("error");
        }
        setQLoading(false);
        return;
      }
      setCache((c) => ({ ...c, [q.id]: q }));
      setQLoading(false);
    })();

    return () => ac.abort();
  }, [phase, sessionId, currentIndex, questionIds, total, fetchQuestion]);

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
            setPoolEmptyCopy(examPoolEmptyCopy(undefined));
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
        setBlockingError(examStartFailureMessage(start.status, payload.code));
        setPhase("error");
        return;
      }
      if (!payload.sessionId || payload.poolEmpty || !payload.questionIds?.length) {
        setPoolEmptyCopy(examPoolEmptyCopy(payload.diagnostics));
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
      setBlockingError("Could not reach the server to start this session. Check your connection and retry.");
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
        error?: string;
      };
      if (!res.ok) {
        setBlockingError("We couldn’t record this attempt. Check your connection or try again shortly.");
        setPhase("error");
        return;
      }
      if (data.attempt) {
        setDone({
          score: data.attempt.score,
          total: data.attempt.total,
          attemptId: data.attempt.id,
          review: data.review ?? null,
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
    return <p className="text-sm text-muted">Preparing your practice session…</p>;
  }

  if (phase === "pickMode") {
    return (
      <div className="nn-card mt-4 space-y-4 p-6">
        {examTitle ? <p className="text-sm font-medium text-muted">{examTitle}</p> : null}
        <p className="text-sm text-muted">Choose how you want to run this session. Progress saves automatically; you can refresh and resume.</p>
        <p className="text-xs text-muted">
          This is NurseNest practice—timed pacing and layout are designed to feel serious and focused. We do not replicate any
          official exam vendor interface or guarantee identical behavior on test day.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-primary/5"
            onClick={() => void startExamSession(false)}
          >
            Untimed
          </button>
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => void startExamSession(true)}
          >
            Timed ({timedSuggestedMinutes} min)
          </button>
        </div>
        <p className="text-xs text-muted">
          Timed mode shows a countdown and submits automatically when time expires (your answers so far are sent).
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">
          {blockingError ?? "We could not load the exam session. Check your connection and retry."}
        </p>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (phase === "empty") {
    const { title, body } = poolEmptyCopy ?? examPoolEmptyCopy(undefined);
    return (
      <div className="mt-4 space-y-2 text-sm text-muted">
        <p className="font-medium text-foreground">{title}</p>
        <p>
          {body}{" "}
          <Link href="/app/questions" className="font-medium text-primary underline">
            Open the question bank
          </Link>{" "}
          or contact support if this doesn’t match what you expect.
        </p>
      </div>
    );
  }

  if (done) {
    const r = done.review;
    return (
      <div className="nn-card mt-4 space-y-4 p-6">
        <p className="font-semibold">Attempt recorded</p>
        <p className="text-sm text-muted">
          Score: {done.score}/{done.total}
          {r?.accuracyPct != null ? ` (${r.accuracyPct}%)` : ""}
        </p>
        {r?.elapsedMs != null ? (
          <p className="text-sm text-muted">
            Time: {formatDuration(r.elapsedMs)}
            {r.timedMode && r.timeLimitSec != null ? ` / limit ${formatDuration(r.timeLimitSec * 1000)}` : ""}
          </p>
        ) : null}
        {r?.byTopic && Object.keys(r.byTopic).length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Performance by topic</p>
            <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-muted">
              {Object.entries(r.byTopic).map(([topic, row]) => (
                <li key={topic}>
                  <span className="text-foreground">{topic}</span>: {row.correct}/{row.total}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {r?.weakAreas && r.weakAreas.length > 0 ? (
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">Review topics: </span>
            {r.weakAreas.slice(0, 8).join(", ")}
          </p>
        ) : null}
        <p className="text-sm text-muted">
          Review misses in the question bank, then reinforce weak systems with{" "}
          <Link href="/exam-lessons" className="font-medium text-primary underline">
            exam-specific lessons
          </Link>{" "}
          for your pathway.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/exams/attempts/${done.attemptId}`}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Full score report
          </Link>
          <Link
            href="/app/questions"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Open question bank
          </Link>
          <Link
            href="/exam-lessons"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Browse lessons by exam
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
          left={<span className="text-slate-700 dark:text-slate-200">Review before scoring</span>}
          center={<span className="text-slate-500">{total} items</span>}
          right={
            timedMode && remainingSec != null ? (
              <span
                className={`font-semibold tabular-nums ${remainingSec < 120 ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-100"}`}
              >
                {Math.floor(remainingSec / 60)}:{String(remainingSec % 60).padStart(2, "0")}
              </span>
            ) : (
              <span className="text-slate-500">Untimed</span>
            )
          }
        />
        <div className="space-y-4 p-5 md:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Unanswered: {unansweredCount} · Flagged: {Object.values(flagged).filter(Boolean).length}
          </p>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {questionIds.map((id, i) => {
              const v = answers[id];
              const answered = v != null && (!Array.isArray(v) || v.length > 0);
              return (
                <li
                  key={id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <button
                    type="button"
                    className="font-medium text-primary underline"
                    onClick={() => {
                      setSessionPhase("active");
                      setCurrentIndex(i);
                    }}
                  >
                    Question {i + 1}
                  </button>
                  <span className="text-slate-600 dark:text-slate-400">
                    {answered ? "Answered" : "Unanswered"}
                    {flagged[id] ? " · Flagged" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 dark:border-slate-600 dark:text-slate-100"
              onClick={() => setSessionPhase("active")}
            >
              Back to items
            </button>
            <button
              type="button"
              disabled={submitting}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              onClick={() => void submitExam()}
            >
              {submitting ? "Submitting…" : "Submit for scoring"}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Rationales and explanations appear only after scoring—same discipline as many high-stakes exams.
          </p>
        </div>
      </ExamSessionShell>
    );
  }

  if (!q && (qLoading || !qid)) {
    return (
      <ExamSessionShell className="mt-6 overflow-hidden" neutralPalette>
        <ExamSessionTopBar
          left={examTitle ? <span className="font-medium text-slate-700 dark:text-slate-200">{examTitle}</span> : null}
          center={<span className="text-slate-500">Loading</span>}
          right={
            timedMode && remainingSec != null ? (
              <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {Math.floor(remainingSec / 60)}:{String(remainingSec % 60).padStart(2, "0")}
              </span>
            ) : (
              <span className="text-slate-500">—</span>
            )
          }
        />
        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading question…</p>
        </div>
      </ExamSessionShell>
    );
  }

  if (!q) {
    return null;
  }

  const opts = parseOptions(q.options);
  const raw = answers[q.id];

  return (
    <ExamSessionShell className="mt-6 overflow-hidden" neutralPalette>
      <ExamSessionTopBar
        left={
          <span className="text-slate-700 dark:text-slate-200">
            Item {currentIndex + 1} of {total}
            {unansweredCount > 0 ? (
              <span className="ml-2 text-slate-500">· {unansweredCount} unanswered</span>
            ) : null}
          </span>
        }
        center={examTitle ? <span className="hidden text-slate-500 sm:inline">{examTitle}</span> : null}
        right={
          timedMode && remainingSec != null ? (
            <span
              className={`font-semibold tabular-nums ${remainingSec < 120 ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-100"}`}
            >
              {Math.floor(remainingSec / 60)}:{String(remainingSec % 60).padStart(2, "0")}
            </span>
          ) : (
            <span className="text-slate-500">Untimed</span>
          )
        }
      />
      <div className="space-y-4 p-5 md:p-6">
        <p className="min-h-[1.5rem] text-base font-medium leading-relaxed text-slate-900 dark:text-slate-100">{q.stem}</p>

        {q.questionType === "SATA" ? (
          <ul className="space-y-2">
            {opts.map((label) => {
              const selected = Array.isArray(raw) ? raw.includes(label) : false;
              return (
                <li key={label}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/50">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const prev = Array.isArray(raw) ? [...raw] : [];
                        const next = e.target.checked ? [...prev, label] : prev.filter((x) => x !== label);
                        setAnswers((a) => ({ ...a, [q.id]: next }));
                      }}
                      className="mt-1"
                    />
                    <span>{label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2">
            {opts.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: label }))}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    raw === label
                      ? "border-2 border-primary bg-primary/10"
                      : "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              flagged[q.id]
                ? "border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
                : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
            }`}
            onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
          >
            {flagged[q.id] ? "Flagged" : "Flag for review"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          <button
            type="button"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </button>
          {currentIndex < total - 1 ? (
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => setSessionPhase("review")}
            >
              Review answers
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">Progress saves automatically. Refresh-safe resume.</p>
      </div>
    </ExamSessionShell>
  );
}
