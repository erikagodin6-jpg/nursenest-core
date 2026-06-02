"use client";

/**
 * VentAdvancedSimulationPlayer — plays all Phase 3B-F simulations.
 *
 * Supports:
 *   - Branching pathways based on choice.branchToKey
 *   - Consequence of inaction panel (mandatory display after correct answers)
 *   - Vitals strip, labs, imaging panels
 *   - Waveform display when step has a waveformConfig
 *   - Category filtering and difficulty badges
 *   - Score summary at end
 */

import { useState, useMemo } from "react";
import { VentScalarDisplay } from "@/components/rt-ventilator/vent-scalar-display";
import { generateVentWaveform } from "@/lib/rt-ventilator/vent-waveform-generator";
import {
  SIM_CATEGORY_LABELS,
  SIM_CATEGORY_DESCRIPTIONS,
  type AdvancedSimulation,
  type AdvancedSimStep,
  type SimulationCategory,
} from "@/lib/rt-ventilator/vent-advanced-simulation-engine";
import { EMERGENCY_SIMULATIONS } from "@/lib/rt-ventilator/vent-emergency-simulations";
import { NICU_SIMULATIONS } from "@/lib/rt-ventilator/vent-nicu-simulations";
import { PICU_SIMULATIONS } from "@/lib/rt-ventilator/vent-picu-simulations";
import { ECMO_SIMULATIONS } from "@/lib/rt-ventilator/vent-ecmo-simulations";
import { TRANSPORT_SIMULATIONS } from "@/lib/rt-ventilator/vent-transport-simulations";

// All simulations across all categories
const ALL_SIMS: AdvancedSimulation[] = [
  ...EMERGENCY_SIMULATIONS,
  ...NICU_SIMULATIONS,
  ...PICU_SIMULATIONS,
  ...ECMO_SIMULATIONS,
  ...TRANSPORT_SIMULATIONS,
];

const CATEGORY_ICONS: Record<SimulationCategory, string> = {
  waveform_detective: "🔍",
  emergency: "🚨",
  nicu: "👶",
  picu: "🧒",
  ecmo: "❤",
  transport: "🚁",
  foundational: "📚",
};

const DIFF_STYLES = {
  basic: "text-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)] border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)]",
  intermediate: "text-[var(--semantic-warning)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)]",
  advanced: "text-[var(--semantic-error)] bg-[color-mix(in_srgb,var(--semantic-error)_12%,transparent)] border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)]",
};

// ─── Vitals display ────────────────────────────────────────────────────────────

function VitalsStrip({ vitals }: { vitals: AdvancedSimStep["vitals"] }) {
  if (!vitals) return null;
  const items = [
    vitals.hr != null && { label: "HR", value: `${vitals.hr}`, unit: "bpm", alert: vitals.hr > 120 || vitals.hr < 50 },
    vitals.spo2 != null && { label: "SpO₂", value: `${vitals.spo2}`, unit: "%", alert: vitals.spo2 < 90 },
    vitals.rr != null && { label: "RR", value: `${vitals.rr}`, unit: "/min", alert: vitals.rr > 30 },
    vitals.bp != null && { label: "BP", value: vitals.bp, unit: "", alert: false },
    vitals.temp != null && { label: "Temp", value: `${vitals.temp}`, unit: "°C", alert: vitals.temp > 38.5 || vitals.temp < 36.0 },
    vitals.map_bp != null && { label: "MAP", value: `${vitals.map_bp}`, unit: "mmHg", alert: vitals.map_bp < 65 },
    vitals.etco2 != null && { label: "EtCO₂", value: `${vitals.etco2}`, unit: "mmHg", alert: vitals.etco2 > 55 },
    vitals.fio2 != null && { label: "FiO₂", value: `${vitals.fio2}`, unit: "%", alert: vitals.fio2 > 80 },
    vitals.gcs != null && { label: "GCS", value: `${vitals.gcs}`, unit: "", alert: vitals.gcs < 9 },
    vitals.lactate != null && { label: "Lactate", value: `${vitals.lactate}`, unit: "mmol/L", alert: (vitals.lactate ?? 0) > 2.0 },
  ].filter(Boolean) as Array<{ label: string; value: string; unit: string; alert: boolean }>;

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{item.label}</span>
          <span className={`text-sm font-bold ${item.alert ? "text-[var(--semantic-error)]" : "text-[var(--semantic-text-primary)]"}`}>
            {item.value} {item.unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Labs display ──────────────────────────────────────────────────────────────

function LabsPanel({ labs }: { labs: AdvancedSimStep["labs"] }) {
  if (!labs) return null;
  const items = [
    labs.ph != null && { label: "pH", value: labs.ph.toFixed(2), alert: labs.ph < 7.30 || labs.ph > 7.50 },
    labs.pao2 != null && { label: "PaO₂", value: `${labs.pao2}`, unit: "mmHg", alert: labs.pao2 < 60 },
    labs.paco2 != null && { label: "PaCO₂", value: `${labs.paco2}`, unit: "mmHg", alert: labs.paco2 > 55 || labs.paco2 < 30 },
    labs.hco3 != null && { label: "HCO₃", value: `${labs.hco3}`, unit: "mEq/L", alert: false },
    labs.pf_ratio != null && { label: "P/F", value: `${labs.pf_ratio}`, alert: labs.pf_ratio < 200 },
    labs.lactate != null && { label: "Lactate", value: `${labs.lactate}`, unit: "mmol/L", alert: (labs.lactate ?? 0) > 2.0 },
    labs.hgb != null && { label: "Hgb", value: `${labs.hgb}`, unit: "g/L", alert: (labs.hgb ?? 999) < 80 },
  ].filter(Boolean) as Array<{ label: string; value: string; unit?: string; alert: boolean }>;

  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">ABG / Labs</p>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-[var(--semantic-text-muted)]">{item.label}</span>
            <span className={`text-sm font-bold ${item.alert ? "text-[var(--semantic-error)]" : "text-[var(--semantic-text-primary)]"}`}>
              {item.value}{item.unit ? ` ${item.unit}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Consequence panel ─────────────────────────────────────────────────────────

function ConsequencePanel({ step }: { step: AdvancedSimStep }) {
  const coi = step.consequenceOfInaction;
  if (!coi) return null;
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_05%,transparent)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-error)]">
        ⚠ What happens if you do nothing?
      </p>
      <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{coi.description}</p>
      <div className="mt-3 space-y-1.5">
        {coi.timeline.map((event, i) => (
          <div key={i} className="flex gap-3 text-xs">
            <span className="w-28 shrink-0 font-semibold text-[var(--semantic-error)]">{event.timeframe}</span>
            <span className="text-[var(--semantic-text-secondary)]">{event.event}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-error)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_08%,transparent)] px-3 py-2 text-xs font-bold leading-relaxed text-[var(--semantic-error)]">
        ⚡ {coi.clinicalPearl}
      </p>
    </div>
  );
}

// ─── Step waveform ─────────────────────────────────────────────────────────────

function StepWaveform({ step }: { step: AdvancedSimStep }) {
  const cfg = step.waveformConfig;
  if (!cfg) return null;
  const result = useMemo(
    () => generateVentWaveform(cfg, { breathCount: 3, sampleRate: 80 }),
    [cfg],
  );
  return (
    <VentScalarDisplay
      result={result}
      label={step.waveformLabel ?? "Ventilator scalars"}
      peep={cfg.peep}
      showDerivedValues
      showAnnotations
    />
  );
}

// ─── Simulation picker ─────────────────────────────────────────────────────────

const FILTERABLE_CATEGORIES: SimulationCategory[] = ["emergency", "nicu", "picu", "ecmo", "transport"];

function SimulationPicker({ onSelect }: { onSelect: (s: AdvancedSimulation) => void }) {
  const [cat, setCat] = useState<SimulationCategory | "all">("all");

  const shown = cat === "all" ? ALL_SIMS : ALL_SIMS.filter((s) => s.category === cat);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Advanced Clinical Simulations</h3>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          {ALL_SIMS.length} case-based simulations across ventilator emergencies, NICU, PICU, ECMO, and transport.
          Live waveforms. Branching pathways. Consequence of inaction on every step.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === "all" ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-white" : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"}`}
        >
          All ({ALL_SIMS.length})
        </button>
        {FILTERABLE_CATEGORIES.map((c) => {
          const count = ALL_SIMS.filter((s) => s.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === c ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-white" : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"}`}
            >
              {CATEGORY_ICONS[c]} {SIM_CATEGORY_LABELS[c]} ({count})
            </button>
          );
        })}
      </div>

      {cat !== "all" && (
        <p className="text-xs text-[var(--semantic-text-muted)]">{SIM_CATEGORY_DESCRIPTIONS[cat]}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-left shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--semantic-brand)] hover:shadow-md motion-reduce:transform-none"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-[var(--semantic-text-muted)]">
                  {CATEGORY_ICONS[s.category]} {SIM_CATEGORY_LABELS[s.category]}
                </span>
                <p className="text-sm font-bold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                  {s.title}
                </p>
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${DIFF_STYLES[s.difficulty]}`}>
                {s.difficulty}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-[var(--semantic-text-secondary)] line-clamp-2">{s.summary}</p>
            <div className="mt-2 text-[10px] text-[var(--semantic-text-muted)]">
              {Object.keys(s.steps).length} steps · ~{s.estimatedMinutes} min · {s.patient.split(",")[0]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Active simulation ─────────────────────────────────────────────────────────

function ActiveSimulation({ sim, onBack }: { sim: AdvancedSimulation; onBack: () => void }) {
  const [stepKey, setStepKey] = useState(sim.entryStepKey);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Array<{ stepKey: string; correct: boolean }>>([]);
  const [done, setDone] = useState(false);

  const currentStep = sim.steps[stepKey];

  function handleAnswer(id: string) {
    if (!currentStep) return;
    const choice = currentStep.choices.find((c) => c.id === id);
    setAnswerId(id);
    setRevealed(true);
    setResults((r) => [...r, { stepKey, correct: choice?.correct ?? false }]);
  }

  function handleNext() {
    if (!currentStep || !answerId) return;
    const choice = currentStep.choices.find((c) => c.id === answerId);
    const nextKey = choice?.branchToKey ?? currentStep.nextKey;
    if (nextKey === "end" || !sim.steps[nextKey]) {
      setDone(true);
    } else {
      setStepKey(nextKey);
      setAnswerId(null);
      setRevealed(false);
    }
  }

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const pct = Math.round((correct / results.length) * 100);
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline">← Simulations</button>
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Complete</p>
          <p className="mt-2 text-4xl font-bold text-[var(--semantic-text-primary)]">{pct}%</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{correct} of {results.length} correct</p>
          <p className="mt-2 text-sm font-semibold text-[var(--semantic-brand)]">{sim.title}</p>
        </div>
        <button onClick={onBack} className="w-full rounded-full bg-[var(--semantic-brand)] py-3 text-sm font-bold text-white hover:opacity-90">
          Choose Another Simulation
        </button>
      </div>
    );
  }

  if (!currentStep) return null;

  const stepKeys = Object.keys(sim.steps);
  const stepIdx = stepKeys.indexOf(stepKey);
  const selectedChoice = currentStep.choices.find((c) => c.id === answerId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline">← Exit</button>
        <div className="flex flex-1 gap-1">
          {stepKeys.map((k, i) => (
            <div key={k} className={`h-1.5 flex-1 rounded-full ${i < stepIdx ? "bg-[var(--semantic-success)]" : i === stepIdx ? "bg-[var(--semantic-brand)]" : "bg-[var(--semantic-border-soft)]"}`} />
          ))}
        </div>
        <span className="text-xs font-semibold text-[var(--semantic-text-muted)]">{stepIdx + 1}/{stepKeys.length}</span>
      </div>

      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,transparent)] bg-[color-mix(in_srgb,var(--semantic-info)_05%,transparent)] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">Clinical Context</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{currentStep.context}</p>
      </div>

      <VitalsStrip vitals={currentStep.vitals} />
      <LabsPanel labs={currentStep.labs} />

      {currentStep.imaging && (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Imaging</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{currentStep.imaging}</p>
        </div>
      )}

      <StepWaveform step={currentStep} />

      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{currentStep.question}</p>
        <div className="mt-3 space-y-2">
          {currentStep.choices.map((c) => {
            let cls = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-alt)]";
            if (revealed) {
              if (c.correct) cls = "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
              else if (c.id === answerId) cls = "border-[var(--semantic-error)] bg-[color-mix(in_srgb,var(--semantic-error)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
              else cls = "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)] opacity-50";
            } else if (c.id === answerId) {
              cls = "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]";
            }
            return (
              <button key={c.id} disabled={revealed}
                onClick={() => handleAnswer(c.id)}
                className={`flex w-full items-start gap-2 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition disabled:cursor-default ${cls}`}
              >
                {revealed && (
                  <span className={`mt-0.5 shrink-0 font-bold ${c.correct ? "text-[var(--semantic-success)]" : c.id === answerId ? "text-[var(--semantic-error)]" : "text-[var(--semantic-text-muted)]"}`}>
                    {c.correct ? "✓" : c.id === answerId ? "✗" : "·"}
                  </span>
                )}
                <span>{c.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {revealed && selectedChoice && (
        <div className={`rounded-xl border p-4 ${selectedChoice.correct
          ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,transparent)]"
          : "border-[color-mix(in_srgb,var(--semantic-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-error)_06%,transparent)]"}`}
        >
          <p className={`text-sm font-bold ${selectedChoice.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-error)]"}`}>
            {selectedChoice.correct ? "✓ Correct" : "✗ Incorrect"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{selectedChoice.feedback}</p>
          <div className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,transparent)] px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">Key Learning</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{currentStep.keyLearning}</p>
          </div>
        </div>
      )}

      {revealed && <ConsequencePanel step={currentStep} />}

      {revealed && (
        <button onClick={handleNext} className="w-full rounded-full bg-[var(--semantic-brand)] py-2.5 text-sm font-bold text-white hover:opacity-90">
          {currentStep.nextKey === "end" ? "View Results" : "Next Step →"}
        </button>
      )}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function VentAdvancedSimulationPlayer() {
  const [selected, setSelected] = useState<AdvancedSimulation | null>(null);

  return (
    <div data-nn-vent-advanced-player="">
      {selected ? (
        <ActiveSimulation sim={selected} onBack={() => setSelected(null)} />
      ) : (
        <SimulationPicker onSelect={setSelected} />
      )}
    </div>
  );
}
