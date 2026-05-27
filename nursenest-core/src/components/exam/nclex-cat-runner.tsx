"use client";

/**
 * NclexCatRunner — NCLEX-style CAT exam shell.
 *
 * Provides the fixed-viewport exam UI (NclexCatExamLayout) while delegating
 * all session state + adaptive logic to the existing /api/practice-tests/[id]
 * endpoints that the main PracticeTestRunnerClient already uses.
 *
 * Drop-in replacement when catPresentationMode === "exam_simulation".
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NclexCatExamLayout,
  NclexAnswerList,
  NclexAnswerCard,
  NclexQuestionStem,
  type NclexAnswerCardState,
} from "@/components/exam/nclex-exam-layout";
import { NclexCatResultsDashboard } from "@/components/exam/nclex-cat-results-dashboard";
import { BowtieQuestionRenderer } from "@/components/exams/questions/bowtie-question-renderer";
import {
  coerceBowtieDraftAnswer,
  isBowtieAnswerComplete,
  tryNormalizeBowtiePayload,
} from "@/lib/questions/bowtie-adapter";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { buildCatAdvancePatchBody } from "@/lib/practice-tests/cat-advance-contract";
import {
  assertCatExamPhaseTransition,
  catExamCanChangeAnswer,
  catExamCanLockAnswer,
  catExamCanRequestCatAdvance,
  catExamFooterPrimaryBusy,
  catExamOptionsInteractionLocked,
  type CatExamUiPhase,
} from "@/lib/practice-tests/cat-exam-ui-state";
import { ExamMeasurementUnitToggle } from "@/components/measurements/exam-measurement-unit-toggle";
import { governMeasurementSurfaceCopy } from "@/lib/measurements/measurement-surface-convergence";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";
import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";
import { safeRouterReplace } from "@/lib/runtime/client-navigation";

// ── Types ────────────────────────────────────────────────────────────────────

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

/** Re-export exam FSM — `completed` when results replace the question shell. */
type CatRunnerPhase = CatExamUiPhase | "completed";

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

const MCQ_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

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

// ── Session loader ────────────────────────────────────────────────────────────

// Single-request boot: ?hydrate=full returns session metadata + all question
// content in one DB round-trip.  Without this flag the runner had to make two
// serial requests (metadata → then individual question), showing a spinner for
// the combined latency of both.
async function loadSession(testId: string, signal?: AbortSignal): Promise<{
  questionIds: string[];
  questions: Record<string, QRow>; // pre-hydrated question cache
  answers: Record<string, unknown>;
  cursorIndex: number;
  timedMode: boolean;
  timeLimitSec: number | null;
  elapsedMs: number | null;
  status: string;
  results: PracticeTestResultsJson | null;
  pathwayLabel?: string | null;
  pathwayId?: string | null;
}> {
  const res = await fetchWithRetry(
    `/api/practice-tests/${testId}?hydrate=full`,
    { method: "GET", signal, credentials: "include", cache: "no-store" },
    { attempts: 2, timeoutMs: 12_000 },
  );
  if (!res.ok) throw new Error(`hydrate_http_${res.status}`);
  const j = await res.json() as {
    id?: string;
    status?: string;
    config?: { pathwayId?: string | null };
    pathwaySurface?: { shortName?: string | null; id?: string | null } | null;
    timedMode?: boolean;
    timeLimitSec?: number | null;
    elapsedMs?: number | null;
    cursorIndex?: number;
    answers?: Record<string, unknown>;
    questionIds?: unknown;
    questions?: unknown[];
    results?: PracticeTestResultsJson | null;
  };

  const rawIds = Array.isArray(j.questionIds) ? j.questionIds.map(String) : [];
  if (rawIds.length === 0 && j.status !== "COMPLETED") {
    throw new Error("malformed_question_ids");
  }

  // Build question cache from the hydrated questions array
  const questionMap: Record<string, QRow> = {};
  if (Array.isArray(j.questions)) {
    for (const q of j.questions) {
      if (q && typeof q === "object") {
        const row = q as Record<string, unknown>;
        if (typeof row.id === "string" && row.id) {
          questionMap[row.id] = row as unknown as QRow;
        }
      }
    }
  }

  return {
    questionIds: rawIds,
    questions: questionMap,
    answers: (j.answers && typeof j.answers === "object" && !Array.isArray(j.answers))
      ? (j.answers as Record<string, unknown>)
      : {},
    cursorIndex: Math.max(0, Math.min(rawIds.length > 0 ? rawIds.length - 1 : 0, j.cursorIndex ?? 0)),
    timedMode: j.timedMode ?? false,
    timeLimitSec: j.timeLimitSec ?? null,
    elapsedMs: j.elapsedMs ?? null,
    status: j.status ?? "IN_PROGRESS",
    results: j.results ?? null,
    pathwayLabel: j.pathwaySurface?.shortName ?? null,
    pathwayId: j.pathwaySurface?.id ?? j.config?.pathwayId ?? null,
  };
}

// Fallback: fetch a single question if it was somehow not in the hydrated batch.
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

async function catAdvanceApi(
  testId: string,
  questionId: string,
  answers: Record<string, unknown>,
  cursorIndex: number,
): Promise<{
  catAdvanced?: boolean;
  catCompleted?: boolean;
  results?: PracticeTestResultsJson;
  error?: string;
}> {
  const body = buildCatAdvancePatchBody({
    testId,
    answers,
    cursorIndex,
    examQuestionId: questionId,
  });
  const res = await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await res.json() as {
    catAdvanced?: boolean;
    catCompleted?: boolean;
    results?: PracticeTestResultsJson;
    error?: string;
  };
  return j;
}

async function abandonTest(testId: string): Promise<void> {
  await fetchWithRetry(`/api/practice-tests/${testId}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "abandon" }),
  }).catch(() => { /* best-effort */ });
}

// ── Main component ────────────────────────────────────────────────────────────

export function NclexCatRunner({
  testId,
  userId,
  pathwayLabel: pathwayLabelProp,
}: {
  testId: string;
  userId: string;
  pathwayLabel?: string | null;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  // Session state
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [questionCache, setQuestionCache] = useState<Record<string, QRow>>({});
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [crossedOut, setCrossedOut] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [catUiPhase, setCatUiPhase] = useState<CatRunnerPhase>("answering");
  const [results, setResults] = useState<PracticeTestResultsJson | null>(null);
  const [pathwayLabel, setPathwayLabel] = useState(pathwayLabelProp ?? "NCLEX-RN®");
  const [pathwayId, setPathwayId] = useState<string | null>(null);
  const [pathwayCountryCode, setPathwayCountryCode] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const pathwayCountryByPathwayId = useMemo(() => {
    if (!pathwayId || !pathwayCountryCode) return {};
    return { [pathwayId]: pathwayCountryCode };
  }, [pathwayId, pathwayCountryCode]);

  const fallbackMeasurementSystem = useMemo(
    () => resolveMeasurementSystemForLearnerPathway(pathwayId, pathwayCountryByPathwayId),
    [pathwayId, pathwayCountryByPathwayId],
  );
  const { measurementSystem } = useMeasurementPreference(fallbackMeasurementSystem);
  const governExamCopy = useCallback(
    (text: string) =>
      governMeasurementSurfaceCopy(text, {
        measurementSystem,
        pathwayId,
        aiSurface: "coaching",
        sourceSurface: "cat",
      }),
    [measurementSystem, pathwayId],
  );

  // Timer
  const [timedMode, setTimedMode] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const sessionStartMsRef = useRef<number | null>(null);
  const savedElapsedMsRef = useRef<number | null>(null);

  // In-flight guards
  const advanceInFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Load session ──────────────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      emitRuntimeEvent("cat_runtime_bootstrap_start", { sessionId: testId });
      try {
        const s = await loadSession(testId, controller.signal);
        if (!mountedRef.current) return;

        if (s.status === "COMPLETED" && s.results) {
          setResults(s.results);
          setElapsedMs(s.elapsedMs);
          setCatUiPhase("completed");
          setPhase("ready");
          return;
        }

        // Seed cache from the single hydrated response — no second fetch needed.
        if (Object.keys(s.questions).length > 0) {
          setQuestionCache(s.questions);
        }

        setQuestionIds(s.questionIds);
        setAnswers(s.answers ?? {});
        setIdx(s.cursorIndex ?? 0);
        setTimedMode(s.timedMode);
        setTimeLimitSec(s.timeLimitSec ?? null);
        if (s.pathwayLabel) setPathwayLabel(s.pathwayLabel);
        if (s.pathwayId) {
          setPathwayId(s.pathwayId);
          const pathway = getExamPathwayById(s.pathwayId);
          if (pathway) {
            setPathwayCountryCode(String(pathway.countryCode));
            emitRuntimeEvent("cat_runtime_bootstrap_complete", {
              sessionId: testId,
              pathwayId: pathway.id,
              nursingTier: pathway.roleTrack,
              examType: pathway.examCode,
              examFamily: String(pathway.examFamily ?? ""),
              runtimeMode: "cat",
              bootstrapSurface: "cat_runtime",
            });
          }
        }

        if (s.timedMode && s.timeLimitSec) {
          const used = Math.floor((s.elapsedMs ?? 0) / 1000);
          setRemainingSec(Math.max(0, s.timeLimitSec - used));
        }
        savedElapsedMsRef.current = s.elapsedMs ?? 0;
        sessionStartMsRef.current = Date.now();
        setPhase("ready");
      } catch (e) {
        if (controller.signal.aborted) return;
        if (!mountedRef.current) return;
        const code = e instanceof Error ? e.message : "hydrate_failed";
        emitRuntimeEvent("cat_runtime_bootstrap_failed", { sessionId: testId, errorCode: code });
        if (code === "malformed_question_ids") {
          emitRuntimeEvent("malformed_session_detected", {
            sessionId: testId,
            errorCode: code,
            surface: "cat_runtime",
          });
        }
        setError(
          code === "malformed_question_ids"
            ? "This exam session has incomplete question data. Your account is safe, and you can retry or start a clean session."
            : "Could not load this exam session. Your account and progress are safe.",
        );
        setPhase("error");
      }
    })();
    return () => controller.abort();
  }, [testId, retryNonce]);

  // ── Fallback fetch: fire only when a question is missing from the hydrated cache ──
  // Under normal conditions this never fires — all questions arrive with ?hydrate=full.
  // It exists as a safety net for any edge-case where hydration returns a partial batch.

  useEffect(() => {
    if (phase !== "ready" || catUiPhase === "completed") return;
    const controller = new AbortController();
    const ids = questionIds.slice(idx, idx + 2);
    for (let offset = 0; offset < ids.length; offset += 1) {
      const id = ids[offset]!;
      if (!questionCache[id]) {
        void fetchQuestion(testId, idx + offset, controller.signal).then((q) => {
          if (!mountedRef.current || controller.signal.aborted) return;
          if (!q) {
            if (questionIds[idx] === id) {
              setError("Could not load this CAT question. Return to practice tests and resume the session.");
              setPhase("error");
            }
            return;
          }
          setQuestionCache((prev) => ({ ...prev, [q.id]: q }));
        });
      }
    }
    return () => controller.abort();
  }, [phase, idx, questionIds, questionCache, testId, catUiPhase]);

  // ── Timer tick ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!timedMode || remainingSec === null) return;
    if (catUiPhase === "completed") return;
    if (remainingSec <= 0) {
      // auto-submit
      void handleEndTest();
      return;
    }
    const t = setTimeout(() => {
      if (mountedRef.current) setRemainingSec((s) => (s != null && s > 0 ? s - 1 : s));
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec, timedMode, catUiPhase]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const currentId = questionIds[idx];
  const current = currentId ? questionCache[currentId] : null;
  const raw = currentId ? answers[currentId] : undefined;
  const isSata = current ? isSataQuestion(current) : false;
  const isBowtie = current ? isBowtieQuestion(current) : false;
  const optsCanonical = current ? parseOptions(current.options) : [];
  const optsDisplay = current?.displayOptions ?? optsCanonical;

  const bowtiePayloadEarly = isBowtie && current
    ? tryNormalizeBowtiePayload(
        current.questionFormat ?? current.questionType,
        current.stem,
        current.options,
      )
    : null;
  const hasAnswer =
    isBowtie && bowtiePayloadEarly
      ? isBowtieAnswerComplete(coerceBowtieDraftAnswer(raw))
      : hasMeaningfulAnswer(raw);

  function setAnswerForCurrent(val: unknown) {
    if (!currentId || catUiPhase !== "answering" || !catExamCanChangeAnswer(catUiPhase)) return;
    setAnswers((prev) => ({ ...prev, [currentId]: val }));
  }

  function toggleCrossOutForCurrent(canonical: string) {
    if (!currentId || catUiPhase !== "answering" || examPrimaryBusy) return;
    const key = `${currentId}:${canonical}`;
    setCrossedOut((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleFlag() {
    if (!currentId) return;
    setFlagged((prev) => ({ ...prev, [currentId]: !prev[currentId] }));
  }

  function lockAnswer() {
    if (!currentId || catUiPhase !== "answering") return;
    if (!catExamCanLockAnswer("answering", hasAnswer)) return;
    try {
      assertCatExamPhaseTransition(catUiPhase, "submitted_locked");
    } catch {
      return;
    }
    setCatUiPhase("submitted_locked");
  }

  // ── Server advance (after submit lock) ────────────────────────────────────

  async function requestCatAdvance() {
    if (!currentId || advanceInFlightRef.current) return;
    if (catUiPhase !== "submitted_locked" && catUiPhase !== "advancing") return;
    if (!catExamCanRequestCatAdvance(catUiPhase)) return;

    advanceInFlightRef.current = true;
    try {
      assertCatExamPhaseTransition("submitted_locked", "advancing");
    } catch {
      advanceInFlightRef.current = false;
      return;
    }
    setCatUiPhase("advancing");

    try {
      const resp = await catAdvanceApi(testId, currentId, answers, idx);

      if (!mountedRef.current) return;

      if (resp.error) {
        setCatUiPhase("submitted_locked");
        return;
      }

      if (resp.catCompleted || resp.results) {
        const elapsed =
          (savedElapsedMsRef.current ?? 0) +
          (sessionStartMsRef.current ? Date.now() - sessionStartMsRef.current : 0);
        setElapsedMs(elapsed);
        setResults(resp.results ?? null);
        setCatUiPhase("completed");
        return;
      }

      if (resp.catAdvanced) {
        try {
          const sessionRes = await fetchWithRetry(
            `/api/practice-tests/${testId}?hydrate=minimal`,
            { method: "GET", credentials: "include", cache: "no-store" },
          );
          if (!mountedRef.current) return;
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json() as {
              questionIds?: unknown;
              cursorIndex?: number;
              answers?: Record<string, unknown>;
            };
            const freshIds = Array.isArray(sessionData.questionIds)
              ? sessionData.questionIds.map(String)
              : null;
            const freshIdx = typeof sessionData.cursorIndex === "number"
              ? sessionData.cursorIndex
              : null;
            if (freshIds) setQuestionIds(freshIds);
            if (freshIdx !== null) setIdx(freshIdx);
            if (sessionData.answers) setAnswers(sessionData.answers);
            // Eagerly cache the next question if it isn't already in the map
            const nextId = freshIds && freshIdx !== null ? freshIds[freshIdx] : null;
            if (nextId && !questionCache[nextId]) {
              void fetchQuestion(testId, freshIdx!).then((q) => {
                if (!mountedRef.current || !q) return;
                setQuestionCache((prev) => ({ ...prev, [q.id]: q }));
              });
            }
          } else {
            // Fallback: increment locally if re-fetch fails
            setIdx((prev) => prev + 1);
          }
        } catch {
          if (mountedRef.current) setIdx((prev) => prev + 1);
        }
        if (mountedRef.current) setCatUiPhase("answering");
      }
    } catch {
      if (mountedRef.current) setCatUiPhase("answering");
    } finally {
      advanceInFlightRef.current = false;
    }
  }

  async function handleEndTest() {
    if (advanceInFlightRef.current) return;
    advanceInFlightRef.current = true;
    setCatUiPhase("advancing");
    try {
      await abandonTest(testId);
      // Minimal reload just to get results — no question content needed here.
      const res = await fetchWithRetry(`/api/practice-tests/${testId}?hydrate=minimal`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!mountedRef.current) return;
      if (res.ok) {
        const j = await res.json() as { results?: PracticeTestResultsJson | null; elapsedMs?: number | null };
        if (j.results) {
          setResults(j.results);
          setElapsedMs(j.elapsedMs ?? null);
        }
      }
    } catch { /* best-effort */ }
    finally {
      if (mountedRef.current) {
        setCatUiPhase("completed");
        advanceInFlightRef.current = false;
      }
    }
  }

  // ── Renders ───────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="nn-nclex-exam-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="nn-nclex-spinner" aria-label="Loading exam…" />
      </div>
    );
  }

  if (phase === "error") {
    const freshHref = pathwayId
      ? `/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}&catLaunch=1`
      : "/app/practice-tests?catLaunch=1";
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Exam recovery
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[var(--semantic-text-primary)]">
            We could not open this CAT session
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{error}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-text-on-brand)]"
              onClick={() => {
                setPhase("loading");
                setRetryNonce((n) => n + 1);
              }}
            >
              Retry session
            </button>
            <Link
              href={freshHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 text-sm font-medium text-[var(--semantic-text-primary)]"
            >
              Start fresh
            </Link>
            <Link
              href="/app/practice-tests"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 text-sm font-medium text-[var(--semantic-text-secondary)]"
            >
              Practice Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "ready" && currentId && !current) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Exam recovery
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[var(--semantic-text-primary)]">
            This question is still loading
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            We have your session order, but this item did not arrive with the bootstrap payload. Retry the session load or return to Practice Exams.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-text-on-brand)]"
              onClick={() => {
                emitRuntimeEvent("cat_runtime_bootstrap_failed", {
                  sessionId: testId,
                  errorCode: "missing_current_question_row",
                  questionId: currentId,
                  pathwayId,
                });
                setPhase("loading");
                setRetryNonce((n) => n + 1);
              }}
            >
              Retry session
            </button>
            <Link
              href="/app/practice-tests"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 text-sm font-medium text-[var(--semantic-text-secondary)]"
            >
              Practice Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────

  if (catUiPhase === "completed") {
    return (
      <NclexCatResultsDashboard
        results={results ?? { scoreCorrect: 0, scoreTotal: 0, accuracyPct: 0, byTopic: {}, weakAreas: [] }}
        testId={testId}
        elapsedMs={elapsedMs}
        pathwayLabel={pathwayLabel}
        pathwayId={pathwayId}
        onNewSession={() =>
          safeRouterReplace(router, "/app/practice-tests/cat-launch", {
            context: { feature: "cat_results_new_session", sessionId: testId },
          })
        }
        onReviewFlagged={() => {
          safeRouterReplace(router, `/app/practice-tests/${testId}/results`, {
            context: { feature: "cat_results_review_flagged", sessionId: testId },
          });
        }}
        onExport={() => window.print()}
      />
    );
  }

  // ── Exam in progress ──────────────────────────────────────────────────────

  const questionNumber = idx + 1;
  const isTransitioning = catUiPhase === "advancing";
  const examPhase: CatExamUiPhase = catUiPhase;
  const optionsLocked = catExamOptionsInteractionLocked(examPhase);
  const examPrimaryBusy = catExamFooterPrimaryBusy(examPhase, advanceInFlightRef.current);

  const rawStem = current?.stem ?? "";
  const bowtiePayload = isBowtie && current
    ? tryNormalizeBowtiePayload(
        current.questionFormat ?? current.questionType,
        rawStem ? governExamCopy(rawStem) : rawStem,
        current.options,
      )
    : bowtiePayloadEarly;

  const stemText = current?.stem
    ? governExamCopy(current.stem)
    : "";
  // Detect inline SATA instruction
  const sataInstruction = isSata ? "Select all that apply." : null;

  const answerContent = !current ? (
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <div className="nn-nclex-spinner" />
    </div>
  ) : isBowtie && bowtiePayload ? (
    <div className="nn-nclex-bowtie-slot">
      <BowtieQuestionRenderer
        payload={bowtiePayload}
        value={raw}
        showScenarioBanner={false}
        disabled={optionsLocked || examPrimaryBusy}
        onChange={setAnswerForCurrent}
        reveal={null}
      />
    </div>
  ) : (
    <NclexAnswerList>
      {optsCanonical.map((canonical, i) => {
        const display = governExamCopy(optsDisplay[i] ?? canonical);
        const isSelected = isSata
          ? Array.isArray(raw) && raw.includes(canonical)
          : raw === canonical;

        const state: NclexAnswerCardState = isSelected ? "selected" : "default";
        const optionCrossedOut = Boolean(crossedOut[`${currentId ?? ""}:${canonical}`]);

        if (isSata) {
          return (
            <NclexAnswerCard
              key={canonical}
              index={i}
              text={display}
              state={state}
              isCheckbox
              checked={isSelected}
              crossedOut={optionCrossedOut}
              disabled={optionsLocked || examPrimaryBusy}
              onToggleCrossOut={() => toggleCrossOutForCurrent(canonical)}
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
            crossedOut={optionCrossedOut}
            disabled={optionsLocked || examPrimaryBusy}
            onToggleCrossOut={() => toggleCrossOutForCurrent(canonical)}
            onClick={() => setAnswerForCurrent(canonical)}
          />
        );
      })}
    </NclexAnswerList>
  );

  return (
    <NclexCatExamLayout
      questionNumber={questionNumber}
      totalQuestions={null}
      remainingSec={timedMode ? remainingSec : null}
      examLabel={pathwayLabel}
      flagged={flagged[currentId ?? ""] ?? false}
      onFlag={toggleFlag}
      onEndTest={handleEndTest}
      onPrev={() => {
        /* CAT does not allow going back */
      }}
      onNext={() => {}}
      canGoPrev={false}
      canGoNext={catUiPhase === "submitted_locked"}
      hasAnswer={hasAnswer}
      catExamUiPhase={examPhase}
      onSubmitAnswer={lockAnswer}
      onAdvance={() => void requestCatAdvance()}
      examPrimaryBusy={examPrimaryBusy}
      disabled={examPrimaryBusy || isTransitioning}
      questionFormat={current?.questionFormat}
      isSata={isSata}
      showTypePanel={true}
      transitioning={isTransitioning}
      unitsControl={
        <ExamMeasurementUnitToggle
          fallbackSystem={fallbackMeasurementSystem}
          syncToProfile={Boolean(userId)}
          disabled={examPrimaryBusy || isTransitioning}
        />
      }
    >
      <NclexQuestionStem
        stem={stemText}
        instruction={sataInstruction}
      />
      {answerContent}
    </NclexCatExamLayout>
  );
}
