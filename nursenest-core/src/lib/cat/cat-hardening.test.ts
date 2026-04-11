/**
 * CAT Hardening Tests
 *
 * Covers:
 *  - Canonical inference map helpers (cognitive layer, risk, system, disposition, population)
 *  - Fallback and default behavior
 *  - Explicit tag override precedence
 *  - db-adapter integration (end-to-end row → CatQuestion)
 *  - Completion snapshot persistence and safe loading
 *  - Idempotent completion behavior
 *  - Malformed / legacy adaptiveState safe handling
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canonicalSystemTag,
  canonicalTopicSlug,
  clampDifficulty,
  cognitiveLayerFromFormat,
  cognitiveLayerFromLevel,
  cognitiveLayerFromStem,
  COGNITIVE_LAYER_DEFAULT,
  inferDispositionTagFromText,
  inferPopulationTagsFromText,
  inferRiskLevelFromSignals,
  RISK_LEVEL_DEFAULT,
  SYSTEM_TAG_DEFAULT,
} from "./cat-inference-maps";

import {
  dbRowToCatQuestion,
  inferCognitiveLayer,
  inferRiskLevel,
  normaliseSystemTag,
} from "./db-adapter";

import {
  buildCompletionSnapshot,
  extractSnapshotFromAdaptiveState,
  type NpCatAdaptiveState,
  type NpCatCompletionSnapshot,
} from "./session-persistence";

import type { DbQuestionRow } from "./db-adapter";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeRow(overrides: Partial<DbQuestionRow> = {}): DbQuestionRow {
  return {
    id: "q-001",
    topic: null,
    subtopic: null,
    bodySystem: null,
    difficulty: 3,
    cognitiveLevel: null,
    questionFormat: null,
    tags: [],
    nclexClientNeedsCategory: null,
    stem: "A 45-year-old patient presents with chest pain.",
    ...overrides,
  };
}

// ─── cognitiveLayerFromLevel ──────────────────────────────────────────────────

describe("cognitiveLayerFromLevel", () => {
  it("returns L3 for evaluation", () => assert.equal(cognitiveLayerFromLevel("evaluation"), "L3"));
  it("returns L3 for analysis", () => assert.equal(cognitiveLayerFromLevel("analysis"), "L3"));
  it("returns L3 for synthesis", () => assert.equal(cognitiveLayerFromLevel("synthesis"), "L3"));
  it("returns L2 for application", () => assert.equal(cognitiveLayerFromLevel("application"), "L2"));
  it("returns L1 for remember", () => assert.equal(cognitiveLayerFromLevel("remember"), "L1"));
  it("returns L1 for knowledge", () => assert.equal(cognitiveLayerFromLevel("knowledge"), "L1"));
  it("returns L1 for comprehend", () => assert.equal(cognitiveLayerFromLevel("comprehend"), "L1"));
  it("returns null for unknown", () => assert.equal(cognitiveLayerFromLevel("blah"), null));
  it("returns null for null input", () => assert.equal(cognitiveLayerFromLevel(null), null));
  it("returns null for empty string", () => assert.equal(cognitiveLayerFromLevel(""), null));
  it("is case-insensitive", () => assert.equal(cognitiveLayerFromLevel("EVALUATION"), "L3"));
});

// ─── cognitiveLayerFromFormat ─────────────────────────────────────────────────

describe("cognitiveLayerFromFormat", () => {
  it("returns L3 for prioritization format", () => assert.equal(cognitiveLayerFromFormat("prioritization"), "L3"));
  it("returns L3 for triage", () => assert.equal(cognitiveLayerFromFormat("triage scenario"), "L3"));
  it("returns L3 for next step", () => assert.equal(cognitiveLayerFromFormat("next step question"), "L3"));
  it("returns L2 for interpretation", () => assert.equal(cognitiveLayerFromFormat("interpret ECG"), "L2"));
  it("returns L2 for compare options", () => assert.equal(cognitiveLayerFromFormat("compare and select"), "L2"));
  it("returns null for unknown format", () => assert.equal(cognitiveLayerFromFormat("freetext"), null));
  it("returns null for null", () => assert.equal(cognitiveLayerFromFormat(null), null));
});

// ─── cognitiveLayerFromStem ───────────────────────────────────────────────────

describe("cognitiveLayerFromStem", () => {
  it("returns L3 for 'next best step' stem", () =>
    assert.equal(cognitiveLayerFromStem("What is the next best step in management?"), "L3"));
  it("returns L3 for 'most appropriate' stem", () =>
    assert.equal(cognitiveLayerFromStem("Which is most appropriate?"), "L3"));
  it("returns L2 for 'most consistent with'", () =>
    assert.equal(cognitiveLayerFromStem("Which finding is most consistent with this diagnosis?"), "L2"));
  it("returns null for simple recall stem", () =>
    assert.equal(cognitiveLayerFromStem("What is the normal value of hemoglobin?"), null));
});

// ─── inferCognitiveLayer (db-adapter) ─────────────────────────────────────────

describe("inferCognitiveLayer — explicit tag override", () => {
  it("L1 tag wins over Bloom's analysis level", () =>
    assert.equal(inferCognitiveLayer(makeRow({ tags: ["L1"], cognitiveLevel: "analysis" })), "L1"));
  it("L3 tag wins over remember level", () =>
    assert.equal(inferCognitiveLayer(makeRow({ tags: ["L3"], cognitiveLevel: "remember" })), "L3"));
  it("tag check is case-insensitive (l2 tag)", () =>
    assert.equal(inferCognitiveLayer(makeRow({ tags: ["l2"] })), "L2"));
  it("falls back to COGNITIVE_LAYER_DEFAULT when nothing matches", () =>
    assert.equal(inferCognitiveLayer(makeRow()), COGNITIVE_LAYER_DEFAULT));
  it("uses cognitiveLevel when no explicit tag", () =>
    assert.equal(inferCognitiveLayer(makeRow({ cognitiveLevel: "evaluation" })), "L3"));
});

// ─── inferRiskLevelFromSignals ────────────────────────────────────────────────

describe("inferRiskLevelFromSignals", () => {
  const base = { tagStr: "", category: "", topic: "", stem: "", difficulty: 3 };

  it("returns high for 'high-risk' tag", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, tagStr: "high-risk" }), "high"));
  it("returns high for 'sepsis' in tags", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, tagStr: "sepsis patient" }), "high"));
  it("returns low for 'preventive' tag", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, tagStr: "preventive care" }), "low"));
  it("returns high for 'safety' category", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, category: "safety pharmacology" }), "high"));
  it("returns low for 'health promotion' category", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, category: "health promotion" }), "low"));
  it("returns high for stroke topic", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, topic: "ischemic stroke" }), "high"));
  it("returns low for wellness topic", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, topic: "wellness counseling" }), "low"));
  it("returns high for 'immediately' in stem", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, stem: "act immediately to prevent harm" }), "high"));
  it("returns high for difficulty 4", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, difficulty: 4 }), "high"));
  it("returns low for difficulty 2", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, difficulty: 2 }), "low"));
  it("returns default for difficulty 3 with no other signals", () =>
    assert.equal(inferRiskLevelFromSignals(base), RISK_LEVEL_DEFAULT));
  it("tag takes priority over topic", () =>
    assert.equal(inferRiskLevelFromSignals({ ...base, tagStr: "low-risk", topic: "stroke" }), "low"));
});

// ─── inferRiskLevel (db-adapter integration) ─────────────────────────────────

describe("inferRiskLevel — db-adapter", () => {
  it("high-risk tag produces high", () =>
    assert.equal(inferRiskLevel(makeRow({ tags: ["high-risk"] })), "high"));
  it("wellness topic produces low", () =>
    assert.equal(inferRiskLevel(makeRow({ topic: "wellness visit", difficulty: 2 })), "low"));
  it("returns moderate for neutral row", () =>
    assert.equal(inferRiskLevel(makeRow()), RISK_LEVEL_DEFAULT));
});

// ─── canonicalSystemTag ───────────────────────────────────────────────────────

describe("canonicalSystemTag", () => {
  it("maps 'cardiac' to 'cardiovascular'", () => assert.equal(canonicalSystemTag("cardiac"), "cardiovascular"));
  it("maps 'neuro' to 'neurological'", () => assert.equal(canonicalSystemTag("neuro"), "neurological"));
  it("maps 'gi' to 'gastrointestinal'", () => assert.equal(canonicalSystemTag("gi"), "gastrointestinal"));
  it("maps 'psychiatry' to 'behavioral-health'", () => assert.equal(canonicalSystemTag("psychiatry"), "behavioral-health"));
  it("maps 'obstetric' to 'reproductive-health'", () => assert.equal(canonicalSystemTag("obstetric"), "reproductive-health"));
  it("normalises case and spaces", () => assert.equal(canonicalSystemTag("  Cardiac  "), "cardiovascular"));
  it("returns unknown as-is (kebab-cased)", () => assert.equal(canonicalSystemTag("weird system"), "weird-system"));
  it("returns SYSTEM_TAG_DEFAULT for null", () => assert.equal(canonicalSystemTag(null), SYSTEM_TAG_DEFAULT));
  it("returns SYSTEM_TAG_DEFAULT for empty string", () => assert.equal(canonicalSystemTag(""), SYSTEM_TAG_DEFAULT));
});

describe("normaliseSystemTag (db-adapter)", () => {
  it("delegates to canonical map", () => assert.equal(normaliseSystemTag("cardiac"), "cardiovascular"));
  it("returns default for null", () => assert.equal(normaliseSystemTag(null), SYSTEM_TAG_DEFAULT));
});

// ─── canonicalTopicSlug ───────────────────────────────────────────────────────

describe("canonicalTopicSlug", () => {
  it("converts spaces to hyphens", () => assert.equal(canonicalTopicSlug("knee pain"), "knee-pain"));
  it("lowercases", () => assert.equal(canonicalTopicSlug("UTI Management"), "uti-management"));
  it("appends subtopic with double-dash", () =>
    assert.equal(canonicalTopicSlug("diabetes", "type 2"), "diabetes--type-2"));
  it("returns 'uncategorized' for null topic", () => assert.equal(canonicalTopicSlug(null), "uncategorized"));
  it("ignores null subtopic", () => assert.equal(canonicalTopicSlug("cardio", null), "cardio"));
  it("strips leading/trailing hyphens from parts", () =>
    assert.equal(canonicalTopicSlug("  knee pain  "), "knee-pain"));
});

// ─── inferDispositionTagFromText ──────────────────────────────────────────────

describe("inferDispositionTagFromText", () => {
  it("returns immediate-escalation for 'call 911'", () =>
    assert.equal(inferDispositionTagFromText("call 911 now"), "immediate-escalation"));
  it("returns immediate-escalation for 'rapid response'", () =>
    assert.equal(inferDispositionTagFromText("activate rapid response"), "immediate-escalation"));
  it("returns ED-referral for 'emergency department'", () =>
    assert.equal(inferDispositionTagFromText("send to emergency department"), "ED-referral"));
  it("returns urgent-same-day for 'urgent same-day'", () =>
    assert.equal(inferDispositionTagFromText("urgent same-day evaluation"), "urgent-same-day"));
  it("returns outpatient for 'routine follow-up'", () =>
    assert.equal(inferDispositionTagFromText("routine follow-up in 2 weeks"), "outpatient"));
  it("returns undefined for neutral text", () =>
    assert.equal(inferDispositionTagFromText("patient presents with knee pain"), undefined));
  it("immediate-escalation wins over lower patterns", () =>
    assert.equal(inferDispositionTagFromText("call 911 routine follow-up"), "immediate-escalation"));
});

// ─── inferPopulationTagsFromText ──────────────────────────────────────────────

describe("inferPopulationTagsFromText", () => {
  it("detects older-adult", () =>
    assert.ok(inferPopulationTagsFromText("elderly patient with frailty").includes("older-adult")));
  it("detects pediatric", () =>
    assert.ok(inferPopulationTagsFromText("pediatric patient aged 6").includes("pediatric")));
  it("detects LGBTQ+", () =>
    assert.ok(inferPopulationTagsFromText("transgender patient").includes("LGBTQ+")));
  it("detects multiple tags", () => {
    const tags = inferPopulationTagsFromText("elderly transgender patient");
    assert.ok(tags.includes("older-adult"));
    assert.ok(tags.includes("LGBTQ+"));
  });
  it("returns empty for neutral text", () =>
    assert.deepEqual(inferPopulationTagsFromText("presents with chest pain"), []));
});

// ─── clampDifficulty ─────────────────────────────────────────────────────────

describe("clampDifficulty", () => {
  it("clamps 0 to 1", () => assert.equal(clampDifficulty(0), 1));
  it("clamps 6 to 5", () => assert.equal(clampDifficulty(6), 5));
  it("preserves 3", () => assert.equal(clampDifficulty(3), 3));
  it("rounds 2.7 to 3", () => assert.equal(clampDifficulty(2.7), 3));
  it("defaults null to 3", () => assert.equal(clampDifficulty(null), 3));
  it("defaults undefined to 3", () => assert.equal(clampDifficulty(undefined), 3));
  it("defaults NaN to 3", () => assert.equal(clampDifficulty(NaN), 3));
});

// ─── dbRowToCatQuestion — end-to-end ─────────────────────────────────────────

describe("dbRowToCatQuestion", () => {
  it("produces a complete CatQuestion from a minimal row", () => {
    const q = dbRowToCatQuestion(makeRow({ id: "q1" }));
    assert.equal(q.id, "q1");
    assert.ok(["L1", "L2", "L3"].includes(q.cognitiveLayer));
    assert.ok(["low", "moderate", "high"].includes(q.riskLevel));
    assert.ok(typeof q.systemTag === "string");
    assert.ok([1, 2, 3, 4, 5].includes(q.difficulty));
  });

  it("explicit tag L3 overrides cognitiveLevel=remember", () => {
    const q = dbRowToCatQuestion(makeRow({ tags: ["L3"], cognitiveLevel: "remember" }));
    assert.equal(q.cognitiveLayer, "L3");
  });

  it("override object wins over inference", () => {
    const q = dbRowToCatQuestion(
      makeRow({ tags: ["L1"], cognitiveLevel: "remember" }),
      { cognitiveLayer: "L2", riskLevel: "high" },
    );
    assert.equal(q.cognitiveLayer, "L2");
    assert.equal(q.riskLevel, "high");
  });

  it("sets dispositionTag when stem matches pattern", () => {
    const q = dbRowToCatQuestion(makeRow({ stem: "Call 911 and activate a code." }));
    assert.equal(q.dispositionTag, "immediate-escalation");
  });

  it("omits dispositionTag when no match", () => {
    const q = dbRowToCatQuestion(makeRow({ stem: "A patient presents with mild headache." }));
    assert.equal(q.dispositionTag, undefined);
  });

  it("sets populationTags for older-adult stem", () => {
    const q = dbRowToCatQuestion(makeRow({ stem: "An elderly patient with frailty presents." }));
    assert.ok(q.populationTags?.includes("older-adult"));
  });

  it("omits populationTags array when no match", () => {
    const q = dbRowToCatQuestion(makeRow());
    assert.equal(q.populationTags, undefined);
  });

  it("normalises bodySystem to canonical", () => {
    const q = dbRowToCatQuestion(makeRow({ bodySystem: "cardiac" }));
    assert.equal(q.systemTag, "cardiovascular");
  });

  it("produces stable topic slug from topic+subtopic", () => {
    const q = dbRowToCatQuestion(makeRow({ topic: "Knee Pain", subtopic: "Structural" }));
    assert.equal(q.topicSlug, "knee-pain--structural");
  });

  it("uses 'uncategorized' topic slug when topic is null", () => {
    const q = dbRowToCatQuestion(makeRow({ topic: null }));
    assert.equal(q.topicSlug, "uncategorized");
  });
});

// ─── buildCompletionSnapshot ──────────────────────────────────────────────────

describe("buildCompletionSnapshot", () => {
  it("produces a compact snapshot from a SessionAnalysis", () => {
    const fakeAnalysis = {
      summary: {
        readinessScore: { score: 72, band: "approaching" },
        totalAnswered: 30,
        totalCorrect: 22,
        sessionAccuracy: 0.733,
        scoreDelta: 5,
      },
      weakAreas: [
        { dimension: "system", key: "cardiovascular", label: "Cardiovascular", accuracy: 0.5, recentAccuracy: 0.5, attempted: 6, remediationPriority: 0.8 },
        { dimension: "risk", key: "high", label: "High-risk", accuracy: 0.4, recentAccuracy: 0.4, attempted: 8, remediationPriority: 0.9 },
      ],
      performanceSnapshot: {
        byLayer: {
          L1: { accuracy: 0.9, attempted: 5 },
          L2: { accuracy: 0.7, attempted: 15 },
          L3: { accuracy: 0.5, attempted: 10 },
        },
        overall: { accuracy: 0.733, attempted: 30 },
        byRisk: {},
        bySystem: {},
        byTopic: {},
      },
    } as unknown as Parameters<typeof buildCompletionSnapshot>[0];

    const snap = buildCompletionSnapshot(fakeAnalysis);
    assert.equal(snap.readinessScore, 72);
    assert.ok(typeof snap.readinessBand === "string");
    assert.ok(Array.isArray(snap.weakSystems));
    assert.ok(Array.isArray(snap.weakRiskCategories));
    assert.ok(typeof snap.layerSummary === "object");
    assert.ok(Array.isArray(snap.nextFocusAreas));
  });

  it("handles empty weakAreas gracefully", () => {
    const snap = buildCompletionSnapshot({
      summary: {
        readinessScore: { score: 85 },
        totalAnswered: 40,
        totalCorrect: 34,
        sessionAccuracy: 0.85,
        scoreDelta: null,
      },
      weakAreas: [],
      performanceSnapshot: {
        byLayer: { L1: { accuracy: 1, attempted: 10 }, L2: { accuracy: 0.8, attempted: 20 }, L3: { accuracy: 0.75, attempted: 10 } },
        overall: { accuracy: 0.85, attempted: 40 },
        byRisk: {},
        bySystem: {},
        byTopic: {},
      },
    } as unknown as Parameters<typeof buildCompletionSnapshot>[0]);
    assert.equal(snap.readinessScore, 85);
    assert.deepEqual(snap.weakSystems, []);
    assert.deepEqual(snap.weakRiskCategories, []);
    assert.deepEqual(snap.nextFocusAreas, []);
  });
});

// ─── extractSnapshotFromAdaptiveState ─────────────────────────────────────────

describe("extractSnapshotFromAdaptiveState", () => {
  it("returns null for null input", () =>
    assert.equal(extractSnapshotFromAdaptiveState(null), null));

  it("returns null for missing _v", () =>
    assert.equal(extractSnapshotFromAdaptiveState({ something: "else" }), null));

  it("returns null when snapshot field is absent (legacy state without snapshot)", () => {
    const legacyState: NpCatAdaptiveState = {
      _v: 1,
      sessionId: "s1",
      startedAt: Date.now(),
      abilityEstimate: 0,
      answeredIds: [],
      recentlySeenIds: [],
      sessionAnswers: [],
      correctStreak: 0,
      incorrectStreak: 0,
      performance: {},
    };
    assert.equal(extractSnapshotFromAdaptiveState(legacyState), null);
  });

  it("returns snapshot when present", () => {
    const snap: NpCatCompletionSnapshot = {
      readinessScore: 75,
      readinessBand: "ready",
      weakSystems: ["cardiovascular"],
      weakRiskCategories: ["high"],
      layerSummary: { L1: 0.9, L2: 0.7, L3: 0.6 },
      nextFocusAreas: ["cardiovascular", "high-risk content"],
      completedAt: new Date().toISOString(),
    };
    const state: NpCatAdaptiveState & { snapshot?: NpCatCompletionSnapshot } = {
      _v: 1,
      sessionId: "s2",
      startedAt: Date.now(),
      abilityEstimate: 1,
      answeredIds: ["q1"],
      recentlySeenIds: [],
      sessionAnswers: [],
      correctStreak: 1,
      incorrectStreak: 0,
      performance: {},
      snapshot: snap,
    };
    const result = extractSnapshotFromAdaptiveState(state);
    assert.ok(result !== null);
    assert.equal(result!.readinessScore, 75);
    assert.equal(result!.readinessBand, "ready");
    assert.deepEqual(result!.weakSystems, ["cardiovascular"]);
  });

  it("returns null for malformed snapshot (missing required field)", () => {
    const state = {
      _v: 1,
      sessionId: "s3",
      snapshot: { readinessBand: "ready" }, // missing readinessScore
    };
    assert.equal(extractSnapshotFromAdaptiveState(state), null);
  });
});

// ─── Idempotent completion guard (serialisation path) ────────────────────────

describe("NpCatAdaptiveState _v guard", () => {
  it("rejects state with unknown version", () => {
    const badState = { _v: 99, sessionId: "x" };
    // extractSnapshotFromAdaptiveState should return null
    assert.equal(extractSnapshotFromAdaptiveState(badState), null);
  });

  it("handles completely garbage input without throwing", () => {
    const inputs: unknown[] = [null, undefined, 0, "string", [], true, { nested: { deeply: {} } }];
    for (const input of inputs) {
      assert.doesNotThrow(() => extractSnapshotFromAdaptiveState(input));
    }
  });
});
