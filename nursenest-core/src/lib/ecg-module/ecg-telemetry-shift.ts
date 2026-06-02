/**
 * ECG Telemetry Shift Simulator — Engine
 *
 * Simulates managing a telemetry unit with multiple monitored patients.
 * The learner must triage, prioritise, escalate, and manage resources
 * across 4–6 concurrent patients whose rhythms evolve over the shift.
 *
 * Scoring:
 *   - Correct prioritisation (highest-acuity patient first)
 *   - Timely escalation (within the required time window)
 *   - Correct intervention selection
 *   - Patient safety (no deterioration from incorrect action)
 *   - Efficient resource allocation (not over-escalating stable patients)
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PatientAcuityLevel = "stable" | "monitoring" | "concern" | "urgent" | "critical";

export type ShiftPatientBed = {
  bedId: string;
  patientName: string;
  age: number;
  diagnosis: string;
  currentRhythmKey: string;
  displayRate: number;
  acuityLevel: PatientAcuityLevel;
  vitals: {
    hr: string;
    bp: string;
    spo2: string;
    rr?: string;
    loc?: string;
  };
  clinicalContext: string;
  /** Active alerts on this patient */
  activeAlerts: ShiftAlert[];
  /** Whether this patient has already been assessed this tick */
  assessed: boolean;
};

export type ShiftAlertSeverity = "info" | "warning" | "urgent" | "critical";

export type ShiftAlert = {
  id: string;
  severity: ShiftAlertSeverity;
  message: string;
  rhythmKey: string;
  triggeredAt: number; // tick number
  /** Time limit to respond before patient deteriorates (null = no limit) */
  responseDeadlineTicks: number | null;
};

export type ShiftAction = {
  id: string;
  label: string;
  description: string;
  /** Acuity levels this action is appropriate for */
  appropriateForAcuity: PatientAcuityLevel[];
  /** Score modifier: positive = correct, negative = incorrect/harmful */
  scoreModifier: number;
  /** Effect on patient acuity after action */
  acuityEffect: "stabilises" | "improves" | "no_effect" | "worsens";
};

export const SHIFT_ACTIONS: ShiftAction[] = [
  {
    id: "assess-patient",
    label: "Assess patient at bedside",
    description: "Go to bedside: check pulse, BP, LOC, symptoms",
    appropriateForAcuity: ["monitoring", "concern", "urgent", "critical"],
    scoreModifier: 10,
    acuityEffect: "no_effect",
  },
  {
    id: "notify-provider",
    label: "Notify provider",
    description: "Notify physician or NP of rhythm change",
    appropriateForAcuity: ["concern", "urgent"],
    scoreModifier: 15,
    acuityEffect: "stabilises",
  },
  {
    id: "call-rrt",
    label: "Activate Rapid Response Team",
    description: "Call RRT for urgent deteriorating patient",
    appropriateForAcuity: ["urgent", "critical"],
    scoreModifier: 20,
    acuityEffect: "stabilises",
  },
  {
    id: "call-code",
    label: "Call Code Blue",
    description: "Activate code blue for cardiac arrest / pulseless patient",
    appropriateForAcuity: ["critical"],
    scoreModifier: 30,
    acuityEffect: "stabilises",
  },
  {
    id: "document-and-continue",
    label: "Document and continue monitoring",
    description: "Document the finding and continue routine monitoring",
    appropriateForAcuity: ["stable", "monitoring"],
    scoreModifier: 5,
    acuityEffect: "no_effect",
  },
  {
    id: "prepare-defibrillator",
    label: "Bring defibrillator to bedside",
    description: "Bring crash cart / defibrillator to bedside for high-risk patient",
    appropriateForAcuity: ["urgent", "critical"],
    scoreModifier: 10,
    acuityEffect: "no_effect",
  },
  {
    id: "over-escalate-stable",
    label: "Call Code Blue for monitoring patient",
    description: "Activate code for a patient who is haemodynamically stable",
    appropriateForAcuity: [],
    scoreModifier: -20,
    acuityEffect: "no_effect",
  },
  {
    id: "ignore-critical",
    label: "Continue charting — will check later",
    description: "Defer assessment of a critical alert",
    appropriateForAcuity: [],
    scoreModifier: -30,
    acuityEffect: "worsens",
  },
];

// ─── Shift scenarios ──────────────────────────────────────────────────────────

export type TelemetryShiftScenario = {
  id: string;
  title: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** Duration in ticks (1 tick = ~30 seconds of simulated time) */
  durationTicks: number;
  /** Initial state of all patient beds */
  initialBeds: ShiftPatientBed[];
  /** Events that fire at specific ticks */
  timedEvents: ShiftTimedEvent[];
  /** Teaching points revealed at scenario end */
  debrief: {
    keyLessons: string[];
    prioritisationRationale: string;
    missedOpportunities: string[];
  };
};

export type ShiftTimedEvent = {
  tick: number;
  bedId: string;
  eventType: "rhythm_change" | "vital_deterioration" | "patient_alert" | "new_alert";
  newRhythmKey?: string;
  newDisplayRate?: number;
  newAcuityLevel?: PatientAcuityLevel;
  alertToAdd?: Omit<ShiftAlert, "triggeredAt">;
  newVitals?: ShiftPatientBed["vitals"];
  narrative?: string;
};

// ─── Scenario: Four-patient shift ─────────────────────────────────────────────

export const TELEMETRY_SHIFT_SCENARIOS: TelemetryShiftScenario[] = [
  {
    id: "standard-ward-shift",
    title: "Telemetry Ward — Four-Patient Shift",
    description: "Manage a 4-patient telemetry assignment. Three patients are stable, one is actively deteriorating. You must triage, prioritise correctly, and respond to evolving alarms.",
    difficulty: "intermediate",
    durationTicks: 20,
    initialBeds: [
      {
        bedId: "bed-1",
        patientName: "Mr. Caldwell, 72",
        age: 72,
        diagnosis: "Anterior STEMI Day 2 post-PCI",
        currentRhythmKey: "pvcs",
        displayRate: 84,
        acuityLevel: "concern",
        vitals: { hr: "84 irregular", bp: "118/72", spo2: "97%", loc: "Alert" },
        clinicalContext: "Increasing PVCs on telemetry. K⁺ 3.3 from morning labs. Has not yet received scheduled K⁺/Mg²⁺ replacement.",
        activeAlerts: [
          {
            id: "a1-pvc-burden",
            severity: "warning",
            message: "Increasing PVC burden — K⁺ 3.3, Mg²⁺ not yet replaced",
            rhythmKey: "pvcs",
            triggeredAt: 0,
            responseDeadlineTicks: 6,
          },
        ],
        assessed: false,
      },
      {
        bedId: "bed-2",
        patientName: "Ms. Oyelaran, 58",
        age: 58,
        diagnosis: "AF with RVR — on rate control",
        currentRhythmKey: "atrial_fibrillation",
        displayRate: 88,
        acuityLevel: "monitoring",
        vitals: { hr: "88 irregular", bp: "124/78", spo2: "96%", loc: "Alert" },
        clinicalContext: "Rate now controlled at 88. On diltiazem infusion. Anticoagulation started. Stable.",
        activeAlerts: [],
        assessed: false,
      },
      {
        bedId: "bed-3",
        patientName: "Mr. Ostrowski, 81",
        age: 81,
        diagnosis: "Inferior STEMI Day 1 — monitoring for heart block",
        currentRhythmKey: "first_degree_av_block",
        displayRate: 65,
        acuityLevel: "concern",
        vitals: { hr: "65 regular", bp: "108/66", spo2: "95%", loc: "Alert" },
        clinicalContext: "PR interval 0.24s and trending. Inferior MI territory (RCA). Watching for Wenckebach progression.",
        activeAlerts: [
          {
            id: "a3-pr-prolonging",
            severity: "warning",
            message: "PR interval 0.24s — trending upward. Monitor for Wenckebach.",
            rhythmKey: "first_degree_av_block",
            triggeredAt: 0,
            responseDeadlineTicks: 10,
          },
        ],
        assessed: false,
      },
      {
        bedId: "bed-4",
        patientName: "Ms. Chen, 66",
        age: 66,
        diagnosis: "NSR — monitoring post knee replacement",
        currentRhythmKey: "normal_sinus_rhythm",
        displayRate: 76,
        acuityLevel: "stable",
        vitals: { hr: "76 regular", bp: "132/80", spo2: "98%", loc: "Alert" },
        clinicalContext: "No cardiac history. On telemetry per protocol for post-op monitoring. No concerns.",
        activeAlerts: [],
        assessed: false,
      },
    ],
    timedEvents: [
      // Tick 3: Bed 1 PVCs escalate to bigeminy
      {
        tick: 3,
        bedId: "bed-1",
        eventType: "rhythm_change",
        newRhythmKey: "pvcs",
        newDisplayRate: 90,
        newAcuityLevel: "urgent",
        alertToAdd: {
          id: "a1-bigeminy",
          severity: "urgent",
          message: "PVC bigeminy — electrolytes still not replaced. Patient reporting palpitations.",
          rhythmKey: "pvcs",
          responseDeadlineTicks: 4,
        },
        narrative: "Mr. Caldwell's PVC burden has escalated to bigeminy. The electrolyte replacement has not yet been initiated.",
      },
      // Tick 5: Bed 3 progresses to Wenckebach
      {
        tick: 5,
        bedId: "bed-3",
        eventType: "rhythm_change",
        newRhythmKey: "second_degree_type_i_av_block",
        newDisplayRate: 55,
        newAcuityLevel: "urgent",
        newVitals: { hr: "55 regularly irregular", bp: "102/62", spo2: "94%", loc: "Alert, mild dizziness" },
        alertToAdd: {
          id: "a3-wenckebach",
          severity: "urgent",
          message: "Wenckebach pattern now established. Rate 55. Patient mildly dizzy.",
          rhythmKey: "second_degree_type_i_av_block",
          responseDeadlineTicks: 6,
        },
        narrative: "Mr. Ostrowski has progressed from 1st degree block to Wenckebach as expected with inferior STEMI RCA involvement.",
      },
      // Tick 8: Bed 4 develops new AF (unexpected)
      {
        tick: 8,
        bedId: "bed-4",
        eventType: "rhythm_change",
        newRhythmKey: "atrial_fibrillation",
        newDisplayRate: 122,
        newAcuityLevel: "concern",
        newVitals: { hr: "122 irregular", bp: "114/72", spo2: "95%", loc: "Alert, new palpitations" },
        alertToAdd: {
          id: "a4-new-afib",
          severity: "warning",
          message: "New-onset AFib at 122 BPM. Post-op patient, no prior AF history.",
          rhythmKey: "atrial_fibrillation",
          responseDeadlineTicks: 8,
        },
        narrative: "Ms. Chen has developed new-onset AF — a recognised complication in post-surgical patients.",
      },
      // Tick 12: Bed 1 PVCs → VT if not treated
      {
        tick: 12,
        bedId: "bed-1",
        eventType: "rhythm_change",
        newRhythmKey: "ventricular_tachycardia",
        newDisplayRate: 155,
        newAcuityLevel: "critical",
        newVitals: { hr: "155 wide complex", bp: "88/52", spo2: "92%", loc: "Alert but distressed" },
        alertToAdd: {
          id: "a1-vt",
          severity: "critical",
          message: "CRITICAL: VT at 155 BPM! BP 88/52! Haemodynamically unstable.",
          rhythmKey: "ventricular_tachycardia",
          responseDeadlineTicks: 3,
        },
        narrative: "The unaddressed PVC burden has escalated to ventricular tachycardia. Mr. Caldwell is haemodynamically unstable.",
      },
    ],
    debrief: {
      keyLessons: [
        "Bed 1 (PVCs with low K⁺/Mg²⁺ in post-MI) was the highest-priority patient from the start — electrolyte correction needed to happen in the first 2 ticks.",
        "Bed 3 (inferior STEMI with PR prolongation) was the second priority — monitoring for Wenckebach progression with pacing readiness.",
        "Bed 4 (NSR post-op) was appropriately the lowest priority despite appearing on the same screen — stable rhythms allow documentation and routine monitoring.",
        "VT at tick 12 in Bed 1 was a direct consequence of delayed electrolyte correction — a preventable deterioration.",
      ],
      prioritisationRationale:
        "The correct prioritisation order was: Bed 1 (active electrolyte problem + PVCs in post-MI) > Bed 3 (inferior MI with PR trending) > Bed 2 (stable rate-controlled AF) > Bed 4 (NSR, stable).",
      missedOpportunities: [
        "Early K⁺/Mg²⁺ replacement for Bed 1 would have prevented the VT at tick 12.",
        "Pacing readiness preparation for Bed 3 before Wenckebach developed would have been proactive.",
        "Bed 4 new AF should not be prioritised above Beds 1 and 3.",
      ],
    },
  },
];

// ─── Session state ────────────────────────────────────────────────────────────

export type ShiftPrioritisationRecord = {
  tick: number;
  bedId: string;
  action: ShiftAction;
  wasCorrectPriority: boolean;
  points: number;
  feedback: string;
};

export type TelemetryShiftSession = {
  sessionId: string;
  scenarioId: string;
  currentTick: number;
  beds: ShiftPatientBed[];
  decisions: ShiftPrioritisationRecord[];
  totalScore: number;
  phase: "active" | "complete";
  startedAt: string;
  completedAt: string | null;
};

export function createTelemetryShiftSession(scenarioId: string): TelemetryShiftSession {
  const scenario = TELEMETRY_SHIFT_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioId}`);
  return {
    sessionId: `shift-${scenarioId}-${Date.now()}`,
    scenarioId,
    currentTick: 0,
    beds: JSON.parse(JSON.stringify(scenario.initialBeds)) as ShiftPatientBed[],
    decisions: [],
    totalScore: 0,
    phase: "active",
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

/** Advance the shift simulation by one tick, applying any timed events. */
export function advanceShiftTick(session: TelemetryShiftSession): TelemetryShiftSession {
  const scenario = TELEMETRY_SHIFT_SCENARIOS.find((s) => s.id === session.scenarioId);
  if (!scenario) return session;

  const nextTick = session.currentTick + 1;
  const isComplete = nextTick >= scenario.durationTicks;

  // Apply timed events for this tick
  let updatedBeds = session.beds.map((b) => ({ ...b, assessed: false }));
  for (const event of scenario.timedEvents) {
    if (event.tick !== nextTick) continue;
    updatedBeds = updatedBeds.map((bed) => {
      if (bed.bedId !== event.bedId) return bed;
      const updated = { ...bed };
      if (event.newRhythmKey) updated.currentRhythmKey = event.newRhythmKey;
      if (event.newDisplayRate !== undefined) updated.displayRate = event.newDisplayRate;
      if (event.newAcuityLevel) updated.acuityLevel = event.newAcuityLevel;
      if (event.newVitals) updated.vitals = event.newVitals;
      if (event.alertToAdd) {
        updated.activeAlerts = [
          ...updated.activeAlerts,
          { ...event.alertToAdd, triggeredAt: nextTick },
        ];
      }
      return updated;
    });
  }

  return {
    ...session,
    currentTick: nextTick,
    beds: updatedBeds,
    phase: isComplete ? "complete" : "active",
    completedAt: isComplete ? new Date().toISOString() : null,
  };
}

/** Apply a learner action to a specific patient bed. */
export function applyShiftAction(
  session: TelemetryShiftSession,
  bedId: string,
  actionId: string,
): { updatedSession: TelemetryShiftSession; feedback: string; pointsEarned: number } {
  const action = SHIFT_ACTIONS.find((a) => a.id === actionId);
  const bed = session.beds.find((b) => b.bedId === bedId);
  if (!action || !bed) throw new Error("Invalid action or bed");

  const isAppropriate = action.appropriateForAcuity.includes(bed.acuityLevel);
  const highestAcuityBed = session.beds.reduce((prev, curr) => {
    const order: PatientAcuityLevel[] = ["stable", "monitoring", "concern", "urgent", "critical"];
    return order.indexOf(curr.acuityLevel) > order.indexOf(prev.acuityLevel) ? curr : prev;
  });
  const isCorrectPriority = bed.bedId === highestAcuityBed.bedId || bed.acuityLevel === "critical" || bed.acuityLevel === "urgent";

  const points = isAppropriate ? (isCorrectPriority ? action.scoreModifier : Math.round(action.scoreModifier * 0.5)) : action.scoreModifier;

  let feedback: string;
  if (!isAppropriate) {
    feedback = `${action.label} is not appropriate for this patient's current acuity (${bed.acuityLevel}). This may over- or under-escalate care.`;
  } else if (!isCorrectPriority) {
    feedback = `Correct action for this patient — but ${highestAcuityBed.patientName} in ${highestAcuityBed.bedId} has higher acuity and should have been prioritised first.`;
  } else {
    feedback = `Correct — ${action.label} is appropriate for ${bed.patientName}'s acuity level and this is the correct patient to prioritise.`;
  }

  const record: ShiftPrioritisationRecord = {
    tick: session.currentTick,
    bedId,
    action,
    wasCorrectPriority: isCorrectPriority,
    points,
    feedback,
  };

  // Apply acuity effect
  const updatedBeds = session.beds.map((b) => {
    if (b.bedId !== bedId) return b;
    const acuityLevels: PatientAcuityLevel[] = ["stable", "monitoring", "concern", "urgent", "critical"];
    const currentIdx = acuityLevels.indexOf(b.acuityLevel);
    if (action.acuityEffect === "stabilises" || action.acuityEffect === "improves") {
      return { ...b, acuityLevel: acuityLevels[Math.max(0, currentIdx - 1)] as PatientAcuityLevel, assessed: true };
    }
    if (action.acuityEffect === "worsens") {
      return { ...b, acuityLevel: acuityLevels[Math.min(4, currentIdx + 1)] as PatientAcuityLevel, assessed: true };
    }
    return { ...b, assessed: true };
  });

  return {
    updatedSession: {
      ...session,
      beds: updatedBeds,
      decisions: [...session.decisions, record],
      totalScore: session.totalScore + points,
    },
    feedback,
    pointsEarned: points,
  };
}

export function scoreShiftSession(session: TelemetryShiftSession): {
  totalScore: number;
  maxPossibleScore: number;
  percentScore: number;
  prioritisationAccuracy: number;
  correctEscalations: number;
  missedCriticalAlerts: number;
  grade: "A" | "B" | "C" | "F";
} {
  const decisions = session.decisions;
  const correctPriority = decisions.filter((d) => d.wasCorrectPriority).length;
  const totalDecisions = decisions.length;
  const prioritisationAccuracy = totalDecisions > 0 ? Math.round((correctPriority / totalDecisions) * 100) : 0;
  const correctEscalations = decisions.filter((d) => d.action.acuityEffect === "stabilises").length;

  const scenario = TELEMETRY_SHIFT_SCENARIOS.find((s) => s.id === session.scenarioId);
  const maxPossibleScore = scenario ? scenario.durationTicks * 15 : 100;
  const percentScore = Math.round((session.totalScore / maxPossibleScore) * 100);

  const criticalMissed = session.beds.filter(
    (b) => b.acuityLevel === "critical" && b.activeAlerts.length > 0 && !b.assessed,
  ).length;

  return {
    totalScore: session.totalScore,
    maxPossibleScore,
    percentScore,
    prioritisationAccuracy,
    correctEscalations,
    missedCriticalAlerts: criticalMissed,
    grade: percentScore >= 85 ? "A" : percentScore >= 70 ? "B" : percentScore >= 55 ? "C" : "F",
  };
}
