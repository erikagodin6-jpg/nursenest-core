import type { FlashcardItemKind, TierCode } from "@prisma/client";

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
  if (!EXAM_RATIONALE_TEACHING.test(exam.rationaleCorrect)) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_rationale_markers",
      error:
        "RN/NP exam-style cards must include teaching rationale language in the correct-option explanation (e.g. because, therefore, risk/priority framing, or why the option is safest or most urgent).",
    };
  }
  const shortDistractor = exam.rationaleIncorrect.find((d) => d.rationale.trim().length < 24);
  if (shortDistractor) {
    return {
      ok: false,
      code: "flashcard_guardrail_rn_np_distractor_rationale",
      error: "RN/NP exam-style cards need a short teaching rationale for each distractor (unsafe or less-correct option).",
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

/**
 * Server-side content gates for flashcard **creation** (admin API, promote, AI drafts, sync/import scripts).
 * Complements tier/pathway query filters — invalid combinations are rejected before insert, not only hidden in lists.
 */
export function validateFlashcardCreationGuardrails(
  input: FlashcardCreationGuardrailInput,
): { ok: true } | { ok: false; code: string; error: string } {
  const blob = collectBlob(input);

  if (input.tier === "PRE_NURSING") {
    const v = preNursingViolations(blob);
    if (v) return { ok: false, ...v };
    return { ok: true };
  }

  /** Licensed RN/NP exam prep — requires clinical reasoning + teaching rationale (not query filters alone). */
  if (input.tier === "RN" || input.tier === "NP") {
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
