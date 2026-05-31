import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBlueprintCoverageDashboard,
  type BlueprintCoverageContentItem,
} from "./blueprint-coverage-gap-engine";

const sampleItems: BlueprintCoverageContentItem[] = [
  {
    id: "rn-q-1",
    exam: "NCLEX-RN",
    contentType: "questions",
    bodySystem: "Cardiovascular",
    topic: "Heart failure deterioration",
    published: true,
    publicationReady: true,
    monetizationReady: true,
    adaptiveReady: true,
  },
  {
    id: "rn-l-1",
    exam: "NCLEX-RN",
    contentType: "lessons",
    bodySystem: "Cardiovascular",
    topic: "Heart failure",
    published: true,
    publicationReady: true,
    monetizationReady: true,
    adaptiveReady: true,
  },
  {
    id: "rn-f-1",
    exam: "NCLEX-RN",
    contentType: "flashcards",
    bodySystem: "Respiratory",
    topic: "COPD oxygenation",
    published: false,
    publicationReady: true,
    monetizationReady: false,
    adaptiveReady: true,
  },
  {
    id: "pn-ngn-1",
    exam: "REx-PN",
    contentType: "ngnCases",
    bodySystem: "Safety",
    topic: "fall prevention",
    published: true,
    publicationReady: true,
    monetizationReady: true,
    adaptiveReady: true,
  },
  {
    id: "np-q-1",
    exam: "FNP",
    contentType: "questions",
    bodySystem: "Assessment",
    topic: "differential diagnosis and follow-up",
    published: true,
    publicationReady: true,
    monetizationReady: true,
    adaptiveReady: true,
  },
];

test("blueprint coverage dashboard audits requested exam pathways and content types", () => {
  const dashboard = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN", "REx-PN", "FNP"]);

  assert.equal(dashboard.exams.length, 3);
  const rn = dashboard.exams.find((report) => report.exam === "NCLEX-RN");
  assert.ok(rn);
  assert.equal(rn.totals.questions, 1);
  assert.equal(rn.totals.lessons, 1);
  assert.equal(rn.totals.flashcards, 1);
  assert.ok(rn.domainRows.some((row) => row.domainId === "cardiovascular" && row.counts.questions === 1));
  assert.ok(rn.domainRows.some((row) => row.domainId === "respiratory" && row.counts.flashcards === 1));
});

test("blueprint coverage dashboard ranks highest ROI backlog from weakest missing domains", () => {
  const dashboard = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN"]);

  assert.ok(dashboard.rankedContentBacklog.length > 0);
  assert.equal(dashboard.rankedContentBacklog[0]?.rank, 1);
  assert.ok((dashboard.rankedContentBacklog[0]?.missingCount ?? 0) > 0);
  assert.match(dashboard.rankedContentBacklog[0]?.rationale ?? "", /build/);
});

test("blueprint coverage dashboard reports readiness, publication, monetization, and adaptive percentages", () => {
  const dashboard = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN"]);
  const rn = dashboard.exams[0]!;

  assert.equal(rn.publicationPercent, 100);
  assert.equal(rn.monetizationPercent, 66.7);
  assert.equal(rn.adaptiveLearningPercent, 100);
  assert.ok(rn.readinessPercent >= 0);
});

test("blueprint coverage dashboard isolates unmapped content for remediation", () => {
  const dashboard = buildBlueprintCoverageDashboard(
    [
      {
        id: "unknown",
        exam: "NCLEX-RN",
        contentType: "questions",
        topic: "unclassifiable topic",
      },
    ],
    ["NCLEX-RN"],
  );

  assert.equal(dashboard.unmappedItems.length, 1);
  assert.equal(dashboard.unmappedItems[0]?.id, "unknown");
});
