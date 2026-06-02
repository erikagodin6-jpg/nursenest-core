"use client";

/**
 * VentSettingsVisualizer — interactive settings impact explorer.
 *
 * Lets learners adjust ventilator settings and immediately see how the
 * pressure/flow/volume waveforms change. Demonstrates cause-and-effect
 * relationships:
 *   - PEEP ↑ → baseline pressure higher, FRC increases
 *   - Vt ↑ → higher peak/plateau pressure, larger volume waveform
 *   - RR ↑ → shorter cycle, possible auto-PEEP development
 *   - Compliance ↓ → higher pressures for same volume (ARDS effect)
 *   - Resistance ↑ → higher Ppeak without Pplat change (obstruction)
 *
 * All computation is synchronous (pure functions) — no API calls, no latency.
 */

import { useReducer, useMemo, useState } from "react";
import { VentScalarDisplay } from "@/components/rt-ventilator/vent-scalar-display";
import {
  generateVentWaveform,
  defaultVentConfigForMode,
  type VentWaveformConfig,
  type VentMode,
} from "@/lib/rt-ventilator/vent-waveform-generator";

// ─── Slider definition ─────────────────────────────────────────────────────────

type SliderDef = {
  key: keyof VentWaveformConfig;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  /**
   * Educational annotation shown as the learner adjusts the slider —
   * explains what changes on the waveform and why.
   */
  hint: (value: number) => string;
};

const VC_SLIDERS: SliderDef[] = [
  {
    key: "peep",
    label: "PEEP",
    unit: "cmH₂O",
    min: 0,
    max: 20,
    step: 1,
    hint: (v) =>
      v >= 10
        ? "High PEEP: recruits atelectatic alveoli. Watch for auto-PEEP and hemodynamic effects."
        : v <= 2
          ? "Low PEEP: risk of cyclic atelectasis in hypoxemic patients."
          : "PEEP shifts the pressure baseline. Observe the waveform baseline rise.",
  },
  {
    key: "tidalVolume",
    label: "Tidal Volume",
    unit: "mL",
    min: 200,
    max: 900,
    step: 50,
    hint: (v) =>
      v > 700
        ? "High Vt: volutrauma risk. Consider reducing — Pplat will exceed 30 cmH₂O in stiff lungs."
        : v < 350
          ? "Low Vt: lung-protective (ARDS protocol). Accept higher RR and permissive hypercapnia."
          : "Increasing Vt raises both Ppeak and Pplat. Pplat − PEEP = driving pressure.",
  },
  {
    key: "rr",
    label: "Respiratory Rate",
    unit: "/min",
    min: 6,
    max: 35,
    step: 1,
    hint: (v) =>
      v > 24
        ? "High RR shortens expiratory time. Auto-PEEP risk — watch the flow trace for incomplete exhalation."
        : v < 8
          ? "Low RR: watch for CO₂ retention. Appropriate for inverse ratio or permissive hypercapnia."
          : "RR changes cycle duration. Higher RR compresses expiratory time.",
  },
  {
    key: "ti",
    label: "Inspiratory Time",
    unit: "s",
    min: 0.4,
    max: 2.0,
    step: 0.1,
    hint: (v) =>
      v >= 1.5
        ? "Long Ti: inverse ratio territory. Increases mean airway pressure. Watch for patient discomfort and auto-PEEP."
        : v <= 0.6
          ? "Short Ti: high peak flow needed to deliver Vt in less time. Ppeak rises."
          : "Ti affects I:E ratio and mean airway pressure. Longer Ti = more time for gas distribution.",
  },
  {
    key: "compliance",
    label: "Compliance",
    unit: "mL/cmH₂O",
    min: 15,
    max: 100,
    step: 5,
    hint: (v) =>
      v <= 25
        ? "ARDS range: stiff lungs require much higher pressure for the same volume. Both Ppeak and Pplat rise."
        : v >= 80
          ? "Above normal compliance: emphysema-like physiology. Lower pressures for the same Vt."
          : "Compliance changes affect Pplat. Ppeak − Pplat stays the same — only Pplat moves.",
  },
  {
    key: "resistance",
    label: "Resistance",
    unit: "cmH₂O/L/s",
    min: 3,
    max: 30,
    step: 1,
    hint: (v) =>
      v >= 18
        ? "Severe obstruction (bronchospasm/mucus plug). Ppeak rises dramatically. Pplat unchanged — key distinction."
        : v <= 5
          ? "Normal or low resistance. Small Ppeak − Pplat gap."
          : "Resistance changes affect Ppeak only, not Pplat. Ppeak − Pplat = resistive pressure.",
  },
];

const PC_SLIDERS: SliderDef[] = [
  {
    key: "peep",
    label: "PEEP",
    unit: "cmH₂O",
    min: 0,
    max: 20,
    step: 1,
    hint: (v) => `PEEP ${v} cmH₂O. Effective driving pressure = PIP − PEEP = ${25 - v} cmH₂O (at default PIP 25).`,
  },
  {
    key: "pip",
    label: "PIP",
    unit: "cmH₂O",
    min: 10,
    max: 40,
    step: 1,
    hint: (v) =>
      v > 35
        ? "High PIP: observe Vt — in PC mode, Vt rises with PIP. Pplat is the set PIP."
        : "Increasing PIP increases driving pressure → more flow → larger Vt. Watch the volume trace grow.",
  },
  {
    key: "rr",
    label: "Respiratory Rate",
    unit: "/min",
    min: 6,
    max: 35,
    step: 1,
    hint: (v) =>
      v > 24
        ? "High RR: watch expiratory flow trace — if it does not return to zero, auto-PEEP is developing."
        : "RR changes cycle length. Observe how the breath spacing changes on the x-axis.",
  },
  {
    key: "ti",
    label: "Inspiratory Time",
    unit: "s",
    min: 0.4,
    max: 2.0,
    step: 0.1,
    hint: (v) =>
      v >= 1.5
        ? "Long Ti: more time for flow deceleration. Volume approaches Cst × driving pressure asymptote."
        : "Short Ti: exponential flow cut off early. Vt is lower. Increase PIP or Ti to compensate.",
  },
  {
    key: "compliance",
    label: "Compliance",
    unit: "mL/cmH₂O",
    min: 15,
    max: 100,
    step: 5,
    hint: (v) =>
      v <= 25
        ? "ARDS: stiff lungs. In PC mode, Vt drops dramatically — pressure is constant, volume varies!"
        : "Higher compliance → larger Vt for same PIP. In PC, compliance directly sets Vt.",
  },
  {
    key: "resistance",
    label: "Resistance",
    unit: "cmH₂O/L/s",
    min: 3,
    max: 30,
    step: 1,
    hint: (v) =>
      v >= 15
        ? "High resistance in PC: slower flow deceleration (longer τ). Vt may not reach equilibrium in Ti."
        : "Normal resistance: flow decelerates quickly. Vt close to Cst × driving pressure.",
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

type VisualizerState = VentWaveformConfig;

type Action =
  | { type: "setField"; key: keyof VentWaveformConfig; value: number }
  | { type: "reset"; mode: VentMode };

function reducer(state: VisualizerState, action: Action): VisualizerState {
  switch (action.type) {
    case "setField":
      return { ...state, [action.key]: action.value };
    case "reset":
      return defaultVentConfigForMode(action.mode);
  }
}

// ─── Slider component ─────────────────────────────────────────────────────────

function Slider({
  def,
  value,
  onChange,
}: {
  def: SliderDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const hint = def.hint(value);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-semibold text-[var(--semantic-text-secondary)]">
          {def.label}
        </label>
        <span className="text-xs font-bold text-[var(--semantic-text-primary)]">
          {value} {def.unit}
        </span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--semantic-border-soft)] accent-[var(--semantic-brand)]"
        aria-label={`${def.label}: ${value} ${def.unit}`}
      />
      <p className="text-[10px] leading-snug text-[var(--semantic-text-muted)]">{hint}</p>
    </div>
  );
}

// ─── Mode tabs ─────────────────────────────────────────────────────────────────

const MODES: Array<{ key: VentMode; label: string }> = [
  { key: "volume_control", label: "Volume Control" },
  { key: "pressure_control", label: "Pressure Control" },
  { key: "pressure_support", label: "Pressure Support" },
];

// ─── Main export ───────────────────────────────────────────────────────────────

export function VentSettingsVisualizer() {
  const [mode, setMode] = useState<VentMode>("volume_control");
  const [config, dispatch] = useReducer(reducer, defaultVentConfigForMode("volume_control"));

  function handleModeChange(newMode: VentMode) {
    setMode(newMode);
    dispatch({ type: "reset", mode: newMode });
  }

  const result = useMemo(
    () => generateVentWaveform(config, { breathCount: 3, sampleRate: 80, includePlateau: mode === "volume_control" }),
    [config, mode],
  );

  const sliders = mode === "pressure_control" ? PC_SLIDERS : VC_SLIDERS.slice(0, mode === "pressure_support" ? 4 : 6);

  return (
    <div className="space-y-4" data-nn-vent-settings-visualizer="">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Settings Impact Visualizer</h3>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Adjust ventilator settings to see real-time waveform changes. Understand cause-and-effect relationships.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              mode === m.key
                ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-white"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          onClick={() => dispatch({ type: "reset", mode })}
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-surface-alt)]"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Sliders panel */}
        <div className="space-y-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Settings</p>
          {sliders.map((def) => {
            const raw = config[def.key];
            const value = typeof raw === "number" ? raw : (def.min + def.max) / 2;
            return (
              <Slider
                key={String(def.key)}
                def={def}
                value={value}
                onChange={(v) => dispatch({ type: "setField", key: def.key, value: v })}
              />
            );
          })}
        </div>

        {/* Waveform display */}
        <div className="min-w-0">
          <VentScalarDisplay
            result={result}
            peep={config.peep}
            showDerivedValues
            showAnnotations
          />
        </div>
      </div>
    </div>
  );
}

