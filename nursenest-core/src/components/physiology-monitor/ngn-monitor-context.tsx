"use client";

/**
 * NgnMonitorContext
 *
 * Embeds a live Physiology Monitor as clinical context for NGN question types
 * (Bowtie, Matrix, SATA, Prioritization, Delegation, Handoff).
 *
 * The learner views the monitor display — vital signs, ECG, alarms — before
 * answering the structured NGN question. The monitor continues running while
 * the learner works through the question, making clinical deterioration visible.
 *
 * Usage:
 *   <NgnMonitorContext
 *     conditionKey="stemi"
 *     mode="icu"
 *     openingStage="developing"
 *     frozenAtStage={false}  // false = continues deteriorating
 *   >
 *     <BowtiequestionComponent ... />
 *   </NgnMonitorContext>
 *
 * The component provides `useNgnMonitorState()` context for the child question
 * to read current vitals and use them as answer-scoring inputs.
 */

import "./patient-monitor-display.css";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PatientMonitorDisplay } from "./patient-monitor-display";
import { EducationalOverlayPanel } from "./educational-overlay-panel";
import {
  MonitorEngine,
  REAL_MS_PER_TICK,
  SIM_SECONDS_PER_TICK,
} from "@/lib/physiology-monitor/monitor-engine";
import type { PhysiologyState, PhysiologySnapshot, MonitorMode, MonitorAlarm } from "@/lib/physiology-monitor/physiology-state";
import { deriveAlarms } from "@/lib/physiology-monitor/physiology-state";

// ─── Context ──────────────────────────────────────────────────────────────────

export interface NgnMonitorState {
  /** Current live physiology state. */
  vitals: PhysiologyState | null;
  /** Whether the condition is in a critical/severe stage. */
  isEmergency: boolean;
  /** Current ECG rhythm description. */
  rhythmLabel: string;
  /** Formatted blood pressure string. */
  bloodPressure: string;
  /** SpO₂ value. */
  spo2: number | null;
  /** Heart rate. */
  heartRate: number | null;
  /** Active alarm count. */
  alarmCount: number;
  /** Most critical alarm label. */
  topAlarm: string | null;
  /** Elapsed simulation seconds. */
  simSeconds: number;
}

const NgnMonitorCtx = createContext<NgnMonitorState>({
  vitals: null, isEmergency: false, rhythmLabel: "—", bloodPressure: "—",
  spo2: null, heartRate: null, alarmCount: 0, topAlarm: null, simSeconds: 0,
});

export function useNgnMonitorState(): NgnMonitorState {
  return useContext(NgnMonitorCtx);
}

// ─── NGN question types that can embed a monitor ─────────────────────────────

export type NgnQuestionType = "bowtie" | "matrix" | "sata" | "prioritization" | "delegation" | "handoff";

const NGN_TYPE_LABELS: Record<NgnQuestionType, string> = {
  bowtie:         "Bowtie — Clinical Reasoning",
  matrix:         "Matrix — Categorize Interventions",
  sata:           "Select All That Apply",
  prioritization: "Prioritization",
  delegation:     "Delegation",
  handoff:        "SBAR Handoff",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NgnMonitorContextProps {
  /** Children — the NGN question component(s). */
  children: ReactNode;
  /** Condition driving the monitor. */
  conditionKey: string;
  /** Monitor profession mode. */
  mode?: MonitorMode;
  /**
   * When true, the engine freezes at the initial state — learner sees a static
   * clinical snapshot rather than a progressing deterioration.
   */
  frozenAtStart?: boolean;
  /** Which NGN question type is being asked. */
  questionType?: NgnQuestionType;
  /** Optional clinical scenario text displayed above the monitor. */
  clinicalContext?: string;
  /** Whether to show the educational overlay panel by default. */
  showExplanations?: boolean;
  /** Whether to hide the monitor panel on small screens by default. */
  defaultMonitorCollapsed?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NgnMonitorContext({
  children,
  conditionKey,
  mode = "general",
  frozenAtStart = false,
  questionType,
  clinicalContext,
  showExplanations = false,
  defaultMonitorCollapsed = false,
}: NgnMonitorContextProps) {
  const engineRef = useRef<MonitorEngine | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<PhysiologyState | null>(null);
  const [history, setHistory] = useState<PhysiologySnapshot[]>([]);
  const [monitorExpanded, setMonitorExpanded] = useState(!defaultMonitorCollapsed);
  const [showOverlay, setShowOverlay] = useState(showExplanations);

  // Init engine
  useEffect(() => {
    engineRef.current = new MonitorEngine(conditionKey);
    const s = engineRef.current.getState();
    setState({ ...s });
    setHistory(engineRef.current.getHistory());

    if (!frozenAtStart) {
      intervalRef.current = setInterval(() => {
        if (!engineRef.current) return;
        engineRef.current.tick();
        setState({ ...engineRef.current.getState() });
        setHistory(engineRef.current.getHistory());
      }, REAL_MS_PER_TICK);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [conditionKey, frozenAtStart]);

  // Derive NGN context value
  const contextValue = useMemo<NgnMonitorState>(() => {
    if (!state) return {
      vitals: null, isEmergency: false, rhythmLabel: "—", bloodPressure: "—",
      spo2: null, heartRate: null, alarmCount: 0, topAlarm: null, simSeconds: 0,
    };
    const alarms: MonitorAlarm[] = deriveAlarms(state);
    const critical = ["severe", "critical"].includes(state.conditionStage);
    const topAlarm = alarms.find((a) => a.level === "critical")?.message
      ?? alarms.find((a) => a.level === "warning")?.message
      ?? null;
    return {
      vitals: state,
      isEmergency: critical,
      rhythmLabel: state.ecgRhythmKey?.replace(/_/g, " ") ?? "—",
      bloodPressure: state.systolicBP && state.diastolicBP
        ? `${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)}`
        : "—",
      spo2: state.spo2 ?? null,
      heartRate: state.heartRate ?? null,
      alarmCount: alarms.length,
      topAlarm,
      simSeconds: (state.tick ?? 0) * SIM_SECONDS_PER_TICK,
    };
  }, [state]);

  return (
    <NgnMonitorCtx.Provider value={contextValue}>
      <div className="nn-ngn-monitor-context flex flex-col gap-0" data-nn-monitor>

        {/* ── Clinical context header ── */}
        {(clinicalContext || questionType) && (
          <div className="rounded-t-xl border border-b-0 border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            {questionType && (
              <p className="text-[0.58rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)] mb-0.5">
                {NGN_TYPE_LABELS[questionType]}
              </p>
            )}
            {clinicalContext && (
              <p className="text-xs text-[var(--semantic-text-secondary)] leading-relaxed">{clinicalContext}</p>
            )}
          </div>
        )}

        {/* ── Monitor panel (collapsible) ── */}
        <div className="rounded-b-xl border border-[#1e3450] overflow-hidden"
             style={{ borderRadius: clinicalContext || questionType ? "0 0 0.75rem 0.75rem" : "0.75rem" }}>
          <div
            style={{
              background: "#0a1520",
              borderBottom: "1px solid #1e3450",
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: contextValue.isEmergency ? "#ff1744" : "#00e676",
                  animation: contextValue.isEmergency ? "nn-alarm-pulse 0.6s infinite" : "none",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#8fafc8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Patient Monitor
                {!frozenAtStart && " — Live"}
              </span>
              {contextValue.topAlarm && (
                <span style={{ fontSize: "8px", color: "#ff6e6e", fontWeight: 700 }}>
                  ⚠ {contextValue.topAlarm}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                data-nn-monitor-mode-pill=""
                style={{ fontSize: "8px" }}
                aria-pressed={showOverlay}
                onClick={() => setShowOverlay((v) => !v)}
              >
                {showOverlay ? "▾ Hide" : "▸ Explain"}
              </button>
              <button
                type="button"
                data-nn-monitor-mode-pill=""
                style={{ fontSize: "8px" }}
                aria-expanded={monitorExpanded}
                onClick={() => setMonitorExpanded((v) => !v)}
              >
                {monitorExpanded ? "▴ Collapse" : "▾ Monitor"}
              </button>
            </div>
          </div>

          {monitorExpanded && state ? (
            <>
              <PatientMonitorDisplay
                state={state}
                history={history}
                mode={mode}
                showOverlay={false}
              />
              {state && showOverlay && (
                <div style={{ borderTop: "1px solid #1e3450" }}>
                  <EducationalOverlayPanel state={state} defaultOpen />
                </div>
              )}
            </>
          ) : (
            /* Compact summary strip when collapsed */
            <div
              style={{
                background: "#0f1e2e",
                padding: "8px 12px",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "HR", value: contextValue.heartRate ? `${Math.round(contextValue.heartRate)}` : "—", unit: "bpm" },
                { label: "BP", value: contextValue.bloodPressure, unit: "mmHg" },
                { label: "SpO₂", value: contextValue.spo2 ? `${Math.round(contextValue.spo2)}` : "—", unit: "%" },
                { label: "ECG", value: contextValue.rhythmLabel, unit: "" },
              ].map(({ label, value, unit }) => (
                <div key={label} style={{ minWidth: "3.5rem" }}>
                  <div style={{ fontSize: "7px", color: "#4a6a88", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#e8edf2", fontVariantNumeric: "tabular-nums" }}>
                    {value}{unit && <span style={{ fontSize: "8px", color: "#4a6a88", marginLeft: 1 }}>{unit}</span>}
                  </div>
                </div>
              ))}
              {contextValue.alarmCount > 0 && (
                <div style={{ minWidth: "3.5rem" }}>
                  <div style={{ fontSize: "7px", color: "#ff6e6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>Alarms</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#ff6e6e" }}>{contextValue.alarmCount}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── NGN Question content ── */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </NgnMonitorCtx.Provider>
  );
}
