import test from "node:test";
import assert from "node:assert/strict";
import { FlashcardItemKind } from "@prisma/client";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";

test("PRE_NURSING rejects ABG-related content", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "PRE_NURSING",
    front: "Quick review: what does PaO2 measure?",
    back: "It reflects oxygen tension in arterial blood.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /pre_nursing_abg/);
});

test("PRE_NURSING rejects lab interpretation framing", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "PRE_NURSING",
    front: "Interpret the following lab results for wellness class.",
    back: "We only discuss general health habits in pre-nursing.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /lab_interpretation/);
});

test("PRE_NURSING rejects disease-specific pathophysiology depth", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "PRE_NURSING",
    front: "Advanced topic",
    back: "Cellular dysfunction in sepsis involves inflammatory cascade signaling.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /pathophysiology/);
});

test("PRE_NURSING accepts foundational wording", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "PRE_NURSING",
    front: "Why is hand hygiene important before clinical experiences?",
    back: "It reduces transmission of germs and protects clients and students.",
    exam: null,
  });
  assert.equal(r.ok, true);
});

test("RN legacy accepts clinical reasoning plus rationale back", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "RN",
    front:
      "A nurse is caring for a client reporting sudden shortness of breath. Which action should the nurse take first?",
    back:
      "The nurse should assess airway and breathing first because circulation interventions depend on oxygenation. Therefore priority is to evaluate work of breathing and oxygen delivery before other tasks.",
    exam: null,
  });
  assert.equal(r.ok, true);
});

test("RN legacy rejects missing clinical reasoning", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "RN",
    front: "Define hypertension.",
    back:
      "Hypertension is elevated blood pressure because sustained pressures strain vessels. Therefore long-term management matters for organ protection in clinical practice.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "flashcard_guardrail_rn_np_clinical_reasoning");
});

test("RN legacy rejects back without rationale connectors", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "RN",
    front: "A confused client tries to leave the unit. Which initial action should the nurse take?",
    back:
      "Stay with the client and call for assistance while assessing safety risks and removing hazards from the immediate environment. Document observations and notify the provider after the client is safe.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "flashcard_guardrail_rn_np_rationale_markers");
});

test("RN exam-style RECALL without judgment cues fails", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "RN",
    front: "",
    back: "",
    exam: {
      itemKind: FlashcardItemKind.RECALL,
      questionStem: "What is the normal range for serum sodium in many labs?",
      answerOptions: [
        { letter: "A", text: "120–125 mEq/L" },
        { letter: "B", text: "135–145 mEq/L" },
        { letter: "C", text: "150–155 mEq/L" },
      ],
      rationaleCorrect:
        "Many references cite roughly 135–145 mEq/L as a common adult reference interval used for teaching.",
      rationaleIncorrect: [
        { letter: "A", rationale: "This range is too low for typical adult serum sodium." },
        { letter: "C", rationale: "This range is higher than typical reference intervals." },
      ],
    },
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "flashcard_guardrail_rn_np_clinical_reasoning");
});

test("RN exam-style CLINICAL with substantive rationales passes", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: "RN",
    front: "",
    back: "",
    exam: {
      itemKind: FlashcardItemKind.CLINICAL,
      questionStem: "A client receiving IV therapy reports burning along the vein. What should the nurse do first?",
      answerOptions: [
        { letter: "A", text: "Slow the infusion" },
        { letter: "B", text: "Stop the infusion and assess the IV site" },
        { letter: "C", text: "Apply heat and continue the infusion" },
      ],
      rationaleCorrect:
        "Stopping the infusion limits further tissue exposure while the nurse assesses for infiltration or phlebitis.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Slowing may delay needed assessment when extravasation is suspected." },
        { letter: "C", rationale: "Heat does not replace stopping a possible harmful infusion." },
      ],
    },
  });
  assert.equal(r.ok, true);
});

test("NEW_GRAD follows RN/NP legacy rules", () => {
  const bad = validateFlashcardCreationGuardrails({
    tier: "NEW_GRAD",
    front: "List the cranial nerves.",
    back:
      "There are twelve cranial nerves numbered I through XII because they emerge from the brainstem and skull base.",
    exam: null,
  });
  assert.equal(bad.ok, false);
});
