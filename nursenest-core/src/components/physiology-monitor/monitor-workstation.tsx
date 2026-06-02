"use client";

import "./patient-monitor-display.css";

import { useEffect, useRef, useState, useCallback } from "react";
import { PatientMonitorDisplay } from "./patient-monitor-display";
import { TrendPanel } from "./trend-panel";
import { InterventionPanel } from "./intervention-panel";
import {
  MonitorEngine,
  REAL_MS_PER_TICK,
  SIM_SECONDS_PER_TICK,
} from "@/lib/physiology-monitor/monitor-engine";
import { DETERIORATION_PATTERNS } from "@/lib/physiology-monitor/deterioration-patterns";
import { getVisibleVitals, PROFESSION_VIEW_CONFIGS } from "@/lib/physiology-monitor/profession-views";
import type { PhysiologyState, PhysiologySnapshot, MonitorMode } from "@/lib/physiology-monitor/physiology-state";

// ─── Color map for trend panel ────────────────────────────────────────────────

const VITAL_COLOR: Record<string, string> = {
  heartRate:           "#00e676",
  systolicBP:          "#e8edf2",
  spo2:                "#00e5ff",
  respiratoryRate:     "#ffd740",
  temperature:         "#ff9100",
  etco2:               "#ea80fc",
  cvp:                 "#40c4ff",
  cardiacOutput:       "#40c4ff",
  icp:                 "#ff1744",
  urineOutputPerHour:  "#ffd740",
};

// ─── Mode selector ────────────────────────────────────────────────────────────

const MODES: MonitorMode[] = ["new_grad", "general", "icu", "rt", "np"];

function ModeSelector({
  mode,
  onChange,
}: {
  mode: MonitorMode;
  onChange: (m: MonitorMode) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap" aria-label="Monitor mode">
      {MODES.map((m) => {
        const cfg = PROFESSION_VIEW_CONFIGS[m];
        return (
          <button
            key={m}
            type="button"
            data-nn-monitor-mode-pill=""
            aria-pressed={mode === m}
            onClick={() => onChange(m)}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Condition selector ────────────────────────────────────────────────────────

function ConditionSelector({
  current,
  onChange,
}: {
  current: string;
  onChange: (key: string) => void;
}) {
  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#0f1e2e",
        border: "1px solid #1e3450",
        borderRadius: 4,
        color: "#8fafc8",
        fontSize: "9px",
        fontWeight: 600,
        padding: "3px 8px",
        fontFamily: "var(--mon-font, monospace)",
        letterSpacing: "0.04em",
        cursor: "pointer",
      }}
      aria-label="Select condition"
    >
      {DETERIORATION_PATTERNS.map((p) => (
        <option key={p.key} value={p.key}>
          {p.label}
        </option>
      ))}
    </select>
  );
}

// ─── Simulation controls ──────────────────────────────────────────────────────

function SimControls({
  running,
  onToggle,
  onReset,
  tickMs,
  onSpeedChange,
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  tickMs: number;
  onSpeedChange: (ms: number) => void;
}) {
  const SPEEDS = [
    { label: "0.5×", ms: REAL_MS_PER_TICK * 2 },
    { label: "1×",   ms: REAL_MS_PER_TICK },
    { label: "2×",   ms: REAL_MS_PER_TICK / 2 },
    { label: "5×",   ms: REAL_MS_PER_TICK / 5 },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        data-nn-monitor-intervention-btn=""
        onClick={onToggle}
        aria-label={running ? "Pause simulation" : "Resume simulation"}
      >
        {running ? "⏸ Pause" : "▶ Run"}
      </button>
      <button
        type="button"
        data-nn-monitor-intervention-btn=""
        onClick={onReset}
        aria-label="Reset simulation"
      >
        ↺ Reset
      </button>
      <div className="flex gap-1">
        {SPEEDS.map(({ label, ms }) => (
          <button
            key={label}
            type="button"
            data-nn-monitor-mode-pill=""
            aria-pressed={tickMs === ms}
            onClick={() => onSpeedChange(ms)}
            style={{ fontSize: "8px", padding: "2px 6px" }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Score display ────────────────────────────────────────────────────────────

function ScoreBar({ state, history }: { state: PhysiologyState; history: PhysiologySnapshot[] }) {
  const elapsed = state.tick * SIM_SECONDS_PER_TICK;
  const m = Math.floor(elapsed / 60);
  const s = Math.floor(elapsed % 60);

  return (
    <div
      className="flex gap-4 flex-wrap"
      style={{ fontSize: "9px", color: "#4a6a88", fontVariantNumeric: "tabular-nums" }}
    >
      <span>
        Sim time: <strong style={{ color: "#8fafc8" }}>{m}:{String(s).padStart(2, "0")}</strong>
      </span>
      <span>
        Ticks: <strong style={{ color: "#8fafc8" }}>{state.tick}</strong>
      </span>
      <span>
        Active Rx: <strong style={{ color: "#00e5ff" }}>{state.activeInterventions.length}</strong>
      </span>
      <span>
        History: <strong style={{ color: "#4a6a88" }}>{history.length} pts</strong>
      </span>
    </div>
  );
}

// ─── Main workstation ─────────────────────────────────────────────────────────

export interface MonitorWorkstationProps {
  /** Starting condition key. */
  initialCondition?: string;
  /** Starting monitor mode. */
  initialMode?: MonitorMode;
  /** Hide simulation controls (for embedding in case studies). */
  hideControls?: boolean;
  /** Hide trend panel. */
  hideTrend?: boolean;
  /** Hide intervention panel. */
  hideInterventions?: boolean;
  /** Show educational overlay by default. */
  defaultOverlay?: boolean;
  className?: string;
  /** Called immediately after engine is initialised — allows parent to hold a reference. */
  onEngineReady?: (engine: MonitorEngine) => void;
}

export function MonitorWorkstation({
  initialCondition = "sepsis",
  initialMode = "general",
  hideControls = false,
  hideTrend = false,
  hideInterventions = false,
  defaultOverlay = false,
  className = "",
  onEngineReady,
}: MonitorWorkstationProps) {
  const engineRef = useRef<MonitorEngine | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<PhysiologyState | null>(null);
  const [history, setHistory] = useState<PhysiologySnapshot[]>([]);
  const [mode, setMode] = useState<MonitorMode>(initialMode);
  const [running, setRunning] = useState(true);
  const [tickMs, setTickMs] = useState(REAL_MS_PER_TICK);
  const [showOverlay, setShowOverlay] = useState(defaultOverlay);
  const [condition, setCondition] = useState(initialCondition);

  // Initialise engine
  useEffect(() => {
    engineRef.current = new MonitorEngine(condition);
    onEngineReady?.(engineRef.current);
    const s = engineRef.current.getState();
    setState({ ...s });
    setHistory(engineRef.current.getHistory());
  }, [condition]);

  // Tick loop
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (!engineRef.current) return;
      engineRef.current.tick();
      setState({ ...engineRef.current.getState() });
      setHistory(engineRef.current.getHistory());
    }, tickMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tickMs]);

  const handleIntervene = useCallback((key: string) => {
    if (!engineRef.current) return { ok: false, message: "Engine not ready" };
    const result = engineRef.current.applyIntervention(key);
    setState({ ...engineRef.current.getState() });
    setHistory(engineRef.current.getHistory());
    return result;
  }, []);

  const handleReset = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    setState({ ...engineRef.current.getState() });
    setHistory(engineRef.current.getHistory());
  }, []);

  const handleConditionChange = useCallback((key: string) => {
    setCondition(key);
    // engine reinit handled by effect above
  }, []);

  if (!state) {
    return (
      <div
        data-nn-monitor=""
        style={{ padding: 24, color: "#4a6a88", fontSize: 11 }}
        aria-busy="true"
      >
        Initialising monitor…
      </div>
    );
  }

  // Build trend vitals list from current view config
  const trendVitals = getVisibleVitals(mode)
    .filter((v) => !["systolicBP", "diastolicBP", "map", "painScore"].includes(v.key))
    .slice(0, 6)
    .map((v) => ({
      key: v.key as keyof PhysiologySnapshot["state"],
      label: v.label,
      unit: v.unit,
      color: VITAL_COLOR[v.key] ?? "#8fafc8",
    }));

  const viewConfig = PROFESSION_VIEW_CONFIGS[mode];

  return (
    <div
      className={`flex flex-col gap-0 ${className}`}
      style={{ fontFamily: "var(--mon-font, monospace)" }}
      aria-label="Physiology monitor workstation"
    >
      {/* ── Toolbar ── */}
      {!hideControls && (
        <div
          style={{
            background: "#0a1520",
            border: "1px solid #1e3450",
            borderRadius: "10px 10px 0 0",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            borderBottom: "none",
          }}
        >
          <ConditionSelector current={condition} onChange={handleConditionChange} />
          <div style={{ flex: 1 }} />
          <ModeSelector mode={mode} onChange={setMode} />
          <SimControls
            running={running}
            onToggle={() => setRunning((v) => !v)}
            onReset={handleReset}
            tickMs={tickMs}
            onSpeedChange={setTickMs}
          />
        </div>
      )}

      {/* ── Main layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: hideTrend ? "1fr" : "1fr 260px",
          gap: 0,
          background: "#0a1520",
          border: "1px solid #1e3450",
          borderRadius: hideControls ? 10 : "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        {/* Left: monitor display */}
        <div>
          <PatientMonitorDisplay
            state={state}
            history={history}
            mode={mode}
            showOverlay={showOverlay}
          />

          {/* Overlay toggle + score bar */}
          <div
            style={{
              padding: "8px 14px 10px",
              borderTop: "1px solid #1e3450",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              data-nn-monitor-mode-pill=""
              aria-pressed={showOverlay}
              onClick={() => setShowOverlay((v) => !v)}
              style={{ fontSize: "8px" }}
            >
              {showOverlay ? "▾ Hide Explanations" : "▸ Explain Changes"}
            </button>
            <ScoreBar state={state} history={history} />
          </div>

          {/* Intervention panel */}
          {!hideInterventions && (
            <div
              style={{
                padding: "10px 14px 14px",
                borderTop: "1px solid #1e3450",
              }}
            >
              <InterventionPanel state={state} onIntervene={handleIntervene} />
            </div>
          )}
        </div>

        {/* Right: trend panel */}
        {!hideTrend && (
          <div
            style={{
              borderLeft: "1px solid #1e3450",
              padding: 12,
              background: "#0a1520",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <TrendPanel history={history} vitals={trendVitals} />

            {/* Mode description */}
            <div style={{ borderTop: "1px solid #152336", paddingTop: 10 }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                View Mode
              </div>
              <p style={{ fontSize: "9px", color: "#4a6a88", margin: 0, lineHeight: 1.5 }}>
                {viewConfig.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
