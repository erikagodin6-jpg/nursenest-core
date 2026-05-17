import { INFERIOR_STEMI_RURAL_TRANSPORT_ECG } from "@/lib/paramedic/runtime/ecg-runtime";
import { normalizePatientState, type EmsPatientState } from "@/lib/paramedic/runtime/patient-state";
import type { EmsScenarioRuntime } from "@/lib/paramedic/runtime/scenario-runtime";
import { normalizeTransportState } from "@/lib/paramedic/runtime/transport-runtime";

export const INFERIOR_STEMI_RURAL_TRANSPORT_PATIENT: EmsPatientState = normalizePatientState({
  airway: "patent",
  breathing: "distressed",
  circulation: "shock",
  neurologic: "confused",
  perfusion: "decompensated-shock",
  vitals: {
    hr: 42,
    rr: 24,
    bp: "82/48",
    spo2: 93,
    etco2: 30,
    tempC: 36.6,
    gcs: 14,
  },
  findings: {
    skinSigns: ["pale", "cool", "diaphoretic"],
    workOfBreathing: ["mild tachypnea", "speaks in short phrases"],
    lungSounds: ["clear bilaterally"],
    pulseQuality: "weak radial pulses, slower than expected for distress",
    mentalStatusNotes: ["anxious", "intermittently confused", "keeps asking if he is dying"],
    painDescription: "crushing substernal chest pressure radiating to jaw and left arm",
  },
  instabilityLevel: "critical",
  deteriorationRisk: 86,
  lastReassessedAtSeconds: 0,
});

export const INFERIOR_STEMI_RURAL_TRANSPORT_SCENARIO: EmsScenarioRuntime = {
  slug: "inferior-stemi-rural-transport",
  title: "Inferior STEMI During Rural Transport",
  category: "cardiology",
  environment: {
    rural: true,
    weather: "cold rain with low visibility",
    hazards: ["busy gas station parking lot", "bystander crowd", "limited ALS backup"],
    bystandersPresent: true,
    backupEtaMinutes: 18,
  },
  patient: INFERIOR_STEMI_RURAL_TRANSPORT_PATIENT,
  ecg: INFERIOR_STEMI_RURAL_TRANSPORT_ECG,
  transport: normalizeTransportState({
    destination: "pci-center",
    urgency: "immediate",
    mode: "ground",
    etaMinutes: 30,
    sceneTimeMinutes: 6,
    transportStarted: false,
    activation: "stemi-alert",
    rationale:
      "Inferior STEMI with hypotension and bradycardia requires immediate PCI-capable destination planning, early STEMI activation, and frequent perfusion reassessment.",
  }),
  activeRisks: [
    "right-sided involvement with preload dependence",
    "worsening bradycardia and hypotension",
    "inappropriate nitroglycerin administration",
    "delayed PCI activation",
    "missed repeat ECG during deterioration",
  ],
  interventions: [],
  timeline: [
    {
      timestampSeconds: 0,
      type: "assessment",
      title: "Dispatch",
      description:
        "58-year-old male at a rural gas station with crushing chest pain, diaphoresis, and nausea. Caller reports he nearly fainted while paying for fuel.",
      physiologicImpact: "High suspicion for ACS before patient contact; prepare monitor, aspirin pathway, and transport planning.",
    },
    {
      timestampSeconds: 90,
      type: "assessment",
      title: "Initial patient contact",
      description:
        "Patient is pale, cool, diaphoretic, and clutching his chest. He is anxious and intermittently confused. Radial pulses are weak.",
      physiologicImpact: "Perfusion is already compromised; this is not a stable chest pain presentation.",
    },
    {
      timestampSeconds: 180,
      type: "ecg-change",
      title: "12-lead ECG obtained",
      description:
        "Inferior ST elevation pattern with bradycardia and hypotension risk. Treat as a STEMI transport problem, not only a rhythm-identification exercise.",
      physiologicImpact: "STEMI activation and PCI-capable destination are time-sensitive priorities.",
    },
    {
      timestampSeconds: 300,
      type: "transport",
      title: "Transport decision window",
      description:
        "Nearest local ED is 8 minutes away, PCI center is 30 minutes away. Patient remains hypotensive with weak pulses.",
      physiologicImpact: "Destination decision should prioritize definitive reperfusion while accounting for instability and local protocol.",
    },
    {
      timestampSeconds: 480,
      type: "deterioration",
      title: "Perfusion worsens if transport is delayed",
      description:
        "Patient becomes more confused, HR trends down, BP worsens, and skin signs remain poor.",
      physiologicImpact: "Delayed transport or inappropriate vasodilator use increases peri-arrest risk.",
    },
    {
      timestampSeconds: 720,
      type: "reassessment",
      title: "Repeat reassessment during transport",
      description:
        "Recheck BP, mental status, rhythm, pain, and perfusion. Repeat ECG if symptoms or vitals change.",
      physiologicImpact: "Ongoing reassessment detects bradycardic deterioration and evolving STEMI complications.",
    },
  ],
  debrief: {
    recognitionScore: 0,
    prioritizationScore: 0,
    reassessmentScore: 0,
    transportScore: 0,
    escalationScore: 0,
    strengths: [
      "Recognize inferior STEMI as a perfusion and transport problem, not just an ECG label.",
      "Prioritize STEMI activation and PCI-capable transport planning early.",
      "Avoid interventions that worsen hypotension without reassessment.",
    ],
    improvementAreas: [
      "Repeat perfusion checks after ECG interpretation and before medication decisions.",
      "Consider right-sided involvement when inferior STEMI is paired with hypotension.",
      "Minimize scene time once immediate threats are assessed and transport destination is selected.",
    ],
  },
};

export const INFERIOR_STEMI_RURAL_TRANSPORT_READINESS_OBJECTIVES = [
  "Recognize inferior STEMI with unstable perfusion signs.",
  "Connect ECG localization to field medication risk and transport urgency.",
  "Prioritize PCI-capable destination planning under rural transport constraints.",
  "Use reassessment to detect worsening bradycardia, hypotension, or altered mental status.",
  "Explain why this scenario requires operational decision-making beyond ECG identification.",
] as const;
