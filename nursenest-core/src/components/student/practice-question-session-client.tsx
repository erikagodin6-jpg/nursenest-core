"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";
import { ExamProgressBar, ExamSessionShell, ExamSessionTopBar } from "@/components/exam/exam-session-shell";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";
import {
  questionIdsWithIncorrectAttempts,
  readQuestionPerformanceEvents,
  recordQuestionPerformanceEvent,
} from "@/lib/learner/question-performance-events";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { buildQuestionListSearchParams } from "@/lib/practice-question-session/build-question-list-params";
import {
  DEFAULT_PRACTICE_COUNT,
  DEFAULT_PRACTICE_MODE,
  DEFAULT_PRACTICE_SOURCE,
  DEFAULT_SHUFFLE,
} from "@/lib/practice-question-session/constants";
import { parsePracticeSessionSearchParams } from "@/lib/practice-question-session/parse-session-search-params";
import type { PracticeSessionMode, PracticeSessionSource } from "@/lib/practice-question-session/constants";

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
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

function gradedAnswerSurfaceClass(
  graded: boolean,
  grade: { correct: boolean; correctKeys?: string[] } | undefined,
  canonical: string,
  picked: boolean,
): string {
  const base = "nn-qopt-surface";
  if (!graded || !grade) return base;
  const keys = grade.correctKeys;
  if (keys && keys.length > 0) {
    const ck = new Set(keys);
    if (ck.has(canonical)) return `${base} nn-qopt-surface--correct`;
    if (picked) return `${base} nn-qopt-surface--incorrect`;
    return `${base} nn-qopt-surface--dim`;
  }
  if (picked) {
    return grade.correct ? `${base} nn-qopt-surface--correct` : `${base} nn-qopt-surface--incorrect`;
  }
  return `${base} nn-qopt-surface--dim`;
}

function activeAnswerSurfaceClass(picked: boolean): string {
  return ["nn-qopt-surface", "nn-qopt-surface--interactive", picked ? "nn-qopt-surface--selected" : ""]
    .filter(Boolean)
    .join(" ");
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
  const measurementSystem = useMemo(
    () => resolveMeasurementSystemForLearnerPathway(pathwayId, pathwayCountryByPathwayId),
    [pathwayId, pathwayCountryByPathwayId],
  );

  const [phase, setPhase] = useState<"loading" | "ready" | "empty" | "error" | "summary">("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QFull[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [graded, setGraded] = useState<Record<string, GradedRow>>({});
  const [grading, setGrading] = useState(false);
  /** Per-question: answering | awaiting_confidence | done */
  const [itemStep, setItemStep] = useState<"answering" | "feedback" | "confidence">("answering");
  const examRationaleRef = useRef<Record<string, GradedRow>>({});

  const source = (parsed.source ?? DEFAULT_PRACTICE_SOURCE) as PracticeSessionSource;
  const mode = (parsed.mode ?? DEFAULT_PRACTICE_MODE) as PracticeSessionMode;
  const shuffle = parsed.shuffle ?? DEFAULT_SHUFFLE;
  const count = parsed.count ?? DEFAULT_PRACTICE_COUNT;

  const reloadParams = useCallback(() => {
    if (!pathwayId) return;
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
    });
    void fetch(`/api/questions?${qs.toString()}`)
      .then(async (res) => {
        const data = (await res.json()) as { questions?: QFull[]; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Could not load questions.");
          setPhase("error");
          return;
        }
        const list = data.questions ?? [];
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
  }, [pathwayId, source, parsed.categorySlug, count, mode, shuffle, userId]);

  useEffect(() => {
    reloadParams();
  }, [reloadParams]);

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
    () => (current ? resolveMeasurementTokens(current.stem, measurementSystem) : ""),
    [current, measurementSystem],
  );
  const optsClinical = useMemo(
    () => optsDisplay.map((o) => resolveMeasurementTokens(String(o), measurementSystem)),
    [optsDisplay, measurementSystem],
  );

  const g = current ? graded[current.id] : undefined;
  const isSata = Boolean(
    current &&
      (current.questionType.toUpperCase() === "SATA" || current.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY"),
  );

  const sessionCorrect = useMemo(() => Object.values(graded).filter((x) => x.correct).length, [graded]);
  const sessionAttempted = useMemo(() => Object.keys(graded).length, [graded]);

  const showRationaleNow = Boolean(g && (mode === "tutor" || mode === "weak_area"));

  async function submitAnswer() {
    if (!current) return;
    if (answer === null || (Array.isArray(answer) && answer.length === 0)) return;
    setGrading(true);
    try {
      const res = await fetch("/api/questions/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: current.id,
          answer,
          pathwayId: pathwayId ?? undefined,
        }),
      });
      const data = (await res.json()) as {
        correct?: boolean;
        correctKeys?: string[];
        rationale?: string | null;
        clinicalPearl?: string | null;
        rationaleSections?: Array<{ heading: string; body: string }> | null;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not grade this item.");
        return;
      }
      const correct = Boolean(data.correct);
      const correctKeys = Array.isArray(data.correctKeys) ? (data.correctKeys as string[]) : undefined;
      const row: GradedRow = {
        correct,
        ...(correctKeys && correctKeys.length > 0 ? { correctKeys } : {}),
        rationale: data.rationale ?? null,
        clinicalPearl: data.clinicalPearl ?? null,
        rationaleSections: data.rationaleSections ?? null,
      };
      setGraded((prev) => ({ ...prev, [current.id]: row }));
      examRationaleRef.current[current.id] = row;
      setItemStep("feedback");
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
        className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]"
        aria-busy="true"
      >
        <p className="text-sm text-[var(--semantic-text-secondary)]">Loading your session…</p>
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
    return (
      <div className="nn-card space-y-3 p-6 text-sm text-[var(--semantic-text-secondary)]">
        <p className="font-medium text-[var(--semantic-text-primary)]">No questions match these filters yet.</p>
        <p>Try Mixed Review or another category.</p>
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
                <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">{resolveMeasurementTokens(q.stem, measurementSystem)}</p>
                {gr.rationale ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{resolveMeasurementTokens(gr.rationale, measurementSystem)}</p>
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

  const rationaleText = g?.rationale ? resolveMeasurementTokens(g.rationale, measurementSystem) : "";
  const pearl = g?.clinicalPearl ? resolveMeasurementTokens(g.clinicalPearl, measurementSystem) : "";

  return (
    <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} telemetrySurface="practice_question_session">
      <ExamSessionShell neutralPalette immersive className="overflow-hidden shadow-md">
        <ExamSessionTopBar
          left={
            <div className="space-y-1">
              <Link
                href={`/app/questions${pathwayId ? `?pathwayId=${encodeURIComponent(pathwayId)}` : ""}`}
                className="text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Exit session
              </Link>
              <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                Question {idx + 1} of {total}
              </p>
              {current.topic ? <p className="line-clamp-1 text-sm font-medium text-[var(--theme-heading-text)]">{current.topic}</p> : null}
            </div>
          }
          center={
            <span className="nn-marketing-caption font-semibold tabular-nums text-[var(--semantic-text-muted)]">
              {sessionAttempted > 0 ? `${sessionCorrect}/${sessionAttempted} correct` : "Practice"}
            </span>
          }
          right={
            <div className="flex justify-end gap-2">
              <ExamSessionThemeTrigger />
            </div>
          }
        />
        <ExamProgressBar current={idx + 1} total={total} answeredCount={sessionAttempted} />

        <div className="nn-question-session nn-question-session--split">
          <div className="nn-question-session-primary min-h-0 space-y-5 overflow-y-auto p-4 sm:p-6">
            <div className="nn-question-stem-card">
              {current.questionType ? <span className="nn-question-type-chip">{current.questionType}</span> : null}
              {current.subtopic ? <p className="mb-2 text-xs font-medium text-[var(--semantic-text-muted)]">{current.subtopic}</p> : null}
              <p className="nn-question-stem mt-2">{stemDisplay}</p>
            </div>

            {itemStep === "answering" ? (
              isSata ? (
                <ul className="nn-qopt-list" role="group" aria-label="Answer choices">
                  {optsCanonical.map((canonical, i) => {
                    const label = optsClinical[i] ?? optsDisplay[i] ?? canonical;
                    const selected = Array.isArray(answer) ? answer.includes(canonical) : false;
                    return (
                      <li key={canonical}>
                        <label className={`flex min-h-[3.25rem] cursor-pointer items-start gap-3 rounded-[inherit] px-3 py-2.5 ${activeAnswerSurfaceClass(selected)}`}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const prev = Array.isArray(answer) ? [...answer] : [];
                              const next = e.target.checked ? [...prev, canonical] : prev.filter((x) => x !== canonical);
                              setAnswer(next);
                            }}
                            className="mt-1 size-5"
                          />
                          <QuestionChoiceLetter index={i} />
                          <span className="min-w-0 flex-1 text-base leading-relaxed">{label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="nn-qopt-list" role="radiogroup" aria-label="Answer choices">
                  {optsCanonical.map((canonical, i) => {
                    const label = optsClinical[i] ?? optsDisplay[i] ?? canonical;
                    const picked = answer === canonical;
                    return (
                      <li key={canonical}>
                        <button
                          type="button"
                          onClick={() => setAnswer(canonical)}
                          className={`flex w-full items-start gap-3 px-4 py-4 text-left text-base ${activeAnswerSurfaceClass(picked)}`}
                        >
                          <QuestionChoiceLetter index={i} />
                          <span className="min-w-0 flex-1">{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{g?.correct ? "Correct" : "Incorrect"}</p>
                {g && current ? (
                  <ul className="nn-qopt-list" aria-label="Answer review">
                    {optsCanonical.map((canonical, i) => {
                      const label = optsClinical[i] ?? optsDisplay[i] ?? canonical;
                      const raw = answer;
                      const picked = Array.isArray(raw) ? raw.includes(canonical) : raw === canonical;
                      const surface = gradedAnswerSurfaceClass(true, g, canonical, picked);
                      return (
                        <li key={canonical}>
                          <div className={`flex items-start gap-3 px-3 py-2.5 text-sm ${surface}`}>
                            <QuestionChoiceLetter index={i} />
                            <span className="min-w-0 flex-1 leading-relaxed">{label}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {g && showRationaleNow && rationaleText ? (
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-surface))] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    <p className="text-xs font-semibold uppercase text-[var(--semantic-text-muted)]">Rationale</p>
                    <p className="mt-2">{rationaleText}</p>
                  </div>
                ) : null}
                {g && showRationaleNow && pearl ? (
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm">
                    <p className="text-xs font-semibold uppercase text-[var(--semantic-text-muted)]">Key nursing takeaway</p>
                    <p className="mt-2 text-[var(--semantic-text-primary)]">{pearl}</p>
                  </div>
                ) : null}
                {g && showRationaleNow && g.rationaleSections?.length
                  ? g.rationaleSections.map((s) => (
                      <div key={s.heading} className="rounded-xl border border-[var(--semantic-border-soft)] p-4 text-sm">
                        <p className="text-xs font-semibold uppercase text-[var(--semantic-text-muted)]">{s.heading}</p>
                        <p className="mt-2 text-[var(--semantic-text-secondary)]">{resolveMeasurementTokens(s.body, measurementSystem)}</p>
                      </div>
                    ))
                  : null}
              </div>
            )}

            {itemStep === "answering" ? (
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  disabled={grading || answer === null || (Array.isArray(answer) && answer.length === 0)}
                  onClick={() => void submitAnswer()}
                  className="nn-btn-primary inline-flex min-h-12 flex-1 items-center justify-center rounded-full px-8 text-sm font-semibold disabled:opacity-50 sm:flex-none"
                >
                  {grading ? "Checking…" : "Submit answer"}
                </button>
              </div>
            ) : itemStep === "feedback" ? (
              <div className="pt-2">
                <button
                  type="button"
                  className={`rounded-full px-6 py-2 text-sm font-semibold ${
                    mode === "exam" ? "nn-btn-secondary" : "nn-btn-primary"
                  }`}
                  onClick={() => setItemStep("confidence")}
                >
                  {mode === "exam" ? "Continue" : "Rate confidence"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 border-t border-[var(--semantic-border-soft)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">How confident were you?</p>
                <div className="flex flex-wrap gap-2">
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
                      className="min-h-11 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
                      onClick={() => {
                        recordAttempt(row.k);
                        afterConfidence();
                      }}
                    >
                      {row.lab}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ExamSessionShell>
    </ProtectedPremiumContent>
  );
}
