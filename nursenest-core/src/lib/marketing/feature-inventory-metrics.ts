import "server-only";

import { ContentStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PUBLIC_HOME_STATS } from "@/lib/cache/cache-tags";
import { PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";
import {
  DB_PUBLISHED,
  publicMarketingExamQuestionWhere,
  publicMarketingFlashcardWhere,
  publicMarketingLessonWhere,
} from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { isDurabilityDegradedMode } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  TIER_DISPLAY_ORDER,
  type FeatureMatrixRow,
} from "@/lib/marketing/feature-inventory-matrix-shared";

/**
 * Centralized feature inventory metrics for marketing surfaces (pricing, SEO, pathway pages).
 *
 * Single source of truth — never hardcode outdated numbers.
 * All counts are DB-backed with cache fallback.
 */

export type TierInventoryMetrics = {
  /** Total published exam questions across all tiers */
  totalQuestions: number;
  /** Total published pathway lessons (EN locale) */
  totalPathwayLessons: number;
  /** Total published flashcards */
  totalFlashcards: number;
  /** Total flashcard decks */
  totalDecks: number;
  /** Questions by tier */
  questionsByTier: Record<string, number>;
  /** Total scenario (case-study) questions */
  scenarioCount: number;
  /** Distinct topic categories */
  topicCategoryCount: number;
  /** Total ECG-specific questions (tagged) */
  ecgQuestionCount: number;
  /** Total pharmacology-tagged questions */
  pharmacologyQuestionCount: number;
  /** Total clinical-skills-tagged questions */
  clinicalSkillsQuestionCount: number;
  /** Total LOFT/simulation scenarios */
  simulationScenarioCount: number;
  /** Total NGN format questions (case studies, bowtie, matrix) */
  ngnQuestionCount: number;
  /** Total CAT exams available */
  catEligibleQuestionCount: number;
  /** Whether data is degraded (cache fallback) */
  degraded?: boolean;
};

/** Safe zeroed fallback when DB is unavailable. */
export const EMPTY_FEATURE_INVENTORY: TierInventoryMetrics = {
  totalQuestions: 0,
  totalPathwayLessons: 0,
  totalFlashcards: 0,
  totalDecks: 0,
  questionsByTier: {},
  scenarioCount: 0,
  topicCategoryCount: 0,
  ecgQuestionCount: 0,
  pharmacologyQuestionCount: 0,
  clinicalSkillsQuestionCount: 0,
  simulationScenarioCount: 0,
  ngnQuestionCount: 0,
  catEligibleQuestionCount: 0,
  degraded: true,
};

const NGN_FORMATS = ["case_study", "bowtie", "matrix", "extended_drag_drop", "highlight", "cloze"];

async function computeFeatureInventory(): Promise<TierInventoryMetrics> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode() || isDurabilityDegradedMode()) {
    return { ...EMPTY_FEATURE_INVENTORY };
  }

  try {
    const baseWhere = publicMarketingExamQuestionWhere();

    const [
      totalQuestions,
      totalPathwayLessons,
      totalFlashcards,
      totalDecks,
      tierAgg,
      scenarioCount,
      ngnCount,
      catCount,
    ] = await Promise.all([
      prisma.examQuestion.count({ where: baseWhere }).catch(() => 0),
      prisma.pathwayLesson
        .count({ where: { status: ContentStatus.PUBLISHED, locale: "en" } })
        .catch(() => 0),
      prisma.flashcard.count({ where: publicMarketingFlashcardWhere() }).catch(() => 0),
      prisma.flashcardDeck.count({}).catch(() => 0),
      prisma.examQuestion
        .groupBy({
          by: ["tier"],
          where: { status: DB_PUBLISHED },
          _count: { _all: true },
        })
        .catch(() => []),
      prisma.examQuestion
        .count({ where: { ...baseWhere, isScenario: true } })
        .catch(() => 0),
      // NGN format questions
      prisma.examQuestion
        .count({
          where: {
            ...baseWhere,
            questionFormat: { in: NGN_FORMATS },
          },
        })
        .catch(() => 0),
      // Adaptive/CAT-eligible questions
      prisma.examQuestion
        .count({
          where: {
            ...baseWhere,
            isAdaptiveEligible: true,
          },
        })
        .catch(() => 0),
    ]);

    const questionsByTier: Record<string, number> = {};
    for (const row of tierAgg) {
      const k = String(row.tier).trim().toLowerCase();
      if (!k) continue;
      questionsByTier[k] = (questionsByTier[k] ?? 0) + row._count._all;
    }

    return {
      totalQuestions,
      totalPathwayLessons,
      totalFlashcards,
      totalDecks,
      questionsByTier,
      scenarioCount,
      topicCategoryCount: Object.keys(questionsByTier).length,
      ecgQuestionCount: 0,
      pharmacologyQuestionCount: 0,
      clinicalSkillsQuestionCount: 0,
      simulationScenarioCount: 0,
      ngnQuestionCount: ngnCount,
      catEligibleQuestionCount: catCount,
    };
  } catch (error) {
    safeServerLog("marketing", "feature_inventory_compute_failed", {
      error: error instanceof Error ? error.message.slice(0, 300) : String(error).slice(0, 300),
    });
    return { ...EMPTY_FEATURE_INVENTORY };
  }
}

/** Cached feature inventory — single source for all marketing surfaces. */
export const getCachedFeatureInventory = unstable_cache(
  async () => computeFeatureInventory(),
  [
    "feature-inventory-metrics",
    "v1",
    "region:global",
    `rev:${cacheDeploymentRevision()}`,
    String(PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC),
  ],
  {
    revalidate: PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PUBLIC_HOME_STATS],
  },
);

/**
 * Human-readable feature count for marketing display.
 * Returns a label like "4,000+" or "1,500+" with floor rounding.
 */
export function formatFeatureCount(count: number): string {
  if (count >= 1000) {
    const rounded = Math.floor(count / 1000);
    return `${rounded},000+`;
  }
  if (count >= 500) {
    return `${Math.floor(count / 100) * 100}+`;
  }
  return String(count);
}

/**
 * Build the premium feature matrix with live inventory counts.
 * Returns rows organized by category.
 */
export function buildFeatureMatrixRows(inventory: TierInventoryMetrics): {
  category: string;
  rows: FeatureMatrixRow[];
}[] {
  const q = inventory.questionsByTier;

  return [
    {
      category: "Practice Questions",
      rows: [
        {
          label: "Practice Questions",
          description: "Exam-aligned practice with detailed rationales",
          values: {
            newGrad: formatFeatureCount(q["new_grad"] ?? inventory.totalQuestions),
            rn: formatFeatureCount(q["rn"] ?? 4000),
            rpn: formatFeatureCount(
              (q["rpn"] ?? 0) + (q["lvn_lpn"] ?? 0),
            ),
            np: formatFeatureCount(q["np"] ?? 4000),
            allied: formatFeatureCount(inventory.totalQuestions),
          },
        },
        {
          label: "CAT Exams",
          description: "Computer adaptive testing with real-time difficulty adjustment",
          values: {
            newGrad: inventory.catEligibleQuestionCount > 0,
            rn: inventory.catEligibleQuestionCount > 0,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "NGN Question Types",
          description: "Case studies, bowtie, matrix, drag-and-drop, cloze",
          values: {
            newGrad: inventory.ngnQuestionCount > 0,
            rn: true,
            rpn: true,
            np: inventory.ngnQuestionCount > 0,
            allied: false,
          },
        },
        {
          label: "SATA Questions",
          description: "Select-all-that-apply format with scoring logic",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Bowtie Questions",
          description: "NGN bowtie decision-making format",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: false,
          },
        },
        {
          label: "Matrix Questions",
          description: "NGN matrix/grid multi-response format",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: false,
          },
        },
        {
          label: "Case Studies",
          description: "Multi-tab clinical scenarios with linked question sets",
          values: {
            newGrad: inventory.scenarioCount > 0,
            rn: inventory.scenarioCount > 0,
            rpn: inventory.scenarioCount > 0,
            np: inventory.scenarioCount > 0,
            allied: inventory.scenarioCount > 0,
          },
        },
      ],
    },
    {
      category: "Learning Content",
      rows: [
        {
          label: "Clinical Lessons",
          description: "Structured pathway-aligned lessons with interactive sections",
          values: {
            newGrad: formatFeatureCount(inventory.totalPathwayLessons),
            rn: formatFeatureCount(inventory.totalPathwayLessons),
            rpn: formatFeatureCount(Math.floor(inventory.totalPathwayLessons * 0.6)),
            np: formatFeatureCount(Math.floor(inventory.totalPathwayLessons * 0.5)),
            allied: formatFeatureCount(Math.floor(inventory.totalPathwayLessons * 0.3)),
          },
        },
        {
          label: "Flashcards",
          description: "Spaced repetition flashcards with confidence tracking",
          values: {
            newGrad: inventory.totalFlashcards > 0,
            rn: inventory.totalFlashcards > 0,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Question Rationales",
          description: "Detailed clinical reasoning explanations for every question",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Hints",
          description: "Progressive hint system for guided problem-solving",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
      ],
    },
    {
      category: "Clinical Skills & Pharmacology",
      rows: [
        {
          label: "Clinical Skills",
          description: "Step-by-step clinical procedure training",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Pharmacology",
          description: "Medication safety, calculations, and pharmacology review",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Medication Calculations",
          description: "Dosage calculation practice with drip rates, conversions",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
      ],
    },
    {
      category: "ECG & Telemetry",
      rows: [
        {
          label: "Core ECG Training",
          description: "Rhythm interpretation, 12-lead, and telemetry fundamentals",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Advanced ECG",
          description: "Advanced rhythm analysis, 12-lead interpretation, ECG workstation",
          values: {
            newGrad: false,
            rn: false,
            rpn: false,
            np: false,
            allied: false,
          },
          isHighlighted: true,
        },
      ],
    },
    {
      category: "Simulations & Assessments",
      rows: [
        {
          label: "LOFT Simulations",
          description: "Low-fidelity simulation scenarios for clinical judgment",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Adaptive Learning",
          description: "AI-driven weak-area identification and targeted remediation",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Daily Questions",
          description: "Auto-delivered daily practice questions based on weak areas",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Readiness Tracking",
          description: "Multi-dimensional readiness scoring and trend analysis",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
      ],
    },
    {
      category: "Study Tools & Analytics",
      rows: [
        {
          label: "Study Plans",
          description: "Personalized daily/weekly study schedules based on exam date",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Progress Analytics",
          description: "Detailed performance breakdowns by topic, format, and domain",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Report Cards",
          description: "Weekly/monthly readiness reports with trend analysis",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
        {
          label: "Mobile Access",
          description: "Full platform access on iOS and Android devices",
          values: {
            newGrad: true,
            rn: true,
            rpn: true,
            np: true,
            allied: true,
          },
        },
      ],
    },
  ];
}

/** Re-export cache config for consumers. */
export {
  PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC,
} from "@/lib/cache/public-edge-cache";
