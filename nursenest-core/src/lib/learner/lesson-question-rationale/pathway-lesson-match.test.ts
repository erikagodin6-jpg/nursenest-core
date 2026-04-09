import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode } from "@prisma/client";
import { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
import {
  RATIONALE_DB_EXACT_MIN_SCORE,
  rankPathwayLessonRowsForQuestion,
  scorePathwayLessonForQuestionSignals,
} from "@/lib/learner/lesson-question-rationale/pathway-lesson-match";

const usRn = pathwayRationaleContextFromId("us-rn-nclex-rn")!;

describe("pathway-lesson-match", () => {
  it("boosts same-topic lessons with lexical overlap and medication alignment", () => {
    const row = {
      id: "l1",
      slug: "diabetes-insulin-gold",
      title: "Insulin administration and hypoglycemia monitoring",
      topic: "Endocrine",
      topicSlug: "diabetes-mellitus",
      bodySystem: "endocrine",
      countryCode: null,
    };
    const { score } = scorePathwayLessonForQuestionSignals(
      {
        tags: ["pharmacology"],
        topic: "Med-Surg",
        subtopic: "Diabetes mellitus",
        bodySystem: null,
        topicCode: "diabetes-mellitus",
        stem: "The nurse prepares insulin for a patient with Type 1 diabetes. Which intervention reduces hypoglycemia risk?",
      },
      usRn,
      row,
      "diabetes-mellitus",
    );
    assert.ok(score >= RATIONALE_DB_EXACT_MIN_SCORE, `expected strong match, got ${score}`);
  });

  it("penalizes country-scoped lessons that do not match the learner pathway country", () => {
    const row = {
      id: "l2",
      slug: "topic-lesson-ca",
      title: "Sepsis bundle review",
      topic: "Infection",
      topicSlug: "sepsis",
      bodySystem: "immune",
      countryCode: CountryCode.CA,
    };
    const { score } = scorePathwayLessonForQuestionSignals(
      {
        tags: [],
        topic: "ICU",
        subtopic: "Sepsis",
        bodySystem: null,
        topicCode: "sepsis",
        stem: "Early sepsis recognition and lactate monitoring.",
      },
      usRn,
      row,
      "sepsis",
    );
    assert.ok(score < RATIONALE_DB_EXACT_MIN_SCORE, `expected penalty to drop score, got ${score}`);
  });

  it("ranks multiple lessons by score descending", () => {
    const rows = [
      {
        id: "a",
        slug: "weak",
        title: "Generic sepsis overview",
        topic: "Infection",
        topicSlug: "sepsis",
        bodySystem: "immune",
        countryCode: null,
      },
      {
        id: "b",
        slug: "strong",
        title: "Sepsis lactate clearance and fluid resuscitation protocols",
        topic: "Infection",
        topicSlug: "sepsis",
        bodySystem: "immune",
        countryCode: null,
      },
    ];
    const ranked = rankPathwayLessonRowsForQuestion(
      {
        tags: [],
        topic: "Critical care",
        subtopic: "Sepsis",
        bodySystem: null,
        topicCode: "sepsis",
        stem: "Which finding supports adequate fluid resuscitation in sepsis? Lactate trends.",
      },
      usRn,
      rows,
      "sepsis",
    );
    assert.equal(ranked[0]?.row.slug, "strong");
    assert.ok((ranked[0]?.score ?? 0) >= (ranked[1]?.score ?? 0));
  });
});
