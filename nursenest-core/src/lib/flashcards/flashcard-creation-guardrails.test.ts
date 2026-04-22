import assert from "node:assert/strict";
import test from "node:test";
import { FlashcardItemKind, TierCode } from "@prisma/client";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";

test("PRE_NURSING rejects ABG content", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.PRE_NURSING,
    front: "What does an ABG measure?",
    back: "Oxygen and carbon dioxide levels in arterial blood.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /pre_nursing_abg/);
});

test("PRE_NURSING rejects lab interpretation framing", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.PRE_NURSING,
    front: "Interpret the following lab results for this client.",
    back: "Use reference ranges to decide next steps.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /lab_interpretation/);
});

test("PRE_NURSING rejects disease-specific pathophysiology depth", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.PRE_NURSING,
    front: "Pathogenesis of diabetic nephropathy",
    back: "Progressive glomerular injury.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /pathophysiology/);
});

test("PRE_NURSING allows foundational recall", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.PRE_NURSING,
    front: "What is hand hygiene primarily intended to reduce?",
    back: "Transmission of microorganisms between clients and caregivers.",
    exam: null,
  });
  assert.equal(r.ok, true);
});

test("RN rejects legacy card without clinical reasoning", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "Define insulin.",
    back: "A hormone produced by the pancreas that lowers blood glucose.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /clinical_reasoning/);
});

test("RN allows legacy card with scenario + rationale markers on back", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "The nurse notes a client with new confusion and slurred speech. Which action should the nurse take first?",
    back: "Assess airway and neurologic status immediately because acute mental status change may signal stroke or hypoxia. Therefore prioritize assessment before routine tasks.",
    exam: null,
  });
  assert.equal(r.ok, true);
});

test("RN exam-style accepts priority stem with teaching rationale", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "",
    back: "",
    exam: {
      itemKind: FlashcardItemKind.PRIORITY,
      questionStem: "Which client should the nurse assess first in a busy med-surg unit?",
      answerOptions: [
        { letter: "A", text: "Stable post-op awaiting discharge" },
        { letter: "B", text: "New onset confusion with dropping oxygen saturation" },
        { letter: "C", text: "Chronic pain 3/10 after scheduled analgesic" },
      ],
      rationaleCorrect:
        "Airway and oxygenation threats plus acute mental status change represent the highest risk and should be assessed before stable or chronic complaints.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Stable findings are lower priority than acute deterioration." },
        { letter: "C", rationale: "Controlled chronic pain is lower priority than acute physiological compromise." },
      ],
    },
  });
  assert.equal(r.ok, true);
});

test("NEW_GRAD tier skips RN/NP clinical guard (not in RN/NP bucket)", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NEW_GRAD,
    front: "Define insulin.",
    back: "A hormone produced by the pancreas.",
    exam: null,
  });
  assert.equal(r.ok, true);
});
