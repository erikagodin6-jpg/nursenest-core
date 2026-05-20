import assert from "node:assert/strict";
import test from "node:test";
import { FlashcardItemKind, TierCode } from "@prisma/client";
import { validateFlashcardCreationGuardrails, auditPublishedCard } from "@/lib/flashcards/flashcard-creation-guardrails";

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

// ── Universal guardrail tests ──────────────────────────────────────────────────

test("universal: rejects placeholder front text (todo)", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "TODO: write question here",
    back: "TODO: write rationale here",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /placeholder/);
});

test("universal: rejects lorem ipsum back text", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NEW_GRAD,
    front: "What is the priority action?",
    back: "Lorem ipsum dolor sit amet.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /placeholder/);
});

test("universal: rejects front shorter than 8 chars", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RPN,
    front: "Insulin",
    back: "A hormone that lowers blood glucose by facilitating cellular uptake.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /too_short/);
});

test("universal: rejects exam card with placeholder distractor rationale", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "",
    back: "",
    exam: {
      itemKind: FlashcardItemKind.CLINICAL,
      questionStem: "Which assessment finding should the nurse report immediately?",
      answerOptions: [
        { letter: "A", text: "Blood pressure 118/76 mmHg" },
        { letter: "B", text: "Oxygen saturation 86% on room air" },
        { letter: "C", text: "Heart rate 72 bpm regular rhythm" },
      ],
      rationaleCorrect:
        "Oxygen saturation of 86% is critically low and indicates hypoxemia requiring immediate intervention to prevent tissue injury.",
      rationaleIncorrect: [
        { letter: "A", rationale: "TODO: add rationale" },
        { letter: "C", rationale: "Heart rate is within normal limits and stable." },
      ],
    },
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /placeholder/);
});

test("universal: rejects exam card with distractor rationale shorter than 16 chars", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "",
    back: "",
    exam: {
      itemKind: FlashcardItemKind.CLINICAL,
      questionStem: "A client develops sudden onset chest pain. What is the priority intervention?",
      answerOptions: [
        { letter: "A", text: "Administer pain medication as ordered" },
        { letter: "B", text: "Obtain a 12-lead ECG" },
        { letter: "C", text: "Notify the physician" },
      ],
      rationaleCorrect:
        "A 12-lead ECG identifies the cause of chest pain including MI patterns so the team can intervene quickly with evidence-based care.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Not first." },
        { letter: "C", rationale: "Notify only after completing the ECG assessment to have data ready." },
      ],
    },
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /distractor_rationale_too_short/);
});

// ── CNPLE-specific guardrail tests (NP tier) ──────────────────────────────────

test("NP: rejects card with CNPLE+CAT language combination", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NP,
    front: "Which action should the nurse practitioner take first for a client in respiratory distress?",
    back: "Assess airway patency because CNPLE uses CAT format to test these priority decisions. Therefore oxygen delivery must be maintained.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /cnple_cat_language/);
});

test("NP: rejects card that presents AANP as related to CNPLE", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NP,
    front: "What does AANP CNPLE certification require?",
    back: "The AANP and CNPLE both require clinical competency demonstration because both are NP licensure pathways, therefore they share similar standards.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /cnple_aanp_ancc_framing/);
});

test("NP: rejects card with fake official CNPLE stats", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NP,
    front: "How many questions does the CNPLE exam have?",
    back: "The Canadian NP licensure exam has exactly 200 questions because the CCRNR designed it to test all competency domains. Therefore budget 4 hours for the exam.",
    exam: null,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.code, /cnple_fake_official_stats/);
});

test("NP: accepts valid CNPLE-aligned flashcard without prohibited framing", () => {
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.NP,
    front: "A 68-year-old with COPD presents with worsening dyspnoea and purulent sputum. Which intervention should the NP prioritise first?",
    back: "Assess oxygen saturation and work of breathing because acute COPD exacerbation can progress rapidly to respiratory failure. Therefore obtain SaO2, initiate bronchodilator therapy, and reassess within 30 minutes. Systemic corticosteroids and antibiotics are indicated if bacterial cause is suspected.",
    exam: null,
  });
  assert.equal(r.ok, true);
});

test("RN tier: CNPLE guardrails do not apply (RN tier is not CNPLE-gated)", () => {
  // The CNPLE CAT language guardrail only fires for NP tier.
  const r = validateFlashcardCreationGuardrails({
    tier: TierCode.RN,
    front: "Which client should the nurse assess first?",
    back: "The client with CNPLE CAT test prep anxiety and O2 sat 88% because airway compromise is the highest priority. Therefore assess respiratory status immediately.",
    exam: null,
  });
  // Should pass because CNPLE guardrails only apply to NP tier.
  assert.equal(r.ok, true);
});

// ── auditPublishedCard tests ───────────────────────────────────────────────────

test("auditPublishedCard: clean card returns no issues", () => {
  const result = auditPublishedCard({
    id: "card-1",
    front: "Which intervention is the priority for a client in respiratory distress?",
    back: "Position upright and administer supplemental oxygen as ordered; assess breath sounds immediately.",
    examItemKind: null,
    questionStem: null,
    rationaleCorrect: null,
    rationaleIncorrect: null,
  });
  assert.deepEqual(result.issues, []);
});

test("auditPublishedCard: flags placeholder front", () => {
  const result = auditPublishedCard({
    id: "card-2",
    front: "TODO",
    back: "Some content here",
    examItemKind: null,
    questionStem: null,
    rationaleCorrect: null,
    rationaleIncorrect: null,
  });
  assert.ok(result.issues.includes("placeholder_text") || result.issues.includes("front_too_short"));
});

test("auditPublishedCard: flags missing question stem when examItemKind set", () => {
  const result = auditPublishedCard({
    id: "card-3",
    front: "Which nursing action is priority?",
    back: "Assess airway first.",
    examItemKind: "CLINICAL",
    questionStem: null,
    rationaleCorrect: "Airway is always the first priority because oxygen delivery is essential for cellular function.",
    rationaleIncorrect: [{ letter: "B", rationale: "Lower priority because client is stable." }],
  });
  assert.ok(result.issues.includes("missing_question_stem"));
});
