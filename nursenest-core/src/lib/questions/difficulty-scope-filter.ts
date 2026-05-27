import { Prisma } from "@prisma/client";

export type QuestionDifficultyTier =
  | "tier1_foundational"
  | "tier2_clinical_judgment"
  | "tier3_advanced";

export type QuestionScopeClassification =
  | "nclex"
  | "rexpn"
  | "new_grad"
  | "icu"
  | "specialty"
  | "advanced_review";

export type QuestionAudienceClassification =
  | "standard_exam_prep"
  | "advanced_review"
  | "new_grad_transition"
  | "specialty_transition";

export type QuestionDifficultyScopeMode = "standard_exam_prep" | "advanced_review" | "all";

export type QuestionDifficultyScopeClassification = {
  difficultyTier: QuestionDifficultyTier;
  scope: QuestionScopeClassification;
  audience: QuestionAudienceClassification;
  reasons: readonly string[];
};

const STANDARD_EXAM_PREP_MAX_DIFFICULTY = 4;

const ADVANCED_SCOPE_TAGS = [
  "advanced",
  "advanced-review",
  "advanced_review",
  "tier3",
  "tier-3",
  "icu",
  "critical-care",
  "critical_care",
  "specialty",
  "new-grad",
  "new_grad",
  "ventilator",
  "mechanical-ventilation",
  "mechanical_ventilation",
  "vasopressor",
  "hemodynamics",
] as const;

const ADVANCED_SCOPE_TEXT_TERMS = [
  "intensive care",
  "critical care",
  "mechanically ventilated",
  "mechanical ventilation",
  "ventilator",
  "vent setting",
  "ventilator setting",
  "tidal volume",
  "peep",
  "plateau pressure",
  "arterial line",
  "central venous pressure",
  "swan-ganz",
  "pulmonary artery catheter",
  "vasopressor",
  "norepinephrine",
  "epinephrine infusion",
  "dopamine infusion",
  "titrated infusion",
  "titrated vasopressor",
  "invasive hemodynamic",
] as const;

export const QUESTION_DIFFICULTY_SCOPE_STANDARD_MAX_DIFFICULTY = STANDARD_EXAM_PREP_MAX_DIFFICULTY;
export const QUESTION_DIFFICULTY_SCOPE_ADVANCED_TAGS = ADVANCED_SCOPE_TAGS;
export const QUESTION_DIFFICULTY_SCOPE_ADVANCED_TEXT_TERMS = ADVANCED_SCOPE_TEXT_TERMS;

function stringContainsAny(value: string | null | undefined, terms: readonly string[]): boolean {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
}

function tagsContainAny(tags: readonly string[] | null | undefined, terms: readonly string[]): boolean {
  const normalized = new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean));
  return terms.some((term) => normalized.has(term));
}

export function classifyQuestionDifficultyScope(input: {
  difficulty?: number | null;
  tags?: readonly string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  questionType?: string | null;
  stem?: string | null;
}): QuestionDifficultyScopeClassification {
  const reasons: string[] = [];
  const difficulty = typeof input.difficulty === "number" && Number.isFinite(input.difficulty)
    ? Math.round(input.difficulty)
    : null;

  if (difficulty != null && difficulty >= 5) {
    reasons.push("difficulty_5");
  }
  if (tagsContainAny(input.tags, ADVANCED_SCOPE_TAGS)) {
    reasons.push("advanced_tag");
  }
  if (
    stringContainsAny(input.topic, ADVANCED_SCOPE_TEXT_TERMS) ||
    stringContainsAny(input.subtopic, ADVANCED_SCOPE_TEXT_TERMS) ||
    stringContainsAny(input.bodySystem, ADVANCED_SCOPE_TEXT_TERMS) ||
    stringContainsAny(input.questionType, ADVANCED_SCOPE_TEXT_TERMS) ||
    stringContainsAny(input.stem, ADVANCED_SCOPE_TEXT_TERMS)
  ) {
    reasons.push("advanced_text_signal");
  }

  if (reasons.length > 0) {
    const scope: QuestionScopeClassification =
      reasons.includes("advanced_tag") && tagsContainAny(input.tags, ["new-grad", "new_grad"])
        ? "new_grad"
        : stringContainsAny(input.topic, ["critical care", "intensive care"]) ||
            stringContainsAny(input.subtopic, ["critical care", "intensive care"]) ||
            stringContainsAny(input.stem, ["critical care", "intensive care", "mechanically ventilated", "ventilator"])
          ? "icu"
          : "advanced_review";
    return {
      difficultyTier: "tier3_advanced",
      scope,
      audience: scope === "new_grad" ? "new_grad_transition" : scope === "icu" ? "specialty_transition" : "advanced_review",
      reasons,
    };
  }

  return {
    difficultyTier: difficulty != null && difficulty <= 2 ? "tier1_foundational" : "tier2_clinical_judgment",
    scope: "nclex",
    audience: "standard_exam_prep",
    reasons: difficulty == null ? ["difficulty_unspecified_standard_scope"] : [`difficulty_${difficulty}`],
  };
}

function advancedScopePrismaOr(): Prisma.ExamQuestionWhereInput[] {
  const textFieldFilters = ADVANCED_SCOPE_TEXT_TERMS.flatMap((term) => [
    { topic: { contains: term, mode: "insensitive" as const } },
    { subtopic: { contains: term, mode: "insensitive" as const } },
    { bodySystem: { contains: term, mode: "insensitive" as const } },
    { questionType: { contains: term, mode: "insensitive" as const } },
    { stem: { contains: term, mode: "insensitive" as const } },
  ]);

  return [
    { difficulty: { gte: 5 } },
    { tags: { hasSome: [...ADVANCED_SCOPE_TAGS] } },
    ...textFieldFilters,
  ];
}

/**
 * Default learner-facing NCLEX/REx-PN pool gate.
 *
 * Keeps standard prep realistic by excluding Tier 3/specialty rows unless a
 * caller explicitly chooses an advanced-review scope.
 */
export function standardExamPrepQuestionScopeWhere(): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      { OR: [{ difficulty: null }, { difficulty: { lte: STANDARD_EXAM_PREP_MAX_DIFFICULTY } }] },
      { NOT: { OR: advancedScopePrismaOr() } },
    ],
  };
}

export function advancedReviewQuestionScopeWhere(): Prisma.ExamQuestionWhereInput {
  return { OR: advancedScopePrismaOr() };
}

export function questionDifficultyScopeWhereForMode(
  mode: QuestionDifficultyScopeMode,
): Prisma.ExamQuestionWhereInput | null {
  if (mode === "all") return null;
  if (mode === "advanced_review") return advancedReviewQuestionScopeWhere();
  return standardExamPrepQuestionScopeWhere();
}

export function parseQuestionDifficultyScopeMode(raw: string | null | undefined): QuestionDifficultyScopeMode {
  const normalized = raw?.trim().toLowerCase();
  if (normalized === "advanced" || normalized === "advanced_review" || normalized === "tier3") {
    return "advanced_review";
  }
  if (normalized === "all" || normalized === "unfiltered") return "all";
  return "standard_exam_prep";
}

export function standardExamPrepQuestionScopeSql(): Prisma.Sql {
  const textPatterns = ADVANCED_SCOPE_TEXT_TERMS.map((term) => `%${term}%`);
  return Prisma.sql`
    AND (difficulty IS NULL OR difficulty <= ${STANDARD_EXAM_PREP_MAX_DIFFICULTY})
    AND NOT EXISTS (
      SELECT 1 FROM unnest(coalesce(tags, '{}'::text[])) AS t(tag)
      WHERE lower(trim(t.tag)) IN (${Prisma.join([...ADVANCED_SCOPE_TAGS])})
    )
    AND NOT (
      lower(coalesce(topic, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(subtopic, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(body_system, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(question_type, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(stem, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
    )
  `;
}

export function advancedReviewQuestionScopeSql(): Prisma.Sql {
  const textPatterns = ADVANCED_SCOPE_TEXT_TERMS.map((term) => `%${term}%`);
  return Prisma.sql`
    AND (
      difficulty >= 5
      OR EXISTS (
        SELECT 1 FROM unnest(coalesce(tags, '{}'::text[])) AS t(tag)
        WHERE lower(trim(t.tag)) IN (${Prisma.join([...ADVANCED_SCOPE_TAGS])})
      )
      OR lower(coalesce(topic, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(subtopic, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(body_system, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(question_type, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
      OR lower(coalesce(stem, '')) LIKE ANY (ARRAY[${Prisma.join(textPatterns)}])
    )
  `;
}

export function questionDifficultyScopeSqlForMode(mode: QuestionDifficultyScopeMode): Prisma.Sql {
  if (mode === "all") return Prisma.empty;
  if (mode === "advanced_review") return advancedReviewQuestionScopeSql();
  return standardExamPrepQuestionScopeSql();
}
