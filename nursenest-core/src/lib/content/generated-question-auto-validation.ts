import { QuestionType } from "@prisma/client";

/** Subset of {@link NormalizedQuestionDraft} — kept local to avoid circular imports. */
export type GeneratedQuestionDraftShape = {
  stem: string;
  rationale: string;
  options: string[];
  answerKey: string[];
  questionType: QuestionType;
  topicTag?: string;
  metadata?: { tags?: string[] };
};

/** Max stems to compare per validation (bounded work, no DB). */
export const NEAR_DUP_MAX_PRIOR = 48;

/** Bigram Jaccard ≥ this ⇒ near-duplicate rejection. */
export const NEAR_DUP_JACCARD_THRESHOLD = 0.86;

export type GeneratedQuestionExpectedTags = {
  /** Job/topic line item label (batch) or request topic. */
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tier: string;
  exam: string;
};

export type GeneratedQuestionAutoValidationResult = {
  passed: boolean;
  /** Blocking reasons (same semantics as draft `errors`). */
  rejectionReasons: string[];
  /** Non-blocking hints. */
  warnings: string[];
};

const PATIENT_CONTEXT_RE =
  /\b(patient|client|resident|infant|neonate|toddler|adolescent|adult|elderly|woman|man|male|female|child|year-old|\d+\s*yo|y\.?o\.?|vital|vitals|bp\b|hr\b|rr\b|spo2|temp\b|prescribed|ordered|administered|admits|reports|c\/o|complains|history|medical record|assessment|diagnosis|dx\b|lab\b|laboratory|cbc\b|bun\b|creatinine|medication|mg\b|mcg\b|units?\b|iv\b|po\b|prn\b|nurse notes|postop|preop)\b/i;

const ABSTRACT_STEM_RE =
  /^(which of the following (best )?defines|what is the definition of|the term .{0,80} refers to|select the (correct )?definition)\b/i;

const RECALL_ONLY_STEM_RE =
  /\bwhich of the following (is (a |the )?)?(characteristic|definition|sign|symptom|effect|description) of\b/i;

const RATIONALE_REASONING_RE =
  /\b(because|therefore|thus|since|priorit|first action|next step|assessment|intervention|indicates|suggests|leads to|risk for|contraindicat|monitor|evaluate)\b/i;

const BANNED_OPTION_RE = /\b(all of the above|none of the above|both a and b|both b and a|a and b are correct)\b/i;

function normalizeForSimilarity(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

function bigrams(s: string): Set<string> {
  const pad = ` ${s} `;
  const out = new Set<string>();
  for (let i = 0; i < pad.length - 1; i++) out.add(pad.slice(i, i + 2));
  return out;
}

/** Exported for tests — cheap similarity, O(alphabet) per string length. */
export function stemBigramJaccard(a: string, b: string): number {
  const A = bigrams(normalizeForSimilarity(a));
  const B = bigrams(normalizeForSimilarity(b));
  if (A.size === 0 && B.size === 0) return 1;
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) {
    if (B.has(x)) inter++;
  }
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function resolveTopic(n: GeneratedQuestionDraftShape, expected?: GeneratedQuestionExpectedTags): string {
  const fromDraft = (n.topicTag ?? n.metadata?.tags?.[0] ?? "").trim();
  if (fromDraft.length >= 2) return fromDraft;
  return (expected?.topic ?? "").trim();
}

function tagsBlob(n: GeneratedQuestionDraftShape): string {
  const tags = n.metadata?.tags ?? [];
  return `${tags.join(" ")} ${n.stem}`.toLowerCase();
}

/**
 * Automated validation for AI-generated exam items before they enter review/bank.
 * Heuristic, bounded CPU; optional `priorNormalizedStems` is caller-provided (e.g. same batch), never a full DB scan.
 */
export function validateGeneratedQuestionAuto(
  n: GeneratedQuestionDraftShape,
  opts: {
    expectedTags?: GeneratedQuestionExpectedTags;
    /** Normalized-for-similarity stems from the same run/batch (capped by caller). */
    priorNormalizedStems?: string[];
  } = {},
): GeneratedQuestionAutoValidationResult {
  const rejectionReasons: string[] = [];
  const warnings: string[] = [];

  const stem = n.stem.trim();
  if (stem.length < 12) {
    rejectionReasons.push("Structure: stem is missing or too short for a clinical item.");
  }

  const optsLen = n.options.length;
  if (n.questionType === QuestionType.MCQ || n.questionType === QuestionType.SATA) {
    if (optsLen < 4) {
      rejectionReasons.push(
        `Structure: need at least four answer choices for bank ${n.questionType} items (got ${optsLen}).`,
      );
    }
  }

  const rationale = n.rationale.trim();
  if (rationale.length < 40) {
    rejectionReasons.push(
      "Structure: rationale is too short — expand with teaching appropriate for the exam level (minimum ~40 characters).",
    );
  }

  if (!n.answerKey?.length || n.answerKey.every((x) => !String(x).trim())) {
    rejectionReasons.push("Structure: correct answer is missing or empty.");
  }

  if (n.questionType === QuestionType.SATA && n.answerKey.length < 2) {
    rejectionReasons.push("Structure: SATA items should identify at least two correct selections for typical NCLEX-style items.");
  }

  const combinedClinical = `${stem}\n${rationale}`;
  if (!PATIENT_CONTEXT_RE.test(combinedClinical)) {
    rejectionReasons.push(
      "Clinical realism: add concrete patient or care context (scenario, findings, orders, or assessment cues) — avoid definition-only stems.",
    );
  }

  if (ABSTRACT_STEM_RE.test(stem)) {
    rejectionReasons.push("Clinical realism: stem reads like a textbook definition; rewrite around a client scenario or clinical presentation.");
  }

  if (stem.length < 90 && RECALL_ONLY_STEM_RE.test(stem) && !PATIENT_CONTEXT_RE.test(stem)) {
    rejectionReasons.push(
      "Difficulty: item looks like pure recall without clinical prioritization or application — add context that requires judgment.",
    );
  }

  if (rationale.length >= 40 && !RATIONALE_REASONING_RE.test(rationale) && rationale.split(/\s+/).length < 55) {
    rejectionReasons.push(
      "Difficulty: rationale should explain reasoning (e.g. pathophysiology, priority framework, or why options are wrong), not only restate the answer.",
    );
  }

  const seen = new Set<string>();
  for (let i = 0; i < n.options.length; i++) {
    const raw = String(n.options[i] ?? "").trim();
    if (raw.length < 2) {
      rejectionReasons.push(`Distractor quality: option ${i + 1} is too short or empty.`);
      continue;
    }
    if (BANNED_OPTION_RE.test(raw)) {
      rejectionReasons.push(`Distractor quality: option ${i + 1} uses a banned pattern (“all/none of the above”).`);
    }
    const fold = raw.toLowerCase();
    if (seen.has(fold)) {
      rejectionReasons.push(`Distractor quality: duplicate or near-identical answer choices (option ${i + 1}).`);
    }
    seen.add(fold);
  }

  const priors = (opts.priorNormalizedStems ?? []).slice(-NEAR_DUP_MAX_PRIOR);
  const normStem = normalizeForSimilarity(stem);
  for (const p of priors) {
    if (!p || !normStem) continue;
    const j = stemBigramJaccard(p, normStem);
    if (j >= NEAR_DUP_JACCARD_THRESHOLD) {
      rejectionReasons.push(
        `Duplication: stem is too similar to another item in this batch (similarity ${j.toFixed(2)} ≥ ${NEAR_DUP_JACCARD_THRESHOLD}).`,
      );
      break;
    }
  }

  const ex = opts.expectedTags;
  const topicResolved = resolveTopic(n, ex);
  if (topicResolved.length < 2) {
    rejectionReasons.push("Tags: topic is missing — set a topic tag on the item or provide topic in the generation request.");
  }

  if (ex) {
    const tier = (ex.tier ?? "").trim();
    const exam = (ex.exam ?? "").trim();
    if (!tier) rejectionReasons.push("Tags: tier is missing from generation context.");
    if (!exam) rejectionReasons.push("Tags: exam is missing from generation context.");

    const sub = (ex.subtopic ?? "").trim();
    if (sub.length >= 2 && !tagsBlob(n).includes(sub.toLowerCase())) {
      rejectionReasons.push(
        `Tags: subtopic “${sub.slice(0, 80)}” was required but does not appear in tags or stem.`,
      );
    }

    const body = (ex.bodySystem ?? "").trim();
    if (body.length >= 2 && !tagsBlob(n).includes(body.toLowerCase())) {
      rejectionReasons.push(
        `Tags: body system/domain “${body.slice(0, 80)}” was required but does not appear in tags or stem.`,
      );
    }
  }

  return {
    passed: rejectionReasons.length === 0,
    rejectionReasons,
    warnings,
  };
}

/** Normalize stem for storing in batch “prior stems” lists. */
export function normalizeGeneratedStemForNearDupList(stem: string): string {
  return normalizeForSimilarity(stem);
}
