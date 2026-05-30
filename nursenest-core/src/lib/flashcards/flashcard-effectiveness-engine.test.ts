import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { FlashcardTelemetryEventRecord } from "./flashcard-analytics-aggregators";
import { buildFlashcardEffectivenessReport } from "./flashcard-effectiveness-engine";

const events: FlashcardTelemetryEventRecord[] = [
  { event: "answer_submitted", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", is_correct: true, time_to_answer_ms: 9_000 },
  { event: "flashcard_rated", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", confidence_level: "hard", dwell_reveal_ms: 15_000, rationale_dwell_ms: 22_000 },
  { event: "answer_submitted", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", is_correct: true, time_to_answer_ms: 8_000 },
  { event: "flashcard_rated", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", confidence_level: "good", dwell_reveal_ms: 12_000, rationale_dwell_ms: 18_000 },
  { event: "answer_submitted", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", is_correct: true, time_to_answer_ms: 6_000 },
  { event: "flashcard_rated", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", confidence_level: "good", dwell_reveal_ms: 9_000, rationale_dwell_ms: 12_000 },
  { event: "answer_submitted", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", is_correct: true, time_to_answer_ms: 5_000 },
  { event: "flashcard_rated", card_id: "card-effective", pathway_id: "RN", topic: "Cardiovascular", confidence_level: "easy", dwell_reveal_ms: 7_000, rationale_dwell_ms: 8_000 },

  { event: "answer_submitted", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", is_correct: false, time_to_answer_ms: 4_000 },
  { event: "flashcard_rated", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", confidence_level: "again", dwell_reveal_ms: 2_000, rationale_dwell_ms: 3_000 },
  { event: "remediation_triggered", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine" },
  { event: "answer_submitted", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", is_correct: false, time_to_answer_ms: 5_000 },
  { event: "flashcard_rated", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", confidence_level: "again", dwell_reveal_ms: 1_500, rationale_dwell_ms: 2_000 },
  { event: "answer_submitted", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", is_correct: false, time_to_answer_ms: 5_200 },
  { event: "flashcard_rated", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine", confidence_level: "hard", dwell_reveal_ms: 2_400, rationale_dwell_ms: 2_500 },
  { event: "flashcard_abandoned", card_id: "card-weak", pathway_id: "RN", topic: "Endocrine" },

  { event: "answer_submitted", card_id: "card-rt", pathway_id: "RT", topic: "Ventilation", is_correct: false, time_to_answer_ms: 10_000 },
  { event: "flashcard_rated", card_id: "card-rt", pathway_id: "RT", topic: "Ventilation", confidence_level: "hard", dwell_reveal_ms: 20_000, rationale_dwell_ms: 24_000 },
  { event: "answer_submitted", card_id: "card-rt", pathway_id: "RT", topic: "Ventilation", is_correct: true, time_to_answer_ms: 11_000 },
  { event: "flashcard_rated", card_id: "card-rt", pathway_id: "RT", topic: "Ventilation", confidence_level: "good", dwell_reveal_ms: 18_000, rationale_dwell_ms: 21_000 },
];

describe("Flashcard Effectiveness Engine", () => {
  it("scores retention, confidence growth, knowledge growth, review time, and rationale dwell per card", () => {
    const report = buildFlashcardEffectivenessReport({
      events,
      generatedAtIso: "2026-05-30T00:00:00.000Z",
      contentSignals: [
        {
          id: "card-effective",
          prompt: "Which finding suggests fluid overload?",
          correctRationale:
            "New crackles and increasing dyspnea indicate worsening pulmonary congestion. The nurse should reassess oxygenation, positioning, intake and output, and notify the provider if symptoms worsen.",
          distractorRationales: [
            { letter: "A", rationale: "Stable chronic edema alone is less urgent than a new respiratory change." },
            { letter: "B", rationale: "Mild thirst does not indicate fluid overload." },
          ],
        },
        {
          id: "card-weak",
          prompt: "Which insulin finding needs follow-up?",
          correctRationale: "Use the nursing process.",
          distractorRationales: [],
        },
      ],
    });

    const effective = report.cards.find((card) => card.cardId === "card-effective");
    assert.ok(effective);
    assert.equal(effective.againRate, 0);
    assert.ok(effective.retentionScore >= 80);
    assert.ok(effective.confidenceGrowth > 0);
    assert.ok(effective.knowledgeGrowth >= 0);
    assert.equal(effective.averageTimeToAnswerMs, 7000);
    assert.equal(effective.averageTimeToReviewMs, 10750);
    assert.equal(effective.averageRationaleDwellMs, 15000);
  });

  it("flags repeated Again/Hard ratings, weak rationales, poor retention, and abandonment risk", () => {
    const report = buildFlashcardEffectivenessReport({
      events,
      contentSignals: [
        {
          id: "card-weak",
          prompt: "Which insulin finding needs follow-up?",
          correctRationale: "Responds to the priority cue.",
          distractorRationales: [],
        },
      ],
    });
    const weak = report.cards.find((card) => card.cardId === "card-weak");
    assert.ok(weak);
    assert.ok(weak.flags.includes("repeated_again"));
    assert.ok(weak.flags.includes("poor_retention"));
    assert.ok(weak.flags.includes("weak_rationale"));
    assert.ok(weak.flags.includes("abandonment_risk"));
    assert.ok(report.reviewQueue.some((card) => card.cardId === "card-weak"));
    assert.equal(report.leastEffectiveCards[0]?.cardId, "card-weak");
  });

  it("generates topic and pathway retention score rollups", () => {
    const report = buildFlashcardEffectivenessReport({ events });
    const endocrine = report.topics.find((topic) => topic.topic === "Endocrine");
    assert.ok(endocrine);
    assert.equal(endocrine.pathwayId, "RN");
    assert.equal(endocrine.mostDifficult, true);

    const rn = report.pathways.find((pathway) => pathway.pathwayId === "RN");
    const rt = report.pathways.find((pathway) => pathway.pathwayId === "RT");
    assert.ok(rn);
    assert.ok(rt);
    assert.equal(rn.topicCount, 2);
    assert.equal(rt.topicCount, 1);
    assert.ok(rn.retentionScore > 0);
    assert.ok(rt.retentionScore > 0);
  });

  it("identifies highest improvement topics and remediation success", () => {
    const report = buildFlashcardEffectivenessReport({ events });
    assert.ok(report.highestImprovementTopics.length > 0);
    const weak = report.cards.find((card) => card.cardId === "card-weak");
    assert.ok(weak);
    assert.equal(weak.remediationSuccess, 0);
    assert.ok(weak.flags.includes("low_remediation_success"));
  });
});
