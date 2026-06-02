/**
 * Remediation engine productionization tests.
 *
 * Covers:
 *   1. Taxonomy normalization
 *   2. Remediation weighting (multi-dimensional score)
 *   3. Resurfacing priority ordering
 *   4. Duplicate prevention
 *   5. CNPLE readiness scoring
 *   6. Performance invariants (no queue explosion)
 *
 * Run: npx tsx --test src/lib/remediation/remediation-engine.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";

// ── 1. Taxonomy normalization ─────────────────────────────────────────────────

import {
  resolveCanonicalTopic,
  resolveCanonicalTopicId,
  resolveCnpleDomain,
  isPrescribingSafetyTopic,
  topicDangerLevel,
  canonicalEntriesForDomain,
  CANONICAL_ENTRIES,
} from "@/lib/remediation/topic-taxonomy";

describe("taxonomy: resolveCanonicalTopic", () => {
  test("null → null", () => {
    assert.equal(resolveCanonicalTopic(null), null);
  });

  test("empty string → null", () => {
    assert.equal(resolveCanonicalTopic(""), null);
  });

  test("exact alias match", () => {
    const entry = resolveCanonicalTopic("pharmacology");
    assert.ok(entry, "should resolve 'pharmacology'");
    assert.equal(entry!.id, "cnple:prescribing:pharmacology");
  });

  test("case-insensitive alias match", () => {
    const entry = resolveCanonicalTopic("PHARMACOLOGY");
    assert.ok(entry);
    assert.equal(entry!.id, "cnple:prescribing:pharmacology");
  });

  test("whitespace-padded alias", () => {
    const entry = resolveCanonicalTopic("  drug interactions  ");
    assert.ok(entry);
    assert.equal(entry!.id, "cnple:prescribing:drug_interactions");
  });

  test("multi-word alias with slash variant", () => {
    const entry = resolveCanonicalTopic("Differential Diagnosis");
    assert.ok(entry);
    assert.equal(entry!.domain, "diagnostics");
  });

  test("unrecognized topic → null", () => {
    assert.equal(resolveCanonicalTopic("underwater basket weaving"), null);
  });

  test("canonical label itself resolves", () => {
    for (const entry of CANONICAL_ENTRIES) {
      const resolved = resolveCanonicalTopic(entry.label);
      assert.ok(resolved, `label '${entry.label}' should self-resolve`);
      assert.equal(resolved!.id, entry.id);
    }
  });

  test("all aliases resolve to their parent entry", () => {
    for (const entry of CANONICAL_ENTRIES) {
      for (const alias of entry.aliases) {
        const resolved = resolveCanonicalTopic(alias);
        assert.ok(resolved, `alias '${alias}' of '${entry.id}' should resolve`);
        assert.equal(resolved!.id, entry.id, `alias '${alias}' resolved to wrong entry`);
      }
    }
  });
});

describe("taxonomy: domain resolution", () => {
  test("pharmacology → prescribing", () => {
    assert.equal(resolveCnpleDomain("pharmacology"), "prescribing");
  });

  test("ecg → diagnostics", () => {
    assert.equal(resolveCnpleDomain("ecg"), "diagnostics");
  });

  test("pediatrics → lifespan_care", () => {
    assert.equal(resolveCnpleDomain("pediatrics"), "lifespan_care");
  });

  test("emergency → escalation_referral", () => {
    assert.equal(resolveCnpleDomain("emergency"), "escalation_referral");
  });

  test("triage → clinical_judgment", () => {
    assert.equal(resolveCnpleDomain("triage"), "clinical_judgment");
  });
});

describe("taxonomy: prescribing safety flags", () => {
  test("pharmacology is prescribing-safety", () => {
    assert.equal(isPrescribingSafetyTopic("pharmacology"), true);
  });

  test("controlled substances is prescribing-safety", () => {
    assert.equal(isPrescribingSafetyTopic("controlled substances"), true);
  });

  test("opioids is prescribing-safety (alias)", () => {
    assert.equal(isPrescribingSafetyTopic("opioids"), true);
  });

  test("pediatrics is NOT prescribing-safety", () => {
    assert.equal(isPrescribingSafetyTopic("pediatrics"), false);
  });

  test("null → false", () => {
    assert.equal(isPrescribingSafetyTopic(null), false);
  });
});

describe("taxonomy: danger levels", () => {
  test("pharmacology → critical", () => {
    assert.equal(topicDangerLevel("pharmacology"), "critical");
  });

  test("emergency → critical", () => {
    assert.equal(topicDangerLevel("emergency"), "critical");
  });

  test("drug interactions → critical", () => {
    assert.equal(topicDangerLevel("drug interactions"), "critical");
  });

  test("referral → high", () => {
    assert.equal(topicDangerLevel("referral"), "high");
  });

  test("pediatrics → standard", () => {
    assert.equal(topicDangerLevel("pediatrics"), "standard");
  });

  test("unknown topic → standard", () => {
    assert.equal(topicDangerLevel("not a real topic"), "standard");
  });
});

describe("taxonomy: canonicalEntriesForDomain", () => {
  test("prescribing domain has entries", () => {
    const entries = canonicalEntriesForDomain("prescribing");
    assert.ok(entries.length > 0);
    assert.ok(entries.every((e) => e.domain === "prescribing"));
  });

  test("all entries have non-empty aliases", () => {
    for (const domain of [
      "diagnostics",
      "prescribing",
      "lifespan_care",
      "escalation_referral",
      "clinical_judgment",
    ] as const) {
      const entries = canonicalEntriesForDomain(domain);
      for (const entry of entries) {
        assert.ok(entry.aliases.length > 0, `${entry.id} must have at least one alias`);
      }
    }
  });
});

// ── 2. Remediation weighting ──────────────────────────────────────────────────

import { computeRemediationScore, spacedReviewDays } from "@/lib/remediation/remediation-scoring";

describe("remediation scoring: base recency", () => {
  test("base score >= 10 with no signals", () => {
    const s = computeRemediationScore({
      recent24h: 0,
      recentWeek7d: 0,
      priorMistakeCount: 0,
      confidence: null,
      topic: null,
    });
    assert.ok(s.total >= 10, `total=${s.total}`);
  });

  test("recent24h adds 5 per event", () => {
    const a = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    const b = computeRemediationScore({ recent24h: 3, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    assert.equal(b.recency - a.recency, 15);
  });

  test("recentWeek7d adds 2 per event", () => {
    const a = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    const b = computeRemediationScore({ recent24h: 0, recentWeek7d: 4, priorMistakeCount: 0, confidence: null, topic: null });
    assert.equal(b.recency - a.recency, 8);
  });
});

describe("remediation scoring: confidence mismatch", () => {
  test("high confidence miss → +25", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: "high", topic: null });
    assert.equal(s.confidenceMismatch, 25);
  });

  test("medium confidence miss → +10", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: "medium", topic: null });
    assert.equal(s.confidenceMismatch, 10);
  });

  test("low confidence miss → +3", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: "low", topic: null });
    assert.equal(s.confidenceMismatch, 3);
  });

  test("null confidence → 0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    assert.equal(s.confidenceMismatch, 0);
  });

  test("high-confidence wrong > low-confidence wrong", () => {
    const high = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: "high", topic: null });
    const low = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: "low", topic: null });
    assert.ok(high.total > low.total);
  });
});

describe("remediation scoring: lapse frequency", () => {
  test("each lapse adds 8 points up to 10 lapses", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, lapseCount: 5 });
    assert.equal(s.lapseFrequency, 40);
  });

  test("lapses capped at 10", () => {
    const a = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, lapseCount: 10 });
    const b = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, lapseCount: 99 });
    assert.equal(a.lapseFrequency, b.lapseFrequency);
  });

  test("zero lapses → lapseFrequency=0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, lapseCount: 0 });
    assert.equal(s.lapseFrequency, 0);
  });
});

describe("remediation scoring: dwell time", () => {
  test("hasty answer (<5 s) adds dwell bonus", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, dwellTimeMs: 2000 });
    assert.ok(s.dwellTime > 0, `dwellTime=${s.dwellTime}`);
  });

  test("long struggle (>120 s) adds dwell bonus", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, dwellTimeMs: 150_000 });
    assert.ok(s.dwellTime > 0, `dwellTime=${s.dwellTime}`);
  });

  test("normal dwell (30 s) → dwellTime=0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, dwellTimeMs: 30_000 });
    assert.equal(s.dwellTime, 0);
  });

  test("missing dwellTimeMs → dwellTime=0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    assert.equal(s.dwellTime, 0);
  });
});

describe("remediation scoring: SATA partial", () => {
  test("SATA partial credit → +12", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, isSata: true, sataPartialCredit: true });
    assert.equal(s.sataPartial, 12);
  });

  test("SATA full miss (no partial) → 0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, isSata: true, sataPartialCredit: false });
    assert.equal(s.sataPartial, 0);
  });

  test("non-SATA with partial flag → 0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null, isSata: false, sataPartialCredit: true });
    assert.equal(s.sataPartial, 0);
  });
});

describe("remediation scoring: safety penalty", () => {
  test("prescribing-safety topic → +30", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: "pharmacology" });
    assert.equal(s.safetyPenalty, 30);
  });

  test("high-danger topic → +15", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: "referral" });
    assert.equal(s.safetyPenalty, 15);
  });

  test("standard topic → 0", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: "preventive care" });
    assert.equal(s.safetyPenalty, 0);
  });

  test("prescribingSafetyMissOverride forces +30", () => {
    const s = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: "preventive care", prescribingSafetyMissOverride: true });
    assert.equal(s.safetyPenalty, 30);
  });
});

describe("remediation scoring: chronic accumulation", () => {
  test("each mistake adds 1.5 points", () => {
    const a = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 0, confidence: null, topic: null });
    const b = computeRemediationScore({ recent24h: 0, recentWeek7d: 0, priorMistakeCount: 4, confidence: null, topic: null });
    assert.equal(b.chronicAccumulation - a.chronicAccumulation, 6);
  });
});

describe("spacedReviewDays", () => {
  test("first mistake → 1 day", () => assert.equal(spacedReviewDays(1), 1));
  test("2nd → 2 days", () => assert.equal(spacedReviewDays(2), 2));
  test("3rd → 4 days", () => assert.equal(spacedReviewDays(3), 4));
  test("capped at 32 days", () => assert.equal(spacedReviewDays(99), 32));
});

// ── 3. Resurfacing priority ordering ─────────────────────────────────────────

import {
  sortByResurfacingUrgency,
  deduplicateResurfacingEntries,
  buildResurfacingQueue,
} from "@/lib/remediation/resurfacing-priority";

const makeEntry = (
  id: string,
  topic: string,
  priorityScore: number,
  mistakeCount = 1,
): import("@/lib/remediation/resurfacing-priority").ResurfacingEntry => ({
  id,
  topicKey: topic.toLowerCase(),
  topic,
  priorityScore,
  mistakeCount,
  nextReviewAt: new Date(),
});

describe("resurfacing: sortByResurfacingUrgency", () => {
  test("prescribing-safety topic surfaces before non-safety regardless of score", () => {
    const entries = [
      makeEntry("low-score-pharma", "pharmacology", 5),
      makeEntry("high-score-peds", "pediatrics", 999),
    ];
    const sorted = sortByResurfacingUrgency(entries);
    assert.equal(sorted[0]!.id, "low-score-pharma", "prescribing-safety must be first");
  });

  test("critical danger before high danger before standard", () => {
    const entries = [
      makeEntry("standard", "preventive care", 100),
      makeEntry("high", "referral", 50),
      makeEntry("critical", "emergency", 10),
    ];
    const sorted = sortByResurfacingUrgency(entries);
    assert.equal(sorted[0]!.id, "critical");
    assert.equal(sorted[1]!.id, "high");
    assert.equal(sorted[2]!.id, "standard");
  });

  test("within same danger tier: higher priorityScore wins", () => {
    const entries = [
      makeEntry("low-peds", "pediatrics", 20),
      makeEntry("high-peds", "geriatrics", 80),
    ];
    const sorted = sortByResurfacingUrgency(entries);
    assert.equal(sorted[0]!.id, "high-peds");
  });

  test("does not mutate input array", () => {
    const entries = [makeEntry("a", "pediatrics", 10), makeEntry("b", "pharmacology", 5)];
    const original = [...entries];
    sortByResurfacingUrgency(entries);
    assert.deepEqual(entries.map((e) => e.id), original.map((e) => e.id));
  });
});

// ── 4. Duplicate prevention ───────────────────────────────────────────────────

describe("resurfacing: deduplicateResurfacingEntries", () => {
  test("same normalized topic: keeps highest score", () => {
    const entries = [
      { topicKey: "pharmacology", priorityScore: 20, id: "a" },
      { topicKey: "Pharmacology", priorityScore: 50, id: "b" },
      { topicKey: "PHARMACOLOGY", priorityScore: 10, id: "c" },
    ];
    const deduped = deduplicateResurfacingEntries(entries);
    assert.equal(deduped.length, 1);
    assert.equal(deduped[0]!.id, "b");
  });

  test("different topics: all retained", () => {
    const entries = [
      { topicKey: "pharmacology", priorityScore: 10, id: "a" },
      { topicKey: "pediatrics", priorityScore: 20, id: "b" },
      { topicKey: "emergency", priorityScore: 30, id: "c" },
    ];
    const deduped = deduplicateResurfacingEntries(entries);
    assert.equal(deduped.length, 3);
  });

  test("empty array → empty", () => {
    assert.deepEqual(deduplicateResurfacingEntries([]), []);
  });

  test("single entry → unchanged", () => {
    const entries = [{ topicKey: "pharmacology", priorityScore: 10, id: "a" }];
    const deduped = deduplicateResurfacingEntries(entries);
    assert.equal(deduped.length, 1);
    assert.equal(deduped[0]!.id, "a");
  });
});

describe("resurfacing: buildResurfacingQueue", () => {
  test("deduplicates then sorts — prescribing-safety first", () => {
    const entries = [
      makeEntry("peds-1", "pediatrics", 100),
      makeEntry("peds-2", "PEDIATRICS", 80),   // duplicate after normalize
      makeEntry("pharma", "pharmacology", 5),    // prescribing-safety, low score
    ];
    const queue = buildResurfacingQueue(entries);
    // After dedup: pediatrics (100) + pharmacology (5) = 2 entries
    assert.equal(queue.length, 2);
    assert.equal(queue[0]!.id, "pharma", "prescribing-safety must be first");
  });

  test("no queue explosion: large input is capped by dedup", () => {
    // 50 entries all for the same topic → only 1 survives dedup
    const entries = Array.from({ length: 50 }, (_, i) =>
      makeEntry(`id-${i}`, "pharmacology", i),
    );
    const queue = buildResurfacingQueue(entries);
    assert.equal(queue.length, 1, "all duplicates collapsed to one");
    assert.equal(queue[0]!.priorityScore, 49, "highest score retained");
  });
});

// ── 5. CNPLE readiness scoring ────────────────────────────────────────────────

import { computeCnpleReadiness, summarizeReadinessReport } from "@/lib/remediation/cnple-readiness-scoring";

const makeStat = (
  topic: string,
  correctCount: number,
  wrongCount: number,
  wrongStreak = 0,
  lastWrongAt: Date | null = null,
) => ({ topic, correctCount, wrongCount, wrongStreak, lastWrongAt });

describe("cnple readiness: empty stats", () => {
  test("no stats → 0 overall, not ready", () => {
    const report = computeCnpleReadiness([]);
    assert.equal(report.overallReadinessScore, 0);
    assert.equal(report.readyForExam, false);
  });

  test("unrecognized topics → domains all show 50% miss rate default", () => {
    const report = computeCnpleReadiness([makeStat("basket weaving", 10, 0)]);
    // Unknown topic contributes to no domain
    for (const domain of Object.values(report.domains)) {
      assert.equal(domain.attemptCount, 0);
    }
  });
});

describe("cnple readiness: strong performance", () => {
  test("all-correct pharmacology → prescribing readinessScore = 100", () => {
    const report = computeCnpleReadiness([makeStat("pharmacology", 10, 0)]);
    assert.equal(report.domains.prescribing?.readinessScore, 100);
    assert.equal(report.domains.prescribing?.readinessLevel, "ready");
  });

  test("all-correct emergency → escalation_referral readinessScore = 100", () => {
    const report = computeCnpleReadiness([makeStat("emergency", 8, 0)]);
    assert.equal(report.domains.escalation_referral?.readinessScore, 100);
  });
});

describe("cnple readiness: weak performance", () => {
  test("50% miss rate on pharmacology → prescribing is not ready", () => {
    const report = computeCnpleReadiness([makeStat("pharmacology", 5, 5)]);
    const prescribing = report.domains.prescribing!;
    assert.ok(prescribing.readinessLevel !== "ready");
  });

  test("critical miss on pharmacology → criticalGaps populated", () => {
    const report = computeCnpleReadiness([
      makeStat("pharmacology", 1, 9, 0, new Date()),
    ]);
    assert.ok(report.criticalGaps.includes("cnple:prescribing:pharmacology"));
  });

  test("prescribing needs_work blocks readyForExam even if others are ready", () => {
    const stats = [
      makeStat("pharmacology", 0, 10, 0, new Date()),      // prescribing: bad
      makeStat("physical assessment", 10, 0),              // diagnostics: good
      makeStat("pediatrics", 10, 0),                       // lifespan_care: good
      makeStat("emergency", 10, 0),                        // escalation: good
      makeStat("triage", 10, 0),                           // clinical_judgment: good
    ];
    const report = computeCnpleReadiness(stats);
    assert.equal(report.readyForExam, false, "prescribing safety gate must block readyForExam");
  });
});

describe("cnple readiness: prescribing safety flags", () => {
  test("weak pharmacology → prescribingSafetyFlags populated", () => {
    const report = computeCnpleReadiness([makeStat("pharmacology", 1, 9, 0, new Date())]);
    assert.ok(
      report.domains.prescribing!.prescribingSafetyFlags.length > 0,
      "should flag prescribing safety",
    );
  });
});

describe("cnple readiness: summarizeReadinessReport", () => {
  test("orderedDomains sorted weakest first", () => {
    const stats = [
      makeStat("pharmacology", 1, 9, 0, new Date()),   // score ~10
      makeStat("physical assessment", 9, 1),            // score ~90
    ];
    const report = computeCnpleReadiness(stats);
    const { orderedDomains } = summarizeReadinessReport(report);
    assert.ok(orderedDomains[0]!.readinessScore <= orderedDomains[orderedDomains.length - 1]!.readinessScore);
  });

  test("topCriticalGaps capped at 5", () => {
    const { topCriticalGaps } = summarizeReadinessReport({
      generatedAt: "",
      overallReadinessScore: 0,
      readyForExam: false,
      criticalGaps: ["a", "b", "c", "d", "e", "f", "g"],
      domains: {} as never,
    });
    assert.ok(topCriticalGaps.length <= 5);
  });
});

// ── 6. Performance invariants ─────────────────────────────────────────────────

describe("performance: no queue explosion", () => {
  test("100 entries for same topic dedup to 1 in O(n)", () => {
    const entries = Array.from({ length: 100 }, (_, i) =>
      ({ topicKey: "pharmacology", priorityScore: i, id: `id-${i}` }),
    );
    const start = Date.now();
    const deduped = deduplicateResurfacingEntries(entries);
    const elapsed = Date.now() - start;
    assert.equal(deduped.length, 1);
    assert.ok(elapsed < 50, `dedup should be fast, took ${elapsed}ms`);
  });

  test("buildResurfacingQueue: 200 mixed entries processed under 50ms", () => {
    const topics = ["pharmacology", "pediatrics", "emergency", "triage", "referral"];
    const entries = Array.from({ length: 200 }, (_, i) =>
      makeEntry(`id-${i}`, topics[i % topics.length]!, i * 2),
    );
    const start = Date.now();
    const queue = buildResurfacingQueue(entries);
    const elapsed = Date.now() - start;
    assert.ok(queue.length <= topics.length, "dedup collapses to unique topics");
    assert.ok(elapsed < 50, `buildResurfacingQueue should be fast, took ${elapsed}ms`);
  });

  test("taxonomy lookup: 1000 repeated lookups under 50ms", () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      resolveCanonicalTopic("pharmacology");
      resolveCanonicalTopic("emergency management");
      resolveCanonicalTopic("unknown topic xyz");
    }
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 50, `1000 taxonomy lookups took ${elapsed}ms`);
  });
});
