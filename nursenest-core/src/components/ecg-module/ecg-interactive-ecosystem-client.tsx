"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  GitCompare,
  GraduationCap,
  HeartPulse,
  LineChart,
  MonitorHeart,
  ShieldCheck,
  Siren,
  Stethoscope,
  Target,
  Zap,
} from "lucide-react";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import {
  DETECTIVE_ADVANCED_STEPS,
  DETECTIVE_ESCALATION_OPTIONS,
  DETECTIVE_STEP_LABELS,
  ECG_DETECTIVE_ANSWER_KEYS,
  FIRST_ACTION_OPTIONS,
  P_WAVE_OPTIONS,
  QRS_WIDTH_OPTIONS,
  RATE_BRACKET_OPTIONS,
  REGULARITY_OPTIONS,
  createDetectiveSession,
  scoreDetectiveSession,
  submitDetectiveAnswer,
  type DetectiveSession,
  type DetectiveStepKey,
} from "@/lib/ecg-module/ecg-detective-mode";
import {
  ECG_CLINICAL_REASONING_RHYTHM_KEYS,
  getEcgClinicalReasoningUnit,
} from "@/lib/ecg-module/ecg-clinical-reasoning-index";
import { defaultEcgStripConfigForRhythm } from "@/lib/ecg-module/ecg-waveform-generator";
import {
  ECG_INTERACTIVE_COMPARE_PAIRS,
  ECG_PHASE3_CLEARANCE_METRICS,
  ECG_PHASE3_DEMO_DETECTIVE_SCORES,
  ECG_PHASE3_DEMO_READINESS_INPUT,
  ECG_PHASE3_READINESS_LABELS,
  type EcgComparePair,
} from "@/lib/ecg-module/ecg-interactive-ecosystem";
import {
  SHIFT_ACTIONS,
  advanceShiftTick,
  applyShiftAction,
  createTelemetryShiftSession,
  scoreShiftSession,
  type TelemetryShiftSession,
} from "@/lib/ecg-module/ecg-telemetry-shift";
import {
  ECG_DETERIORATION_PATHWAYS,
  applyDeteriorationDecision,
  createDeteriorationSession,
  getDeteriorationPathway,
  scoreDeteriorationSession,
  type DeteriorationSession,
} from "@/lib/ecg-module/ecg-deterioration-engine";
import {
  computeEcgReadinessProfile,
  generateEcgReportCard,
} from "@/lib/ecg-module/ecg-readiness-scoring";
import { generateEcgStudyPlan } from "@/lib/ecg-module/ecg-adaptive-remediation-v2";
import { getClearanceRoadmap } from "@/lib/ecg-module/ecg-clearances";
import { cn } from "@/lib/utils";

type ModeKey =
  | "detective"
  | "compare"
  | "telemetry"
  | "deterioration"
  | "readiness"
  | "clearances"
  | "report-card"
  | "remediation";

const MODES: Array<{ key: ModeKey; label: string; icon: typeof Activity }> = [
  { key: "detective", label: "Detective", icon: Stethoscope },
  { key: "compare", label: "Compare", icon: GitCompare },
  { key: "telemetry", label: "Telemetry Shift", icon: MonitorHeart },
  { key: "deterioration", label: "Deterioration", icon: Siren },
  { key: "readiness", label: "Readiness", icon: BarChart3 },
  { key: "clearances", label: "Clearances", icon: ShieldCheck },
  { key: "report-card", label: "Report Card", icon: ClipboardCheck },
  { key: "remediation", label: "Remediation", icon: Target },
];

const rhythmLabel = (key: string) =>
  getEcgClinicalReasoningUnit(key)?.rhythmName ?? key.replace(/_/g, " ");

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

function makeDetectiveSession(rhythmKey: string) {
  return createDetectiveSession(
    rhythmKey,
    defaultEcgStripConfigForRhythm(rhythmKey),
    "advanced",
  );
}

function optionSetForStep(step: DetectiveStepKey, rhythmKey: string): string[] {
  const unit = getEcgClinicalReasoningUnit(rhythmKey);
  const answerKey = ECG_DETECTIVE_ANSWER_KEYS[rhythmKey];

  if (step === "rate") return [...new Set([answerKey?.rateBracket, unit?.recognition.rate, ...RATE_BRACKET_OPTIONS].filter(Boolean) as string[])];
  if (step === "regularity") return [...new Set([answerKey?.regularity, unit?.recognition.regularity, ...REGULARITY_OPTIONS].filter(Boolean) as string[])];
  if (step === "p_wave") return [...new Set([answerKey?.pWave, unit?.recognition.pWaves, ...P_WAVE_OPTIONS].filter(Boolean) as string[])];
  if (step === "qrs_width") return [...new Set([answerKey?.qrsWidth, unit?.recognition.qrsWidth, ...QRS_WIDTH_OPTIONS].filter(Boolean) as string[])];
  if (step === "escalation_level") return DETECTIVE_ESCALATION_OPTIONS.map((o) => o.value);
  if (step === "first_action") return [...new Set([answerKey?.firstAction, unit?.escalation.immediateAssessments[0], ...FIRST_ACTION_OPTIONS].filter(Boolean) as string[])];
  if (step === "rhythm_id") return ECG_CLINICAL_REASONING_RHYTHM_KEYS.map(String);
  if (step === "pr_interval") {
    return [
      unit?.recognition.prInterval ?? "0.12-0.20s; constant throughout",
      "Progressively lengthens before a dropped QRS",
      "Cannot be measured because P-waves are absent",
      "Short PR interval with pre-excitation concern",
    ];
  }
  if (step === "mechanism") {
    return [
      unit?.mechanism ?? "Primary conduction abnormality",
      "Atrial re-entry circuit with predictable conduction",
      "Ventricular ectopic focus overriding normal conduction",
      "Electrolyte-driven membrane instability affecting depolarization",
    ];
  }
  if (step === "hemodynamic_impact") {
    return [
      unit?.hemodynamicImpact.cardiacOutputRationale ?? "Cardiac output depends on rate and perfusion.",
      "Usually no cardiac output effect unless the patient is anxious.",
      "Always absent cardiac output regardless of pulse check.",
      "Only affects oxygen saturation and not blood pressure.",
    ];
  }
  return [
    answerKey?.medicationDanger ?? "No specific contraindication",
    "Adenosine for every tachycardia",
    "Defibrillation for any irregular rhythm",
    "Rapid IV potassium push",
  ];
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]", className)}>
      {children}
    </section>
  );
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_48%,var(--semantic-surface))] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[var(--semantic-text-primary)]">{clampScore(score)}%</p>
    </div>
  );
}

function DetectiveModePanel() {
  const [rhythmKey, setRhythmKey] = useState("ventricular_tachycardia");
  const [session, setSession] = useState<DetectiveSession>(() => makeDetectiveSession("ventricular_tachycardia"));
  const [feedback, setFeedback] = useState("Investigate the strip before revealing the clinical reasoning.");

  const unit = getEcgClinicalReasoningUnit(rhythmKey);
  const step = session.stepsOrder[session.currentStepIndex];
  const score = scoreDetectiveSession(session);
  const revealed = session.phase !== "investigating";

  function reset(nextRhythmKey: string) {
    setRhythmKey(nextRhythmKey);
    setSession(makeDetectiveSession(nextRhythmKey));
    setFeedback("New rhythm loaded. Start with rate and work toward first action.");
  }

  function submit(answer: string) {
    const { result, updatedSession } = submitDetectiveAnswer(session, answer);
    setSession(updatedSession);
    setFeedback(result.feedback);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">ECG Detective Mode</p>
            <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{unit?.rhythmName ?? "Rhythm investigation"}</h2>
          </div>
          <select
            value={rhythmKey}
            onChange={(event) => reset(event.target.value)}
            className="min-h-10 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]"
            aria-label="Choose detective rhythm"
          >
            {ECG_CLINICAL_REASONING_RHYTHM_KEYS.map((key) => (
              <option key={key} value={key}>{rhythmLabel(key)}</option>
            ))}
          </select>
        </div>
        <EcgLiveStrip
          config={defaultEcgStripConfigForRhythm(rhythmKey)}
          mode="live"
          title="Investigate before reveal"
          leadLabel="Lead II"
          showMeasurements
          showCaliper
          zoomable
          playbackSpeeds
          frameStep
          themeAwareGrid
        />
        <div className="grid gap-2 sm:grid-cols-5">
          {DETECTIVE_ADVANCED_STEPS.map((candidate, index) => (
            <div
              key={candidate}
              className={cn(
                "rounded-md border px-2 py-1.5 text-[10px] font-semibold",
                index < session.currentStepIndex
                  ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] text-[var(--semantic-success)]"
                  : index === session.currentStepIndex
                    ? "border-[color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]",
              )}
            >
              {DETECTIVE_STEP_LABELS[candidate]}
            </div>
          ))}
        </div>
        {step ? (
          <div className="space-y-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              Identify: {DETECTIVE_STEP_LABELS[step]}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {optionSetForStep(step, rhythmKey).map((answer) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() => submit(answer)}
                  className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-left text-xs font-medium text-[var(--semantic-text-secondary)] transition hover:border-[var(--semantic-info)] hover:text-[var(--semantic-text-primary)]"
                >
                  {step === "rhythm_id" ? rhythmLabel(answer) : answer}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSession((current) => ({ ...current, phase: "complete" }))}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--role-cta)] px-4 text-sm font-semibold text-[var(--role-cta-foreground)]"
          >
            Reveal clinical reasoning
          </button>
        )}
        <p className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-3 text-sm text-[var(--semantic-text-secondary)]">
          {feedback}
        </p>
      </Panel>
      <Panel className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <ScorePill label="Recognition" score={score.domainScores.recognition} />
          <ScorePill label="Reasoning" score={score.domainScores.clinicalReasoning} />
          <ScorePill label="Escalation" score={score.domainScores.escalation} />
          <ScorePill label="Medication" score={score.domainScores.medicationSafety} />
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Session Score</p>
          <p className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">{score.percentScore}%</p>
          <p className="text-xs text-[var(--semantic-text-secondary)]">{score.totalPoints} of {score.maxPoints} points earned</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Clinical reasoning reveal</h3>
          {revealed ? (
            <div className="space-y-3 text-sm text-[var(--semantic-text-secondary)]">
              <p><strong className="text-[var(--semantic-text-primary)]">Mechanism:</strong> {unit?.mechanism}</p>
              <p><strong className="text-[var(--semantic-text-primary)]">Hemodynamics:</strong> {unit?.hemodynamicImpact.cardiacOutputRationale}</p>
              <p><strong className="text-[var(--semantic-text-primary)]">First assessments:</strong> {unit?.escalation.immediateAssessments.slice(0, 3).join("; ")}</p>
              <p><strong className="text-[var(--semantic-text-primary)]">Exam trap:</strong> {unit?.examTraps.nclex[0]}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--semantic-text-muted)]">Complete the investigation steps to unlock the full reasoning entry.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function CompareContrastPanel() {
  const [pair, setPair] = useState<EcgComparePair>(ECG_INTERACTIVE_COMPARE_PAIRS[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const leftUnit = getEcgClinicalReasoningUnit(pair.leftRhythmKey);
  const rightUnit = getEcgClinicalReasoningUnit(pair.rightRhythmKey);
  const targets = [
    pair.visualDifference,
    pair.clinicalDifference,
    pair.escalationDifference,
    pair.treatmentDifference,
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
      <Panel className="space-y-2">
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Compare and Contrast</h2>
        {ECG_INTERACTIVE_COMPARE_PAIRS.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => {
              setPair(candidate);
              setSelected([]);
              setSubmitted(false);
            }}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold",
              candidate.id === pair.id
                ? "border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]",
            )}
          >
            {candidate.title}
          </button>
        ))}
      </Panel>
      <Panel className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-2">
          {[leftUnit, rightUnit].map((unit) => unit ? (
            <div key={unit.rhythmKey} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <EcgLiveStrip
                config={defaultEcgStripConfigForRhythm(unit.rhythmKey)}
                mode="static"
                title={unit.rhythmName}
                showMeasurements
                themeAwareGrid
              />
              <ul className="mt-3 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
                <li>Rate: {unit.recognition.rate}</li>
                <li>Regularity: {unit.recognition.regularity}</li>
                <li>QRS: {unit.recognition.qrsWidth}</li>
              </ul>
            </div>
          ) : null)}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-[var(--semantic-text-primary)]">Select the differences that matter clinically.</p>
          <div className="grid gap-2 md:grid-cols-2">
            {[...targets, "Both rhythms have identical treatment priorities.", "Visual recognition alone is enough; clinical stability does not change escalation."].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs font-medium",
                  selected.includes(option)
                    ? "border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-[var(--role-cta)] px-4 text-sm font-semibold text-[var(--role-cta-foreground)]"
          >
            Check differences
          </button>
        </div>
        {submitted ? (
          <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] p-3 text-sm text-[var(--semantic-text-secondary)]">
            <p className="font-semibold text-[var(--semantic-text-primary)]">
              Adaptive feedback: {targets.every((target) => selected.includes(target)) ? "strong discrimination" : "review the missed distinction before moving on"}.
            </p>
            <p className="mt-1">The highest-yield decision is whether the rhythm changes escalation, treatment timing, or patient safety risk.</p>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}

function TelemetryShiftPanel() {
  const [session, setSession] = useState<TelemetryShiftSession>(() => createTelemetryShiftSession("standard-ward-shift"));
  const [feedback, setFeedback] = useState("Prioritize the highest-risk bed before the shift clock advances.");
  const score = scoreShiftSession(session);

  function act(bedId: string, actionId: string) {
    const result = applyShiftAction(session, bedId, actionId);
    setSession(result.updatedSession);
    setFeedback(`${result.feedback} (${result.pointsEarned >= 0 ? "+" : ""}${result.pointsEarned} pts)`);
  }

  return (
    <Panel className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">Telemetry Shift Simulator</p>
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">Four monitored patients, one evolving shift</h2>
        </div>
        <button
          type="button"
          onClick={() => setSession((current) => advanceShiftTick(current))}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]"
        >
          <Zap className="h-4 w-4" aria-hidden />
          Advance shift
        </button>
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {session.beds.map((bed) => (
          <div key={bed.bedId} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{bed.patientName}</p>
                <p className="text-[11px] text-[var(--semantic-text-muted)]">{bed.diagnosis}</p>
              </div>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--semantic-text-muted)]">{bed.acuityLevel}</span>
            </div>
            <EcgLiveStrip
              config={{ ...defaultEcgStripConfigForRhythm(bed.currentRhythmKey), rate: bed.displayRate }}
              mode="static"
              title={rhythmLabel(bed.currentRhythmKey)}
              themeAwareGrid
              className="mt-3"
            />
            <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{bed.clinicalContext}</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-[var(--semantic-text-muted)]">
              <span>HR {bed.vitals.hr}</span>
              <span>BP {bed.vitals.bp}</span>
              <span>SpO2 {bed.vitals.spo2}</span>
              <span>LOC {bed.vitals.loc ?? "n/a"}</span>
            </div>
            <div className="mt-3 space-y-1">
              {SHIFT_ACTIONS.slice(0, 6).map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => act(bed.bedId, action.id)}
                  className="w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-left text-[10px] font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <ScorePill label="Recognition" score={74} />
        <ScorePill label="Prioritization" score={score.prioritisationAccuracy} />
        <ScorePill label="Escalation timing" score={score.correctEscalations * 25} />
        <ScorePill label="Patient safety" score={100 - score.missedCriticalAlerts * 25} />
      </div>
      <p className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 text-sm text-[var(--semantic-text-secondary)]">
        Tick {session.currentTick}. {feedback}
      </p>
    </Panel>
  );
}

function DeteriorationPanel() {
  const [pathwayId, setPathwayId] = useState("pvc-to-vf");
  const [session, setSession] = useState<DeteriorationSession>(() => createDeteriorationSession("pvc-to-vf"));
  const [feedback, setFeedback] = useState("Identify warning signs and intervene before the patient reaches arrest.");
  const pathway = getDeteriorationPathway(pathwayId);
  const stage = pathway?.stages.find((candidate) => candidate.id === session.currentStageId);
  const score = scoreDeteriorationSession(session);

  function reset(nextPathwayId: string) {
    setPathwayId(nextPathwayId);
    setSession(createDeteriorationSession(nextPathwayId));
    setFeedback("New deterioration pathway loaded.");
  }

  function decide(action: string) {
    const result = applyDeteriorationDecision(session, action);
    setSession(result.updatedSession);
    setFeedback(result.updatedSession.decisions.at(-1)?.feedback ?? result.outcomeIfTerminal ?? "Decision recorded.");
  }

  if (!pathway || !stage) return null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-danger)]">Rhythm Deterioration Engine</p>
            <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{pathway.title}</h2>
          </div>
          <select
            value={pathwayId}
            onChange={(event) => reset(event.target.value)}
            className="min-h-10 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]"
            aria-label="Choose deterioration pathway"
          >
            {ECG_DETERIORATION_PATHWAYS.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>{candidate.title}</option>
            ))}
          </select>
        </div>
        <EcgLiveStrip
          config={{ ...defaultEcgStripConfigForRhythm(stage.rhythmKey), rate: stage.displayRate ?? defaultEcgStripConfigForRhythm(stage.rhythmKey).rate }}
          mode="live"
          title={rhythmLabel(stage.rhythmKey)}
          showMeasurements
          themeAwareGrid
        />
        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Warning signs</p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
              {stage.warningSignsPresent.map((sign) => <li key={sign}>{sign}</li>)}
            </ul>
            <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">Vitals: HR {stage.vitals.hr}, BP {stage.vitals.bp}, SpO2 {stage.vitals.spo2}</p>
          </div>
          <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] p-3">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{stage.decisionPrompt}</p>
            <div className="mt-2 grid gap-2">
              {stage.options.map((option) => (
                <button
                  key={option.action}
                  type="button"
                  onClick={() => decide(option.action)}
                  disabled={session.phase === "complete"}
                  className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-left text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)] disabled:opacity-60"
                >
                  {option.action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>
      <Panel className="space-y-3">
        <ScorePill label="Deterioration score" score={score.percentScore} />
        <ScorePill label="Prevention" score={score.preventionAchieved ? 100 : 45} />
        <p className="text-sm text-[var(--semantic-text-secondary)]">{feedback}</p>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Clinical priorities</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{pathway.description}</p>
        </div>
      </Panel>
    </div>
  );
}

function ReadinessPanel() {
  const profile = useMemo(() => computeEcgReadinessProfile("demo-learner", ECG_PHASE3_DEMO_READINESS_INPUT), []);
  return (
    <Panel className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">ECG Readiness Dashboard</p>
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{profile.overallScore}% overall readiness</h2>
          <p className="text-sm text-[var(--semantic-text-secondary)]">Trend: {profile.overallTrend.replace(/_/g, " ")}. Mastery: {profile.rhythmMasteryPercent}% of ECG rhythms.</p>
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] px-4 py-3 text-right">
          <p className="text-xs font-semibold text-[var(--semantic-text-muted)]">Trajectory</p>
          <p className="text-lg font-bold text-[var(--semantic-success)]">+9% this week</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ECG_PHASE3_READINESS_LABELS.map((domain) => {
          const source = profile.domains.find((candidate) => candidate.domainId === domain.sourceDomain);
          return (
            <div key={domain.label} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{domain.label}</p>
                <span className="text-lg font-bold text-[var(--semantic-text-primary)]">{clampScore((source?.score ?? 0) + domain.scoreOffset)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[var(--semantic-surface-alt)]">
                <div className="h-2 rounded-full bg-[var(--semantic-info)]" style={{ width: `${clampScore((source?.score ?? 0) + domain.scoreOffset)}%` }} />
              </div>
              <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">{source?.recommendedActivity.label}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ClearancesPanel() {
  const roadmap = getClearanceRoadmap(["basic-rhythm-recognition"], ECG_PHASE3_CLEARANCE_METRICS);
  return (
    <Panel className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">ECG Clearances</p>
        <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">Performance-required readiness credentials</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {roadmap.map(({ clearance, eligibility }) => (
          <div key={clearance.id} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{clearance.title}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{clearance.tier} · {eligibility.status.replace(/_/g, " ")}</p>
              </div>
              {eligibility.status === "eligible" || eligibility.status === "earned" ? <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)]" /> : <GraduationCap className="h-5 w-5 text-[var(--semantic-text-muted)]" />}
            </div>
            <div className="mt-3 h-2 rounded-full bg-[var(--semantic-surface-alt)]">
              <div className="h-2 rounded-full bg-[var(--semantic-info)]" style={{ width: `${eligibility.percentageComplete}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{clearance.readinessFor.slice(0, 2).join("; ")}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReportCardPanel() {
  const report = useMemo(
    () => generateEcgReportCard("demo-learner", ECG_PHASE3_DEMO_READINESS_INPUT, ["basic-rhythm-recognition"]),
    [],
  );

  return (
    <Panel className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">ECG Report Card</p>
        <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">Rhythm mastery and role judgment</h2>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        <ScorePill label="Recognition accuracy" score={report.readinessProfile.domains.find((d) => d.domainId === "rhythm_recognition")?.score ?? 0} />
        <ScorePill label="Escalation accuracy" score={report.readinessProfile.domains.find((d) => d.domainId === "acls_critical_rhythms")?.score ?? 0} />
        <ScorePill label="Medication safety" score={ECG_PHASE3_CLEARANCE_METRICS.medicationSafetyScore} />
        <ScorePill label="Deterioration" score={report.readinessProfile.domains.find((d) => d.domainId === "telemetry_interpretation")?.score ?? 0} />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Rhythms mastered</p>
          <ul className="mt-2 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
            {report.topRhythms.map((item) => <li key={item.rhythmKey}>{rhythmLabel(item.rhythmKey)} · {item.score}%</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Weak rhythms</p>
          <ul className="mt-2 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
            {report.bottomRhythms.map((item) => <li key={item.rhythmKey}>{rhythmLabel(item.rhythmKey)} · {item.score}%</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Professional-role performance</p>
          <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">Strong bedside monitoring pattern. Next growth target: earlier escalation when wide-complex tachycardia appears with perfusion changes.</p>
        </div>
      </div>
    </Panel>
  );
}

function RemediationPanel() {
  const profile = useMemo(() => computeEcgReadinessProfile("demo-learner", ECG_PHASE3_DEMO_READINESS_INPUT), []);
  const plan = useMemo(() => generateEcgStudyPlan("demo-learner", ECG_PHASE3_DEMO_DETECTIVE_SCORES, profile), [profile]);

  return (
    <Panel className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">Adaptive ECG Remediation</p>
        <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{plan.weeklyFocus}</h2>
        <p className="text-sm text-[var(--semantic-text-secondary)]">{plan.summary}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {plan.items.slice(0, 9).map((item) => (
          <div key={`${item.contentType}-${item.title}`} className="rounded-lg border border-[var(--semantic-border-soft)] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{item.title}</p>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--semantic-text-muted)]">P{item.priority}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{item.description}</p>
            <p className="mt-2 text-[11px] font-semibold text-[var(--semantic-text-muted)]">{item.contentType.replace(/_/g, " ")} · {item.estimatedMinutes} min</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function EcgInteractiveEcosystemClient() {
  const [activeMode, setActiveMode] = useState<ModeKey>("detective");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("mode") as ModeKey | null;
    if (requestedMode && MODES.some((mode) => mode.key === requestedMode)) {
      setActiveMode(requestedMode);
    }
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8" data-ecg-phase3="interactive-learning-ecosystem">
      <section className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">ECG Clinical Reasoning Phase 3</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
              Interactive telemetry reasoning ecosystem
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Investigate strips, compare look-alikes, manage monitored patients, prevent deterioration, and turn performance gaps into targeted study loops.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-3">
            <ScorePill label="Rhythms" score={100} />
            <ScorePill label="Active modes" score={100} />
            <ScorePill label="Closed loop" score={100} />
          </div>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto" aria-label="ECG interactive modes">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                className={cn(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-semibold",
                  activeMode === mode.key
                    ? "border-[var(--semantic-info)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {mode.label}
              </button>
            );
          })}
        </nav>
      </section>

      {activeMode === "detective" ? <DetectiveModePanel /> : null}
      {activeMode === "compare" ? <CompareContrastPanel /> : null}
      {activeMode === "telemetry" ? <TelemetryShiftPanel /> : null}
      {activeMode === "deterioration" ? <DeteriorationPanel /> : null}
      {activeMode === "readiness" ? <ReadinessPanel /> : null}
      {activeMode === "clearances" ? <ClearancesPanel /> : null}
      {activeMode === "report-card" ? <ReportCardPanel /> : null}
      {activeMode === "remediation" ? <RemediationPanel /> : null}

      <section className="grid gap-3 md:grid-cols-3">
        {[
          { icon: HeartPulse, title: "29-rhythm reasoning library", body: "Every interactive mode reads from the existing Phase 2 clinical reasoning units." },
          { icon: AlertTriangle, title: "Patient-safety scoring", body: "Scores separate recognition from escalation, intervention, medication safety, and prioritization." },
          { icon: LineChart, title: "Subscription-value loop", body: "Weak performance routes into lessons, flashcards, questions, simulations, and repeat cases." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <Icon className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />
              <h2 className="mt-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{item.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{item.body}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
