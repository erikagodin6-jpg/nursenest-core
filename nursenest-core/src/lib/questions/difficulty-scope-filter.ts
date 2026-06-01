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

export type LearnerStream =
  | "RPN"
  | "LPN"
  | "NCLEX_PN"
  | "REX_PN"
  | "RN"
  | "NCLEX_RN"
  | "NP"
  | "RT"
  | "ICU_NEW_GRAD"
  | "CRITICAL_CARE"
  | "ADVANCED_ACUTE_CARE"
  | "SPECIALTY_NURSING"
  | "ALLIED_HEALTH";

export type QuestionGovernanceMetadata = {
  profession: "nursing" | "nurse_practitioner" | "respiratory_therapy" | "allied_health";
  tier: "RPN_LPN" | "RN" | "NP" | "NEW_GRAD" | "ALLIED" | "SPECIALTY";
  specialty: string;
  acuity: "stable" | "moderate" | "high" | "critical";
  competencyLevel: "entry" | "clinical_judgment" | "advanced" | "provider" | "specialty";
  examBlueprint: string;
  allowedStreams: LearnerStream[];
  excludedStreams: LearnerStream[];
  isFoundationalSafe: boolean;
  reasons: readonly string[];
};

export type QuestionDifficultyScopeClassification = {
  difficultyTier: QuestionDifficultyTier;
  scope: QuestionScopeClassification;
  audience: QuestionAudienceClassification;
  reasons: readonly string[];
  governance: QuestionGovernanceMetadata;
};

const STANDARD_EXAM_PREP_MAX_DIFFICULTY = 4;

const SPECIALTY_SCOPE_TAGS = [
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
  "ventilator-management",
  "ventilator_management",
  "vasopressor",
  "vasopressor-titration",
  "vasopressor_titration",
  "hemodynamics",
  "invasive-hemodynamics",
  "invasive_hemodynamics",
  "ecmo",
  "crrt",
] as const;

const SPECIALTY_SCOPE_TEXT_TERMS = [
  "intensive care",
  "critical care",
  "icu",
  "mechanically ventilated",
  "ventilated patient",
  "mechanical ventilation",
  "ventilator",
  "adjust ventilator",
  "change ventilator",
  "titrate ventilator",
  "ventilator mode",
  "ventilator modes",
  "vent setting",
  "vent settings",
  "ventilator setting",
  "ventilator settings",
  "bipap setting",
  "bipap settings",
  "bipap pressure",
  "bipap pressures",
  "cpap pressure",
  "cpap pressures",
  "ipap",
  "epap",
  "pressure support",
  "tidal volume",
  "tidal volume setting",
  "peep",
  "peep adjustment",
  "adjust peep",
  "plateau pressure",
  "peak pressure",
  "peak inspiratory pressure",
  "pip",
  "lung compliance",
  "airway resistance",
  "static compliance",
  "dynamic compliance",
  "ventilator waveform",
  "ventilator waveforms",
  "waveform interpretation",
  "arterial line",
  "art line",
  "central venous pressure",
  "cvp",
  "swan-ganz",
  "pulmonary artery catheter",
  "pulmonary artery wedge",
  "wedge pressure",
  "cardiac index",
  "systemic vascular resistance",
  "svr",
  "vasopressor",
  "norepinephrine",
  "epinephrine infusion",
  "dopamine infusion",
  "phenylephrine infusion",
  "titrated infusion",
  "titrated vasopressor",
  "vasopressor titration",
  "titrate norepinephrine",
  "norepinephrine titration",
  "propofol infusion",
  "sedation protocol",
  "sedation titration",
  "invasive hemodynamic",
  "intracranial pressure",
  "icp monitoring",
  "intra-aortic balloon",
  "iabp",
  "ecmo",
  "continuous renal replacement",
  "crrt",
] as const;

const PROVIDER_SCOPE_TAGS = [
  "provider-level",
  "provider_level",
  "diagnosis",
  "differential-diagnosis",
  "differential_diagnosis",
  "prescribing",
  "np",
] as const;

const PROVIDER_SCOPE_TEXT_TERMS = [
  "specialist referral decision",
  "independent medical diagnosis",
  "differential diagnosis",
  "prescribe",
  "prescribing",
  "initiate antibiotic therapy",
  "order ct",
  "order imaging",
  "diagnostic workup",
] as const;

const ADVANCED_SCOPE_TAGS = [...SPECIALTY_SCOPE_TAGS, ...PROVIDER_SCOPE_TAGS] as const;
const ADVANCED_SCOPE_TEXT_TERMS = [...SPECIALTY_SCOPE_TEXT_TERMS, ...PROVIDER_SCOPE_TEXT_TERMS] as const;

export const QUESTION_DIFFICULTY_SCOPE_STANDARD_MAX_DIFFICULTY = STANDARD_EXAM_PREP_MAX_DIFFICULTY;
export const QUESTION_DIFFICULTY_SCOPE_ADVANCED_TAGS = ADVANCED_SCOPE_TAGS;
export const QUESTION_DIFFICULTY_SCOPE_ADVANCED_TEXT_TERMS = ADVANCED_SCOPE_TEXT_TERMS;
export const QUESTION_SCOPE_SPECIALTY_TAGS = SPECIALTY_SCOPE_TAGS;
export const QUESTION_SCOPE_SPECIALTY_TEXT_TERMS = SPECIALTY_SCOPE_TEXT_TERMS;
export const QUESTION_SCOPE_PROVIDER_TAGS = PROVIDER_SCOPE_TAGS;
export const QUESTION_SCOPE_PROVIDER_TEXT_TERMS = PROVIDER_SCOPE_TEXT_TERMS;

function stringContainsAny(value: string | null | undefined, terms: readonly string[]): boolean {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
}

function tagsContainAny(tags: readonly string[] | null | undefined, terms: readonly string[]): boolean {
  const normalized = new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean));
  return terms.some((term) => normalized.has(term));
}

function textContainsAny(input: {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  questionType?: string | null;
  stem?: string | null;
}, terms: readonly string[]): boolean {
  return (
    stringContainsAny(input.topic, terms) ||
    stringContainsAny(input.subtopic, terms) ||
    stringContainsAny(input.bodySystem, terms) ||
    stringContainsAny(input.questionType, terms) ||
    stringContainsAny(input.stem, terms)
  );
}

function questionGovernanceForClassification(input: {
  difficulty?: number | null;
  tags?: readonly string[] | null;
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  questionType?: string | null;
  stem?: string | null;
}, reasons: readonly string[]): QuestionGovernanceMetadata {
  const hasSpecialtySignal = reasons.includes("specialty_tag") || reasons.includes("specialty_text_signal");
  const hasProviderSignal = reasons.includes("provider_tag") || reasons.includes("provider_text_signal");
  const topic = input.topic?.trim() || input.subtopic?.trim() || input.bodySystem?.trim() || "general";
  const examBlueprint = input.bodySystem?.trim() || input.topic?.trim() || "general";
  const difficulty = typeof input.difficulty === "number" && Number.isFinite(input.difficulty)
    ? Math.round(input.difficulty)
    : 3;

  if (hasSpecialtySignal) {
    return {
      profession: stringContainsAny([input.topic, input.subtopic, input.bodySystem, input.stem].join(" "), [
        "ventilator",
        "bipap",
        "cpap pressure",
        "ipap",
        "epap",
        "plateau pressure",
        "peak pressure",
        "airway resistance",
        "lung compliance",
      ])
        ? "respiratory_therapy"
        : "nursing",
      tier: "SPECIALTY",
      specialty: stringContainsAny(topic, ["hemodynamic", "arterial line", "vasopressor"]) ? "critical-care" : "advanced-acute-care",
      acuity: "critical",
      competencyLevel: "specialty",
      examBlueprint: "specialty-advanced-clinical-judgment",
      allowedStreams: ["RT", "ICU_NEW_GRAD", "CRITICAL_CARE", "ADVANCED_ACUTE_CARE", "SPECIALTY_NURSING"],
      excludedStreams: ["RPN", "LPN", "NCLEX_PN", "REX_PN", "RN", "NCLEX_RN"],
      isFoundationalSafe: false,
      reasons,
    };
  }

  if (hasProviderSignal) {
    return {
      profession: "nurse_practitioner",
      tier: "NP",
      specialty: topic,
      acuity: difficulty >= 4 ? "high" : "moderate",
      competencyLevel: "provider",
      examBlueprint: "np-provider-level-management",
      allowedStreams: ["NP"],
      excludedStreams: ["RPN", "LPN", "NCLEX_PN", "REX_PN", "RN", "NCLEX_RN"],
      isFoundationalSafe: false,
      reasons,
    };
  }

  const tier: QuestionGovernanceMetadata["tier"] = difficulty <= 2 ? "RPN_LPN" : "RN";
  return {
    profession: "nursing",
    tier,
    specialty: topic,
    acuity: difficulty >= 4 ? "high" : difficulty >= 3 ? "moderate" : "stable",
    competencyLevel: difficulty >= 3 ? "clinical_judgment" : "entry",
    examBlueprint,
    allowedStreams:
      tier === "RPN_LPN"
        ? ["RPN", "LPN", "NCLEX_PN", "REX_PN", "RN", "NCLEX_RN"]
        : ["RN", "NCLEX_RN"],
    excludedStreams: tier === "RPN_LPN" ? [] : ["RPN", "LPN", "NCLEX_PN", "REX_PN"],
    isFoundationalSafe: true,
    reasons,
  };
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

  const hasSpecialtySignal =
    tagsContainAny(input.tags, SPECIALTY_SCOPE_TAGS) ||
    textContainsAny(input, SPECIALTY_SCOPE_TEXT_TERMS);
  const hasProviderSignal =
    tagsContainAny(input.tags, PROVIDER_SCOPE_TAGS) ||
    textContainsAny(input, PROVIDER_SCOPE_TEXT_TERMS);

  if (difficulty != null && difficulty >= 5) {
    reasons.push("difficulty_5");
  }
  if (tagsContainAny(input.tags, SPECIALTY_SCOPE_TAGS)) {
    reasons.push("specialty_tag");
  }
  if (tagsContainAny(input.tags, PROVIDER_SCOPE_TAGS)) {
    reasons.push("provider_tag");
  }
  if (textContainsAny(input, SPECIALTY_SCOPE_TEXT_TERMS)) {
    reasons.push("specialty_text_signal");
  }
  if (textContainsAny(input, PROVIDER_SCOPE_TEXT_TERMS)) {
    reasons.push("provider_text_signal");
  }

  if (hasSpecialtySignal || hasProviderSignal) {
    const scope: QuestionScopeClassification =
      reasons.includes("specialty_tag") && tagsContainAny(input.tags, ["new-grad", "new_grad"])
        ? "new_grad"
        : hasSpecialtySignal &&
            (stringContainsAny(input.topic, ["critical care", "intensive care"]) ||
              stringContainsAny(input.subtopic, ["critical care", "intensive care"]) ||
              stringContainsAny(input.stem, ["critical care", "intensive care", "mechanically ventilated", "ventilator"]))
          ? "icu"
          : hasProviderSignal && !hasSpecialtySignal
            ? "advanced_review"
          : "advanced_review";
    return {
      difficultyTier: "tier3_advanced",
      scope,
      audience: scope === "new_grad" ? "new_grad_transition" : scope === "icu" ? "specialty_transition" : "advanced_review",
      reasons,
      governance: questionGovernanceForClassification(input, reasons),
    };
  }

  return {
    difficultyTier:
      difficulty != null && difficulty <= 2
        ? "tier1_foundational"
        : difficulty != null && difficulty >= 5
          ? "tier3_advanced"
          : "tier2_clinical_judgment",
    scope: "nclex",
    audience: "standard_exam_prep",
    reasons: difficulty == null ? ["difficulty_unspecified_standard_scope"] : [`difficulty_${difficulty}`],
    governance: questionGovernanceForClassification(input, difficulty == null ? ["difficulty_unspecified_standard_scope"] : [`difficulty_${difficulty}`]),
  };
}

function textTermPrismaOr(terms: readonly string[]): Prisma.ExamQuestionWhereInput[] {
  return terms.flatMap((term) => [
    { topic: { contains: term, mode: "insensitive" as const } },
    { subtopic: { contains: term, mode: "insensitive" as const } },
    { bodySystem: { contains: term, mode: "insensitive" as const } },
    { questionType: { contains: term, mode: "insensitive" as const } },
    { stem: { contains: term, mode: "insensitive" as const } },
  ]);
}

function flashcardTextTermPrismaOr(terms: readonly string[]): Prisma.FlashcardWhereInput[] {
  return terms.flatMap((term) => [
    { front: { contains: term, mode: "insensitive" as const } },
    { back: { contains: term, mode: "insensitive" as const } },
    { questionStem: { contains: term, mode: "insensitive" as const } },
    { rationaleCorrect: { contains: term, mode: "insensitive" as const } },
    { deck: { title: { contains: term, mode: "insensitive" as const } } },
    { category: { name: { contains: term, mode: "insensitive" as const } } },
  ]);
}

function specialtyScopePrismaOr(): Prisma.ExamQuestionWhereInput[] {
  return [
    { tags: { hasSome: [...SPECIALTY_SCOPE_TAGS] } },
    ...textTermPrismaOr(SPECIALTY_SCOPE_TEXT_TERMS),
  ];
}

function providerScopePrismaOr(): Prisma.ExamQuestionWhereInput[] {
  return [
    { tags: { hasSome: [...PROVIDER_SCOPE_TAGS] } },
    ...textTermPrismaOr(PROVIDER_SCOPE_TEXT_TERMS),
  ];
}

function advancedScopePrismaOr(): Prisma.ExamQuestionWhereInput[] {
  return [...specialtyScopePrismaOr(), ...providerScopePrismaOr()];
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
      { NOT: { OR: advancedScopePrismaOr() } },
    ],
  };
}

export function standardExamPrepFlashcardScopeWhere(): Prisma.FlashcardWhereInput {
  return {
    NOT: {
      OR: [
        ...flashcardTextTermPrismaOr(SPECIALTY_SCOPE_TEXT_TERMS),
        ...flashcardTextTermPrismaOr(PROVIDER_SCOPE_TEXT_TERMS),
      ],
    },
  };
}

export function standardNursingQuestionScopeWhere(): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      { NOT: { OR: specialtyScopePrismaOr() } },
      { NOT: { OR: providerScopePrismaOr() } },
    ],
  };
}

export function npProviderQuestionScopeWhere(): Prisma.ExamQuestionWhereInput {
  return {
    NOT: { OR: specialtyScopePrismaOr() },
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
      EXISTS (
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

/**
 * NP scope gate (SQL twin of {@link npProviderQuestionScopeWhere}).
 *
 * Excludes only SPECIALTY tags (ICU, critical-care, ventilator-management, etc.) but allows
 * provider-level / advanced-review content — NP learners should see diagnostic, prescribing, and
 * differential-diagnosis questions that `standardExamPrepQuestionScopeSql` would exclude.
 *
 * Use instead of {@link standardExamPrepQuestionScopeSql} when `entitlement.tier === "NP"`.
 */
export function npProviderQuestionScopeSql(): Prisma.Sql {
  return Prisma.sql`
    AND NOT EXISTS (
      SELECT 1 FROM unnest(coalesce(tags, '{}'::text[])) AS t(tag)
      WHERE lower(trim(t.tag)) IN (${Prisma.join([...SPECIALTY_SCOPE_TAGS])})
    )
  `;
}
