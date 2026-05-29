/**
 * Profession-Specific Monitor View Configurations
 *
 * Each MonitorMode maps to a display configuration that controls:
 *   - Which vitals are shown (and in what order)
 *   - Whether advanced hemodynamics are visible (CVP, CO, ScvO₂)
 *   - Whether ventilator waveforms are shown
 *   - Whether ICP is shown
 *   - ECG complexity (lead display, measurement callouts)
 *   - Alarm sensitivity
 *   - Educational overlay depth
 */

import type { MonitorMode } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VitalDisplayConfig {
  key: string;
  label: string;
  unit: string;
  /** Display priority — lower number appears first. */
  priority: number;
  /** Color family used on the monitor display. */
  colorFamily: "green" | "white" | "cyan" | "yellow" | "orange" | "red" | "purple";
  /** Show trend arrow. */
  showTrend: boolean;
  /** Whether to show this vital in this mode. */
  visible: boolean;
}

export interface ProfessionViewConfig {
  mode: MonitorMode;
  label: string;
  description: string;
  vitals: VitalDisplayConfig[];
  showVentilatorWaveforms: boolean;
  showEcg: boolean;
  showEcgMeasurements: boolean;
  showAdvancedHemodynamics: boolean;
  showIcp: boolean;
  showEtco2: boolean;
  showLabs: boolean;
  showUrineOutput: boolean;
  overlayDepth: "basic" | "detailed" | "full";
  /** Number of ECG seconds displayed. */
  ecgSecondsDisplayed: number;
  /** Educational mode for ECG strip. */
  ecgMode: "clean_teaching" | "realistic_monitor" | "emergency_scenario";
}

// ─── View configurations ──────────────────────────────────────────────────────

const ALL_VITALS: VitalDisplayConfig[] = [
  { key: "heartRate",           label: "HR",     unit: "bpm",   priority: 1,  colorFamily: "green",  showTrend: true,  visible: true },
  { key: "systolicBP",          label: "NIBP",   unit: "mmHg",  priority: 2,  colorFamily: "white",  showTrend: true,  visible: true },
  { key: "map",                 label: "MAP",    unit: "mmHg",  priority: 3,  colorFamily: "white",  showTrend: true,  visible: true },
  { key: "spo2",                label: "SpO₂",  unit: "%",     priority: 4,  colorFamily: "cyan",   showTrend: true,  visible: true },
  { key: "respiratoryRate",     label: "RR",     unit: "/min",  priority: 5,  colorFamily: "yellow", showTrend: true,  visible: true },
  { key: "temperature",         label: "Temp",   unit: "°C",    priority: 6,  colorFamily: "orange", showTrend: true,  visible: true },
  { key: "etco2",               label: "EtCO₂", unit: "mmHg",  priority: 7,  colorFamily: "purple", showTrend: true,  visible: false },
  { key: "cvp",                 label: "CVP",    unit: "cmH₂O", priority: 8,  colorFamily: "white",  showTrend: false, visible: false },
  { key: "cardiacOutput",       label: "CO",     unit: "L/min", priority: 9,  colorFamily: "white",  showTrend: false, visible: false },
  { key: "icp",                 label: "ICP",    unit: "mmHg",  priority: 10, colorFamily: "red",    showTrend: true,  visible: false },
  { key: "urineOutputPerHour",  label: "UO",     unit: "mL/hr", priority: 11, colorFamily: "yellow", showTrend: false, visible: false },
  { key: "painScore",           label: "Pain",   unit: "/10",   priority: 12, colorFamily: "orange", showTrend: false, visible: true  },
  { key: "gcs",                 label: "GCS",    unit: "",      priority: 13, colorFamily: "white",  showTrend: true,  visible: false },
];

function vitals(overrides: Partial<Record<string, boolean>>): VitalDisplayConfig[] {
  return ALL_VITALS.map((v) => ({
    ...v,
    visible: overrides[v.key] !== undefined ? overrides[v.key]! : v.visible,
  }));
}

export const PROFESSION_VIEW_CONFIGS: Record<MonitorMode, ProfessionViewConfig> = {

  new_grad: {
    mode: "new_grad",
    label: "New Graduate",
    description: "Simplified monitor showing essential vitals. Focus on early recognition and escalation.",
    vitals: vitals({ heartRate: true, systolicBP: true, map: false, spo2: true, respiratoryRate: true, temperature: true, painScore: true }),
    showVentilatorWaveforms: false,
    showEcg: true,
    showEcgMeasurements: false,
    showAdvancedHemodynamics: false,
    showIcp: false,
    showEtco2: false,
    showLabs: false,
    showUrineOutput: false,
    overlayDepth: "basic",
    ecgSecondsDisplayed: 6,
    ecgMode: "clean_teaching",
  },

  general: {
    mode: "general",
    label: "General (RN)",
    description: "Standard medical-surgical monitor. All core vitals with trend view.",
    vitals: vitals({ heartRate: true, systolicBP: true, map: true, spo2: true, respiratoryRate: true, temperature: true, painScore: true, urineOutputPerHour: true }),
    showVentilatorWaveforms: false,
    showEcg: true,
    showEcgMeasurements: true,
    showAdvancedHemodynamics: false,
    showIcp: false,
    showEtco2: false,
    showLabs: true,
    showUrineOutput: true,
    overlayDepth: "detailed",
    ecgSecondsDisplayed: 6,
    ecgMode: "realistic_monitor",
  },

  icu: {
    mode: "icu",
    label: "ICU",
    description: "Full critical care display with arterial line, CVP, cardiac output, and ventilator waveforms.",
    vitals: vitals({ heartRate: true, systolicBP: true, map: true, spo2: true, respiratoryRate: true, temperature: true, etco2: true, cvp: true, cardiacOutput: true, icp: false, urineOutputPerHour: true, gcs: true }),
    showVentilatorWaveforms: true,
    showEcg: true,
    showEcgMeasurements: true,
    showAdvancedHemodynamics: true,
    showIcp: false,
    showEtco2: true,
    showLabs: true,
    showUrineOutput: true,
    overlayDepth: "full",
    ecgSecondsDisplayed: 10,
    ecgMode: "emergency_scenario",
  },

  rt: {
    mode: "rt",
    label: "Respiratory Therapy",
    description: "Ventilator-focused display emphasizing airway pressures, waveforms, and respiratory physiology.",
    vitals: vitals({ heartRate: true, systolicBP: true, map: false, spo2: true, respiratoryRate: true, temperature: false, etco2: true, urineOutputPerHour: false }),
    showVentilatorWaveforms: true,
    showEcg: true,
    showEcgMeasurements: false,
    showAdvancedHemodynamics: false,
    showIcp: false,
    showEtco2: true,
    showLabs: false,
    showUrineOutput: false,
    overlayDepth: "detailed",
    ecgSecondsDisplayed: 6,
    ecgMode: "realistic_monitor",
  },

  np: {
    mode: "np",
    label: "Nurse Practitioner",
    description: "Advanced assessment view for diagnostic interpretation and management decisions.",
    vitals: vitals({ heartRate: true, systolicBP: true, map: true, spo2: true, respiratoryRate: true, temperature: true, etco2: true, cvp: true, cardiacOutput: true, icp: true, urineOutputPerHour: true, gcs: true }),
    showVentilatorWaveforms: true,
    showEcg: true,
    showEcgMeasurements: true,
    showAdvancedHemodynamics: true,
    showIcp: true,
    showEtco2: true,
    showLabs: true,
    showUrineOutput: true,
    overlayDepth: "full",
    ecgSecondsDisplayed: 10,
    ecgMode: "emergency_scenario",
  },
};

// ─── Visible vitals helper ─────────────────────────────────────────────────────

export function getVisibleVitals(mode: MonitorMode): VitalDisplayConfig[] {
  return PROFESSION_VIEW_CONFIGS[mode].vitals
    .filter((v) => v.visible)
    .sort((a, b) => a.priority - b.priority);
}
