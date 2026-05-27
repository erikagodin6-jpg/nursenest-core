import type { FlashcardItemKind, TierCode } from "@prisma/client";
import { hasSimpleRationaleTeachingShape, isGenericRationaleText } from "@/lib/questions/rationale-quality";

export type FlashcardCreationGuardrailExamSlice = {
  itemKind: FlashcardItemKind;
  questionStem: string;
  answerOptions: Array<{ letter: string; text: string }>;
  rationaleCorrect: string;
  rationaleIncorrect: Array<{ letter: string; rationale: string }>;
};

export type FlashcardCreationGuardrailInput = {
  tier: TierCode;
  front: string;
  back: string;
  /** When present, tier rules apply to exam fields as well as legacy front/back (which may mirror stem/summary). */
  exam: FlashcardCreationGuardrailExamSlice | null;
};

/** Arterial blood gas and related advanced interpretation (disallowed on PRE_NURSING). */
const PRE_NURSING_ABG = new RegExp(
  String.raw`\b(?:abg|vbg|arterial\s+blood\s+gas|venous\s+blood\s+gas|pao2|paco2|pa\s*o2|pa\s*co2|hco3|bicarb(?:onate)?\s+on\s+abg)\b|base\s+excess|oxygenation\s+and\s+ventilation\s+status|acid[-\s]?base\s+(?:balance|status|disturbance)\s+(?:on|from|per)\s+(?:the\s+)?(?:abg|blood\s+gas|arterial)`,
  "i",
);

/** Lab-value interpretation stems typical of clinical lab items, not foundational pre-nursing. */
const PRE_NURSING_LAB_INTERP = new RegExp(
  String.raw`interpret\s+(?:the|this|these)\s+following\s+(?:lab|labs|results|values|findings)|interpret\s+(?:the|these|following)\s+(?:lab|labs|results|values|findings)|lab\s+values\s+(?:indicate|show|reveal|suggest)|reference\s+range|critical\s+(?:lab|value|result)|which\s+lab\s+(?:result|value|finding)|which\s+finding\s+(?:on|from)\s+(?:the\s+)?(?:lab|labs|chemistry|cbc)|troponin\s+(?:level|trend|elevation|interpret)|lactate\s+(?:clearance|interpret)|anion\s+gap\s+(?:interpret|calculation)|\b(?:cbc|bmp|cmp|lfts?)\b.*\b(?:interpret|indicates|suggests)\b`,
  "i",
);

/** Disease-specific / mechanistic pathophysiology depth (disallowed on PRE_NURSING). */
const PRE_NURSING_PATHOPHYS = new RegExp(
  String.raw`\bpathophysiolog(?:y|ic)\b|pathogenesis\s+of|disease[-\s]specific\s+pathophys|disease[-\s]specific\s+mechanisms|cellular\s+(?:dysfunction|mechanism)|inflammatory\s+cascade|tissue\s+(?:injury|damage)\s+leads|ischemia[-\s]reperfusion|receptor[-\s]mediated\s+signaling|organ[-\s]level\s+pathophys`,
  "i",
);

const CLINICAL_REASONING = new RegExp(
  String.raw`\b(?:priority|first\s+action|which\s+(?:intervention|action|nursing|response)|most\s+appropriate|best\s+(?:response|action|intervention)|nurse\s+should|initial\s+(?:assessment|action|step)|next\s+step|at\s+risk\s+for|clinical\s+(?:judgment|decision)|manifestations|deteriorat|safety\s+(?:concern|issue)|airway\s+first)\b`,
  "i",
);

const CLINICAL_SCENARIO = new RegExp(
  String.raw`\b(?:client|patient|nurse\s+is\s+caring|nurse\s+notes|prescribed|ordered|administer|receiving|reports|develops|exhibits)\b`,
  "i",
);

const RATIONALE_MARKERS = new RegExp(
  String.raw`\b(?:because|rationale|therefore|due\s+to|indicates\s+that|helps\s+(?:prevent|avoid)|supports\s+the|avoids|reduces\s+risk)\b`,
  "i",
);

/** Exam correct-option rationale: explicit connectors and/or common teaching phrasing (not keyword-stuffed stems). */
const EXAM_RATIONALE_TEACHING = new RegExp(
  String.raw`${RATIONALE_MARKERS.source}|\b(?:risk|priority|prioritize|unsafe|urgent|deteriorat|compromise|threat|assess\s+first|highest\s+risk|lower\s+priority|acute\s+change)\b`,
  "i",
);

/**
 * CNPLE-specific content guardrails applied to NP-tier flashcards.
 * Checks for prohibited framing patterns regardless of pathway scope.
 */
function cnpleViolations(blob: string): { code: string; error: string } | null {
  if (CNPLE_CAT_LANGUAGE.test(blob)) {
    return {
      code: "flashcard_guardrail_cnple_cat_language",
      error:
        "CNPLE is not a CAT exam — it uses LOFT (linear on-the-fly testing). Remove any language that calls CNPLE a CAT or computerized adaptive exam.",
    };
  }
  if (CNPLE_AANP_ANCC_FRAMING.test(blob)) {
    return {
      code: "flashcard_guardrail_cnple_aanp_ancc_framing",
      error:
        "AANP and ANCC are US NP certification bodies and must not be presented as equivalent to or part of CNPLE. Keep US and Canadian NP credentialing clearly separate.",
    };
  }
  if (CNPLE_FAKE_OFFICIAL_STATS.test(blob)) {
    return {
      code: "flashcard_guardrail_cnple_fake_official_stats",
      error:
        "Do not state official CNPLE item counts, timing, or passing-score thresholds as facts unless they appear in confirmed CCRNR/CNPLE publications. Present unknown specifics as approximate or not yet confirmed.",
    };
  }
  return null;
}

function collectBlob(input: FlashcardCreationGuardrailInput): string {
  const parts = [input.front, input.back];
  if (input.exam) {
    parts.push(input.exam.questionStem);
    for (const o of input.exam.answerOptions) parts.push(o.text);
    parts.push(input.exam.rationaleCorrect);
    for (const d of input.exam.rationaleIncorrect) parts.push(d.rationale);
  }
  return parts.join("\n").toLowerCase();
}

function preNursingViolations(blob: string): { code: string; error: string } | null {
  if (PRE_NURSING_ABG.test(blob)) {
    return {
      code: "flashcard_guardrail_pre_nursing_abg",
      error:
        "Pre-nursing flashcards cannot focus on arterial blood gases or blood-gas interpretation. Rephrase for foundational concepts without ABG or gas-exchange lab interpretation.",
    };
  }
  if (PRE_NURSING_LAB_INTERP.test(blob)) {
    return {
      code: "flashcard_guardrail_pre_nursing_lab_interpretation",
      error:
        "Pre-nursing flashcards cannot require advanced lab interpretation. Use introductory wellness or safety framing instead of interpreting labs or critical values.",
    };
  }
  if (PRE_NURSING_PATHOPHYS.test(blob)) {
    return {
      code: "flashcard_guardrail_pre_nursing_pathophysiology",
      error:
        "Pre-nursing flashcards cannot emphasize disease-specific pathophysiology or deep cellular mechanisms. Keep scope appropriate for foundational preparation.",
    };
  }
  return null;
}

function rnNpExamSatisfies(exam: FlashcardCreationGuardrailExamSlice): { ok: true } | { ok: false; code: string; error: string } {
  const stemOpts = [exam.questionStem, ...exam.answerOptions.map((o) => o.text)].join("\n");
  const hasReasoningCue =
    CLINICAL_REASONING.test(stemOpts) ||
    (CLINICAL_SCENARIO.test(exam.questionStem) && CLINICAL_REASONING.test(`${stemOpts}\n${exam.rationaleCorrect}`));
  const kindImpliesClinicalJudgment = exam.itemKind === "CLINICAL" || exam.itemKind === "PRIORITY";
  if (!kindImpliesClinicalJudgment && !hasReasoningCue) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_clinical_reasoning",
      error:
        "RN/NP flashcards must reflect clinical reasoning (priority/first-action/which-intervention language in the stem or options, or set exam item kind to clinical/priority).",
    };
  }
  if (exam.rationaleCorrect.trim().length < 48) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale",
      error: "RN/NP flashcards must include a substantive correct rationale (at least ~50 characters teaching the decision).",
    };
  }
  if (isGenericRationaleText(exam.rationaleCorrect) || !hasSimpleRationaleTeachingShape(exam.rationaleCorrect)) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale_quality",
      error:
        "RN/NP flashcards need a clear rationale that explains the correct answer, clinical reasoning, safety priority, and transferable nursing principle.",
    };
  }
  if (!EXAM_RATIONALE_TEACHING.test(exam.rationaleCorrect)) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale_markers",
      error:
        "RN/NP exam-style cards must include teaching rationale language in the correct-option explanation (e.g. because, therefore, risk/priority framing, or why the option is safest or most urgent).",
    };
  }
  const shortDistractor = exam.rationaleIncorrect.find((d) => d.rationale.trim().length < 55);
  if (shortDistractor) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_distractor_rationale",
      error: "RN/NP exam-style cards need a concise teaching rationale for each distractor (unsafe, delayed, or lower-priority option).",
    };
  }
  const genericDistractor = exam.rationaleIncorrect.find((d) => isGenericRationaleText(d.rationale));
  if (genericDistractor) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_distractor_rationale_quality",
      error: `Distractor rationale for option ${genericDistractor.letter} is vague or placeholder-like. Explain why it is unsafe, delayed, or lower priority.`,
    };
  }
  return { ok: true };
}

function rnNpLegacySatisfies(front: string, back: string): { ok: true } | { ok: false; code: string; error: string } {
  const f = front.trim();
  const b = back.trim();
  const combined = `${f}\n${b}`;
  const hasReasoning =
    CLINICAL_REASONING.test(combined) || (CLINICAL_SCENARIO.test(f) && (CLINICAL_REASONING.test(b) || CLINICAL_REASONING.test(f)));
  if (!hasReasoning) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_clinical_reasoning",
      error:
        "RN/NP flashcards must include clinical reasoning (e.g. priority/first action, which intervention, nurse assessment, or a brief client scenario with a decision).",
    };
  }
  if (b.length < 56) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale",
      error: "RN/NP flashcards must include a teaching rationale on the back (at least several sentences explaining the correct choice).",
    };
  }
  if (!RATIONALE_MARKERS.test(b)) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale_markers",
      error:
        "RN/NP flashcard backs should read as rationales (use connectors such as because, therefore, due to, or explicitly label rationale).",
    };
  }
  return { ok: true };
}

// ── CNPLE-specific patterns ───────────────────────────────────────────────────

/**
 * Language that incorrectly calls CNPLE a CAT exam.
 * CNPLE uses LOFT (linear on-the-fly testing).
 */
const CNPLE_CAT_LANGUAGE = new RegExp(
  String.raw`\b(?:cnple\b.{0,60}\bcat\b|\bcat\b.{0,60}\bcnple|cnple.*computerized adaptive|cnple.*adaptive testing|canadian np.*cat exam|cat exam.*canadian np)\b`,
  "i",
);

/**
 * AANP/ANCC references that conflate US NP certifications with CNPLE.
 */
const CNPLE_AANP_ANCC_FRAMING = new RegExp(
  String.raw`\b(?:aanp|ancc)\b.{0,80}\b(?:cnple|canadian np licensure|canada np exam)\b|\b(?:cnple|canadian np licensure)\b.{0,80}\b(?:aanp|ancc)\b`,
  "i",
);

/**
 * Fake official CNPLE statistics — invented item counts, timing, or pass-score
 * claims that are not published in official CCRNR/CNPLE documentation.
 * Pattern: "CNPLE has X questions" / "passing score is X%" / "time limit is X hours"
 * where those specifics are presented as exam facts.
 */
const CNPLE_FAKE_OFFICIAL_STATS = new RegExp(
  String.raw`\b(?:cnple|canadian np (?:licensure )?exam(?:ination)?)\b.{0,120}\b(?:has exactly|consists of exactly|requires exactly|is exactly) \d+\b|
\b(?:cnple|canadian np (?:licensure )?exam(?:ination)?)\b.{0,120}\b(?:pass(?:ing)? (?:score|rate) (?:is|of) \d+%|pass(?:ing)? (?:score|mark) (?:is|of))\b|
\b(?:cnple|canadian np (?:licensure )?exam(?:ination)?)\b.{0,120}\bofficial(?:ly)? (?:weighted|divided|split|structured)\b`,
  "i",
);

/** Placeholder / stub text that should never reach production. */
const PLACEHOLDER_RE = /\b(?:todo|placeholder|lorem ipsum|example answer|insert (?:answer|rationale|question) here|coming soon|tbd|fixme|sample text|your (?:answer|question) here)\b/i;

/**
 * Universal guardrails applied to ALL tiers before the tier-specific checks.
 * Catches placeholder text, stub rationales, and unsafe absolute statements.
 */
function universalViolations(input: FlashcardCreationGuardrailInput): { code: string; error: string } | null {
  const frontTrimmed = input.front.trim();
  const backTrimmed = input.back.trim();

  // When a fully-structured exam block is present, the questionStem IS the prompt
  // and front/back may be short summaries or even empty. Only check them when there
  // is no exam block (legacy plain-text card format).
  const hasExam = Boolean(input.exam);

  if (!hasExam) {
    if (frontTrimmed.length < 8) {
      return {
        code: "flashcard_guardrail_front_too_short",
        error: "Flashcard front (question/prompt) must be at least 8 characters.",
      };
    }
    if (backTrimmed.length < 8) {
      return {
        code: "flashcard_guardrail_back_too_short",
        error: "Flashcard back (answer/rationale) must be at least 8 characters.",
      };
    }
    if (PLACEHOLDER_RE.test(frontTrimmed) || PLACEHOLDER_RE.test(backTrimmed)) {
      return {
        code: "flashcard_guardrail_placeholder_text",
        error:
          "Flashcard contains placeholder or stub text (todo, lorem ipsum, example answer, etc.). Remove or replace before publishing.",
      };
    }
  }

  if (input.exam) {
    if (PLACEHOLDER_RE.test(input.exam.rationaleCorrect)) {
      return {
        code: "flashcard_guardrail_placeholder_rationale",
        error: "Correct rationale contains placeholder text. Provide a substantive clinical explanation.",
      };
    }
    if (isGenericRationaleText(input.exam.rationaleCorrect)) {
      return {
        code: "flashcard_guardrail_generic_rationale",
        error: "Correct rationale is generic or placeholder-like. Provide a simple explanation of the exam thought process.",
      };
    }
    const shortDistractorRationale = input.exam.rationaleIncorrect.find((d) => d.rationale.trim().length < 16);
    if (shortDistractorRationale) {
      return {
        code: "flashcard_guardrail_distractor_rationale_too_short",
        error: `Distractor rationale for option ${shortDistractorRationale.letter} is too short (< 16 chars). Each wrong-answer explanation needs at least one teaching sentence.`,
      };
    }
    const placeholderDistractor = input.exam.rationaleIncorrect.find((d) => PLACEHOLDER_RE.test(d.rationale));
    if (placeholderDistractor) {
      return {
        code: "flashcard_guardrail_distractor_placeholder",
        error: `Distractor rationale for option ${placeholderDistractor.letter} contains placeholder text.`,
      };
    }
    const genericDistractor = input.exam.rationaleIncorrect.find((d) => isGenericRationaleText(d.rationale));
    if (genericDistractor) {
      return {
        code: "flashcard_guardrail_generic_distractor_rationale",
        error: `Distractor rationale for option ${genericDistractor.letter} is generic or placeholder-like.`,
      };
    }
  }

  return null;
}

/**
 * Server-side content gates for flashcard **creation** (admin API, promote, AI drafts, sync/import scripts).
 * Complements tier/pathway query filters — invalid combinations are rejected before insert, not only hidden in lists.
 */
export function validateFlashcardCreationGuardrails(
  input: FlashcardCreationGuardrailInput,
): { ok: true } | { ok: false; code: string; error: string } {
  const blob = collectBlob(input);

  // Universal checks run first regardless of tier.
  const universal = universalViolations(input);
  if (universal) return { ok: false, ...universal };

  if (input.tier === "PRE_NURSING") {
    const v = preNursingViolations(blob);
    if (v) return { ok: false, ...v };
    return { ok: true };
  }

  /** Licensed RN/NP exam prep — requires clinical reasoning + teaching rationale (not query filters alone). */
  if (input.tier === "RN" || input.tier === "NP") {
    // CNPLE content violations are hard-blocked regardless of clinical reasoning quality.
    if (input.tier === "NP") {
      const c = cnpleViolations(blob);
      if (c) return { ok: false, ...c };
    }
    if (input.exam) {
      const e = rnNpExamSatisfies(input.exam);
      if (!e.ok) return e;
    } else {
      const l = rnNpLegacySatisfies(input.front, input.back);
      if (!l.ok) return l;
    }
    return { ok: true };
  }

  return { ok: true };
}

/**
 * Lightweight check for a single published card row (used by content audit scripts).
 * Does not enforce tier-specific rules — only checks for obvious quality gaps.
 */
export function auditPublishedCard(card: {
  id: string;
  front: string;
  back: string;
  examItemKind: string | null;
  questionStem: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: unknown;
}): { cardId: string; issues: string[] } {
  const issues: string[] = [];

  if ((card.front ?? "").trim().length < 8) issues.push("front_too_short");
  if ((card.back ?? "").trim().length < 8) issues.push("back_too_short");
  if (PLACEHOLDER_RE.test(card.front ?? "") || PLACEHOLDER_RE.test(card.back ?? "")) issues.push("placeholder_text");

  if (card.examItemKind) {
    if (!card.questionStem || card.questionStem.trim().length < 8) issues.push("missing_question_stem");
    if (!card.rationaleCorrect || card.rationaleCorrect.trim().length < 8) issues.push("missing_correct_rationale");
    if (isGenericRationaleText(card.rationaleCorrect)) issues.push("generic_correct_rationale");
    const inc = Array.isArray(card.rationaleIncorrect) ? card.rationaleIncorrect : [];
    if (inc.length === 0) issues.push("missing_distractor_rationales");
    for (const d of inc as Array<{ letter?: string; rationale?: string }>) {
      if ((d.rationale ?? "").trim().length < 8) {
        issues.push(`short_distractor_rationale_${d.letter ?? "?"}`);
      }
      if (isGenericRationaleText(d.rationale)) {
        issues.push(`generic_distractor_rationale_${d.letter ?? "?"}`);
      }
    }
  }

  return { cardId: card.id, issues };
}
