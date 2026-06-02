import assert from "node:assert/strict";
import test from "node:test";
import {
  buildScopeAlignmentIntelligenceReport,
  classifyScopeAlignment,
  scoreScopeAlignmentItem,
} from "@/lib/content-scope/scope-alignment-intelligence-engine";
import type { ContentScopeAuditItem } from "@/lib/content-scope/content-scope-auditor";

function item(overrides: Partial<ContentScopeAuditItem>): ContentScopeAuditItem {
  return {
    id: "question:1",
    surface: "question",
    title: "Which action is appropriate?",
    body: "The learner reviews the clinical cues and selects the safest next nursing action.",
    tier: "RN",
    exam: "NCLEX-RN",
    country: "US",
    careerType: "nursing",
    pathwayId: "us-rn-nclex-rn",
    topic: "Safety",
    tags: [],
    ...overrides,
  };
}

test("scope alignment classifies entry-level and specialty content", () => {
  const classifications = classifyScopeAlignment(
    item({
      body: "The RN recognizes septic shock and escalates care. The ICU team manages vasopressor titration.",
      topic: "Sepsis",
    }),
  );

  assert.equal(classifications.includes("Entry-Level RN"), true);
  assert.equal(classifications.includes("Critical Care"), true);
  assert.equal(classifications.includes("Emergency"), true);
});

test("scope alignment scores RN ICU ventilator leakage as critical", () => {
  const scored = scoreScopeAlignmentItem(
    item({
      body: "The RN independently changes ventilator mode, performs PEEP titration, and evaluates plateau pressure.",
      topic: "Respiratory",
    }),
  );

  assert.ok(scored.scopeAlignmentScore < 70);
  assert.equal(scored.findings.some((finding) => finding.issueType === "rn_icu_ventilator_management"), true);
  assert.equal(scored.flags.includes("rn_icu_ventilator_management"), true);
});

test("scope alignment flags RPN content requiring NP diagnostics", () => {
  const scored = scoreScopeAlignmentItem(
    item({
      id: "flashcard:rpn-dx",
      surface: "flashcard",
      tier: "RPN",
      exam: "REx-PN",
      country: "CA",
      pathwayId: "ca-pn-rex-pn",
      topic: "Diagnostics",
      body: "The RPN forms a differential diagnosis, orders CT imaging, and prescribes antibiotic therapy.",
    }),
  );

  assert.equal(scored.classifications.includes("Entry-Level RPN"), true);
  assert.equal(scored.classifications.includes("Advanced Practice"), true);
  assert.equal(scored.findings.some((finding) => finding.issueType === "rpn_np_level_diagnostics"), true);
});

test("scope alignment report generates pathway, topic, content type, and review queue summaries", () => {
  const report = buildScopeAlignmentIntelligenceReport(
    [
      item({ id: "question:clean", topic: "Maternal Child", body: "The RN monitors postpartum bleeding and reports signs of hemorrhage." }),
      item({
        id: "ecg:advanced",
        surface: "ecg",
        topic: "Telemetry",
        body: "The RN adjusts overdrive pacing and capture threshold for a temporary pacemaker.",
      }),
      item({
        id: "simulation:rt",
        surface: "simulation",
        tier: "RT",
        careerType: "respiratory",
        pathwayId: "rt",
        topic: "Ventilation",
        body: "Respiratory therapy simulation for ventilator mode selection and ABG interpretation.",
      }),
    ],
    "2026-05-30T00:00:00.000Z",
  );

  assert.equal(report.totalItems, 3);
  assert.equal(report.byPathway["us-rn-nclex-rn"].audited, 2);
  assert.equal(report.byTopic.Telemetry.flagged, 1);
  assert.equal(report.byContentType.ecg.flagged, 1);
  assert.equal(report.reviewQueues.High.some((row) => row.itemId === "ecg:advanced"), true);
  assert.ok(report.overallScore < 100);
});
