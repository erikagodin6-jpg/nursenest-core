"use client";

/**
 * TrialOnboardingFlow — 4-step onboarding wizard.
 *
 * Steps:
 *   1. Exam goal (RN / PN / NP / Allied) — PN row copy is country-specific via {@link examGoalRowsForCountry}.
 *   2. Exam timeline (date picker or "not scheduled")
 *   3. Study style preference (structured plan / questions / weak areas)
 *   4. CTA — "Your Study Plan is Ready"
 *
 * The flow saves preferences to the server, marks onboarding complete,
 * and guides the user to either start a trial or explore limited access.
 *
 * Design: premium, calm, theme-aware. Soft surfaces with progress indicators.
 * No aggressive copy. Each step is short and focused.
 */

import Link from "next/link";
import { useState, useCallback, useEffect, useMemo } from "react";
import { CheckCircle2, BookOpen, Target, Brain, Calendar, ArrowRight } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { examGoalRowsForCountry, normalizeOnboardingCountry } from "@/lib/onboarding/exam-goal-rows-for-country";

// ── Types ──────────────────────────────────────────────────────────────────

type ExamGoal = "rn" | "rpn" | "np" | "allied" | null;
type StudyStyle = "structured" | "questions" | "weak_areas" | null;

interface OnboardingState {
  examGoal: ExamGoal;
  examDate: string | null;
  examDateNotScheduled: boolean;
  studyStyle: StudyStyle;
}

// ── Step config ────────────────────────────────────────────────────────────

const STUDY_STYLE_OPTIONS: { id: StudyStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "structured",
    label: "I want a structured plan",
    description: "A day-by-day study plan based on your readiness",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "questions",
    label: "I want to practice questions",
    description: "Jump into practice and see your weak areas",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: "weak_areas",
    label: "I need help with weak areas",
    description: "Focus on what you're getting wrong",
    icon: <Brain className="h-5 w-5" />,
  },
];

function formatOnboardingDateSummary(examDate: string | null, notScheduled: boolean): string {
  if (notScheduled) return "No exam date yet";
  if (!examDate) return "Date not set";
  const parsed = new Date(`${examDate}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? examDate
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(parsed);
}

// ── Component ──────────────────────────────────────────────────────────────

export function TrialOnboardingFlow({
  userId,
  accountCountry,
  onComplete,
}: {
  userId: string;
  /** Prisma `User.country` at page load (ISO-2). Used only for PN/RPN exam-goal copy. */
  accountCountry?: string | null;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({
    examGoal: null,
    examDate: null,
    examDateNotScheduled: false,
    studyStyle: null,
  });
  const [saving, setSaving] = useState(false);

  const examGoalRows = useMemo(
    () => examGoalRowsForCountry(normalizeOnboardingCountry(accountCountry)),
    [accountCountry],
  );

  useEffect(() => {
    trackClientEvent("onboarding_started", { user_id: userId });
  }, [userId]);

  const totalSteps = 4;
  const progressPct = ((step + 1) / totalSteps) * 100;
  const selectedExamGoal = useMemo(
    () => examGoalRows.find((row) => row.id === state.examGoal) ?? null,
    [examGoalRows, state.examGoal],
  );
  const selectedStudyStyle = useMemo(
    () => STUDY_STYLE_OPTIONS.find((option) => option.id === state.studyStyle) ?? null,
    [state.studyStyle],
  );
  const dateSummary = useMemo(
    () => formatOnboardingDateSummary(state.examDate, state.examDateNotScheduled),
    [state.examDate, state.examDateNotScheduled],
  );

  const canAdvance = useCallback((): boolean => {
    switch (step) {
      case 0:
        return state.examGoal !== null;
      case 1:
        return state.examDate !== null || state.examDateNotScheduled;
      case 2:
        return true;
      default:
        return true;
    }
  }, [step, state]);

  function goNext() {
    if (step < totalSteps - 1 && canAdvance()) {
      trackClientEvent("onboarding_step_completed", {
        step: step + 1,
        step_name: ["exam_goal", "timeline", "study_style", "cta"][step] ?? "",
      });
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function submitOnboarding(payload: {
    examGoal: string | null;
    examDate: string | null;
    studyStyle: string | null;
  }): Promise<boolean> {
    const res = await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      logDedupedClientDiagnostic("onboarding", "complete_http_error", String(res.status), {
        httpStatus: res.status,
      });
    }
    return res.ok;
  }

  /** Skip timeline & study-style — save exam goal with sensible defaults and go straight to study. */
  async function completeFast() {
    if (!state.examGoal) return;
    setSaving(true);
    try {
      const ok = await submitOnboarding({
        examGoal: state.examGoal,
        examDate: null,
        studyStyle: "questions",
      });
      if (ok) {
        trackClientEvent("onboarding_completed", {
          exam_goal: state.examGoal,
          has_exam_date: false,
          study_style: "questions",
          fast_path: true,
        });
        onComplete?.();
      }
    } catch {
      logDedupedClientDiagnostic("onboarding", "complete_request_exception", "fast_path", {});
      /* stay on step; user can retry */
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding() {
    setSaving(true);
    try {
      const ok = await submitOnboarding({
        examGoal: state.examGoal,
        examDate: state.examDateNotScheduled ? null : state.examDate,
        studyStyle: state.studyStyle,
      });
      if (ok) {
        trackClientEvent("onboarding_completed", {
          exam_goal: state.examGoal ?? "none",
          has_exam_date: Boolean(state.examDate),
          study_style: state.studyStyle ?? "none",
        });
        onComplete?.();
      }
    } catch {
      logDedupedClientDiagnostic("onboarding", "complete_request_exception", "wizard", {});
      /* stay on step */
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg px-1 sm:px-0">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full"
          style={{ background: "var(--semantic-panel-muted)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              background: "var(--theme-primary)",
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="nn-onboarding-step">
        {step === 0 && (
          <StepExamGoal
            options={examGoalRows}
            value={state.examGoal}
            onChange={(v) => setState((s) => ({ ...s, examGoal: v }))}
          />
        )}
        {step === 1 && (
          <StepTimeline
            examDate={state.examDate}
            notScheduled={state.examDateNotScheduled}
            onDateChange={(d) => setState((s) => ({ ...s, examDate: d, examDateNotScheduled: false }))}
            onNotScheduled={() => setState((s) => ({ ...s, examDate: null, examDateNotScheduled: true }))}
          />
        )}
        {step === 2 && (
          <StepStudyStyle
            value={state.studyStyle}
            onChange={(v) => setState((s) => ({ ...s, studyStyle: v }))}
          />
        )}
        {step === 3 && (
          <StepCta
            examGoalLabel={selectedExamGoal?.label ?? "Your selected pathway"}
            timelineSummary={dateSummary}
            studyStyleLabel={selectedStudyStyle?.label ?? "Flexible study start"}
            saving={saving}
            onStartTrial={completeOnboarding}
            onExplore={() => {
              trackClientEvent("onboarding_skipped_to_explore", {});
              completeOnboarding();
            }}
          />
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="mt-8 flex flex-col gap-3">
          {step === 0 && state.examGoal ? (
            <button
              type="button"
              data-testid="onboarding-start-studying-now"
              onClick={() => void completeFast()}
              disabled={saving}
              className="nn-btn-primary inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-none disabled:opacity-50"
            >
              {saving ? "Saving…" : "Start studying now"}
            </button>
          ) : null}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:invisible"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance() || saving}
              className="nn-btn-primary inline-flex min-h-[2.5rem] items-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {step === 0 && state.examGoal ? (
            <p className="text-center text-xs text-muted-foreground">
              Or continue to add your exam date and study preferences.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── Step 1: Exam Goal ─────────────────────────────────────────────────────

function StepExamGoal({
  options,
  value,
  onChange,
}: {
  options: { id: ExamGoal; label: string; description: string }[];
  value: ExamGoal;
  onChange: (v: ExamGoal) => void;
}) {
  return (
    <>
      <h2 className="nn-onboarding-step__title">Which exam are you preparing for?</h2>
      <p className="nn-onboarding-step__subtitle">
        We'll tailor your study experience to your specific exam.
      </p>
      <div className="mt-6 grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-testid={opt.id ? `onboarding-exam-goal-${opt.id}` : undefined}
            onClick={() => onChange(opt.id)}
            className={`nn-onboarding-option ${value === opt.id ? "nn-onboarding-option--selected" : ""}`}
          >
            <div className="flex min-w-0 items-start gap-3">
              {value === opt.id && (
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "var(--semantic-success)" }}
                />
              )}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-wrap break-words font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-wrap break-words text-sm leading-snug" style={{ color: "var(--semantic-text-muted)" }}>
                  {opt.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ── Step 2: Timeline ──────────────────────────────────────────────────────

function StepTimeline({
  examDate,
  notScheduled,
  onDateChange,
  onNotScheduled,
}: {
  examDate: string | null;
  notScheduled: boolean;
  onDateChange: (d: string) => void;
  onNotScheduled: () => void;
}) {
  const today = new Date().toISOString().split("T")[0] ?? "";

  return (
    <>
      <h2 className="nn-onboarding-step__title">When is your exam?</h2>
      <p className="nn-onboarding-step__subtitle">
        We'll help you build a study plan that fits your timeline.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium" style={{ color: "var(--semantic-text-secondary)" }}>
            <Calendar className="mb-1 inline h-4 w-4" style={{ color: "var(--semantic-info)" }} /> Exam date
          </label>
          <input
            type="date"
            value={examDate ?? ""}
            min={today}
            onChange={(e) => onDateChange(e.target.value)}
            className="nn-onboarding-date-input"
          />
        </div>
        <button
          type="button"
          onClick={onNotScheduled}
          className={`nn-onboarding-option ${notScheduled ? "nn-onboarding-option--selected" : ""}`}
        >
          <div className="flex min-w-0 items-start gap-3">
            {notScheduled && (
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: "var(--semantic-success)" }}
              />
            )}
            <div className="min-w-0 flex-1 text-left">
              <p className="text-wrap break-words font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                Not scheduled yet
              </p>
              <p className="mt-0.5 text-wrap break-words text-sm leading-snug" style={{ color: "var(--semantic-text-muted)" }}>
                I'm studying ahead — I'll set a date later
              </p>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

// ── Step 3: Study Style ───────────────────────────────────────────────────

function StepStudyStyle({
  value,
  onChange,
}: {
  value: StudyStyle;
  onChange: (v: StudyStyle) => void;
}) {
  return (
    <>
      <h2 className="nn-onboarding-step__title">How do you want to study?</h2>
      <p className="nn-onboarding-step__subtitle">
        Pick what feels right — you can change this anytime.
      </p>
      <div className="mt-6 grid gap-3">
        {STUDY_STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`nn-onboarding-option ${value === opt.id ? "nn-onboarding-option--selected" : ""}`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: value === opt.id
                    ? "color-mix(in srgb, var(--theme-primary) 12%, var(--semantic-surface))"
                    : "var(--semantic-panel-muted)",
                  color: value === opt.id ? "var(--theme-primary)" : "var(--semantic-text-muted)",
                }}
              >
                {opt.icon}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-wrap break-words font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-wrap break-words text-sm leading-snug" style={{ color: "var(--semantic-text-muted)" }}>
                  {opt.description}
                </p>
              </div>
              {value === opt.id && (
                <CheckCircle2
                  className="ml-auto mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "var(--semantic-success)" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ── Step 4: CTA ───────────────────────────────────────────────────────────

function StepCta({
  examGoalLabel,
  timelineSummary,
  studyStyleLabel,
  saving,
  onStartTrial,
  onExplore,
}: {
  examGoalLabel: string;
  timelineSummary: string;
  studyStyleLabel: string;
  saving: boolean;
  onStartTrial: () => void;
  onExplore: () => void;
}) {
  return (
    <div className="text-center">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
        }}
      >
        <CheckCircle2 className="h-8 w-8" style={{ color: "var(--semantic-success)" }} />
      </div>

      <h2 className="nn-onboarding-step__title">Your study start is ready</h2>
      <p className="nn-onboarding-step__subtitle">
        We saved your starting preferences so your dashboard can point you to the clearest next step.
      </p>

      <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
        {[
          { label: "Pathway", value: examGoalLabel },
          { label: "Timeline", value: timelineSummary },
          { label: "Starting mode", value: studyStyleLabel },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border px-4 py-3"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
              background: "color-mix(in srgb, var(--semantic-panel-cool) 12%, var(--semantic-surface))",
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--semantic-text-muted)" }}>
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex w-full min-w-0 flex-col items-stretch gap-3 sm:items-center">
        <button
          type="button"
          disabled={saving}
          onClick={onStartTrial}
          className="nn-btn-primary inline-flex min-h-[3rem] w-full min-w-0 max-w-md items-center justify-center rounded-xl px-6 text-base font-semibold shadow-none disabled:opacity-50 sm:max-w-sm"
        >
          {saving ? "Setting up…" : "Continue to my study hub"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onExplore}
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Save and explore limited access
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Full bank and lessons may require an active plan — you will see what is included before you pay.
      </p>
    </div>
  );
}
