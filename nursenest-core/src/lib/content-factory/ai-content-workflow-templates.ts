export type AiContentWorkflowKind =
  | "lesson"
  | "flashcard"
  | "question"
  | "case_study"
  | "simulation"
  | "clinical_pearl"
  | "hint";

export type AiContentWorkflowTemplate = {
  readonly kind: AiContentWorkflowKind;
  readonly requiredInputs: readonly string[];
  readonly requiredOutputs: readonly string[];
  readonly qualityGate: "content_governance_engine";
  readonly publishAutomatically: false;
};

export const AI_CONTENT_WORKFLOW_TEMPLATES: readonly AiContentWorkflowTemplate[] = [
  {
    kind: "lesson",
    requiredInputs: ["topicSlug", "profession", "country", "exam", "competencyDomain"],
    requiredOutputs: ["sections", "learningObjectives", "knowledgeCheck", "relatedContent"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "flashcard",
    requiredInputs: ["topicSlug", "lessonId", "competencyDomain"],
    requiredOutputs: ["prompt", "answer", "clinicalRelevance", "memoryHook", "relatedContent"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "question",
    requiredInputs: ["topicSlug", "questionType", "exam", "country", "relatedLessonId"],
    requiredOutputs: ["hint", "correctAnswer", "whyCorrect", "whyIncorrect", "clinicalApplication", "clinicalPearl", "examStrategy", "relatedContent"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "case_study",
    requiredInputs: ["profession", "topicSlug", "complexity", "competencyDomain"],
    requiredOutputs: ["history", "assessment", "diagnostics", "decisionPoints", "outcomes", "documentation", "debrief"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "simulation",
    requiredInputs: ["profession", "domain", "level", "topicSlug"],
    requiredOutputs: ["stateModel", "decisionPoints", "outcomes", "debrief", "relatedContent"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "clinical_pearl",
    requiredInputs: ["topicSlug", "category", "clinicalContext"],
    requiredOutputs: ["pearl", "reuseTags", "relatedContent"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
  {
    kind: "hint",
    requiredInputs: ["topicSlug", "hintType", "questionId"],
    requiredOutputs: ["hint", "reasoningCue", "answerDisclosureCheck"],
    qualityGate: "content_governance_engine",
    publishAutomatically: false,
  },
] as const;

export function validateAiContentWorkflowTemplates(): readonly string[] {
  const issues: string[] = [];
  for (const template of AI_CONTENT_WORKFLOW_TEMPLATES) {
    if (template.requiredInputs.length < 2) issues.push(`${template.kind} workflow needs richer inputs`);
    if (template.requiredOutputs.length < 3) issues.push(`${template.kind} workflow needs richer outputs`);
    if (template.publishAutomatically) issues.push(`${template.kind} workflow must not auto-publish`);
  }
  return issues;
}
