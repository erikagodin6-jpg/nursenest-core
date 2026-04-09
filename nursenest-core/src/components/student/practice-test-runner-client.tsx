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
  const committedCount = linearCommittedIds.length;
  const committedAnsweredPct = total > 0 ? Math.round((committedCount / total) * 100) : 0;

  const hasMeaningfulAnswer = (qid: string): boolean => {
    const v = answers[qid];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };

  function linearPracticeMcqClasses(canonical: string): string {
    const selected = raw === canonical;
    const base =
      "nn-qopt-surface min-h-[3.25rem] w-full px-4 py-4 text-left text-base font-normal leading-relaxed text-[var(--theme-body-text)] transition sm:min-h-[3.5rem] sm:px-5";
    const idle = "nn-qopt-surface--interactive";
    const picked = "nn-qopt-surface--selected";
    if (isLinearEngine && currentCommitted && linearDelivery === "exam") {
      return `${base} cursor-default opacity-90 nn-qopt-surface--dim ${
        selected ? "ring-1 ring-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] opacity-100" : ""
      }`;
    }
    if (
      !isLinearEngine ||
      linearDelivery !== "practice" ||
      !linearFeedback ||
      !current ||
      !currentCommitted
    ) {
      return `${base} ${selected ? picked : idle}`;
    }
    const ck = new Set(linearFeedback.correctKeys);
    const ok = ck.has(canonical);
    if (ok) {
      return `${base} nn-qopt-surface--correct font-medium`;
    }
    if (selected) {
      return `${base} nn-qopt-surface--incorrect font-medium`;
    }
    return `${base} nn-qopt-surface--dim`;
  }

  function linearPracticeSataClasses(canonical: string, selected: boolean): string {
    const base =
      "flex min-h-[3.25rem] items-start gap-3 px-4 py-3.5 text-base leading-relaxed transition sm:min-h-[3.5rem] nn-qopt-surface";
    const idleUnsel = "nn-qopt-surface--interactive cursor-pointer";
    const idleSel = "nn-qopt-surface--interactive nn-qopt-surface--selected cursor-pointer";
    if (isLinearEngine && currentCommitted && linearDelivery === "exam") {
      return `${base} cursor-default nn-qopt-surface--dim ${
        selected ? "ring-1 ring-[color-mix(in_srgb,var(--theme-primary)_12%,transparent)]" : ""
      }`;
    }
    if (
      !isLinearEngine ||
      linearDelivery !== "practice" ||
      !linearFeedback ||
      !current ||
      !currentCommitted
    ) {
      return `${base} ${selected ? idleSel : idleUnsel}`;
    }
    const ck = new Set(linearFeedback.correctKeys);
    const ok = ck.has(canonical);
    if (ok) {
      return `${base} cursor-default nn-qopt-surface--correct`;
    }
    if (selected && !ok) {
      return `${base} cursor-default nn-qopt-surface--incorrect`;
    }
    return `${base} cursor-default nn-qopt-surface--dim`;
  }

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
              <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                Item {idx + 1} of {total}
              </p>
            }
            center={<span className="nn-marketing-caption text-[var(--theme-muted-text)]">Loading</span>}
            right={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
          />
          {total > 0 ? <ExamProgressBar current={idx + 1} total={total} /> : null}
          <div className="nn-question-session space-y-4">
            <div className="h-4 w-[75%] animate-pulse rounded-md bg-muted/60" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
            <div className="h-4 w-[83%] animate-pulse rounded-md bg-muted/60" />
            <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">Loading question…</p>
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
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {catMode ? "Adaptive item" : "Item"} {idx + 1} of {total}
                  {isLinearEngine ? (
                    <span className="mt-1 block normal-case nn-marketing-caption font-normal text-[var(--theme-muted-text)]">
                      {committedAnsweredPct}% submitted · {committedCount}/{total} answered
                    </span>
                  ) : null}
                  {catMode ? (
                    <span className="mt-1 block normal-case nn-marketing-caption font-normal text-[var(--theme-muted-text)]">
                      Up to {catMaxCap} scored (variable stop)
                    </span>
                  ) : null}
                </p>
                {saving ? <p className="mt-1 nn-marketing-caption text-[var(--theme-muted-text)]">Saving…</p> : null}
              </div>
            }
            center={
              <span className="line-clamp-2 normal-case">
                {isLinearEngine
                  ? linearDelivery === "exam"
                    ? "Linear exam"
                    : "Linear practice"
                  : catMode
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
          <div className="nn-question-session space-y-6">
            <p className="nn-marketing-body-sm leading-relaxed text-[var(--theme-muted-text)]">
              {isLinearEngine
                ? linearDelivery === "exam"
                  ? "Exam delivery: submit each answer to lock it in. Rationales and correct keys stay hidden until you finish the whole test."
                  : "Practice delivery: submit each answer to see whether you were right, the rationale, and the correct option(s) before you continue."
                : catMode
                  ? examSimulation
                    ? aanpNpExamSim
                      ? "AANP-style NP band (75–150) with adaptive stop rules on this server. The live AANP exam is not CAT. Rationales unlock after completion."
                      : "NCLEX-style length band (75–145) and stop rules on this server. Not the live NCLEX. Rationales unlock after completion."
                    : "Each response updates difficulty. Explanations and coaching appear after the session."
                  : "Pacing practice only. Not a copy of any official exam interface."}
            </p>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="border-b border-border/70 px-4 py-2.5 nn-marketing-caption text-[var(--theme-muted-text)] sm:px-5">
                {current.topic ? (
                  <span className="font-semibold text-[var(--theme-heading-text)]">{current.topic}</span>
                ) : null}
                {current.subtopic ? <span className="ml-2">· {current.subtopic}</span> : null}
                {current.difficulty != null ? (
                  <span className="ml-2">· {difficultyBandLabel(current.difficulty)}</span>
                ) : null}
              </div>
              <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
                <div className="nn-question-stem-wrap min-h-0">
                  <p className="nn-question-stem">{current.stem}</p>
                </div>
                {isSata ? (
                  <ul className="space-y-3">
                    {optsCanonical.map((canonical, i) => {
                      const label = optsDisplay[i] ?? canonical;
                      const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
                      const locked = isLinearEngine && currentCommitted;
                      return (
                        <li key={canonical}>
                          <label className={linearPracticeSataClasses(canonical, selected)}>
                            <input
                              type="checkbox"
                              disabled={locked}
                              checked={selected}
                              onChange={(e) => {
                                const prev = Array.isArray(raw) ? [...raw] : [];
                                const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
                                setAnswerForCurrent(next);
                              }}
                              className="mt-1 size-[1.125rem] shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 sm:size-4"
                            />
                            <span className="text-[var(--theme-body-text)]">{label}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="space-y-3">
                    {optsCanonical.map((canonical, i) => {
                      const label = optsDisplay[i] ?? canonical;
                      const locked = isLinearEngine && currentCommitted;
                      return (
                        <li key={canonical}>
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() => setAnswerForCurrent(canonical)}
                            className={linearPracticeMcqClasses(canonical)}
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

            {isLinearEngine && linearDelivery === "practice" && currentCommitted && linearFeedback ? (
              <details className="nn-question-rationale-card group" open={!linearFeedback.isCorrect}>
                <summary
                  className={`nn-question-rationale-card__verdict flex cursor-pointer list-none items-center justify-between gap-3 outline-none marker:hidden [&::-webkit-details-marker]:hidden ${
                    linearFeedback.isCorrect
                      ? "nn-question-rationale-card__verdict--ok"
                      : "nn-question-rationale-card__verdict--miss"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold sm:text-base ${
                      linearFeedback.isCorrect ? "text-[var(--role-success-text)]" : "text-[var(--theme-heading-text)]"
                    }`}
                  >
                    {linearFeedback.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                  <span className="shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:hidden">
                    Show rationale
                  </span>
                  <span className="hidden shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:inline">
                    Hide rationale
                  </span>
                </summary>
                <div className="nn-question-rationale-card__body nn-marketing-body-sm px-4 py-4 sm:px-6 sm:py-5">
                  {linearFeedback.rationale ? (
                    <p className="leading-relaxed text-[var(--theme-body-text)]">{linearFeedback.rationale}</p>
                  ) : (
                    <p className="text-[var(--theme-muted-text)]">No rationale on file for this item.</p>
                  )}
                </div>
              </details>
            ) : null}
            {isLinearEngine && linearDelivery === "exam" && currentCommitted ? (
              <p className="rounded-xl border border-border/80 bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] px-4 py-3 nn-marketing-body-sm text-[var(--theme-muted-text)]">
                Answer submitted and locked. Use <span className="font-medium text-[var(--theme-heading-text)]">Next</span>{" "}
                to continue.
              </p>
            ) : null}

            <div className="nn-question-nav-actions border-t-0 pt-0">
              <button
                type="button"
                aria-pressed={Boolean(flagged[current.id])}
                className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  flagged[current.id]
                    ? "border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_7%,var(--theme-card-bg))] text-[var(--theme-heading-text)]"
                    : "border-border text-[var(--theme-muted-text)] hover:bg-muted/40"
                }`}
                onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
              >
                {flagged[current.id] ? "Marked for review" : "Mark for review"}
              </button>
            </div>

            <div className="nn-question-nav-actions">
              <button
                type="button"
                disabled={idx === 0 || catMode || isLinearEngine}
                className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-semibold disabled:opacity-40"
                onClick={() => void goPrev()}
              >
                Previous
              </button>
              {catMode ? (
                idx < total - 1 ? (
                  <button
                    type="button"
                    className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none"
                    onClick={() => void goNext()}
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none"
                      onClick={() => void catAdvance()}
                    >
                      {saving ? "Working…" : "Next question"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-semibold"
                      onClick={() => void submitTest()}
                    >
                      End session
                    </button>
                  </>
                )
              ) : (
                <>
                  {isLinearEngine && !currentCommitted ? (
                    <button
                      type="button"
                      disabled={saving || !hasMeaningfulAnswer(current.id)}
                      className="nn-btn-primary min-h-[3rem] rounded-full px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void submitLinearCommit()}
                    >
                      {saving ? "Submitting…" : "Submit answer"}
                    </button>
                  ) : null}
                  {idx < total - 1 ? (
                    <button
                      type="button"
                      disabled={isLinearEngine && !currentCommitted}
                      className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void goNext()}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={saving || (isLinearEngine && !currentCommitted)}
                      className="nn-btn-primary nn-question-nav-actions__next rounded-full px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void submitTest()}
                    >
                      {saving ? "Submitting…" : "Submit test"}
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-medium text-[var(--theme-muted-text)]"
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
