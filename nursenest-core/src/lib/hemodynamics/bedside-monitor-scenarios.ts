import type { BedsideMonitorScenario } from "@/lib/hemodynamics/bedside-monitor-types";

export const BEDSIDE_MONITOR_SCENARIOS: BedsideMonitorScenario[] = [
  {
    id: "septic-shock-vasodilation",
    title: "Distributive shock monitor pattern",
    patientContext: "Post-op patient with suspected infection, warm extremities, rising lactate, and worsening mentation.",
    phaseLabel: "Early deterioration",
    clinicalQuestion: "Which pattern suggests vasodilation and poor effective perfusion?",
    vitals: { heartRate: 128, systolic: 92, diastolic: 42, map: 59, spo2: 94, respiratoryRate: 28, etco2: 25 },
    channels: [
      { kind: "ecg", label: "ECG", value: "128", unit: "bpm", status: "watch", teachingPoint: "Sinus tachycardia is a compensation clue." },
      { kind: "arterial", label: "ART", value: "92/42", unit: "MAP 59", status: "critical", teachingPoint: "Low MAP and low diastolic pressure suggest poor vascular tone." },
      { kind: "spo2", label: "SpO2", value: "94", unit: "%", status: "watch", waveformQuality: "clean", teachingPoint: "SpO2 can look acceptable while perfusion is failing." },
      { kind: "etco2", label: "ETCO2", value: "25", unit: "mmHg", status: "watch", teachingPoint: "Low ETCO2 can reflect low pulmonary blood flow or hyperventilation." },
      { kind: "resp", label: "RESP", value: "28", unit: "/min", status: "watch", teachingPoint: "Tachypnea may compensate for metabolic acidosis." },
    ],
    interpretation: "Tachycardia, low MAP, tachypnea, and low ETCO2 support deteriorating distributive shock physiology.",
    nursingPriority: "Escalate early, reassess perfusion, support oxygenation, and anticipate sepsis bundle interventions per local policy and orders.",
  },
  {
    id: "arterial-line-overdamped",
    title: "Overdamped arterial line pattern",
    patientContext: "ICU patient with an arterial catheter. The waveform becomes rounded after repositioning.",
    phaseLabel: "Line troubleshooting",
    clinicalQuestion: "Is this a true blood pressure change or waveform quality problem?",
    vitals: { heartRate: 86, systolic: 104, diastolic: 68, map: 80, spo2: 97, respiratoryRate: 16, etco2: 38 },
    channels: [
      { kind: "ecg", label: "ECG", value: "86", unit: "bpm", status: "normal", teachingPoint: "The rhythm is not driving the arterial change." },
      { kind: "arterial", label: "ART", value: "104/68", unit: "MAP 80", status: "watch", waveformQuality: "damped", teachingPoint: "A rounded waveform can underestimate systolic pressure." },
      { kind: "spo2", label: "SpO2", value: "97", unit: "%", status: "normal", teachingPoint: "Stable pleth supports bedside correlation." },
      { kind: "etco2", label: "ETCO2", value: "38", unit: "mmHg", status: "normal", teachingPoint: "Stable ETCO2 argues against abrupt perfusion collapse." },
      { kind: "resp", label: "RESP", value: "16", unit: "/min", status: "normal", teachingPoint: "Respiratory trend is stable." },
    ],
    interpretation: "The arterial waveform is unreliable because the upstroke is blunted and detail is lost.",
    nursingPriority: "Level and zero the transducer, check tubing, correlate with cuff pressure, and troubleshoot according to policy before treating the number alone.",
  },
  {
    id: "bronchospasm-sharkfin-etco2",
    title: "Bronchospasm capnogram pattern",
    patientContext: "Ventilated patient with wheezing, increased peak pressures, and prolonged exhalation.",
    phaseLabel: "Respiratory deterioration",
    clinicalQuestion: "Which waveform points to obstructive physiology?",
    vitals: { heartRate: 118, systolic: 138, diastolic: 76, map: 97, spo2: 90, respiratoryRate: 30, etco2: 52 },
    channels: [
      { kind: "ecg", label: "ECG", value: "118", unit: "bpm", status: "watch", teachingPoint: "Tachycardia can reflect respiratory distress." },
      { kind: "arterial", label: "ART", value: "138/76", unit: "MAP 97", status: "normal", teachingPoint: "Blood pressure can stay preserved early." },
      { kind: "spo2", label: "SpO2", value: "90", unit: "%", status: "critical", waveformQuality: "low-perfusion", teachingPoint: "Hypoxemia plus distress requires urgent reassessment." },
      { kind: "etco2", label: "ETCO2", value: "52", unit: "mmHg", status: "critical", waveformQuality: "sharkfin", teachingPoint: "A slanted expiratory upstroke suggests obstructed exhalation." },
      { kind: "resp", label: "RESP", value: "30", unit: "/min", status: "watch", teachingPoint: "Tachypnea with prolonged exhalation increases fatigue risk." },
    ],
    interpretation: "The shark-fin capnogram and rising ETCO2 suggest obstructive ventilation with impaired CO2 clearance.",
    nursingPriority: "Assess airway and breath sounds, notify RT/provider, check ventilator pressures, and anticipate bronchodilator therapy or ventilator adjustment per orders.",
  },
];

export function getBedsideMonitorScenario(id: string): BedsideMonitorScenario | undefined {
  return BEDSIDE_MONITOR_SCENARIOS.find((scenario) => scenario.id === id);
}
