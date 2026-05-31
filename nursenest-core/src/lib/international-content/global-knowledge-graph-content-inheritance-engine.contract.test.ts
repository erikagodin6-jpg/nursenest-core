import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GLOBAL_KNOWLEDGE_COUNTRY_OVERLAY_RULES,
  GLOBAL_KNOWLEDGE_EXAM_OVERLAY_RULES,
  GLOBAL_KNOWLEDGE_GENERATION_RULES,
  GLOBAL_KNOWLEDGE_INHERITANCE_SEQUENCE,
  GLOBAL_KNOWLEDGE_LANGUAGE_OVERLAY_RULES,
  GLOBAL_KNOWLEDGE_NODE_TYPES,
  GLOBAL_KNOWLEDGE_ROLE_OVERLAY_RULES,
  GLOBAL_KNOWLEDGE_SAMPLE_NODES,
  buildGlobalKnowledgeGraphDashboard,
  buildKnowledgeNodeUpdateQueue,
  isKnowledgeNodeApprovedForGeneration,
  validateGlobalKnowledgeGraphInheritanceEngine,
} from "./global-knowledge-graph-content-inheritance-engine";

describe("global knowledge graph content inheritance engine", () => {
  it("validates the approved graph contract", () => {
    assert.deepEqual(validateGlobalKnowledgeGraphInheritanceEngine(), []);
  });

  it("declares the required clinical knowledge node types", () => {
    for (const nodeType of [
      "Clinical Condition",
      "Medication",
      "Laboratory Test",
      "ECG Concept",
      "Clinical Skill",
      "Assessment Finding",
      "Symptom",
      "Diagnostic Test",
      "Safety Principle",
      "Communication Principle",
      "Leadership Concept",
      "Documentation Concept",
      "Professional Standard",
      "Regulatory Requirement",
    ]) {
      assert.ok(GLOBAL_KNOWLEDGE_NODE_TYPES.includes(nodeType));
    }
  });

  it("enforces the approved inheritance sequence", () => {
    assert.deepEqual(GLOBAL_KNOWLEDGE_INHERITANCE_SEQUENCE, [
      "Clinical Concept",
      "Learning Objective",
      "Role Overlay",
      "Country Overlay",
      "Exam Overlay",
      "Language Overlay",
      "Educational Asset",
    ]);
  });

  it("keeps overlays non-duplicative", () => {
    for (const rule of [
      ...GLOBAL_KNOWLEDGE_ROLE_OVERLAY_RULES,
      ...GLOBAL_KNOWLEDGE_COUNTRY_OVERLAY_RULES,
      ...GLOBAL_KNOWLEDGE_EXAM_OVERLAY_RULES,
      ...GLOBAL_KNOWLEDGE_LANGUAGE_OVERLAY_RULES,
    ]) {
      assert.equal(rule.mayDuplicateCoreNode, false);
      assert.ok(rule.requiredConcepts.length > 0);
    }
  });

  it("generates educational assets from clinical knowledge nodes rather than primary content objects", () => {
    const assetKinds = GLOBAL_KNOWLEDGE_GENERATION_RULES.map((rule) => rule.assetKind);

    assert.deepEqual(assetKinds, [
      "Lesson",
      "Question",
      "Flashcard",
      "Simulation",
      "Case Study",
      "Practice Exam Item",
      "CAT Item",
      "Daily Question",
      "Blog Content",
    ]);

    for (const rule of GLOBAL_KNOWLEDGE_GENERATION_RULES) {
      assert.equal(rule.generatedFrom, "clinical_knowledge_node");
      assert.equal(rule.requiresApprovedClinicalCore, true);
    }
  });

  it("blocks downstream generation until node governance thresholds pass", () => {
    const sepsis = GLOBAL_KNOWLEDGE_SAMPLE_NODES.find((node) => node.nodeId === "clinical-condition-sepsis");
    const furosemide = GLOBAL_KNOWLEDGE_SAMPLE_NODES.find((node) => node.nodeId === "medication-furosemide");

    assert.ok(sepsis);
    assert.ok(furosemide);
    assert.equal(isKnowledgeNodeApprovedForGeneration(sepsis), true);
    assert.equal(isKnowledgeNodeApprovedForGeneration(furosemide), false);
    assert.equal(buildKnowledgeNodeUpdateQueue(furosemide).length, 0);
  });

  it("creates update queues for all downstream inherited asset types when an approved node changes", () => {
    const sepsis = GLOBAL_KNOWLEDGE_SAMPLE_NODES.find((node) => node.nodeId === "clinical-condition-sepsis");
    assert.ok(sepsis);

    const queue = buildKnowledgeNodeUpdateQueue(sepsis);
    assert.equal(queue.length, sepsis.downstreamAssets.length);
    assert.ok(queue.some((item) => item.affectedAssetKind === "Lesson"));
    assert.ok(queue.some((item) => item.affectedAssetKind === "Question"));
    assert.ok(queue.some((item) => item.affectedAssetKind === "Flashcard"));
    assert.ok(queue.some((item) => item.affectedAssetKind === "Simulation"));
    assert.ok(queue.some((item) => item.affectedAssetKind === "Blog Content"));
    assert.ok(queue.every((item) => item.affectedCountries.includes("United Kingdom")));
    assert.ok(queue.every((item) => item.affectedExams.includes("NMC CBT")));
    assert.ok(queue.every((item) => item.affectedLanguages.includes("fr")));
  });

  it("builds the graph dashboard", () => {
    const dashboard = buildGlobalKnowledgeGraphDashboard();
    assert.equal(dashboard.nodeTypeCount, 14);
    assert.equal(dashboard.nodeCount, GLOBAL_KNOWLEDGE_SAMPLE_NODES.length);
    assert.equal(dashboard.approvedGenerationNodeCount, 2);
    assert.equal(dashboard.blockedGenerationNodeCount, 1);
    assert.equal(dashboard.roleOverlayCount, 3);
    assert.equal(dashboard.countryOverlayCount, 5);
    assert.equal(dashboard.examOverlayCount, 2);
    assert.equal(dashboard.languageOverlayCount, 2);
    assert.equal(dashboard.generationRuleCount, 9);
    assert.equal(dashboard.updateQueueCount, 17);
  });
});
