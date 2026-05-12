import type { TierCode } from "@prisma/client";
import { ECG_MASTERY_PAID } from "@/lib/modules/module-entitlement-placeholders";

/**
 * Route levels (`basic` | `advanced`) are **technical** groupings today.
 * Product architecture distinguishes **Core ECG / telemetry learning** (integrated nursing education)
 * from the future **Advanced ECG & Telemetry Mastery** program (separate SKU). Reconcile routes + gates when shipping split entitlements — see `docs/ecg-module-integration.md`.
 */
export const ECG_LEVELS = ["basic", "advanced"] as const;
export const ECG_MODES = ["lesson", "quiz", "drill"] as const;
export const ECG_QUESTION_FORMAT = "ecg_video" as const;
export const ECG_PRINTABLE_CATEGORY_PREFIX = "ecg:" as const;
export const ECG_MASTERY_ENTITLEMENT = ECG_MASTERY_PAID;

export type EcgLevel = (typeof ECG_LEVELS)[number];
export type EcgMode = (typeof ECG_MODES)[number];
export type EcgRouteKind = "lessons" | "quizzes" | "worksheets" | "video-drills" | "scenarios";

export type EcgRouteConfig = {
  level: EcgLevel;
  kind: EcgRouteKind;
  questionMode?: EcgMode;
  title: string;
  subtitle: string;
  behaviors: string[];
};

export const ECG_ROUTE_CONFIGS: Record<string, EcgRouteConfig> = {
  "/modules/ecg/basic/lessons": {
    level: "basic",
    kind: "lessons",
    questionMode: "lesson",
    title: "Basic ECG lessons",
    subtitle: "Slower ECG clips with annotated explanations for rhythm recognition foundations.",
    behaviors: ["Slower videos", "Annotated explanations", "Guided rhythm recognition"],
  },
  "/modules/ecg/basic/quizzes": {
    level: "basic",
    kind: "quizzes",
    questionMode: "quiz",
    title: "Basic ECG quizzes",
    subtitle: "Practice rhythm identification with rationales, score summaries, and wrong-answer review.",
    behaviors: ["Show rationale", "Show percent correct", "Review wrong answers"],
  },
  "/modules/ecg/basic/worksheets": {
    level: "basic",
    kind: "worksheets",
    title: "Basic ECG worksheets",
    subtitle: "Printable PDFs for labeling ECG parts, identifying rhythms, and following guided prompts.",
    behaviors: ["Label ECG parts", "Identify rhythm", "Guided prompts"],
  },
  "/modules/ecg/advanced/lessons": {
    level: "advanced",
    kind: "lessons",
    questionMode: "lesson",
    title: "Advanced ECG lessons",
    subtitle: "Higher-complexity ECG interpretation with clinical reasoning emphasis.",
    behaviors: ["Clinical context", "Advanced rhythm patterns", "Priority response reasoning"],
  },
  "/modules/ecg/advanced/video-drills": {
    level: "advanced",
    kind: "video-drills",
    questionMode: "drill",
    title: "Advanced ECG video drills",
    subtitle: "Rapid ECG clip recognition with minimal hints and fast-answer flow.",
    behaviors: ["Autoplay clips", "Minimal hints", "Rapid answering"],
  },
  "/modules/ecg/advanced/scenarios": {
    level: "advanced",
    kind: "scenarios",
    questionMode: "lesson",
    title: "Advanced ECG scenarios",
    subtitle: "Clinical ECG cases with context such as chest pain, instability, and treatment priorities.",
    behaviors: ["Patient presents with chest pain...", "Clinical reasoning prompts", "Priority interventions"],
  },
  "/modules/ecg/advanced/worksheets": {
    level: "advanced",
    kind: "worksheets",
    title: "Advanced ECG worksheets",
    subtitle: "Printable multi-strip comparison and clinical reasoning prompts.",
    behaviors: ["Multi-strip comparison", "Clinical reasoning prompts", "Management priority review"],
  },
};

/**
 * Client-safe rollout signal for marketing hub tiles.
 * Defaults to TRUE when the env var is absent — consistent with isAdvancedEcgModuleEnabled.
 * Set NEXT_PUBLIC_ENABLE_ECG_MODULE=false to disable marketing surfaces in a specific env.
 */
export function isEcgModuleMarketingInventoryEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const pub = env.NEXT_PUBLIC_ENABLE_ECG_MODULE?.trim().toLowerCase();
  if (!pub) return true;
  return pub !== "false" && pub !== "0";
}

/**
 * Server-side ECG module gate.
 * Defaults to TRUE when the env var is absent — consistent with isAdvancedEcgModuleEnabled.
 * Set ENABLE_ECG_MODULE=false to disable module access in a specific env.
 */
export function isEcgModuleEnabled(env: Record<string, string | undefined> = process.env as Record<string, string | undefined>): boolean {
  const raw = env.ENABLE_ECG_MODULE?.trim().toLowerCase();
  if (!raw) return true;
  return raw !== "false" && raw !== "0";
}

export function normalizeEcgLevel(value: string | null | undefined): EcgLevel | null {
  const raw = value?.trim().toLowerCase();
  return raw === "basic" || raw === "advanced" ? raw : null;
}

export function normalizeEcgMode(value: string | null | undefined): EcgMode | null {
  const raw = value?.trim().toLowerCase();
  return raw === "lesson" || raw === "quiz" || raw === "drill" ? raw : null;
}

export function canAccessEcgModuleForTier(tier: TierCode | string | null | undefined): boolean {
  return tier === "RN" || tier === "NP";
}

export function assertNoEcgForRpn(tier: TierCode | string | null | undefined, pathwayId: string | null | undefined): void {
  const normalizedPathwayId = pathwayId?.trim().toLowerCase() ?? "";
  if (tier === "RPN" || normalizedPathwayId.includes("rex-pn")) {
    throw new Error("ECG module access is blocked for RPN and REx-PN pathways.");
  }
}

export function ecgQuestionTierFilterForTier(tier: TierCode | string | null | undefined): string[] {
  if (tier === "NP") return ["rn", "np"];
  if (tier === "RN") return ["rn"];
  return [];
}

export function ecgPrintableCategory(level: EcgLevel): string {
  return `${ECG_PRINTABLE_CATEGORY_PREFIX}${level}`;
}

export function ecgWorksheetCategoryWhere(level: EcgLevel): string[] {
  return [ecgPrintableCategory(level)];
}

export function isEcgQuestionExcludedFromCat(question: { questionFormat?: string | null; tags?: string[] | null }): boolean {
  if (question.questionFormat === ECG_QUESTION_FORMAT) return true;
  return Boolean(question.tags?.some((tag) => tag.trim().toLowerCase() === "ecg-video"));
}
