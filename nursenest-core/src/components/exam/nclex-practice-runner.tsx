"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, CircleHelp, XCircle } from "lucide-react";
import {
  NclexAnswerList,
  NclexAnswerCard,
  NclexQuestionStem,
  type NclexAnswerCardState,
} from "@/components/exam/nclex-exam-layout";
import { NclexPracticeTopBar, NclexEndTestModal } from "@/components/exam/nclex-cat-top-bar";
import { NclexPracticeBottomBar } from "@/components/exam/nclex-bottom-bar";
import { NclexCalculatorModal } from "@/components/exam/nclex-calculator-modal";
import { NclexNotesDrawer } from "@/components/exam/nclex-notes-drawer";
import { NclexLabReference } from "@/components/exam/nclex-lab-reference";
import type { PracticeAdaptivePostMissPayload } from "@/components/student/practice-adaptive-post-miss-panel";
import { BowtieQuestionRenderer } from "@/components/exams/questions/bowtie-question-renderer";
import {
  coerceBowtieDraftAnswer,
  isBowtieAnswerComplete,
  tryNormalizeBowtiePayload,
} from "@/lib/questions/bowtie-adapter";
import { getLinearCommittedQuestionIds } from "@/lib/practice-tests/practice-linear-engine";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { ExamMeasurementUnitToggle } from "@/components/measurements/exam-measurement-unit-toggle";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { governMeasurementSurfaceCopy } from "@/lib/measurements/measurement-surface-convergence";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";

type QRow = {
  id: string;
  stem: string;
  questionType: string;
  questionFormat?: string | null;
  options: unknown;
  displayOptions?: string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: number | null;
  images?: unknown;
};

type LinearFeedback = {
  isCorrect: boolean;
  topic?: string | null;
  rationale: string | null;
  correctKeys: string[];
  correctAnswerExplanation?: string | null;
  distractorRationalesMap: Record<string, string> | null;
  keyTakeaway: string | null;
  relatedLessons: { title: string; href: string }[];
  clinicalPearlDisplay: string | null;
  referenceSource: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

function hasMeaningfulAnswer(ans: unknown): boolean {
  if (ans == null) return false;
  if (typeof ans === "string") return ans.trim().length > 0;
  if (Array.isArray(ans)) return ans.length > 0;
  return false;
}

function cleanExamStem(stem: string): string {
  return stem
    .replace(/^\s*\([A-Z0-9_-]+(?:\s+[A-Z0-9_-]+)*\)\s*/u, "")
    .replace(/^\s*\[[^\]]*(?:Q\d{2,}|QUESTION[_\s-]*ID|TAXONOMY|CATEGORY|TOPIC[_\s-]*ID)[^\]]*\]\s*/iu, "")
    .replace(/\s*\((?:[A-Z]+(?:-[A-Z]+)*\s+)?Q\d{2,}\)\s*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSataQuestion(q: QRow): boolean {
  const fmt = (q.questionFormat ?? q.questionType ?? "").toLowerCase();
  return fmt.includes("sata") || fmt.includes("multi");
}

function isBowtieQuestion(q: QRow): boolean {
  const fmt = (q.questionFormat ?? q.questionType ?? "").toLowerCase();
  return fmt.includes("bowtie");
}

async function loadSession(testId: string, signal?: AbortSignal) {
  const res = await fetchWithRetry(
    `/api/practice-tests/${testId}?hydrate=full`,
    { method: "GET", signal, credentials: "include", cache: "no-store" },
    { attempts: 2, timeoutMs: 12_000 },
  );
  if (!res.ok) throw new Error("Failed to load session");
  const j = await res.json() as {
    status?: string;
    pathwaySurface?: { shortName?: string | null; id?: string | null } | null;
    timedMode?: boolean;
    timeLimitSec?: number | null;
    elapsedMs?: number | null;
    cursorIndex?: number;
    answers?: Record<string, unknown>;
    questionIds?: unknown;
    questions?: unknown[];
    results?: PracticeTestResultsJson | null;
    adaptiveState?: unknown;
  };

  const questionIds = Array.isArray(j.questionIds) ? j.questionIds.map(String) : [];
  const questionCache: Record<string, QRow> = {};
  if (Array.isArray(j.questions)) {
    for (const q of j.questions) {
      if (q && typeof q === "object") {
        const row = q as Record<string, unknown>;
        if (typeof row.id === "string" && row.id) {
          questionCache[row.id] = row as unknown as QRow;
        }
      }
    }
  }

  return {
    questionIds,
    questionCache,
    answers: (j.answers && typeof j.answers === "object" && !Array.isArray(j.answers))
      ? (j.answers as Record<string, unknown>)
      : {},
    cursorIndex: j.cursorIndex ?? 0,
    timedMode: j.timedMode ?? false,
    timeLimitSec: j.timeLimitSec ?? null,
    elapsedMs: j.elapsedMs ?? null,
    status: j.status ?? "IN_PROGRESS",
    results: j.results ?? null,
    pathwayLabel: j.pathwaySurface?.shortName ?? null,
    pathwayId: j.pathwaySurface?.id ?? null,
    committedQuestionIds: getLinearCommittedQuestionIds(j.adaptiveState),
  };
}

async function fetchQuestion(testId: string, index: number, signal?: AbortSignal): Promise<QRow | null> {
  try {
    const res = await fetchWithRetry(
      `/api/practice-tests/${testId}/question?index=${encodeURIComponent(String(index))}`,
      { method: "GET", signal, credentials: "include", cache: "no-store" },
      { attempts: 2, timeoutMs: 10_000 },
    );
    if (!res.ok) return null;
    const j = await res.json() as { question?: QRow };
    return j.question ?? null;
  } catch {
    return null;
  }
}

async function linearCommitApi(
  testId: string,
  questionId: string,
  answers: Record<string, unknown>,
  cursorIndex: number,
): Promise<{
  ok: boolean;
  feedback?: LinearFeedback;
  committedQuestionIds?: string[];
  adaptivePostMiss?: PracticeAdaptivePostMissPayload | null;
  error?: string;
}> {
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "linear_commit",
      questionId,
      answers,
      cursorIndex,
    }),
  });
  const j = await res.json() as {
    ok?: boolean;
    feedback?: LinearFeedback;
    committedQuestionIds?: string[];
    adaptivePostMiss?: PracticeAdaptivePostMissPayload | null;
    error?: string;
  };
  return {
    ok: j.ok ?? res.ok,
    feedback: j.feedback,
    committedQuestionIds: j.committedQuestionIds,
    adaptivePostMiss: j.adaptivePostMiss ?? null,
    error: j.error,
  };
}

async function saveSessionProgress(
  testId: string,
  answers: Record<string, unknown>,
  cursorIndex: number,
): Promise<void> {
  await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "save", answers, cursorIndex }),
  }).catch(() => { /* best-effort */ });
}

async function submitTestApi(testId: string): Promise<{
  ok: boolean;
  results?: PracticeTestResultsJson;
}> {
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete" }),
  });
  const j = await res.json() as { ok?: boolean; results?: PracticeTestResultsJson };
  return { ok: j.ok ?? res.ok, results: j.results };
}

// ── Main component ────────────────────────────────────────────────────────────

export function NclexPracticeRunner({
  testId,
  userId,
  pathwayLabel: pathwayLabelProp,
}: {
  testId: string;
  userId: string;
  pathwayLabel?: string | null;
  shellPresentation?: string;
}) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [questionCache, setQuestionCache] = useState<Record<string, QRow>>({});
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [committedIds, setCommittedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<Record<string, LinearFeedback>>({});
  const [adaptivePostMiss, setAdaptivePostMiss] = useState<{
    questionId: string;
    payload: PracticeAdaptivePostMissPayload;
  } | null>(null);
  const [results, setResults] = useState<PracticeTestResultsJson | null>(null);
  const [pathwayLabel, setPathwayLabel] = useState(pathwayLabelProp ?? "NCLEX-RN®");
  const [pathwayId, setPathwayId] = useState<string | null>(null);
  const [pathwayCountryCode, setPathwayCountryCode] = useState<string | null>(null);
  const pathwayCountryByPathwayId = useMemo(() => {
    if (!pathwayId || !pathwayCountryCode) return {};
    return { [pathwayId]: pathwayCountryCode };
  }, [pathwayId, pathwayCountryCode]);
  const fallbackMeasurementSystem = useMemo(
    () => resolveMeasurementSystemForLearnerPathway(pathwayId, pathwayCountryByPathwayId),
    [pathwayId, pathwayCountryByPathwayId],
  );
  const { measurementSystem } = useMeasurementPreference(fallbackMeasurementSystem);
  const resolveMeasureText = useCallback(
    (text: string) =>
      governMeasurementSurfaceCopy(text, {
        measurementSystem,
        pathwayId: pathwayId ?? null,
        aiSurface: "coaching",
        sourceSurface: "practice",
      }),
    [measurementSystem, pathwayId],
  );
  const [transitioning, setTransitioning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  // Tool/modal state
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showLabValues, setShowLabValues] = useState(false);
  const [noteText, setNoteText] = useState("");

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const answersRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const s = await loadSession(testId, controller.signal);
        if (!mountedRef.current) return;
        if ((s.status === "COMPLETED" || s.status === "ABANDONED") && s.results) {
          setResults(s.results);
          setPhase("ready");
          return;
        }
        setQuestionIds(s.questionIds);
        setQuestionCache(s.questionCache);
        setAnswers(s.answers ?? {});
        setCommittedIds(new Set(s.committedQuestionIds));
        setIdx(s.cursorIndex ?? 0);
        setTimedMode(s.timedMode);
        setTimeLimitSec(s.timeLimitSec ?? null);
        if (s.timedMode && s.timeLimitSec) {
          const used = Math.floor((s.elapsedMs ?? 0) / 1000);
          setRemainingSec(Math.max(0, s.timeLimitSec - used));
        }
        if (s.pathwayLabel) setPathwayLabel(s.pathwayLabel);
        if (s.pathwayId) {
          setPathwayId(s.pathwayId);
          const pathway = getExamPathwayById(s.pathwayId);
          if (pathway) setPathwayCountryCode(String(pathway.countryCode));
        }
        setPhase("ready");
      } catch {
        if (controller.signal.aborted) return;
        if (mountedRef.current) { setError("Could not load session."); setPhase("error"); }
      }
    })();
    return () => controller.abort();
  }, [testId]);

  useEffect(() => {
    if (phase !== "ready") return;
    const controller = new AbortController();
    const ids = questionIds.slice(idx, idx + 2);
    for (let offset = 0; offset < ids.length; offset += 1) {
      const id = ids[offset]!;
      if (!questionCache[id]) {
        void fetchQuestion(testId, idx + offset, controller.signal).then((q) => {
          if (!mountedRef.current || controller.signal.aborted) return;
          if (!q) {
            if (questionIds[idx] === id) {
              setError("Could not load this question. Return to practice tests and resume the session.");
              setPhase("error");
            }
            return;
          }
          setQuestionCache((prev) => ({ ...prev, [q.id]: q }));
        });
      }
    }
    return () => controller.abort();
  }, [phase, idx, questionIds, questionCache, testId]);

  useEffect(() => {
    if (!timedMode || remainingSec === null || isPaused) return;
    if (remainingSec <= 0) { void handleFinish(); return; }
    const t = setTimeout(() => {
      if (mountedRef.current) setRemainingSec((s) => (s != null && s > 0 ? s - 1 : s));
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec, timedMode, isPaused]);

  const currentId = questionIds[idx];
  const current = currentId ? questionCache[currentId] : null;
  const cleanStem = current?.stem ? cleanExamStem(resolveMeasureText(current.stem)) : "";
  const raw = currentId ? answers[currentId] : undefined;
  const isSata = current ? isSataQuestion(current) : false;
  const isBowtie = current ? isBowtieQuestion(current) : false;
  const optsCanonical = current ? parseOptions(current.options) : [];
  const optsDisplay = current?.displayOptions ?? optsCanonical;
  const isCommitted = currentId ? committedIds.has(currentId) : false;
  const currentFeedback = currentId ? feedback[currentId] : undefined;
  const bowtiePayload = isBowtie && current
    ? tryNormalizeBowtiePayload(current.questionFormat ?? current.questionType, cleanStem, current.options)
    : null;
  const isBowtieComplete = isBowtie && bowtiePayload
    ? isBowtieAnswerComplete(coerceBowtieDraftAnswer(raw))
    : false;
  const hasAnswer = isBowtie ? isBowtieComplete : hasMeaningfulAnswer(raw);

  function setAnswerForCurrent(val: unknown) {
    if (!currentId || isCommitted) return;
    setAnswers((prev) => {
      const next = { ...prev, [currentId]: val };
      answersRef.current = next;
      return next;
    });
  }

  async function handleSubmit() {
    if (!currentId || !hasAnswer || isCommitted || inFlightRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    const qidAtCommit = currentId;
    const idxAtCommit = idx;
    try {
      const resp = await linearCommitApi(testId, currentId, answersRef.current, idx);
      if (!mountedRef.current) return;
      if (!resp.ok) {
        setError(resp.error ?? "Could not submit answer.");
        return;
      }
      setCommittedIds((prev) => new Set([...prev, currentId]));
      if (Array.isArray(resp.committedQuestionIds)) {
        setCommittedIds(new Set(resp.committedQuestionIds));
      }
      if (resp.feedback) {
        setFeedback((prev) => ({ ...prev, [currentId]: resp.feedback! }));
      }
      if (
        resp.adaptivePostMiss &&
        !resp.feedback?.isCorrect &&
        idxAtCommit === idx &&
        questionIds[idxAtCommit] === qidAtCommit
      ) {
        setAdaptivePostMiss({ questionId: qidAtCommit, payload: resp.adaptivePostMiss });
      }
    } finally {
      if (mountedRef.current) { setSubmitting(false); inFlightRef.current = false; }
    }
  }

  function handleNext() {
    if (idx < questionIds.length - 1) {
      setAdaptivePostMiss((prev) => (prev?.questionId === currentId ? null : prev));
      setTransitioning(true);
      setTimeout(() => {
        if (!mountedRef.current) return;
        const nextIdx = idx + 1;
        setIdx(nextIdx);
        setTransitioning(false);
        void saveSessionProgress(testId, answersRef.current, nextIdx);
      }, 200);
    } else {
      void handleFinish();
    }
  }

  function handlePrev() {
    if (idx > 0) {
      setTransitioning(true);
      setTimeout(() => {
        if (!mountedRef.current) return;
        const nextIdx = idx - 1;
        setIdx(nextIdx);
        setTransitioning(false);
        void saveSessionProgress(testId, answersRef.current, nextIdx);
      }, 200);
    }
  }

  async function handleFinish() {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      const resp = await submitTestApi(testId);
      if (!mountedRef.current) return;
      if (resp.results) setResults(resp.results);
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
        inFlightRef.current = false;
      }
    }
  }

  function toggleFlag() {
    if (!currentId) return;
    setFlagged((prev) => {
      const next = { ...prev, [currentId]: !prev[currentId] };
      void saveSessionProgress(testId, answersRef.current, idx);
      return next;
    });
  }

  // ── Renders ───────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="nn-nclex-exam-page nn-unified-exam-workspace nn-nclex-practice-workspace flex items-center justify-center" data-nclex-shell="practice">
        <div className="nn-nclex-spinner" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="nn-nclex-exam-page nn-unified-exam-workspace nn-nclex-practice-workspace" data-nclex-shell="practice" style={{ padding: "2rem", textAlign: "center" }}>
        <p className="text-[var(--semantic-danger)]" style={{ marginBottom: "1rem" }}>{error}</p>
        <Link href="/app/practice-tests" className="font-semibold text-[var(--semantic-brand)]">
          Return to practice tests
        </Link>
      </div>
    );
  }

  if (results) {
    return (
      <div className="nn-nclex-exam-page nn-unified-exam-workspace nn-nclex-practice-workspace" data-nclex-shell="practice" style={{ maxWidth: "52rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 className="text-2xl font-extrabold text-[var(--semantic-text-primary)]" style={{ marginBottom: "1.5rem" }}>
          Practice Exam Results
        </h1>
        <p className="text-lg font-bold text-[var(--semantic-text-primary)]">
          Score: {results.scoreCorrect} / {results.scoreTotal} ({Math.round(results.accuracyPct ?? 0)}%)
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href={`/app/practice-tests/${testId}/results`}
            className="inline-flex h-10 items-center rounded-lg bg-[var(--semantic-brand)] px-5 text-sm font-bold text-[var(--role-cta-foreground)] no-underline"
          >
            View detailed results
          </Link>
          <Link
            href="/app/practice-tests"
            className="inline-flex h-10 items-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-text-secondary)] no-underline"
          >
            Back to practice tests
          </Link>
        </div>
      </div>
    );
  }

  const total = questionIds.length;
  const unanswered = questionIds.filter((id) => !committedIds.has(id)).length;

  const optDisplayMap: Record<string, string> = {};
  optsCanonical.forEach((k, i) => {
    optDisplayMap[k] = resolveMeasureText(optsDisplay[i] ?? k);
  });

  const wrongKey = currentFeedback && !currentFeedback.isCorrect && raw
    ? (isSata && Array.isArray(raw)
        ? raw.find((k) => !currentFeedback.correctKeys.includes(String(k)))
        : typeof raw === "string" && !currentFeedback.correctKeys.includes(raw)
          ? raw
          : null)
    : null;
  const primaryDistractorTextRaw =
    wrongKey && currentFeedback?.distractorRationalesMap
      ? currentFeedback.distractorRationalesMap[wrongKey] ?? null
      : null;
  const primaryDistractorText = primaryDistractorTextRaw
    ? resolveMeasureText(primaryDistractorTextRaw)
    : null;

  // Guard: reject visibly malformed questions before rendering them.
  // Only fires when the question is loaded (current !== null) and is clearly invalid.
  if (current && !isBowtie && !cleanStem.trim()) {
    return (
      <div className="nn-nclex-exam-page nn-unified-exam-workspace nn-nclex-practice-workspace" data-nclex-shell="practice" style={{ padding: "2rem", textAlign: "center" }}>
        <p className="text-sm text-[var(--semantic-text-secondary)]" style={{ marginBottom: "1rem" }}>
          This question could not be rendered. Skip to the next question or return to practice tests.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {idx < questionIds.length - 1 && (
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]"
              onClick={handleNext}
            >
              Skip question
            </button>
          )}
          <Link href="/app/practice-tests" className="inline-flex h-9 items-center rounded-lg bg-[var(--semantic-brand)] px-4 text-sm font-bold text-[var(--role-cta-foreground)] no-underline">
            Return to practice tests
          </Link>
        </div>
      </div>
    );
  }

  function getOptionState(canonical: string): NclexAnswerCardState {
    if (!isCommitted || !currentFeedback) {
      const isSelected = isSata
        ? Array.isArray(raw) && raw.includes(canonical)
        : raw === canonical;
      return isSelected ? "selected" : "default";
    }
    const isCorrectKey = currentFeedback.correctKeys.includes(canonical);
    const isSelected = isSata
      ? Array.isArray(raw) && raw.includes(canonical)
      : raw === canonical;

    if (isCorrectKey) return "correct";
    if (isSelected && !isCorrectKey) return "incorrect";
    return "dim";
  }

  const answerContent = !current ? (
    <div className="nn-nclex-question-loading">
      <div className="nn-nclex-spinner" />
    </div>
  ) : isBowtie && bowtiePayload ? (
    <div className="nn-nclex-bowtie-slot">
      <BowtieQuestionRenderer
        payload={bowtiePayload}
        value={raw}
        showScenarioBanner={false}
        disabled={isCommitted || submitting}
        onChange={setAnswerForCurrent}
        reveal={
          isCommitted && currentFeedback
            ? (() => {
                const ck = currentFeedback.correctKeys;
                if (ck.length < 3) return null;
                return {
                  correct: { correctIds: [ck[0]!, ck[1]!, ck[2]!] as [string, string, string] },
                  selectedIds: coerceBowtieDraftAnswer(raw),
                };
              })()
            : null
        }
      />
    </div>
  ) : (
    <NclexAnswerList>
      {optsCanonical.map((canonical, i) => {
        const display = resolveMeasureText(optsDisplay[i] ?? canonical);
        const state = getOptionState(canonical);
        if (isSata) {
          return (
            <NclexAnswerCard
              key={canonical}
              index={i}
              text={display}
              state={state}
              isCheckbox
              checked={Array.isArray(raw) && raw.includes(canonical)}
              disabled={isCommitted || submitting}
              onChange={(checked) => {
                const prev = Array.isArray(raw) ? [...raw] : [];
                setAnswerForCurrent(
                  checked ? [...prev, canonical] : prev.filter((x) => x !== canonical),
                );
              }}
            />
          );
        }
        return (
          <NclexAnswerCard
            key={canonical}
            index={i}
            text={display}
            state={state}
            disabled={isCommitted || submitting}
            onClick={() => setAnswerForCurrent(canonical)}
          />
        );
      })}
    </NclexAnswerList>
  );

  const disabled = submitting || transitioning;
  const practiceElapsedSec =
    timedMode && timeLimitSec != null && remainingSec != null
      ? Math.max(0, timeLimitSec - remainingSec)
      : null;
  const correctAnswerText =
    currentFeedback?.correctKeys
      ?.map((key) => optDisplayMap[key])
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .join("; ") ?? "";
  const feedbackCorrect = Boolean(isCommitted && currentFeedback?.isCorrect);

  return (
    <div
      className="nn-nclex-exam-page nn-unified-exam-workspace nn-nclex-practice-workspace"
      data-nclex-shell="practice"
      data-nn-unified-exam-workspace=""
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <NclexPracticeTopBar
        questionNumber={idx + 1}
        totalQuestions={total}
        remainingSec={practiceElapsedSec}
        isPaused={isPaused}
        onPause={() => setIsPaused((p) => !p)}
        onFinish={() => setShowEndModal(true)}
        disabled={disabled}
        unitsControl={
          <ExamMeasurementUnitToggle
            fallbackSystem={fallbackMeasurementSystem}
            syncToProfile={Boolean(userId)}
            disabled={disabled}
          />
        }
      />

      <div className="nn-nclex-practice-body">
        <main className="nn-nclex-practice-main" aria-label="Practice exam question">
          {transitioning && (
            <div className="nn-nclex-loading-overlay" aria-live="polite">
              <div className="nn-nclex-spinner" />
            </div>
          )}

          <section className="nn-nclex-practice-question-card">
            <div className="nn-nclex-practice-question-card__header">
              <span className="nn-nclex-practice-question-card__number">
              Question {idx + 1}
              {isSata ? <span className="ml-2 text-xs font-normal text-[var(--semantic-text-secondary)]">Select all that apply</span> : null}
            </span>
            <button
              type="button"
              onClick={toggleFlag}
              aria-label={flagged[currentId ?? ""] ? "Remove mark" : "Mark for review"}
              aria-pressed={flagged[currentId ?? ""] ?? false}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.25rem 0.625rem",
                borderRadius: "0.375rem",
                border: "1.5px solid",
                borderColor: flagged[currentId ?? ""] ? "#f59e0b" : "var(--semantic-border-soft, #e2e8f0)",
                background: flagged[currentId ?? ""] ? "#fffbeb" : "transparent",
                color: flagged[currentId ?? ""] ? "#92400e" : "var(--semantic-text-muted, #64748b)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 110ms ease, border-color 110ms ease",
              }}
            >
              {flagged[currentId ?? ""] ? "★ Marked" : "☆ Mark"}
            </button>
            </div>

            <div className="nn-nclex-practice-question-card__content">
            <NclexQuestionStem
              stem={cleanStem}
              instruction={null}
            />
            <div style={{ marginTop: "1.25rem" }}>
              {answerContent}
            </div>
            {isCommitted && currentFeedback ? (
              <div className={`nn-nclex-exam-feedback-row ${feedbackCorrect ? "nn-nclex-exam-feedback-row--correct" : "nn-nclex-exam-feedback-row--incorrect"}`}>
                {feedbackCorrect ? (
                  <CheckCircle2 aria-hidden className="nn-nclex-exam-feedback-row__icon" />
                ) : (
                  <XCircle aria-hidden className="nn-nclex-exam-feedback-row__icon" />
                )}
                <div>
                  <p className="nn-nclex-exam-feedback-row__title">
                    {feedbackCorrect ? "Correct" : "Incorrect"}
                  </p>
                  <p className="nn-nclex-exam-feedback-row__body">
                    {feedbackCorrect
                      ? "This is the best answer."
                      : correctAnswerText
                        ? `Correct answer: ${correctAnswerText}`
                        : "Review the rationale before moving forward."}
                  </p>
                </div>
                <button
                  type="button"
                  className="nn-nclex-exam-feedback-row__next"
                  onClick={handleNext}
                  disabled={disabled}
                >
                  {idx === total - 1 ? "Finish Exam" : "Next Question"}
                  <ChevronRight aria-hidden size={16} />
                </button>
              </div>
            ) : null}
            </div>
          </section>

        </main>

        <aside className="nn-nclex-rationale-sidebar" aria-label="Rationale">
          <div className="nn-nclex-rationale-sidebar__header">
            <div>
              <CircleHelp aria-hidden />
              <span>Rationale</span>
            </div>
          </div>
          <div className="nn-nclex-rationale-sidebar__body">
            <section className="nn-nclex-rationale-sidebar__section">
              <h2>Explanation</h2>
              {isCommitted && currentFeedback ? (
                <>
                  {currentFeedback.correctAnswerExplanation ? (
                    <p>{resolveMeasureText(currentFeedback.correctAnswerExplanation)}</p>
                  ) : null}
                  {currentFeedback.rationale ? (
                    <p>{resolveMeasureText(currentFeedback.rationale)}</p>
                  ) : null}
                  {primaryDistractorText ? <p>{primaryDistractorText}</p> : null}
                </>
              ) : (
                <p>Select an answer and submit to reveal the explanation.</p>
              )}
            </section>

            <section className="nn-nclex-rationale-sidebar__section nn-nclex-rationale-sidebar__section--takeaways">
              <h2>Key Takeaways</h2>
              <ul>
                <li>{currentFeedback?.keyTakeaway ? resolveMeasureText(currentFeedback.keyTakeaway) : "Focus on the option that best protects client safety."}</li>
                {correctAnswerText ? <li>Best answer: {correctAnswerText}</li> : null}
                {current?.topic ? <li>Review: {current.topic}</li> : null}
              </ul>
            </section>

            <details className="nn-nclex-rationale-sidebar__references">
              <summary>View References</summary>
              <p>{currentFeedback?.referenceSource ?? "References will appear when available for this item."}</p>
            </details>
          </div>
        </aside>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <NclexPracticeBottomBar
        canGoPrev={idx > 0}
        canGoNext={true}
        hasAnswer={hasAnswer}
        marked={flagged[currentId ?? ""] ?? false}
        isSubmitted={isCommitted}
        onPrev={handlePrev}
        onNext={handleNext}
        onMark={toggleFlag}
        onSubmit={() => void handleSubmit()}
        onCalculator={() => setShowCalc(true)}
        onNotes={() => setShowNotes(true)}
        onLabValues={() => setShowLabValues(true)}
        disabled={disabled}
        isLastQuestion={idx === total - 1}
      />

      {/* ── Overlays ────────────────────────────────────────────────────────── */}
      {showEndModal && (
        <NclexEndTestModal
          isCat={false}
          unansweredCount={unanswered}
          onConfirm={() => { setShowEndModal(false); void handleFinish(); }}
          onCancel={() => setShowEndModal(false)}
        />
      )}
      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}
      {showNotes && (
        <NclexNotesDrawer
          initialText={noteText}
          onSave={(text) => { setNoteText(text); setShowNotes(false); }}
          onClose={() => setShowNotes(false)}
        />
      )}
      {showLabValues && <NclexLabReference onClose={() => setShowLabValues(false)} />}

    </div>
  );
}
