/**
 * First-class exam context for NurseNest — use in APIs, UI, analytics, and content scoping.
 * @see exam-registry.ts — expands without assuming only US/Canada exist.
 */
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  buildExamPathwayRuntimeMetadata,
  type AcuityLevel,
  type ClinicalJudgmentLevel,
  type ExamType,
  type ExamUnitSystem,
  type NursingRole,
  type ScopeLevel,
} from "@/lib/exam-context/exam-pathway-metadata";
import type { QuestionDifficultyTier } from "@/lib/questions/difficulty-scope-filter";

/** ISO 3166-1 alpha-2 country code (extend as markets open: GB, AU, IN, …). */
export type ExamCountryCode = string;

/**
 * Short exam product code from the registry (e.g. REX_PN, NCLEX_PN, NCLEX_RN).
 * Not the same as DB `exam_questions.exam` string variants — map via pathway.contentExamKeys.
 */
export type ExamProductKey = string;

/**
 * Human-facing tier label for analytics and copy (not always identical to Prisma TierCode).
 */
export type ExamTierLabel = string;

/**
 * BCP-47 language tag (default `en`).
 */
export type ExamLanguageCode = string;

/**
 * Stable composite registry id: `${CountryCode}:${examKey}` e.g. `CA:REX_PN`, `US:NCLEX_PN`.
 */
export type ExamRegistryKey = `${string}:${string}`;

/** Clinical unit system for labs/vitals display (US customary vs SI / international). */
export type ExamMeasurementSystem = "US" | "SI";

export type GlobalExamContext = {
  /** ISO country */
  country: ExamCountryCode;
  /** Registry exam key (e.g. REX_PN) */
  exam: ExamProductKey;
  /** Display tier (RPN, RN, NP, …) */
  tier: ExamTierLabel;
  /** Learner / content locale */
  language: ExamLanguageCode;
  /** Canonical marketing pathway — primary join key for lessons & scoped pools */
  pathwayId: string;
  /** Composite registry lookup */
  registryKey: ExamRegistryKey;
  /** Terminology pack id (CANADA_PN, US_PN, …) */
  terminologyProfile: string;
  /** Blueprint / blueprint id for future CMS mapping */
  blueprintId: string;
  /** Labs/vitals formatting: US vs SI (derived from country; UK/AU → SI). */
  measurementSystem: ExamMeasurementSystem;
  /** Strict exam product type used for routing and content separation. */
  examType: ExamType;
  nursingRole: NursingRole;
  scopeLevel: ScopeLevel;
  /** Pathway-native unit system: conventional for US NCLEX, SI for Canadian pathways. */
  unitSystem: ExamUnitSystem;
  specialty: string | null;
  difficultyTier: QuestionDifficultyTier;
  clinicalJudgmentLevel: ClinicalJudgmentLevel;
  acuityLevel: AcuityLevel;
};

export class ExamContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExamContextError";
  }
}

/**
 * Strict flows must call this before rendering or querying scoped content.
 * Pass `pathwayId` from session / route / practice-test config — never invent silently.
 */
export function requireGlobalExamContext(
  ctx: Partial<GlobalExamContext> | null | undefined,
  label = "examContext",
): GlobalExamContext {
  if (!ctx || typeof ctx !== "object") {
    throw new ExamContextError(`${label} is required`);
  }
  const measurementSystem: ExamMeasurementSystem =
    ctx.measurementSystem === "US" || ctx.measurementSystem === "SI"
      ? ctx.measurementSystem
      : getMeasurementSystemForCountry(ctx.country);
  const pathway = ctx.pathwayId ? getExamPathwayById(ctx.pathwayId) ?? null : null;
  const runtime = pathway ? buildExamPathwayRuntimeMetadata(pathway) : null;
  const merged: GlobalExamContext = {
    ...(ctx as GlobalExamContext),
    measurementSystem,
    examType: (ctx as Partial<GlobalExamContext>).examType ?? runtime?.examType ?? "GENERIC",
    nursingRole: (ctx as Partial<GlobalExamContext>).nursingRole ?? runtime?.nursingRole ?? "RN",
    scopeLevel: (ctx as Partial<GlobalExamContext>).scopeLevel ?? runtime?.scopeLevel ?? "entry_level",
    unitSystem: (ctx as Partial<GlobalExamContext>).unitSystem ?? runtime?.unitSystem ?? (measurementSystem === "US" ? "CON" : "SI"),
    specialty: (ctx as Partial<GlobalExamContext>).specialty ?? runtime?.specialty ?? null,
    difficultyTier: (ctx as Partial<GlobalExamContext>).difficultyTier ?? runtime?.difficultyTier ?? "tier2_clinical_judgment",
    clinicalJudgmentLevel: (ctx as Partial<GlobalExamContext>).clinicalJudgmentLevel ?? runtime?.clinicalJudgmentLevel ?? "clinical_judgment",
    acuityLevel: (ctx as Partial<GlobalExamContext>).acuityLevel ?? runtime?.acuityLevel ?? "moderate",
  };
  const { country, exam, tier, language, pathwayId, registryKey, terminologyProfile, blueprintId } = merged;
  if (!country?.trim()) throw new ExamContextError(`${label}.country is required`);
  if (!exam?.trim()) throw new ExamContextError(`${label}.exam is required`);
  if (!tier?.trim()) throw new ExamContextError(`${label}.tier is required`);
  if (!language?.trim()) throw new ExamContextError(`${label}.language is required`);
  if (!pathwayId?.trim()) throw new ExamContextError(`${label}.pathwayId is required`);
  if (!registryKey?.trim()) throw new ExamContextError(`${label}.registryKey is required`);
  if (!terminologyProfile?.trim()) throw new ExamContextError(`${label}.terminologyProfile is required`);
  if (!blueprintId?.trim()) throw new ExamContextError(`${label}.blueprintId is required`);
  return merged;
}

/** Safe merge for analytics — omits event if context incomplete (never guess country). */
export function examContextAnalyticsProps(
  ctx: Partial<GlobalExamContext> | null | undefined,
): Record<string, string | undefined> {
  if (!ctx?.pathwayId?.trim() || !ctx.country?.trim() || !ctx.exam?.trim()) {
    return {};
  }
  const ms =
    ctx.measurementSystem === "US" || ctx.measurementSystem === "SI"
      ? ctx.measurementSystem
      : getMeasurementSystemForCountry(ctx.country);
  return {
    exam_country: ctx.country,
    exam_product: ctx.exam,
    exam_tier: ctx.tier,
    exam_language: ctx.language ?? "en",
    pathway_id: ctx.pathwayId,
    exam_registry_key: ctx.registryKey,
    terminology_profile: ctx.terminologyProfile,
    measurement_system: ms,
    exam_type: ctx.examType,
    nursing_role: ctx.nursingRole,
    scope_level: ctx.scopeLevel,
    unit_system: ctx.unitSystem,
    specialty: ctx.specialty ?? undefined,
    difficulty_tier: ctx.difficultyTier,
    clinical_judgment_level: ctx.clinicalJudgmentLevel,
    acuity_level: ctx.acuityLevel,
  };
}
