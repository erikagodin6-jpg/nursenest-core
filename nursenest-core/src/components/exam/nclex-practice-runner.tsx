"use client";

/**
 * NclexPracticeRunner — NCLEX-style Practice Exam (learning mode).
 *
 * Shows immediate rationale after each answer in the right-hand panel.
 * Uses the same /api/practice-tests/[id] endpoints as PracticeTestRunnerClient.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  NclexPracticeExamLayout,
  NclexAnswerList,
  NclexAnswerCard,
  NclexQuestionStem,
  type NclexAnswerCardState,
} from "@/components/exam/nclex-exam-layout";
import { buildNclexDistractors } from "@/components/exam/nclex-rationale-panel";
import type { NclexRationalePanelStatus } from "@/components/exam/nclex-rationale-panel";
import { BowtieQuestionRenderer } from "@/components/exams/questions/bowtie-question-renderer";
import {
  coerceBowtieDraftAnswer,
  isBowtieAnswerComplete,
  tryNormalizeBowtiePayload,
} from "@/lib/questions/bowtie-adapter";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
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
};

type LinearFeedback = {
  isCorrect: boolean;
  correctKeys: string[];
  rationale: string | null;
  correctAnswerExplanation: string | null;
  distractorRationalesMap: Record<string, string> | null;
  keyTakeaway: string | null;
  clinicalPearlDisplay: string | null;
  referenceSource: string | null;
  topic?: string | null;
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

function isSataQuestion(q: QRow): boolean {
  const fmt = (q.questionFormat ?? q.questionType ?? "").toLowerCase();
  return fmt.includes("sata") || fmt.includes("multi");
}

function isBowtieQuestion(q: QRow): boolean {
  const fmt = (q.questionFormat ?? q.questionType ?? "").toLowerCase();
  return fmt.includes("bowtie");
}

async function loadSession(testId: string) {
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to load session");
  const j = await res.json() as {
    test?: {
      questionIds?: unknown;
      answers?: Record<string, unknown>;
      cursorIndex?: number;
      timedMode?: boolean;
      timeLimitSec?: number | null;
      elapsedMs?: number | null;
      status?: string;
      results?: PracticeTestResultsJson | null;
    };
    pathwaySurface?: { shortName?: string | null; id?: string | null } | null;
  };
  const t = j.test ?? {};
  return {
    questionIds: Array.isArray(t.questionIds) ? t.questionIds.map(String) : [],
    answers: t.answers ?? {},
    cursorIndex: t.cursorIndex ?? 0,
    timedMode: t.timedMode ?? false,
    timeLimitSec: t.timeLimitSec ?? null,
    elapsedMs: t.elapsedMs ?? null,
    status: t.status ?? "IN_PROGRESS",
    results: t.results ?? null,
    pathwayLabel: j.pathwaySurface?.shortName ?? null,
    pathwayId: j.pathwaySurface?.id ?? null,
  };
}

async function fetchQuestion(testId: string, questionId: string): Promise<QRow | null> {
  try {
    const res = await fetchWithRetry(
      `/api/practice-tests/${testId}/question?questionId=${encodeURIComponent(questionId)}`,
      { method: "GET" },
    );
    if (!res.ok) return null;
    const j = await res.json() as { question?: QRow };
    return j.question ?? null;
  } catch {
    return null;
  }
}

async function commitAnswerApi(
  testId: string,
  questionIndex: number,
  selectedOption: unknown,
  flagged: boolean,
): Promise<{
  ok: boolean;
  feedback?: LinearFeedback;
  error?: string;
}> {
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "commit_answer",
      questionIndex,
      selectedOption,
      flagged,
    }),
  });
  const j = await res.json() as {
    ok?: boolean;
    feedback?: LinearFeedback;
    error?: string;
  };
  return { ok: j.ok ?? res.ok, feedback: j.feedback, error: j.error };
}

async function submitTestApi(testId: string): Promise<{
  ok: boolean;
  results?: PracticeTestResultsJson;
}> {
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "submit" }),
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
  const [results, setResults] = useState<PracticeTestResultsJson | null>(null);
  const [pathwayLabel, setPathwayLabel] = useState(pathwayLabelProp ?? "NCLEX-RN®");
  const [pathwayId, setPathwayId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Load session
  useEffect(() => {
    void (async () => {
      try {
        const s = await loadSession(testId);
        if (!mountedRef.current) return;
        if ((s.status === "COMPLETED" || s.status === "ABANDONED") && s.results) {
          setResults(s.results);
          setPhase("ready");
          return;
        }
        setQuestionIds(s.questionIds);
        setAnswers(s.answers ?? {});
        setIdx(s.cursorIndex ?? 0);
        setTimedMode(s.timedMode);
        setTimeLimitSec(s.timeLimitSec ?? null);
        if (s.timedMode && s.timeLimitSec) {
          const used = Math.floor((s.elapsedMs ?? 0) / 1000);
          setRemainingSec(Math.max(0, s.timeLimitSec - used));
        }
        if (s.pathwayLabel) setPathwayLabel(s.pathwayLabel);
        if (s.pathwayId) setPathwayId(s.pathwayId);
        setPhase("ready");
      } catch {
        if (mountedRef.current) { setError("Could not load session."); setPhase("error"); }
      }
    })();
  }, [testId]);

  // Prefetch Q
  useEffect(() => {
    if (phase !== "ready") return;
    const ids = questionIds.slice(idx, idx + 2);
    for (const id of ids) {
      if (!questionCache[id]) {
        void fetchQuestion(testId, id).then((q) => {
          if (!mountedRef.current || !q) return;
          setQuestionCache((prev) => ({ ...prev, [q.id]: q }));
        });
      }
    }
  }, [phase, idx, questionIds, questionCache, testId]);

  // Timer
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
  const raw = currentId ? answers[currentId] : undefined;
  const isSata = current ? isSataQuestion(current) : false;
  const isBowtie = current ? isBowtieQuestion(current) : false;
  const optsCanonical = current ? parseOptions(current.options) : [];
  const optsDisplay = current?.displayOptions ?? optsCanonical;
  const isCommitted = currentId ? committedIds.has(currentId) : false;
  const currentFeedback = currentId ? feedback[currentId] : undefined;
  const bowtiePayload = isBowtie && current
    ? tryNormalizeBowtiePayload(current.questionFormat ?? current.questionType, current.stem, current.options)
    : null;
  const isBowtieComplete = isBowtie && bowtiePayload
    ? isBowtieAnswerComplete(coerceBowtieDraftAnswer(raw))
    : false;
  const hasAnswer = isBowtie ? isBowtieComplete : hasMeaningfulAnswer(raw);

  function setAnswerForCurrent(val: unknown) {
    if (!currentId || isCommitted) return;
    setAnswers((prev) => ({ ...prev, [currentId]: val }));
  }

  async function handleSubmit() {
    if (!currentId || !hasAnswer || isCommitted || inFlightRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      const resp = await commitAnswerApi(testId, idx, raw, flagged[currentId] ?? false);
      if (!mountedRef.current) return;
      if (resp.ok) {
        setCommittedIds((prev) => new Set([...prev, currentId]));
        if (resp.feedback) {
          setFeedback((prev) => ({ ...prev, [currentId]: resp.feedback! }));
        }
      }
    } finally {
      if (mountedRef.current) { setSubmitting(false); inFlightRef.current = false; }
    }
  }

  function handleNext() {
    if (idx < questionIds.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        if (!mountedRef.current) return;
        setIdx((prev) => prev + 1);
        setTransitioning(false);
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
        setIdx((prev) => prev - 1);
        setTransitioning(false);
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

  // ── Build rationale props ─────────────────────────────────────────────────

  function buildRationaleProps(): {
    status: NclexRationalePanelStatus;
    correctAnswerText?: string | null;
    correctAnswerLetter?: string | null;
    correctExplanation?: string | null;
    distractors: { letter: string; text: string; reason: string }[];
    keyTakeaway?: string | null;
    referenceSource?: string | null;
    clinicalPearl?: string | null;
  } {
    if (!isCommitted || !currentFeedback) {
      return { status: "waiting", distractors: [] };
    }
    const status: NclexRationalePanelStatus = currentFeedback.isCorrect ? "correct" : "incorrect";
    const correctKey = currentFeedback.correctKeys[0];
    const correctIdx = optsCanonical.indexOf(correctKey ?? "");
    const correctText = correctIdx >= 0 ? (optsDisplay[correctIdx] ?? correctKey) : correctKey;
    const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const correctLetter = correctIdx >= 0 ? (LETTERS[correctIdx] ?? null) : null;

    const optDisplayMap: Record<string, string> = {};
    optsCanonical.forEach((k, i) => { optDisplayMap[k] = optsDisplay[i] ?? k; });

    const distractors = buildNclexDistractors(
      optsCanonical,
      currentFeedback.correctKeys,
      optDisplayMap,
      currentFeedback.distractorRationalesMap,
    );

    return {
      status,
      correctAnswerText: correctText ?? null,
      correctAnswerLetter: correctLetter,
      correctExplanation: currentFeedback.correctAnswerExplanation ?? currentFeedback.rationale,
      distractors,
      keyTakeaway: currentFeedback.keyTakeaway,
      referenceSource: currentFeedback.referenceSource,
      clinicalPearl: currentFeedback.clinicalPearlDisplay,
    };
  }

  // ── Renders ───────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="nn-nclex-exam-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="nn-nclex-spinner" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
        <Link href="/app/practice-tests" style={{ color: "#0f2d57", fontWeight: 600 }}>Return to practice tests</Link>
      </div>
    );
  }

  // Results
  if (results) {
    return (
      <div style={{ position: "fixed", inset: 0, overflow: "auto", background: "#f5f7fa", zIndex: 100 }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
            Practice Exam Results
          </h1>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f172a" }}>
            Score: {results.scoreCorrect} / {results.scoreTotal} ({Math.round(results.accuracyPct ?? 0)}%)
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href={`/app/practice-tests/${testId}/results`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                height: "2.5rem", padding: "0 1.25rem", borderRadius: "0.5rem",
                background: "#0f2d57", color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              View detailed results
            </Link>
            <Link
              href="/app/practice-tests"
              style={{
                display: "inline-flex", alignItems: "center",
                height: "2.5rem", padding: "0 1.25rem", borderRadius: "0.5rem",
                border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151",
                fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
              }}
            >
              Back to practice tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Exam
  const rationaleProps = buildRationaleProps();
  const total = questionIds.length;
  const unanswered = questionIds.filter((id) => !committedIds.has(id)).length;

  // Build answer card states for current question
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
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <div className="nn-nclex-spinner" />
    </div>
  ) : isBowtie && bowtiePayload ? (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
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
        const display = optsDisplay[i] ?? canonical;
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

  return (
    <NclexPracticeExamLayout
      questionNumber={idx + 1}
      totalQuestions={total}
      remainingSec={timedMode ? remainingSec : null}
      flagged={flagged[currentId ?? ""] ?? false}
      onFlag={() => {
        if (!currentId) return;
        setFlagged((prev) => ({ ...prev, [currentId]: !prev[currentId] }));
      }}
      onFinish={handleFinish}
      onPrev={handlePrev}
      onNext={handleNext}
      onSubmit={() => void handleSubmit()}
      canGoPrev={idx > 0}
      canGoNext={true}
      hasAnswer={hasAnswer}
      isSubmitted={isCommitted}
      isLastQuestion={idx === total - 1}
      disabled={submitting || transitioning}
      isPaused={isPaused}
      onPause={timedMode ? () => setIsPaused((p) => !p) : undefined}
      questionFormat={current?.questionFormat}
      isSata={isSata}
      showTypePanel={true}
      rationaleStatus={rationaleProps.status}
      correctAnswerText={rationaleProps.correctAnswerText}
      correctAnswerLetter={rationaleProps.correctAnswerLetter}
      correctExplanation={rationaleProps.correctExplanation}
      distractors={rationaleProps.distractors}
      keyTakeaway={rationaleProps.keyTakeaway}
      referenceSource={rationaleProps.referenceSource}
      clinicalPearl={rationaleProps.clinicalPearl}
      transitioning={transitioning}
      unansweredCount={unanswered}
    >
      <NclexQuestionStem
        stem={current?.stem ?? ""}
        instruction={isSata ? "Select all that apply." : null}
      />
      {answerContent}
    </NclexPracticeExamLayout>
  );
}
