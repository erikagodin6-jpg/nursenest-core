import assert from "node:assert/strict";
import test from "node:test";

import {
  TOPIC_OWNERSHIP_BASELINE,
  TOPIC_OWNERSHIP_REQUIREMENTS,
  buildCertificationOwnershipMap,
  buildOwnershipDashboard,
  buildProfessionOwnershipMap,
  buildTopicGapAnalysis,
  compareCompetitorOwnership,
  prioritizeTopicBuilds,
  scoreTopicOwnership,
} from "@/lib/authority/topic-ownership-engine";

test("topic ownership requirements include every required learning and authority asset", () => {
  assert.deepEqual(TOPIC_OWNERSHIP_REQUIREMENTS, [
    "authorityArticle",
    "lessons",
    "flashcards",
    "questions",
    "sata",
    "matrix",
    "bowtie",
    "caseStudies",
    "simulations",
    "clinicalSkills",
    "labs",
    "pharmacology",
    "carePlans",
    "conceptMaps",
    "clinicalReasoning",
    "studyGuides",
    "careerRelevance",
    "placementRelevance",
    "certificationRelevance",
  ]);
});

test("baseline ownership registry covers major clinical, allied, and emergency topics", () => {
  const topics = TOPIC_OWNERSHIP_BASELINE.map((item) => item.topic);
  for (const topic of [
    "Heart Failure",
    "COPD",
    "Diabetes",
    "DKA",
    "Sepsis",
    "Stroke",
    "AFib",
    "AKI",
    "CKD",
    "Pneumonia",
    "Ventilator Management",
    "ABG Interpretation",
    "Trauma Assessment",
  ]) {
    assert.equal(topics.includes(topic), true, `${topic} should be tracked`);
  }
});

test("scoreTopicOwnership tracks overall, profession-specific, certification, and gap signals", () => {
  const heartFailure = TOPIC_OWNERSHIP_BASELINE.find((item) => item.topic === "Heart Failure");
  assert.ok(heartFailure);

  const score = scoreTopicOwnership(heartFailure);
  assert.equal(score.topic, "Heart Failure");
  assert.ok(score.score >= 40);
  assert.ok(score.professionScores.RN > score.professionScores.RT);
  assert.ok(score.certificationScores.NCLEX);
  assert.equal(score.strongestProfession, "RN");
  assert.equal(score.missingAlliedConnections.includes("RT"), true);
  assert.equal(score.internalLinkGap, true);
});

test("gap analysis emits buildable missing work categories", () => {
  const sepsis = TOPIC_OWNERSHIP_BASELINE.find((item) => item.topic === "Sepsis");
  assert.ok(sepsis);
  const gaps = buildTopicGapAnalysis(scoreTopicOwnership(sepsis));

  assert.equal(gaps.includes("Missing Simulations"), true);
  assert.equal(gaps.includes("Missing Skills"), true);
  assert.equal(gaps.includes("Missing Internal Links"), true);
  assert.equal(gaps.includes("Missing Allied Health Connections"), true);
});

test("ownership dashboard exposes current ownership and executive build lists", () => {
  const dashboard = buildOwnershipDashboard();

  assert.ok(dashboard.rows.length >= 13);
  assert.ok(dashboard.averageOwnership > 0);
  assert.equal(dashboard.top10QuarterlyBuilds.length, 10);
  assert.ok(dashboard.top50AnnualBuilds.length >= dashboard.top10QuarterlyBuilds.length);
  assert.equal(dashboard.weakestTopics.includes("Trauma Assessment"), true);
  assert.ok(dashboard.top10QuarterlyBuilds.some((item) => item.topic === "Sepsis"));
});

test("profession-specific ownership map shows RN can lead while allied coverage lags", () => {
  const map = buildProfessionOwnershipMap();

  assert.ok(map.RN[0]);
  assert.ok(map.RT[0]);
  assert.ok((map.RN.find((item) => item.topic === "Heart Failure")?.score ?? 0) > (map.RT.find((item) => item.topic === "Heart Failure")?.score ?? 0));
  assert.ok((map.Paramedic.find((item) => item.topic === "Trauma Assessment")?.score ?? 0) > (map.RN.find((item) => item.topic === "Trauma Assessment")?.score ?? 0));
});

test("certification ownership map includes NCLEX, REx-PN, CNPLE, FNP, PMHNP, TEAS, HESI, and CASPER", () => {
  const map = buildCertificationOwnershipMap();

  for (const certification of ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"] as const) {
    assert.ok(map[certification]);
    assert.equal(map[certification].length, TOPIC_OWNERSHIP_BASELINE.length);
  }
});

test("competitor ownership comparison identifies leadership, gaps, and white-space opportunity", () => {
  const heartFailure = TOPIC_OWNERSHIP_BASELINE.find((item) => item.topic === "Heart Failure");
  const trauma = TOPIC_OWNERSHIP_BASELINE.find((item) => item.topic === "Trauma Assessment");
  assert.ok(heartFailure);
  assert.ok(trauma);

  const heartFailureComparison = compareCompetitorOwnership(heartFailure);
  assert.equal(heartFailureComparison.topic, "Heart Failure");
  assert.ok(["competitor_leads", "close_race", "nursenest_leads"].includes(heartFailureComparison.marketPosition));

  const traumaComparison = compareCompetitorOwnership(trauma);
  assert.equal(traumaComparison.marketPosition, "nobody_owns");
  assert.match(traumaComparison.opportunity, /White-space topic/);
});

test("revenue prioritization ranks by traffic, revenue, conversion, and ownership gap", () => {
  const priorities = prioritizeTopicBuilds();

  assert.ok(priorities[0]);
  assert.ok(priorities[0]!.priorityScore >= priorities[priorities.length - 1]!.priorityScore);
  assert.ok(priorities.slice(0, 5).some((item) => item.topic === "Sepsis"));
  assert.ok(priorities.slice(0, 10).every((item) => item.recommendedWork.length > 0));
});

