/**
 * Educational Overlay
 *
 * Generates contextual clinical explanations that help learners understand
 * what they are observing on the monitor and why changes are happening.
 *
 * The overlay is optional (toggled by the learner) so it supports rather than
 * replaces clinical reasoning.
 */

import type { PhysiologyState, MonitorAlarm } from "./physiology-state";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { deriveAlarms } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OverlayEntry {
  vital: string;
  value: string;
  explanation: string;
  urgency: "info" | "warning" | "critical" | null;
}

export interface MonitorOverlay {
  conditionSummary: string;
  stageDescription: string;
  entries: OverlayEntry[];
  clinicalAction: string;
  ecgExplanation: string;
  interventionHint?: string;
}

// ─── Main function ────────────────────────────────────────────────────────────

export function buildMonitorOverlay(
  state: PhysiologyState,
  priorState?: Readonly<PhysiologyState>,
): MonitorOverlay {
  const pattern = getDeteriorationPattern(state.activeConditionKey);
  const stageDef = pattern?.stages[state.conditionStage];
  const alarms = deriveAlarms(state);

  const entries: OverlayEntry[] = [];

  // HR
  entries.push(buildHrEntry(state, priorState, alarms));
  // BP / MAP
  entries.push(buildBpEntry(state, priorState, alarms));
  // SpO2
  entries.push(buildSpo2Entry(state, priorState, alarms));
  // RR
  entries.push(buildRrEntry(state, priorState, alarms));
  // Temp
  entries.push(buildTempEntry(state, priorState, alarms));

  // Advanced entries if values suggest clinical significance
  if (state.lactate > 2.0) entries.push(buildLactateEntry(state, alarms));
  if (state.icp > 15) entries.push(buildIcpEntry(state, alarms));
  if (state.cvp > 12 || state.cvp < 0) entries.push(buildCvpEntry(state, alarms));
  if (state.potassium < 3.0 || state.potassium > 5.5) entries.push(buildKEntry(state, alarms));
  if (state.etco2 < 30 || state.etco2 > 50) entries.push(buildEtco2Entry(state, alarms));
  if (state.urineOutputPerHour < 30) entries.push(buildUoEntry(state, alarms));

  return {
    conditionSummary: pattern
      ? `${pattern.label}: ${pattern.description}`
      : "Unknown condition",
    stageDescription: stageDef?.explanation ?? "Clinical deterioration in progress.",
    entries: entries.filter(Boolean),
    clinicalAction: buildClinicalAction(state),
    ecgExplanation: buildEcgExplanation(state),
    interventionHint: buildInterventionHint(state),
  };
}

// ─── Per-vital entry builders ─────────────────────────────────────────────────

function buildHrEntry(state: PhysiologyState, prior: Readonly<PhysiologyState> | undefined, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "HR");
  const trend = prior ? trendArrow(state.heartRate, prior.heartRate, false) : "";
  const physiology = state.heartRate > 100
    ? "Compensatory response to ↓CO, pain, hypoxia, or vasodilation. Reduces diastolic filling time."
    : state.heartRate < 60
    ? "Bradycardia: vagal predominance, conduction block, or β-blocker effect. ↓ cardiac output."
    : "Within normal sinus range.";

  return {
    vital: "Heart Rate",
    value: `${Math.round(state.heartRate)} bpm ${trend}`,
    explanation: physiology,
    urgency: alarm?.level ?? null,
  };
}

function buildBpEntry(state: PhysiologyState, prior: Readonly<PhysiologyState> | undefined, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "BP" || a.vital === "MAP");
  const trend = prior ? trendArrow(state.systolicBP, prior.systolicBP, false) : "";
  const physiology = state.map < 65
    ? `MAP ${Math.round(state.map)}: organ perfusion threshold. Autoregulation fails below MAP 50. Cerebral, renal, and coronary hypoperfusion.`
    : state.systolicBP > 160
    ? "Hypertension: may reflect increased afterload, pain response, or Cushing's reflex (ICP)."
    : "Adequate perfusion pressure.";

  return {
    vital: "Blood Pressure",
    value: `${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)} mmHg  MAP ${Math.round(state.map)} ${trend}`,
    explanation: physiology,
    urgency: alarm?.level ?? null,
  };
}

function buildSpo2Entry(state: PhysiologyState, prior: Readonly<PhysiologyState> | undefined, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "SpO₂");
  const trend = prior ? trendArrow(state.spo2, prior.spo2, true) : "";
  const physiology = state.spo2 < 85
    ? "Critical hypoxemia: PaO₂ < 55 mmHg. Tissue hypoxia, lactic acidosis, and organ injury without urgent intervention."
    : state.spo2 < 92
    ? "Hypoxemia: supplemental O₂ required. Consider underlying cause (pulmonary, hemodynamic, or ventilatory)."
    : "Adequate hemoglobin saturation.";

  return {
    vital: "SpO₂",
    value: `${Math.round(state.spo2)}% ${trend}`,
    explanation: physiology,
    urgency: alarm?.level ?? null,
  };
}

function buildRrEntry(state: PhysiologyState, prior: Readonly<PhysiologyState> | undefined, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "RR");
  const trend = prior ? trendArrow(state.respiratoryRate, prior.respiratoryRate, false) : "";
  const physiology = state.respiratoryRate > 25
    ? "Tachypnea: compensating for hypoxemia, metabolic acidosis, or pain. Work of breathing ↑ — respiratory fatigue risk."
    : state.respiratoryRate < 10
    ? "Bradypnea: opioid effect, neurologic depression, or respiratory fatigue. Apnea risk."
    : "Normal ventilatory rate.";

  return {
    vital: "Respiratory Rate",
    value: `${Math.round(state.respiratoryRate)} /min ${trend}`,
    explanation: physiology,
    urgency: alarm?.level ?? null,
  };
}

function buildTempEntry(state: PhysiologyState, prior: Readonly<PhysiologyState> | undefined, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "Temp");
  const trend = prior ? trendArrow(state.temperature, prior.temperature, false) : "";
  const physiology = state.temperature > 38.5
    ? "Fever: infection, inflammation, or neurologic dysregulation. Each 1°C ↑ increases O₂ demand ~10%."
    : state.temperature < 35
    ? "Hypothermia: ↓ metabolism, coagulopathy risk, cardiac arrhythmia risk."
    : "Normothermia.";

  return {
    vital: "Temperature",
    value: `${state.temperature.toFixed(1)}°C ${trend}`,
    explanation: physiology,
    urgency: alarm?.level ?? null,
  };
}

function buildLactateEntry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "Lactate");
  return {
    vital: "Lactate",
    value: `${state.lactate.toFixed(1)} mmol/L`,
    explanation: state.lactate > 4
      ? "Severe hyperlactatemia: tissue oxygen debt. Anaerobic metabolism from inadequate perfusion. Target clearance > 10% per 2 hours."
      : "Elevated lactate: early tissue hypoperfusion. Fluid resuscitation and address underlying cause.",
    urgency: alarm?.level ?? "warning",
  };
}

function buildIcpEntry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "ICP");
  return {
    vital: "ICP",
    value: `${Math.round(state.icp)} mmHg`,
    explanation: state.icp > 25
      ? `ICP ${Math.round(state.icp)}: CPP = MAP − ICP = ${Math.round(state.map - state.icp)} mmHg. CPP < 50 risks cerebral ischemia. Head-of-bed 30°, hyperventilation, osmotic therapy.`
      : `ICP ${Math.round(state.icp)}: borderline. Monitor closely.`,
    urgency: alarm?.level ?? "warning",
  };
}

function buildCvpEntry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  return {
    vital: "CVP",
    value: `${Math.round(state.cvp)} cmH₂O`,
    explanation: state.cvp > 14
      ? "Elevated CVP: right heart failure, tamponade, volume overload, or tension PTX. Not a reliable preload indicator alone."
      : state.cvp < 2
      ? "Low CVP: hypovolemia or distributive shock. Correlate with clinical exam and response to fluids."
      : "CVP within normal range (2–8 cmH₂O).",
    urgency: null,
  };
}

function buildKEntry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  return {
    vital: "K⁺",
    value: `${state.potassium.toFixed(1)} mEq/L`,
    explanation: state.potassium > 5.5
      ? `Hyperkalemia ${state.potassium.toFixed(1)}: peaked T-waves → QRS widening → sine wave → PEA. Calcium gluconate stabilizes membrane.`
      : state.potassium < 3.0
      ? "Hypokalemia: QTc prolongation, U-waves. Risk of torsades de pointes. Replete with caution."
      : "Normal potassium.",
    urgency: state.potassium > 6.5 || state.potassium < 2.5 ? "critical" : "warning",
  };
}

function buildEtco2Entry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "EtCO₂");
  return {
    vital: "EtCO₂",
    value: `${Math.round(state.etco2)} mmHg`,
    explanation: state.etco2 < 25
      ? "Low EtCO₂: hyperventilation, large PE dead space, or cardiac arrest (< 10 mmHg). In cardiac arrest, EtCO₂ > 20 with CPR suggests return of circulation."
      : state.etco2 > 50
      ? "Hypercapnia: ventilatory failure. Risk of CO₂ narcosis and respiratory acidosis."
      : "EtCO₂ within normal range (35–45 mmHg).",
    urgency: alarm?.level ?? null,
  };
}

function buildUoEntry(state: PhysiologyState, alarms: MonitorAlarm[]): OverlayEntry {
  const alarm = alarms.find((a) => a.vital === "UO");
  return {
    vital: "Urine Output",
    value: `${Math.round(state.urineOutputPerHour)} mL/hr`,
    explanation: state.urineOutputPerHour < 15
      ? "Oliguria / anuria: AKI from hypoperfusion, obstruction, or ATN. Minimum target 0.5 mL/kg/hr. Foley placement to monitor."
      : "Reduced urine output: prerenal (perfusion), intrinsic renal, or postrenal cause.",
    urgency: alarm?.level ?? "warning",
  };
}

// ─── ECG explanation ──────────────────────────────────────────────────────────

function buildEcgExplanation(state: PhysiologyState): string {
  const rhythm = state.ecgRhythmKey.replace(/_/g, " ");

  if (state.ecgRhythmKey === "ventricular_fibrillation") {
    return "VF: chaotic unsynchronized depolarization — no cardiac output. SHOCK IMMEDIATELY. Begin CPR.";
  }
  if (state.ecgRhythmKey === "asystole") {
    return "Asystole: absent electrical activity. CPR, epinephrine 1 mg IV, reversible causes (Hs & Ts).";
  }
  if (state.ecgRhythmKey === "pea") {
    return "PEA: organized electrical activity without mechanical pulse. Treat reversible causes: Tension PTX, Tamponade, Thrombosis (PE/AMI), Toxins, Hypovolemia, Hypoxia, Hypothermia, Hypo/hyperkalemia.";
  }
  if (state.ecgFeatures.stElevation) {
    return `STEMI pattern: ST elevation represents transmural ischemia. Cath lab activation — door-to-balloon < 90 min.`;
  }
  if (state.ecgFeatures.peakedT && state.ecgFeatures.widenedQrs) {
    return `Hyperkalemia: K⁺ ${state.potassium.toFixed(1)} — peaked T-waves + wide QRS = cardiac stabilization required NOW.`;
  }
  if (state.ecgFeatures.peakedT) {
    return `Early hyperkalemia pattern: peaked narrow T-waves. K⁺ ${state.potassium.toFixed(1)} — begin treatment.`;
  }
  if (state.ecgRhythmKey === "atrial_fibrillation") {
    return `AFib: irregularly irregular R-R intervals, absent P-waves. Rate ${Math.round(state.heartRate)} bpm. Rate vs rhythm control decision.`;
  }
  if (state.ecgRhythmKey === "ventricular_tachycardia") {
    return "VT: rapid wide-complex rhythm. Is patient pulseless? If yes → defibrillate. If pulse present → amiodarone.";
  }
  if (state.ecgRhythmKey === "svt") {
    return "SVT: rapid narrow-complex. Vagal maneuver → Adenosine 6 mg rapid IV → Synchronized cardioversion if unstable.";
  }
  return `ECG: ${rhythm}. HR ${Math.round(state.heartRate)} bpm.`;
}

// ─── Clinical action ──────────────────────────────────────────────────────────

function buildClinicalAction(state: PhysiologyState): string {
  const stage = state.conditionStage;
  const condition = state.activeConditionKey;

  const ACTIONS: Partial<Record<string, Partial<Record<PhysiologyState["conditionStage"], string>>>> = {
    sepsis: {
      early: "Obtain blood cultures × 2. Begin broad-spectrum antibiotics within 1 hour. 30 mL/kg IV crystalloid for hypotension or lactate ≥ 4.",
      developing: "Reassess volume response. Start vasopressors if MAP < 65 despite fluids. Norepinephrine first-line.",
      severe: "ICU admission. Vasopressors titrated to MAP ≥ 65. Source control. Consider corticosteroids if refractory shock.",
      critical: "Multiorgan support. CRRT if AKI. Escalate vasopressors. Goal-directed therapy with ScvO₂ > 70%.",
    },
    stemi: {
      early: "12-lead ECG, aspirin 325 mg, heparin bolus. Activate cath lab — door-to-balloon < 90 min.",
      developing: "P2Y12 inhibitor (ticagrelor or clopidogrel). Monitor for VT/VF. Correct electrolytes.",
      severe: "Cardiogenic shock: vasopressors/inotropes. Consider IABP. Emergent PCI/CABG.",
      critical: "ACLS. Defibrillate VF. Post-ROSC care: target normothermia, PCI if not performed.",
    },
    anaphylaxis: {
      early: "IM epinephrine 0.3–0.5 mg lateral thigh. Remove trigger. Lay flat unless respiratory distress. IV access.",
      developing: "Repeat IM epi × 2 if needed. IV diphenhydramine, methylprednisolone, ranitidine. IV fluids.",
      severe: "IV epinephrine if no response to IM. Intubate if stridor or impending airway loss.",
      critical: "ACLS. High-dose vasopressors. Consider lipid emulsion if refractory.",
    },
  };

  return ACTIONS[condition]?.[stage] ?? buildGenericAction(state);
}

function buildGenericAction(state: PhysiologyState): string {
  const actions: string[] = [];
  if (state.spo2 < 92) actions.push("Supplemental O₂ / non-rebreather mask");
  if (state.map < 65) actions.push("IV fluid bolus 500–1000 mL, reassess perfusion");
  if (state.heartRate > 150) actions.push("12-lead ECG, monitor continuously");
  if (state.gcs <= 8) actions.push("Airway management — consider intubation");
  if (actions.length === 0) actions.push("Continuous monitoring, reassess in 15 minutes");
  return actions.join(" · ");
}

// ─── Intervention hint ────────────────────────────────────────────────────────

function buildInterventionHint(state: PhysiologyState): string | undefined {
  if (["ventricular_fibrillation", "asystole"].includes(state.ecgRhythmKey)) {
    return "ARREST: Start CPR → Defibrillate (if shockable) → Epinephrine 1 mg IV q3–5 min";
  }
  if (state.ecgRhythmKey === "pea") {
    return "PEA: CPR + treat reversible causes (tension PTX? tamponade? massive PE?)";
  }
  if (state.activeConditionKey === "hyperkalemia" && state.potassium > 6.5) {
    return "Calcium gluconate → Insulin/D50 → Sodium bicarbonate → Kayexalate or dialysis";
  }
  if (state.activeConditionKey === "tension_pneumothorax" && state.conditionStage !== "early") {
    return "Needle thoracostomy 2nd ICS MCL → Tube thoracostomy";
  }
  return undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trendArrow(current: number, prior: number, higherBetter: boolean): string {
  const delta = current - prior;
  const threshold = Math.abs(prior) * 0.03;
  if (Math.abs(delta) < threshold) return "→";
  const improving = higherBetter ? delta > 0 : delta < 0;
  return improving ? "↑" : "↓";
}
