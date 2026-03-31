"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { difficultyBandLabel } from "@/lib/questions/difficulty-label";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

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

export function PracticeTestRunnerClient({ testId }: { testId: string }) {
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
          {results.estimatedAbility != null ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Estimated ability (θ):{" "}
              <span className="font-medium tabular-nums text-foreground">{results.estimatedAbility.toFixed(2)}</span>
              {results.abilityStdError != null ? (
                <>
                  {" "}
                  · Standard error:{" "}
                  <span className="font-medium tabular-nums text-foreground">{results.abilityStdError.toFixed(2)}</span>
                </>
              ) : null}
            </p>
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {catMode ? (
            <>
              Adaptive item {idx + 1} of {total} delivered
              {testConfig?.catMaxQuestions != null ? (
                <span className="text-muted-foreground"> · up to {testConfig.catMaxQuestions} max</span>
              ) : null}
            </>
          ) : (
            <>
              Question {idx + 1} of {total}
            </>
          )}
          {saving ? <span className="ml-2 text-xs">Saving…</span> : null}
        </p>
        {timedMode && remainingSec != null ? (
          <p className={`text-sm font-semibold tabular-nums ${remainingSec < 120 ? "text-red-600" : "text-foreground"}`}>
            {Math.floor(remainingSec / 60)}:{String(remainingSec % 60).padStart(2, "0")} left
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Untimed</p>
        )}
      </div>

      {catMode && (adaptiveTheta != null || adaptiveSe != null) ? (
        <div className="nn-card border-primary/20 bg-primary/[0.06] px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">Adaptive estimate</p>
          <p className="mt-1 text-muted-foreground">
            θ (ability):{" "}
            <span className="font-mono tabular-nums text-foreground">
              {adaptiveTheta != null ? adaptiveTheta.toFixed(2) : "—"}
            </span>
            {" · "}
            Confidence (SE):{" "}
            <span className="font-mono tabular-nums text-foreground">{adaptiveSe != null ? adaptiveSe.toFixed(2) : "—"}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Difficulty shifts after each item; weak areas from recent exams get extra priority in the pool.
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-[var(--theme-card-bg)] shadow-sm">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {current.topic ? (
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-medium text-primary">{current.topic}</span>
            ) : null}
            {current.subtopic ? (
              <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-sky-900 dark:text-sky-100">{current.subtopic}</span>
            ) : null}
            {current.difficulty != null ? (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5">{difficultyBandLabel(current.difficulty)}</span>
            ) : null}
            {current.exam ? <span className="text-muted-foreground">{current.exam}</span> : null}
          </div>
        </div>
        <div className="space-y-4 p-5 md:p-6">
          <p className="text-base font-medium leading-relaxed">{current.stem}</p>
          {isSata ? (
            <ul className="space-y-2">
              {opts.map((label) => {
                const selected = Array.isArray(raw) ? raw.includes(label) : false;
                return (
                  <li key={label}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted/40">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const prev = Array.isArray(raw) ? [...raw] : [];
                          const next = e.target.checked ? [...prev, label] : prev.filter((x) => x !== label);
                          setAnswerForCurrent(next);
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
                    onClick={() => setAnswerForCurrent(label)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      raw === label ? "border-2 border-primary bg-primary/10" : "border border-border hover:bg-muted/40"
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={idx === 0 || catMode}
          className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
          onClick={() => void goPrev()}
        >
          Previous
        </button>
        {catMode ? (
          idx < total - 1 ? (
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => void goNext()}
            >
              Next
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={saving}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                onClick={() => void catAdvance()}
              >
                {saving ? "Working…" : "Next question"}
              </button>
              <button
                type="button"
                disabled={saving}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium"
                onClick={() => void submitTest()}
              >
                End session
              </button>
            </>
          )
        ) : idx < total - 1 ? (
          <button
            type="button"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => void goNext()}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => void submitTest()}
          >
            {saving ? "Submitting…" : "Submit test"}
          </button>
        )}
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          onClick={() => void abandon()}
        >
          Abandon
        </button>
      </div>
    </div>
  );
}
