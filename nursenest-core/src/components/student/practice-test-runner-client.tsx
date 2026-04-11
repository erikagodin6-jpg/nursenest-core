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
import type {
  CatStudyFeedbackPayload,
  PracticeTestConfigJson,
  PracticeTestResultsJson,
} from "@/lib/practice-tests/types";
import { CatLiveTransparencyStrip } from "@/components/student/cat-live-transparency-strip";
import { CatResultsCoachSection } from "@/components/student/cat-results-coach-section";
import { CatStudyFeedbackPanel } from "@/components/student/cat-study-feedback-panel";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";
import { PracticeTestTeachingReviewPanel } from "@/components/student/practice-test-teaching-review-panel";
import { PracticeTestStudyLoopNext } from "@/components/student/practice-test-study-loop-next";
import type { PracticeTestTeachingItem } from "@/lib/practice-tests/build-teaching-review";
import { getLinearCommittedQuestionIds } from "@/lib/practice-tests/practice-linear-engine";
import { PracticeRationalePanel } from "@/components/study/practice-rationale-panel";
import type { RationalePanelStatus } from "@/components/study/practice-rationale-panel";
import {
  PracticeSessionLayout,
  PracticeTopBar,
  PracticeSessionGrid,
} from "@/components/study/practice-session-layout";
import {
  PracticeQuestionCard,
  PracticeAnswerOptionRow,
} from "@/components/study/practice-question-card";
import type { PracticeOptionState } from "@/components/study/practice-question-card";
import { PracticeRationaleFullPanel } from "@/components/study/practice-rationale-full-panel";
import { CatSessionLayout, CatTopBar, CatContentGrid } from "@/components/study/cat-session-layout";
import { QuestionCard, AnswerOptionRow } from "@/components/study/cat-question-card";
import type { AnswerOptionState } from "@/components/study/cat-question-card";
import { RationalePanel } from "@/components/study/cat-rationale-panel";
import { ResultsSummary } from "@/components/study/cat-results-summary";

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
  const [adaptiveDifficultyHistory, setAdaptiveDifficultyHistory] = useState<number[]>([]);
  const [catLiveTransparency, setCatLiveTransparency] = useState(false);
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
    Record<string, {
      isCorrect: boolean;
      rationale: string | null;
      correctKeys: string[];
      correctAnswerExplanation?: string | null;
      distractorRationalesMap?: Record<string, string> | null;
      keyTakeaway?: string | null;
      relatedLessons?: { title: string; href: string }[];
    }>
  >({});
  /** CAT Study Mode: rationale for the current item after scoring, before the next adaptive pick. */
  const [catStudyFeedback, setCatStudyFeedback] = useState<CatStudyFeedbackPayload | null>(null);
  /** CAT Study Mode: last item explanation before switching to the results layout. */
  const [catFinalStudyFeedback, setCatFinalStudyFeedback] = useState<CatStudyFeedbackPayload | null>(null);
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
      const dhRaw = astObj?.difficultyHistory;
      const dhParsed = Array.isArray(dhRaw)
        ? dhRaw.filter((x): x is number => typeof x === "number" && Number.isFinite(x))
        : [];
      setAdaptiveDifficultyHistory(dhParsed);
      setLinearCommittedIds(getLinearCommittedQuestionIds(ast));
      setLinearPracticeFeedback({});
      setCatFinalStudyFeedback(null);
      const catStudyAwaiting =
        Boolean(data.catMode) &&
        (data.config?.catExamFeedbackMode ?? "test") === "study" &&
        astObj?.catStudyAwaitingContinue === true;
      if (catStudyAwaiting && data.status === "IN_PROGRESS") {
        void (async () => {
          try {
            const fr = await fetch(`/api/practice-tests/${testId}/cat-study-review`);
            const fd = (await fr.json()) as { studyFeedback?: CatStudyFeedbackPayload; error?: string };
            if (fr.ok && fd.studyFeedback) setCatStudyFeedback(fd.studyFeedback);
          } catch {
            /* ignore — user can retry via reload */
          }
        })();
      } else {
        setCatStudyFeedback(null);
      }
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
  const catFeedbackStudy = Boolean(catMode && (testConfig?.catExamFeedbackMode ?? "test") === "study");
  const catStudyLocked =
    catFeedbackStudy &&
    Boolean(catStudyFeedback && current && catStudyFeedback.questionId === current.id && idx === total - 1);
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
    typeof current.questionType === "string" &&
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
      "nn-qopt-surface flex min-h-[3.25rem] w-full items-start gap-3 px-4 py-4 text-left text-base font-normal leading-relaxed text-[var(--theme-body-text)] transition sm:min-h-[3.5rem] sm:px-5";
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
        feedback?: {
          isCorrect: boolean;
          rationale: string | null;
          correctKeys: string[];
          correctAnswerExplanation?: string | null;
          distractorRationalesMap?: Record<string, string> | null;
          keyTakeaway?: string | null;
          relatedLessons?: { title: string; href: string }[];
        };
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
            correctAnswerExplanation: data.feedback!.correctAnswerExplanation ?? null,
            distractorRationalesMap: data.feedback!.distractorRationalesMap ?? null,
            keyTakeaway: data.feedback!.keyTakeaway ?? null,
            relatedLessons: data.feedback!.relatedLessons ?? [],
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
      let data: {
        results?: PracticeTestResultsJson;
        error?: string;
        catAdvanced?: boolean;
        catCompleted?: boolean;
        catStudyReveal?: boolean;
        studyFeedback?: CatStudyFeedbackPayload | null;
      };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        throw new Error("Could not read the server response for this step.");
      }
      if (!res.ok) throw new Error(data.error ?? "Could not advance.");
      if (data.catStudyReveal) {
        await load();
        return;
      }
      if (data.catCompleted && data.results) {
        setSavedElapsedMs(elapsedMs ?? null);
        setResults(data.results);
        if (data.studyFeedback && catFeedbackStudy) {
          setCatFinalStudyFeedback(data.studyFeedback);
        }
        setStatus("COMPLETED");
        return;
      }
      if (data.catAdvanced) {
        setCatStudyFeedback(null);
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
    // CAT study mode: show final item explanation before the summary
    if (catFinalStudyFeedback) {
      return (
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          <div className="nn-cat-question-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              Session complete — final item
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">
              Review before your summary
            </h2>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
              Study Mode: here is the last explanation before your results.
            </p>
            <div className="mt-6">
              <CatStudyFeedbackPanel
                feedback={catFinalStudyFeedback}
                continueLabel="View results summary"
                onContinue={() => setCatFinalStudyFeedback(null)}
                continueDisabled={false}
                pathwayId={testConfig?.pathwayId ?? null}
              />
            </div>
          </div>
        </div>
      );
    }

    // Main results page — ResultsSummary + coach section + teaching review
    return (
      <div>
        {/* ── Spec §7 structured results ─────────────────────────── */}
        <ResultsSummary
          results={results}
          testId={testId}
          elapsedMs={savedElapsedMs}
          pathwayId={testConfig?.pathwayId ?? null}
        />

        {/* ── Coach card (CAT-specific, premium) ──────────────────── */}
        {results.catReport ? (
          <div className="mx-auto max-w-900px px-6 pb-8">
            <CatResultsCoachSection
              coach={results.catCoach}
              catExamFeedbackMode={results.catExamFeedbackMode ?? testConfig?.catExamFeedbackMode ?? null}
              pathwayId={testConfig?.pathwayId ?? null}
            />
          </div>
        ) : null}

        {/* ── Study loop next card ─────────────────────────────────── */}
        <div className="mx-auto max-w-[900px] px-6 pb-6">
          <PracticeTestStudyLoopNext results={results} pathwayId={testConfig?.pathwayId ?? null} />
        </div>

        {/* ── Teaching review (post-exam rationale access) ─────────── */}
        <div className="mx-auto max-w-[900px] px-6 pb-8">
          <div className="nn-cat-question-card space-y-3">
            <h3 className="font-semibold text-[var(--semantic-text-primary)]">
              Teaching review
            </h3>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              {results.catExamFeedbackMode === "study"
                ? "You saw explanations after each item. Open the full breakdown for consolidated distractors, strategy, and figures."
                : "Test Mode keeps rationales hidden until the end. Open the full breakdown below."}
            </p>
            {teachingReviewItems === null ? (
              <button
                type="button"
                disabled={teachingReviewLoading}
                className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold disabled:opacity-50"
                onClick={() => void loadTeachingReview()}
              >
                {teachingReviewLoading ? "Loading…" : "Open teaching review"}
              </button>
            ) : teachingReviewItems.length === 0 ? (
              <p className="text-sm text-[var(--semantic-text-muted)]">
                No review items available for this session.
              </p>
            ) : (
              <PracticeTestTeachingReviewPanel items={teachingReviewItems} />
            )}
          </div>
        </div>

        {/* ── Study notes ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-[900px] px-6 pb-8">
          <StudyNotesPanel
            userId={userId}
            scope={LearnerNoteScope.PRACTICE_TEST}
            contextId={testId}
            topic={(results.weakAreas ?? [])[0] ?? null}
            sourceLabel={`Practice test ${testId.slice(0, 8)}…`}
            userLabel={userLabel}
            flags={protectionFlags}
          />
        </div>
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

  // Derived layout / display values
  const modeLabel = isLinearEngine
    ? linearDelivery === "exam"
      ? "Linear exam"
      : "Linear practice"
    : catMode
      ? examSimulation
        ? aanpNpExamSim
          ? "NP simulation · AANP-style"
          : "NCLEX simulation · CAT"
        : catFeedbackStudy
          ? "CAT · Study Mode"
          : "CAT · Test Mode"
      : "Practice test";

  const sessionPct = total > 0 ? Math.min(100, Math.max(0, ((idx + 1) / total) * 100)) : 0;

  const rationalePanelStatus: RationalePanelStatus =
    isLinearEngine && linearDelivery === "practice" && currentCommitted && linearFeedback
      ? linearFeedback.isCorrect
        ? "correct"
        : "incorrect"
      : isLinearEngine && linearDelivery === "exam" && currentCommitted
        ? "exam_locked"
        : "waiting";

  const optionDisplayMap = Object.fromEntries(
    optsCanonical.map((k, i) => [k, optsDisplay[i] ?? k]),
  );

  // ── Linear practice option rows (used only in the non-CAT 2-col path) ───
  const linearOptionRows =
    optsCanonical.length === 0 ? (
      <p className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-muted)]">
        No answer choices were returned for this item. Use Retry, reload the test, or contact
        support if this persists.
      </p>
    ) : isSata ? (
      <ul className="nn-qopt-list" role="group" aria-label="Answer choices (select all that apply)">
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
                    const next = e.target.checked
                      ? [...prev, canonical]
                      : prev.filter((x) => x !== canonical);
                    setAnswerForCurrent(next);
                  }}
                  className="mt-1 size-[1.125rem] shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 sm:size-4"
                />
                <QuestionChoiceLetter index={i} />
                <span className="min-w-0 flex-1 text-[var(--theme-body-text)]">{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    ) : (
      <ul className="nn-qopt-list" role="radiogroup" aria-label="Answer choices">
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
                <QuestionChoiceLetter index={i} />
                <span className="min-w-0 flex-1">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );

  // ══════════════════════════════════════════════════════════════════════════
  // CAT MODE — spec-driven 2-column layout (65% / 35%, max 1200px)
  // Test mode: right panel locked. Study mode: right panel shows rationale.
  // ══════════════════════════════════════════════════════════════════════════
  if (catMode) {
    // Determine option state per canonical key for CAT (no correct/incorrect during test mode)
    function catOptState(canonical: string): AnswerOptionState {
      const isSelected = raw === canonical;
      if (catFeedbackStudy && catStudyFeedback && catStudyFeedback.questionId === current?.id) {
        const ck = new Set(catStudyFeedback.correctKeys);
        if (ck.has(canonical)) return "correct";
        if (isSelected) return "incorrect";
        return "dim";
      }
      return isSelected ? "selected" : "default";
    }

    const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const optLocked = catStudyLocked;

    // Build CAT-specific option rows using AnswerOptionRow
    const catOptions =
      optsCanonical.length === 0 ? (
        <p className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-muted)]">
          No answer choices returned. Try reloading or contact support.
        </p>
      ) : isSata ? (
        <ul className="nn-cat-opt-list" role="group" aria-label="Answer choices — select all that apply">
          {optsCanonical.map((canonical, i) => {
            const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
            const optState = catOptState(canonical);
            return (
              <li key={canonical}>
                <AnswerOptionRow
                  letter={LETTERS[i] ?? String(i + 1)}
                  text={optsDisplay[i] ?? canonical}
                  state={optLocked ? (optState === "selected" ? "selected" : optState) : (selected ? "selected" : "default")}
                  disabled={optLocked}
                  isCheckbox
                  checked={selected}
                  onChange={(checked) => {
                    const prev = Array.isArray(raw) ? [...raw] : [];
                    setAnswerForCurrent(
                      checked ? [...prev, canonical] : prev.filter((x) => x !== canonical),
                    );
                  }}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="nn-cat-opt-list" role="radiogroup" aria-label="Answer choices">
          {optsCanonical.map((canonical, i) => (
            <li key={canonical}>
              <AnswerOptionRow
                letter={LETTERS[i] ?? String(i + 1)}
                text={optsDisplay[i] ?? canonical}
                state={catOptState(canonical)}
                disabled={optLocked}
                onClick={() => setAnswerForCurrent(canonical)}
              />
            </li>
          ))}
        </ul>
      );

    // Right panel mode: "locked" for test mode, "feedback" when study feedback available
    const rationalePanelMode =
      catFeedbackStudy && catStudyFeedback && catStudyFeedback.questionId === current?.id
        ? "feedback"
        : catFeedbackStudy
          ? "waiting"
          : "locked";

    return (
      <div>
        <ProtectedPremiumContent
          userLabel={userLabel}
          flags={protectionFlags}
          telemetrySurface="practice_test"
        >
          <CatSessionLayout>
            {/* ── Top bar: Q counter + % complete + 6px progress bar ── */}
            <CatTopBar
              current={idx + 1}
              total={total}
              saving={saving}
              timerSlot={<ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />}
            />

            {/* ── 2-column grid: 65% question / 35% rationale ────────── */}
            <CatContentGrid>
              {/* LEFT — question card */}
              <QuestionCard
                stem={current.stem ?? ""}
                topic={current.topic}
                subtopic={current.subtopic}
                difficultyLabel={current.difficulty != null ? difficultyBandLabel(current.difficulty) : null}
              >
                {/* Timed warning */}
                {timedMode && timeLimitSec != null ? (
                  <div className="nn-cat-exam-timing-alert mb-5" role="alert">
                    Timed session — the exam may end automatically when time expires.
                  </div>
                ) : null}

                {/* CAT live transparency (optional) */}
                {catLiveTransparency || adaptiveDifficultyHistory.length > 0 ? (
                  <div className="mb-5">
                    <CatLiveTransparencyStrip
                      difficultyTail={adaptiveDifficultyHistory}
                      theta={adaptiveTheta}
                      se={adaptiveSe}
                      show={catLiveTransparency}
                      onToggle={setCatLiveTransparency}
                    />
                  </div>
                ) : null}

                {/* Options label */}
                <p className="nn-cat-options-label">
                  {isSata ? "Select all that apply" : "Select the best answer"}
                </p>

                {/* Answer options */}
                {catOptions}

                {/* CAT study feedback (inline, after options) */}
                {rationalePanelMode === "feedback" && catStudyFeedback ? (
                  <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
                    <CatStudyFeedbackPanel
                      feedback={catStudyFeedback}
                      continueLabel={idx < total - 1 ? "Next adaptive item" : "View results"}
                      onContinue={() => void catAdvance()}
                      continueDisabled={saving}
                      pathwayId={testConfig?.pathwayId ?? null}
                    />
                  </div>
                ) : null}

                {/* Nav bar */}
                <div className="nn-cat-question-nav">
                  {/* Flag — left-anchored */}
                  <button
                    type="button"
                    aria-pressed={Boolean(flagged[current.id])}
                    className={`nn-cat-question-nav__flag inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold transition ${
                      flagged[current.id]
                        ? "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]"
                        : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                    onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
                  >
                    <span aria-hidden="true">{flagged[current.id] ? "★" : "☆"}</span>
                    {flagged[current.id] ? "Flagged" : "Flag"}
                  </button>

                  {/* End session — quiet */}
                  <button
                    type="button"
                    disabled={saving}
                    className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
                    onClick={() => void abandon()}
                  >
                    End session
                  </button>

                  {/* Primary action — hidden when study feedback is showing */}
                  {rationalePanelMode === "feedback" ? null : idx < total - 1 ? (
                    <button
                      type="button"
                      disabled={saving || !hasMeaningfulAnswer(current.id)}
                      className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void catAdvance()}
                    >
                      {saving ? "Working…" : catFeedbackStudy ? "See explanation" : "Next question"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={saving || !hasMeaningfulAnswer(current.id)}
                      className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void catAdvance()}
                    >
                      {saving ? "Working…" : catFeedbackStudy ? "See explanation" : "Submit & finish"}
                    </button>
                  )}
                </div>
              </QuestionCard>

              {/* RIGHT — rationale panel */}
              <RationalePanel
                mode={rationalePanelMode}
                feedback={
                  rationalePanelMode === "feedback" ? catStudyFeedback ?? undefined : undefined
                }
                optionKeys={optsCanonical}
                optionTexts={optsDisplay}
              />
            </CatContentGrid>
          </CatSessionLayout>
        </ProtectedPremiumContent>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LINEAR PRACTICE / EXAM MODE — spec-driven viewport-height 2-col layout
  // 60/40 grid · no page scroll on desktop · all rationale shown at once
  // ══════════════════════════════════════════════════════════════════════════

  // Per-option state for the new circular-badge answer rows
  function practiceOptState(canonical: string): PracticeOptionState {
    const isSelected =
      raw === canonical || (Array.isArray(raw) && raw.includes(canonical));
    if (
      isLinearEngine &&
      currentCommitted &&
      linearDelivery === "practice" &&
      linearFeedback
    ) {
      const ck = new Set(linearFeedback.correctKeys);
      if (ck.has(canonical)) return "correct";
      if (isSelected) return "incorrect";
      return "dim";
    }
    if (isLinearEngine && currentCommitted && linearDelivery === "exam") {
      return isSelected ? "selected" : "dim";
    }
    return isSelected ? "selected" : "default";
  }

  const optIsLocked = isLinearEngine && currentCommitted;

  const practiceOptionRows =
    optsCanonical.length === 0 ? (
      <p className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-muted)]">
        No answer choices were returned for this item. Use Retry, reload the
        test, or contact support if this persists.
      </p>
    ) : isSata ? (
      <ul
        className="nn-practice-opt-list"
        role="group"
        aria-label="Answer choices — select all that apply"
      >
        {optsCanonical.map((canonical, i) => {
          const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
          return (
            <li key={canonical}>
              <PracticeAnswerOptionRow
                index={i}
                text={optsDisplay[i] ?? canonical}
                state={practiceOptState(canonical)}
                disabled={optIsLocked}
                isCheckbox
                checked={selected}
                onChange={(checked) => {
                  const prev = Array.isArray(raw) ? [...raw] : [];
                  setAnswerForCurrent(
                    checked
                      ? [...prev, canonical]
                      : prev.filter((x) => x !== canonical),
                  );
                }}
              />
            </li>
          );
        })}
      </ul>
    ) : (
      <ul
        className="nn-practice-opt-list"
        role="radiogroup"
        aria-label="Answer choices"
      >
        {optsCanonical.map((canonical, i) => (
          <li key={canonical}>
            <PracticeAnswerOptionRow
              index={i}
              text={optsDisplay[i] ?? canonical}
              state={practiceOptState(canonical)}
              disabled={optIsLocked}
              onClick={() => setAnswerForCurrent(canonical)}
            />
          </li>
        ))}
      </ul>
    );

  const rationaleFullStatus: import("@/components/study/practice-rationale-full-panel").PracticeRationaleFullPanelStatus =
    isLinearEngine && linearDelivery === "practice" && currentCommitted && linearFeedback
      ? linearFeedback.isCorrect
        ? "correct"
        : "incorrect"
      : isLinearEngine && linearDelivery === "exam" && currentCommitted
        ? "exam_locked"
        : "waiting";

  const topBarRightLabel =
    isLinearEngine && committedCount > 0
      ? `${committedAnsweredPct}% complete`
      : modeLabel;

  return (
    <ProtectedPremiumContent
      userLabel={userLabel}
      flags={protectionFlags}
      telemetrySurface="practice_test"
    >
      <PracticeSessionLayout>
        <PracticeTopBar
          current={idx + 1}
          total={total}
          rightLabel={topBarRightLabel}
          progressPct={sessionPct}
          saving={saving}
        />
        <PracticeSessionGrid>
          {/* LEFT — question + options + nav */}
          <div>
            <PracticeQuestionCard
              stem={
                typeof current.stem === "string" && current.stem.trim().length > 0
                  ? current.stem
                  : "Question text is unavailable. Try reloading this item."
              }
              topic={current.topic}
              subtopic={current.subtopic}
              difficultyLabel={
                current.difficulty != null
                  ? difficultyBandLabel(current.difficulty)
                  : null
              }
              optionsLabel={isSata ? "Select all that apply" : "Select the best answer"}
            >
              {timedMode && timeLimitSec != null ? (
                <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                  Timed session — the exam may end automatically when time expires.
                </p>
              ) : null}
              {timedMode ? (
                <div className="flex justify-end">
                  <ExamTimerReadout remainingSec={remainingSec} />
                </div>
              ) : null}
              {practiceOptionRows}
              <div className="nn-practice-q-nav">
                <button
                  type="button"
                  aria-pressed={Boolean(flagged[current.id])}
                  className={`inline-flex min-h-[2.5rem] shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    flagged[current.id]
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[var(--surface-emphasis,color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface)))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--surface-soft-a,var(--semantic-panel-muted))]"
                  }`}
                  onClick={() =>
                    setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))
                  }
                >
                  {flagged[current.id] ? "Marked" : "Flag"}
                </button>
                <div className="nn-practice-q-nav__spacer" />
                {!isLinearEngine ? (
                  <button
                    type="button"
                    disabled={idx === 0}
                    className="nn-btn-secondary min-h-[2.5rem] rounded-lg px-4 text-sm font-semibold disabled:opacity-40"
                    onClick={() => void goPrev()}
                  >
                    Previous
                  </button>
                ) : null}
                {isLinearEngine && !currentCommitted ? (
                  <button
                    type="button"
                    disabled={saving || !hasMeaningfulAnswer(current.id)}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void submitLinearCommit()}
                  >
                    {saving ? "Submitting…" : "Submit answer"}
                  </button>
                ) : null}
                {idx < total - 1 ? (
                  <button
                    type="button"
                    disabled={isLinearEngine && !currentCommitted}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void goNext()}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving || (isLinearEngine && !currentCommitted)}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void submitTest()}
                  >
                    {saving ? "Submitting…" : "Finish"}
                  </button>
                )}
                <button
                  type="button"
                  className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
                  onClick={() => void abandon()}
                >
                  Abandon
                </button>
              </div>
            </PracticeQuestionCard>
          </div>
          {/* RIGHT — full rationale: correct answer + why correct + each wrong option + takeaway + lessons */}
          <div>
            <PracticeRationaleFullPanel
              status={rationaleFullStatus}
              correctKeys={linearFeedback?.correctKeys}
              optionDisplayMap={optionDisplayMap}
              allOptionKeys={optsCanonical}
              correctAnswerExplanation={linearFeedback?.correctAnswerExplanation}
              rationale={linearFeedback?.rationale}
              distractorRationalesMap={linearFeedback?.distractorRationalesMap}
              keyTakeaway={linearFeedback?.keyTakeaway}
              relatedLessons={linearFeedback?.relatedLessons ?? []}
            />
          </div>
        </PracticeSessionGrid>
      </PracticeSessionLayout>
    </ProtectedPremiumContent>
  );
  // Intentionally not used in new layout — kept so old ExamSessionShell path is not lost
  void ExamSessionShell;
  void PracticeRationalePanel;
  void rationalePanelStatus;
}
          {/* ── Slim session header ────────────────────────────────────── */}
          <div className="nn-practice-session-header">
            <div className="nn-practice-session-header__row">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                  {modeLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {catMode ? "Adaptive item" : "Question"}{" "}
                  <span className="tabular-nums">{idx + 1}</span>
                  {" of "}
                  <span className="tabular-nums">{total}</span>
                  {isLinearEngine ? (
                    <span className="ml-2 text-xs font-normal text-[var(--semantic-text-muted)]">
                      · {committedCount}/{total} submitted
                    </span>
                  ) : null}
                  {saving ? (
                    <span className="ml-2 text-xs font-normal text-[var(--semantic-text-muted)]">
                      · Saving…
                    </span>
                  ) : null}
                </p>
              </div>
              <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
            </div>
            <div
              className="nn-practice-session-progress-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sessionPct)}
              aria-label={`Session progress ${idx + 1} of ${total}`}
            >
              <div className="nn-practice-session-progress-fill" style={{ width: `${sessionPct}%` }} />
            </div>
          </div>

          {/* ── 2-column content grid ──────────────────────────────────── */}
          <div className="nn-practice-content-grid">
            {/* ── LEFT: question panel ───────────────────────────────── */}
            <div className="nn-practice-question-col space-y-5">
              {/* Mode description */}
              <p className="nn-marketing-body-sm leading-relaxed text-[var(--semantic-text-muted)]">
                {isLinearEngine
                  ? linearDelivery === "exam"
                    ? "Exam delivery — submit each answer to lock it in. Rationales stay hidden until you finish."
                    : "Practice delivery — submit each answer to see whether you were right before continuing."
                  : catFeedbackStudy
                    ? "Study Mode — rationales reveal after each answer."
                    : "Pacing practice only. Not a copy of any official exam interface."}
              </p>

              {catMode && timedMode && timeLimitSec != null ? (
                <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                  Strict timing is on — when the timer reaches zero, this session can end
                  automatically. Pace each item accordingly.
                </p>
              ) : null}

              {catMode ? (
                <CatLiveTransparencyStrip
                  difficultyTail={adaptiveDifficultyHistory}
                  theta={adaptiveTheta}
                  se={adaptiveSe}
                  show={catLiveTransparency}
                  onToggle={setCatLiveTransparency}
                />
              ) : null}

              {/* Question card */}
              <div className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]">
                {(current.topic ?? current.subtopic ?? current.difficulty) != null ? (
                  <div className="border-b border-[var(--semantic-border-soft)] bg-[var(--surface-soft-a,var(--semantic-panel-muted))] px-4 py-2.5 sm:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {current.topic ? (
                        <span className="nn-practice-topic-chip">{current.topic}</span>
                      ) : null}
                      {current.subtopic ? (
                        <span className="text-xs text-[var(--semantic-text-muted)]">
                          · {current.subtopic}
                        </span>
                      ) : null}
                      {current.difficulty != null ? (
                        <span className="text-xs text-[var(--semantic-text-muted)]">
                          · {difficultyBandLabel(current.difficulty)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
                  <div className="nn-question-stem-wrap min-h-0">
                    <p className="nn-question-stem">
                      {typeof current.stem === "string" && current.stem.trim().length > 0
                        ? current.stem
                        : "Question text is unavailable. Try reloading this item."}
                    </p>
                  </div>
                  {linearOptionRows}
                </div>
              </div>

              {/* Nav actions — linear practice / exam only */}
              <div className="nn-question-nav-actions">
                <button
                  type="button"
                  aria-pressed={Boolean(flagged[current.id])}
                  className={`inline-flex min-h-[2.75rem] shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    flagged[current.id]
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[var(--surface-emphasis,color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface)))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--surface-soft-a,var(--semantic-panel-muted))]"
                  }`}
                  onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
                >
                  {flagged[current.id] ? "Marked for review" : "Mark for review"}
                </button>
                <button
                  type="button"
                  disabled={idx === 0 || isLinearEngine}
                  className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-semibold disabled:opacity-40"
                  onClick={() => void goPrev()}
                >
                  Previous
                </button>
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
                <button
                  type="button"
                  className="nn-btn-secondary min-h-[3rem] rounded-full px-5 text-sm font-medium text-[var(--semantic-text-muted)]"
                  onClick={() => void abandon()}
                >
                  Abandon
                </button>
              </div>
            </div>

            {/* ── RIGHT: rationale / review panel ──────────────────────── */}
            <div className="nn-practice-rationale-col">
              <PracticeRationalePanel
                status={rationalePanelStatus}
                rationale={linearFeedback?.rationale ?? null}
                correctKeys={linearFeedback?.correctKeys}
                optionDisplayMap={optionDisplayMap}
                modeLabel={modeLabel}
              />
            </div>
          </div>
        </ExamSessionShell>
      </ProtectedPremiumContent>
    </div>
  );
}
