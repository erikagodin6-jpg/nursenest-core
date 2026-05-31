import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  auditContentRelationshipNode,
  contentRelationshipCompletenessScore,
  type ContentRelationshipNode,
} from "./content-relationship-engine";
import { validateContentDepthRequirements } from "./content-depth-requirements";
import { QUESTION_GENERATION_FACTORY, validateQuestionGenerationFactory } from "./question-generation-factory";
import { summarizePearlHintTargets, validatePearlHintDatabases } from "./clinical-pearl-and-hint-database";
import { summarizeCaseSimulationTargets, validateCaseSimulationFactory } from "./case-and-simulation-factory";
import { AI_CONTENT_WORKFLOW_TEMPLATES, validateAiContentWorkflowTemplates } from "./ai-content-workflow-templates";
import { runContentGovernanceEngine } from "./content-governance-engine";

const completeNode: ContentRelationshipNode = {
  id: "lesson-heart-failure",
  kind: "lesson",
  topicSlug: "heart-failure",
  relatedLessons: [{ id: "lesson-fluid-balance", kind: "lesson", relevance: "supporting" }],
  relatedFlashcards: [{ id: "flashcard-hf-daily-weights", kind: "flashcard", relevance: "primary" }],
  relatedQuestions: [{ id: "question-hf-priority", kind: "question", relevance: "primary" }],
  relatedSimulations: [{ id: "simulation-hf-exacerbation", kind: "simulation", relevance: "remediation" }],
  relatedClinicalSkills: [{ id: "skill-lung-sounds", kind: "clinical_skill", relevance: "supporting" }],
  relatedReadinessDomains: [{ id: "domain-cardiovascular", kind: "readiness_domain", relevance: "primary" }],
};

describe("global content factory contracts", () => {
  it("requires educational assets to connect across the learning ecosystem", () => {
    assert.deepEqual(auditContentRelationshipNode(completeNode), []);
    assert.equal(contentRelationshipCompletenessScore(completeNode), 100);
  });

  it("rejects thin generation standards and enforces rich question requirements", () => {
    assert.deepEqual(validateContentDepthRequirements(), []);
    assert.deepEqual(validateQuestionGenerationFactory(), []);
    assert.equal(QUESTION_GENERATION_FACTORY.length, 9);
    for (const item of QUESTION_GENERATION_FACTORY) {
      assert.ok(item.requiredFields.includes("Hint"));
      assert.ok(item.requiredFields.includes("Why Incorrect"));
      assert.ok(item.requiredFields.includes("Clinical Context"));
      assert.ok(item.requiredFields.includes("Clinical Pearl"));
      assert.ok(item.requiredFields.includes("Related Flashcards"));
    }
  });

  it("sets 50,000+ pearl and hint targets without answer-revealing hints", () => {
    assert.deepEqual(validatePearlHintDatabases(), []);
    assert.deepEqual(summarizePearlHintTargets(), { clinicalPearls: 52000, hints: 50000 });
  });

  it("sets 10,000+ case and 5,000+ simulation targets", () => {
    assert.deepEqual(validateCaseSimulationFactory(), []);
    const totals = summarizeCaseSimulationTargets();
    assert.ok(totals.cases >= 10000);
    assert.ok(totals.simulations >= 5000);
  });

  it("keeps AI workflow templates gated and non-auto-publishing", () => {
    assert.deepEqual(validateAiContentWorkflowTemplates(), []);
    assert.equal(AI_CONTENT_WORKFLOW_TEMPLATES.length, 7);
    for (const template of AI_CONTENT_WORKFLOW_TEMPLATES) {
      assert.equal(template.qualityGate, "content_governance_engine");
      assert.equal(template.publishAutomatically, false);
    }
  });

  it("fails governance for placeholders, duplicates, weak rationales, and missing teaching supports", () => {
    const result = runContentGovernanceEngine({
      id: "bad-item",
      text: "TODO placeholder content",
      relationshipNode: { ...completeNode, relatedQuestions: [], relatedFlashcards: [], relatedSimulations: [] },
      hasClinicalPearl: false,
      hasHint: false,
      hasRationale: false,
      duplicateScore: 0.9,
    });
    assert.equal(result.pass, false);
    assert.ok(result.issues.includes("placeholder"));
    assert.ok(result.issues.includes("duplicate_content"));
    assert.ok(result.issues.includes("weak_rationale"));
    assert.ok(result.issues.includes("missing_clinical_pearl"));
    assert.ok(result.issues.includes("missing_hint"));
  });
});
