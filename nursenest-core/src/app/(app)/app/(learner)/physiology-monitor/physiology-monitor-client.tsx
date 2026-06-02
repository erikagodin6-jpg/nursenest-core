"use client";

import { useState, useRef, useCallback } from "react";
import { trackSimulationEventClient } from "@/lib/physiology-monitor/simulation-conversion-events.client";
import { MonitorWorkstation } from "@/components/physiology-monitor/monitor-workstation";
import { MonitorSessionReport } from "@/components/physiology-monitor/monitor-session-report";
import { MonitorEngine } from "@/lib/physiology-monitor/monitor-engine";
import { buildSessionReport } from "@/lib/physiology-monitor/monitor-session-report";
import { DETERIORATION_PATTERNS } from "@/lib/physiology-monitor/deterioration-patterns";
import type { MonitorSessionReport as ReportData } from "@/lib/physiology-monitor/monitor-session-report";
import type { MonitorMode } from "@/lib/physiology-monitor/physiology-state";

const CONDITION_GROUPS: Array<{ label: string; keys: string[] }> = [
  {
    label: "Cardiac & Vascular",
    keys: ["stemi", "acs_differential", "afib_rvr", "svt", "vt_to_vf", "cardiac_tamponade",
           "heart_failure", "pulmonary_edema", "pulmonary_embolism"],
  },
  {
    label: "Infectious & Shock",
    keys: ["sepsis", "septic_shock", "complex_shock", "anaphylaxis", "gi_bleed"],
  },
  {
    label: "Respiratory (RT)",
    keys: ["ards", "rt_auto_peep", "rt_mucus_plug", "rt_vent_asynchrony", "rt_accidental_extubation"],
  },
  {
    label: "Metabolic & Neurologic",
    keys: ["hyperkalemia", "dka", "opioid_toxicity", "stroke", "increased_icp"],
  },
  {
    label: "Critical Care (NP)",
    keys: ["multi_system_failure", "tension_pneumothorax"],
  },
];

const LABEL_MAP = new Map(DETERIORATION_PATTERNS.map((p) => [p.key, p.label]));

function ConditionPicker({
  selected,
  mode,
  onSelect,
  onModeChange,
  onStart,
}: {
  selected: string;
  mode: MonitorMode;
  onSelect: (key: string) => void;
  onModeChange: (m: MonitorMode) => void;
  onStart: () => void;
}) {
  const MODES: { key: MonitorMode; label: string }[] = [
    { key: "new_grad",  label: "New Grad" },
    { key: "general",  label: "General" },
    { key: "icu",      label: "ICU" },
    { key: "rt",       label: "RT" },
    { key: "np",       label: "NP / Advanced" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[var(--semantic-text-primary)]">Physiology Monitor</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Select a clinical scenario and practice mode to begin the simulation.
        </p>
      </div>

      {/* Mode selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Practice Mode</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={mode === m.key}
              onClick={() => onModeChange(m.key)}
              className="rounded-full border px-4 py-1.5 text-xs font-semibold transition"
              style={{
                borderColor: mode === m.key ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                background: mode === m.key ? "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))" : "var(--semantic-surface)",
                color: mode === m.key ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition groups */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Clinical Scenario</p>
        {CONDITION_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)]">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.keys.map((key) => {
                const label = LABEL_MAP.get(key);
                if (!label) return null;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected === key}
                    onClick={() => onSelect(key)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium transition"
                    style={{
                      borderColor: selected === key ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                      background: selected === key ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))" : "var(--semantic-surface)",
                      color: selected === key ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-2xl py-3 text-sm font-bold nn-text-on-solid-fill shadow-md transition hover:opacity-95"
        style={{ background: "var(--role-cta, var(--semantic-brand))" }}
      >
        Start Simulation →
      </button>
    </div>
  );
}

export function PhysiologyMonitorClient() {
  const [phase, setPhase] = useState<"picker" | "session" | "report">("picker");
  const [condition, setCondition] = useState("sepsis");
  const [mode, setMode] = useState<MonitorMode>("general");
  const [report, setReport] = useState<ReportData | null>(null);

  // Shared engine ref so the "Finish" button can pull final state
  const engineRef = useRef<MonitorEngine | null>(null);

  const handleStart = useCallback(() => {
    setPhase("session");
    trackSimulationEventClient("simulation_started", { conditionKey: condition, mode });
  }, [condition, mode]);

  const handleFinishSession = useCallback(() => {
    if (!engineRef.current) return;
    const finalState = engineRef.current.getState();
    const history = engineRef.current.getHistory();
    const events = engineRef.current.getScore().events;
    const built = buildSessionReport({
      conditionKey: condition,
      mode,
      finalState,
      history,
      events,
      overlayUsed: false,
    });
    setReport(built);
    setPhase("report");
    trackSimulationEventClient("simulation_completed", {
      conditionKey: condition,
      compositeScore: built.scores.composite,
      harmColor: built.harmIndex.color,
      mode,
    });

    // Persist report to API (fire-and-forget)
    void fetch("/api/learner/monitor-session-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conditionKey: condition,
        mode,
        compositeScore: built.scores.composite,
        clinicalJudgmentScore: built.scores.clinicalJudgment,
        harmIndexScore: built.scores.harmIndex,
        harmColor: built.harmIndex.color,
        reportJson: built,
      }),
    }).catch(() => { /* non-critical */ });
  }, [condition, mode]);

  const handleNewSession = useCallback(() => {
    setReport(null);
    setPhase("picker");
    engineRef.current = null;
  }, []);

  if (phase === "picker") {
    return (
      <ConditionPicker
        selected={condition}
        mode={mode}
        onSelect={setCondition}
        onModeChange={setMode}
        onStart={handleStart}
      />
    );
  }

  if (phase === "report" && report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <MonitorSessionReport
          report={report}
          onStartNew={handleNewSession}
          onClose={handleNewSession}
        />
      </div>
    );
  }

  // Active session
  return (
    <div className="flex flex-col gap-0">
      {/* Session header with finish button */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="inline-block h-2 w-2 rounded-full animate-pulse"
            style={{ background: "var(--semantic-danger)" }}
            aria-hidden
          />
          <span className="text-xs font-semibold text-[var(--semantic-text-primary)] truncate">
            {LABEL_MAP.get(condition) ?? condition}
          </span>
          <span className="hidden sm:inline text-[0.65rem] text-[var(--semantic-text-muted)] uppercase tracking-wide">
            {mode} mode
          </span>
        </div>
        <button
          type="button"
          onClick={handleFinishSession}
          className="shrink-0 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-4 py-1.5 text-xs font-bold text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]"
        >
          Finish &amp; View Report
        </button>
      </div>

      {/* Workstation with engine ref callback */}
      <MonitorWorkstation
        initialCondition={condition}
        initialMode={mode}
        onEngineReady={(engine) => { engineRef.current = engine; }}
      />
    </div>
  );
}
