import type {
  SepsisProgressionCase
} from "./sepsis-progression-types";

export const SEPSIS_PROGRESSION_CASES: SepsisProgressionCase[] = [
  {
    id: "urosepsis-deterioration",
    title: "Progressive Urosepsis",
    sourceSyndrome: "Complicated urinary tract infection",
    patientSummary:
      "A 71-year-old with fever, flank pain, hypotension, and worsening confusion.",
    steps: [
      {
        id: "initial-presentation",
        stage: "initial-infection",
        timeLabel: "0 hours",
        clinicalStatus:
          "Febrile urinary symptoms without overt shock.",
        vitalSigns: {
          temperatureC: 38.5,
          heartRate: 102,
          respiratoryRate: 20,
          systolicBp: 118,
          oxygenSaturation: 96,
          mentalStatus: "alert"
        },
        prescribingDecision:
          "Initiate appropriate empiric therapy after cultures.",
        escalationDecision:
          "Monitor closely for sepsis progression.",
        teachingPoint:
          "Do not delay antibiotics in suspected serious infection."
      },
      {
        id: "sepsis-evolution",
        stage: "sepsis",
        timeLabel: "6 hours",
        clinicalStatus:
          "Persistent tachycardia and worsening hypotension.",
        vitalSigns: {
          temperatureC: 39.1,
          heartRate: 124,
          respiratoryRate: 28,
          systolicBp: 92,
          oxygenSaturation: 92,
          mentalStatus: "confused"
        },
        prescribingDecision:
          "Escalate to broad-spectrum therapy while reassessing source control.",
        escalationDecision:
          "Initiate aggressive sepsis management.",
        teachingPoint:
          "Hemodynamic instability changes urgency and prescribing priorities."
      },
      {
        id: "shock-state",
        stage: "septic-shock",
        timeLabel: "12 hours",
        clinicalStatus:
          "Refractory hypotension with organ dysfunction.",
        vitalSigns: {
          temperatureC: 39.4,
          heartRate: 138,
          respiratoryRate: 34,
          systolicBp: 78,
          oxygenSaturation: 88,
          mentalStatus: "obtunded"
        },
        prescribingDecision:
          "Ensure high-risk coverage while awaiting culture guidance.",
        escalationDecision:
          "Immediate ICU-level escalation required.",
        teachingPoint:
          "Shock recognition and escalation are critical NP competencies."
      }
    ]
  }
];
