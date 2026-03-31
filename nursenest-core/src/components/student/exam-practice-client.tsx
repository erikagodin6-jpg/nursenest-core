"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { QuestionType } from "@prisma/client";
import type { ExamStartEmptyDiagnostics } from "@/lib/questions/exam-start-empty-diagnostics";
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

export function ExamPracticeClient({
  examId,
  examTitle,
  questionTag,
  sessionNamespace,
}: {
  examId: string | null;
  examTitle?: string | null;
  /** When set, server draws a shuffled pool of published questions with this tag (e.g. mixed practice preset). */
  questionTag?: string | null;
  /** Suffix for localStorage keys when multiple exam widgets exist on one page. */
  sessionNamespace?: string;
}) {
  const { session: STORAGE_SESSION, exam: STORAGE_EXAM } = storageKeys(sessionNamespace);
  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resolvedExamId, setResolvedExamId] = useState<string | null>(examId);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, ExamQuestion>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ score: number; total: number } | null>(null);
  const [qLoading, setQLoading] = useState(false);
  const [blockingError, setBlockingError] = useState<string | null>(null);
  const [poolEmptyCopy, setPoolEmptyCopy] = useState<{ title: string; body: string } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Record<string, ExamQuestion>>({});
  cacheRef.current = cache;

  const total = questionIds.length;

  const flushSave = useCallback(
    (sid: string, idx: number, ans: Record<string, unknown>) => {
      void fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, currentIndex: idx, answers: ans }),
      }).catch(() => {});
    },
    [],
  );

  useEffect(() => {
    if (!sessionId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      flushSave(sessionId, currentIndex, answers);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [sessionId, currentIndex, answers, flushSave]);

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

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    async function boot() {
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
            };
            if (cancelled) return;
            setSessionId(data.sessionId);
            setResolvedExamId(data.examId ?? examId);
            setQuestionIds(data.questionIds);
            setCurrentIndex(data.currentIndex);
            setAnswers(data.answers ?? {});
            setCache({});
            setBlockingError(null);
            if (data.questionIds.length > 0) {
              setPoolEmptyCopy(null);
              setPhase("ready");
            } else {
              setPoolEmptyCopy(examPoolEmptyCopy(undefined));
              setPhase("empty");
            }
            return;
          }
        }

        const start = await fetch("/api/exams/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: examId ?? undefined,
            questionTag: questionTag ?? undefined,
            hydrate: "window",
          }),
          signal: ac.signal,
        });
        let payload = {} as {
          sessionId?: string;
          examId?: string | null;
          questionIds?: string[];
          questions?: ExamQuestion[];
          poolEmpty?: boolean;
          code?: string;
          diagnostics?: ExamStartEmptyDiagnostics;
        };
        try {
          payload = (await start.json()) as typeof payload;
        } catch {
          /* ignore */
        }
        if (!start.ok) {
          if (!cancelled) {
            setBlockingError(examStartFailureMessage(start.status, payload.code));
            setPhase("error");
          }
          return;
        }
        if (cancelled) return;
        if (!payload.sessionId || payload.poolEmpty || !payload.questionIds?.length) {
          setPoolEmptyCopy(examPoolEmptyCopy(payload.diagnostics));
          setPhase("empty");
          return;
        }
        setBlockingError(null);
        setPoolEmptyCopy(null);
        setSessionId(payload.sessionId);
        setResolvedExamId(payload.examId ?? examId);
        setQuestionIds(payload.questionIds);
        setCurrentIndex(0);
        setAnswers({});
        const seed: Record<string, ExamQuestion> = {};
        if (payload.questions?.[0]) {
          seed[payload.questions[0].id] = payload.questions[0];
        }
        setCache(seed);
        setPhase("ready");
        localStorage.setItem(STORAGE_SESSION, payload.sessionId);
        localStorage.setItem(STORAGE_EXAM, payload.examId ?? examId ?? "");
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === "AbortError")) return;
        setBlockingError("Could not reach the server to start this session. Check your connection and retry.");
        setPhase("error");
      }
    }

    void boot();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [examId, questionTag, sessionNamespace]);

  const qid = questionIds[currentIndex];
  const q = qid ? cache[qid] : undefined;

  async function submitExam() {
    const examIdForSubmit = resolvedExamId ?? examId;
    if (!sessionId || !examIdForSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examIdForSubmit,
          sessionId,
          answers,
        }),
      });
      const data = (await res.json()) as { attempt?: { score: number; total: number }; error?: string };
      if (!res.ok) {
        setBlockingError("We couldn’t record this attempt. Check your connection or try again shortly.");
        setPhase("error");
        return;
      }
      if (data.attempt) {
        setDone({ score: data.attempt.score, total: data.attempt.total });
        localStorage.removeItem(STORAGE_SESSION);
        localStorage.removeItem(STORAGE_EXAM);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "loading") {
    return <p className="text-sm text-muted">Preparing your practice session…</p>;
  }

  if (phase === "error") {
    return (
      <div className="nn-card mt-4 space-y-3 p-6">
        <p className="text-sm text-muted">
          {blockingError ??
            "We could not load the exam session. Check your connection and retry."}
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
    return (
      <div className="nn-card mt-4 space-y-4 p-6">
        <p className="font-semibold">Attempt recorded</p>
        <p className="text-sm text-muted">
          Score: {done.score}/{done.total}
        </p>
        <p className="text-sm text-muted">
          Review misses in the question bank, then reinforce weak systems with{" "}
          <Link href="/exam-lessons" className="font-medium text-primary underline">
            exam-specific lessons
          </Link>{" "}
          for your pathway.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/app/questions"
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
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

  if (!q && (qLoading || !qid)) {
    return (
      <div className="nn-card mt-6 space-y-3 p-6">
        {examTitle ? <p className="text-sm font-medium text-muted">{examTitle}</p> : null}
        <p className="text-sm text-muted">Loading question…</p>
      </div>
    );
  }

  if (!q) {
    return null;
  }

  const opts = parseOptions(q.options);
  const raw = answers[q.id];

  return (
    <div className="nn-card mt-6 space-y-4 p-6">
      {examTitle ? <p className="text-sm font-medium text-muted">{examTitle}</p> : null}
      <p className="text-xs text-muted">
        Question {currentIndex + 1} of {total}
      </p>
      <p className="text-base font-medium">{q.stem}</p>

      {q.questionType === "SATA" ? (
        <ul className="space-y-2">
          {opts.map((label) => {
            const selected = Array.isArray(raw) ? raw.includes(label) : false;
            return (
              <li key={label}>
                <label className="flex cursor-pointer items-start gap-2 text-sm">
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
                  raw === label ? "border-primary bg-primary/10" : "border-border hover:bg-primary/5"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        >
          Back
        </button>
        {currentIndex < total - 1 ? (
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={submitting}
            onClick={() => void submitExam()}
          >
            {submitting ? "Submitting…" : "Submit exam"}
          </button>
        )}
      </div>
      <p className="text-xs text-muted">Progress saves automatically. You can refresh and resume this session.</p>
    </div>
  );
}
