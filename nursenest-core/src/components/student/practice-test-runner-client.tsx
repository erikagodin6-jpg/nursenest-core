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
import { PracticeTestTeachingReviewPanel } from "@/components/student/practice-test-teaching-review-panel";
import { PracticeTestStudyLoopNext } from "@/components/student/practice-test-study-loop-next";
import type { PracticeTestTeachingItem } from "@/lib/practice-tests/build-teaching-review";
import { getLinearCommittedQuestionIds } from "@/lib/practice-tests/practice-linear-engine";

type QRow = {
  id: string;
  stem: string;
  questionType: string;
  options: unknown;
  displayOptions?: string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: number | null;
  exam?: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

const MAX_PRACTICE_QUESTION_CACHE = 32;

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
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [questionCache, setQuestionCache] = useState<Record<string, QRow>>({});
  const [qLoading, setQLoading] = useState(false);
  const cacheRef = useRef<Record<string, QRow>>({});
  cacheRef.current = questionCache;
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
  const [teachingReviewItems, setTeachingReviewItems] = useState<PracticeTestTeachingItem[] | null>(null);
  const [teachingReviewLoading, setTeachingReviewLoading] = useState(false);
  /** Bumps when user retries a failed per-question fetch (effect deps exclude full cache). */
  const [questionFetchNonce, setQuestionFetchNonce] = useState(0);
  /** Session-local only — helps pacing habits; not sent to the server. */
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  /** Linear exam engine: server-persisted committed items (`adaptiveState.linearEngine`). */
  const [linearCommittedIds, setLinearCommittedIds] = useState<string[]>([]);
  /** Practice-mode per-question feedback after commit (not fully restored on reload). */
  const [linearPracticeFeedback, setLinearPracticeFeedback] = useState<
    Record<string, { isCorrect: boolean; rationale: string | null; correctKeys: string[] }>
  >({});
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
      const res = await fetch(`/api/practice-tests/${testId}?hydrate=minimal`);
      const data = (await res.json()) as {
        error?: string;
        questionIds?: string[];
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
        adaptiveState?: unknown;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load test.");
      const ids =
        Array.isArray(data.questionIds) && data.questionIds.length > 0
          ? data.questionIds.filter((x): x is string => typeof x === "string" && x.length > 4)
          : (data.questions ?? []).map((q) => q.id).filter((x): x is string => typeof x === "string" && x.length > 4);
      setQuestionIds(ids);
      if ((data.questions?.length ?? 0) > 0) {
        const seed: Record<string, QRow> = {};
        for (const q of data.questions!) seed[q.id] = q;
        setQuestionCache(seed);
      } else {
        setQuestionCache({});
      }
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
      setTeachingReviewItems(null);
      const ast = data.adaptiveState;
      const astObj = ast && typeof ast === "object" && !Array.isArray(ast) ? (ast as Record<string, unknown>) : null;
      setAdaptiveTheta(typeof astObj?.theta === "number" ? astObj.theta : null);
      setAdaptiveSe(typeof astObj?.se === "number" ? astObj.se : null);
      setLinearCommittedIds(getLinearCommittedQuestionIds(ast));
      setLinearPracticeFeedback({});
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
    if (phase !== "ready" || status !== "IN_PROGRESS") return;
    const id = questionIds[idx];
    if (!id || cacheRef.current[id]) return;

    const ac = new AbortController();
    setQLoading(true);
    void (async () => {
      try {
        const res = await fetch(`/api/practice-tests/${testId}/question?index=${idx}`, { signal: ac.signal });
        const payload = (await res.json()) as { question?: QRow; error?: string };
        if (!res.ok) {
          if (!ac.signal.aborted) setError(payload.error ?? "Could not load question.");
          return;
        }
        if (payload.question && !ac.signal.aborted) {
          const q = payload.question;
          setQuestionCache((c) => {
            const next = { ...c, [q.id]: q };
            if (Object.keys(next).length <= MAX_PRACTICE_QUESTION_CACHE) return next;
            const half = Math.floor(MAX_PRACTICE_QUESTION_CACHE / 2);
            const lo = Math.max(0, idx - half);
            const hi = Math.min(questionIds.length - 1, idx + half);
            const keep = new Set<string>();
            for (let i = lo; i <= hi; i++) {
              const id = questionIds[i];
              if (id && next[id]) keep.add(id);
            }
            const trimmed: Record<string, QRow> = {};
            for (const id of keep) trimmed[id] = next[id]!;
            return trimmed;
          });
        }
      } catch {
        if (!ac.signal.aborted) setError("Could not load question.");
      } finally {
        if (!ac.signal.aborted) setQLoading(false);
      }
    })();

    return () => ac.abort();
  }, [phase, status, testId, idx, questionIds, questionFetchNonce]);

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
        const cfg = testConfig;
        const linear = cfg && cfg.selectionMode !== "cat" && cfg.linearDeliveryMode;
        if (linear && questionIds.length > 0) {
          const missing = questionIds.filter((id) => !linearCommittedIds.includes(id));
          if (missing.length > 0) {
            if (fromTimer) autoSubmitRef.current = false;
            setSaving(false);
            setError(`Submit all questions first (${missing.length} remaining).`);
            return;
          }
        }
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
    [sessionStartMs, testId, testConfig, questionIds, linearCommittedIds],
  );

  useEffect(() => {
    if (remainingSec !== 0 || status !== "IN_PROGRESS" || !timedMode) return;
    void submitTest(true);
  }, [remainingSec, status, timedMode, submitTest]);

  const qid = questionIds[idx];
  const current = qid ? questionCache[qid] : undefined;
  const total = questionIds.length;
  const examSimulation = testConfig?.catPresentationMode === "exam_simulation";
  const aanpNpExamSim = examSimulation && testConfig?.catExamConfigId === "aanp-np-us";
  const catMaxCap = testConfig?.catMaxQuestions ?? total;
  const optsCanonical = useMemo(() => (current ? parseOptions(current.options) : []), [current]);
  const optsDisplay = useMemo(() => {
    if (!current) return [];
    const d = current.displayOptions;
    if (Array.isArray(d) && d.length === optsCanonical.length) return d.map((x) => String(x));
    return optsCanonical;
  }, [current, optsCanonical]);

  const isSata =
    current &&
    (current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY");
  const raw = current ? answers[current.id] : undefined;

  const linearDelivery = testConfig?.linearDeliveryMode;
  const isLinearEngine = Boolean(!catMode && linearDelivery);
  const committedSet = useMemo(() => new Set(linearCommittedIds), [linearCommittedIds]);
  const currentCommitted = Boolean(current && committedSet.has(current.id));
  const linearFeedback = current ? linearPracticeFeedback[current.id] : undefined;
  const pctComplete = total > 0 ? Math.round(((idx + 1) / total) * 100) : 0;

  const hasMeaningfulAnswer = (qid: string): boolean => {
    const v = answers[qid];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };

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
    if (isLinearEngine && committedSet.has(current.id)) return;
    const nextAnswers = { ...answers, [current.id]: next };
    setAnswers(nextAnswers);
    void persistSave(nextAnswers, idx);
  }

  async function submitLinearCommit() {
    if (!current || !isLinearEngine || currentCommitted) return;
    if (!hasMeaningfulAnswer(current.id)) return;
    setSaving(true);
    try {
      const elapsedMs =
        sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
      const res = await fetch(`/api/practice-tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "linear_commit",
          questionId: current.id,
          answers,
          cursorIndex: idx,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        committedQuestionIds?: string[];
        feedback?: { isCorrect: boolean; rationale: string | null; correctKeys: string[] };
      };
      if (!res.ok) throw new Error(data.error ?? "Could not submit answer.");
      if (Array.isArray(data.committedQuestionIds)) {
        setLinearCommittedIds(data.committedQuestionIds);
      }
      if (data.feedback && linearDelivery === "practice") {
        setLinearPracticeFeedback((prev) => ({
          ...prev,
          [current.id]: {
            isCorrect: data.feedback!.isCorrect,
            rationale: data.feedback!.rationale,
            correctKeys: data.feedback!.correctKeys ?? [],
          },
        }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSaving(false);
    }
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
    if (isLinearEngine && qid && !committedSet.has(qid)) return;
    if (idx >= total - 1) return;
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    await persistSave(answers, nextIdx);
  }

  async function goPrev() {
    if (catMode || isLinearEngine) return;
    if (idx <= 0) return;
    const nextIdx = idx - 1;
    setIdx(nextIdx);
    await persistSave(answers, nextIdx);
  }

  if (phase === "loading") {
    return (
      <div className="nn-card space-y-3 p-6 text-sm text-muted-foreground" aria-busy="true">
        <p className="font-medium text-foreground">Loading test…</p>
        <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
        <p className="text-xs">Restoring session from the server.</p>
      </div>
    );
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

  async function loadTeachingReview() {
    setTeachingReviewLoading(true);
    try {
      const res = await fetch(`/api/practice-tests/${testId}?teachingReview=1`);
      const data = (await res.json()) as { teachingReview?: { items: PracticeTestTeachingItem[] }; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load teaching review.");
        return;
      }
      setTeachingReviewItems(data.teachingReview?.items ?? []);
    } catch {
      setError("Could not load teaching review.");
    } finally {
      setTeachingReviewLoading(false);
    }
  }

  if (status === "COMPLETED" && results) {
    const elapsedDisplay =
      savedElapsedMs != null
        ? `${Math.floor(savedElapsedMs / 60000)}m ${Math.round((savedElapsedMs % 60000) / 1000)}s`
        : "N/A";
    return (
      <div className="space-y-6">
        <div className="nn-card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Results</p>
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">
            {results.catReport && testConfig?.catPresentationMode === "exam_simulation"
              ? "Exam simulation complete"
              : "Test complete"}
          </h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {results.scoreCorrect}/{results.scoreTotal}{" "}
            <span className="text-lg font-semibold text-muted-foreground">({results.accuracyPct}%)</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Correct:</span> {results.scoreCorrect}
            <span className="mx-2 text-border">·</span>
            <span className="font-medium text-foreground">Incorrect:</span>{" "}
            {Math.max(0, results.scoreTotal - results.scoreCorrect)}
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
          <p className="mt-3 text-sm text-muted-foreground">
            <Link className="font-semibold text-primary underline" href={`/app/practice-tests/${testId}/results`}>
              Results summary page
            </Link>{" "}
            (bookmark or share this view; full teaching review stays below.)
          </p>
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

          <div className="mt-4">
            <PracticeTestStudyLoopNext results={results} pathwayId={testConfig?.pathwayId ?? null} />
          </div>
          {results.catReport?.blueprintDiagnostics ? (
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/15 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Blueprint diagnostics (
                {testConfig?.catExamConfigId === "aanp-np-us" ? "AANP-style NP domains" : "NCLEX client-needs coverage"})
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pool mapping rate:{" "}
                <span className="font-medium text-foreground">
                  {Math.round((results.catReport.blueprintDiagnostics.poolMappedFraction ?? 0) * 100)}%
                </span>{" "}
                of eligible items carry a valid blueprint tag in{" "}
                <code className="rounded bg-muted px-1 text-[10px]">nclex_client_needs_category</code>. Session delivered
                (mapped):{" "}
                <span className="font-medium text-foreground">
                  {Math.round((results.catReport.blueprintDiagnostics.sessionMappedFraction ?? 0) * 100)}%
                </span>
                . Unmapped items still run through the same CAT engine using topic or body-system fallback keys for
                balancing.
              </p>
              <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-foreground">Pool counts (by selection key)</p>
                  <ul className="mt-1 max-h-32 space-y-0.5 overflow-y-auto text-muted-foreground">
                    {Object.entries(results.catReport.blueprintDiagnostics.poolCountsByBlueprintKey)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, n]) => (
                        <li key={k} className="flex justify-between gap-2 tabular-nums">
                          <span className="truncate">{k}</span>
                          <span>{n}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">This session</p>
                  <ul className="mt-1 max-h-32 space-y-0.5 overflow-y-auto text-muted-foreground">
                    {Object.entries(results.catReport.blueprintDiagnostics.sessionCountsByBlueprintKey)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, n]) => (
                        <li key={k} className="flex justify-between gap-2 tabular-nums">
                          <span className="truncate">{k}</span>
                          <span>{n}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
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

        <div className="nn-card space-y-3 border border-primary/20 p-6">
          <h3 className="font-semibold text-foreground">Post-exam teaching review</h3>
          <p className="text-sm text-muted-foreground">
            During CAT, rationales stay hidden to mirror exam pacing. After completion, open the full teaching breakdown
            (correct logic, distractors, strategy, and figures when available).
          </p>
          {teachingReviewItems === null ? (
            <button
              type="button"
              disabled={teachingReviewLoading}
              className="rounded-lg bg-role-cta px-4 py-2.5 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
              onClick={() => void loadTeachingReview()}
            >
              {teachingReviewLoading ? "Loading…" : "Open teaching review"}
            </button>
          ) : teachingReviewItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No review items available for this session.</p>
          ) : (
            <PracticeTestTeachingReviewPanel items={teachingReviewItems} />
          )}
        </div>

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
          className="inline-flex rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground"
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

  if (phase === "ready" && status === "IN_PROGRESS" && questionIds.length === 0) {
    return (
      <div className="nn-card space-y-3 p-6 text-sm">
        <p className="font-medium text-foreground">No questions in this practice test.</p>
        <p className="text-muted-foreground">
          The pool may have been empty for your filters and tier, or the test was saved in an incomplete state. Start a
          new adaptive (CAT) or linear test from the list. Broaden topics or difficulty if you see this again.
        </p>
        <Link className="inline-block font-semibold text-primary underline" href="/app/practice-tests">
          Back to practice tests
        </Link>
      </div>
    );
  }

  if (status !== "IN_PROGRESS") {
    return (
      <p className="text-sm text-muted-foreground">
        This test is not in progress.{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          Back
        </Link>
      </p>
    );
  }

  const expectingQuestion =
    phase === "ready" && status === "IN_PROGRESS" && Boolean(questionIds[idx]);

  if (!current && expectingQuestion) {
    if (error && !qLoading) {
      return (
        <div className="nn-card space-y-3 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Could not load this question.</p>
          <p>{error}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              onClick={() => {
                setError(null);
                setQuestionCache((c) => {
                  const id = questionIds[idx];
                  if (!id) return c;
                  const { [id]: _, ...rest } = c;
                  return rest;
                });
                setQuestionFetchNonce((n) => n + 1);
              }}
            >
              Retry this item
            </button>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              onClick={() => void load()}
            >
              Reload test
            </button>
            <Link className="inline-flex items-center font-medium text-primary underline" href="/app/practice-tests">
              Back
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4" aria-busy="true">
        <ExamSessionShell neutralPalette>
          <ExamSessionTopBar
            left={
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Item {idx + 1} of {total}
              </p>
            }
            center={<span className="text-slate-600 dark:text-slate-400">Loading</span>}
            right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
          />
          {total > 0 ? <ExamProgressBar current={idx + 1} total={total} /> : null}
          <div className="space-y-3 p-6">
            <div className="h-4 w-[75%] animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-[83%] animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading question…</p>
          </div>
        </ExamSessionShell>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="nn-card space-y-3 p-6 text-sm text-muted-foreground">
        <p>Could not display this item.</p>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
          onClick={() => void load()}
        >
          Retry
        </button>
        <Link className="ml-2 font-medium text-primary underline" href="/app/practice-tests">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="practice_test">
        <ExamSessionShell neutralPalette>
          <ExamSessionTopBar
            left={
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {catMode ? "Adaptive item" : "Item"} {idx + 1} of {total}
                  {catMode ? (
                    <span className="block normal-case text-[10px] font-normal text-slate-500 dark:text-slate-400">
                      Up to {catMaxCap} scored (variable stop)
                    </span>
                  ) : null}
                </p>
                {saving ? <p className="mt-0.5 text-xs text-slate-500">Saving…</p> : null}
              </div>
            }
            center={
              <span className="line-clamp-2 normal-case">
                {catMode
                  ? examSimulation
                    ? aanpNpExamSim
                      ? "NP exam simulation (AANP-style CAT)"
                      : "NCLEX-RN exam simulation (CAT)"
                    : "Computer-adaptive (practice)"
                  : "Practice test"}
              </span>
            }
            right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
          />
          <ExamProgressBar current={idx + 1} total={total} />
          <div className="space-y-5 p-5 md:p-6">
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {catMode
                ? examSimulation
                  ? aanpNpExamSim
                    ? "AANP-style NP band (75–150) with adaptive stop rules on this server. The live AANP exam is not CAT. Rationales unlock after completion."
                    : "NCLEX-style length band (75–145) and stop rules on this server. Not the live NCLEX. Rationales unlock after completion."
                  : "Each response updates difficulty. Explanations and coaching appear after the session."
                : "Pacing practice only. Not a copy of any official exam interface."}
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
                    {optsCanonical.map((canonical, i) => {
                      const label = optsDisplay[i] ?? canonical;
                      const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
                      return (
                        <li key={canonical}>
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
                                const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
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
                    {optsCanonical.map((canonical, i) => {
                      const label = optsDisplay[i] ?? canonical;
                      return (
                        <li key={canonical}>
                          <button
                            type="button"
                            onClick={() => setAnswerForCurrent(canonical)}
                            className={`min-h-[2.75rem] w-full rounded-lg border px-4 py-3 text-left text-sm leading-snug transition ${
                              raw === canonical
                                ? "border-primary/50 bg-primary/[0.05] font-medium text-slate-900 ring-1 ring-primary/30 dark:text-slate-50"
                                : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-100 dark:hover:border-slate-600"
                            }`}
                          >
                            {label}
                          </button>
                        </li>
                      );
                    })}
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
