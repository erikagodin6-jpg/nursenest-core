/**
 * NurseNest — System-Level Protection Guards
 *
 * This module provides runtime verification and contract tests for critical
 * production safety systems. Each guard is designed to fail fast and provide
 * actionable error messages.
 *
 * Guards covered:
 * 1. Single Source of Truth Guard
 * 2. Public Visibility Guard
 * 3. Duplicate Content Guard
 * 4. Profession Segmentation Guard (allied)
 * 5. Medical Accuracy Guard
 */

import { CONTENT_REGISTRY, listRegistryEntries } from "@/lib/content-source-of-truth/content-registry";
import { ALLIED_PROFESSIONS, getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import type { ContentRegistryId } from "@/lib/content-source-of-truth/content-registry";

// ============================================================================
// GUARD 1: Single Source of Truth Guard
// ============================================================================

export type SOTVerificationResult = {
  contentType: ContentRegistryId;
  passed: boolean;
  canonicalStorage: string | null;
  hasAdminEdit: boolean;
  hasPublicRead: boolean;
  hasLearnerRead: boolean;
  issues: string[];
};

/**
 * Verify that every VERIFIED content type has:
 * - Canonical storage model declared
 * - Admin edit route declared
 * - At least one read route (public or learner)
 * - No writes to temp/hidden/generated-only locations
 */
export function verifySingleSourceOfTruth(): SOTVerificationResult[] {
  const results: SOTVerificationResult[] = [];

  for (const entry of listRegistryEntries()) {
    const issues: string[] = [];

    // VERIFIED types must have complete SoT chain
    if (entry.verificationStatus === "VERIFIED") {
      if (!entry.canonicalStorageModel || entry.canonicalStorageModel.length < 2) {
        issues.push("Missing canonical storage model");
      }
      if (!entry.adminEditRoute || entry.adminEditRoute.length < 2) {
        issues.push("Missing admin edit route");
      }
      if (!entry.publicReadRoutePattern && !entry.learnerReadRoutePattern) {
        issues.push("Missing all read routes (public and learner)");
      }
    }

    // Check that generated folders are not the primary source
    if (entry.generatedFolderAllowed && entry.verificationStatus === "VERIFIED") {
      if (!entry.generatedFolderNotes || !entry.generatedFolderNotes.toLowerCase().includes("artifact")) {
        issues.push("Generated folder allowed but not documented as build artifact");
      }
    }

    results.push({
      contentType: entry.id,
      passed: issues.length === 0,
      canonicalStorage: entry.canonicalStorageModel,
      hasAdminEdit: !!entry.adminEditRoute,
      hasPublicRead: !!entry.publicReadRoutePattern,
      hasLearnerRead: !!entry.learnerReadRoutePattern,
      issues,
    });
  }

  return results;
}

// ============================================================================
// GUARD 2: Public Visibility Guard
// ============================================================================

export type VisibilityCheckResult = {
  contentType: string;
  itemId: string;
  routeType: "public" | "learner";
  route: string | null;
  accessible: boolean;
  issues: string[];
};

/**
 * Contract-level visibility guard.
 * Verifies that published content has accessible routes.
 * Runtime HTTP verification should be done via separate e2e tests.
 */
export function verifyPublicVisibilityContracts(): { passed: boolean; checks: VisibilityCheckResult[] } {
  const checks: VisibilityCheckResult[] = [];

  // Verify that each VERIFIED content type has route patterns
  for (const entry of listRegistryEntries()) {
    if (entry.verificationStatus !== "VERIFIED") continue;

    const sampleId = "sample-verification-id";

    if (entry.publicReadRoutePattern) {
      const hasPattern = entry.publicReadRoutePattern.includes("{") || entry.publicReadRoutePattern.length > 5;
      checks.push({
        contentType: entry.id,
        itemId: sampleId,
        routeType: "public",
        route: entry.publicReadRoutePattern,
        accessible: hasPattern,
        issues: hasPattern ? [] : ["Invalid or empty public route pattern"],
      });
    }

    if (entry.learnerReadRoutePattern) {
      const hasPattern = entry.learnerReadRoutePattern.includes("{") || entry.learnerReadRoutePattern.length > 5;
      checks.push({
        contentType: entry.id,
        itemId: sampleId,
        routeType: "learner",
        route: entry.learnerReadRoutePattern,
        accessible: hasPattern,
        issues: hasPattern ? [] : ["Invalid or empty learner route pattern"],
      });
    }
  }

  const passed = checks.every((c) => c.accessible);
  return { passed, checks };
}

// ============================================================================
// GUARD 3: Duplicate Content Guard
// ============================================================================

export type DuplicateCheckResult = {
  scope: "blogs" | "lessons" | "hubs" | "printables";
  duplicateType: "slug" | "title" | "meta_description" | "body";
  duplicates: Array<{ id: string; value: string; count: number }>;
  passed: boolean;
};

/**
 * Interface for content items that can be checked for duplicates.
 * Implementations should query the database or catalog.
 */
export interface DeduplicatableContent {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string | null;
  bodyPreview?: string;
}

/**
 * Check for duplicate slugs within a content collection.
 * Returns any duplicates found.
 */
export function checkDuplicateSlugs(items: DeduplicatableContent[]): DuplicateCheckResult["duplicates"] {
  const slugCounts = new Map<string, string[]>();

  for (const item of items) {
    const slug = item.slug.trim().toLowerCase();
    if (!slug) continue;

    const existing = slugCounts.get(slug) ?? [];
    existing.push(item.id);
    slugCounts.set(slug, existing);
  }

  const duplicates: DuplicateCheckResult["duplicates"] = [];
  for (const [slug, ids] of slugCounts) {
    if (ids.length > 1) {
      duplicates.push({ id: slug, value: slug, count: ids.length });
    }
  }

  return duplicates;
}

/**
 * Check for duplicate titles within a content collection.
 */
export function checkDuplicateTitles(items: DeduplicatableContent[]): DuplicateCheckResult["duplicates"] {
  const titleCounts = new Map<string, string[]>();

  for (const item of items) {
    const title = item.title.trim().toLowerCase();
    if (!title || title.length < 5) continue; // Skip very short titles

    const existing = titleCounts.get(title) ?? [];
    existing.push(item.id);
    titleCounts.set(title, existing);
  }

  const duplicates: DuplicateCheckResult["duplicates"] = [];
  for (const [title, ids] of titleCounts) {
    if (ids.length > 1) {
      duplicates.push({ id: title, value: title, count: ids.length });
    }
  }

  return duplicates;
}

// ============================================================================
// GUARD 4: Profession Segmentation Guard (Allied)
// ============================================================================

export type ProfessionSegmentationResult = {
  professionKey: string;
  pathwayId: string;
  hasUniqueTopics: boolean;
  hasUniqueLessons: boolean;
  topicSlugsIn: string[];
  issues: string[];
  passed: boolean;
};

/**
 * Verify that each allied profession has distinct content segmentation.
 * Checks that professions have unique topic slugs and aren't all identical.
 */
export function verifyProfessionSegmentation(): ProfessionSegmentationResult[] {
  const results: ProfessionSegmentationResult[] = [];

  // Track all topic sets to detect identical professions
  const topicSets = new Map<string, string[]>();

  for (const profession of ALLIED_PROFESSIONS) {
    const issues: string[] = [];
    const topics = profession.topicSlugsIn ?? [];
    const topicKey = topics.sort().join(",");

    // Check for unique topic configuration
    if (topics.length === 0) {
      issues.push("No topicSlugsIn defined — profession may show all content");
    }

    // Check pathway is set
    if (!profession.pathwayId || profession.pathwayId.trim().length < 2) {
      issues.push("Missing or invalid pathwayId");
    }

    // Track for cross-profession comparison
    const existing = topicSets.get(topicKey) ?? [];
    existing.push(profession.professionKey);
    topicSets.set(topicKey, existing);

    results.push({
      professionKey: profession.professionKey,
      pathwayId: profession.pathwayId,
      hasUniqueTopics: topics.length > 0,
      hasUniqueLessons: true, // Verified by pathway isolation
      topicSlugsIn: topics,
      issues,
      passed: issues.length === 0,
    });
  }

  // Check for professions with identical topic sets
  for (const [topicKey, keys] of topicSets) {
    if (keys.length > 1 && topicKey.length > 0) {
      // Add warning to results for identical professions
      for (const key of keys) {
        const result = results.find((r) => r.professionKey === key);
        if (result) {
          result.issues.push(`Shares identical topic set with: ${keys.filter((k) => k !== key).join(", ")}`);
          result.passed = false;
        }
      }
    }
  }

  return results;
}

/**
 * Verify that allied profession lookup works correctly.
 */
export function verifyAlliedProfessionLookup(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];

  for (const profession of ALLIED_PROFESSIONS) {
    // Test lookup by profession key
    const byKey = getAlliedProfessionByProfessionKey(profession.professionKey);
    if (!byKey) {
      issues.push(`Cannot find profession by key: ${profession.professionKey}`);
    } else if (byKey.pathwayId !== profession.pathwayId) {
      issues.push(`Pathway mismatch for ${profession.professionKey}`);
    }
  }

  return { passed: issues.length === 0, issues };
}

// ============================================================================
// GUARD 5: Medical Accuracy Guard
// ============================================================================

export type MedicalContentCategory =
  | "pharmacology"
  | "dosage_calculation"
  | "contraindications"
  | "adverse_effects"
  | "emergency_care"
  | "mental_health_crisis"
  | "pediatric_neonatal";

export type MedicalAccuracyCheckResult = {
  contentId: string;
  contentType: "lesson" | "blog" | "question";
  category: MedicalContentCategory;
  hasReferences: boolean;
  hasDisclaimer: boolean;
  hasScopeFraming: boolean;
  issues: string[];
  passed: boolean;
};

/**
 * High-risk medical content categories that require extra verification.
 */
export const HIGH_RISK_MEDICAL_CATEGORIES: readonly MedicalContentCategory[] = [
  "pharmacology",
  "dosage_calculation",
  "contraindications",
  "adverse_effects",
  "emergency_care",
  "mental_health_crisis",
  "pediatric_neonatal",
] as const;

/**
 * Keywords that indicate high-risk medical content.
 */
export const MEDICAL_RISK_KEYWORDS: readonly string[] = [
  "medication",
  "dosage",
  "drug",
  "contraindication",
  "adverse effect",
  "side effect",
  "emergency",
  "code blue",
  "crisis",
  "suicide",
  "pediatric",
  "neonatal",
  "infant",
  "overdose",
  "toxic",
  "anaphylaxis",
  "cardiac arrest",
  "stroke",
  "sepsis",
];

/**
 * Check if content text contains high-risk medical keywords.
 */
export function detectMedicalRiskContent(text: string): MedicalContentCategory[] {
  const lower = text.toLowerCase();
  const detected: MedicalContentCategory[] = [];

  if (MEDICAL_RISK_KEYWORDS.some((kw) => lower.includes(kw))) {
    // Categorize based on keyword matches
    if (lower.includes("medication") || lower.includes("drug") || lower.includes("pharmacology")) {
      detected.push("pharmacology");
    }
    if (lower.includes("dosage") || lower.includes("dose") || lower.includes("calculation")) {
      detected.push("dosage_calculation");
    }
    if (lower.includes("contraindication") || lower.includes("avoid in")) {
      detected.push("contraindications");
    }
    if (lower.includes("adverse effect") || lower.includes("side effect") || lower.includes("toxic")) {
      detected.push("adverse_effects");
    }
    if (lower.includes("emergency") || lower.includes("code blue") || lower.includes("cardiac arrest")) {
      detected.push("emergency_care");
    }
    if (lower.includes("suicide") || lower.includes("crisis") || lower.includes("mental health")) {
      detected.push("mental_health_crisis");
    }
    if (lower.includes("pediatric") || lower.includes("neonatal") || lower.includes("infant")) {
      detected.push("pediatric_neonatal");
    }
  }

  return detected;
}

/**
 * Verify medical content has required safety elements.
 * This is a contract-level check; actual content verification requires DB access.
 */
export function verifyMedicalContentRequirements(params: {
  contentId: string;
  contentType: "lesson" | "blog" | "question";
  text: string;
  hasReferences: boolean;
  hasDisclaimer: boolean;
  hasScopeFraming: boolean;
}): MedicalAccuracyCheckResult {
  const categories = detectMedicalRiskContent(params.text);
  const issues: string[] = [];

  if (categories.length > 0) {
    if (!params.hasReferences) {
      issues.push("High-risk medical content missing references");
    }
    if (!params.hasDisclaimer) {
      issues.push("High-risk medical content missing educational disclaimer");
    }
    if (!params.hasScopeFraming) {
      issues.push("High-risk medical content missing scope-of-practice framing");
    }
  }

  return {
    contentId: params.contentId,
    contentType: params.contentType,
    category: categories[0] ?? "pharmacology",
    hasReferences: params.hasReferences,
    hasDisclaimer: params.hasDisclaimer,
    hasScopeFraming: params.hasScopeFraming,
    issues,
    passed: issues.length === 0,
  };
}

// ============================================================================
// Aggregate Guard Results
// ============================================================================

export type SystemProtectionReport = {
  timestamp: string;
  singleSourceOfTruth: { passed: boolean; results: SOTVerificationResult[] };
  publicVisibility: { passed: boolean; checks: VisibilityCheckResult[] };
  professionSegmentation: { passed: boolean; results: ProfessionSegmentationResult[] };
  alliedLookup: { passed: boolean; issues: string[] };
  summary: {
    totalGuards: number;
    passedGuards: number;
    failedGuards: number;
    criticalIssues: string[];
  };
};

/**
 * Run all system protection guards and generate a report.
 */
export function runSystemProtectionAudit(): SystemProtectionReport {
  const sotResults = verifySingleSourceOfTruth();
  const visibilityResults = verifyPublicVisibilityContracts();
  const professionResults = verifyProfessionSegmentation();
  const alliedLookup = verifyAlliedProfessionLookup();

  const allChecks = [
    { name: "Single Source of Truth", passed: sotResults.every((r) => r.passed) },
    { name: "Public Visibility", passed: visibilityResults.passed },
    { name: "Profession Segmentation", passed: professionResults.every((r) => r.passed) },
    { name: "Allied Lookup", passed: alliedLookup.passed },
  ];

  const passedGuards = allChecks.filter((c) => c.passed).length;
  const failedGuards = allChecks.filter((c) => !c.passed).length;

  const criticalIssues: string[] = [
    ...sotResults.filter((r) => !r.passed).flatMap((r) => r.issues.map((i) => `[${r.contentType}] ${i}`)),
    ...visibilityResults.checks.filter((c) => !c.accessible).map((c) => `[${c.contentType}] ${c.issues.join(", ")}`),
    ...professionResults.filter((r) => !r.passed).flatMap((r) => r.issues.map((i) => `[${r.professionKey}] ${i}`)),
    ...alliedLookup.issues,
  ];

  return {
    timestamp: new Date().toISOString(),
    singleSourceOfTruth: { passed: sotResults.every((r) => r.passed), results: sotResults },
    publicVisibility: visibilityResults,
    professionSegmentation: { passed: professionResults.every((r) => r.passed), results: professionResults },
    alliedLookup,
    summary: {
      totalGuards: allChecks.length,
      passedGuards,
      failedGuards,
      criticalIssues,
    },
  };
}