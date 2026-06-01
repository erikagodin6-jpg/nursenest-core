import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalForBuilderCategory,
  selectedCategoryCountSum,
  selectedCategoryMatchesBuilderCategory,
} from "@/lib/flashcards/build-flashcard-custom-session";
import { serializeFlashcardForCustomSession } from "@/lib/flashcards/flashcard-study-serialize";
import { FlashcardItemKind } from "@prisma/client";

describe("flashcard category selection taxonomy", () => {
  it("matches RN/RPN/PN hub aliases to taxonomy leaf card buckets", () => {
    const pathwayId = "ca-rn-nclex-rn";
    const selected = new Set(["infection_control", "reproductive_maternal_newborn", "renal_urinary"]);
    const selectedCanonical = new Set([...selected].map((id) => canonicalForBuilderCategory(pathwayId, id)));

    assert.equal(
      selectedCategoryMatchesBuilderCategory(pathwayId, selected, selectedCanonical, "immune_infectious"),
      true,
    );
    assert.equal(
      selectedCategoryMatchesBuilderCategory(pathwayId, selected, selectedCanonical, "reproductive_obstetrics"),
      true,
    );
    assert.equal(
      selectedCategoryMatchesBuilderCategory(pathwayId, selected, selectedCanonical, "renal_genitourinary"),
      true,
    );
  });

  it("sums selected category inventory through canonical aliases", () => {
    assert.equal(
      selectedCategoryCountSum(
        "us-lpn-nclex-pn",
        {
          immune_infectious: 12,
          infection_control: 3,
          cardiovascular: 7,
        },
        ["infection_control"],
      ),
      15,
    );
  });

  it("keeps unrelated categories out of the selected session pool", () => {
    const pathwayId = "ca-rpn-rex-pn";
    const selected = new Set(["infection_control"]);
    const selectedCanonical = new Set([...selected].map((id) => canonicalForBuilderCategory(pathwayId, id)));

    assert.equal(
      selectedCategoryMatchesBuilderCategory(pathwayId, selected, selectedCanonical, "cardiovascular"),
      false,
    );
  });

  it("falls back to plain front/back study cards when legacy exam metadata is incomplete", () => {
    const card = serializeFlashcardForCustomSession(
      {
        id: "legacy-invalid-exam-card",
        front: "What nursing action is prioritized for an airborne isolation patient?",
        back: "Apply airborne precautions, use an N95 respirator, and place the patient in negative pressure isolation.",
        sourceKey: "exam_q:legacy-invalid-exam-card",
        lessonId: null,
        examItemKind: FlashcardItemKind.CLINICAL,
        questionStem: "Which action is priority?",
        answerOptions: [{ letter: "A", text: "Use an N95 respirator" }],
        correctAnswer: "A",
        rationaleCorrect: "Use airborne precautions.",
        rationaleIncorrect: [],
        category: { name: "Fundamentals & Safety", topicCode: "fundamentals_safety" },
        deck: { pathwayId: "ca-rn-nclex-rn" },
      },
      {
        swapFrontBack: false,
        topic: "Fundamentals & Safety",
        pathwayId: "ca-rn-nclex-rn",
        allowInvalidExamBackedAsPlain: true,
      },
    );

    assert.equal(card.examMicroQuestion, undefined);
    assert.match(card.front, /airborne isolation/i);
    assert.match(card.back, /negative pressure/i);
  });
});
