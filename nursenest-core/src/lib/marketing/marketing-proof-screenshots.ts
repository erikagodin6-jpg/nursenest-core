/**
 * Conversion-first marketing proof screenshots — maps features, tiers, and pages
 * to Playwright-generated WebP assets under public/marketing/generated-screenshots/.
 *
 * Theme targets: ~40% Ocean · ~35% Blossom · ~25% Midnight (see SCREENSHOT_SLOT_THEMES).
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { FlagshipExperienceId } from "@/lib/discovery/flagship-experiences";
import { isNewGradTransitionPathway } from "@/lib/marketing/is-new-grad-transition-pathway";
import { isPracticalNursingMarketingPathway } from "@/lib/marketing/is-practical-nursing-marketing-pathway";
import {
  GENERATED_SCREENSHOT_FALLBACKS,
  GENERATED_SCREENSHOT_PATHS,
} from "@/lib/marketing/generated-screenshot-registry";

export type MarketingProofTheme = "ocean" | "blossom" | "midnight";

export type MarketingProofShot = {
  /** Primary image path (prefers theme variant when available). */
  src: string;
  /** Secondary path if primary fails to load. */
  fallbackSrc: string;
  alt: string;
  theme: MarketingProofTheme;
};

const GENERATED_ROOT = "/marketing/generated-screenshots";

/** CDN slot → preferred capture theme for homepage carousel sync. */
export const SCREENSHOT_SLOT_THEMES: Record<number, MarketingProofTheme> = {
  1: "ocean",
  2: "blossom",
  3: "ocean",
  4: "ocean",
  5: "midnight",
  6: "midnight",
  7: "midnight",
  8: "blossom",
  9: "blossom",
  10: "ocean",
  11: "midnight",
  12: "blossom",
  13: "blossom",
  14: "ocean",
  15: "ocean",
};

/** Core capture key → default theme for marketing placement. */
const CORE_KEY_THEME: Record<string, MarketingProofTheme> = {
  "practice-rationale": "ocean",
  flashcards: "blossom",
  "learner-dashboard": "ocean",
  "question-bank-advanced": "ocean",
  "progress-report": "midnight",
  "cat-exam-session": "midnight",
  "cat-results": "midnight",
  "study-plan": "blossom",
  "smart-review": "blossom",
  "question-bank": "ocean",
  "confidence-analytics": "midnight",
  "lesson-detail": "blossom",
  "lesson-library": "blossom",
  "ecg-workstation": "ocean",
};

function themeVariantPath(coreKey: string, theme: MarketingProofTheme): string {
  return `${GENERATED_ROOT}/themes/${theme}/${coreKey}.webp`;
}

function corePath(coreKey: string, tier: "core" | "marketing" = "core"): string {
  return `${GENERATED_ROOT}/${tier}/${coreKey}.webp`;
}

/**
 * Resolve a core capture key to src/fallback, preferring theme variant when present on disk
 * is handled at runtime by MarketingProofScreenshot onError; paths are ordered theme → core.
 */
export function marketingProofFromCoreKey(
  coreKey: string,
  args: {
    alt: string;
    theme?: MarketingProofTheme;
    tier?: "core" | "marketing";
  },
): MarketingProofShot {
  const theme = args.theme ?? CORE_KEY_THEME[coreKey] ?? "ocean";
  const tier = args.tier ?? "core";
  return {
    src: themeVariantPath(coreKey, theme),
    fallbackSrc: corePath(coreKey, tier),
    alt: args.alt,
    theme,
  };
}

export function pathwayHubPrimaryProof(pathway: ExamPathwayDefinition): MarketingProofShot {
  if (isPracticalNursingMarketingPathway(pathway)) {
    return {
      src: GENERATED_SCREENSHOT_PATHS.pnMarketingHub,
      fallbackSrc: GENERATED_SCREENSHOT_FALLBACKS.pnMarketingHub,
      alt: "RPN and PN exam prep hub with lessons, practice, and CAT readiness on NurseNest",
      theme: "ocean",
    };
  }
  if (isNewGradTransitionPathway(pathway)) {
    return {
      src: GENERATED_SCREENSHOT_PATHS.newGradMarketingHub,
      fallbackSrc: GENERATED_SCREENSHOT_FALLBACKS.newGradMarketingHub,
      alt: "New graduate nursing transition hub with specialty prep and clinical confidence tools",
      theme: "blossom",
    };
  }
  switch (pathway.roleTrack) {
    case "rn":
      return {
        src: GENERATED_SCREENSHOT_PATHS.rnMarketingHub,
        fallbackSrc: GENERATED_SCREENSHOT_FALLBACKS.rnMarketingHub,
        alt: "NCLEX-RN study hub with lessons, NGN practice, CAT exams, and readiness analytics",
        theme: "ocean",
      };
    case "np":
      return {
        src: GENERATED_SCREENSHOT_PATHS.npMarketingHub,
        fallbackSrc: GENERATED_SCREENSHOT_FALLBACKS.npMarketingHub,
        alt: "NP and CNPLE preparation hub with advanced clinical reasoning and LOFT-style assessment",
        theme: "midnight",
      };
    case "allied":
      return {
        src: GENERATED_SCREENSHOT_PATHS.alliedMarketingHub,
        fallbackSrc: GENERATED_SCREENSHOT_FALLBACKS.alliedMarketingHub,
        alt: "Allied health profession-specific study hub with competency-focused practice",
        theme: "ocean",
      };
    default:
      return marketingProofFromCoreKey("learner-dashboard", {
        alt: "NurseNest learner dashboard with study progress and next steps",
        theme: "ocean",
      });
  }
}

export function pathwayHubSecondaryProofs(pathway: ExamPathwayDefinition): MarketingProofShot[] {
  if (pathway.roleTrack === "rn" && !isPracticalNursingMarketingPathway(pathway)) {
    return [
      marketingProofFromCoreKey("practice-rationale", {
        alt: "NCLEX-RN practice question with full rationale and teaching breakdown",
        theme: "ocean",
      }),
      marketingProofFromCoreKey("flashcards", {
        alt: "RN flashcard study session with active recall and spaced review",
        theme: "blossom",
      }),
      marketingProofFromCoreKey("cat-exam-session", {
        alt: "Adaptive CAT exam session with clinical question and progress bar",
        theme: "midnight",
      }),
    ];
  }
  if (isPracticalNursingMarketingPathway(pathway)) {
    return [
      marketingProofFromCoreKey("cat-exam-session", {
        alt: "PN adaptive exam session with foundational nursing questions",
        theme: "midnight",
      }),
      marketingProofFromCoreKey("flashcards", {
        alt: "PN flashcard review for scope-safe fundamentals",
        theme: "blossom",
      }),
    ];
  }
  if (pathway.roleTrack === "np") {
    return [
      marketingProofFromCoreKey("confidence-analytics", {
        alt: "NP readiness analytics and performance trends",
        theme: "midnight",
      }),
      marketingProofFromCoreKey("study-plan", {
        alt: "Adaptive NP study plan with focused review blocks",
        theme: "blossom",
      }),
    ];
  }
  if (pathway.roleTrack === "allied") {
    return [
      marketingProofFromCoreKey("lesson-library", {
        alt: "Allied health lesson library filtered by profession track",
        theme: "blossom",
      }),
      marketingProofFromCoreKey("question-bank", {
        alt: "Allied health practice questions scoped to profession competencies",
        theme: "ocean",
      }),
    ];
  }
  if (isNewGradTransitionPathway(pathway)) {
    return [
      marketingProofFromCoreKey("cat-results", {
        alt: "New grad readiness results with weak-area recommendations",
        theme: "midnight",
      }),
      marketingProofFromCoreKey("smart-review", {
        alt: "Smart review grouped by confidence for early-career reinforcement",
        theme: "blossom",
      }),
    ];
  }
  return [
    marketingProofFromCoreKey("practice-rationale", {
      alt: "Practice question with rationale on NurseNest",
      theme: "ocean",
    }),
  ];
}

/** Flagship pricing showcase cards — real product screenshots, not CSS mocks. */
export const FLAGSHIP_PROOF_SCREENSHOTS: Partial<Record<FlagshipExperienceId, MarketingProofShot>> = {
  "advanced-ecg": marketingProofFromCoreKey("ecg-workstation", {
    alt: "ECG telemetry workstation with rhythm strip interpretation exercises",
    theme: "ocean",
  }),
  "telemetry-simulation": marketingProofFromCoreKey("ecg-workstation", {
    alt: "Interactive telemetry simulation with live rhythm analysis",
    theme: "ocean",
  }),
  "branching-scenarios": marketingProofFromCoreKey("cat-exam-session", {
    alt: "Branching clinical scenario with adaptive patient deterioration cues",
    theme: "midnight",
  }),
  "prioritization-delegation": marketingProofFromCoreKey("practice-rationale", {
    alt: "Prioritization and delegation practice with rationale teaching",
    theme: "ocean",
  }),
  "clinical-skills-lab": marketingProofFromCoreKey("lesson-detail", {
    alt: "Clinical skills lesson with step progression and safety checkpoints",
    theme: "blossom",
  }),
  "labs-workstation": marketingProofFromCoreKey("progress-report", {
    alt: "Lab trend interpretation with topic accuracy and readiness bands",
    theme: "ocean",
  }),
  "med-calculation-drills": marketingProofFromCoreKey("question-bank", {
    alt: "Medication calculation and dosage practice question bank",
    theme: "ocean",
  }),
  "adaptive-remediation": marketingProofFromCoreKey("smart-review", {
    alt: "Adaptive remediation grouped by confidence and weak patterns",
    theme: "blossom",
  }),
  "readiness-analytics": marketingProofFromCoreKey("confidence-analytics", {
    alt: "Readiness analytics dashboard with confidence calibration and trends",
    theme: "midnight",
  }),
  "retention-flashcards": marketingProofFromCoreKey("flashcards", {
    alt: "Retention flashcards with rationale-linked active recall",
    theme: "blossom",
  }),
};

export const HOME_FEATURE_DEEP_DIVE_PROOFS: MarketingProofShot[] = [
  marketingProofFromCoreKey("study-plan", {
    alt: "Personalized adaptive study plan with daily review blocks",
    theme: "blossom",
  }),
  marketingProofFromCoreKey("smart-review", {
    alt: "Smart review system grouping misses by confidence priority",
    theme: "blossom",
  }),
  marketingProofFromCoreKey("cat-results", {
    alt: "CAT exam readiness score with weak-area breakdown",
    theme: "midnight",
  }),
];
