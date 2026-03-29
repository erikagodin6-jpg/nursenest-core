import type { TierCode } from "@prisma/client";
import { getConversionVariant } from "@/lib/conversion/experiment-config";
import type { BillingDuration } from "@/lib/pricing/billing-types";

export type { BillingDuration };

export type TierPricingNarrative = {
  tier: TierCode;
  headline: string;
  subhead: string;
  outcomes: string[];
  included: string[];
  proofLine: string;
  urgencyLine?: string;
};

const BASE: Record<string, TierPricingNarrative> = {
  RPN: {
    tier: "RPN",
    headline: "Pass the REx-PN with practice that feels like exam day",
    subhead: "PN-scope scenarios, safety-first rationales, and timed sets aligned to Canadian practical nursing.",
    outcomes: [
      "Build confidence on delegation, scope, and stable vs unstable presentations",
      "Translate theory into quick decisions under time pressure",
      "Close gaps with category-aware review instead of random drilling",
    ],
    included: [
      "PN-tier question bank with detailed rationales",
      "Clinical lessons mapped to entry-to-practice competencies",
      "Timed practice exams using your filtered item pool",
      "Progress visibility so you study what moves your score",
    ],
    proofLine: "Learners who train consistently with timed blocks and rationales report stronger readiness on exam-style judgment items.",
  },
  LVN_LPN: {
    tier: "LVN_LPN",
    headline: "NCLEX-PN prep that prioritizes safety and scope",
    subhead: "US LVN/LPN pathways get PN-level scenarios—no RN-only noise unless your plan includes it.",
    outcomes: [
      "Rehearse prioritization and therapeutic communication the way boards frame them",
      "Reinforce pharmacology monitoring PN scope expects",
      "Use mock pacing to reduce exam-day adrenaline mistakes",
    ],
    included: [
      "PN-focused practice questions and rationales",
      "Lesson tracks for high-yield clinical foundations",
      "Practice exams drawn from your eligible pool only",
      "Performance cues to rebalance weak categories weekly",
    ],
    proofLine: "Outcome-focused study beats passive videos—active items with rationales are built into every plan.",
  },
  RN: {
    tier: "RN",
    headline: "NCLEX-RN readiness: judgment, pharmacology, and stamina",
    subhead: "Integrated lessons, NGN-style thinking, and mock exams for Canada and the United States.",
    outcomes: [
      "Train clinical judgment with scenarios weighted like the real exam",
      "Strengthen pharmacology, safety, and prioritization in one workflow",
      "Move from practice questions to full mocks when accuracy holds",
    ],
    included: [
      "High-yield RN question bank with rationales",
      "Lessons across core systems and acute care transitions",
      "CAT-style / adaptive-friendly practice modes where available",
      "Exam analytics and review focused on your miss patterns",
    ],
    proofLine: "Serious candidates combine daily questions, lessons, and mocks—NurseNest keeps that loop in one subscription.",
  },
  NP: {
    tier: "NP",
    headline: "NP exam prep with differential depth and management rigor",
    subhead: "Advanced practice items emphasize synthesis, diagnostics, and follow-up planning.",
    outcomes: [
      "Stress-test differentials and prescribing considerations safely",
      "Build speed on complex case stems without skipping rationale depth",
      "Align study blocks to the systems you actually see in practice",
    ],
    included: [
      "NP-tier items with deeper rationale expectations",
      "Clinical lessons supporting advanced pathways (per your tier)",
      "Mock exam sessions sized for longer case blocks",
      "Category analytics tuned for NP scope",
    ],
    proofLine: "NP candidates use NurseNest to keep complexity high without losing the feedback loop rationales provide.",
  },
  ALLIED: {
    tier: "ALLIED",
    headline: "Allied health exam prep anchored in clinical reasoning",
    subhead: "RT, paramedic, lab, and imaging learners use the same disciplined question → lesson → mock rhythm.",
    outcomes: [
      "Practice rapid prioritization and protocol edges like certification exams",
      "Tie pathophysiology lessons to applied items the same week",
      "Track weak domains instead of repeating comfortable topics",
    ],
    included: [
      "Reasoning-heavy question practice with clear rationales",
      "Lesson library access aligned to your subscription tier",
      "Timed exams to rehearse stamina and pacing",
      "Simple analytics to steer your next study block",
    ],
    proofLine: "Certification success correlates with consistent application—not cramming—NurseNest enforces that cadence.",
  },
};

function variantHeadline(tier: TierCode, base: TierPricingNarrative): TierPricingNarrative {
  const v = getConversionVariant();
  if (v === "urgency") {
    return {
      ...base,
      urgencyLine: "Lock in your study rhythm now—early consistency beats last-minute cramming.",
      headline:
        tier === "NP"
          ? `${base.headline} — start your advanced-practice sprint`
          : `${base.headline} — start your pass-focused sprint`,
    };
  }
  if (v === "outcome") {
    return {
      ...base,
      headline: base.headline.replace(/^Pass /, "Reach passing readiness: "),
    };
  }
  return base;
}

export function getTierPricingNarrative(tier: TierCode): TierPricingNarrative {
  const key = tier === "LVN_LPN" ? "LVN_LPN" : tier;
  const base = BASE[key] ?? BASE.RN;
  return variantHeadline(tier, base);
}

export const TRUST_BLOCK = {
  guaranteeTitle: "30-day pass-focused guarantee",
  guaranteeBody:
    "If NurseNest is not helping you study with clearer structure and stronger practice discipline in your first 30 days, contact support—we will work with you on a fair resolution.",
  trustBullets: [
    "Secure checkout via Stripe",
    "Built for Canada and US registration contexts",
    "No surprise cross-tier content leakage—your bank matches your pathway",
  ],
} as const;

export const SOCIAL_PROOF = {
  passRateLine:
    "Candidates who complete weekly timed practice and review every rationale tend to report higher confidence approaching their authorization-to-test window.",
  /** Honest workflow line (not a fabricated testimonial). */
  pricingFooterLine:
    "Subscriptions bundle the question bank, lessons, timed practice, and score history so you can study in one place—without juggling separate tools.",
} as const;
