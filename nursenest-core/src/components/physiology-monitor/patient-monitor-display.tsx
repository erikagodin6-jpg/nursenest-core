"use client";

import { useMemo } from "react";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { VitalTile, BpTile } from "./vital-tile";
import { VentilatorWaveformLive } from "./ventilator-waveform-live";
import { EducationalOverlayPanel } from "./educational-overlay-panel";
import { buildEcgConfigFromState } from "@/lib/physiology-monitor/ecg-bridge";
import { deriveAlarms } from "@/lib/physiology-monitor/physiology-state";
import {
  PROFESSION_VIEW_CONFIGS,
  getVisibleVitals,
  type ProfessionViewConfig,
} from "@/lib/physiology-monitor/profession-views";
import type { PhysiologyState, PhysiologySnapshot, MonitorMode } from "@/lib/physiology-monitor/physiology-state";
import { SIM_SECONDS_PER_TICK } from "@/lib/physiology-monitor/monitor-engine";
import { getDeteriorationPattern } from "@/lib/physiology-monitor/deterioration-patterns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PatientMonitorDisplayProps {
  state: PhysiologyState;
  history: PhysiologySnapshot[];
  mode: MonitorMode;
  showOverlay?: boolean;
  className?: string;
}

// ─── Sim clock ────────────────────────────────────────────────────────────────

function SimClock({ tick }: { tick: number }) {
  const totalSec = tick * SIM_SECONDS_PER_TICK;
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSec % 60).toString().padStart(2, "0");
  return (
    <span data-nn-monitor-clock="" aria-label={`Simulation time: ${m}:${s}`}>
      {m}:{s}
    </span>
  );
}

// ─── Alarm bar ────────────────────────────────────────────────────────────────

function AlarmBar({ state }: { state: PhysiologyState }) {
  const alarms = deriveAlarms(state);
  const critical = alarms.find((a) => a.level === "critical");
  const warning = !critical && alarms.find((a) => a.level === "warning");
  const active = critical ?? warning;
  if (!active) return null;
  return (
    <div
      data-nn-monitor-alarm-bar=""
      data-level={active.level}
      role="alert"
      aria-live="assertive"
    >
      ⚠ {active.message}
    </div>
  );
}

// ─── Stage badge ──────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<PhysiologyState["conditionStage"], string> = {
  early:      "Early",
  developing: "Developing",
  severe:     "Severe",
  critical:   "CRITICAL",
};

function StageBadge({ state }: { state: PhysiologyState }) {
  const pattern = getDeteriorationPattern(state.activeConditionKey);
  return (
    <div className="flex items-center gap-2">
      <span
        data-nn-monitor-stage={state.conditionStage}
        aria-label={`Condition stage: ${STAGE_LABELS[state.conditionStage]}`}
      >
        {STAGE_LABELS[state.conditionStage]}
      </span>
      {pattern && (
        <span style={{ fontSize: "9px", color: "#8fafc8", fontWeight: 500 }}>
          {pattern.label}
        </span>
      )}
    </div>
  );
}

// ─── Vital grid ───────────────────────────────────────────────────────────────

function VitalGrid({
  state,
  history,
  viewConfig,
}: {
  state: PhysiologyState;
  history: PhysiologySnapshot[];
  viewConfig: ProfessionViewConfig;
}) {
  const alarms = deriveAlarms(state);
  const alarmMap = new Map(alarms.map((a) => [a.vital, a]));
  const vitals = getVisibleVitals(viewConfig.mode);

  return (
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      }}
    >
      {vitals.map((vc) => {
        if (vc.key === "systolicBP") {
          return (
            <BpTile
              key="bp"
              state={state}
              history={history}
              alarm={alarmMap.get("BP") ?? alarmMap.get("MAP") ?? null}
            />
          );
        }
        if (vc.key === "diastolicBP" || vc.key === "map") return null;

        return (
          <VitalTile
            key={vc.key}
            config={vc}
            state={state}
            history={history}
            alarm={alarmMap.get(vc.label) ?? null}
            showSparkline={history.length >= 3}
          />
        );
      })}
    </div>
  );
}

// ─── ECG panel ───────────────────────────────────────────────────────────────

function EcgPanel({
  state,
  viewConfig,
}: {
  state: PhysiologyState;
  viewConfig: ProfessionViewConfig;
}) {
  const ecgConfig = useMemo(
    () => buildEcgConfigFromState(state, { educationalMode: viewConfig.ecgMode }),
    // Rebuild ECG config whenever rhythm-relevant state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.ecgRhythmKey, state.ecgRate, state.ecgQrsWidth, state.conditionStage, viewConfig.ecgMode],
  );

  const rhythmLabel = state.ecgRhythmKey.replace(/_/g, " ");

  return (
    <div data-nn-monitor-ecg="">
      <div data-nn-monitor-ecg-label="">
        ECG · Lead II · {Math.round(state.ecgRate > 0 ? state.ecgRate : state.heartRate)} bpm
      </div>
      <EcgLiveStrip
        config={ecgConfig}
        mode="live"
        title={rhythmLabel}
        showMeasurements={viewConfig.showEcgMeasurements}
        themeAwareGrid={false}
        playbackSpeeds={false}
        frameStep={false}
      />
    </div>
  );
}

// ─── Advanced hemodynamics row ────────────────────────────────────────────────

function AdvancedHemo({ state }: { state: PhysiologyState }) {
  const items = [
    { label: "CVP", value: `${Math.round(state.cvp)}`, unit: "cmH₂O", color: "#40c4ff" },
    { label: "CO", value: state.cardiacOutput.toFixed(1), unit: "L/min", color: "#40c4ff" },
    { label: "EtCO₂", value: `${Math.round(state.etco2)}`, unit: "mmHg", color: "#ea80fc" },
    { label: "Lactate", value: state.lactate.toFixed(1), unit: "mmol/L", color: "#ffd740" },
    { label: "K⁺", value: state.potassium.toFixed(1), unit: "mEq/L", color: "#ffd740" },
    { label: "UO", value: `${Math.round(state.urineOutputPerHour)}`, unit: "mL/hr", color: "#ffd740" },
    { label: "GCS", value: `${Math.round(state.gcs)}`, unit: "", color: "#e8edf2" },
  ];

  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1"
      style={{ fontSize: "10px", fontVariantNumeric: "tabular-nums" }}
    >
      {items.map(({ label, value, unit, color }) => (
        <span key={label} style={{ color: "#4a6a88" }}>
          {label}{" "}
          <strong style={{ color, fontSize: "11px" }}>
            {value}
          </strong>
          {unit && <span style={{ fontSize: "8px", marginLeft: 1 }}>{unit}</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PatientMonitorDisplay({
  state,
  history,
  mode,
  showOverlay = false,
  className = "",
}: PatientMonitorDisplayProps) {
  const viewConfig = PROFESSION_VIEW_CONFIGS[mode];
  const priorState = history.length >= 2 ? history[history.length - 2]?.state : undefined;

  return (
    <div
      data-nn-monitor=""
      className={className}
      aria-label={`Patient monitor — ${viewConfig.label} view`}
    >
      {/* Alarm bar */}
      <AlarmBar state={state} />

      {/* Header */}
      <div data-nn-monitor-header="">
        <StageBadge state={state} />
        <div style={{ flex: 1 }} />
        <SimClock tick={state.tick} />
        <span
          style={{
            fontSize: "8px",
            color: "#2a4a6e",
            background: "#0f1e2e",
            border: "1px solid #1e3450",
            borderRadius: 3,
            padding: "2px 6px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {viewConfig.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-3">
        {/* Vital grid */}
        <VitalGrid state={state} history={history} viewConfig={viewConfig} />

        {/* ECG */}
        {viewConfig.showEcg && (
          <EcgPanel state={state} viewConfig={viewConfig} />
        )}

        {/* Advanced hemodynamics inline bar */}
        {viewConfig.showAdvancedHemodynamics && (
          <AdvancedHemo state={state} />
        )}

        {/* Ventilator waveforms */}
        {viewConfig.showVentilatorWaveforms && state.isVentilated && (
          <VentilatorWaveformLive
            state={state}
            show={["pressure", "flow", "volume"]}
          />
        )}

        {/* Educational overlay */}
        {showOverlay && (
          <div style={{ borderTop: "1px solid #1e3450", paddingTop: 10 }}>
            <EducationalOverlayPanel
              state={state}
              priorState={priorState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
