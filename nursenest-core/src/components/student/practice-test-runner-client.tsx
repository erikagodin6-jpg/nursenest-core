"use client";

import { LearnerNoteScope } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  ExamProgressBar,
  ExamSessionShell,
  ExamSessionTopBar,
  ExamTimerReadout,
} from "@/components/exam/exam-session-shell";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";
import { difficultyBandLabel } from "@/lib/questions/difficulty-label";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type {
  CatStudyFeedbackPayload,
  PracticeTestConfigJson,
  PracticeTestPathwayClientShell,
  PracticeTestResultsJson,
} from "@/lib/practice-tests/types";
import { CatLiveTransparencyStrip } from "@/components/student/cat-live-transparency-strip";
import { CatResultsCoachSection } from "@/components/student/cat-results-coach-section";
import { CatStudyFeedbackPanel } from "@/components/student/cat-study-feedback-panel";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import { PracticeTestTeachingReviewPanel } from "@/components/student/practice-test-teaching-review-panel";
import { PracticeTestStudyLoopNext } from "@/components/student/practice-test-study-loop-next";
import type { PracticeTestTeachingItem } from "@/lib/practice-tests/build-teaching-review";
import { getLinearCommittedQuestionIds } from "@/lib/practice-tests/practice-linear-engine";
import {
  catExamAdvancePrimaryIntentFromSessionShape,
  catExamCanLockAnswer,
  catExamCanRequestCatAdvance,
  catExamCatAdvanceResponseIsStale,
  catExamFooterPrimaryBusy,
  catExamOptionsInteractionLocked,
  type CatExamUiPhase,
} from "@/lib/practice-tests/cat-exam-ui-state";
import { PracticeSessionLayout } from "@/components/study/practice-session-layout";
import {
  PracticeQuestionCard,
  PracticeAnswerOptionRow,
} from "@/components/study/practice-question-card";
import type { PracticeOptionState } from "@/components/study/practice-question-card";
import { PracticeRationaleFullPanel } from "@/components/study/practice-rationale-full-panel";
import {
  ConfidenceSelector,
  type ConfidenceLevel,
} from "@/components/study/confidence-selector";
import { ConfidenceAnalyticsBlock } from "@/components/study/confidence-analytics";
import {
  SmartReviewLayout,
  type SmartReviewItem,
} from "@/components/study/smart-review-screen";
import { StudyPlanFromResults } from "@/components/study/study-plan";
import { QuestionCard, AnswerOptionRow } from "@/components/study/cat-question-card";
import type { AnswerOptionState } from "@/components/study/cat-question-card";
import { RationalePanel } from "@/components/study/cat-rationale-panel";
import { ResultsSummary } from "@/components/study/cat-results-summary";
import type { StudySettings } from "@/lib/learner/study-settings";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";
import { captureClientException } from "@/lib/runtime/client-observability";
import { PracticeTestRunPageSkeleton } from "@/components/skeletons/hub-page-skeleton";

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

type ExamChromeVariant = "nclex" | "rex" | "np" | "default";

function examChromeVariantFromSurface(pathway: PracticeTestPathwayClientShell | null): ExamChromeVariant {
  if (!pathway) return "default";
  if (pathway.roleTrack === "np") return "np";
  if (pathway.examCode === "rex-pn") return "rex";
  if (pathway.examCode.startsWith("nclex")) return "nclex";
  return "default";
}

const MAX_PRACTICE_QUESTION_CACHE = 32;

export function PracticeTestRunnerClient({
  testId,
  userId,
  userLabel,
  protectionFlags,
  studySettings,
  isEntitled = true,
  initialPathwaySurface = null,
}: {
  testId: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  studySettings: StudySettings;
  /**
   * Whether this user has an active premium subscription.
   * Controls gating of Adaptive Study Plan, Smart Review, and Confidence Analytics.
   * Defaults to `true` so existing call-sites without entitlement wiring remain
   * fully functional — wire `false` for free/trial accounts at the page level.
   */
  isEntitled?: boolean;
  /** Server snapshot from stored test config so chrome can render before hydrate returns pathwaySurface. */
  initialPathwaySurface?: PracticeTestPathwayClientShell | null;
}) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { t } = useMarketingI18n();
  const tx = useCallback(
    (key: string, fallback: string, params?: Record<string, string | number | undefined>) => {
      const resolved = t(key, params);
      return resolved.startsWith("[missing:") ? fallback : resolved;
    },
    [t],
  );
  const [error, setError] = useState<string | null>(null);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const questionIdsRef = useRef<string[]>([]);
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
  const [pathwaySurface, setPathwaySurface] = useState<PracticeTestPathwayClientShell | null>(() => initialPathwaySurface ?? null);
  const [catMode, setCatMode] = useState(false);
  const [adaptiveTheta, setAdaptiveTheta] = useState<number | null>(null);
  const [adaptiveSe, setAdaptiveSe] = useState<number | null>(null);
  const [adaptiveDifficultyHistory, setAdaptiveDifficultyHistory] = useState<number[]>([]);
  const [catLiveTransparency, setCatLiveTransparency] = useState(false);
  /**
   * CAT exam (test) mode UI phase — explicit submit → lock → single `cat_advance` per transition.
   * Study mode ignores this; server contract is unchanged (`action: "cat_advance"`).
   */
  const [catExamUiPhase, setCatExamUiPhase] = useState<CatExamUiPhase>("answering");
  const catExamUiPhaseRef = useRef<CatExamUiPhase>("answering");
  const catExamAdvanceButtonRef = useRef<HTMLButtonElement | null>(null);
  /** When true, after the next item loads we move focus to the first option (keyboard-driven flow). */
  const catExamKeyboardAdvanceRef = useRef(false);
  /** Dedupes rapid Enter / Space activation (OS key-repeat). */
  const catExamPrimaryActionGateMsRef = useRef(0);
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
  /** Confidence ratings per question: Map<questionId, ConfidenceLevel>. Client-only, not persisted. */
  const [confidence, setConfidence] = useState<Record<string, ConfidenceLevel>>({});
  const autoSubmitRef = useRef(false);
  const submitInFlightRef = useRef(false);
  const catAdvanceInFlightRef = useRef(false);
  const catAdvanceLatestRef = useRef<() => Promise<void>>(async () => {});
  const setAnswerForCurrentRef = useRef<(next: unknown) => void>(() => {});
  const linearCommitInFlightRef = useRef(false);
  const abandonInFlightRef = useRef(false);
  const navInFlightRef = useRef(false);
  const persistInFlightRef = useRef(false);
  const pendingPersistRef = useRef<{ answers: Record<string, unknown>; cursorIndex: number } | null>(null);
  const answersRef = useRef<Record<string, unknown>>({});
  const idxRef = useRef(0);
  const confidenceTrackingEnabled = studySettings.enableConfidenceTracking;
  const adaptivePlanEnabled = studySettings.enableAdaptivePlan;

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    questionIdsRef.current = questionIds;
  }, [questionIds]);

  const runnerMountedRef = useRef(true);
  useEffect(() => {
    runnerMountedRef.current = true;
    return () => {
      runnerMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    catExamUiPhaseRef.current = catExamUiPhase;
  }, [catExamUiPhase]);

  const debugEventCapRef = useRef(0);
  const logSessionEvent = useCallback(
    (event: string, detail?: Record<string, unknown>) => {
      if (process.env.NODE_ENV !== "development") return;
      if (debugEventCapRef.current >= 48) return;
      debugEventCapRef.current += 1;
      console.debug("[practice-test-runner]", event, { testId, ...(detail ?? {}) });
    },
    [testId],
  );

  const load = useCallback(async () => {
    setPhase("loading");
    setError(null);
    autoSubmitRef.current = false;
    try {
      const res = await fetchWithRetry(`/api/practice-tests/${testId}?hydrate=minimal`, undefined, {
        attempts: 3,
        baseDelayMs: 500,
        timeoutMs: 45_000,
      });
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
        pathwaySurface?: PracticeTestPathwayClientShell | null;
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
      const nextCfg = data.config ?? null;
      setTestConfig(nextCfg);
      setPathwaySurface((prev) => {
        if (data.pathwaySurface) return data.pathwaySurface;
        const pid = nextCfg?.pathwayId?.trim();
        if (pid && prev?.id === pid) return prev;
        if (pid && initialPathwaySurface?.id === pid) return initialPathwaySurface;
        return null;
      });
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
      setConfidence({});
      setCatFinalStudyFeedback(null);
      const catStudyAwaiting =
        Boolean(data.catMode) &&
        (data.config?.catExamFeedbackMode ?? "test") === "study" &&
        astObj?.catStudyAwaitingContinue === true;
      if (catStudyAwaiting && data.status === "IN_PROGRESS") {
        void (async () => {
          try {
            const fr = await fetchWithRetry(`/api/practice-tests/${testId}/cat-study-review`, undefined, {
              attempts: 2,
              timeoutMs: 20_000,
            });
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
        const serverRemaining = Math.max(0, data.timeLimitSec - usedSec);
        setRemainingSec((prev) => {
          if (prev == null) return serverRemaining;
          // Never increase remaining time on refresh/reload due to stale network snapshots.
          return Math.min(prev, serverRemaining);
        });
      } else {
        setRemainingSec(null);
      }
      setPhase("ready");
    } catch (e) {
      captureClientException("practice_test_hydrate", e, { testId });
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
      setPhase("error");
    }
  }, [testId, initialPathwaySurface]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPathwaySurface(initialPathwaySurface ?? null);
  }, [testId, initialPathwaySurface]);

  useEffect(() => {
    if (phase !== "ready" || status !== "IN_PROGRESS") return;
    const id = questionIds[idx];
    if (!id || cacheRef.current[id]) return;

    const ac = new AbortController();
    setQLoading(true);
    void (async () => {
      try {
        const res = await fetchWithRetry(`/api/practice-tests/${testId}/question?index=${idx}`, { signal: ac.signal }, {
          attempts: 2,
          baseDelayMs: 400,
          timeoutMs: 25_000,
        });
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
        if (!ac.signal.aborted) {
          const message = "Could not load question.";
          setError(message);
        }
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

  /** Reduce accidental navigation away during adaptive or timed runs (legacy mock-exam checkpoint intent, browser-native). */
  useEffect(() => {
    if (status !== "IN_PROGRESS" || phase !== "ready") return;
    if (!catMode && !timedMode) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status, phase, catMode, timedMode]);

  const submitTest = useCallback(
    async (fromTimer = false) => {
      if (submitInFlightRef.current) return;
      if (fromTimer && autoSubmitRef.current) return;
      if (fromTimer) autoSubmitRef.current = true;
      submitInFlightRef.current = true;
      logSessionEvent("submit_start", { fromTimer, idx: idxRef.current, total: questionIds.length });
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
        logSessionEvent("submit_success", { fromTimer, elapsedMs: elapsedMs ?? null });
      } catch (e) {
        if (fromTimer) autoSubmitRef.current = false;
        setError(e instanceof Error ? e.message : "Submit failed");
        logSessionEvent("submit_failed", {
          fromTimer,
          message: e instanceof Error ? e.message : "Submit failed",
        });
      } finally {
        submitInFlightRef.current = false;
        setSaving(false);
      }
    },
    [sessionStartMs, testId, testConfig, questionIds, linearCommittedIds, logSessionEvent],
  );

  useEffect(() => {
    if (remainingSec !== 0 || status !== "IN_PROGRESS" || !timedMode) return;
    void submitTest(true);
  }, [remainingSec, status, timedMode, submitTest]);

  const qid = questionIds[idx];
  const current = qid ? questionCache[qid] : undefined;
  const total = questionIds.length;
  const examName =
    pathwaySurface?.shortName ??
    (typeof current?.exam === "string" && current.exam.trim().length > 0
      ? current.exam.trim()
      : tx("learner.practiceTests.run.defaultExamName", "Practice Exam"));
  const chromeVariant = examChromeVariantFromSurface(pathwaySurface);
  const chromeClass = `nn-exam-variant--${chromeVariant}`;
  const examSimulation = testConfig?.catPresentationMode === "exam_simulation";
  const catFeedbackStudy = Boolean(catMode && (testConfig?.catExamFeedbackMode ?? "test") === "study");
  // isExamStyle — CAT test mode: single-column exam shell; explicit submit then lock then next.
  // CAT study mode uses split layout; rationale panel unlocks after submit (see explanation flow).
  const isExamStyle = catMode && !catFeedbackStudy;
  const catStudyLocked =
    catFeedbackStudy &&
    Boolean(catStudyFeedback && current && catStudyFeedback.questionId === current.id && idx === total - 1);
  const aanpNpExamSim = examSimulation && testConfig?.catExamConfigId === "aanp-np-us";
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

  useEffect(() => {
    if (!current || !catStudyFeedback) return;
    if (catStudyFeedback.questionId !== current.id) {
      setCatStudyFeedback(null);
    }
  }, [current, catStudyFeedback]);

  useEffect(() => {
    catExamUiPhaseRef.current = "answering";
    setCatExamUiPhase("answering");
  }, [qid]);

  useEffect(() => {
    const feedbackStudy =
      catMode && (testConfig?.catExamFeedbackMode ?? "test") === "study";
    const examStyle = catMode && !feedbackStudy;
    if (!examStyle || status !== "IN_PROGRESS") return;
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [catMode, testConfig?.catExamFeedbackMode, status]);

  const linearDelivery = testConfig?.linearDeliveryMode;
  const linearRationaleVisibility =
    testConfig?.linearRationaleVisibility ?? (linearDelivery === "exam" ? "end_of_exam" : "after_each");
  const isLinearEngine = Boolean(!catMode && linearDelivery);
  const committedSet = useMemo(() => new Set(linearCommittedIds), [linearCommittedIds]);
  const currentCommitted = Boolean(current && committedSet.has(current.id));
  const linearFeedback = current ? linearPracticeFeedback[current.id] : undefined;
  const committedCount = linearCommittedIds.length;
  const committedAnsweredPct = total > 0 ? Math.round((committedCount / total) * 100) : 0;

  const hasMeaningfulAnswer = (qid: string): boolean => {
    const v = answersRef.current[qid];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };

  const lockCatExamAnswer = useCallback(() => {
    if (!isExamStyle || !current) return;
    if (!catExamCanLockAnswer(catExamUiPhaseRef.current, hasMeaningfulAnswer(current.id))) return;
    catExamUiPhaseRef.current = "submitted_locked";
    setCatExamUiPhase("submitted_locked");
    queueMicrotask(() => {
      catExamAdvanceButtonRef.current?.focus();
    });
  }, [isExamStyle, current]);

  function setConfidenceForQuestion(qid: string, level: ConfidenceLevel) {
    setConfidence((c) => ({ ...c, [qid]: level }));
  }

  async function persistSave(nextAnswers: Record<string, unknown>, nextIdx: number) {
    pendingPersistRef.current = { answers: nextAnswers, cursorIndex: nextIdx };
    if (persistInFlightRef.current) return;
    persistInFlightRef.current = true;
    setSaving(true);
    try {
      while (pendingPersistRef.current) {
        const payload = pendingPersistRef.current;
        pendingPersistRef.current = null;
        const elapsedMs =
          sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
        const res = await fetch(`/api/practice-tests/${testId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save",
            answers: payload.answers,
            cursorIndex: payload.cursorIndex,
            ...(elapsedMs !== undefined ? { elapsedMs } : {}),
          }),
        });
        if (!res.ok) {
          let message = "Could not save progress.";
          try {
            const data = (await res.json()) as { error?: string };
            if (data?.error) message = data.error;
          } catch {
            // Keep default fallback if response body is unavailable.
          }
          throw new Error(message);
        }
      }
      if (error) setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save progress.";
      setError(message);
    } finally {
      persistInFlightRef.current = false;
      setSaving(false);
    }
  }

  async function abandon() {
    if (abandonInFlightRef.current || submitInFlightRef.current) return;
    if (!window.confirm("Abandon this test? Progress is saved but marked abandoned.")) return;
    abandonInFlightRef.current = true;
    logSessionEvent("navigation_abandon", { idx, total });
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
      abandonInFlightRef.current = false;
      setSaving(false);
    }
  }

  function setAnswerForCurrent(next: unknown) {
    if (!current) return;
    if (submitInFlightRef.current || catAdvanceInFlightRef.current || linearCommitInFlightRef.current) return;
    if (catMode && (testConfig?.catExamFeedbackMode ?? "test") !== "study" && !catExamCanChangeAnswer(catExamUiPhaseRef.current)) {
      return;
    }
    if (isLinearEngine && committedSet.has(current.id)) return;
    const nextAnswers = { ...answersRef.current, [current.id]: next };
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    void persistSave(nextAnswers, idx);
  }

  setAnswerForCurrentRef.current = setAnswerForCurrent;

  async function submitLinearCommit() {
    if (linearCommitInFlightRef.current || submitInFlightRef.current) return;
    if (!current || !isLinearEngine || currentCommitted) return;
    if (!hasMeaningfulAnswer(current.id)) return;
    linearCommitInFlightRef.current = true;
    logSessionEvent("submit_linear_commit_start", { idx, questionId: current.id });
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
          answers: answersRef.current,
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
      if (data.feedback && linearRationaleVisibility === "after_each") {
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
      logSessionEvent("submit_linear_commit_success", { idx, questionId: current.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
      logSessionEvent("submit_linear_commit_failed", {
        idx,
        questionId: current.id,
        message: e instanceof Error ? e.message : "Submit failed",
      });
    } finally {
      linearCommitInFlightRef.current = false;
      setSaving(false);
    }
  }

  async function catAdvance() {
    if (catAdvanceInFlightRef.current || submitInFlightRef.current) return;
    if (!current || !hasMeaningfulAnswer(current.id)) return;

    const feedbackStudy = catMode && (testConfig?.catExamFeedbackMode ?? "test") === "study";
    const examStyle = catMode && !feedbackStudy;
    if (examStyle && !catExamCanRequestCatAdvance(catExamUiPhaseRef.current)) {
      return;
    }

    const advanceQuestionId = current.id;
    const advanceIdx = idx;

    catAdvanceInFlightRef.current = true;
    if (examStyle) {
      catExamUiPhaseRef.current = "advancing";
      setCatExamUiPhase("advancing");
    }
    logSessionEvent("submit_cat_advance_start", { idx, questionId: advanceQuestionId });
    setSaving(true);
    try {
      const elapsedMs =
        sessionStartMs != null ? Math.max(0, Date.now() - sessionStartMs) : undefined;
      const res = await fetch(`/api/practice-tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cat_advance",
          answers: answersRef.current,
          cursorIndex: advanceIdx,
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
      if (
        catExamCatAdvanceResponseIsStale({
          advanceIdx,
          advanceQuestionId,
          currentIdx: idxRef.current,
          currentQuestionId: questionIdsRef.current[idxRef.current],
        })
      ) {
        logSessionEvent("submit_cat_advance_stale_ignored", { advanceIdx, advanceQuestionId });
        if (examStyle) {
          catExamUiPhaseRef.current = "submitted_locked";
          setCatExamUiPhase("submitted_locked");
        }
        return;
      }
      if (!runnerMountedRef.current) return;
      if (data.catStudyReveal) {
        await load();
        if (!runnerMountedRef.current) return;
        logSessionEvent("submit_cat_advance_reveal", { idx: advanceIdx, questionId: advanceQuestionId });
        return;
      }
      if (data.catCompleted && data.results) {
        if (!runnerMountedRef.current) return;
        if (examStyle) {
          catExamUiPhaseRef.current = "completed";
          setCatExamUiPhase("completed");
        }
        setSavedElapsedMs(elapsedMs ?? null);
        setResults(data.results);
        if (data.studyFeedback && catFeedbackStudy) {
          setCatFinalStudyFeedback(data.studyFeedback);
        }
        setStatus("COMPLETED");
        logSessionEvent("submit_cat_advance_completed", { idx: advanceIdx, questionId: advanceQuestionId });
        return;
      }
      if (data.catAdvanced) {
        setCatStudyFeedback(null);
        await load();
        if (!runnerMountedRef.current) return;
        logSessionEvent("submit_cat_advance_next", { idx: advanceIdx, questionId: advanceQuestionId });
        return;
      }
      throw new Error(
        tx(
          "learner.practiceTests.run.catAdvanceUnexpectedResponse",
          "The server did not return the next exam step. Try again or reload the session.",
        ),
      );
    } catch (e) {
      if (examStyle) {
        catExamUiPhaseRef.current = "submitted_locked";
        setCatExamUiPhase("submitted_locked");
      }
      setError(e instanceof Error ? e.message : "Advance failed");
      logSessionEvent("submit_cat_advance_failed", {
        idx: advanceIdx,
        questionId: advanceQuestionId,
        message: e instanceof Error ? e.message : "Advance failed",
      });
    } finally {
      catAdvanceInFlightRef.current = false;
      setSaving(false);
    }
  }

  catAdvanceLatestRef.current = catAdvance;

  async function goNext() {
    if (saving || navInFlightRef.current || submitInFlightRef.current || catAdvanceInFlightRef.current) return;
    if (catMode) {
      if (idx >= total - 1) {
        const examStyle = (testConfig?.catExamFeedbackMode ?? "test") !== "study";
        if (catMode && examStyle && !catExamCanRequestCatAdvance(catExamUiPhaseRef.current)) return;
        await catAdvance();
      }
      return;
    }
    if (isLinearEngine && qid && !committedSet.has(qid)) return;
    if (idx >= total - 1) return;
    navInFlightRef.current = true;
    logSessionEvent("navigation_next", { from: idx, to: idx + 1 });
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    try {
      await persistSave(answersRef.current, nextIdx);
    } finally {
      navInFlightRef.current = false;
    }
  }

  async function goPrev() {
    if (saving || navInFlightRef.current || submitInFlightRef.current || catAdvanceInFlightRef.current) return;
    if (catMode || isLinearEngine) return;
    if (idx <= 0) return;
    navInFlightRef.current = true;
    logSessionEvent("navigation_prev", { from: idx, to: idx - 1 });
    const nextIdx = idx - 1;
    setIdx(nextIdx);
    try {
      await persistSave(answersRef.current, nextIdx);
    } finally {
      navInFlightRef.current = false;
    }
  }

  /** CAT exam mode: keyboard shortcuts (letters / digits, Enter); deduped against double-fire. */
  useEffect(() => {
    if (!isExamStyle || !catMode || status !== "IN_PROGRESS" || phase !== "ready" || !current) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[role="dialog"]')) return;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const root = target?.closest?.("[data-cat-exam-root]");
      if (e.key === " " && root) {
        const interactive = target?.closest?.("button,label.nn-cat-opt,a[href],[role='menuitem']");
        if (!interactive) e.preventDefault();
      }
      const gate = () => {
        if (e.repeat) return false;
        const now = Date.now();
        if (now - catExamPrimaryActionGateMsRef.current < 420) return false;
        catExamPrimaryActionGateMsRef.current = now;
        return true;
      };
      const letterIndex = (() => {
        if (optsCanonical.length === 0) return null;
        const k = e.key.length === 1 ? e.key.toUpperCase() : "";
        if (!k || k < "A" || k > "Z") return null;
        const i = k.charCodeAt(0) - "A".charCodeAt(0);
        return i >= 0 && i < optsCanonical.length ? i : null;
      })();
      const digitIndex = (() => {
        if (optsCanonical.length === 0) return null;
        const d = e.key;
        if (d < "1" || d > "9") return null;
        const i = Number.parseInt(d, 10) - 1;
        return i >= 0 && i < optsCanonical.length ? i : null;
      })();
      if (letterIndex != null || digitIndex != null) {
        if (!catExamCanChangeAnswer(catExamUiPhaseRef.current)) return;
        if (saving || qLoading || catAdvanceInFlightRef.current) return;
        const i = letterIndex ?? digitIndex!;
        const canonical = optsCanonical[i];
        if (!canonical) return;
        if (isSata) {
          const prior = answersRef.current[current.id];
          const prev = Array.isArray(prior) ? [...prior] : [];
          const has = prev.includes(canonical);
          setAnswerForCurrentRef.current(has ? prev.filter((x) => x !== canonical) : [...prev, canonical]);
        } else {
          setAnswerForCurrentRef.current(canonical);
        }
        e.preventDefault();
        return;
      }
      if (e.key !== "Enter") return;
      if (e.repeat) {
        e.preventDefault();
        return;
      }
      if (!gate()) {
        e.preventDefault();
        return;
      }
      const phaseNow = catExamUiPhaseRef.current;
      if (phaseNow === "answering") {
        if (!hasMeaningfulAnswer(current.id)) return;
        if (saving || qLoading || catAdvanceInFlightRef.current) return;
        lockCatExamAnswer();
        e.preventDefault();
        return;
      }
      if (phaseNow === "submitted_locked") {
        if (saving || qLoading || catAdvanceInFlightRef.current) return;
        catExamKeyboardAdvanceRef.current = true;
        void catAdvanceLatestRef.current();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    isExamStyle,
    catMode,
    status,
    phase,
    current,
    current?.id,
    optsCanonical,
    isSata,
    saving,
    qLoading,
    lockCatExamAnswer,
  ]);

  useEffect(() => {
    if (!isExamStyle || !catExamKeyboardAdvanceRef.current) return;
    catExamKeyboardAdvanceRef.current = false;
    queueMicrotask(() => {
      const wrap = document.querySelector("[data-cat-exam-root]");
      const btn = wrap?.querySelector("button.nn-cat-opt") as HTMLButtonElement | null;
      btn?.focus();
    });
  }, [qid, isExamStyle]);

  useEffect(() => {
    if (!isExamStyle) return;
    const el = document.getElementById("nn-cat-exam-scroll-region");
    if (el) el.scrollTop = 0;
  }, [qid, isExamStyle]);

  /** Inline recovery when PATCH save / CAT advance / linear commit fails but the item is still visible (legacy exam-fallbacks recovery intent). */
  const sessionRecoverable =
    phase === "ready" &&
    status === "IN_PROGRESS" &&
    Boolean(current) &&
    Boolean(error) &&
    !qLoading;
  const sessionRecoveryBanner = sessionRecoverable ? (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)] shadow-sm"
    >
      <p className="font-semibold text-[var(--semantic-text-primary)]">
        {tx("learner.practiceTests.run.sessionIssueTitle", "We could not sync that step")}
      </p>
      <p className="mt-1 text-[var(--semantic-text-secondary)]">{error}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
          onClick={() => {
            setError(null);
            void load();
          }}
        >
          {tx("learner.practiceTests.run.sessionTryAgain", "Try again")}
        </button>
        <button
          type="button"
          className="rounded-full border border-transparent px-4 py-2 text-xs font-semibold text-[var(--semantic-text-muted)] underline-offset-2 hover:underline"
          onClick={() => setError(null)}
        >
          {tx("learner.practiceTests.run.sessionDismiss", "Dismiss")}
        </button>
      </div>
    </div>
  ) : null;

  if (phase === "loading") {
    return <PracticeTestRunPageSkeleton />;
  }
  if (phase === "error") {
    return (
      <div className="nn-card space-y-4 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">
          {tx("learner.practiceTests.run.loadFailedTitle", "Could not load this practice test")}
        </p>
        <p>{error ?? tx("learner.practiceTests.run.error", "Error")}</p>
        <p className="text-xs text-[var(--semantic-text-secondary)]">
          {tx(
            "learner.practiceTests.run.loadFailedHint",
            "Check your connection and try again. If you were already in progress, your session may still be on the server.",
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            onClick={() => void load()}
          >
            {tx("learner.practiceTests.run.retryLoad", "Retry")}
          </button>
          <Link className="inline-flex items-center font-medium text-primary underline" href="/app/practice-tests">
            {tx("learner.practiceTests.run.backToBank", "Back to test bank")}
          </Link>
        </div>
      </div>
    );
  }

  async function loadTeachingReview() {
    setTeachingReviewLoading(true);
    try {
      const res = await fetchWithRetry(`/api/practice-tests/${testId}?teachingReview=1`, undefined, {
        attempts: 2,
        timeoutMs: 30_000,
      });
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
              Session complete: final item
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
                continueLabel={tx(
                  "learner.practiceTests.run.viewResultsSummary",
                  "View results summary",
                )}
                onContinue={() => setCatFinalStudyFeedback(null)}
                continueDisabled={false}
                pathwayId={testConfig?.pathwayId ?? null}
              />
            </div>
          </div>
        </div>
      );
    }

    // Main results page — ResultsSummary + confidence analytics + coach + teaching review
    // Build correctness map from linearPracticeFeedback (linear practice mode)
    const correctnessMap: Record<string, boolean> = {};
    for (const [qid, fb] of Object.entries(linearPracticeFeedback)) {
      correctnessMap[qid] = fb.isCorrect;
    }
    // Build question metadata map (index + topic) for review priority groups
    const questionMetaMap: Record<string, { index: number; topic?: string | null }> = {};
    for (let i = 0; i < questionIds.length; i++) {
      const qid = questionIds[i];
      if (qid) {
        questionMetaMap[qid] = {
          index: i,
          topic: questionCache[qid]?.topic ?? null,
        };
      }
    }

    return (
      <div>
        {/* ── Spec §7 structured results ─────────────────────────── */}
        <ResultsSummary
          results={results}
          testId={testId}
          elapsedMs={savedElapsedMs}
          pathwayId={testConfig?.pathwayId ?? null}
        />

        {/* ── Confidence analytics (shown when rated questions exist) ── */}
        {confidenceTrackingEnabled && Object.keys(confidence).length > 0 ? (
          <div className="mx-auto max-w-[900px] px-6 pb-8">
            <div className="nn-cat-question-card">
              <h3 className="mb-5 font-semibold text-[var(--semantic-text-primary)]">
                Confidence Analysis
              </h3>
              <ConfidenceAnalyticsBlock
                confidence={confidence}
                correctness={correctnessMap}
                questionMeta={questionMetaMap}
                isEntitled={isEntitled}
              />
            </div>
          </div>
        ) : null}

        {/* ── Smart Review Screen (linear practice: always shown when feedback exists) ── */}
        {Object.keys(linearPracticeFeedback).length > 0 ? (() => {
          const smartReviewItems: SmartReviewItem[] = [];
          for (let i = 0; i < questionIds.length; i++) {
            const qid = questionIds[i];
            if (!qid) continue;
            const fb = linearPracticeFeedback[qid];
            if (!fb) continue;
            const q = questionCache[qid];
            smartReviewItems.push({
              id: qid,
              index: i,
              stem: q?.stem ?? "Question not available",
              topic: q?.topic ?? null,
              subtopic: q?.subtopic ?? null,
              isCorrect: fb.isCorrect,
              confidence: confidenceTrackingEnabled
                ? ((confidence[qid] as (typeof confidence)[string] | undefined) ?? null)
                : null,
              rationale: fb.rationale,
              correctAnswerExplanation: fb.correctAnswerExplanation ?? null,
              relatedLessons: fb.relatedLessons ?? [],
            });
          }
          return (
            <div className="mx-auto max-w-[900px] px-6 pb-8">
              <div className="nn-cat-question-card">
                <h3 className="mb-5 font-semibold text-[var(--semantic-text-primary)]">
                  Smart Review
                </h3>
                <SmartReviewLayout items={smartReviewItems} isEntitled={isEntitled} />
              </div>
            </div>
          );
        })() : null}

        {/* ── Adaptive Study Plan (CAT or linear practice with results) ── */}
        {adaptivePlanEnabled ? (() => {
          const readinessScore = results.catReport?.readinessScore ?? results.accuracyPct;
          const weakAreas = results.catReport?.weakAreas ?? results.weakAreas ?? [];
          // Derive overconfidence signal from confidence + correctness maps
          let overconfidentCount = 0;
          let uncertainCorrectCount = 0;
          for (const [qid, lvl] of Object.entries(confidence)) {
            const isCorrect = correctnessMap[qid];
            if (lvl === "high" && isCorrect === false) overconfidentCount++;
            if ((lvl === "low" || lvl === "medium") && isCorrect === true)
              uncertainCorrectCount++;
          }
          const totalRated = Object.keys(confidence).length;
          const hasOverconfidence =
            totalRated > 0 && overconfidentCount / totalRated >= 0.2;
          const hasManyUncertainCorrect =
            totalRated > 0 && uncertainCorrectCount / totalRated >= 0.25;

          // Only render when there is something meaningful to plan from
          if (weakAreas.length === 0 && Object.keys(results.byTopic).length === 0) return null;

          return (
            <div className="mx-auto max-w-[900px] px-6 pb-8">
              <div className="nn-cat-question-card">
                  <StudyPlanFromResults
                  readinessScore={readinessScore}
                  byTopic={results.byTopic}
                  weakAreas={weakAreas}
                  hasOverconfidence={hasOverconfidence}
                  hasManyUncertainCorrect={hasManyUncertainCorrect}
                  pathwayId={testConfig?.pathwayId ?? null}
                  testId={testId}
                  isEntitled={isEntitled}
                />
              </div>
            </div>
          );
        })() : (
          <div className="mx-auto max-w-[900px] px-6 pb-8">
            <div className="nn-cat-question-card space-y-3">
              <h3 className="font-semibold text-[var(--semantic-text-primary)]">
                Continue your study your way
              </h3>
              <p className="text-sm text-[var(--semantic-text-secondary)]">
                Adaptive planning is turned off in your study settings, so this session ends with neutral next steps instead of an auto-generated plan.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/app/questions"
                  className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
                >
                  Open question bank
                </Link>
                <Link
                  href="/app/lessons"
                  className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold"
                >
                  Browse lessons
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Coach card (CAT-specific, premium) ──────────────────── */}
        {results.catReport ? (
          <div className="mx-auto max-w-[900px] px-6 pb-8">
            <CatResultsCoachSection
              coach={results.catCoach}
              catExamFeedbackMode={results.catExamFeedbackMode ?? testConfig?.catExamFeedbackMode ?? null}
              pathwayId={testConfig?.pathwayId ?? null}
            />
          </div>
        ) : null}

        {/* ── Study loop next card ─────────────────────────────────── */}
        {adaptivePlanEnabled ? (
          <div className="mx-auto max-w-[900px] px-6 pb-6">
            <PracticeTestStudyLoopNext results={results} pathwayId={testConfig?.pathwayId ?? null} coach={results.catCoach ?? null} />
          </div>
        ) : null}

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
        {tx("learner.practiceTests.run.abandoned", "This test was abandoned.")}{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          {tx("learner.practiceTests.run.backToBank", "Back to test bank")}
        </Link>
      </p>
    );
  }

  if (phase === "ready" && status === "IN_PROGRESS" && questionIds.length === 0) {
    return (
      <div className="nn-card space-y-3 p-6 text-sm">
        <p className="font-medium text-foreground">
          {tx("learner.practiceTests.run.noQuestionsTitle", "No questions in this practice test.")}
        </p>
        <p className="text-muted-foreground">
          {tx(
            "learner.practiceTests.run.noQuestionsBody",
            "The pool may have been empty for your filters and tier, or the test was saved in an incomplete state. Start a new adaptive (CAT) or linear test from the list. Broaden topics or difficulty if you see this again.",
          )}
        </p>
        <Link className="inline-block font-semibold text-primary underline" href="/app/practice-tests">
          {tx("learner.practiceTests.run.backToPracticeTests", "Back to practice tests")}
        </Link>
      </div>
    );
  }

  if (status !== "IN_PROGRESS") {
    return (
      <p className="text-sm text-muted-foreground">
        {tx("learner.practiceTests.run.notInProgress", "This test is not in progress.")}{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          {tx("learner.practiceTests.run.back", "Back")}
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
          <p className="font-medium text-foreground">
            {tx("learner.practiceTests.run.loadQuestionFailed", "Could not load this question.")}
          </p>
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
                  const { [id]: removedQuestion, ...rest } = c;
                  void removedQuestion;
                  return rest;
                });
                setQuestionFetchNonce((n) => n + 1);
              }}
            >
              {tx("learner.practiceTests.run.retryItem", "Retry this item")}
            </button>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              onClick={() => void load()}
            >
              {tx("learner.practiceTests.run.reloadTest", "Reload test")}
            </button>
            <Link className="inline-flex items-center font-medium text-primary underline" href="/app/practice-tests">
              {tx("learner.practiceTests.run.back", "Back")}
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4" aria-busy="true">
        <ExamSessionShell neutralPalette immersive className="overflow-hidden shadow-md">
          <ExamSessionTopBar
            left={
              <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                {tx("learner.practiceTests.run.item", "Item")} {idx + 1} {tx("learner.practiceTests.run.of", "of")} {total}
              </p>
            }
            center={
              <span className="nn-marketing-caption text-[var(--theme-muted-text)]">
                {tx("learner.practiceTests.run.loading", "Loading")}
              </span>
            }
            right={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ExamSessionThemeTrigger />
                <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
              </div>
            }
          />
          {total > 0 ? <ExamProgressBar current={idx + 1} total={total} /> : null}
          <div className="nn-question-session space-y-4">
            <div className="h-4 w-[75%] animate-pulse rounded-md bg-muted/60" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
            <div className="h-4 w-[83%] animate-pulse rounded-md bg-muted/60" />
            <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
              {tx("learner.practiceTests.run.loadingQuestion", "Loading question...")}
            </p>
          </div>
        </ExamSessionShell>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="nn-card space-y-3 p-6 text-sm text-muted-foreground">
        <p>{tx("learner.practiceTests.run.displayItemFailed", "Could not display this item.")}</p>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
          onClick={() => void load()}
        >
          {tx("learner.practiceTests.run.retry", "Retry")}
        </button>
        <Link className="ml-2 font-medium text-primary underline" href="/app/practice-tests">
          {tx("learner.practiceTests.run.back", "Back")}
        </Link>
      </div>
    );
  }

  // Derived layout / display values
  const modeLabel = isLinearEngine
    ? linearRationaleVisibility === "end_of_exam"
      ? tx("learner.practiceTests.run.linearExamMode", "Linear exam")
      : tx("learner.practiceTests.run.linearPracticeMode", "Linear practice")
    : catMode
      ? examSimulation
        ? aanpNpExamSim
          ? tx("learner.practiceTests.run.npSimulationMode", "NP simulation · AANP-style")
          : tx("learner.practiceTests.run.nclexSimulationMode", "NCLEX simulation · CAT")
        : catFeedbackStudy
          ? tx("learner.practiceTests.run.catStudyMode", "CAT · Study Mode")
          : pathwaySurface?.shortName
            ? `${pathwaySurface.shortName} · ${tx("learner.practiceTests.run.adaptiveExamShort", "Adaptive exam")}`
            : tx("learner.practiceTests.run.catTestMode", "CAT · Test Mode")
      : tx("learner.practiceTests.run.practiceMode", "Practice test");
  const controlsBusy = saving || qLoading;

  const sessionPct = total > 0 ? Math.min(100, Math.max(0, ((idx + 1) / total) * 100)) : 0;

  const optionDisplayMap = Object.fromEntries(
    optsCanonical.map((k, i) => [k, optsDisplay[i] ?? k]),
  );

  // ══════════════════════════════════════════════════════════════════════════
  // CAT MODE — study: split + rationale. Test (exam): single column, submit→lock→next, adaptive progress.
  // Server: `cat_advance` still scores and selects the next item in one PATCH (no separate commit endpoint).
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
      if (isExamStyle && catExamOptionsInteractionLocked(catExamUiPhase)) {
        if (isSelected) return "selected";
        return "dim";
      }
      return isSelected ? "selected" : "default";
    }

    const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const optLocked = catStudyLocked;
    const optionsInteractionLocked =
      optLocked || Boolean(isExamStyle && catExamOptionsInteractionLocked(catExamUiPhase));

    // Build CAT-specific option rows using AnswerOptionRow
    const catOptions =
      optsCanonical.length === 0 ? (
        <p className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-muted)]">
          {tx(
            "learner.practiceTests.run.noAnswerChoices",
            "No answer choices were returned for this item. Use Retry, reload the test, or contact support if this persists.",
          )}
        </p>
      ) : isSata ? (
        <ul
          className="nn-cat-opt-list"
          role="group"
          aria-label={
            isExamStyle && catExamOptionsInteractionLocked(catExamUiPhase)
              ? tx(
                  "learner.practiceTests.run.answerChoicesSataLockedAria",
                  "Answer choices (select all that apply) — response submitted; use Next when ready",
                )
              : tx(
                  "learner.practiceTests.run.answerChoicesSataAria",
                  "Answer choices (select all that apply)",
                )
          }
        >
          {optsCanonical.map((canonical, i) => {
            const selected = Array.isArray(raw) ? raw.includes(canonical) : false;
            const optState = catOptState(canonical);
            return (
              <li key={canonical}>
                <AnswerOptionRow
                  letter={LETTERS[i] ?? String(i + 1)}
                  text={optsDisplay[i] ?? canonical}
                  state={
                    optionsInteractionLocked
                      ? optState === "selected"
                        ? "selected"
                        : optState
                      : selected
                        ? "selected"
                        : "default"
                  }
                  disabled={optionsInteractionLocked}
                  isCheckbox
                  checked={selected}
                  onChange={(checked) => {
                    const prior = answersRef.current[current.id];
                    const prev = Array.isArray(prior) ? [...prior] : [];
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
        <ul
          className="nn-cat-opt-list"
          role="radiogroup"
          aria-label={
            isExamStyle && catExamOptionsInteractionLocked(catExamUiPhase)
              ? tx(
                  "learner.practiceTests.run.answerChoicesLockedAria",
                  "Answer choices — response submitted; use Next when ready",
                )
              : tx("learner.practiceTests.run.answerChoicesAria", "Answer choices")
          }
        >
          {optsCanonical.map((canonical, i) => (
            <li key={canonical}>
              <AnswerOptionRow
                letter={LETTERS[i] ?? String(i + 1)}
                text={optsDisplay[i] ?? canonical}
                state={catOptState(canonical)}
                disabled={optionsInteractionLocked}
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

    const catMaxQ = testConfig?.catMaxQuestions ?? null;
    const catMinQ = testConfig?.catMinQuestions ?? null;
    const examPrimaryBusy = catExamFooterPrimaryBusy(catExamUiPhase, controlsBusy);
    const catExamAdvanceIntent = catExamAdvancePrimaryIntentFromSessionShape({
      deliveredQuestionCount: total,
      catMaxQuestions: catMaxQ,
    });
    const catExamAdvancePrimaryLabel =
      catExamUiPhase === "advancing" || saving
        ? tx("learner.practiceTests.run.working", "Working...")
        : catExamAdvanceIntent === "finish_session"
          ? tx("learner.practiceTests.run.submitAndFinish", "Submit & finish")
          : tx("learner.practiceTests.run.nextQuestion", "Next question");

    const catExamNavFooter = (
      <div className="nn-cat-question-nav nn-question-nav-actions">
        <button
          type="button"
          aria-pressed={Boolean(flagged[current.id])}
          disabled={examPrimaryBusy}
          className={`nn-cat-question-nav__flag inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold transition ${
            flagged[current.id]
              ? "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]"
              : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
          }`}
          onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
        >
          <span aria-hidden="true">{flagged[current.id] ? "★" : "☆"}</span>
          {flagged[current.id]
            ? tx("learner.practiceTests.run.flagged", "Flagged")
            : tx("learner.practiceTests.run.flag", "Flag")}
        </button>
        <button
          type="button"
          disabled={examPrimaryBusy}
          className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
          onClick={() => void abandon()}
        >
          {tx("learner.practiceTests.run.endSession", "End session")}
        </button>
        {isExamStyle ? (
          catExamUiPhase === "answering" ? (
            <button
              type="button"
              data-nn-qa-cat-exam-submit-answer
              disabled={examPrimaryBusy || !hasMeaningfulAnswer(current.id)}
              className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
              onClick={lockCatExamAnswer}
            >
              {tx("learner.practiceTests.run.submitAnswer", "Submit answer")}
            </button>
          ) : (
            <button
              type="button"
              ref={catExamAdvanceButtonRef}
              data-nn-qa-cat-exam-advance
              data-nn-qa-cat-exam-advance-intent={catExamAdvanceIntent}
              aria-busy={catExamUiPhase === "advancing"}
              disabled={
                examPrimaryBusy ||
                catExamUiPhase !== "submitted_locked" ||
                !hasMeaningfulAnswer(current.id)
              }
              className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
              onClick={() => {
                if (!catExamCanRequestCatAdvance(catExamUiPhaseRef.current)) return;
                if (catAdvanceInFlightRef.current || submitInFlightRef.current) return;
                void catAdvance();
              }}
            >
              {catExamAdvancePrimaryLabel}
            </button>
          )
        ) : rationalePanelMode === "feedback" ? null : (
          <button
            type="button"
            disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
            className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
            onClick={() => void catAdvance()}
          >
            {saving
              ? tx("learner.practiceTests.run.working", "Working...")
              : tx("learner.practiceTests.run.seeExplanation", "See explanation")}
          </button>
        )}
      </div>
    );

    return (
      <ProtectedPremiumContent
        userLabel={userLabel}
        flags={protectionFlags}
        telemetrySurface="practice_test"
      >
        <PracticeSessionLayout className={`flex min-h-0 flex-1 flex-col ${chromeClass}`}>
          <ExamSessionShell
            neutralPalette
            immersive
            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-0 bg-transparent !shadow-none${isExamStyle ? " nn-cat-exam-chrome" : ""}`}
          >
            <ExamSessionTopBar
              className={isExamStyle ? "nn-cat-exam-topbar" : ""}
              left={
                <div className="space-y-1">
                  <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {isExamStyle ? (
                      <>
                        {tx("learner.practiceTests.run.item", "Item")}{" "}
                        <span className="tabular-nums">{idx + 1}</span>
                      </>
                    ) : (
                      <>
                        {tx("learner.practiceTests.run.question", "Question")} {idx + 1}{" "}
                        {tx("learner.practiceTests.run.of", "of")} {total}
                      </>
                    )}
                  </p>
                  {examName ? (
                    <p className="line-clamp-2 nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                      {examName}
                    </p>
                  ) : null}
                </div>
              }
              center={
                isExamStyle ? (
                  <span className="nn-marketing-caption max-w-[min(100%,22rem)] text-center font-semibold leading-snug text-[var(--semantic-text-muted)]">
                    {catMinQ != null && catMaxQ != null && catMinQ > 0 && catMaxQ > 0
                      ? tx("learner.practiceTests.run.catLengthBoundsExam", "Minimum {min} · Maximum {max}", {
                          min: String(catMinQ),
                          max: String(catMaxQ),
                        })
                      : tx("learner.practiceTests.run.adaptiveExamShort", "Adaptive exam")}
                  </span>
                ) : (
                  <span className="nn-marketing-caption font-semibold tabular-nums text-[var(--semantic-text-muted)]">
                    {Math.round(sessionPct)}% {tx("learner.practiceTests.run.complete", "complete")}
                  </span>
                )
              }
              right={
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <ExamSessionThemeTrigger variant="pill" />
                  <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
                </div>
              }
            />
            {isExamStyle ? (
              <ExamProgressBar
                className="nn-exam-progress--cat-exam-adaptive"
                current={idx + 1}
                total={Math.max(total, 1)}
                variant="adaptive_item"
                adaptiveMaxItems={catMaxQ}
                sessionLabel={
                  pathwaySurface?.shortName
                    ? `${pathwaySurface.shortName} · ${tx("learner.practiceTests.run.adaptiveSessionShort", "Adaptive")}`
                    : undefined
                }
              />
            ) : (
              <ExamProgressBar current={idx + 1} total={total} />
            )}
            {sessionRecoveryBanner}
            <div
              className={`nn-cat-session min-h-0 flex-1 ${chromeClass}${isExamStyle ? " nn-cat-session--exam-single" : ""}`}
            >
              <div
                className={`nn-question-session nn-question-session--split !px-0 sm:!px-0${isExamStyle ? " nn-question-session--single flex min-h-0 min-w-0 flex-1 flex-col" : ""}`}
              >
                <div
                  className={`nn-question-session-primary min-h-0 overflow-x-hidden${isExamStyle ? " flex min-h-0 flex-1 flex-col overflow-hidden" : " overflow-y-auto"}`}
                >
                  <div
                    className={
                      isExamStyle ? "nn-cat-exam-col flex min-h-0 min-w-0 flex-1 flex-col" : "min-h-0 min-w-0"
                    }
                    data-cat-exam-root={isExamStyle ? "" : undefined}
                  >
                    <QuestionCard
                      stem={current.stem ?? ""}
                      topic={isExamStyle ? null : current.topic}
                      subtopic={isExamStyle ? null : current.subtopic}
                      difficultyLabel={
                        isExamStyle
                          ? null
                          : current.difficulty != null
                            ? difficultyBandLabel(current.difficulty)
                            : null
                      }
                      examStackedLayout={isExamStyle}
                      footerSlot={isExamStyle ? catExamNavFooter : undefined}
                    >
                      {isExamStyle ? (
                        <p className="sr-only" aria-live="polite" aria-atomic="true">
                          {catExamUiPhase === "submitted_locked"
                            ? tx(
                                "learner.practiceTests.run.catExamLockedLive",
                                "Answer submitted. Your selection is locked until you go to the next item.",
                              )
                            : catExamUiPhase === "advancing"
                              ? tx("learner.practiceTests.run.catExamAdvancingLive", "Saving your response…")
                              : catExamUiPhase === "completed"
                                ? tx(
                                    "learner.practiceTests.run.catExamCompletedLive",
                                    "Exam complete. Preparing your results.",
                                  )
                                : "\u00a0"}
                        </p>
                      ) : null}
                      {timedMode && timeLimitSec != null ? (
                        <div className="nn-cat-exam-timing-alert mb-5" role="alert">
                          {tx(
                            "learner.practiceTests.run.timedAutoEnd",
                            "Timed session: the exam may end automatically when time expires.",
                          )}
                        </div>
                      ) : null}

                      {!isExamStyle && (catLiveTransparency || adaptiveDifficultyHistory.length > 0) ? (
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

                      <p className="nn-cat-options-label">
                        {isSata
                          ? tx("learner.practiceTests.run.selectAllThatApply", "Select all that apply")
                          : tx("learner.practiceTests.run.selectBestAnswer", "Select the best answer")}
                      </p>

                      {catOptions}

                      {confidenceTrackingEnabled && !isExamStyle && hasMeaningfulAnswer(current.id) ? (
                        <div className="mt-4">
                          <ConfidenceSelector
                            questionId={current.id}
                            value={confidence[current.id] ?? null}
                            neutral
                            onChange={setConfidenceForQuestion}
                          />
                        </div>
                      ) : null}

                      {!isExamStyle ? catExamNavFooter : null}
                    </QuestionCard>
                  </div>
                </div>

                {!isExamStyle ? (
                  <aside className="nn-question-session-rationale flex min-h-0 flex-col">
                    <RationalePanel
                      mode={rationalePanelMode}
                      feedback={
                        rationalePanelMode === "feedback" ? catStudyFeedback ?? undefined : undefined
                      }
                      optionKeys={optsCanonical}
                      optionTexts={optsDisplay}
                    />
                  </aside>
                ) : null}
              </div>
            </div>
          </ExamSessionShell>
        </PracticeSessionLayout>
      </ProtectedPremiumContent>
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
      linearRationaleVisibility === "after_each" &&
      linearFeedback
    ) {
      const ck = new Set(linearFeedback.correctKeys);
      if (ck.has(canonical)) return "correct";
      if (isSelected) return "incorrect";
      return "dim";
    }
    if (isLinearEngine && currentCommitted && linearRationaleVisibility === "end_of_exam") {
      return isSelected ? "selected" : "dim";
    }
    return isSelected ? "selected" : "default";
  }

  const optIsLocked = isLinearEngine && currentCommitted;

  const practiceOptionRows =
    optsCanonical.length === 0 ? (
      <p className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-muted)]">
        {tx(
          "learner.practiceTests.run.noAnswerChoices",
          "No answer choices were returned for this item. Use Retry, reload the test, or contact support if this persists.",
        )}
      </p>
    ) : isSata ? (
      <ul
        className="nn-practice-opt-list"
        role="group"
        aria-label="Answer choices (select all that apply)"
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
                  const prior = answersRef.current[current.id];
                  const prev = Array.isArray(prior) ? [...prior] : [];
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
    isLinearEngine && linearRationaleVisibility === "after_each" && currentCommitted && linearFeedback
      ? linearFeedback.isCorrect
        ? "correct"
        : "incorrect"
      : isLinearEngine && linearRationaleVisibility === "end_of_exam" && currentCommitted
        ? "exam_locked"
        : "waiting";

  const topBarRightLabel =
    isLinearEngine && committedCount > 0
      ? `${committedAnsweredPct}% ${tx("learner.practiceTests.run.complete", "complete")}`
      : modeLabel;

  return (
    <ProtectedPremiumContent
      userLabel={userLabel}
      flags={protectionFlags}
      telemetrySurface="practice_test"
    >
      <PracticeSessionLayout className={`flex min-h-0 flex-1 flex-col ${chromeClass}`}>
        <ExamSessionShell neutralPalette immersive className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-0 bg-transparent !shadow-none">
          <ExamSessionTopBar
            left={
              <div className="space-y-1">
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {tx("learner.practiceTests.run.question", "Question")} {idx + 1}{" "}
                  {tx("learner.practiceTests.run.of", "of")} {total}
                </p>
                {examName ? (
                  <p className="line-clamp-2 nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                    {examName}
                  </p>
                ) : null}
              </div>
            }
            center={
              <span className="nn-marketing-caption text-[var(--semantic-text-muted)]">{topBarRightLabel}</span>
            }
            right={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ExamSessionThemeTrigger variant="pill" />
                <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
              </div>
            }
          />
          <ExamProgressBar current={idx + 1} total={total} />
          {sessionRecoveryBanner}
          <div className="nn-question-session nn-question-session--split min-h-0 flex-1 overflow-hidden !px-0 sm:!px-0">
            <div className="nn-question-session-primary min-h-0 overflow-y-auto">
            <PracticeQuestionCard
              stem={
                typeof current.stem === "string" && current.stem.trim().length > 0
                  ? current.stem
                  : tx(
                    "learner.practiceTests.run.questionUnavailable",
                    "Question text is unavailable. Try reloading this item.",
                  )
              }
              topic={current.topic}
              subtopic={current.subtopic}
              difficultyLabel={
                current.difficulty != null
                  ? difficultyBandLabel(current.difficulty)
                  : null
              }
              optionsLabel={isSata
                ? tx("learner.practiceTests.run.selectAllThatApply", "Select all that apply")
                : tx("learner.practiceTests.run.selectBestAnswer", "Select the best answer")}
            >
              {timedMode && timeLimitSec != null ? (
                <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                  {tx(
                    "learner.practiceTests.run.timedAutoEnd",
                    "Timed session: the exam may end automatically when time expires.",
                  )}
                </p>
              ) : null}
              {timedMode ? (
                <div className="flex justify-end">
                  <ExamTimerReadout remainingSec={remainingSec} />
                </div>
              ) : null}
              {practiceOptionRows}

              {/* Confidence selector — practice mode: full semantic palette */}
              {confidenceTrackingEnabled ? (
                <ConfidenceSelector
                  questionId={current.id}
                  value={confidence[current.id] ?? null}
                  onChange={setConfidenceForQuestion}
                />
              ) : (
                <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
                  {tx(
                    "learner.practiceTests.run.confidenceTrackingOff",
                    "Confidence tracking is off in your study settings for this session.",
                  )}
                </div>
              )}

              <div className="nn-practice-q-nav nn-question-nav-actions">
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
                  {flagged[current.id]
                    ? tx("learner.practiceTests.run.marked", "Marked")
                    : tx("learner.practiceTests.run.flag", "Flag")}
                </button>
                <div className="nn-practice-q-nav__spacer" />
                {!isLinearEngine ? (
                  <button
                    type="button"
                    disabled={idx === 0 || controlsBusy}
                    className="nn-btn-secondary min-h-[2.5rem] rounded-lg px-4 text-sm font-semibold disabled:opacity-40"
                    onClick={() => void goPrev()}
                  >
                    {tx("learner.practiceTests.run.previous", "Previous")}
                  </button>
                ) : null}
                {isLinearEngine && !currentCommitted ? (
                  <button
                    type="button"
                    disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void submitLinearCommit()}
                  >
                    {saving
                      ? tx("learner.practiceTests.run.submitting", "Submitting...")
                      : tx("learner.practiceTests.run.submitAnswer", "Submit answer")}
                  </button>
                ) : null}
                {idx < total - 1 ? (
                  <button
                    type="button"
                    disabled={controlsBusy || (isLinearEngine && !currentCommitted)}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void goNext()}
                  >
                    {tx("learner.practiceTests.run.next", "Next")}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={controlsBusy || (isLinearEngine && !currentCommitted)}
                    className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                    onClick={() => void submitTest()}
                  >
                    {saving
                      ? tx("learner.practiceTests.run.submitting", "Submitting...")
                      : tx("learner.practiceTests.run.finish", "Finish")}
                  </button>
                )}
                <button
                  type="button"
                  disabled={controlsBusy}
                  className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
                  onClick={() => void abandon()}
                >
                  {tx("learner.practiceTests.run.abandon", "Abandon")}
                </button>
              </div>
            </PracticeQuestionCard>
            </div>
            <aside className="nn-question-session-rationale flex min-h-0 flex-col">
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
                confidenceLevel={confidenceTrackingEnabled ? (confidence[current.id] ?? null) : null}
              />
            </aside>
          </div>
        </ExamSessionShell>
      </PracticeSessionLayout>
    </ProtectedPremiumContent>
  );
}
