"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  Calculator,
  Calendar,
  CheckCircle2,
  HeartPulse,
  LineChart,
  Sparkles,
  Stethoscope,
  Target,
  Waves,
} from "lucide-react";
import { FeaturePreviewVisual } from "@/components/discovery/feature-preview-visual";
import {
  recommendedFlagshipExperiences,
  type FlagshipExperience,
} from "@/lib/discovery/flagship-experiences";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { examGoalRowsForCountry, normalizeOnboardingCountry } from "@/lib/onboarding/exam-goal-rows-for-country";

type ExamGoal = "rn" | "rpn" | "np" | "pre_nursing" | "allied" | null;
type StudyStyle = "structured" | "questions" | "weak_areas" | null;
type LearnerStage = "early_student" | "senior_student" | "new_grad" | "experienced" | null;
type WeakArea = "telemetry" | "prioritization" | "pharmacology" | "labs" | "skills" | "med_math";

interface OnboardingState {
  examGoal: ExamGoal;
  examDate: string | null;
  examDateNotScheduled: boolean;
  learnerStage: LearnerStage;
  weakAreas: WeakArea[];
  telemetryConfidence: number;
  prioritizationConfidence: number;
  medSafetyConfidence: number;
  studyStyle: StudyStyle;
}

const STAGE_OPTIONS: { id: LearnerStage; label: string; description: string }[] = [
  { id: "early_student", label: "Early nursing student", description: "I want guided fundamentals and confidence-building practice." },
  { id: "senior_student", label: "Senior student / final prep", description: "I need exam-ready clinical judgment and weak-area repair." },
  { id: "new_grad", label: "New graduate", description: "I want bedside readiness, prioritization, and transition support." },
  { id: "experienced", label: "Experienced / advancing scope", description: "I want advanced interpretation, NP reasoning, or specialty growth." },
];

const WEAK_AREA_OPTIONS: { id: WeakArea; label: string; description: string; icon: ReactNode }[] = [
  { id: "telemetry", label: "ECG & telemetry", description: "Rhythms, monitor changes, and escalation timing.", icon: <Waves className="h-4 w-4" /> },
  { id: "prioritization", label: "Prioritization", description: "Who to see first, what can wait, and delegation traps.", icon: <Activity className="h-4 w-4" /> },
  { id: "pharmacology", label: "Pharmacology", description: "Medication safety, adverse effects, and nursing implications.", icon: <HeartPulse className="h-4 w-4" /> },
  { id: "labs", label: "Labs", description: "Trends, critical values, and bedside meaning.", icon: <LineChart className="h-4 w-4" /> },
  { id: "skills", label: "Clinical skills", description: "Competency steps, safety checkpoints, and documentation.", icon: <Stethoscope className="h-4 w-4" /> },
  { id: "med_math", label: "Med calculations", description: "Dose safety, conversions, and high-alert checks.", icon: <Calculator className="h-4 w-4" /> },
];

const STUDY_STYLE_OPTIONS: { id: StudyStyle; label: string; description: string; icon: ReactNode }[] = [
  {
    id: "structured",
    label: "Build a guided pathway",
    description: "Give me a sequence with lessons, skills, flashcards, and exams.",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: "questions",
    label: "Start with active practice",
    description: "Begin with questions and let NurseNest detect weak patterns.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: "weak_areas",
    label: "Repair weak areas first",
    description: "Prioritize remediation, rationales, and spaced review.",
    icon: <Brain className="h-5 w-5" />,
  },
];

const ROLE_FOCUS: Record<Exclude<ExamGoal, null>, string[]> = {
  rn: ["Telemetry and ECG reasoning", "Prioritization and delegation", "Unstable patient recognition", "Rapid-response judgment"],
  rpn: ["Foundational bedside safety", "Reassessment and escalation", "Medication safety", "Therapeutic communication"],
  np: ["Diagnostic reasoning", "Treatment planning", "Advanced interpretation", "Systems-level follow-up"],
  pre_nursing: ["Anatomy and physiology foundations", "Medical terminology", "Study confidence", "Entrance-exam readiness"],
  allied: ["Foundational healthcare reasoning", "ECG and lab awareness", "Skill confidence", "Patient-safety workflows"],
};

function toggleWeakArea(items: WeakArea[], next: WeakArea): WeakArea[] {
  return items.includes(next) ? items.filter((item) => item !== next) : [...items, next];
}

function confidenceLabel(value: number): string {
  if (value <= 2) return "Needs support";
  if (value === 3) return "Building";
  if (value === 4) return "Mostly confident";
  return "Strong";
}

function recommendedLaunch(state: OnboardingState): { href: string; label: string; description: string } {
  if (state.weakAreas.includes("telemetry")) {
    return {
      href: "/app/ecg-video-quiz?from=onboarding",
      label: "Begin ECG telemetry foundations",
      description: "Start with an interactive rhythm experience so monitor changes connect to bedside action.",
    };
  }
  if (state.weakAreas.includes("prioritization")) {
    return {
      href: "/app/prioritization-delegation?from=onboarding",
      label: "Practice prioritization under pressure",
      description: "Launch a bedside assignment simulation with unstable-patient and delegation decisions.",
    };
  }
  if (state.weakAreas.includes("med_math")) {
    return {
      href: "/app/med-calculations?from=onboarding",
      label: "Strengthen medication-safety math",
      description: "Start a focused dosage-safety drill with rationales and confidence calibration.",
    };
  }
  if (state.weakAreas.includes("skills")) {
    return {
      href: "/app/clinical-skills?from=onboarding",
      label: "Open the Clinical Skills simulation lab",
      description: "Practice role-scoped bedside competencies with safety checkpoints and retention cards.",
    };
  }
  if (state.weakAreas.includes("labs")) {
    return {
      href: "/app/labs?from=onboarding",
      label: "Start the Labs workstation",
      description: "Translate lab trends into medication holds, escalation cues, and bedside priorities.",
    };
  }
  return {
    href: "/app/quick-start?from=onboarding",
    label: "Take the adaptive readiness check",
    description: "Answer a short baseline set so NurseNest can initialize your first remediation pathway.",
  };
}

function weakTopicTitles(state: OnboardingState): string[] {
  const labels = WEAK_AREA_OPTIONS.filter((item) => state.weakAreas.includes(item.id)).map((item) => item.label);
  if (state.telemetryConfidence <= 2) labels.push("ECG telemetry rhythm confidence");
  if (state.prioritizationConfidence <= 2) labels.push("prioritization delegation unstable patient recognition");
  if (state.medSafetyConfidence <= 2) labels.push("pharmacology medication calculation safety");
  return labels;
}

export function TrialOnboardingFlow({
  userId,
  accountCountry,
  onComplete,
}: {
  userId: string;
  accountCountry?: string | null;
  onComplete?: (destination?: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    examGoal: null,
    examDate: null,
    examDateNotScheduled: false,
    learnerStage: null,
    weakAreas: [],
    telemetryConfidence: 3,
    prioritizationConfidence: 3,
    medSafetyConfidence: 3,
    studyStyle: "structured",
  });

  const examGoalRows = useMemo(
    () => examGoalRowsForCountry(normalizeOnboardingCountry(accountCountry)),
    [accountCountry],
  );
  const totalSteps = 5;
  const progressPct = ((step + 1) / totalSteps) * 100;
  const launch = recommendedLaunch(state);
  const recommendedFeatures = recommendedFlagshipExperiences({
    weakTopicTitles: weakTopicTitles(state),
    limit: 4,
  });

  useEffect(() => {
    trackClientEvent("onboarding_started", { user_id: userId, flow: "adaptive_ecosystem" });
  }, [userId]);

  const canAdvance = useCallback((): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return state.examGoal !== null && state.learnerStage !== null;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  }, [step, state.examGoal, state.learnerStage]);

  function goNext() {
    if (step < totalSteps - 1 && canAdvance()) {
      trackClientEvent("onboarding_step_completed", {
        step: step + 1,
        step_name: ["welcome", "identity", "ecosystem", "readiness", "launch"][step] ?? "",
        exam_goal: state.examGoal ?? "unset",
      });
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function submitOnboarding(destination: string): Promise<boolean> {
    const res = await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examGoal: state.examGoal,
        examDate: state.examDateNotScheduled ? null : state.examDate,
        studyStyle: state.studyStyle,
        learnerStage: state.learnerStage,
        weakAreas: state.weakAreas,
        readinessBaseline: {
          telemetry: state.telemetryConfidence,
          prioritization: state.prioritizationConfidence,
          medicationSafety: state.medSafetyConfidence,
        },
        firstActivity: destination,
      }),
    });
    if (!res.ok) {
      logDedupedClientDiagnostic("onboarding", "complete_http_error", String(res.status), { httpStatus: res.status });
    }
    return res.ok;
  }

  async function completeOnboarding(destination = launch.href) {
    setSaving(true);
    try {
      const ok = await submitOnboarding(destination);
      if (ok) {
        trackClientEvent("onboarding_completed", {
          exam_goal: state.examGoal ?? "none",
          learner_stage: state.learnerStage ?? "none",
          weak_areas: state.weakAreas.join(","),
          study_style: state.studyStyle ?? "none",
          first_activity: destination,
          flow: "adaptive_ecosystem",
        });
        onComplete?.(destination);
      }
    } catch {
      logDedupedClientDiagnostic("onboarding", "complete_request_exception", "adaptive_ecosystem", {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nn-onboarding-ecosystem mx-auto w-full min-w-0 max-w-6xl px-1 sm:px-0">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--semantic-text-muted)]">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progressPct)}% personalized</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--semantic-panel-muted)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, var(--theme-primary), var(--semantic-info))" }}
          />
        </div>
      </div>

      <section className="nn-onboarding-ecosystem__shell">
        {step === 0 ? <StepWelcome features={recommendedFeatures} /> : null}
        {step === 1 ? (
          <StepIdentity
            examOptions={examGoalRows}
            state={state}
            onExamGoal={(examGoal) => setState((s) => ({ ...s, examGoal }))}
            onStage={(learnerStage) => setState((s) => ({ ...s, learnerStage }))}
            onWeakArea={(weakArea) => setState((s) => ({ ...s, weakAreas: toggleWeakArea(s.weakAreas, weakArea) }))}
          />
        ) : null}
        {step === 2 ? <StepEcosystem selectedRole={state.examGoal} features={recommendedFeatures} /> : null}
        {step === 3 ? (
          <StepReadiness
            state={state}
            onConfidence={(key, value) => setState((s) => ({ ...s, [key]: value }))}
            onStudyStyle={(studyStyle) => setState((s) => ({ ...s, studyStyle }))}
          />
        ) : null}
        {step === 4 ? (
          <StepLaunch
            state={state}
            launch={launch}
            features={recommendedFeatures}
            saving={saving}
            onLaunch={() => void completeOnboarding(launch.href)}
            onBaseline={() => void completeOnboarding("/app/quick-start?from=onboarding")}
          />
        ) : null}
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || saving}
          className="text-sm font-semibold text-[var(--semantic-text-muted)] transition hover:text-[var(--semantic-text-primary)] disabled:invisible"
        >
          Back
        </button>
        {step < totalSteps - 1 ? (
          <button
            type="button"
            data-testid={step === 1 && state.examGoal ? "onboarding-start-studying-now" : undefined}
            onClick={goNext}
            disabled={!canAdvance() || saving}
            className="nn-btn-primary inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-none disabled:opacity-40"
          >
            {step === 0 ? "Build my learning path" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/app/explore"
            className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-panel-muted)]"
          >
            Explore all systems
          </Link>
        )}
      </div>
    </div>
  );
}

function StepHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <p className="nn-onboarding-ecosystem__eyebrow">{eyebrow}</p>
      <h2 className="nn-onboarding-ecosystem__title">{title}</h2>
      <p className="nn-onboarding-ecosystem__subtitle">{subtitle}</p>
    </div>
  );
}

function StepWelcome({ features }: { features: FlagshipExperience[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <StepHeader
          eyebrow="Adaptive clinical readiness"
          title="Train clinical judgment like a real nurse."
          subtitle="Interactive telemetry, adaptive simulations, competency labs, medication safety drills, and bedside decision-making all work together inside one intelligent learning ecosystem."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Reason", "Rationales explain why choices matter."],
            ["Simulate", "Patient conditions evolve over time."],
            ["Retain", "Weak areas become spaced review."],
          ].map(([label, copy]) => (
            <div key={label} className="nn-onboarding-ecosystem__metric">
              <strong>{label}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {features.slice(0, 3).map((feature) => (
          <FeatureCard key={feature.id} feature={feature} compact />
        ))}
      </div>
    </div>
  );
}

function StepIdentity({
  examOptions,
  state,
  onExamGoal,
  onStage,
  onWeakArea,
}: {
  examOptions: { id: ExamGoal; label: string; description: string }[];
  state: OnboardingState;
  onExamGoal: (v: ExamGoal) => void;
  onStage: (v: LearnerStage) => void;
  onWeakArea: (v: WeakArea) => void;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <div>
        <StepHeader
          eyebrow="Learner identity"
          title="Tell NurseNest what kind of clinical thinker you are becoming."
          subtitle="Your role, stage, and confidence signals shape the simulations, remediation, and first session we recommend."
        />
        {state.examGoal ? (
          <div className="mt-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">Your pathway will emphasize</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLE_FOCUS[state.examGoal].map((item) => (
                <span key={item} className="nn-onboarding-ecosystem__chip">{item}</span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="grid gap-5">
        <OptionGroup title="Choose your pathway">
          {examOptions.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={state.examGoal === opt.id}
              testId={opt.id ? `onboarding-exam-goal-${opt.id}` : undefined}
              title={opt.label}
              description={opt.description}
              onClick={() => onExamGoal(opt.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup title="Where are you right now?">
          {STAGE_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              selected={state.learnerStage === opt.id}
              title={opt.label}
              description={opt.description}
              onClick={() => onStage(opt.id)}
            />
          ))}
        </OptionGroup>
        <OptionGroup title="What should we watch closely first?">
          <div className="grid gap-3 sm:grid-cols-2">
            {WEAK_AREA_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onWeakArea(opt.id)}
                className={`nn-onboarding-ecosystem__weak ${state.weakAreas.includes(opt.id) ? "is-selected" : ""}`}
              >
                <span>{opt.icon}</span>
                <strong>{opt.label}</strong>
                <small>{opt.description}</small>
              </button>
            ))}
          </div>
        </OptionGroup>
      </div>
    </div>
  );
}

function StepEcosystem({ selectedRole, features }: { selectedRole: ExamGoal; features: FlagshipExperience[] }) {
  const roleCopy =
    selectedRole === "np"
      ? "Your pathway will surface advanced interpretation, diagnostics, treatment planning, and longitudinal follow-up."
      : selectedRole === "pre_nursing"
        ? "Your pathway will emphasize foundational science, terminology, study confidence, and readiness for nursing coursework."
      : selectedRole === "rpn"
        ? "Your pathway will emphasize foundational bedside care, reassessment, escalation recognition, communication, and medication safety."
        : "Your pathway will emphasize telemetry, prioritization, delegation, unstable patient recognition, and bedside judgment.";
  return (
    <div>
      <StepHeader
        eyebrow="Ecosystem preview"
        title="Every study surface connects back to clinical readiness."
        subtitle={roleCopy}
      />
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
}

function StepReadiness({
  state,
  onConfidence,
  onStudyStyle,
}: {
  state: OnboardingState;
  onConfidence: (key: "telemetryConfidence" | "prioritizationConfidence" | "medSafetyConfidence", value: number) => void;
  onStudyStyle: (style: StudyStyle) => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <StepHeader
          eyebrow="Readiness baseline"
          title="Set a quick confidence baseline before your first session."
          subtitle="This is not a grade. It helps NurseNest balance challenge, support, and remediation so your first study session feels focused instead of overwhelming."
        />
        <div className="mt-6 grid gap-4">
          <ConfidenceSlider label="Telemetry comfort" value={state.telemetryConfidence} onChange={(value) => onConfidence("telemetryConfidence", value)} />
          <ConfidenceSlider label="Prioritization confidence" value={state.prioritizationConfidence} onChange={(value) => onConfidence("prioritizationConfidence", value)} />
          <ConfidenceSlider label="Medication-safety confidence" value={state.medSafetyConfidence} onChange={(value) => onConfidence("medSafetyConfidence", value)} />
        </div>
      </div>
      <OptionGroup title="How should your journey continue?">
        {STUDY_STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onStudyStyle(opt.id)}
            className={`nn-onboarding-ecosystem__study-style ${state.studyStyle === opt.id ? "is-selected" : ""}`}
          >
            <span>{opt.icon}</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </OptionGroup>
    </div>
  );
}

function StepLaunch({
  state,
  launch,
  features,
  saving,
  onLaunch,
  onBaseline,
}: {
  state: OnboardingState;
  launch: { href: string; label: string; description: string };
  features: FlagshipExperience[];
  saving: boolean;
  onLaunch: () => void;
  onBaseline: () => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div>
        <StepHeader
          eyebrow="First guided session"
          title="Your first clinical progression path is ready."
          subtitle="Start with one meaningful activity now. After it, your dashboard can continue with remediation, flashcards, report-card signals, and related simulations."
        />
        <div className="mt-6 rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--semantic-surface))] p-3 text-[var(--theme-primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{launch.label}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-secondary)]">{launch.description}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={saving}
              onClick={onLaunch}
              className="nn-btn-primary inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-none disabled:opacity-50"
            >
              {saving ? "Creating your path…" : "Start first session"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onBaseline}
              className="inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-6 text-sm font-semibold text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-panel-muted)] disabled:opacity-50"
            >
              Take readiness check instead
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">Dashboard will initialize with</p>
        {[
          ["Weak-area suggestions", state.weakAreas.length ? state.weakAreas.map((id) => WEAK_AREA_OPTIONS.find((item) => item.id === id)?.label).filter(Boolean).join(" · ") : "Adaptive readiness check"],
          ["Continuation plan", "Related simulations, flashcards, rationale review, and report-card signals"],
          ["Feature discovery", features.slice(0, 3).map((feature) => feature.title).join(" · ")],
        ].map(([label, body]) => (
          <div key={label} className="nn-onboarding-ecosystem__summary-row">
            <CheckCircle2 className="h-4 w-4" />
            <div>
              <strong>{label}</strong>
              <span>{body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature, compact = false }: { feature: FlagshipExperience; compact?: boolean }) {
  return (
    <article className={`nn-onboarding-ecosystem__feature ${compact ? "is-compact" : ""}`} style={{ "--feature-accent": `var(${feature.accentVar})` } as CSSProperties}>
      <FeaturePreviewVisual kind={feature.previewKind} />
      <div>
        <p>{feature.eyebrow}</p>
        <h3>{feature.title}</h3>
        <span>{compact ? feature.description : feature.clinicalValue}</span>
      </div>
    </article>
  );
}

function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="nn-onboarding-ecosystem__group">
      <h3>{title}</h3>
      <div className="mt-3 grid gap-3">{children}</div>
    </div>
  );
}

function SelectCard({
  selected,
  title,
  description,
  onClick,
  testId,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={`nn-onboarding-option ${selected ? "nn-onboarding-option--selected" : ""}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {selected ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]" /> : null}
        <div className="min-w-0 flex-1 text-left">
          <p className="text-wrap break-words font-semibold text-[var(--semantic-text-primary)]">{title}</p>
          <p className="mt-0.5 text-wrap break-words text-sm leading-snug text-[var(--semantic-text-muted)]">{description}</p>
        </div>
      </div>
    </button>
  );
}

function ConfidenceSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="nn-onboarding-ecosystem__confidence">
      <span>
        <strong>{label}</strong>
        <em>{confidenceLabel(value)}</em>
      </span>
      <input min={1} max={5} step={1} type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
