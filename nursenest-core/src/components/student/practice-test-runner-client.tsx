"use client";

import { LearnerNoteScope } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ExamProgressBar,
  ExamSessionShell,
  ExamSessionTopBar,
  ExamTimerReadout,
} from "@/components/exam/exam-session-shell";
import { difficultyBandLabel } from "@/lib/questions/difficulty-label";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";

type QRow = {
  id: string;
  stem: string;
  questionType: string;
  options: unknown;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: number | null;
  exam?: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

export function PracticeTestRunnerClient({
  testId,
  userId,
  userLabel,
  protectionFlags,
}: {
  testId: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
}) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QRow[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<string>("IN_PROGRESS");
  const [results, setResults] = useState<PracticeTestResultsJson | null>(null);
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);
  const [savedElapsedMs, setSavedElapsedMs] = useState<number | null>(null);
  const [testConfig, setTestConfig] = useState<PracticeTestConfigJson | null>(null);
  const [catMode, setCatMode] = useState(false);
  const [adaptiveTheta, setAdaptiveTheta] = useState<number | null>(null);
  const [adaptiveSe, setAdaptiveSe] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  /** Session-local only — helps pacing habits; not sent to the server. */
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const autoSubmitRef = useRef(false);
  const answersRef = useRef<Record<string, unknown>>({});
  const idxRef = useRef(0);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  const load = useCallback(async () => {
    setPhase("loading");
    setError(null);
    autoSubmitRef.current = false;
    try {
      const res = await fetch(`/api/practice-tests/${testId}`);
      const data = (await res.json()) as {
        error?: string;
        questions?: QRow[];
        answers?: Record<string, unknown>;
        cursorIndex?: number;
        status?: string;
        results?: PracticeTestResultsJson | null;
        timedMode?: boolean;
        timeLimitSec?: number | null;
        elapsedMs?: number | null;
        startedAt?: string;
        config?: PracticeTestConfigJson;
        catMode?: boolean;
        adaptiveState?: { theta?: number; se?: number } | null;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load test.");
      setQuestions(data.questions ?? []);
      setAnswers((data.answers ?? {}) as Record<string, unknown>);
      setIdx(typeof data.cursorIndex === "number" ? data.cursorIndex : 0);
      setStatus(data.status ?? "IN_PROGRESS");
      setResults(data.results ?? null);
      setTimedMode(Boolean(data.timedMode));
      setTimeLimitSec(data.timeLimitSec ?? null);
      setSavedElapsedMs(typeof data.elapsedMs === "number" ? data.elapsedMs : null);
      setSessionStartMs(data.startedAt ? new Date(data.startedAt).getTime() : Date.now());
      setTestConfig(data.config ?? null);
      setCatMode(Boolean(data.catMode));
      const ast = data.adaptiveState;
      setAdaptiveTheta(typeof ast?.theta === "number" ? ast.theta : null);
      setAdaptiveSe(typeof ast?.se === "number" ? ast.se : null);
      if (data.status === "IN_PROGRESS" && data.timedMode && data.timeLimitSec) {
        const usedSec = data.elapsedMs != null ? Math.floor(data.elapsedMs / 1000) : 0;
        setRemainingSec(Math.max(0, data.timeLimitSec - usedSec));
      } else {
        setRemainingSec(null);
      }
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setPhase("error");
    }
  }, [testId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (phase !== "ready" || !timedMode || status !== "IN_PROGRESS") return;
    const t = window.setInterval(() => {
      setRemainingSec((r) => {
        if (r == null || r <= 0) return 0;
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, timedMode, status]);

  const submitTest = useCallback(
    async (fromTimer = false) => {
      if (fromTimer && autoSubmitRef.current) return;
      if (fromTimer) autoSubmitRef.current = true;
      setSaving(true);
      try {
        const elapsedMs =
          sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
        const res = await fetch(`/api/practice-tests/${testId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "complete",
            answers: answersRef.current,
            cursorIndex: idxRef.current,
            ...(elapsedMs !== undefined ? { elapsedMs } : {}),
          }),
        });
        const data = (await res.json()) as { results?: PracticeTestResultsJson; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Could not submit.");
        setResults(data.results ?? null);
        setStatus("COMPLETED");
        setSavedElapsedMs(elapsedMs ?? null);
        if (fromTimer) setRemainingSec(0);
      } catch (e) {
        if (fromTimer) autoSubmitRef.current = false;
        setError(e instanceof Error ? e.message : "Submit failed");
      } finally {
        setSaving(false);
      }
    },
    [sessionStartMs, testId],
  );

  useEffect(() => {
    if (remainingSec !== 0 || status !== "IN_PROGRESS" || !timedMode) return;
    void submitTest(true);
  }, [remainingSec, status, timedMode, submitTest]);

  const current = questions[idx];
  const total = questions.length;
  const opts = useMemo(() => (current ? parseOptions(current.options) : []), [current]);

  const isSata =
    current &&
    (current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY");
  const raw = current ? answers[current.id] : undefined;

  async function persistSave(nextAnswers: Record<string, unknown>, nextIdx: number) {
    setSaving(true);
    try {
      const elapsedMs =
        sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
      await fetch(`/api/practice-tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          answers: nextAnswers,
          cursorIndex: nextIdx,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function abandon() {
    if (!window.confirm("Abandon this test? Progress is saved but marked abandoned.")) return;
    setSaving(true);
    try {
      const elapsedMs =
        sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
      await fetch(`/api/practice-tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "abandon",
          answers,
          cursorIndex: idx,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        }),
      });
      window.location.href = "/app/practice-tests";
    } finally {
      setSaving(false);
    }
  }

  function setAnswerForCurrent(next: unknown) {
    if (!current) return;
    const nextAnswers = { ...answers, [current.id]: next };
    setAnswers(nextAnswers);
    void persistSave(nextAnswers, idx);
  }

  async function catAdvance() {
    setSaving(true);
    try {
      const elapsedMs =
        sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
      const res = await fetch(`/api/practice-tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cat_advance",
          answers,
          cursorIndex: idx,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        }),
      });
      const data = (await res.json()) as {
        results?: PracticeTestResultsJson;
        error?: string;
        catAdvanced?: boolean;
        catCompleted?: boolean;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not advance.");
      if (data.results) {
        setResults(data.results);
        setStatus("COMPLETED");
        setSavedElapsedMs(elapsedMs ?? null);
      } else if (data.catAdvanced) {
        await load();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Advance failed");
    } finally {
      setSaving(false);
    }
  }

  async function goNext() {
    if (catMode && idx >= total - 1) {
      await catAdvance();
      return;
    }
    if (idx >= total - 1) return;
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    await persistSave(answers, nextIdx);
  }

  async function goPrev() {
    if (catMode) return;
    if (idx <= 0) return;
    const nextIdx = idx - 1;
    setIdx(nextIdx);
    await persistSave(answers, nextIdx);
  }

  if (phase === "loading") {
    return <p className="text-sm text-muted-foreground">Loading test…</p>;
  }
  if (phase === "error") {
    return (
      <div className="nn-card p-6 text-sm text-muted-foreground">
        <p>{error ?? "Error"}</p>
        <Link className="mt-2 inline-block font-medium text-primary" href="/app/practice-tests">
          Back to test bank
        </Link>
      </div>
    );
  }

  if (status === "COMPLETED" && results) {
    const elapsedDisplay =
      savedElapsedMs != null
        ? `${Math.floor(savedElapsedMs / 60000)}m ${Math.round((savedElapsedMs % 60000) / 1000)}s`
        : "—";
    return (
      <div className="space-y-6">
        <div className="nn-card p-6">
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Test complete</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {results.scoreCorrect}/{results.scoreTotal}{" "}
            <span className="text-lg font-semibold text-muted-foreground">({results.accuracyPct}%)</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Time taken: <span className="font-medium text-foreground">{elapsedDisplay}</span>
            {timedMode && timeLimitSec != null ? (
              <> · Limit {Math.round(timeLimitSec / 60)} min</>
            ) : (
              <> · Untimed</>
            )}
          </p>
          {results.readinessLabel != null ? (
            <p className="mt-3 text-lg font-semibold text-foreground">
              Readiness: {results.readinessLabel}
            </p>
          ) : null}
          {results.catReport ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Classification:{" "}
              <span className="font-semibold capitalize text-foreground">{results.catReport.decision}</span>
              {results.catReport.stoppedReason !== "completed" ? (
                <>
                  {" "}
                  · Stopped: <span className="text-foreground">{results.catReport.stoppedReason.replace(/_/g, " ")}</span>
                </>
              ) : null}
            </p>
          ) : null}
          {results.estimatedAbility != null ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated ability (θ):{" "}
              <span className="font-medium tabular-nums text-foreground">{results.estimatedAbility.toFixed(2)}</span>
              {results.abilityStdError != null ? (
                <>
                  {" "}
                  · Standard error (confidence):{" "}
                  <span className="font-medium tabular-nums text-foreground">{results.abilityStdError.toFixed(2)}</span>
                </>
              ) : null}
            </p>
          ) : null}
          {results.catReport?.suggestedNextSteps?.length ? (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next steps</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {results.catReport.suggestedNextSteps.map((line) => (
                  <li key={line.slice(0, 120)}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="nn-card p-6">
          <h3 className="font-semibold text-foreground">Breakdown by topic</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(results.byTopic).map(([topic, { correct, total: tt }]) => (
              <li key={topic} className="flex justify-between gap-2 border-b border-border/50 py-1">
                <span>{topic}</span>
                <span className="tabular-nums text-muted-foreground">
                  {correct}/{tt} ({tt > 0 ? Math.round((correct / tt) * 100) : 0}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
        {results.weakAreas.length > 0 ? (
          <div className="nn-card border-amber-200/60 bg-amber-50/40 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
            <h3 className="font-semibold text-foreground">Weak areas</h3>
            <p className="mt-1 text-sm text-muted-foreground">Topics with at least one mistake in this run.</p>
            <ul className="mt-2 list-inside list-disc text-sm">
              {results.weakAreas.map((w) => (
                <li key={w}>
                  <Link className="text-primary underline" href={`/app/questions?topic=${encodeURIComponent(w)}`}>
                    {w}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <StudyNotesPanel
          userId={userId}
          scope={LearnerNoteScope.PRACTICE_TEST}
          contextId={testId}
          topic={results.weakAreas[0] ?? null}
          sourceLabel={`Practice test ${testId.slice(0, 8)}…`}
          userLabel={userLabel}
          flags={protectionFlags}
        />
        <Link
          href="/app/practice-tests"
          className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to test bank
        </Link>
      </div>
    );
  }

  if (status === "ABANDONED") {
    return (
      <p className="text-sm text-muted-foreground">
        This test was abandoned.{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          Back to test bank
        </Link>
      </p>
    );
  }

  if (phase === "ready" && status === "IN_PROGRESS" && questions.length === 0) {
    return (
      <div className="nn-card space-y-3 p-6 text-sm">
        <p className="font-medium text-foreground">No questions in this practice test.</p>
        <p className="text-muted-foreground">
          The pool may have been empty for your filters and tier, or the test was saved in an incomplete state. Start a
          new adaptive (CAT) or linear test from the list—broaden topics or difficulty if you see this again.
        </p>
        <Link className="inline-block font-semibold text-primary underline" href="/app/practice-tests">
          Back to practice tests
        </Link>
      </div>
    );
  }

  if (status !== "IN_PROGRESS" || !current) {
    return (
      <p className="text-sm text-muted-foreground">
        This test is not in progress.{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          Back
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags}>
        <ExamSessionShell neutralPalette>
          <ExamSessionTopBar
            left={
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {catMode ? "Adaptive item" : "Item"} {idx + 1} of {total}
                </p>
                {saving ? <p className="mt-0.5 text-xs text-slate-500">Saving…</p> : null}
              </div>
            }
            center={
              <span className="line-clamp-2 normal-case">
                {catMode ? "Computer-adaptive (practice)" : "Practice test"}
              </span>
            }
            right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
          />
          <ExamProgressBar current={idx + 1} total={total} />
          <div className="space-y-5 p-5 md:p-6">
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {catMode
                ? "Each response updates difficulty. Explanations and coaching appear after the session."
                : "Pacing practice only—not a copy of any official exam interface."}
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50">
              <div className="border-b border-slate-200 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-400">
                {current.topic ? <span className="font-medium text-slate-700 dark:text-slate-200">{current.topic}</span> : null}
                {current.subtopic ? <span className="ml-2 text-slate-500">· {current.subtopic}</span> : null}
                {current.difficulty != null ? (
                  <span className="ml-2 text-slate-500">· {difficultyBandLabel(current.difficulty)}</span>
                ) : null}
              </div>
              <div className="space-y-4 p-5 md:p-6">
                <div className="min-h-[4rem] border-b border-slate-200/80 pb-4 dark:border-slate-700/80">
                  <p className="text-base font-normal leading-[1.65] text-slate-900 dark:text-slate-100">{current.stem}</p>
                </div>
                {isSata ? (
                  <ul className="space-y-2">
                    {opts.map((label) => {
                      const selected = Array.isArray(raw) ? raw.includes(label) : false;
                      return (
                        <li key={label}>
                          <label
                            className={`flex min-h-[2.75rem] cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-snug transition ${
                              selected
                                ? "border-primary/45 bg-primary/[0.05] ring-1 ring-primary/25 dark:bg-primary/[0.07]"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-slate-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(e) => {
                                const prev = Array.isArray(raw) ? [...raw] : [];
                                const next = e.target.checked ? [...prev, label] : prev.filter((x) => x !== label);
                                setAnswerForCurrent(next);
                              }}
                              className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary/30"
                            />
                            <span className="text-slate-800 dark:text-slate-100">{label}</span>
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
                          onClick={() => setAnswerForCurrent(label)}
                          className={`min-h-[2.75rem] w-full rounded-lg border px-4 py-3 text-left text-sm leading-snug transition ${
                            raw === label
                              ? "border-primary/50 bg-primary/[0.05] font-medium text-slate-900 ring-1 ring-primary/30 dark:text-slate-50"
                              : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-100 dark:hover:border-slate-600"
                          }`}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-800">
              <button
                type="button"
                aria-pressed={Boolean(flagged[current.id])}
                className={`inline-flex items-center rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  flagged[current.id]
                    ? "border-primary/35 bg-primary/[0.07] text-slate-800 dark:text-slate-100"
                    : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
              >
                {flagged[current.id] ? "Marked for review" : "Mark for review"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-800">
              <button
                type="button"
                disabled={idx === 0 || catMode}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-900"
                onClick={() => void goPrev()}
              >
                Previous
              </button>
              {catMode ? (
                idx < total - 1 ? (
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                    onClick={() => void goNext()}
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                      onClick={() => void catAdvance()}
                    >
                      {saving ? "Working…" : "Next question"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                      onClick={() => void submitTest()}
                    >
                      End session
                    </button>
                  </>
                )
              ) : idx < total - 1 ? (
                <button
                  type="button"
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                  onClick={() => void goNext()}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
                  onClick={() => void submitTest()}
                >
                  {saving ? "Submitting…" : "Submit test"}
                </button>
              )}
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-900"
                onClick={() => void abandon()}
              >
                Abandon
              </button>
            </div>
          </div>
        </ExamSessionShell>
      </ProtectedPremiumContent>
    </div>
  );
}
