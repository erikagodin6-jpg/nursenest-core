"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import {
  CANONICAL_LEARNER_SURFACE_VERSION,
  learnerExamLayoutRefinementProps,
  type UnifiedExamWorkspaceMode,
} from "@/lib/exam-workspace/unified-exam-workspace";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { QuestionBankPeerPerformancePanel } from "@/components/student/question-bank-peer-performance-panel";
import { ExamMeasurementUnitToggle } from "@/components/measurements/exam-measurement-unit-toggle";
import {
  questionIdsWithIncorrectAttempts,
  readQuestionPerformanceEvents,
  recordQuestionPerformanceEvent,
} from "@/lib/learner/question-performance-events";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { buildAdaptiveCaseSimulation } from "@/lib/questions/adaptive-case-simulation";
import { buildQuestionListSearchParams } from "@/lib/practice-question-session/build-question-list-params";
import {
  DEFAULT_PRACTICE_COUNT,
  DEFAULT_PRACTICE_MODE,
  DEFAULT_PRACTICE_SOURCE,
  DEFAULT_SHUFFLE,
} from "@/lib/practice-question-session/constants";
import { parsePracticeSessionSearchParams } from "@/lib/practice-question-session/parse-session-search-params";
import type { PracticeSessionMode, PracticeSessionSource } from "@/lib/practice-question-session/constants";
import type { QuestionBankPeerStatsClient } from "@/lib/questions/question-bank-client-types";

type QFull = {
  id: string;
  stem: string;
  questionType: string;
  rationale?: string | null;
  options?: unknown;
  displayOptions?: string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  exam?: string | null;
};

type GradedRow = {
  correct: boolean;
  correctKeys?: string[];
  rationale?: string | null;
  clinicalPearl?: string | null;
  rationaleSections?: Array<{ heading: string; body: string }> | null;
  peerStats?: QuestionBankPeerStatsClient | null;
};

type QuestionListResponse = {
  questions?: QFull[];
  error?: string;
  studyModeNote?: string | null;
  weakTopicCodeApplied?: string | null;
  weakTopicConfidence?: "high" | "medium" | "low" | null;
  topicRelaxed?: boolean;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

export function PracticeQuestionSessionClient({
  userId,
  userLabel,
  protectionFlags,
  defaultPathwayId,
  pathwayCountryByPathwayId,
}: {
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  defaultPathwayId: string | null;
  pathwayCountryByPathwayId: Record<string, string>;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const spKey = sp.toString();
  const parsed = useMemo(() => parsePracticeSessionSearchParams(new URLSearchParams(spKey)), [spKey]);

  const pathwayId = parsed.pathwayId ?? defaultPathwayId;
  const fallbackMeasurementSystem = useMemo(
    () => resolveMeasurementSystemForLearnerPathway(pathwayId, pathwayCountryByPathwayId),
    [pathwayId, pathwayCountryByPathwayId],
  );
  const { measurementSystem } = useMeasurementPreference(fallbackMeasurementSystem, null, { locked: true });

  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error" | "summary">("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QFull[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [graded, setGraded] = useState<Record<string, GradedRow>>({});
  const [grading, setGrading] = useState(false);
  const [weakAreaNote, setWeakAreaNote] = useState<QuestionListResponse | null>(null);
  /** Per-question: answering | awaiting_confidence | done */
  const [itemStep, setItemStep] = useState<"answering" | "feedback" | "confidence">("answering");
  const examRationaleRef = useRef<Record<string, GradedRow>>({});
  const [sessionElapsedSec, setSessionElapsedSec] = useState(0);

  const source = (parsed.source ?? DEFAULT_PRACTICE_SOURCE) as PracticeSessionSource;
  const mode = (parsed.mode ?? DEFAULT_PRACTICE_MODE) as PracticeSessionMode;
  const shuffle = parsed.shuffle ?? DEFAULT_SHUFFLE;
  const count = parsed.count ?? DEFAULT_PRACTICE_COUNT;
  const isWeakAreaSession = source === "weak_areas" || mode === "weak_area" || parsed.studyFilter === "weak";

  const reloadParams = useCallback(() => {
    if (!pathwayId) return;
    setWeakAreaNote(null);
    if (source === "previously_incorrect") {
      const events = readQuestionPerformanceEvents(userId, 220);
      const ids = questionIdsWithIncorrectAttempts(events, 200);
      if (ids.length === 0) {
        setQuestions([]);
        setPhase("empty");
        return;
      }
    }
    setPhase("loading");
    setError(null);
    const qs = buildQuestionListSearchParams({
      pathwayId,
      source,
      categorySlug: parsed.categorySlug,
      count,
      mode,
      shuffle,
      userId,
      practiceHubIds: parsed.practiceHubIds,
    });
    void fetch(`/api/questions?${qs.toString()}`)
      .then(async (res) => {
        const rawText = await res.text();
        let data: QuestionListResponse;
        try {
          data = JSON.parse(rawText) as QuestionListResponse;
        } catch {
          setError("Invalid server response.");
          setPhase("error");
          return;
        }
        if (!res.ok) {
          setError(data.error ?? "Could not load questions.");
          setPhase("error");
          return;
        }
        const list = data.questions ?? [];
        if (isWeakAreaSession) setWeakAreaNote(data);
        if (list.length === 0) {
          setQuestions([]);
          setPhase("empty");
          return;
        }
        setQuestions(list);
        setIdx(0);
        setAnswer(null);
        setGraded({});
        setItemStep("answering");
        examRationaleRef.current = {};
        setPhase("ready");
      })
      .catch(() => {
        setError("Could not load questions.");
        setPhase("error");
      });
  }, [pathwayId, source, parsed.categorySlug, parsed.practiceHubIds, count, mode, shuffle, userId, isWeakAreaSession]);

  useEffect(() => {
    reloadParams();
  }, [reloadParams]);

  useEffect(() => {
    if (phase !== "ready" || questions.length === 0) {
      setSessionElapsedSec(0);
      return;
    }
    setSessionElapsedSec(0);
    const id = window.setInterval(() => setSessionElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, questions.length, questions[0]?.id]);

  const current = questions[idx];
  const total = questions.length;
  const isLast = idx >= total - 1;

  const optsCanonical = useMemo(() => (current ? parseOptions(current.options) : []), [current]);
  const optsDisplay = useMemo(() => {
    if (!current) return [];
    const d = current.displayOptions;
    if (Array.isArray(d) && d.length === optsCanonical.length) return d.map((x) => String(x));
    return optsCanonical;
  }, [current, optsCanonical]);

  const stemDisplay = useMemo(
    () => (current ? resolveMeasurementTokens(current.stem, measurementSystem, { pathwayId }) : ""),
    [current, measurementSystem, pathwayId],
  );
  const optsClinical = useMemo(
    () => optsDisplay.map((o) => resolveMeasurementTokens(String(o), measurementSystem, { pathwayId })),
    [optsDisplay, measurementSystem, pathwayId],
  );

  const g = current ? graded[current.id] : undefined;
  const isSata = Boolean(
    current &&
      (current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY"),
  );

  const sessionCorrect = useMemo(() => Object.values(graded).filter((x) => x.correct).length, [graded]);
  const sessionAttempted = useMemo(() => Object.keys(graded).length, [graded]);

  const showRationaleNow = Boolean(g && (mode === "tutor" || mode === "weak_area"));
  const weakAreaBanner = useMemo(() => {
    if (!isWeakAreaSession || !weakAreaNote) return null;
    if (weakAreaNote.studyModeNote === "weak_topic_unavailable") {
      return "Starter remediation mode: answer a few questions and rate confidence so NurseNest can identify your true weak areas.";
    }
    if (weakAreaNote.studyModeNote === "weak_topic_low_confidence" || weakAreaNote.weakTopicConfidence === "low") {
      return "Starter remediation mode: we are using early performance signals while your weak-area profile builds.";
    }
    if (weakAreaNote.topicRelaxed) {
      return "Weak-area pool widened: not enough items matched the narrow filters, so this session expanded safely.";
    }
    return null;
  }, [isWeakAreaSession, weakAreaNote]);

  async function submitAnswerWith(nextAnswer: unknown): Promise<boolean> {
    if (!current) return false;
    if (nextAnswer === null || (Array.isArray(nextAnswer) && nextAnswer.length === 0)) return false;
    setAnswer(nextAnswer);
    setGrading(true);
    try {
      const res = await fetch("/api/questions/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: current.id,
          answer: nextAnswer,
          pathwayId: pathwayId ?? undefined,
          attemptMode: mode === "exam" ? "quiz" : mode === "weak_area" ? "remediation" : "practice",
        }),
      });
      const data = (await res.json()) as {
        correct?: boolean;
        correctKeys?: string[];
        rationale?: string | null;
        clinicalPearl?: string | null;
        rationaleSections?: Array<{ heading: string; body: string }> | null;
        peerStats?: QuestionBankPeerStatsClient | null;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not grade this item.");
        return false;
      }
      const correct = Boolean(data.correct);
      const correctKeys = Array.isArray(data.correctKeys) ? (data.correctKeys as string[]) : undefined;
      const row: GradedRow = {
        correct,
        ...(correctKeys && correctKeys.length > 0 ? { correctKeys } : {}),
        rationale: data.rationale ?? null,
        clinicalPearl: data.clinicalPearl ?? null,
        rationaleSections: data.rationaleSections ?? null,
        peerStats: data.peerStats ?? null,
      };
      setGraded((prev) => ({ ...prev, [current.id]: row }));
      examRationaleRef.current[current.id] = row;
      setItemStep("feedback");
      return true;
    } finally {
      setGrading(false);
    }
  }

  function answerSummary(): string {
    if (answer == null) return "";
    if (Array.isArray(answer)) return answer.join(";");
    return String(answer);
  }

  function recordAttempt(confidence: "low" | "medium" | "high") {
    if (!current) return;
    const row = graded[current.id];
    if (!row) return;
    recordQuestionPerformanceEvent(userId, {
      questionId: current.id,
      topic: current.topic ?? null,
      subtopic: current.subtopic ?? null,
      pathwayId: pathwayId ?? null,
      exam: current.exam ?? null,
      correct: row.correct,
      confidence,
      practiceSessionMode: mode,
      selectedAnswerSummary: answerSummary(),
    });
    if (row.correct && confidence === "low" && pathwayId) {
      void fetch("/api/remediation/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          questionId: current.id,
          pathwayId,
          reason: "low_confidence_correct",
          confidence: "low",
        }),
      }).catch(() => undefined);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nn-topic-stats-updated"));
      window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
    }
  }

  function afterConfidence() {
    if (isLast) {
      if (mode === "exam") {
        setPhase("summary");
      } else {
        router.push(`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`);
      }
      return;
    }
    setIdx((i) => i + 1);
    setAnswer(null);
    setItemStep("answering");
  }

  if (!pathwayId) {
    return (
      <div className="nn-card p-6 text-sm text-[var(--semantic-text-secondary)]">
        Select your exam track in study preferences, then return to Practice.
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 shadow-[var(--shadow-card)]"
        aria-busy="true"
      >
        <div className="nn-skeleton nn-skeleton-shimmer mb-4 h-4 w-40 rounded-full" />
        <div className="nn-skeleton nn-skeleton-shimmer mb-3 h-24 w-full rounded-xl" />
        <div className="space-y-2">
          <div className="nn-skeleton nn-skeleton-shimmer h-12 w-full rounded-xl" />
          <div className="nn-skeleton nn-skeleton-shimmer h-12 w-full rounded-xl" />
          <div className="nn-skeleton nn-skeleton-shimmer h-12 w-full rounded-xl opacity-90" />
        </div>
        <p className="mt-4 text-center text-sm text-[var(--semantic-text-secondary)]">Loading your session…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="nn-card space-y-3 p-6">
        <p className="text-sm text-[var(--semantic-danger)]">{error}</p>
        <button type="button" className="nn-btn-primary rounded-full px-5 py-2 text-sm font-semibold" onClick={() => reloadParams()}>
          Retry
        </button>
        <Link href={`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`} className="ml-3 text-sm font-semibold text-[var(--semantic-brand)] underline">
          Back to setup
        </Link>
      </div>
    );
  }

  if (phase === "empty") {
    const sf = parsed.studyFilter ?? "all";
    const emptyTitle =
      source === "previously_incorrect" || sf === "incorrect"
        ? "No incorrect-review items yet"
        : source === "not_studied" || sf === "unseen"
          ? "No unseen questions match this scope"
          : source === "weak_areas" || sf === "weak"
            ? "No weak-area targets in this slice yet"
            : sf === "bookmarked"
              ? "No bookmarked items for this launch"
              : "No questions match these filters yet";
    const emptyBody =
      source === "previously_incorrect" || sf === "incorrect"
        ? "Answer questions in practice or the bank first — we will pull recent misses here."
        : source === "not_studied" || sf === "unseen"
          ? "You may have opened most items already, or the pathway pool is narrow for this filter."
          : source === "weak_areas" || sf === "weak"
            ? "Keep practicing — weak targeting improves once you have attempt history."
            : sf === "bookmarked"
              ? "Star items during practice or use saved presets in the full question bank."
              : "Try Mixed Review, widen body-system selection, or adjust filters.";
    return (
      <div className="nn-card space-y-3 p-6 text-sm text-[var(--semantic-text-secondary)]">
        <p className="font-medium text-[var(--semantic-text-primary)]">{emptyTitle}</p>
        <p>{emptyBody}</p>
        <Link
          href={`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`}
          className="inline-flex font-semibold text-[var(--semantic-brand)] underline"
        >
          Adjust setup
        </Link>
      </div>
    );
  }

  if (phase === "summary" && mode === "exam") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">Session review</h2>
        <p className="text-sm text-[var(--semantic-text-secondary)]">Rationales for each item in this exam-style pass.</p>
        <ul className="space-y-6">
          {questions.map((q) => {
            const gr = examRationaleRef.current[q.id];
            if (!gr) return null;
            return (
              <li key={q.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                <p className="text-xs font-semibold uppercase text-[var(--semantic-text-muted)]">{q.topic ?? "Question"}</p>
                <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">{resolveMeasurementTokens(q.stem, measurementSystem, { pathwayId })}</p>
                {gr.rationale ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{resolveMeasurementTokens(gr.rationale, measurementSystem, { pathwayId })}</p>
                ) : null}
                {gr.clinicalPearl ? (
                  <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">Key takeaway: {gr.clinicalPearl}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <Link href={`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`} className="nn-btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold">
          Done
        </Link>
      </div>
    );
  }

  if (!current) return null;

  const rationaleText = g?.rationale ? resolveMeasurementTokens(g.rationale, measurementSystem, { pathwayId }) : "";
  const pearl = g?.clinicalPearl ? resolveMeasurementTokens(g.clinicalPearl, measurementSystem, { pathwayId }) : "";
  const elapsedLabel = `${String(Math.floor(sessionElapsedSec / 60)).padStart(2, "0")}:${String(sessionElapsedSec % 60).padStart(2, "0")}`;
  const visibleLetters = optsCanonical.map((_, optionIndex) => String.fromCharCode("A".charCodeAt(0) + optionIndex));
  const canonicalToLetter = new Map(optsCanonical.map((canonical, optionIndex) => [canonical, visibleLetters[optionIndex] ?? ""]));
  const letterToCanonical = new Map(optsCanonical.map((canonical, optionIndex) => [visibleLetters[optionIndex] ?? "", canonical]));
  const answerOptions = optsCanonical.map((canonical, optionIndex) => ({
    letter: visibleLetters[optionIndex] ?? String.fromCharCode("A".charCodeAt(0) + optionIndex),
    text: optsClinical[optionIndex] ?? optsDisplay[optionIndex] ?? canonical,
  }));
  const correctVisibleLetters = (g?.correctKeys ?? [])
    .map((key) => canonicalToLetter.get(key))
    .filter((letter): letter is string => Boolean(letter));
  const selectedVisibleLetters = Array.isArray(answer)
    ? answer.map((key) => canonicalToLetter.get(String(key))).filter((letter): letter is string => Boolean(letter))
    : typeof answer === "string"
      ? [canonicalToLetter.get(answer)].filter((letter): letter is string => Boolean(letter))
      : [];
  const primaryCorrectLetter = correctVisibleLetters[0] ?? selectedVisibleLetters[0] ?? "A";
  const fullRationale = rationaleText || resolveMeasurementTokens(current.rationale ?? "", measurementSystem, { pathwayId });
  const adaptiveCaseSimulation = buildAdaptiveCaseSimulation({
    id: current.id,
    questionType: current.questionType,
    stem: stemDisplay,
    topic: current.topic,
    subtopic: current.subtopic,
    rationale: fullRationale,
  });
  const practiceExamPayload: ExamMicroQuestionPayload | SataQuestionPayload | null =
    answerOptions.length >= 2
      ? isSata
        ? {
            itemKind: "SATA",
            questionStem: stemDisplay,
            answerOptions,
            correctLetters: correctVisibleLetters,
            rationaleCorrect:
              fullRationale || "Match each selected option to a concrete assessment finding, risk, or ordered intervention in the stem.",
            rationaleByLetter: answerOptions.map((option) => {
              const isCorrectOption = correctVisibleLetters.includes(option.letter);
              return {
                letter: option.letter,
                correct: isCorrectOption,
                rationale: isCorrectOption
                  ? "This selection is supported by a finding in the stem and belongs in the immediate care plan."
                  : "This option may sound reasonable, but the stem does not provide the assessment finding or risk pattern needed to support it.",
              };
            }),
          }
        : {
            itemKind: "CLINICAL",
            questionStem: stemDisplay,
            answerOptions,
            correctLetter: primaryCorrectLetter,
            rationaleCorrect:
              fullRationale || "The correct option is the one directly supported by the client data in the stem and the expected nursing response.",
            rationaleIncorrect: answerOptions
              .filter((option) => option.letter !== primaryCorrectLetter)
              .map((option) => ({
                letter: option.letter,
                rationale:
                  "This option is tempting because it may be true in another context, but this stem does not make it the best supported response.",
              })),
          }
      : null;

  const submitPracticeMcqAnswer = async (selectedLetter: string): Promise<boolean> => {
    const canonical = letterToCanonical.get(selectedLetter);
    if (!canonical) return false;
    return submitAnswerWith(canonical);
  };

  const submitPracticeSataAnswer = async (selectedLetters: string[]): Promise<boolean> => {
    const canonical = selectedLetters.map((letter) => letterToCanonical.get(letter)).filter((item): item is string => Boolean(item));
    return submitAnswerWith(canonical);
  };

  const practiceFooter = (
    <div className="space-y-3">
      {weakAreaBanner ? (
        <div className="nn-flashcard-coach-panel">
          <p className="font-semibold text-[var(--semantic-text-primary)]">Weak Areas</p>
          <p className="mt-1 text-[var(--semantic-text-secondary)]">{weakAreaBanner}</p>
        </div>
      ) : null}
      {g?.peerStats ? (
        <QuestionBankPeerPerformancePanel
          peerStats={g.peerStats}
          optionCanonicals={optsCanonical}
          optionDisplays={optsClinical}
        />
      ) : null}
      {g && showRationaleNow && pearl ? (
        <div className="nn-flashcard-coach-panel">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Key nursing takeaway
          </p>
          <p className="mt-1 text-[var(--semantic-text-primary)]">{pearl}</p>
        </div>
      ) : null}
      {g && itemStep !== "confidence" ? (
        <div className="nn-flashcard-rating-dock">
          <button
            type="button"
            className={mode === "exam" ? "nn-btn-secondary rounded-full px-5 py-2 text-sm font-semibold" : "nn-btn-primary rounded-full px-5 py-2 text-sm font-semibold"}
            onClick={() => setItemStep("confidence")}
          >
            {mode === "exam" ? "Continue" : "Rate confidence"}
          </button>
        </div>
      ) : null}
      {g && itemStep === "confidence" ? (
        <div className="nn-flashcard-rating-dock" aria-label="Rate confidence">
          {(
            [
              { k: "low" as const, lab: "Low confidence" },
              { k: "medium" as const, lab: "Medium confidence" },
              { k: "high" as const, lab: "High confidence" },
            ] as const
          ).map((row) => (
            <button
              key={row.k}
              type="button"
              className="nn-flashcard-shell-action"
              onClick={() => {
                recordAttempt(row.k);
                afterConfidence();
              }}
            >
              {row.lab}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="practice_question_session">
      <div
        className="nn-flashcard-study-premium nn-active-flashcard-session nn-unified-exam-workspace"
        data-nn-premium-flashcard-active-session
        data-nn-flashcard-layout-refinement=""
        {...learnerExamLayoutRefinementProps()}
        data-nn-canonical-learner-surface={CANONICAL_LEARNER_SURFACE_VERSION}
        data-nn-unified-exam-workspace=""
        data-nn-exam-workspace-mode={"practice" satisfies UnifiedExamWorkspaceMode}
      >
        <div className="nn-flashcard-learning-topbar" aria-label="Practice question session">
          <div className="min-w-0">
            <p className="nn-flashcard-learning-topbar__mode">Practice</p>
            <h1>Practice Questions</h1>
          </div>

          <div className="nn-flashcard-learning-topbar__meta">
            <div>
              <span>Progress</span>
              <strong>{idx + 1} of {total}</strong>
              <i aria-hidden>
                <b style={{ width: `${((idx + 1) / Math.max(1, total)) * 100}%` }} />
              </i>
            </div>
            <div className="max-sm:hidden">
              <span>Focus</span>
              <strong>{current.topic ?? "Mixed"}</strong>
            </div>
            <div>
              <span>Time elapsed</span>
              <strong className="font-mono">{elapsedLabel}</strong>
            </div>
            <div>
              <span>Questions</span>
              <strong>{sessionAttempted > 0 ? `${sessionCorrect}/${sessionAttempted}` : `${idx + 1} of ${total}`}</strong>
            </div>
            <ExamMeasurementUnitToggle fallbackSystem={fallbackMeasurementSystem} locked />
            <Link
              href={`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`}
              className="nn-flashcard-shell-action"
            >
              Exit
            </Link>
          </div>
        </div>

        <QuestionRenderer
          mode="practice"
          type={current.questionType}
          layout="standard"
          sessionModeLabel={current.questionType ? current.questionType.replace(/_/g, " ") : "Practice"}
          topicLine={[current.topic, current.subtopic].filter(Boolean).join(" • ") || null}
          itemKindCaption={mode === "weak_area" ? "Remediation" : mode === "exam" ? "Exam practice" : "Question bank"}
          examMicroQuestion={practiceExamPayload}
          adaptiveCaseSimulation={adaptiveCaseSimulation}
          prompt={stemDisplay}
          answer={fullRationale || "Review the explanation after submitting your answer."}
          explanation={fullRationale}
          pearl={pearl}
          revealed={Boolean(g)}
          onReveal={() => undefined}
          onBeforeAnswerReveal={submitPracticeMcqAnswer}
          onBeforeSataReveal={submitPracticeSataAnswer}
          onSataReveal={() => undefined}
          mcqInteractionMode="tutor_select"
          labels={{
            answerHeading: "Answer and rationale",
            whyCorrectHeading: "Why this is correct",
            whyIncorrectHeading: "Why the other options do not fit this stem",
            takeawayHeading: "Key nursing takeaway",
            answerChoicesHeading: isSata ? "Select all that apply" : "Answer choices",
          }}
          questionLabel={`Question ${idx + 1} of ${total}`}
          onAdvance={g ? () => setItemStep("confidence") : undefined}
          mainFooter={practiceFooter}
        />
      </div>
    </ProtectedPremiumContent>
  );
}
