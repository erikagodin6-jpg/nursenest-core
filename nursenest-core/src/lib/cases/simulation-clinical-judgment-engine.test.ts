import assert from "node:assert/strict";
import test from "node:test";
import type { CaseDecisionRecord, CaseStep } from "@/lib/cases/longitudinal-case-types";
import {
  buildSimulationPracticeFrame,
  CLINICAL_JUDGMENT_CARE_CYCLE,
  consequenceNarrativeForDecision,
  NGN_SIMULATION_FORMATS,
  scoreSimulationJudgmentDimensions,
  SIMULATION_ANALYTICS_DIMENSIONS,
  SIMULATION_CONTENT_TARGETS,
  SIMULATION_SPECIALTY_LIBRARY,
} from "./simulation-clinical-judgment-engine";

function step(overrides: Partial<CaseStep> = {}): CaseStep {
  return {
    index: 0,
    heading: "Chest pain reassessment",
    updateNarrative: "The patient reports worsening chest pressure.",
    scenarioText: "You reassess a patient whose symptoms have changed.",
    clinicalUpdate: {
      direction: "critical",
      summary: "Chest pain is worsening and the patient appears diaphoretic.",
      newFindings: ["New shortness of breath", "Pain radiating to left arm"],
    },
    vitals: [
      { label: "BP", value: "88/52", flag: "critical" },
      { label: "SpO2", value: "89", unit: "%", flag: "low" },
    ],
    diagnosticArtifacts: [
      {
        type: "ecg",
        name: "12-lead ECG",
        finding: "New ST elevation in inferior leads",
        isAbnormal: true,
      },
    ],
    medicationChanges: [{ name: "Nitroglycerin", route: "SL", change: "hold", note: "Hypotension present" }],
    followUpInterval: { value: 15, unit: "minutes", label: "15 minutes later" },
    cnpleDomain: "acute-urgent-care",
    question: {
      stem: "What is the priority action?",
      family: "chest-pain-differential",
      options: [
        { id: "A", label: "Call rapid response and prepare for urgent transfer" },
        { id: "B", label: "Reassess in one hour" },
      ],
      correctOptionId: "A",
      rationale: "Unstable chest pain requires urgent escalation.",
      clinicalJudgmentFocus: "Recognition cues, prioritization, escalation, and evaluation.",
      consequencesByOptionId: {
        A: { trajectory: "optimal", outcome: "The patient is escalated quickly." },
        B: { trajectory: "harmful", outcome: "The patient deteriorates while waiting." },
      },
    },
    ...overrides,
  };
}

test("simulation practice frame makes clinical judgment workflow explicit", () => {
  const frame = buildSimulationPracticeFrame({ estimatedMinutes: 30 }, step());

  assert.equal(frame.timeHorizon, "30_min");
  assert.deepEqual(frame.careCycle, CLINICAL_JUDGMENT_CARE_CYCLE);
  assert.deepEqual(frame.ngnFormats, NGN_SIMULATION_FORMATS);
  assert.ok(frame.requiredActions.includes("assessment"));
  assert.ok(frame.requiredActions.includes("recognition"));
  assert.ok(frame.requiredActions.includes("prioritization"));
  assert.ok(frame.requiredActions.includes("intervention"));
  assert.ok(frame.requiredActions.includes("evaluation"));
  assert.ok(frame.requiredActions.includes("escalation"));
  assert.ok(frame.requiredActions.includes("documentation"));
});

test("patient evolution frame captures worsening vitals, ECG, medications, charting, team communication, and handoff", () => {
  const frame = buildSimulationPracticeFrame({ estimatedMinutes: 60 }, step());

  assert.equal(frame.timeHorizon, "60_min");
  assert.ok(frame.patientEvolutionSignals.some((signal) => signal.source === "vitals" && signal.severity === "critical"));
  assert.ok(frame.patientEvolutionSignals.some((signal) => signal.source === "oxygen"));
  assert.ok(frame.patientEvolutionSignals.some((signal) => signal.source === "ecg"));
  assert.ok(frame.patientEvolutionSignals.some((signal) => signal.source === "medications"));
  assert.ok(frame.documentationTasks.some((task) => /SBAR/i.test(task)));
  assert.ok(frame.teamCommunicationPrompts.some((prompt) => /provider|SBAR|team/i.test(prompt)));
  assert.ok(frame.handoffPrompts.length >= 3);
});

test("adaptive remediation routes target actual simulation errors instead of generic advice", () => {
  const medFrame = buildSimulationPracticeFrame(
    { estimatedMinutes: 15 },
    step({ question: { ...step().question, family: "safe-prescribing-medication-management" } }),
  );
  const cardiacFrame = buildSimulationPracticeFrame({ estimatedMinutes: 15 }, step());

  assert.ok(medFrame.adaptiveRemediationRoutes.some((route) => route.surface === "pharmacology"));
  assert.ok(cardiacFrame.adaptiveRemediationRoutes.some((route) => route.surface === "ecg"));
  assert.ok(cardiacFrame.adaptiveRemediationRoutes.some((route) => route.surface === "lessons"));
  assert.ok(cardiacFrame.adaptiveRemediationRoutes.some((route) => route.surface === "questions"));
  assert.ok(cardiacFrame.adaptiveRemediationRoutes.some((route) => route.surface === "flashcards"));
});

test("decision consequence narratives preserve patient-care framing", () => {
  assert.match(consequenceNarrativeForDecision("optimal"), /patient improves|stabilized/i);
  assert.match(consequenceNarrativeForDecision("harmful"), /critical safety event|deteriorates/i);
});

test("simulation analytics dimensions score recognition, safety, communication, documentation, and decision quality", () => {
  const decisions: CaseDecisionRecord[] = [
    {
      stepIndex: 0,
      chosenOptionId: "A",
      isCorrect: true,
      cnpleDomainSlug: "acute-urgent-care",
      trajectory: "optimal",
      dwellMs: 45_000,
      trajectorySeverity: 0,
      followUpAppropriateness: "appropriate",
    },
    {
      stepIndex: 1,
      chosenOptionId: "B",
      isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics",
      trajectory: "harmful",
      dwellMs: 150_000,
      trajectorySeverity: 50,
      followUpAppropriateness: "dangerous_delay",
    },
  ];

  const scores = scoreSimulationJudgmentDimensions(decisions);
  for (const dimension of SIMULATION_ANALYTICS_DIMENSIONS) {
    assert.equal(typeof scores[dimension], "number", `${dimension} should be scored`);
    assert.ok(scores[dimension] >= 0 && scores[dimension] <= 100, `${dimension} should be bounded`);
  }
  assert.ok(scores["Safety Score"] < 100);
  assert.ok(scores["Clinical Judgment Score"] < 100);
});

test("simulation engine declares flagship library and content target contracts", () => {
  for (const specialty of [
    "emergency",
    "critical_care",
    "telemetry",
    "maternal",
    "pediatrics",
    "mental_health",
    "community",
    "long_term_care",
    "leadership",
    "home_care",
    "perioperative",
    "dialysis",
    "primary_care",
    "np_practice",
  ] as const) {
    assert.ok(SIMULATION_SPECIALTY_LIBRARY[specialty], `missing specialty ${specialty}`);
  }

  assert.equal(SIMULATION_CONTENT_TARGETS.find((target) => target.tier === "rn")?.minimumSimulations, 250);
  assert.equal(SIMULATION_CONTENT_TARGETS.find((target) => target.tier === "pn")?.minimumSimulations, 200);
  assert.equal(SIMULATION_CONTENT_TARGETS.find((target) => target.tier === "np")?.minimumSimulations, 200);
});
