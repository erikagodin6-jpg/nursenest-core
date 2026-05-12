"use client";

import { useState, useCallback, useRef } from "react";
import type {
  CaseStepPayload,
  CaseStepAdvanceResult,
  PatientCase,
  PatientStabilityState,
  EvolvedLabValue,
  EvolvedVitalReading,
} from "@/lib/cases/longitudinal-case-types";
import {
  PatientSummaryPanel,
  ClinicalTimeline,
  MedicationListSurface,
  LabTrendTable,
  DiagnosticResultCard,
  FollowUpUpdateCard,
} from "@/components/clinical/clinical-case-ui";
import type { MedicationEntry, LabResult, TimelineEvent, VitalSign } from "@/components/clinical/clinical-case-ui";

// ─────────────────────────────────────────────────────────────────────────────
// CNPLE Longitudinal Case Shell
//
// Premium 3-column desktop layout, stacked-tab mobile.
// LEFT  — persistent patient context (summary, meds, timeline)
// CENTER — evolving scenario, question, consequence/rationale reveal
// RIGHT  — labs, diagnostics, clinical notes panel
//
// Theme: semantic CSS variables only. Compatible with all NurseNest themes.
// DISCLAIMER: Not official CNPLE content. NurseNest practice only.
// ─────────────────────────────────────────────────────────────────────────────

type MobileTab = "patient" | "scenario" | "diagnostics";

export type CnpleLongitudinalCaseShellProps = {
  patientCase: Omit<PatientCase, "steps">;
  initialStep: CaseStepPayload;
  onAdvance: (chosenOptionId: string, dwellMs: number) => Promise<CaseStepAdvanceResult>;
  onComplete: (result: CaseStepAdvanceResult) => void;
};

export function CnpleLongitudinalCaseShell({
  patientCase,
  initialStep,
  onAdvance,
  onComplete,
}: CnpleLongitudinalCaseShellProps) {
  const [currentStep, setCurrentStep] = useState<CaseStepPayload>(initialStep);
  const [advanceResult, setAdvanceResult] = useState<CaseStepAdvanceResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("scenario");
  const stepRevealTimeRef = useRef<number>(Date.now());

  // Timeline: accumulate visited steps
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      time: "Visit 1",
      label: initialStep.step.heading,
      detail: initialStep.step.clinicalUpdate.summary,
      type: trajectoryToTimelineType(initialStep.step.clinicalUpdate.direction),
    },
  ]);

  // Accumulated medications for the left panel
  const [activeMeds, setActiveMeds] = useState<MedicationEntry[]>(
    patientCase.medications.map((m) => ({
      name: m.name,
      dose: m.dose,
      route: m.route,
      frequency: m.frequency,
      indication: m.indication,
      flag: m.flag,
    })),
  );

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      if (advanceResult) return; // already answered
      setSelectedOption(optionId);
    },
    [advanceResult],
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedOption || isSubmitting || advanceResult) return;
    const dwellMs = Date.now() - stepRevealTimeRef.current;
    setIsSubmitting(true);
    try {
      const result = await onAdvance(selectedOption, dwellMs);
      setAdvanceResult(result);

      // Update meds from step changes
      if (currentStep.step.medicationChanges?.length) {
        setActiveMeds((prev) => applyMedicationChanges(prev, currentStep.step.medicationChanges));
      }

      if (result.completed) {
        onComplete(result);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedOption, isSubmitting, advanceResult, currentStep, onAdvance, onComplete]);

  const handleContinue = useCallback(() => {
    if (!advanceResult?.nextStep) return;
    const next = advanceResult.nextStep;
    setTimelineEvents((prev) => [
      ...prev,
      {
        time: `Visit ${next.stepIndex + 1}`,
        label: next.step.heading,
        detail: next.step.clinicalUpdate.summary,
        type: trajectoryToTimelineType(next.step.clinicalUpdate.direction),
      },
    ]);
    setCurrentStep(next);
    setAdvanceResult(null);
    setSelectedOption(null);
    stepRevealTimeRef.current = Date.now();
    setMobileTab("scenario");
  }, [advanceResult]);

  const step = currentStep.step;
  const evolved = currentStep.evolvedState;
  const trajectoryState = currentStep.trajectoryState;

  // Use evolved labs if available; fall back to authored
  const labs: LabResult[] = evolved?.evolvedLabs?.length
    ? evolved.evolvedLabs.map((l) => ({
        test: l.test,
        value: l.value,
        unit: l.unit,
        referenceRange: l.referenceRange,
        flag: l.flag,
      }))
    : buildLabResults(step.diagnosticArtifacts ?? []);

  // Use evolved vitals if available; fall back to authored
  const vitalsForPanel: VitalSign[] = evolved?.evolvedVitals?.length
    ? evolved.evolvedVitals.map((v) => ({
        label: v.label,
        value: v.value,
        unit: v.unit,
        flag: v.flag,
      }))
    : step.vitals.map((v) => ({ label: v.label, value: v.value, unit: v.unit, flag: v.flag }));

  return (
    <div className="cnple-case-shell w-full" data-cnple-case="shell">
      {/* Case header with trajectory badge */}
      <CaseProgressHeader
        title={patientCase.title}
        tagline={patientCase.tagline}
        stepIndex={currentStep.stepIndex}
        totalSteps={currentStep.totalSteps}
        mode={currentStep.mode}
        stabilityState={trajectoryState?.stabilityState}
      />

      {/* Mobile tab bar */}
      <div className="flex gap-1 border-b px-4 pt-2 lg:hidden" style={{ borderColor: "var(--semantic-border-soft)" }}>
        {(["scenario", "patient", "diagnostics"] as MobileTab[]).map((tab) => (
          <MobileTabButton key={tab} tab={tab} active={mobileTab === tab} onSelect={setMobileTab} />
        ))}
      </div>

      {/* 3-column grid (desktop) / single-panel (mobile) */}
      <div className="mt-4 flex gap-5 lg:grid lg:grid-cols-[17rem_1fr_19rem] lg:items-start lg:gap-6">

        {/* ── LEFT: Patient context ─────────────────────────────────────────── */}
        <aside
          className={`flex flex-col gap-4 ${mobileTab === "patient" ? "block" : "hidden"} lg:flex`}
          data-cnple-panel="patient"
        >
          <PatientSummaryPanel
            patient={{ ...patientCase.patient }}
            chiefComplaint={patientCase.chiefComplaint}
            pmhx={patientCase.pmhx}
            vitals={vitalsForPanel}
            allergies={patientCase.allergies}
            compact={false}
          />
          {/* Evolved vitals trend summary */}
          {evolved?.evolvedVitals?.length ? (
            <EvolvedVitalsTrendRow vitals={evolved.evolvedVitals} />
          ) : null}
          {activeMeds.length > 0 && (
            <MedicationListSurface medications={activeMeds} />
          )}
          <div
            className="overflow-hidden rounded-xl border p-4"
            style={{ borderColor: "var(--semantic-border-soft)" }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
              Case Timeline
            </p>
            <ClinicalTimeline events={timelineEvents} />
          </div>
        </aside>

        {/* ── CENTER: Evolving scenario ─────────────────────────────────────── */}
        <main
          className={`flex flex-col gap-5 ${mobileTab === "scenario" ? "block" : "hidden"} lg:flex min-w-0`}
          data-cnple-panel="scenario"
        >
          {/* Clinical update banner */}
          {step.updateNarrative && (
            <FollowUpUpdateCard
              title={step.heading}
              timestamp={step.followUpInterval?.label}
              variant={clinicalDirectionToVariant(step.clinicalUpdate.direction)}
            >
              {step.updateNarrative}
            </FollowUpUpdateCard>
          )}

          {/* Patient-reported messages */}
          {evolved?.patientMessages?.map((msg, i) => (
            <PatientMessageCard key={i} message={msg} />
          ))}

          {/* Safety flag banner */}
          {trajectoryState?.activeSafetyFlags?.length ? (
            <SafetyFlagBanner flags={trajectoryState.activeSafetyFlags} />
          ) : null}

          {/* Scenario narrative */}
          <ScenarioNarrativePanel
            text={step.scenarioText}
            clinicalUpdate={step.clinicalUpdate}
          />

          {/* Question */}
          <QuestionPanel
            step={currentStep}
            selectedOption={selectedOption}
            advanceResult={advanceResult}
            onOptionSelect={handleOptionSelect}
            onSubmit={handleSubmit}
            onContinue={handleContinue}
            isSubmitting={isSubmitting}
          />
        </main>

        {/* ── RIGHT: Diagnostics & notes ───────────────────────────────────── */}
        <aside
          className={`flex flex-col gap-4 ${mobileTab === "diagnostics" ? "block" : "hidden"} lg:flex`}
          data-cnple-panel="diagnostics"
        >
          {/* Delayed consequence alerts */}
          {evolved?.delayedConsequences?.map((dc, i) => (
            <DelayedConsequenceAlert key={i} consequence={dc} />
          ))}

          {/* Lab trend table — uses evolved labs if available */}
          {labs.length > 0 && (
            <EvolvedLabTrendPanel
              labs={labs}
              evolvedLabs={evolved?.evolvedLabs ?? []}
            />
          )}
          {(step.diagnosticArtifacts ?? [])
            .filter((a) => a.type !== "lab_panel")
            .map((artifact, i) => (
              <DiagnosticResultCard
                key={`${artifact.type}-${i}`}
                result={{
                  type: artifact.type === "lab_panel" ? "other" : artifact.type,
                  name: artifact.name,
                  finding: artifact.finding,
                  impression: artifact.impression,
                  timestamp: artifact.timestamp,
                }}
              />
            ))}
          {labs.length === 0 && (step.diagnosticArtifacts ?? []).filter(a => a.type !== "lab_panel").length === 0 && (
            <EmptyDiagnosticsPanel />
          )}
          <ClinicalNotesPanel judmentFocus={step.question.clinicalJudgmentFocus} domain={step.cnpleDomain} />
        </aside>
      </div>
    </div>
  );
}

// ── Case progress header ──────────────────────────────────────────────────────

function CaseProgressHeader({
  title,
  tagline,
  stepIndex,
  totalSteps,
  mode,
  stabilityState,
}: {
  title: string;
  tagline?: string;
  stepIndex: number;
  totalSteps: number;
  mode: "PRACTICE" | "SIMULATION";
  stabilityState?: PatientStabilityState;
}) {
  const pct = Math.round(((stepIndex) / totalSteps) * 100);
  return (
    <div
      className="relative overflow-hidden rounded-2xl border px-5 py-4 shadow-[var(--semantic-shadow-soft)]"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-chart-2) 20%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 15%, var(--semantic-surface))",
      }}
      data-cnple-case="header"
    >
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb,var(--semantic-brand) 80%,transparent), color-mix(in srgb,var(--semantic-info) 60%,transparent), color-mix(in srgb,var(--semantic-chart-4) 50%,transparent))",
        }}
        aria-hidden
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em]" style={{ color: "var(--semantic-text-muted)" }}>
            CNPLE-style case{" "}
            {mode === "SIMULATION" && (
              <span
                className="ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  background: "color-mix(in srgb, var(--semantic-warning) 15%, transparent)",
                  color: "var(--semantic-warning-contrast)",
                }}
              >
                Simulation
              </span>
            )}
          </p>
          <h1 className="mt-0.5 text-[17px] font-bold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
            {title}
          </h1>
          {tagline && (
            <p className="mt-1 text-[12px]" style={{ color: "var(--semantic-text-secondary)" }}>
              {tagline}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {stabilityState && <StabilityBadge state={stabilityState} />}
          <p className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--semantic-text-primary)" }}>
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <p className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            {pct}% complete
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--semantic-border-soft)" }}>
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: "color-mix(in srgb, var(--semantic-brand) 80%, var(--semantic-info))",
          }}
        />
      </div>
    </div>
  );
}

// ── Scenario narrative panel ──────────────────────────────────────────────────

function ScenarioNarrativePanel({
  text,
  clinicalUpdate,
}: {
  text: string;
  clinicalUpdate: { direction: string; newFindings?: string[] };
}) {
  return (
    <div
      className="rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)]"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "var(--semantic-surface)",
      }}
    >
      <p
        className="mb-1 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Clinical scenario
      </p>
      <p className="text-[14px] leading-[1.7]" style={{ color: "var(--semantic-text-primary)" }}>
        {text}
      </p>
      {clinicalUpdate.newFindings && clinicalUpdate.newFindings.length > 0 && (
        <ul className="mt-3 space-y-1 border-t pt-3" style={{ borderColor: "var(--semantic-border-soft)" }}>
          {clinicalUpdate.newFindings.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background:
                    clinicalUpdate.direction === "critical"
                      ? "var(--semantic-danger)"
                      : clinicalUpdate.direction === "worsening"
                        ? "var(--semantic-warning-contrast)"
                        : "var(--semantic-brand)",
                }}
              />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Question panel ────────────────────────────────────────────────────────────

function QuestionPanel({
  step,
  selectedOption,
  advanceResult,
  onOptionSelect,
  onSubmit,
  onContinue,
  isSubmitting,
}: {
  step: CaseStepPayload;
  selectedOption: string | null;
  advanceResult: CaseStepAdvanceResult | null;
  onOptionSelect: (id: string) => void;
  onSubmit: () => void;
  onContinue: () => void;
  isSubmitting: boolean;
}) {
  const { question } = step.step;
  const answered = advanceResult !== null;

  return (
    <div
      className="rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)]"
      style={{ borderColor: "var(--semantic-border-soft)", background: "var(--semantic-surface)" }}
      data-cnple-case="question-panel"
    >
      {/* Stem */}
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        Clinical judgment question
      </p>
      <p className="mb-4 text-[14px] font-semibold leading-[1.65]" style={{ color: "var(--semantic-text-primary)" }}>
        {question.stem}
      </p>

      {/* Options */}
      <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt) => {
          const isChosen = selectedOption === opt.id;
          const isCorrect = answered && opt.id === advanceResult?.correctOptionId;
          const isWrong = answered && isChosen && !advanceResult?.isCorrect;
          const revealCorrect = answered && step.mode === "PRACTICE";

          let borderColor = "var(--semantic-border-soft)";
          let bg = "var(--semantic-surface)";
          if (revealCorrect && isCorrect) {
            borderColor = "var(--semantic-success)";
            bg = "color-mix(in srgb, var(--semantic-success) 8%, var(--semantic-surface))";
          } else if (isWrong) {
            borderColor = "var(--semantic-danger)";
            bg = "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))";
          } else if (!answered && isChosen) {
            borderColor = "var(--semantic-brand)";
            bg = "color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-surface))";
          }

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={answered}
              onClick={() => onOptionSelect(opt.id)}
              className="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-[border-color,background] disabled:cursor-default"
              style={{ borderColor, background: bg }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold"
                style={{
                  borderColor: revealCorrect && isCorrect
                    ? "var(--semantic-success)"
                    : isWrong
                      ? "var(--semantic-danger)"
                      : isChosen
                        ? "var(--semantic-brand)"
                        : "var(--semantic-border-soft)",
                  color: revealCorrect && isCorrect
                    ? "var(--semantic-success)"
                    : isWrong
                      ? "var(--semantic-danger)"
                      : isChosen
                        ? "var(--semantic-brand)"
                        : "var(--semantic-text-muted)",
                }}
              >
                {opt.id}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-primary)" }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Consequence & rationale (practice mode reveal) */}
      {answered && step.mode === "PRACTICE" && (
        <RationaleReveal result={advanceResult} />
      )}
      {answered && step.mode === "SIMULATION" && (
        <div className="mt-4 rounded-xl border px-4 py-3" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))" }}>
          <p className="text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
            Simulation mode — rationale and correct answer will be revealed in the session review.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-5 flex justify-end gap-3">
        {!answered && (
          <button
            type="button"
            disabled={!selectedOption || isSubmitting}
            onClick={onSubmit}
            className="rounded-xl px-5 py-2.5 text-[13px] font-bold transition-opacity disabled:opacity-40"
            style={{
              background: "var(--semantic-brand)",
              color: "var(--semantic-on-brand)",
            }}
          >
            {isSubmitting ? "Submitting…" : "Submit answer"}
          </button>
        )}
        {answered && !advanceResult?.completed && (
          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl px-5 py-2.5 text-[13px] font-bold"
            style={{
              background: "var(--semantic-brand)",
              color: "var(--semantic-on-brand)",
            }}
          >
            Continue to next step →
          </button>
        )}
        {answered && advanceResult?.completed && (
          <p className="text-[13px] font-semibold" style={{ color: "var(--semantic-success)" }}>
            Case complete — see your report card below.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Rationale reveal ──────────────────────────────────────────────────────────

function RationaleReveal({ result }: { result: CaseStepAdvanceResult }) {
  const trajectoryColor =
    result.trajectory === "optimal"
      ? "var(--semantic-success)"
      : result.trajectory === "acceptable"
        ? "var(--semantic-brand)"
        : result.trajectory === "suboptimal"
          ? "var(--semantic-warning-contrast)"
          : "var(--semantic-danger)";

  return (
    <div className="mt-4 space-y-3">
      {/* Consequence */}
      <div
        className="rounded-xl border-l-4 p-4"
        style={{
          borderColor: trajectoryColor,
          background: `color-mix(in srgb, ${trajectoryColor} 7%, var(--semantic-surface))`,
        }}
      >
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: trajectoryColor }}>
          Outcome — {result.trajectory.replace("_", " ")}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-primary)" }}>
          {result.consequence}
        </p>
      </div>

      {/* Rationale */}
      {result.rationale && (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))" }}>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-info)" }}>
            Rationale
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-primary)" }}>
            {result.rationale}
          </p>
        </div>
      )}

      {/* Why wrong */}
      {result.whyWrong && (
        <div className="rounded-xl border p-4" style={{ borderColor: "color-mix(in srgb, var(--semantic-danger) 20%, var(--semantic-border-soft))", background: "color-mix(in srgb, var(--semantic-danger) 5%, var(--semantic-surface))" }}>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-danger)" }}>
            Why your answer was incorrect
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-primary)" }}>
            {result.whyWrong}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Clinical notes right panel ────────────────────────────────────────────────

function ClinicalNotesPanel({ judmentFocus, domain }: { judmentFocus: string; domain: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-panel-cool) 8%, var(--semantic-surface))" }}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        Clinical judgment focus
      </p>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {judmentFocus}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)",
            color: "var(--semantic-brand)",
          }}
        >
          {domain.replace(/-/g, " ")}
        </span>
      </div>
    </div>
  );
}

function EmptyDiagnosticsPanel() {
  return (
    <div
      className="rounded-xl border px-4 py-6 text-center"
      style={{ borderColor: "var(--semantic-border-soft)" }}
    >
      <p className="text-[13px]" style={{ color: "var(--semantic-text-muted)" }}>
        No diagnostics ordered at this step.
      </p>
    </div>
  );
}

// ── Mobile tab button ─────────────────────────────────────────────────────────

function MobileTabButton({
  tab,
  active,
  onSelect,
}: {
  tab: MobileTab;
  active: boolean;
  onSelect: (t: MobileTab) => void;
}) {
  const labels: Record<MobileTab, string> = {
    scenario: "Scenario",
    patient: "Patient",
    diagnostics: "Labs",
  };
  return (
    <button
      type="button"
      onClick={() => onSelect(tab)}
      className="rounded-t-lg px-4 py-2 text-[12px] font-semibold transition-colors"
      style={{
        color: active ? "var(--semantic-brand)" : "var(--semantic-text-muted)",
        borderBottom: active ? "2px solid var(--semantic-brand)" : "2px solid transparent",
        background: "transparent",
      }}
    >
      {labels[tab]}
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function trajectoryToTimelineType(
  direction: string,
): "improvement" | "deterioration" | "intervention" | "note" | undefined {
  if (direction === "improving") return "improvement";
  if (direction === "worsening" || direction === "critical") return "deterioration";
  return "note";
}

function clinicalDirectionToVariant(
  direction: string,
): "default" | "deterioration" | "improvement" | "critical" {
  if (direction === "critical") return "critical";
  if (direction === "worsening") return "deterioration";
  if (direction === "improving") return "improvement";
  return "default";
}

function buildLabResults(
  artifacts: CaseStepPayload["step"]["diagnosticArtifacts"],
): LabResult[] {
  const labs: LabResult[] = [];
  for (const artifact of artifacts) {
    if (artifact.type === "lab_panel" && artifact.values) {
      for (const v of artifact.values) {
        labs.push({
          test: v.test,
          value: v.value,
          unit: v.unit,
          referenceRange: v.referenceRange,
          flag: v.flag,
          timestamp: artifact.timestamp,
        });
      }
    }
  }
  return labs;
}

// ── New evolution UI sub-components ──────────────────────────────────────────

/** Stability badge shown in the case header. */
function StabilityBadge({ state }: { state: PatientStabilityState }) {
  const config: Record<PatientStabilityState, { label: string; color: string; bg: string }> = {
    improving:    { label: "Condition Improving",    color: "var(--semantic-success)",           bg: "color-mix(in srgb, var(--semantic-success) 12%, transparent)" },
    stable:       { label: "Condition Stable",       color: "var(--semantic-brand)",             bg: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)" },
    deteriorating:{ label: "Condition Deteriorating",color: "var(--semantic-warning-contrast)",  bg: "color-mix(in srgb, var(--semantic-warning) 14%, transparent)" },
    critical:     { label: "Critical — Escalate",    color: "var(--semantic-danger)",            bg: "color-mix(in srgb, var(--semantic-danger) 14%, transparent)" },
  };
  const { label, color, bg } = config[state];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
      style={{ color, background: bg }}
      data-cnple-stability={state}
    >
      {label}
    </span>
  );
}

/** Evolved vitals trend summary — compact row of vital trends. */
function EvolvedVitalsTrendRow({ vitals }: { vitals: EvolvedVitalReading[] }) {
  const trending = vitals.filter((v) => v.trend && v.trend !== "stable");
  if (trending.length === 0) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))" }}
      data-cnple-vitals="trend-row"
    >
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        Vital trends
      </p>
      <div className="flex flex-wrap gap-2">
        {trending.map((v) => (
          <span key={v.label} className="flex items-center gap-1 text-[12px]">
            <span style={{ color: "var(--semantic-text-muted)" }}>{v.label}</span>
            <TrendArrow trend={v.trend!} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Patient-reported symptom message card. */
function PatientMessageCard({ message }: { message: { type: string; text: string } }) {
  const msgColor =
    message.type === "symptom_improvement" ? "var(--semantic-success)"
    : message.type === "symptom_worsening" ? "var(--semantic-warning-contrast)"
    : message.type === "side_effect" ? "var(--semantic-info)"
    : "var(--semantic-text-muted)";
  return (
    <div
      className="rounded-xl border-l-4 px-4 py-3"
      style={{
        borderColor: msgColor,
        background: `color-mix(in srgb, ${msgColor} 6%, var(--semantic-surface))`,
      }}
      data-cnple-patient="message"
    >
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: msgColor }}>
        Patient reports
      </p>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-primary)" }}>
        {message.text}
      </p>
    </div>
  );
}

/** Active safety flag banner — shown above scenario text when flags are present. */
function SafetyFlagBanner({ flags }: { flags: Array<{ code: string; label: string; severity: "warning" | "critical" }> }) {
  const hasCritical = flags.some((f) => f.severity === "critical");
  const borderColor = hasCritical ? "var(--semantic-danger)" : "var(--semantic-warning-contrast)";
  const bg = hasCritical
    ? "color-mix(in srgb, var(--semantic-danger) 7%, var(--semantic-surface))"
    : "color-mix(in srgb, var(--semantic-warning) 7%, var(--semantic-surface))";
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ borderColor, background: bg }}
      data-cnple-safety="flag-banner"
    >
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: borderColor }}>
        {hasCritical ? "Active safety concern" : "Clinical safety flag"}
      </p>
      <ul className="space-y-0.5">
        {flags.map((f) => (
          <li key={f.code} className="text-[12px]" style={{ color: "var(--semantic-text-primary)" }}>
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Delayed consequence alert — surfaces prior harmful decision consequences. */
function DelayedConsequenceAlert({
  consequence,
}: {
  consequence: { sourceStepIndex: number; summary: string; clinicalNote: string; severity: "warning" | "critical" };
}) {
  const color = consequence.severity === "critical" ? "var(--semantic-danger)" : "var(--semantic-warning-contrast)";
  return (
    <div
      className="rounded-xl border-l-4 px-4 py-3"
      style={{
        borderColor: color,
        background: `color-mix(in srgb, ${color} 6%, var(--semantic-surface))`,
      }}
      data-cnple-delayed="consequence"
    >
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
        Consequence from step {consequence.sourceStepIndex + 1}
      </p>
      <p className="text-[13px] font-semibold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
        {consequence.summary}
      </p>
      <p className="mt-1 text-[12px]" style={{ color: "var(--semantic-text-secondary)" }}>
        {consequence.clinicalNote}
      </p>
    </div>
  );
}

/** Lab trend table with evolution arrows. */
function EvolvedLabTrendPanel({
  labs,
  evolvedLabs,
}: {
  labs: LabResult[];
  evolvedLabs: EvolvedLabValue[];
}) {
  const trendsById = new Map(evolvedLabs.map((l) => [l.test, l.trend]));
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--semantic-border-soft)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))",
        }}
      >
        <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          Laboratory Results
        </span>
        {evolvedLabs.length > 0 && (
          <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)", color: "var(--semantic-brand)" }}>
            Evolved
          </span>
        )}
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ background: "color-mix(in srgb, var(--semantic-border-soft) 40%, transparent)" }}>
            <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>Test</th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>Result</th>
            <th className="hidden px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide sm:table-cell" style={{ color: "var(--semantic-text-muted)" }}>Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--semantic-border-soft)" }}>
          {labs.map((r, i) => {
            const trend = trendsById.get(r.test);
            return (
              <tr key={`${r.test}-${i}`}>
                <td className="px-4 py-2.5" style={{ color: "var(--semantic-text-secondary)" }}>
                  {r.test}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="font-semibold"
                      style={{
                        color: r.flag === "C" ? "var(--semantic-danger)" : r.flag ? "var(--semantic-warning-contrast)" : "var(--semantic-text-primary)",
                      }}
                    >
                      {r.value}{r.unit ? ` ${r.unit}` : ""}
                    </span>
                    {trend && <TrendArrow trend={trend} />}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-right text-[12px] sm:table-cell" style={{ color: "var(--semantic-text-muted)" }}>
                  {r.referenceRange ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Trend direction arrow. */
function TrendArrow({ trend }: { trend: "improving" | "worsening" | "stable" }) {
  if (trend === "improving") return (
    <span className="text-[11px] font-bold" style={{ color: "var(--semantic-success)" }} aria-label="improving">↑</span>
  );
  if (trend === "worsening") return (
    <span className="text-[11px] font-bold" style={{ color: "var(--semantic-danger)" }} aria-label="worsening">↓</span>
  );
  return <span className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }} aria-label="stable">→</span>;
}

type MedChangeInput = CaseStepPayload["step"]["medicationChanges"][number];
function applyMedicationChanges(
  current: MedicationEntry[],
  changes: MedChangeInput[],
): MedicationEntry[] {
  const updated = current.map((m) => ({ ...m, flag: undefined as MedicationEntry["flag"] }));
  for (const change of changes) {
    const existingIdx = updated.findIndex(
      (m) => m.name.toLowerCase() === change.name.toLowerCase(),
    );
    if (change.flag === "discontinued") {
      if (existingIdx >= 0) updated[existingIdx] = { ...updated[existingIdx]!, flag: "discontinued" };
    } else if (change.flag === "changed") {
      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx]!,
          dose: change.dose ?? updated[existingIdx]!.dose,
          frequency: change.frequency ?? updated[existingIdx]!.frequency,
          flag: "changed",
        };
      }
    } else if (change.flag === "new") {
      updated.push({
        name: change.name,
        dose: change.dose,
        route: change.route,
        frequency: change.frequency,
        indication: change.indication,
        flag: "new",
      });
    }
  }
  return updated;
}
