/**
 * Lesson Editorial Governance
 *
 * Rules, guardrails, and decision trees for authoring, reviewing,
 * and managing lessons across the canonical-content + pathway-overlay system.
 *
 * Used by:
 *  - AI lesson generation pipeline (admin-ai-lesson-pipeline.ts)
 *  - Content quality audits
 *  - Duplicate detection guardrails
 *  - Editorial review workflows
 */

import type { LessonTier, ExamFraming, CountryCode } from "./lesson-overlay-architecture";

// ── Scope safety rules ────────────────────────────────────────────────────

/**
 * Content that is ALWAYS safe to share across tiers in shared foundation sections.
 * These are clinical facts with no scope-of-practice implications.
 */
export const ALWAYS_SHAREABLE_CONTENT_PATTERNS = [
  "pathophysiology of",
  "mechanism of",
  "pathogenesis of",
  "anatomy of",
  "core signs and symptoms",
  "classic presentation",
  "diagnostic criteria",
  "key laboratory values",
  "diagnostic imaging findings",
] as const;

/**
 * Content that is NEVER shareable across tiers without explicit scope annotation.
 * These vary significantly by tier scope-of-practice.
 */
export const NEVER_SHAREABLE_CONTENT_PATTERNS = [
  "prescribing",
  "ordering",
  "writing orders",
  "differential diagnosis",
  "independent management",
  "nursing diagnosis",
  "care planning",
  "delegation",
  "escalation to",
  "scope of practice",
] as const;

// ── Over-merge risk matrix ────────────────────────────────────────────────

export type OverMergeRisk = {
  scenario: string;
  risk: "high" | "medium" | "low";
  consequence: string;
  preventionRule: string;
};

/**
 * Known over-merge risks to evaluate during content review.
 * Before approving any merge, check the relevant row.
 */
export const OVER_MERGE_RISKS: readonly OverMergeRisk[] = [
  {
    scenario: "Merging RN assessment with NP prescribing section",
    risk: "high",
    consequence: "Students mistake RN assessment role for prescribing authority — clinically unsafe",
    preventionRule: "NEVER merge pharmacology or treatment sections across tiers",
  },
  {
    scenario: "Merging Canadian lesson with US lesson containing different drug approval status",
    risk: "high",
    consequence: "Students learn incorrect drug availability or regulatory approval",
    preventionRule: "Lessons with FDA/Health Canada markers must stay separate",
  },
  {
    scenario: "Merging acute exacerbation lesson with chronic management lesson",
    risk: "high",
    consequence: "Exam question framing is entirely different; students cannot distinguish acute vs stable",
    preventionRule: "Acute (exacerbation/emergency) and chronic management are always separate lessons",
  },
  {
    scenario: "Merging pediatric lesson with adult lesson",
    risk: "high",
    consequence: "Dosing, presentation, and management differ significantly",
    preventionRule: "Pediatric variants remain separate when drug doses or clinical presentation differ",
  },
  {
    scenario: "Merging stable COPD with COPD exacerbation",
    risk: "high",
    consequence: "Students cannot distinguish stable management from acute deterioration priorities",
    preventionRule: "Exacerbation = separate acute-care lesson always",
  },
  {
    scenario: "Merging RPN delegation triggers with RN delegation authority",
    risk: "medium",
    consequence: "Students confuse when to escalate vs when to delegate vs when to act independently",
    preventionRule: "Delegation scope sections are tier-specific; never share",
  },
  {
    scenario: "Merging two lessons that share a title pattern but cover different body systems",
    risk: "medium",
    consequence: "Students learn fragmented or internally contradictory content",
    preventionRule: "Verify same body system + same pathophysiology before flagging as duplicate",
  },
  {
    scenario: "Merging NCLEX-RN NGN framing with REx-PN stable-client framing",
    risk: "medium",
    consequence: "Exam-style practice becomes unusable; wrong question-framing signals",
    preventionRule: "clinical_pearls and exam_tips sections are always exam-specific",
  },
  {
    scenario: "Merging obstetric/antepartum with postpartum lessons",
    risk: "medium",
    consequence: "Temporal and physiologic context differ; students confuse care priorities",
    preventionRule: "Obstetric stages are separate unless explicitly the same phase",
  },
  {
    scenario: "Merging two NP lessons with similar titles but different clinical focus",
    risk: "low",
    consequence: "Curriculum gap if unique NP-specific content lost during merge",
    preventionRule: "Verify section-level content overlap ≥50% before merging NP lessons",
  },
];

// ── Decision tree for new lesson proposals ────────────────────────────────

export type NewLessonDecision =
  | { action: "use_existing"; existingSlug: string; reason: string }
  | { action: "create_new"; justification: string }
  | { action: "create_subtopic"; parentSlug: string; reason: string }
  | { action: "merge_and_enhance"; targetSlug: string; reason: string };

/**
 * Decision tree for evaluating whether a new lesson should be created
 * or an existing one enhanced.
 *
 * Returns a decision and the rationale.
 */
export function evaluateNewLessonProposal(opts: {
  proposedTitle: string;
  tier: LessonTier;
  exam: ExamFraming;
  country: CountryCode;
  existingLessonsForTopic: Array<{ slug: string; title: string; tier: LessonTier; exam: ExamFraming; country: CountryCode }>;
}): NewLessonDecision {
  const { proposedTitle, tier, exam, country, existingLessonsForTopic } = opts;

  // Check for exact tier/exam/country match
  const exactMatch = existingLessonsForTopic.find(
    (l) => l.tier === tier && l.exam === exam && l.country === country
  );
  if (exactMatch) {
    return {
      action: "use_existing",
      existingSlug: exactMatch.slug,
      reason: `An existing lesson for this tier/exam/country already covers this topic: "${exactMatch.title}"`,
    };
  }

  // Check if it's an exacerbation or acute variant
  const lowerTitle = proposedTitle.toLowerCase();
  if (
    lowerTitle.includes("exacerbation") ||
    lowerTitle.includes("acute management") ||
    lowerTitle.includes("crisis") ||
    lowerTitle.includes("emergency management")
  ) {
    return {
      action: "create_subtopic",
      parentSlug: existingLessonsForTopic[0]?.slug ?? "",
      reason: "Acute/exacerbation variant is legitimately distinct from chronic management",
    };
  }

  // Check for merge trigger patterns
  const MERGE_TRIGGERS = [
    /\bbasics\b/i, /\boverview\b/i, /\bintroduction\b/i,
    /\bmanagement\b$/i, /\btreatment\b$/i, /\bnursing care\b$/i,
  ];
  const isMergeTrigger = MERGE_TRIGGERS.some((p) => p.test(proposedTitle));
  const baseTierMatch = existingLessonsForTopic.find((l) => l.tier === tier);
  if (isMergeTrigger && baseTierMatch) {
    return {
      action: "merge_and_enhance",
      targetSlug: baseTierMatch.slug,
      reason: `Title pattern "${proposedTitle}" suggests fragmentation — enhance existing canonical lesson instead`,
    };
  }

  return {
    action: "create_new",
    justification: `No existing lesson found for ${tier}/${exam}/${country} — new lesson justified`,
  };
}

// ── Quality thresholds ────────────────────────────────────────────────────

export const LESSON_QUALITY_THRESHOLDS = {
  /** Minimum sections for a condition lesson to pass the structural gate */
  minSections: 10,
  /** Minimum estimated word count per section body */
  minSectionWordCount: 80,
  /** Maximum acceptable proportion of identical paragraphs between two lessons in same pathway */
  maxIdenticalParagraphRatio: 0.5,
  /** Minimum Jaccard similarity for two lessons to be flagged as duplicates within same pathway */
  minDuplicateSimilarity: 0.7,
  /** Minimum CA vs US pair similarity to be considered "safe to consolidate" */
  minConsolidationSimilarity: 0.98,
} as const;

// ── Country-specific content markers ─────────────────────────────────────

/**
 * Regex patterns that indicate a lesson contains country-specific content.
 * If a lesson matches these, it must NOT be merged with the other country's version.
 */
export const COUNTRY_SPECIFIC_PATTERNS = {
  CA: [
    /\bCNA\b/,              // Canadian Nurses Association
    /\bCNO\b/,              // College of Nurses of Ontario
    /\bCRNBC\b/,            // College of Registered Nurses of BC
    /\bCPSO\b/,             // College of Physicians and Surgeons of Ontario
    /\bprovincial\s+health/i,
    /\bHealth\s+Canada\b/,
    /\bCanadian\s+(Nurses?|Nursing|Pharmacopoeia)/i,
  ],
  US: [
    /\bFDA\b/,              // Food and Drug Administration
    /\bCMS\b/,              // Centers for Medicare and Medicaid Services
    /\bMedicare\b/,
    /\bMedicaid\b/,
    /\bNCSBN\b/,            // National Council of State Boards of Nursing
    /\bJoint\s+Commission\b/,
    /\bANA\b/,              // American Nurses Association
    /\bstate\s+nursing\s+board/i,
  ],
} as const;

export type CountryMarkerResult = {
  isCountrySpecific: boolean;
  caMarkersFound: string[];
  usMarkersFound: string[];
  recommendation: "keep_separate" | "safe_to_consolidate" | "manual_review";
};

export function detectCountrySpecificContent(body: string): CountryMarkerResult {
  const caFound = COUNTRY_SPECIFIC_PATTERNS.CA.filter((p) => p.test(body)).map(
    (p) => p.source
  );
  const usFound = COUNTRY_SPECIFIC_PATTERNS.US.filter((p) => p.test(body)).map(
    (p) => p.source
  );

  const isCountrySpecific = caFound.length > 0 || usFound.length > 0;

  let recommendation: CountryMarkerResult["recommendation"];
  if (!isCountrySpecific) {
    recommendation = "safe_to_consolidate";
  } else if (caFound.length > 0 && usFound.length > 0) {
    recommendation = "manual_review"; // markers from both — complex
  } else {
    recommendation = "keep_separate";
  }

  return { isCountrySpecific, caMarkersFound: caFound, usMarkersFound: usFound, recommendation };
}

// ── Future migration plan ─────────────────────────────────────────────────

/**
 * Phased migration roadmap for the canonical-content + overlay system.
 *
 * Phase 1 (current sprint):
 *   ✓ Execute 6 within-pathway merges
 *   ✓ Add canonical metadata fields to PathwayLesson (canonicalLessonId, etc.)
 *   ✓ Add CanonicalTopic + CanonicalTopicSharedSection to Prisma
 *   ✓ Implement canonical link rewriter (renders deprecated slugs → canonical)
 *   ✓ Add SEO redirects for deprecated slugs
 *   ✓ CA vs US diff analysis (744 pairs analyzed)
 *
 * Phase 2 (next sprint):
 *   - Map all 3,423 lessons to CanonicalTopic nodes (batch script)
 *   - Seed CanonicalTopicSharedSection for top 50 conditions
 *   - Consolidate 461 identical CA/US RN lessons → countries: ["CA","US"]
 *   - NP triplication: run section-level diff on 415 clusters
 *
 * Phase 3 (q3):
 *   - NP triplication resolution: consolidate identical NP lessons to np-core-catalog
 *   - 63 CA/US near-identical pairs: extract country-overlay sections
 *   - Implement shared-section injection in lesson render pipeline
 *   - Run structural gate upgrade on all merged canonical lessons
 *
 * Phase 4 (q4):
 *   - canonicalTopicId cross-surface connections (flashcards, questions, CAT, remediation)
 *   - Analytics: track lesson-to-topic engagement
 *   - Study plan integration: topic nodes drive adaptive study paths
 *   - Blog cross-linking via canonicalTopic.blogTopicKey
 */
export const MIGRATION_ROADMAP_PHASE = 1 as const;
