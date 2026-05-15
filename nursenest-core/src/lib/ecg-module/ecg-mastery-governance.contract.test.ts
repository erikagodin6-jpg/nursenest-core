/**
 * ECG Mastery & Governance — CI contract tests.
 *
 * These tests MUST pass before any ECG content reaches production.
 * They are deliberately strict — a single failing assertion blocks the pipeline.
 *
 * Run: node --import tsx --test src/lib/ecg-module/ecg-mastery-governance.contract.test.ts
 *
 * Governance contracts enforced here:
 *   1. Differential graph: all nodes in rhythm registry, all edges valid
 *   2. Competency domains: all topicIds exist in ECG_FULL_CURRICULUM
 *   3. Mastery engine: state transitions are deterministic and correct
 *   4. Interpretation scoring: weighted sum equals 1.0 (scoring model integrity)
 *   5. Waveform governance: ECG_MODE_ARTIFACT_LEVELS covers all educational modes
 *   6. Registry: all differential graph nodes are in ECG_RHYTHM_TAG_REGISTRY
 *   7. CI content gate: no advanced topics are unreviewed (build blocker)
 *   8. CI content gate: no topics have stale governance (build blocker with 18-month window)
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  validateEcgDifferentialGraphNodes,
  validateEcgDifferentialGraphEdges,
  ECG_DIFFERENTIAL_NODES,
  ECG_DIFFERENTIAL_EDGES,
  ECG_ACLS_CRITICAL_NODES,
  ECG_CONTRAINDICATED_PAIRS,
  getEcgDifferentialNode,
  getEcgConfusionEdgesFrom,
  getEcgRhythmsInCluster,
} from "./ecg-differential-graph";

import {
  validateEcgCompetencyDomainTopics,
  ECG_COMPETENCY_DOMAINS,
  computeEcgOverallReadinessScore,
  isEcgAclsReady,
  isEcgNclexReady,
  getWeakEcgDomains,
  type EcgCompetencyDomainId,
} from "./ecg-competency-domains";

import {
  applyEcgAnswerEvent,
  computeEcgMasteryDecay,
  createInitialEcgMasteryRecord,
  scheduleEcgAdaptiveSession,
  computeEcgLearnerProfile,
  computeEcgClinicalReadinessReport,
} from "./ecg-mastery-engine";

import {
  scoreEcgQuestionAttempt,
  summarizeEcgSessionCompetency,
} from "./ecg-interpretation-scoring";

import { scoreEcgRateMeasurement } from "@/components/ecg-module/ecg-rate-entry";

import {
  getStaleEcgTopics,
  getUnreviewedAdvancedEcgTopics,
  ECG_FULL_CURRICULUM,
  ECG_ADVANCED_CURRICULUM,
} from "./ecg-curriculum-config";

import { ECG_MODE_ARTIFACT_LEVELS } from "./ecg-waveform-generator";

// ─── Differential Graph ────────────────────────────────────────────────────────

describe("ECG differential graph — structural integrity", () => {
  it("all differential graph nodes exist in ECG_RHYTHM_TAG_REGISTRY", () => {
    const missing = validateEcgDifferentialGraphNodes();
    assert.deepEqual(missing, [], `Nodes with unregistered rhythmTags: ${missing.join(", ")}`);
  });

  it("all differential graph edges reference valid node rhythm tags", () => {
    const invalid = validateEcgDifferentialGraphEdges();
    assert.deepEqual(invalid, [], `Invalid edge references: ${invalid.join("; ")}`);
  });

  it("no duplicate node rhythm tags", () => {
    const tags = ECG_DIFFERENTIAL_NODES.map((n) => n.rhythmTag);
    const unique = new Set(tags);
    assert.equal(unique.size, tags.length, "Duplicate rhythmTag found in differential graph nodes");
  });

  it("no duplicate edge pairs (correctRhythm|wrongRhythm)", () => {
    const pairs = ECG_DIFFERENTIAL_EDGES.map((e) => `${e.correctRhythm}|${e.wrongRhythm}`);
    const unique = new Set(pairs);
    const duplicates = pairs.filter((p, i) => pairs.indexOf(p) !== i);
    assert.deepEqual(duplicates, [], `Duplicate edge pairs: ${duplicates.join(", ")}`);
  });

  it("all edges have confusion likelihood in [0, 1]", () => {
    for (const edge of ECG_DIFFERENTIAL_EDGES) {
      assert.ok(
        edge.confusionLikelihood >= 0 && edge.confusionLikelihood <= 1,
        `Edge ${edge.correctRhythm}→${edge.wrongRhythm}: confusionLikelihood ${edge.confusionLikelihood} out of range`,
      );
    }
  });

  it("all edges have clinical danger in [0, 1]", () => {
    for (const edge of ECG_DIFFERENTIAL_EDGES) {
      assert.ok(
        edge.clinicalDanger >= 0 && edge.clinicalDanger <= 1,
        `Edge ${edge.correctRhythm}→${edge.wrongRhythm}: clinicalDanger ${edge.clinicalDanger} out of range`,
      );
    }
  });

  it("all contraindicated pairs have clinicalDanger >= 0.8", () => {
    for (const edge of ECG_CONTRAINDICATED_PAIRS) {
      assert.ok(
        edge.clinicalDanger >= 0.8,
        `Contraindicated edge ${edge.correctRhythm}→${edge.wrongRhythm}: clinicalDanger ${edge.clinicalDanger} should be ≥ 0.8`,
      );
    }
  });

  it("at least 5 ACLS-critical nodes exist", () => {
    assert.ok(
      ECG_ACLS_CRITICAL_NODES.length >= 5,
      `Only ${ECG_ACLS_CRITICAL_NODES.length} ACLS-critical nodes — expected at least 5`,
    );
  });

  it("VT node is ACLS-critical and has outgoing confusion edges", () => {
    const vt = getEcgDifferentialNode("Ventricular tachycardia");
    assert.ok(vt, "VT node must exist");
    assert.ok(vt!.aclsCritical, "VT must be ACLS-critical");
    const edges = getEcgConfusionEdgesFrom("Ventricular tachycardia");
    assert.ok(edges.length > 0, "VT must have at least one registered confusion edge");
  });

  it("VT→SVT edge has clinicalDanger = 1.0 and contraindicated = true", () => {
    const edges = getEcgConfusionEdgesFrom("Ventricular tachycardia");
    const vtSvt = edges.find((e) => e.wrongRhythm === "SVT");
    assert.ok(vtSvt, "VT→SVT confusion edge must be registered");
    assert.equal(vtSvt!.clinicalDanger, 1.0, "VT→SVT must have clinicalDanger=1.0");
    assert.equal(vtSvt!.contraindicated, true, "VT→SVT must be contraindicated");
  });

  it("tachyarrhythmias cluster contains AFib, AFL, SVT, and VT", () => {
    const cluster = getEcgRhythmsInCluster("tachyarrhythmias");
    const tags = cluster.map((n) => n.rhythmTag);
    for (const expected of ["Atrial fibrillation", "Atrial flutter", "SVT", "Ventricular tachycardia"]) {
      assert.ok(tags.includes(expected), `tachyarrhythmias cluster missing: ${expected}`);
    }
  });
});

// ─── Competency Domains ────────────────────────────────────────────────────────

describe("ECG competency domains — structural integrity", () => {
  it("all domain topicIds exist in ECG_FULL_CURRICULUM", () => {
    const missing = validateEcgCompetencyDomainTopics();
    assert.deepEqual(missing, [], `Missing topic references: ${missing.join("; ")}`);
  });

  it("all 8 competency domains are defined", () => {
    assert.equal(ECG_COMPETENCY_DOMAINS.length, 8, "Must have exactly 8 competency domains");
  });

  it("proficiencyThreshold < masteryThreshold for every domain", () => {
    for (const d of ECG_COMPETENCY_DOMAINS) {
      assert.ok(
        d.proficiencyThreshold < d.masteryThreshold,
        `Domain "${d.id}": proficiencyThreshold (${d.proficiencyThreshold}) must be < masteryThreshold (${d.masteryThreshold})`,
      );
    }
  });

  it("ACLS-readiness domains include ischemia_stemi and acls_critical_rhythms", () => {
    const aclsDomains = ECG_COMPETENCY_DOMAINS.filter((d) => d.requiredForAcls).map((d) => d.id);
    assert.ok(aclsDomains.includes("ischemia_stemi"), "ACLS domains must include ischemia_stemi");
    assert.ok(
      aclsDomains.includes("acls_critical_rhythms"),
      "ACLS domains must include acls_critical_rhythms",
    );
  });

  it("overall readiness score is 0 when all domain scores are 0", () => {
    const score = computeEcgOverallReadinessScore({});
    assert.equal(score, 0);
  });

  it("overall readiness score is 1 when all domains at 1.0", () => {
    const allPerfect: Partial<Record<EcgCompetencyDomainId, number>> = {};
    for (const d of ECG_COMPETENCY_DOMAINS) {
      allPerfect[d.id] = 1.0;
    }
    const score = computeEcgOverallReadinessScore(allPerfect);
    assert.ok(Math.abs(score - 1.0) < 0.001, `Expected score ≈ 1.0, got ${score}`);
  });

  it("isEcgAclsReady returns false when all domains are at 0", () => {
    assert.equal(isEcgAclsReady({}), false);
  });

  it("isEcgNclexReady returns false when all domains are at 0", () => {
    assert.equal(isEcgNclexReady({}), false);
  });

  it("getWeakEcgDomains returns all domains when scores are below threshold", () => {
    const allWeak: Partial<Record<EcgCompetencyDomainId, number>> = {};
    for (const d of ECG_COMPETENCY_DOMAINS) allWeak[d.id] = 0.1;
    const weak = getWeakEcgDomains(allWeak, 0.70);
    assert.equal(weak.length, ECG_COMPETENCY_DOMAINS.length);
  });
});

// ─── Mastery Engine ────────────────────────────────────────────────────────────

describe("ECG mastery engine — state transitions", () => {
  it("initial record starts as not_started", () => {
    const r = createInitialEcgMasteryRecord("rate");
    assert.equal(r.state, "not_started");
    assert.equal(r.attemptCount, 0);
  });

  it("first correct answer transitions not_started → learning", () => {
    let r = createInitialEcgMasteryRecord("rate");
    r = applyEcgAnswerEvent(r, {
      isCorrect: true,
      scaffoldCompleted: true,
      scaffoldSkipped: false,
      measuredRateBpm: null,
      correctRateBpm: null,
      attemptedAt: new Date().toISOString(),
    });
    assert.equal(r.state, "learning");
    assert.equal(r.attemptCount, 1);
  });

  it("3 consecutive incorrect answers transitions to struggling regardless of state", () => {
    let r = createInitialEcgMasteryRecord("rate");
    const wrongEvent = {
      isCorrect: false,
      scaffoldCompleted: false,
      scaffoldSkipped: true,
      measuredRateBpm: null,
      correctRateBpm: null,
      attemptedAt: new Date().toISOString(),
    };
    r = applyEcgAnswerEvent(r, { ...wrongEvent, isCorrect: true }); // learning
    r = applyEcgAnswerEvent(r, wrongEvent);
    r = applyEcgAnswerEvent(r, wrongEvent);
    r = applyEcgAnswerEvent(r, wrongEvent);
    assert.equal(r.state, "struggling", "3 consecutive wrong should force struggling");
  });

  it("high accuracy over 5+ attempts transitions learning → proficient", () => {
    let r = createInitialEcgMasteryRecord("rate");
    const correctEvent = {
      isCorrect: true,
      scaffoldCompleted: true,
      scaffoldSkipped: false,
      measuredRateBpm: null,
      correctRateBpm: null,
      attemptedAt: new Date().toISOString(),
    };
    for (let i = 0; i < 6; i++) {
      r = applyEcgAnswerEvent(r, correctEvent);
    }
    assert.equal(r.state, "proficient", "6 consecutive correct should reach proficient");
  });

  it("mastery decays to needs_review after stalePeriodDays", () => {
    let r = createInitialEcgMasteryRecord("stemi-localization");
    // Force mastered state directly
    r = {
      ...r,
      state: "mastered",
      lastCorrectAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    };
    const decayed = computeEcgMasteryDecay(r);
    assert.equal(decayed.state, "needs_review", "Mastered state should decay after 21 days");
  });

  it("proficient does not decay within 14 days", () => {
    let r = createInitialEcgMasteryRecord("rate");
    r = {
      ...r,
      state: "proficient",
      lastCorrectAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    };
    const result = computeEcgMasteryDecay(r);
    assert.equal(result.state, "proficient", "Proficient within 14 days should not decay");
  });

  it("struggling topics are scheduled first in adaptive session", () => {
    const struggling = { ...createInitialEcgMasteryRecord("ventricular-tachycardia"), state: "struggling" as const };
    const learning = { ...createInitialEcgMasteryRecord("rate"), state: "learning" as const };
    const queue = scheduleEcgAdaptiveSession([learning, struggling], {});
    assert.equal(queue[0]!.topicId, "ventricular-tachycardia", "Struggling topic must be first");
  });

  it("full profile computation produces valid overall readiness score", () => {
    const records = [
      { ...createInitialEcgMasteryRecord("rate"), accuracyRate: 0.8, state: "proficient" as const },
      { ...createInitialEcgMasteryRecord("rhythm"), accuracyRate: 0.75, state: "proficient" as const },
    ];
    const profile = computeEcgLearnerProfile("test-user-001", records);
    assert.ok(profile.overallReadinessScore >= 0 && profile.overallReadinessScore <= 1);
    assert.equal(profile.userId, "test-user-001");
  });

  it("clinical readiness report contains all required fields", () => {
    const profile = computeEcgLearnerProfile("test-user-002", []);
    const report = computeEcgClinicalReadinessReport(profile);
    assert.ok(typeof report.overallScore === "number");
    assert.ok(typeof report.aclsReadiness.ready === "boolean");
    assert.ok(typeof report.nclexReadiness.ready === "boolean");
    assert.ok(typeof report.telemetryConfidence === "number");
    assert.ok(typeof report.interpretationConsistency === "number");
    assert.ok(typeof report.differentialAccuracy === "number");
  });
});

// ─── Interpretation Scoring ────────────────────────────────────────────────────

describe("ECG interpretation scoring — model integrity", () => {
  it("step weights sum to 1.0", async () => {
    // Import the weights indirectly through the scoring function
    // A perfect scaffold produces interpretation score = 1.0
    const reference = {
      rate: "60–100 bpm (normal)",
      regularity: "Regular",
      pWaves: "Upright in II, one before each QRS",
      prInterval: "Normal (0.12–0.20 s)",
      qrsWidth: "Narrow (< 0.12 s)",
      stChanges: "No ST changes",
    };
    const score = scoreEcgQuestionAttempt(true, reference, reference, true);
    assert.ok(
      score.interpretationScore !== null,
      "Perfect scaffold should produce a non-null score",
    );
    assert.ok(
      Math.abs(score.interpretationScore! - 1.0) < 0.001,
      `Perfect scaffold should produce score ≈ 1.0, got ${score.interpretationScore}`,
    );
  });

  it("skipped scaffold produces null interpretationScore", () => {
    const score = scoreEcgQuestionAttempt(true, null, null, false);
    assert.equal(score.interpretationScore, null);
    assert.equal(score.unverifiedCorrect, true);
    assert.equal(score.scaffoldedCorrect, false);
  });

  it("correct MCQ + complete scaffold = confirmedCompetent", () => {
    const ref = {
      rate: "60–100 bpm (normal)",
      regularity: "Regular",
      pWaves: "Upright in II, one before each QRS",
      prInterval: "Normal (0.12–0.20 s)",
      qrsWidth: "Narrow (< 0.12 s)",
      stChanges: "No ST changes",
    };
    const score = scoreEcgQuestionAttempt(true, ref, ref, true);
    assert.equal(score.confirmedCompetent, true);
    assert.equal(score.scaffoldedCorrect, true);
  });

  it("wrong MCQ + perfect scaffold = not confirmedCompetent", () => {
    const ref = {
      rate: "60–100 bpm (normal)",
      regularity: "Regular",
      pWaves: "Upright in II, one before each QRS",
      prInterval: "Normal (0.12–0.20 s)",
      qrsWidth: "Narrow (< 0.12 s)",
      stChanges: "No ST changes",
    };
    const score = scoreEcgQuestionAttempt(false, ref, ref, true);
    assert.equal(score.confirmedCompetent, false);
    assert.equal(score.mcqAccuracy, 0);
  });

  it("session summary detects competency gap (high MCQ, low scaffold)", () => {
    const attempts = Array.from({ length: 5 }, () =>
      scoreEcgQuestionAttempt(
        true,
        // Wrong scaffold answers
        {
          rate: "> 100 bpm (tachycardia)",
          regularity: "Irregularly irregular",
          pWaves: "Flutter waves (saw-tooth, 250–350/min)",
          prInterval: "Variable / not measurable",
          qrsWidth: "Wide (≥ 0.12 s) — bundle branch pattern",
          stChanges: "ST elevation",
        },
        {
          rate: "60–100 bpm (normal)",
          regularity: "Regular",
          pWaves: "Upright in II, one before each QRS",
          prInterval: "Normal (0.12–0.20 s)",
          qrsWidth: "Narrow (< 0.12 s)",
          stChanges: "No ST changes",
        },
        true,
      ),
    );
    const summary = summarizeEcgSessionCompetency(attempts);
    assert.equal(summary.mcqAccuracy, 1.0, "MCQ accuracy should be 1.0");
    assert.ok(
      summary.averageInterpretationScore !== null &&
        summary.averageInterpretationScore < 0.55,
      "Interpretation score should be low with wrong scaffold answers",
    );
    assert.equal(summary.hasCompetencyGap, true, "Should detect competency gap");
  });
});

// ─── Rate Measurement Scoring ──────────────────────────────────────────────────

describe("ECG rate measurement — tolerance scoring", () => {
  it("exact match returns 1.0", () => {
    assert.equal(scoreEcgRateMeasurement(75, 75), 1.0);
  });

  it("within tight tolerance returns 0.9", () => {
    const score = scoreEcgRateMeasurement(78, 75);
    assert.ok(score >= 0.9, `Expected ≥ 0.9, got ${score}`);
  });

  it("within full tolerance returns ≥ 0.7", () => {
    const score = scoreEcgRateMeasurement(83, 75); // 8 bpm off, within ±10
    assert.ok(score >= 0.7, `Expected ≥ 0.7, got ${score}`);
  });

  it("double tolerance returns 0 < score < 0.7", () => {
    const score = scoreEcgRateMeasurement(100, 75); // 25 bpm off
    assert.ok(score >= 0 && score < 0.7, `Expected [0, 0.7), got ${score}`);
  });

  it("grossly wrong returns 0", () => {
    assert.equal(scoreEcgRateMeasurement(200, 75), 0);
  });

  it("rapid rate uses wider tolerance (±15 bpm)", () => {
    // 175 bpm correct, 185 measured — 10 bpm off at rapid rate.
    // 10 bpm is within ±15 tolerance but > half-tolerance (7.5 bpm),
    // so it scores 0.7 ("acceptable") rather than 0.9 ("excellent").
    // A measurement of 177 bpm (2 bpm off) would score 0.9.
    const score = scoreEcgRateMeasurement(185, 175);
    assert.ok(score >= 0.7, `Rapid rate: expected ≥ 0.7 within ±15 tolerance, got ${score}`);
    // Confirm it does NOT score 0 (which would mean out-of-tolerance entirely)
    assert.ok(score > 0, "10 bpm off at rapid rate must not score 0");
  });
});

// ─── Waveform Mode Governance ──────────────────────────────────────────────────

describe("ECG waveform mode governance", () => {
  it("ECG_MODE_ARTIFACT_LEVELS covers all defined educational modes", () => {
    const requiredModes = [
      "clean_teaching",
      "realistic_monitor",
      "artifact_training",
      "telemetry_review",
      "emergency_scenario",
    ] as const;
    for (const mode of requiredModes) {
      assert.ok(
        ECG_MODE_ARTIFACT_LEVELS[mode] !== undefined,
        `ECG_MODE_ARTIFACT_LEVELS missing mode: ${mode}`,
      );
      assert.ok(
        ECG_MODE_ARTIFACT_LEVELS[mode] >= 0 && ECG_MODE_ARTIFACT_LEVELS[mode] <= 1,
        `Artifact level for "${mode}" must be in [0, 1]`,
      );
    }
  });

  it("clean_teaching has lower artifact than realistic_monitor", () => {
    assert.ok(
      ECG_MODE_ARTIFACT_LEVELS.clean_teaching < ECG_MODE_ARTIFACT_LEVELS.realistic_monitor,
      "clean_teaching must have less artifact than realistic_monitor",
    );
  });

  it("artifact_training has the highest artifact level", () => {
    const maxLevel = Math.max(...Object.values(ECG_MODE_ARTIFACT_LEVELS));
    assert.equal(
      ECG_MODE_ARTIFACT_LEVELS.artifact_training,
      maxLevel,
      "artifact_training must have the highest artifact level",
    );
  });
});

// ─── CI Content Gate ──────────────────────────────────────────────────────────
// These tests BLOCK the build when clinical content governance is violated.
// They use a 18-month window to avoid false positives in test environments.

describe("CI content gate — stale/unreviewed content BLOCKS BUILD", () => {
  it("no advanced topics are clinically unreviewed", () => {
    const unreviewed = getUnreviewedAdvancedEcgTopics();
    assert.deepEqual(
      unreviewed,
      [],
      `BLOCKED: ${unreviewed.length} advanced topics are unreviewed:\n${unreviewed.map((t) => `  - ${t.id}`).join("\n")}\n` +
        "Advanced ECG topics MUST have a clinical reviewer before reaching production.\n" +
        "Set topic.clinicalReviewStatus = 'reviewed' and topic.reviewedAt = ISO date.",
    );
  });

  it("no topics are stale within an 18-month window (CI safety margin)", () => {
    // Using 18 months (548 days) as the reference window —
    // content reviewed more than 18 months ago requires re-review.
    // AHA guideline cycles are typically 2–4 years; 18 months gives a comfortable buffer.
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 18);
    const stale = getStaleEcgTopics(cutoff);

    assert.deepEqual(
      stale,
      [],
      `BLOCKED: ${stale.length} topics have stale clinical reviews (>18 months):\n` +
        stale.map((t) => `  - ${t.id} (reviewed: ${t.reviewedAt ?? "never"})`).join("\n") +
        "\nUpdate topic.reviewedAt and topic.clinicalReviewStatus = 'reviewed'.",
    );
  });

  it("all advanced ACLS-critical topics have explicit remediationPriority = 'critical'", () => {
    const ACLS_REQUIRED_TOPIC_IDS = new Set([
      "stemi-localization",
      "torsades",
      "wpw",
      "av-blocks-advanced",
      "paced-rhythms",
      "icu-telemetry",
    ]);
    for (const topic of ECG_ADVANCED_CURRICULUM) {
      if (!ACLS_REQUIRED_TOPIC_IDS.has(topic.id)) continue;
      assert.equal(
        topic.remediationPriority,
        "critical",
        `BLOCKED: Advanced ACLS-critical topic "${topic.id}" must have remediationPriority="critical", got "${topic.remediationPriority}"`,
      );
    }
  });

  it("ECG_FULL_CURRICULUM has at least 16 topics (minimum viable curriculum)", () => {
    assert.ok(
      ECG_FULL_CURRICULUM.length >= 16,
      `BLOCKED: ECG_FULL_CURRICULUM has only ${ECG_FULL_CURRICULUM.length} topics — minimum 16 required`,
    );
  });
});
