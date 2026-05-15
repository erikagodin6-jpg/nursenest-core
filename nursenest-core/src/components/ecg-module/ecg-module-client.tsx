"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { EcgLevel, EcgMode, EcgRouteKind } from "@/lib/ecg-module/ecg-module-config";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { isEcgLiveStripMediaConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";
import { ECG_LIVE_STRIP_MEDIA_TYPE } from "@/lib/ecg-video-quiz/ecg-video-question";
import { EcgInterpretationScaffold } from "@/components/ecg-module/ecg-interpretation-scaffold";
import {
  getEcgCurriculumUnitByRhythmTag,
  type EcgCurriculumUnit,
} from "@/lib/ecg-module/ecg-curriculum-content";
import {
  trackEcgQuestionAnswered,
  trackEcgLessonCardExpanded,
  trackEcgLessonCardSectionOpened,
  trackEcgRationaleViewed,
  trackEcgAnswerApiFailed,
  trackEcgCurriculumUnitMissing,
  trackEcgLevelStarted,
} from "@/lib/ecg-module/ecg-telemetry";
import {
  resolveEcgCurriculumUnitIdForTag,
  getEcgRhythmTagEntry,
} from "@/lib/ecg-module/ecg-rhythm-tag-registry";

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

type QuestionPhase = "scaffold" | "answering" | "submitted";

/** Scroll into view respecting prefers-reduced-motion. */
function scrollIntoViewAccessible(el: HTMLElement | null, block: ScrollLogicalPosition = "nearest") {
  if (!el) return;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: prefersReduced ? "instant" : "smooth", block });
}

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
      onLoadedMetadata={(e) => {
        if (slow) e.currentTarget.playbackRate = 0.75;
      }}
    >
      <source src={source} />
    </video>
  );
}

// ─── LessonSection ───────────────────────────────────────────────────────────

function LessonSection({
  title,
  body,
  defaultOpen = false,
  onOpen,
}: {
  title: string;
  body: string;
  defaultOpen?: boolean;
  onOpen?: (title: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && onOpen) onOpen(title);
  }

  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
        onClick={handleToggle}
        aria-expanded={open}
      >
        <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </button>
      {open ? (
        <div className="border-t border-[var(--semantic-border-soft)] px-3 pb-3 pt-2">
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
        </div>
      ) : null}
    </div>
  );
}

// ─── CurriculumLessonCard ─────────────────────────────────────────────────────

function CurriculumLessonCard({
  rhythmTag,
  level,
  mode,
  questionId,
  isCorrect,
}: {
  rhythmTag: string;
  level: string;
  mode: string;
  questionId: string;
  isCorrect: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Use registry to resolve unit (handles fallback/excluded tags)
  const registryEntry = getEcgRhythmTagEntry(rhythmTag);
  const resolvedUnitId = resolveEcgCurriculumUnitIdForTag(rhythmTag);
  const unit: EcgCurriculumUnit | undefined = resolvedUnitId
    ? getEcgCurriculumUnitByRhythmTag(rhythmTag) ??
      (resolvedUnitId !== rhythmTag ? getEcgCurriculumUnitByRhythmTag(resolvedUnitId) : undefined)
    : undefined;

  const base = { rhythm_tag: rhythmTag, level, mode, question_id: questionId, is_correct: isCorrect };

  // Graceful fallback for unknown tags (not in registry at all)
  if (!registryEntry) {
    // Fire observability event — this should not happen in production if seeding is correct
    useEffect(() => {
      trackEcgCurriculumUnitMissing(
        { rhythm_tag: rhythmTag, level, mode, question_id: questionId },
        { lookupType: "rhythmTag" },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rhythmTag]);

    return (
      <div
        className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_05%,var(--semantic-surface))] px-4 py-3"
        data-testid="curriculum-lesson-card-missing"
        role="note"
        aria-label="Curriculum lesson unavailable"
      >
        <p className="text-xs font-semibold text-[var(--semantic-text-muted)]">
          Rhythm lesson not yet available
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">
          Deep teaching content for <span className="font-medium">{rhythmTag}</span> is being developed.
          Review the rationale above and explore related rhythms in the ECG Foundations hub.
        </p>
      </div>
    );
  }

  // Fallback/excluded tags: show a contextual redirect, not a blank state
  if (!unit && registryEntry.fallbackUnitId) {
    const fallbackUnit = getEcgCurriculumUnitByRhythmTag(registryEntry.fallbackUnitId);
    return (
      <div
        className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] px-4 py-3"
        data-testid="curriculum-lesson-card-fallback"
        role="note"
        aria-label="Related curriculum content"
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Related lesson
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          {registryEntry.coverageNote ??
            `A dedicated lesson for "${rhythmTag}" is in development. Study the related "${fallbackUnit?.title ?? registryEntry.fallbackUnitId}" topic for clinical context.`}
        </p>
      </div>
    );
  }

  if (!unit) return null;

  function handleExpand() {
    const next = !open;
    setOpen(next);
    if (next) trackEcgLessonCardExpanded(base);
  }

  const onSectionOpen = (title: string) => {
    trackEcgLessonCardSectionOpened(base, { sectionTitle: title });
  };

  return (
    <div
      className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_05%,var(--semantic-surface))]"
      data-testid="curriculum-lesson-card"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={handleExpand}
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
          className="space-y-2 border-t border-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-border-soft))] px-4 py-4"
          data-testid="curriculum-lesson-body"
        >
          {/* Rhythm parameters table — always visible when expanded */}
          {unit.parameters ? (
            <div className="mb-3 grid gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 sm:grid-cols-2">
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
            </div>
          ) : null}

          {/* Priority sections — expanded by default */}
          <LessonSection title="Mechanism" body={unit.mechanism} defaultOpen onOpen={onSectionOpen} />
          <LessonSection title="Nursing Priorities" body={unit.nursingPriorities.join(" · ")} defaultOpen onOpen={onSectionOpen} />

          {/* Secondary sections — collapsed by default (reduces cognitive overload) */}
          <LessonSection title="Conduction Pathway" body={unit.conductionPath} onOpen={onSectionOpen} />
          <LessonSection title="Why This Strip Looks This Way" body={unit.whyStripLooksThisWay} onOpen={onSectionOpen} />
          <LessonSection title="Clinical Implications" body={unit.clinicalImplications} onOpen={onSectionOpen} />
          <LessonSection title="Hemodynamic Consequences" body={unit.hemodynamics} onOpen={onSectionOpen} />

          {/* NCLEX Traps — visually distinct */}
          {unit.nclexTraps.length > 0 ? (
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))]">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                onClick={() => onSectionOpen("NCLEX Traps")}
                aria-label="NCLEX Traps section"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-warning)_80%,var(--semantic-text-primary))]">
                  NCLEX Traps ({unit.nclexTraps.length})
                </span>
              </button>
              <ul className="border-t border-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-border-soft))] space-y-1.5 px-3 pb-3 pt-2">
                {unit.nclexTraps.map((trap, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] px-3 py-2 text-xs"
                  >
                    <span className="mt-px shrink-0 text-[var(--semantic-warning)]">⚠</span>
                    <span className="leading-relaxed text-[var(--semantic-text-primary)]">{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Recognition pearls */}
          {unit.recognitionPearls.length > 0 ? (
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-border-soft))] px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))]">
                Recognition Pearls
              </p>
              <ul className="mt-1.5 space-y-1">
                {unit.recognitionPearls.map((pearl, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <span className="shrink-0 text-[var(--semantic-success)]">◆</span>
                    <span className="leading-relaxed text-[var(--semantic-text-secondary)]">{pearl}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Differential teaching */}
          {unit.notThisBecause && unit.notThisBecause.length > 0 ? (
            <div className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Why Not the Other Options
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {unit.notThisBecause.map((item, i) => (
                  <li key={i} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-xs">
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

// ─── EcgQuestionCard ─────────────────────────────────────────────────────────

function EcgQuestionCard({
  item,
  kind,
  level,
  onSubmit,
  result,
  submitting,
  submitError,
  onRetry,
}: {
  item: EcgQuestion;
  kind: EcgRouteKind;
  level: EcgLevel;
  onSubmit: (item: EcgQuestion, optionId: string) => Promise<void>;
  result: AnswerResult | undefined;
  submitting: boolean;
  submitError: string | null;
  onRetry: (item: EcgQuestion) => void;
}) {
  const isGuidedLessonMode = level === "basic" && kind === "lessons";
  const isDrillMode = kind === "video-drills";

  const initialPhase: QuestionPhase = isDrillMode
    ? "answering"
    : isGuidedLessonMode
      ? "scaffold"
      : "answering";

  const [phase, setPhase] = useState<QuestionPhase>(initialPhase);
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  // Track scaffold state for analytics
  const scaffoldStartedAt = useRef<number | null>(null);
  const scaffoldStepsCompleted = useRef<number>(0);
  const scaffoldWasCompleted = useRef(false);
  const scaffoldWasSkipped = useRef(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const isSubmitted = Boolean(result);
  const isCorrect = result?.isCorrect ?? false;
  const correctOptionLabel =
    item.options.find((o) => o.id === result?.correctAnswerId)?.text ?? result?.correctAnswerId ?? "";
  const selectedOptionLabel =
    item.options.find((o) => o.id === result?.selectedOptionId)?.text ?? "";

  // Emit level_started telemetry once on mount
  useEffect(() => {
    if (kind === "lessons" || kind === "quizzes") {
      trackEcgLevelStarted({ level, mode: kind });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scaffold mount — record start time
  useEffect(() => {
    if (phase === "scaffold") {
      scaffoldStartedAt.current = Date.now();
    }
  }, [phase]);

  function handleScaffoldComplete() {
    const elapsed = scaffoldStartedAt.current ? Date.now() - scaffoldStartedAt.current : 0;
    scaffoldWasCompleted.current = true;
    setPhase("answering");
    // Focus the question heading so screen readers announce it
    requestAnimationFrame(() => questionRef.current?.focus());
  }

  function handleScaffoldSkipped() {
    scaffoldWasSkipped.current = true;
    setPhase("answering");
    requestAnimationFrame(() => questionRef.current?.focus());
  }

  async function handleOptionClick(optionId: string) {
    if (isSubmitted || submitting) return;
    if (isDrillMode) {
      await onSubmit(item, optionId);
      return;
    }
    setPendingOptionId(optionId);
  }

  async function handleSubmit() {
    if (!pendingOptionId || isSubmitted || submitting) return;
    await onSubmit(item, pendingOptionId);
    setPhase("submitted");
    // Scroll result into view — respects prefers-reduced-motion
    setTimeout(() => scrollIntoViewAccessible(resultRef.current), 150);
    // Move focus to result for screen readers
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  // Announce result via live region when result arrives
  useEffect(() => {
    if (!result || !liveRegionRef.current) return;
    liveRegionRef.current.textContent = result.isCorrect
      ? `Correct. The rhythm is ${result.correctRhythm}.`
      : `Incorrect. You selected ${selectedOptionLabel}. The correct answer is ${correctOptionLabel}.`;
  }, [result, correctOptionLabel, selectedOptionLabel]);

  return (
    <li
      className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5"
      data-testid="ecg-question-card"
    >
      {/* Screen-reader live region — announces grading result without scroll */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="ecg-result-live-region"
      />

      {item.clinicalPriority ? (
        <p className="mb-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))]">
          Clinical priority: {item.clinicalPriority}
        </p>
      ) : null}

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

      {/* Scaffold — only in guided lesson mode, before submission */}
      {phase === "scaffold" && !isSubmitted ? (
        <div className="mt-4">
          <EcgInterpretationScaffold
            onComplete={handleScaffoldComplete}
            onSkip={handleScaffoldSkipped}
            questionId={item.id}
            rhythmTag={item.rhythmTag}
            level={level}
            mode={kind}
          />
        </div>
      ) : null}

      {/* Question + options (visible after scaffold or in non-guided modes) */}
      {(phase === "answering" || phase === "submitted" || isDrillMode) ? (
        <div className="mt-4 space-y-3">
          {/* tabIndex={-1} allows programmatic focus for focus management */}
          <h2
            ref={questionRef}
            tabIndex={-1}
            className="text-sm font-semibold leading-snug text-[var(--semantic-text-primary)] outline-none sm:text-base"
          >
            {item.questionText}
          </h2>

          {item.options.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Answer options">
              {item.options.map((option) => {
                const isPending = pendingOptionId === option.id;
                const isSelected = result?.selectedOptionId === option.id;
                const isCorrectOption = result?.correctAnswerId === option.id;

                let cls = "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition";
                if (isSubmitted) {
                  if (isCorrectOption) {
                    cls += " border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
                  } else if (isSelected) {
                    cls += " border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] text-[var(--semantic-text-secondary)] opacity-80";
                  } else {
                    cls += " border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] opacity-50";
                  }
                } else if (isPending) {
                  cls += " border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] text-[var(--semantic-text-primary)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]";
                } else {
                  cls += " border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]";
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
                        <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
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

          {!isSubmitted && !isDrillMode && !pendingOptionId ? (
            <p className="text-[11px] text-[var(--semantic-text-muted)]">
              Select an answer above, then click Submit.
            </p>
          ) : null}

          {/* Submission API error with retry */}
          {submitError && !isSubmitted ? (
            <div
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] px-4 py-3"
              role="alert"
            >
              <p className="text-xs text-[var(--semantic-danger)]">{submitError}</p>
              <button
                type="button"
                onClick={() => onRetry(item)}
                className="text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Post-submission result area */}
      {isSubmitted ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          className="mt-4 space-y-3 outline-none"
          data-testid="ecg-result-area"
        >
          {/* Result banner */}
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
              isCorrect
                ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))]"
                : "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))]"
            }`}
            data-testid="ecg-result-banner"
            role="status"
            aria-label={isCorrect ? "Correct answer" : "Incorrect answer"}
          >
            <span className="mt-0.5 text-lg leading-none" aria-hidden>{isCorrect ? "✓" : "✗"}</span>
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

          {/* Rationale */}
          {kind !== "video-drills" && result?.rationale ? (
            <RationaleSection
              rationale={result.rationale}
              onView={() =>
                trackEcgRationaleViewed({
                  rhythm_tag: item.rhythmTag,
                  level,
                  mode: kind,
                  question_id: item.id,
                  is_correct: isCorrect,
                })
              }
            />
          ) : null}

          {/* Deep curriculum lesson card */}
          {kind !== "video-drills" ? (
            <CurriculumLessonCard
              rhythmTag={item.rhythmTag}
              level={level}
              mode={kind}
              questionId={item.id}
              isCorrect={isCorrect}
            />
          ) : null}

          {/* Scaffold review (guided lesson mode only) — fixed condition: phase === "submitted" */}
          {isGuidedLessonMode && phase === "submitted" ? (
            <EcgInterpretationScaffold
              reviewMode
              questionId={item.id}
              rhythmTag={item.rhythmTag}
              level={level}
              mode={kind}
            />
          ) : null}

          {/* Performance stats */}
          <div className="text-xs text-[var(--semantic-text-muted)]">
            {result?.percentCorrect == null
              ? "Not enough attempts yet to show class statistics."
              : `${result.percentCorrect}% of learners answered this correctly`}
            {result?.commonWrongAnswers.length ? (
              <span> · Most common wrong: {result.commonWrongAnswers.join(", ")}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {!isSubmitted && item.percentCorrect != null ? (
        <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
          {item.percentCorrect}% of learners answered this correctly
        </p>
      ) : null}
    </li>
  );
}

/** Rationale section — fires telemetry on first render (learner has seen it). */
function RationaleSection({ rationale, onView }: { rationale: string; onView: () => void }) {
  useEffect(() => {
    onView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3"
      data-testid="ecg-rationale-section"
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        Rationale
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        {rationale}
      </p>
    </div>
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
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});
  const [pendingRetry, setPendingRetry] = useState<string | null>(null);
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
        try { data = (await res.json()) as typeof data; } catch { /* ignore */ }
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

  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;
  const percentCorrect = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;

  async function submitAnswer(item: EcgQuestion, optionId: string) {
    if (submittingId) return;
    setSubmittingId(item.id);
    setSubmitErrors((prev) => { const next = { ...prev }; delete next[item.id]; return next; });
    try {
      const attemptMode = kind === "video-drills" ? "practice" : "quiz";
      const res = await fetch(`/api/modules/ecg/questions/${encodeURIComponent(item.id)}/answer`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedOptionId: optionId, attemptMode }),
      });
      const data = (await res.json()) as { ok?: boolean; result?: AnswerResult };
      if (!res.ok || !data.ok || !data.result) throw Object.assign(new Error("answer_failed"), { httpStatus: res.status });
      setResults((prev) => ({ ...prev, [item.id]: data.result! }));
      // Telemetry: answer submitted
      trackEcgQuestionAnswered(
        {
          rhythm_tag: item.rhythmTag,
          level,
          mode: kind,
          question_id: item.id,
          is_correct: data.result.isCorrect,
        },
        { scaffoldWasCompleted: false, scaffoldWasSkipped: false },
      );
    } catch (err) {
      const httpStatus = (err as { httpStatus?: number }).httpStatus;
      // Telemetry: API failure observable
      trackEcgAnswerApiFailed(
        { rhythm_tag: item.rhythmTag, level, mode: kind, question_id: item.id },
        { httpStatus, errorCode: "answer_api_error" },
      );
      setSubmitErrors((prev) => ({
        ...prev,
        [item.id]: "Could not grade your answer. Check your connection and try again.",
      }));
    } finally {
      setSubmittingId(null);
    }
  }

  function handleRetry(item: EcgQuestion) {
    setPendingRetry(item.id);
    // Clear the error so the submit button re-appears
    setSubmitErrors((prev) => { const next = { ...prev }; delete next[item.id]; return next; });
    setTimeout(() => setPendingRetry(null), 100);
  }

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG items…</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]" role="alert">{error}</p>;
  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-6 text-center"
        role="status"
      >
        <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">
          No ECG items are published for this mode yet.
        </p>
        <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
          Check back soon — content is actively being added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kind === "quizzes" && answeredCount > 0 ? (
        <div className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {percentCorrect === null
              ? "Answer questions to see your score."
              : `${percentCorrect}% correct (${correctCount}/${answeredCount})`}
          </p>
        </div>
      ) : null}

      {level === "basic" && kind === "lessons" ? (
        <div className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3">
          <p className="text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]">
            Guided interpretation mode active
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">
            Each question starts with a 7-step analysis scaffold. Work through it before selecting your answer. You can skip at any time.
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
            submitError={submitErrors[item.id] ?? null}
            onRetry={handleRetry}
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
        try { data = (await res.json()) as typeof data; } catch { /* ignore */ }
        if (controller.signal.aborted) return;
        if (res.status === 401) { setError("Sign in to load ECG worksheets."); return; }
        if (res.status === 403) {
          setError(data.detail === "premium_required"
            ? "An active subscription that includes ECG is required to view these worksheets."
            : "Your plan or pathway does not include this ECG surface.");
          return;
        }
        if (!res.ok || !data.ok) {
          setError(data.detail === "disabled"
            ? "ECG worksheets are not enabled in this environment yet."
            : "Unable to reach the ECG worksheet service. Try again shortly.");
          return;
        }
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError("Unable to reach the ECG worksheet service.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [level]);

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG worksheets…</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]" role="alert">{error}</p>;
  if (items.length === 0) return (
    <p className="text-sm text-[var(--semantic-text-secondary)]">No ECG worksheets are published yet.</p>
  );

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
          </div>
        </li>
      ))}
    </ul>
  );
}
