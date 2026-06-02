import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  buildConfidenceAnalyticsReport,
  normalizeConfidenceBand,
  type ConfidenceAnalyticsEvent,
} from "@/lib/study/confidence-analytics";

const ROOT = process.cwd();

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function event(
  id: string,
  isCorrect: boolean,
  confidence: ConfidenceAnalyticsEvent["confidence"],
  topic: string,
  weekOffset = 0,
): ConfidenceAnalyticsEvent {
  const occurredAt = new Date(Date.UTC(2026, 4, 25 + weekOffset));
  return { id, isCorrect, confidence, topic, occurredAt, source: "questions" };
}

describe("confidence analytics system", () => {
  it("normalizes both 1-5 ratings and label-based confidence", () => {
    assert.equal(normalizeConfidenceBand(5), "high");
    assert.equal(normalizeConfidenceBand(4), "high");
    assert.equal(normalizeConfidenceBand(3), "medium");
    assert.equal(normalizeConfidenceBand(2), "low");
    assert.equal(normalizeConfidenceBand(1), "low");
    assert.equal(normalizeConfidenceBand("very_confident"), "high");
    assert.equal(normalizeConfidenceBand("guessing"), "low");
    assert.equal(normalizeConfidenceBand("probably"), "medium");
  });

  it("tracks all four correctness-confidence quadrants and calibration scores", () => {
    const report = buildConfidenceAnalyticsReport([
      event("a", true, 5, "Cardiology"),
      event("b", true, "high", "Cardiology"),
      event("c", false, 5, "Cardiology"),
      event("d", false, "high", "Cardiology"),
      event("e", true, 1, "Respiratory"),
      event("f", true, "low", "Respiratory"),
      event("g", false, 1, "Respiratory"),
      event("h", false, "low", "Respiratory"),
      event("i", true, 3, "Renal"),
    ]);

    assert.equal(report.quadrants.correctHighConfidence, 2);
    assert.equal(report.quadrants.correctLowConfidence, 2);
    assert.equal(report.quadrants.incorrectHighConfidence, 2);
    assert.equal(report.quadrants.incorrectLowConfidence, 2);
    assert.equal(report.quadrants.mediumConfidence, 1);
    assert.equal(report.overconfidenceScore, 50);
    assert.equal(report.underconfidenceScore, 50);
    assert.equal(report.confidenceAccuracy, 50);
  });

  it("surfaces high-risk knowledge gaps and exam-ready recommendations", () => {
    const report = buildConfidenceAnalyticsReport([
      event("a", false, "high", "Pharmacology"),
      event("b", false, "high", "Pharmacology"),
      event("c", true, "low", "Labs"),
      event("d", true, "low", "Labs"),
      event("e", true, "low", "Labs"),
      event("f", true, "high", "Respiratory"),
      event("g", true, "high", "Respiratory"),
      event("h", true, "high", "Respiratory"),
      event("i", false, "low", "Respiratory"),
      event("j", true, "high", "Respiratory"),
      event("k", false, "low", "Respiratory"),
    ]);

    assert.equal(report.highRiskKnowledgeGaps[0]?.topic, "Pharmacology");
    assert.ok(report.recommendations.some((rec) => rec.kind === "remediation"));
    assert.ok(report.recommendations.some((rec) => rec.kind === "exam_ready"));
  });

  it("renders a Knowledge Confidence Report in learner analytics", () => {
    const client = readSource("src/app/(app)/app/(learner)/account/analytics/analytics-detail-client.tsx");
    const component = readSource("src/components/study/knowledge-confidence-report.tsx");
    const actions = readSource("src/app/(app)/app/(learner)/account/analytics/actions.ts");

    assert.match(client, /KnowledgeConfidenceReport/);
    assert.match(actions, /loadConfidenceAnalyticsReportAction/);
    assert.match(component, /Knowledge Confidence Report/);
    assert.match(component, /Overconfidence Score/);
    assert.match(component, /Underconfidence Score/);
    assert.match(component, /Confidence Accuracy/);
    assert.match(component, /High-risk knowledge gaps/);
    assert.match(component, /Weekly improvement trend/);
    assert.match(component, /Ready for exam practice/);
  });
});
