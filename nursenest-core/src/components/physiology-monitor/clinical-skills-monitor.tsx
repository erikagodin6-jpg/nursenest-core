"use client";

/**
 * ClinicalSkillsMonitor
 *
 * Embeds a live Physiology Monitor as the patient model for a Clinical Skills
 * assessment scenario. The monitor provides real-time physiologic feedback
 * as the learner works through clinical skill steps.
 *
 * Supported skill scenarios:
 *   - Chest Pain Assessment (STEMI patient)
 *   - Shock Assessment (Septic shock / distributive)
 *   - Respiratory Assessment (ARDS / opioid toxicity)
 *   - Sepsis Assessment (Septic shock progression)
 *   - Neurologic Assessment (Stroke / increased ICP)
 *   - Cardiac Arrest Response (VT→VF)
 *   - Respiratory Failure / Airway (RT scenarios)
 *
 * Integration pattern:
 *   <ClinicalSkillsMonitor scenario="chest_pain_assessment">
 *     <SkillChecklistComponent ... />
 *   </ClinicalSkillsMonitor>
 */

import "./patient-monitor-display.css";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MonitorWorkstation } from "./monitor-workstation";
import { MonitorEngine } from "@/lib/physiology-monitor/monitor-engine";
import type { MonitorMode } from "@/lib/physiology-monitor/physiology-state";

// ─── Scenario registry ────────────────────────────────────────────────────────

export type ClinicalSkillScenario =
  | "chest_pain_assessment"
  | "shock_assessment"
  | "respiratory_assessment"
  | "sepsis_assessment"
  | "neurologic_assessment"
  | "cardiac_arrest_response"
  | "respiratory_failure_airway"
  | "pulmonary_edema_assessment"
  | "toxicology_assessment"
  | "critical_care_np";

interface ScenarioConfig {
  conditionKey: string;
  mode: MonitorMode;
  label: string;
  clinicalContext: string;
  expectedAssessmentFindings: string[];
  keyInterventions: string[];
}

export const CLINICAL_SKILL_SCENARIO_CONFIGS: Record<ClinicalSkillScenario, ScenarioConfig> = {
  chest_pain_assessment: {
    conditionKey: "stemi",
    mode: "icu",
    label: "Chest Pain Assessment",
    clinicalContext: "A 68-year-old male presents with sudden onset chest pain 9/10, diaphoresis, and jaw pain for 45 minutes. He is pale and diaphoretic.",
    expectedAssessmentFindings: ["ST elevation on ECG", "tachycardia", "hypotension", "diaphoresis", "elevated troponin"],
    keyInterventions: ["12-lead ECG", "aspirin 325mg", "IV access", "supplemental O₂", "cardiac monitor", "cath lab activation"],
  },
  shock_assessment: {
    conditionKey: "septic_shock",
    mode: "icu",
    label: "Shock Assessment",
    clinicalContext: "A 55-year-old female with a history of UTI presents with confusion, fever 39.2°C, HR 132, BP 74/40, and mottled extremities.",
    expectedAssessmentFindings: ["hypotension refractory to fluids", "tachycardia", "fever", "altered LOC", "elevated lactate", "oliguria"],
    keyInterventions: ["IV access x2", "fluid bolus 30 mL/kg", "blood cultures", "antibiotics within 1 hour", "vasopressor initiation", "source control"],
  },
  respiratory_assessment: {
    conditionKey: "ards",
    mode: "rt",
    label: "Respiratory Assessment",
    clinicalContext: "A ventilated 45-year-old post-CABG patient has progressive bilateral infiltrates, PaO₂/FiO₂ ratio 180, and increasing ventilator pressures.",
    expectedAssessmentFindings: ["severe hypoxemia", "bilateral infiltrates", "high PIP/plateau pressure", "low compliance", "non-cardiac etiology"],
    keyInterventions: ["lung protective ventilation 6 mL/kg", "PEEP titration", "prone positioning", "neuromuscular blockade", "FiO₂ optimization"],
  },
  sepsis_assessment: {
    conditionKey: "sepsis",
    mode: "general",
    label: "Sepsis Assessment",
    clinicalContext: "A 72-year-old male with a 3-day history of cough and fever presents with HR 118, RR 26, BP 102/58, SpO₂ 93%, and altered orientation.",
    expectedAssessmentFindings: ["tachycardia", "tachypnea", "hypotension", "hypoxemia", "altered LOC", "fever"],
    keyInterventions: ["SIRS criteria assessment", "qSOFA score", "blood cultures x2", "lactate", "antibiotics", "30 mL/kg fluid challenge"],
  },
  neurologic_assessment: {
    conditionKey: "stroke",
    mode: "icu",
    label: "Neurologic Assessment",
    clinicalContext: "A 61-year-old female with known atrial fibrillation presents with sudden left-sided facial droop, arm weakness, and dysarthria of 90-minute duration.",
    expectedAssessmentFindings: ["facial asymmetry", "unilateral arm weakness", "dysarthria", "NIHSS score", "atrial fibrillation on ECG"],
    keyInterventions: ["FAST assessment", "NIHSS scoring", "emergent CT head", "glucose check", "tPA eligibility assessment", "neurology activation"],
  },
  cardiac_arrest_response: {
    conditionKey: "vt_to_vf",
    mode: "icu",
    label: "Cardiac Arrest Response",
    clinicalContext: "A 58-year-old male with known coronary artery disease becomes unresponsive. Monitor shows wide-complex tachycardia deteriorating to ventricular fibrillation.",
    expectedAssessmentFindings: ["loss of consciousness", "no pulse", "ventricular fibrillation on monitor", "apnea"],
    keyInterventions: ["call for help / code activation", "CPR initiation within 10 seconds", "defibrillation", "epinephrine", "amiodarone", "reversible cause identification"],
  },
  respiratory_failure_airway: {
    conditionKey: "rt_accidental_extubation",
    mode: "rt",
    label: "Respiratory Failure / Airway Emergency",
    clinicalContext: "A mechanically ventilated 44-year-old post-op patient becomes agitated. The EtCO₂ waveform disappears and SpO₂ begins to fall rapidly.",
    expectedAssessmentFindings: ["absent EtCO₂", "falling SpO₂", "absent chest rise on ventilated side", "agitation preceding event"],
    keyInterventions: ["tube placement verification (EtCO₂, auscultation)", "BVM ventilation", "call for re-intubation", "RSI medications", "surgical airway preparation"],
  },
  pulmonary_edema_assessment: {
    conditionKey: "pulmonary_edema",
    mode: "icu",
    label: "Pulmonary Edema Assessment",
    clinicalContext: "A 70-year-old with known CHF presents with sudden severe dyspnea, SpO₂ 80%, BP 192/114, and frothy pink sputum.",
    expectedAssessmentFindings: ["severe hypoxemia", "hypertension", "bilateral crackles", "frothy sputum", "distended neck veins"],
    keyInterventions: ["high-flow O₂ or BiPAP", "nitroglycerin IV", "furosemide IV", "upright positioning", "prepare for intubation"],
  },
  toxicology_assessment: {
    conditionKey: "opioid_toxicity",
    mode: "general",
    label: "Toxicology — Opioid Assessment",
    clinicalContext: "A 34-year-old is found unresponsive with pinpoint pupils, respiratory rate of 4 breaths/minute, and SpO₂ of 82%.",
    expectedAssessmentFindings: ["opioid toxidrome (miosis, decreased LOC, hypoventilation)", "slow irregular breathing", "cyanosis", "no response to verbal stimuli"],
    keyInterventions: ["airway positioning", "jaw thrust", "naloxone 0.4 mg IV/IM/IN", "BVM ventilation", "call for help", "monitor for re-sedation"],
  },
  critical_care_np: {
    conditionKey: "complex_shock",
    mode: "np",
    label: "Undifferentiated Shock (NP)",
    clinicalContext: "A 63-year-old transfers from a peripheral hospital with BP 78/44, HR 128, SpO₂ 91%, and a lactate of 4.8. The referring diagnosis is unclear.",
    expectedAssessmentFindings: ["hemodynamic instability", "hyperlactatemia", "tachycardia", "hypoxemia", "altered mental status"],
    keyInterventions: ["bedside echo (LV function, IVC, pericardium)", "fluid challenge + reassess", "norepinephrine if MAP < 65", "ScvO₂", "source identification"],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export interface ClinicalSkillsMonitorProps {
  /** Predefined scenario key, or "custom" to use conditionKey directly. */
  scenario: ClinicalSkillScenario | "custom";
  /** Only used when scenario = "custom". */
  conditionKey?: string;
  /** Only used when scenario = "custom". */
  mode?: MonitorMode;
  /** Children: the clinical skills checklist / question component. */
  children?: ReactNode;
  /** Whether to show expected findings and interventions panel. */
  showClinicalGuide?: boolean;
  /** Whether simulation runs in real-time or is frozen. */
  live?: boolean;
  /** Callback when engine is ready — allows parent to interact with engine. */
  onEngineReady?: (engine: MonitorEngine) => void;
}

export function ClinicalSkillsMonitor({
  scenario,
  conditionKey: customConditionKey,
  mode: customMode,
  children,
  showClinicalGuide = false,
  live = true,
  onEngineReady,
}: ClinicalSkillsMonitorProps) {
  const [guideOpen, setGuideOpen] = useState(showClinicalGuide);

  const config = scenario !== "custom"
    ? CLINICAL_SKILL_SCENARIO_CONFIGS[scenario]
    : null;

  const activeConditionKey = config?.conditionKey ?? customConditionKey ?? "sepsis";
  const activeMode = config?.mode ?? customMode ?? "general";

  return (
    <div className="flex flex-col gap-4">
      {/* ── Scenario header ── */}
      {config && (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.58rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
              Clinical Skills — {config.label}
            </p>
            <button
              type="button"
              className="text-[0.6rem] font-semibold text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-secondary)] transition"
              onClick={() => setGuideOpen((v) => !v)}
            >
              {guideOpen ? "▴ Hide Guide" : "▾ Clinical Guide"}
            </button>
          </div>
          <p className="text-xs text-[var(--semantic-text-secondary)] leading-relaxed">{config.clinicalContext}</p>
          {guideOpen && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)] mb-1">Expected Findings</p>
                <ul className="space-y-0.5">
                  {config.expectedAssessmentFindings.map((f) => (
                    <li key={f} className="text-[0.68rem] text-[var(--semantic-text-secondary)] flex items-center gap-1.5">
                      <span className="text-[var(--semantic-brand)]">▸</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)] mb-1">Key Interventions</p>
                <ul className="space-y-0.5">
                  {config.keyInterventions.map((k) => (
                    <li key={k} className="text-[0.68rem] text-[var(--semantic-text-secondary)] flex items-center gap-1.5">
                      <span className="text-[var(--semantic-success)]">✓</span>{k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Live monitor ── */}
      <MonitorWorkstation
        initialCondition={activeConditionKey}
        initialMode={activeMode}
        hideControls={!live}
        hideTrend={false}
        defaultOverlay={false}
        onEngineReady={onEngineReady}
      />

      {/* ── Clinical skill content (checklist / question) ── */}
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}
