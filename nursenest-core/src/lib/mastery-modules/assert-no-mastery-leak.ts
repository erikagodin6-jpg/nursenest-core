/**
 * Mastery Leak Guard
 *
 * Call assertNoMasteryLeak() in CAT / practice / flashcards / homepage / SEO
 * loader paths whenever a mastery module type could accidentally be loaded.
 * The guard throws immediately so the leak surfaces as a test failure rather
 * than silently contaminating learner pools.
 */

export type MasteryLeakSource = "CAT" | "practice" | "flashcards" | "homepage" | "seo";

export type MasteryLeakContext = {
  /** Where the potential leak is occurring */
  source: MasteryLeakSource;
  /**
   * The moduleType value from a Prisma row or registry entry.
   * Pass null / undefined to indicate no mastery module is present — the guard
   * will NOT throw in that case.
   */
  moduleType?: string | null;
};

/**
 * Throw if a mastery module type leaks into a non-preview learner surface.
 *
 * @example
 * // In a CAT pool builder
 * for (const question of questions) {
 *   assertNoMasteryLeak({ source: "CAT", moduleType: question.moduleType });
 * }
 */
export function assertNoMasteryLeak(context: MasteryLeakContext): void {
  if (context.moduleType) {
    throw new Error(
      `[MASTERY_LEAK_BLOCKED] moduleType=${context.moduleType} source=${context.source}`,
    );
  }
}

/**
 * Exhaustive list of all mastery module types that must be excluded from
 * CAT, practice, flashcards, homepage, SEO, sitemap, and pricing surfaces.
 *
 * Add new module types here as they are registered.
 */
export const MASTERY_EXCLUDED_MODULE_TYPES = [
  "ecg",
  "lab-values",
  "abg",
  "ventilator-management",
  "oxygen-delivery",
  "respiratory-distress",
  "iv-infusion-safety",
  "neuro-stroke-recognition",
  "trauma-triage",
  "advanced-lab-interpretation",
  "pharmacy",
  "functional-assessment",
  "msk-rehab",
  "image-recognition",
  "cardiac-pattern-recognition",
  "emergency-pattern-recognition",
  "movement-injury-mechanics",
  "functional-assessment-adl-safety",
] as const;

export type MasteryExcludedModuleType = (typeof MASTERY_EXCLUDED_MODULE_TYPES)[number];

/**
 * Prisma-compatible NOT filter fragment.
 * Inject into any query that touches questions, modules, or scenarios to
 * ensure no mastery content leaks into public pools.
 *
 * @example
 * await prisma.question.findMany({
 *   where: {
 *     ...MASTERY_EXCLUSION_WHERE,
 *     isActive: true,
 *   },
 * });
 */
export const MASTERY_EXCLUSION_WHERE = {
  NOT: {
    moduleType: {
      in: MASTERY_EXCLUDED_MODULE_TYPES as unknown as string[],
    },
  },
  isPublic: true,
  adminPreviewOnly: false,
} as const;
