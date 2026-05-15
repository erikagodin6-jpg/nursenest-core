"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { EcgLevel, EcgMode, EcgRouteKind } from "@/lib/ecg-module/ecg-module-config";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { isEcgLiveStripMediaConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";
import { ECG_LIVE_STRIP_MEDIA_TYPE } from "@/lib/ecg-video-quiz/ecg-video-question";
import { EcgInterpretationScaffold } from "@/components/ecg-module/ecg-interpretation-scaffold";
import { getEcgCurriculumUnitByRhythmTag } from "@/lib/ecg-module/ecg-curriculum-content";

type EcgQuestion = {
  id: string;
  videoUrl: string;
  mediaType: string;
  mediaConfig: unknown;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  questionText: string;
  options: { id: string; text: string }[];
  rationale: string | null;
  rhythmTag: string;
  clinicalPriority: string | null;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

type EcgWorksheet = {
  id: string;
  title: string;
  description: string | null;
  accessState: "free" | "premium_included" | "unlocked" | "locked" | "admin_preview";
  previewBlurred: boolean;
  downloadUrl: string | null;
};

type AnswerResult = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctRhythm: string;
  correctAnswerId: string;
  rationale: string | null;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

/** Phase of a single question card */
type QuestionPhase = "scaffold" | "answering" | "submitted";

// ─── VideoPreview ────────────────────────────────────────────────────────────

function VideoPreview({
  videoUrl,
  thumbnailUrl,
  autoplay,
  slow,
}: {
  videoUrl: string;
  thumbnailUrl: string | null;
  autoplay?: boolean;
  slow?: boolean;
}) {
  const source = videoUrl.trim();
  if (!source) return null;
  return (
    <video
      className="mt-3 aspect-video w-full rounded-md border border-[var(--semantic-border-soft)] bg-black object-contain"
      controls
      autoPlay={autoplay}
      muted={autoplay}
      loop={autoplay}
      preload="metadata"
      poster={thumbnailUrl ?? undefined}
      onLoadedMetadata={(event) => {
        if (slow) event.currentTarget.playbackRate = 0.75;
      }}
    >
      <source src={source} />
    </video>
  );
}

// ─── CurriculumLessonCard ────────────────────────────────────────────────────

function CurriculumLessonCard({ rhythmTag }: { rhythmTag: string }) {
  const [open, setOpen] = useState(false);
  const unit = getEcgCurriculumUnitByRhythmTag(rhythmTag);
  if (!unit) return null;

  return (
    <div
      className="mt-4 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_05%,var(--semantic-surface))]"
      data-testid="curriculum-lesson-card"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-primary))]">
            Reveal interpretation steps
          </span>
          <span className="mt-0.5 block text-sm font-semibold text-[var(--semantic-text-primary)]">
            {unit.title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </button>

      {open ? (
        <div
          className="space-y-5 border-t border-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-border-soft))] px-4 py-4 text-sm leading-relaxed"
          data-testid="curriculum-lesson-body"
        >
          {unit.parameters ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Rhythm Parameters
              </p>
              <dl className="grid gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 sm:grid-cols-2">
                {(
                  [
                    ["Rate", unit.parameters.rate],
                    ["Regularity", unit.parameters.regularity],
                    ["P Waves", unit.parameters.pWaves],
                    ["PR Interval", unit.parameters.prInterval],
                    ["QRS Width", unit.parameters.qrsWidth],
                    ["ST Changes", unit.parameters.stChanges],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[11px] font-semibold text-[var(--semantic-text-muted)]">{label}</dt>
                    <dd className="text-xs font-medium text-[var(--semantic-text-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <LessonSection title="Mechanism" body={unit.mechanism} />
          <LessonSection title="Conduction Pathway" body={unit.conductionPath} />
          <LessonSection title="Why the Strip Looks This Way" body={unit.whyStripLooksThisWay} />
          <LessonSection title="Clinical Implications" body={unit.clinicalImplications} />

          {unit.hemodynamics ? (
            <LessonSection title="Hemodynamic Consequences" body={unit.hemodynamics} />
          ) : null}

          {unit.nclexTraps.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-warning)_80%,var(--semantic-text-primary))]">
                NCLEX Traps
              </p>
              <ul className="space-y-1.5 text-xs">
                {unit.nclexTraps.map((trap, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,var(--semantic-surface))] px-3 py-2"
                  >
                    <span className="mt-px shrink-0 text-[var(--semantic-warning)]">⚠</span>
                    <span className="leading-relaxed text-[var(--semantic-text-primary)]">{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {unit.nursingPriorities.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_80%,var(--semantic-text-primary))]">
                Nursing Priorities
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-xs">
                {unit.nursingPriorities.map((priority, i) => (
                  <li key={i} className="leading-relaxed text-[var(--semantic-text-secondary)]">
                    {priority}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {unit.recognitionPearls.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))]">
                Recognition Pearls
              </p>
              <ul className="space-y-1 text-xs">
                {unit.recognitionPearls.map((pearl, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 text-[var(--semantic-success)]">◆</span>
                    <span className="leading-relaxed text-[var(--semantic-text-secondary)]">{pearl}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {unit.notThisBecause && unit.notThisBecause.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Why Not the Other Options
              </p>
              <ul className="space-y-1.5 text-xs">
                {unit.notThisBecause.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2"
                  >
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{item.rhythm}: </span>
                    <span className="text-[var(--semantic-text-secondary)]">{item.distinguisher}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function LessonSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{title}</p>
      <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
    </div>
  );
}

// ─── EcgQuestionCard ─────────────────────────────────────────────────────────

function EcgQuestionCard({
  item,
  kind,
  level,
  onSubmit,
  result,
  submitting,
}: {
  item: EcgQuestion;
  kind: EcgRouteKind;
  level: EcgLevel;
  onSubmit: (item: EcgQuestion, optionId: string) => Promise<void>;
  result: AnswerResult | undefined;
  submitting: boolean;
}) {
  const isGuidedLessonMode = level === "basic" && kind === "lessons";
  const isDrillMode = kind === "video-drills";

  // For drill mode: skip scaffold, submit immediately on option click
  const initialPhase: QuestionPhase = isDrillMode ? "answering" : isGuidedLessonMode ? "scaffold" : "answering";
  const [phase, setPhase] = useState<QuestionPhase>(initialPhase);
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const [lessonExpanded, setLessonExpanded] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const isSubmitted = Boolean(result);
  const isCorrect = result?.isCorrect ?? false;
  const correctOptionLabel =
    item.options.find((o) => o.id === result?.correctAnswerId)?.text ?? result?.correctAnswerId ?? "";
  const selectedOptionLabel =
    item.options.find((o) => o.id === result?.selectedOptionId)?.text ?? "";

  function handleScaffoldComplete() {
    setPhase("answering");
  }

  async function handleOptionClick(optionId: string) {
    if (isSubmitted || submitting) return;
    if (isDrillMode) {
      // Drills: immediate submit on click (quick-fire mode)
      await onSubmit(item, optionId);
      return;
    }
    setPendingOptionId(optionId);
  }

  async function handleSubmit() {
    if (!pendingOptionId || isSubmitted || submitting) return;
    await onSubmit(item, pendingOptionId);
    setPhase("submitted");
    // Scroll result into view
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
  }

  return (
    <li
      className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5"
      data-testid="ecg-question-card"
    >
      {item.clinicalPriority ? (
        <p className="mb-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))]">
          Clinical priority: {item.clinicalPriority}
        </p>
      ) : null}

      {/* Rhythm tag badge */}
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {item.rhythmTag}
      </p>

      {/* ECG media */}
      <VideoPreview
        videoUrl={item.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE ? "" : item.videoUrl}
        thumbnailUrl={item.thumbnailUrl}
        autoplay={isDrillMode}
        slow={level === "basic" && kind === "lessons"}
      />
      {item.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE && isEcgLiveStripMediaConfig(item.mediaConfig) ? (
        <EcgLiveStrip
          className="mt-3"
          config={item.mediaConfig}
          mode={isDrillMode ? "live" : "static"}
          showMeasurements={phase !== "scaffold"}
        />
      ) : null}

      {/* Phase: scaffold */}
      {phase === "scaffold" && !isSubmitted ? (
        <div className="mt-4">
          <EcgInterpretationScaffold onComplete={handleScaffoldComplete} />
        </div>
      ) : null}

      {/* Phase: answering or submitted — question + options */}
      {(phase === "answering" || phase === "submitted" || isDrillMode) ? (
        <div className="mt-4 space-y-3">
          <h2 className="text-sm font-semibold leading-snug text-[var(--semantic-text-primary)] sm:text-base">
            {item.questionText}
          </h2>

          {item.options.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Answer options">
              {item.options.map((option) => {
                const isPending = pendingOptionId === option.id;
                const isSelected = result?.selectedOptionId === option.id;
                const isCorrectOption = result?.correctAnswerId === option.id;

                let cls =
                  "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition";

                if (isSubmitted) {
                  if (isCorrectOption) {
                    cls +=
                      " border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
                  } else if (isSelected && !isCorrectOption) {
                    cls +=
                      " border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] text-[var(--semantic-text-secondary)] opacity-80";
                  } else {
                    cls +=
                      " border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] opacity-50";
                  }
                } else if (isPending) {
                  cls +=
                    " border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] text-[var(--semantic-text-primary)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]";
                } else {
                  cls +=
                    " border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => void handleOptionClick(option.id)}
                    disabled={isSubmitted || submitting}
                    className={cls}
                    aria-pressed={isPending || isSelected}
                    aria-disabled={isSubmitted}
                    data-testid={`ecg-option-${option.id}`}
                  >
                    <span className="flex items-start gap-2">
                      {isSubmitted ? (
                        <span className="mt-0.5 shrink-0 text-base leading-none">
                          {isCorrectOption ? "✓" : isSelected ? "✗" : ""}
                        </span>
                      ) : null}
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Submit button — appears after selection, before submission */}
          {!isSubmitted && !isDrillMode && pendingOptionId ? (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="mt-1 inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--role-cta)] px-6 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_8px_var(--role-cta-shadow)] disabled:opacity-50"
              data-testid="ecg-submit-answer-btn"
            >
              {submitting ? "Checking…" : "Submit Answer"}
            </button>
          ) : null}

          {/* Prompt to select an answer */}
          {!isSubmitted && !isDrillMode && !pendingOptionId ? (
            <p className="text-[11px] text-[var(--semantic-text-muted)]">
              Select an answer above, then click Submit.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Post-submission result */}
      {isSubmitted ? (
        <div className="mt-4 space-y-3" ref={resultRef}>
          {/* Correct/incorrect banner */}
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
              isCorrect
                ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))]"
                : "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))]"
            }`}
            data-testid="ecg-result-banner"
          >
            <span className="mt-0.5 text-lg leading-none">{isCorrect ? "✓" : "✗"}</span>
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-[var(--semantic-text-primary)]">
                {isCorrect ? "Correct" : "Incorrect"}
              </p>
              {!isCorrect ? (
                <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
                  You selected: <span className="font-medium">{selectedOptionLabel}</span>
                  {" · "}Correct answer: <span className="font-semibold">{correctOptionLabel}</span>
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
                  Correct rhythm: <span className="font-semibold">{result?.correctRhythm ?? item.rhythmTag}</span>
                </p>
              )}
            </div>
          </div>

          {/* Rationale (not shown in drill mode) */}
          {kind !== "video-drills" && result?.rationale ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Rationale
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {result.rationale}
              </p>
            </div>
          ) : null}

          {/* Curriculum lesson card — deep teaching post-answer */}
          {kind !== "video-drills" ? (
            <CurriculumLessonCard rhythmTag={item.rhythmTag} />
          ) : null}

          {/* Guided scaffold review (lesson mode only) */}
          {isGuidedLessonMode && phase === "scaffold" ? (
            <EcgInterpretationScaffold reviewMode />
          ) : null}

          {/* Performance stats */}
          <div className="text-xs text-[var(--semantic-text-muted)]">
            {result?.percentCorrect == null
              ? "Not enough attempts yet to show class statistics."
              : `${result.percentCorrect}% of learners answered this correctly`}
            {result?.commonWrongAnswers.length ? (
              <span> · Most common wrong answers: {result.commonWrongAnswers.join(", ")}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Pre-answer stats */}
      {!isSubmitted && item.percentCorrect != null ? (
        <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
          {item.percentCorrect}% of learners answered this correctly
        </p>
      ) : null}
    </li>
  );
}

// ─── EcgQuestionList ─────────────────────────────────────────────────────────

export function EcgQuestionList({
  level,
  mode,
  kind,
}: {
  level: EcgLevel;
  mode: EcgMode;
  kind: EcgRouteKind;
}) {
  const [items, setItems] = useState<EcgQuestion[]>([]);
  const [results, setResults] = useState<Record<string, AnswerResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ level, mode, kind });
    fetch(`/api/modules/ecg/questions?${params.toString()}`, {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (res) => {
        let data: { ok?: boolean; items?: EcgQuestion[]; detail?: string } = {};
        try {
          data = (await res.json()) as typeof data;
        } catch {
          if (!controller.signal.aborted) setError("We could not read the ECG question response. Try again shortly.");
          return;
        }
        if (controller.signal.aborted) return;
        if (res.status === 401) { setError("Sign in to load ECG questions."); return; }
        if (res.status === 403) {
          setError(
            data.detail === "premium_required"
              ? "An active subscription that includes ECG is required to view these questions."
              : "Your plan or pathway does not include this ECG surface.",
          );
          return;
        }
        if (!res.ok || !data.ok) {
          setError(
            data.detail === "disabled"
              ? "ECG questions are not enabled in this environment yet."
              : "Unable to reach the ECG question service. Try again shortly.",
          );
          return;
        }
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError("Unable to reach the ECG question service. Try again shortly.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [kind, level, mode]);

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG items…</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]">{error}</p>;
  if (items.length === 0) {
    return <p className="text-sm text-[var(--semantic-text-secondary)]">No ECG items are published for this mode yet.</p>;
  }

  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;
  const percentCorrect = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;
  const wrongItems = items.filter((item) => results[item.id] && !results[item.id]!.isCorrect);

  async function submitAnswer(item: EcgQuestion, optionId: string) {
    if (submittingId) return;
    setSubmittingId(item.id);
    try {
      const attemptMode = kind === "video-drills" ? "practice" : "quiz";
      const res = await fetch(`/api/modules/ecg/questions/${encodeURIComponent(item.id)}/answer`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedOptionId: optionId, attemptMode }),
      });
      const data = (await res.json()) as { ok?: boolean; result?: AnswerResult };
      if (!res.ok || !data.ok || !data.result) throw new Error("answer_failed");
      setResults((prev) => ({ ...prev, [item.id]: data.result! }));
    } catch {
      setError("Unable to grade this ECG question right now. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Quiz score summary */}
      {kind === "quizzes" && answeredCount > 0 ? (
        <div className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {percentCorrect === null ? "Answer questions to see your score." : `${percentCorrect}% correct (${correctCount}/${answeredCount})`}
          </p>
          {wrongItems.length > 0 ? (
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
              Incorrect: {wrongItems.map((i) => i.rhythmTag).join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Guided mode notice for basic lessons */}
      {level === "basic" && kind === "lessons" ? (
        <div className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3">
          <p className="text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]">
            Guided interpretation mode active
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">
            Each question begins with a 7-step analysis scaffold. Work through it before selecting your answer — this builds the systematic habit that prevents misdiagnosis on NCLEX and at the bedside. You can skip the scaffold at any time.
          </p>
        </div>
      ) : null}

      <ul className="grid gap-6">
        {items.map((item) => (
          <EcgQuestionCard
            key={item.id}
            item={item}
            kind={kind}
            level={level}
            onSubmit={submitAnswer}
            result={results[item.id]}
            submitting={submittingId === item.id}
          />
        ))}
      </ul>
    </div>
  );
}

// ─── EcgWorksheetList ────────────────────────────────────────────────────────

export function EcgWorksheetList({ level }: { level: EcgLevel }) {
  const [items, setItems] = useState<EcgWorksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/modules/ecg/worksheets?level=${encodeURIComponent(level)}`, {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (res) => {
        let data: { ok?: boolean; items?: EcgWorksheet[]; detail?: string } = {};
        try {
          data = (await res.json()) as typeof data;
        } catch {
          if (!controller.signal.aborted) setError("We could not read the ECG worksheet response. Try again shortly.");
          return;
        }
        if (controller.signal.aborted) return;
        if (res.status === 401) { setError("Sign in to load ECG worksheets."); return; }
        if (res.status === 403) {
          setError(
            data.detail === "premium_required"
              ? "An active subscription that includes ECG is required to view these worksheets."
              : "Your plan or pathway does not include this ECG surface.",
          );
          return;
        }
        if (!res.ok || !data.ok) {
          setError(
            data.detail === "disabled"
              ? "ECG worksheets are not enabled in this environment yet."
              : "Unable to reach the ECG worksheet service. Try again shortly.",
          );
          return;
        }
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError("Unable to reach the ECG worksheet service. Try again shortly.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [level]);

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG worksheets…</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]">{error}</p>;
  if (items.length === 0) return <p className="text-sm text-[var(--semantic-text-secondary)]">No ECG worksheets are published yet.</p>;

  async function downloadWorksheet(item: EcgWorksheet) {
    if (!item.downloadUrl) return;
    setDownloadingId(item.id);
    try {
      const res = await fetch(item.downloadUrl, { method: "POST", credentials: "same-origin" });
      if (!res.ok) throw new Error("download_failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${item.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "ecg-worksheet"}.pdf`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Unable to download this ECG worksheet right now.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <div className={item.previewBlurred ? "pointer-events-none select-none blur-[2px]" : ""}>
            <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{item.title}</h2>
            {item.description ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {item.description}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.downloadUrl ? (
              <button
                type="button"
                onClick={() => void downloadWorksheet(item)}
                disabled={downloadingId === item.id}
                className="nn-btn-primary inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold"
              >
                {downloadingId === item.id ? "Downloading…" : "Download PDF"}
              </button>
            ) : (
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)]">
                {item.accessState === "admin_preview" ? "Admin preview" : "Unlock worksheet"}
              </span>
            )}
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {item.accessState === "admin_preview"
                ? "Download remains hidden until launch."
                : item.accessState === "locked"
                  ? "Free preview"
                  : "Unlocked"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
