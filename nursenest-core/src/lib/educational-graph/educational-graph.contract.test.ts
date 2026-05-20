import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { auditNursingGlossaryRegistry } from "@/lib/educational-graph/nursing-glossary-governance";
import { auditRemediationSteps, dedupeGraphHrefs, passesEducationalRelevanceThreshold, scoreEducationalRelevance } from "@/lib/educational-graph/graph-governance";
import { buildMarketingRemediationLadderV2 } from "@/lib/educational-graph/remediation-ladder-v2";
import { resolveRnCompetencyForTopic, RN_COMPETENCY_NODES } from "@/lib/educational-graph/rn-competency-ontology";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { buildTopicHubLearningGraph } from "@/lib/educational-graph/topic-hub-learning-graph";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("RN educational graph — contracts", () => {
  it("ontology defines competencies with topic mappings", () => {
    assert.ok(RN_COMPETENCY_NODES.length >= 10);
    const sepsis = resolveRnCompetencyForTopic("sepsis");
    assert.ok(sepsis?.id === "infection_sepsis");
  });

  it("remediation ladder V2 is bounded and dedupes hrefs", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const steps = buildMarketingRemediationLadderV2({
      pathway,
      topicSlug: "sepsis",
      topicLabel: "Sepsis",
      anchorLessonSlug: "sepsis-overview",
      maxLessonSteps: 2,
    });
    assert.ok(steps.length >= 3);
    assert.ok(steps.length <= 8);
    const hrefs = steps.map((s) => s.href);
    const issues = auditRemediationSteps(hrefs);
    assert.equal(issues.filter((i) => i.code === "duplicate_href").length, 0);
  });

  it("glossary registry passes governance audit", () => {
    const audit = auditNursingGlossaryRegistry();
    assert.ok(audit.termCount >= 15);
    assert.equal(audit.issues.length, 0, audit.issues.map((i) => i.message).join("; "));
  });

  it("topic hub learning graph respects link cap", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const graph = buildTopicHubLearningGraph(pathway, "diabetic-ketoacidosis");
    assert.ok(graph);
    assert.ok(graph.links.length <= 6);
    const deduped = dedupeGraphHrefs(graph.links);
    assert.equal(deduped.length, graph.links.length);
  });

  it("orchestrator returns stepId on every step", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const t = orchestrateEducationalGraph({
      topicSlug: "sepsis",
      marketingPathway: pathway,
      sourceSurface: "topic_hub_public",
    });
    assert.ok(t.steps.every((s) => s.stepId.includes(":")));
    assert.ok(t.competencyId === "infection_sepsis");
  });

  it("educational relevance scoring gates weak edges", () => {
    const strong = scoreEducationalRelevance({
      sameTopic: true,
      sameCompetency: true,
      remediationIntent: true,
      mechanismMatch: false,
    });
    assert.ok(passesEducationalRelevanceThreshold(strong));
    const weak = scoreEducationalRelevance({
      sameTopic: false,
      sameCompetency: false,
      remediationIntent: false,
      mechanismMatch: false,
    });
    assert.ok(!passesEducationalRelevanceThreshold(weak));
  });
});
