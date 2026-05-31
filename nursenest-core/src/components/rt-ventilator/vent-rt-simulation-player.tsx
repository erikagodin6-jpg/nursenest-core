"use client";

/**
 * VentRtSimulationPlayer — step-by-step RT simulation experience.
 *
 * State machine:
 *   "picker"    → learner selects a simulation from the list
 *   "briefing"  → patient context shown before starting
 *   "question"  → waveform + vitals + MCQ shown
 *   "feedback"  → learner's choice + explanation shown
 *   "summary"   → score and key learning points at end
 *
 * Clinical accuracy: waveform is live-generated from the step's VentWaveformConfig.
 * No static images — every waveform is computed at render time.
 */

import { useState, useMemo } from "react";
import { VentScalarDisplay } from "@/components/rt-ventilator/vent-scalar-display";
import { generateVentWaveform } from "@/lib/rt-ventilator/vent-waveform-generator";
import {
  RT_SIMULATION_REGISTRY,
  RT_SIMULATION_DIFFICULTY_LABELS,
  type RtSimulation,
  type SimStep,
  type SimChoice,
} from "@/lib/rt-ventilator/vent-rt-simulation-scenarios";

// ─── State types ───────────────────────────────────────────────────────────────

type PlayerPhase = "picker" | "briefing" | "question" | "feedback" | "summary";

type StepResult = {
  stepIndex: number;
  choiceId: string;
  correct: boolean;
};

// ─── Difficulty badge ──────────────────────────────────────────────────────────

const DIFF_STYLES = {
  basic: "bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)] text-[var(--semantic-success)] border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)]",
  intermediate: "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] text-[var(--semantic-warning)] border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)]",
  advanced: "bg-[color-mix(in_srgb,var(--semantic-error)_12%,transparent)] text-[var(--semantic-error)] border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)]",
};

// ─── Vitals strip ──────────────────────────────────────────────────────────────

function VitalsStrip({ vitals }: { vitals: SimStep["vitals"] }) {
  if (!vitals) return null;
  const items = [
    vitals.hr != null && { label: "HR", value: `${vitals.hr} bpm`, alert: vitals.hr > 120 || vitals.hr < 50 },
    vitals.spo2 != null && { label: "SpO₂", value: `${vitals.spo2}%`, alert: vitals.spo2 < 92 },
    vitals.rr != null && { label: "RR", value: `${vitals.rr}/min`, alert: vitals.rr > 30 || vitals.rr < 8 },
    vitals.bp != null && { label: "BP", value: vitals.bp, alert: false },
    vitals.etco2 != null && { label: "EtCO₂", value: `${vitals.etco2} mmHg`, alert: vitals.etco2 > 55 || vitals.etco2 < 25 },
    vitals.fio2 != null && { label: "FiO₂", value: `${vitals.fio2}%`, alert: vitals.fio2 > 80 },
  ].filter(Boolean) as Array<{ label: string; value: string; alert: boolean }>;

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {item.label}
          </span>
          <span className={`text-sm font-bold ${item.alert ? "text-[var(--semantic-error)]" : "text-[var(--semantic-text-primary)]"}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Waveform panel (live-generated) ──────────────────────────────────────────

function SimWaveformPanel({ step }: { step: SimStep }) {
  const result = useMemo(
    () => generateVentWaveform(step.waveformConfig, { breathCount: 4, sampleRate: 80 }),
    [step.waveformConfig],
  );
  return (
    <VentScalarDisplay
      result={result}
      label={step.waveformLabel ?? "Ventilator scalars"}
      peep={step.waveformConfig.peep}
      showDerivedValues
      showAnnotations
    />
  );
}

// ─── Answer choice button ──────────────────────────────────────────────────────

function ChoiceButton({
  choice,
  selected,
  revealed,
  onSelect,
}: {
  choice: SimChoice;
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
}) {
  let style = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-alt)]";

  if (revealed) {
    if (choice.correct) {
      style = "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
    } else if (selected) {
      style = "border-[var(--semantic-error)] bg-[color-mix(in_srgb,var(--semantic-error)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
    } else {
      style = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)] opacity-60";
    }
  } else if (selected) {
    style = "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
  }

  return (
    <button
      onClick={revealed ? undefined : onSelect}
      disabled={revealed}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition ${style} disabled:cursor-default`}
    >
      <div className="flex items-start gap-2.5">
        {revealed && (
          <span className="mt-0.5 shrink-0 font-bold" aria-hidden>
            {choice.correct ? "✓" : selected ? "✗" : "·"}
          </span>
        )}
        <span>{choice.text}</span>
      </div>
    </button>
  );
}

// ─── Simulation picker ─────────────────────────────────────────────────────────

function SimPicker({ onSelect }: { onSelect: (sim: RtSimulation) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">RT Ventilator Simulations</h3>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Case-based clinical simulations for respiratory therapists. Each simulation tests real-time
          waveform interpretation and clinical decision-making with live-generated ventilator graphics.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {RT_SIMULATION_REGISTRY.map((sim) => (
          <button
            key={sim.id}
            onClick={() => onSelect(sim)}
            className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-left shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--semantic-brand)] hover:shadow-md motion-reduce:transform-none"
            data-nn-sim-card={sim.id}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                {sim.title}
              </p>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${DIFF_STYLES[sim.difficulty]}`}>
                {RT_SIMULATION_DIFFICULTY_LABELS[sim.difficulty]}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-[var(--semantic-text-secondary)]">
              {sim.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[var(--semantic-text-muted)]">
              <span>{sim.steps.length} steps</span>
              <span>·</span>
              <span>~{sim.estimatedMinutes} min</span>
              <span>·</span>
              <span>{sim.patient.split(",")[0]}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {sim.competencies.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[var(--semantic-surface-alt)] px-2 py-0.5 text-[9px] font-semibold text-[var(--semantic-text-muted)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function VentRtSimulationPlayer() {
  const [phase, setPhase] = useState<PlayerPhase>("picker");
  const [sim, setSim] = useState<RtSimulation | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [results, setResults] = useState<StepResult[]>([]);

  const currentStep: SimStep | null = sim ? (sim.steps[stepIdx] ?? null) : null;
  const selectedChoice = currentStep?.choices.find((c) => c.id === selectedChoiceId) ?? null;
  const hasAnswered = phase === "feedback";

  function startSim(selected: RtSimulation) {
    setSim(selected);
    setStepIdx(0);
    setSelectedChoiceId(null);
    setResults([]);
    setPhase("briefing");
  }

  function handleAnswer(choiceId: string) {
    if (!sim || !currentStep) return;
    const choice = currentStep.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    setSelectedChoiceId(choiceId);
    setResults((prev) => [...prev, { stepIndex: stepIdx, choiceId, correct: choice.correct }]);
    setPhase("feedback");
  }

  function handleNext() {
    if (!sim) return;
    if (stepIdx + 1 < sim.steps.length) {
      setStepIdx((i) => i + 1);
      setSelectedChoiceId(null);
      setPhase("question");
    } else {
      setPhase("summary");
    }
  }

  function reset() {
    setSim(null);
    setPhase("picker");
    setStepIdx(0);
    setSelectedChoiceId(null);
    setResults([]);
  }

  // ── Picker ────────────────────────────────────────────────────────────────────
  if (phase === "picker" || !sim) {
    return <SimPicker onSelect={startSim} />;
  }

  // ── Briefing ──────────────────────────────────────────────────────────────────
  if (phase === "briefing") {
    return (
      <div className="space-y-4">
        <button onClick={reset} className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline">
          ← Back to simulations
        </button>
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-[var(--semantic-text-primary)]">{sim.title}</h3>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${DIFF_STYLES[sim.difficulty]}`}>
              {RT_SIMULATION_DIFFICULTY_LABELS[sim.difficulty]}
            </span>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Patient</p>
            <p className="mt-1 text-sm text-[var(--semantic-text-primary)]">{sim.patient}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sim.competencies.map((c) => (
              <span key={c} className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--semantic-text-secondary)]">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-3 text-xs text-[var(--semantic-text-muted)]">
            <span>{sim.steps.length} clinical decisions</span>
            <span>·</span>
            <span>~{sim.estimatedMinutes} minutes</span>
          </div>
        </div>
        <button
          onClick={() => setPhase("question")}
          className="w-full rounded-full bg-[var(--semantic-brand)] py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
        >
          Start Simulation
        </button>
      </div>
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  if (phase === "summary") {
    const score = results.filter((r) => r.correct).length;
    const pct = Math.round((score / results.length) * 100);
    const excellent = pct === 100;
    const passed = pct >= 70;

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Simulation complete
          </p>
          <p className="mt-2 text-4xl font-bold text-[var(--semantic-text-primary)]">{pct}%</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            {score} of {results.length} correct
          </p>
          <p className={`mt-2 text-sm font-semibold ${excellent ? "text-[var(--semantic-success)]" : passed ? "text-[var(--semantic-brand)]" : "text-[var(--semantic-warning)]"}`}>
            {excellent ? "Excellent clinical judgment" : passed ? "Solid performance — review the feedback below" : "Review the clinical content and try again"}
          </p>
        </div>

        <div className="space-y-2">
          {sim.steps.map((step, i) => {
            const r = results[i];
            if (!r) return null;
            const choice = step.choices.find((c) => c.id === r.choiceId);
            return (
              <div key={i} className={`rounded-xl border p-3 ${r.correct ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))]" : "border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_05%,var(--semantic-surface))]"}`}>
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 font-bold ${r.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-error)]"}`}>
                    {r.correct ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">
                      Step {i + 1}: {step.question.slice(0, 80)}…
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--semantic-text-muted)]">
                      Your answer: {choice?.text.slice(0, 60)}…
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">
                      {step.keyLearning}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => startSim(sim)}
            className="flex-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-alt)]"
          >
            Retry
          </button>
          <button
            onClick={reset}
            className="flex-1 rounded-full bg-[var(--semantic-brand)] py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            New Simulation
          </button>
        </div>
      </div>
    );
  }

  // ── Question / Feedback ───────────────────────────────────────────────────────
  if (!currentStep) return null;

  return (
    <div className="space-y-4" data-nn-sim-player="">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <button onClick={reset} className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline">
          ← Exit
        </button>
        <div className="flex flex-1 gap-1">
          {sim.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < stepIdx ? "bg-[var(--semantic-success)]"
                : i === stepIdx ? "bg-[var(--semantic-brand)]"
                : "bg-[var(--semantic-border-soft)]"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-[var(--semantic-text-muted)]">
          {stepIdx + 1}/{sim.steps.length}
        </span>
      </div>

      {/* Clinical context */}
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">Clinical Context</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{currentStep.context}</p>
      </div>

      {/* Vitals */}
      <VitalsStrip vitals={currentStep.vitals} />

      {/* Live waveform */}
      <SimWaveformPanel step={currentStep} />

      {/* Question */}
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{currentStep.question}</p>
        <div className="mt-3 space-y-2">
          {currentStep.choices.map((c) => (
            <ChoiceButton
              key={c.id}
              choice={c}
              selected={selectedChoiceId === c.id}
              revealed={hasAnswered}
              onSelect={() => handleAnswer(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Feedback (shown after answering) */}
      {hasAnswered && selectedChoice && (
        <div className={`rounded-xl border p-4 ${selectedChoice.correct
          ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))]"
          : "border-[color-mix(in_srgb,var(--semantic-error)_35%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_08%,var(--semantic-surface))]"}`}
        >
          <p className={`text-sm font-bold ${selectedChoice.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-error)]"}`}>
            {selectedChoice.correct ? "✓ Correct" : "✗ Incorrect"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {selectedChoice.feedback}
          </p>
          <div className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,transparent)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">Key Learning</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {currentStep.keyLearning}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-full bg-[var(--semantic-brand)] py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            {stepIdx + 1 < sim.steps.length ? "Next Step →" : "View Results"}
          </button>
        </div>
      )}
    </div>
  );
}
