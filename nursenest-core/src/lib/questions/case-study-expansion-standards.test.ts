import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateCaseStudyExpansion,
  resolveCaseStudyExpansionStandard,
  type CaseStudyQuestionInput,
  type CaseStudyStageInput,
} from "./case-study-expansion-standards";

const rnStages: CaseStudyStageInput[] = [
  {
    id: "presentation",
    timepoint: "0700",
    narrative: "A client admitted with pneumonia reports increased shortness of breath and fatigue.",
    workflowElements: ["patient-presentation", "evolving-symptoms", "nursing-notes"],
  },
  {
    id: "vitals",
    timepoint: "0730",
    narrative: "Vital signs change from SpO2 93% on room air to 86% despite 2 L/min oxygen.",
    workflowElements: ["changing-vitals", "deterioration-or-improvement", "reassessment-findings"],
  },
  {
    id: "orders",
    timepoint: "0745",
    narrative: "Provider orders chest x-ray, CBC, oxygen titration protocol, and IV antibiotic administration.",
    workflowElements: ["provider-orders", "labs-imaging", "medication-administration"],
  },
  {
    id: "communication",
    timepoint: "0800",
    narrative: "The nurse calls respiratory therapy and gives SBAR to the provider after reassessment shows worsening work of breathing.",
    workflowElements: ["interdisciplinary-communication", "reassessment-findings"],
  },
];

const rnQuestions: CaseStudyQuestionInput[] = [
  { id: "q1", focus: "assessment", stem: "Which assessment finding is most concerning?" },
  { id: "q2", focus: "prioritization", stem: "Which client problem should the nurse address first?" },
  { id: "q3", focus: "intervention-selection", stem: "Which intervention should the nurse implement next?" },
  { id: "q4", focus: "communication", stem: "Which SBAR statement is most appropriate?" },
  { id: "q5", focus: "escalation", stem: "Which change requires rapid escalation?" },
  { id: "q6", focus: "delegation", stem: "Which task can be delegated safely?" },
  { id: "q7", focus: "patient-education", stem: "Which teaching should be included before discharge?" },
  { id: "q8", focus: "discharge-planning", stem: "Which follow-up need should be included?" },
  { id: "q9", focus: "complication-recognition", stem: "Which finding suggests clinical worsening?" },
];

test("resolves tier-specific case-study expansion standards", () => {
  assert.equal(resolveCaseStudyExpansionStandard("RN").minimumQuestionCount, 6);
  assert.equal(resolveCaseStudyExpansionStandard("RPN").minimumStageCount, 3);
  assert.ok(resolveCaseStudyExpansionStandard("NP").purpose.includes("diagnostic"));
  assert.ok(resolveCaseStudyExpansionStandard("ALLIED").purpose.includes("profession-specific"));
});

test("passes a longitudinal RN case with evolving workflow and progressive questions", () => {
  const result = evaluateCaseStudyExpansion({
    tier: "RN",
    sourceStem: "A client with pneumonia develops worsening shortness of breath.",
    stages: rnStages,
    questions: rnQuestions,
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects standalone questions masquerading as case studies", () => {
  const result = evaluateCaseStudyExpansion({
    tier: "RN",
    sourceStem: "A client reports shortness of breath. What should the nurse do first?",
    stages: [
      {
        id: "single",
        narrative: "A client reports shortness of breath.",
        workflowElements: ["patient-presentation"],
      },
    ],
    questions: [{ id: "q1", focus: "assessment", stem: "What should the nurse assess?" }],
  });

  assert.ok(result.issues.some((issue) => issue.code === "INSUFFICIENT_STAGES"));
  assert.ok(result.issues.some((issue) => issue.code === "INSUFFICIENT_PROGRESSIVE_QUESTIONS"));
  assert.ok(result.issues.some((issue) => issue.code === "NO_EVOLUTION"));
  assert.equal(result.pass, false);
});

test("requires progressive case sequences to cover workflow and decision domains", () => {
  const result = evaluateCaseStudyExpansion({
    tier: "ALLIED",
    stages: [
      {
        id: "presentation",
        narrative: "A client arrives for a diagnostic test with worsening dyspnea.",
        workflowElements: ["patient-presentation", "evolving-symptoms"],
      },
      {
        id: "follow-up",
        narrative: "Later, the client reports dizziness and the technologist reassesses oxygen saturation.",
        workflowElements: ["reassessment-findings", "deterioration-or-improvement"],
      },
      {
        id: "handoff",
        narrative: "The technologist communicates the change to the nurse using a focused handoff.",
        workflowElements: ["interdisciplinary-communication"],
      },
    ],
    questions: [
      { id: "q1", focus: "assessment", stem: "Which cue is most concerning?" },
      { id: "q2", focus: "communication", stem: "Which handoff is best?" },
      { id: "q3", focus: "escalation", stem: "What should be escalated?" },
      { id: "q4", focus: "patient-education", stem: "What should be explained to the client?" },
      { id: "q5", focus: "complication-recognition", stem: "Which finding suggests deterioration?" },
    ],
  });

  assert.ok(result.issues.some((issue) => issue.code === "MISSING_WORKFLOW_ELEMENT"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_QUESTION_FOCUS"));
  assert.equal(result.pass, false);
});

test("guards tier scope when expanding case-study complexity", () => {
  const result = evaluateCaseStudyExpansion({
    tier: "RPN",
    stages: [
      {
        id: "presentation",
        narrative: "A stable client develops new chest discomfort during morning care.",
        workflowElements: ["patient-presentation", "evolving-symptoms", "nursing-notes"],
      },
      {
        id: "change",
        narrative: "After reassessment, blood pressure decreases and shortness of breath increases.",
        workflowElements: ["changing-vitals", "reassessment-findings", "deterioration-or-improvement"],
      },
      {
        id: "orders",
        narrative: "The practical nurse prepares ordered medication but must not diagnose acute coronary syndrome.",
        workflowElements: ["provider-orders", "medication-administration"],
      },
    ],
    questions: [
      { id: "q1", focus: "assessment", stem: "Which finding should be reported?" },
      { id: "q2", focus: "prioritization", stem: "What should the practical nurse do first?" },
      { id: "q3", focus: "intervention-selection", stem: "Which ordered action is appropriate?" },
      { id: "q4", focus: "communication", stem: "Which report is most complete?" },
      { id: "q5", focus: "escalation", stem: "When should the RN/provider be notified?" },
    ],
  });

  assert.ok(result.issues.some((issue) => issue.code === "SCOPE_MISMATCH"));
  assert.equal(result.pass, false);
});
