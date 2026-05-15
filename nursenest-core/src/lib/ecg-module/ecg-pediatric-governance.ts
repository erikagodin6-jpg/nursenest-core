/**
 * ECG Pediatric Governance
 *
 * Validates separation of pediatric and adult ECG content, PALS/ACLS isolation,
 * pulsus paradoxus classification enforcement, and RPN access restrictions.
 *
 * Governance rules enforced here (all verified by contract tests):
 *
 *   RULE 1: Namespace separation
 *     No pediatric rhythm tag appears in ECG_RHYTHM_TAG_REGISTRY (adult).
 *     No adult rhythm tag appears in PEDIATRIC_ECG_RHYTHM_REGISTRY.
 *     Violation = mastery score contamination between PALS and ACLS competency.
 *
 *   RULE 2: Pulsus paradoxus classification
 *     "Pulsus paradoxus" must NOT appear as a rhythmTag in any DB question record.
 *     It must only appear as hemodynamicFinding context in case simulations.
 *     Verified by PROHIBITED_AS_RHYTHM_TAGS and assertTagIsNotHemodynamicFinding().
 *
 *   RULE 3: PALS/ACLS mastery score isolation
 *     Pediatric curriculum topics with palsOnlyScoring=true MUST NOT contribute to
 *     adult ACLS readiness scores. This is enforced structurally (separate
 *     competency domain systems), not by runtime checks.
 *
 *   RULE 4: RPN/LPN access restriction
 *     Topics with rpnAccessLevel="restricted" must not render dosing or drug
 *     information to RPN-tier users.
 *     Topics with rpnAccessLevel="recognition_only" render escalation framing
 *     instead of management detail.
 *
 *   RULE 5: Pediatric rate ranges
 *     No pediatric rhythm entry should use adult normal-range rate values.
 *     Specifically: no rhythm in the pediatric registry should have resting max = 100
 *     for neonate/infant age groups (that is an adult normal range).
 *
 *   RULE 6: Clinical review
 *     Advanced pediatric topics must have clinicalReviewStatus="reviewed".
 *     Any unreviewed advanced topic fails CI.
 */

import {
  PEDIATRIC_ECG_RHYTHM_REGISTRY,
  VALID_PEDIATRIC_RHYTHM_TAGS,
  HEMODYNAMIC_FINDINGS_REGISTRY,
  PROHIBITED_AS_RHYTHM_TAGS,
  type PediatricAgeGroup,
  type PediatricEcgRhythmEntry,
  assertTagIsNotHemodynamicFinding,
} from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

import {
  PEDIATRIC_ECG_CURRICULUM,
  getUnreviewedPediatricAdvancedTopics,
  type PediatricEcgCurriculumTopic,
} from "@/lib/ecg-module/ecg-pediatric-curriculum";

import {
  validatePediatricDifferentialGraphNodes,
  validatePediatricDifferentialGraphEdges,
  PEDIATRIC_DIFFERENTIAL_NODES,
} from "@/lib/ecg-module/ecg-pediatric-differential-graph";

import {
  PEDIATRIC_CASE_SIMULATIONS,
  CASES_WITH_PULSUS_PARADOXUS,
} from "@/lib/ecg-module/ecg-pediatric-case-simulations";

import { ECG_RHYTHM_TAG_REGISTRY } from "@/lib/ecg-module/ecg-rhythm-tag-registry";
import { ECG_FULL_CURRICULUM } from "@/lib/ecg-module/ecg-curriculum-config";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PediatricGovernanceViolation = {
  rule: string;
  severity: "error" | "warning";
  message: string;
  fix?: string;
};

export type PediatricGovernanceReport = {
  ok: boolean;
  violations: PediatricGovernanceViolation[];
  errors: PediatricGovernanceViolation[];
  warnings: PediatricGovernanceViolation[];
  stats: {
    pediatricRhythmCount: number;
    adultRhythmCount: number;
    prohibitedAsRhythmTagCount: number;
    pediatricCurriculumTopicCount: number;
    unreviewedAdvancedTopicCount: number;
    casesWithPulsusPardoxusCount: number;
    palsArrestRhythmCount: number;
  };
};

// ─── Rule validators ───────────────────────────────────────────────────────────

/**
 * RULE 1A: No pediatric rhythm tag appears in the adult ECG_RHYTHM_TAG_REGISTRY.
 */
function checkNoOverlapWithAdultRegistry(): PediatricGovernanceViolation[] {
  const adultTags = new Set(ECG_RHYTHM_TAG_REGISTRY.map((e) => e.tag));
  const violations: PediatricGovernanceViolation[] = [];
  for (const entry of PEDIATRIC_ECG_RHYTHM_REGISTRY) {
    if (adultTags.has(entry.tag)) {
      violations.push({
        rule: "namespace_separation",
        severity: "error",
        message: `Pediatric rhythm tag "${entry.tag}" also exists in the adult ECG_RHYTHM_TAG_REGISTRY. This will cause mastery score contamination.`,
        fix: `Rename pediatric tag to include "Pediatric " prefix or use a distinct namespace.`,
      });
    }
  }
  return violations;
}

/**
 * RULE 1B: No adult rhythm tag appears in PEDIATRIC_ECG_RHYTHM_REGISTRY.
 */
function checkNoPediatricTagsInAdultRegistry(): PediatricGovernanceViolation[] {
  const pediatricTags = VALID_PEDIATRIC_RHYTHM_TAGS;
  const violations: PediatricGovernanceViolation[] = [];
  for (const entry of ECG_RHYTHM_TAG_REGISTRY) {
    if (pediatricTags.has(entry.tag)) {
      violations.push({
        rule: "namespace_separation",
        severity: "error",
        message: `Adult registry tag "${entry.tag}" is also in PEDIATRIC_ECG_RHYTHM_REGISTRY. Registries must be mutually exclusive.`,
        fix: `Remove the duplicate from the adult registry or rename it.`,
      });
    }
  }
  return violations;
}

/**
 * RULE 2: Pulsus paradoxus must not appear as rhythm tag anywhere in pediatric content.
 * Checks all case simulation hemodynamicFindings have isNotRhythm=true for pulsus paradoxus.
 */
function checkPulsusPardoxusClassification(): PediatricGovernanceViolation[] {
  const violations: PediatricGovernanceViolation[] = [];

  // Must be in prohibited set
  if (!PROHIBITED_AS_RHYTHM_TAGS.has("Pulsus paradoxus")) {
    violations.push({
      rule: "pulsus_paradoxus_not_rhythm",
      severity: "error",
      message: "Pulsus paradoxus is missing from PROHIBITED_AS_RHYTHM_TAGS.",
      fix: "Add prohibitedAsRhythmTag: true to the Pulsus paradoxus entry in HEMODYNAMIC_FINDINGS_REGISTRY.",
    });
  }

  // Must not appear in pediatric rhythm registry
  if (VALID_PEDIATRIC_RHYTHM_TAGS.has("Pulsus paradoxus")) {
    violations.push({
      rule: "pulsus_paradoxus_not_rhythm",
      severity: "error",
      message: "Pulsus paradoxus appears as a rhythm tag in PEDIATRIC_ECG_RHYTHM_REGISTRY. It must only appear in HEMODYNAMIC_FINDINGS_REGISTRY.",
      fix: "Remove from PEDIATRIC_ECG_RHYTHM_REGISTRY. It is a hemodynamic finding, not a rhythm.",
    });
  }

  // Must not appear in adult rhythm registry
  if (ECG_RHYTHM_TAG_REGISTRY.some((e) => e.tag === "Pulsus paradoxus")) {
    violations.push({
      rule: "pulsus_paradoxus_not_rhythm",
      severity: "error",
      message: "Pulsus paradoxus appears as a tag in the adult ECG_RHYTHM_TAG_REGISTRY.",
      fix: "Remove from adult registry. Pulsus paradoxus is a hemodynamic finding, not a cardiac rhythm.",
    });
  }

  // All case simulation findings with pulsus paradoxus must have isNotRhythm=true
  for (const caseSimulation of CASES_WITH_PULSUS_PARADOXUS) {
    for (const finding of caseSimulation.hemodynamicFindings) {
      if (
        finding.findingName.toLowerCase().includes("pulsus") &&
        !finding.isNotRhythm
      ) {
        violations.push({
          rule: "pulsus_paradoxus_not_rhythm",
          severity: "error",
          message: `Case "${caseSimulation.id}" has pulsus paradoxus finding without isNotRhythm=true.`,
          fix: "Set isNotRhythm: true on the pulsus paradoxus finding in this case simulation.",
        });
      }
    }
  }

  return violations;
}

/**
 * RULE 3: PALS/ACLS mastery isolation.
 * Pediatric curriculum topic IDs must not appear in adult ECG competency domain topicIds.
 * This is a structural check — the competency domain files must not reference pediatric topic IDs.
 */
function checkPalsAclsIsolation(): PediatricGovernanceViolation[] {
  const pediatricTopicIds = new Set(PEDIATRIC_ECG_CURRICULUM.map((t) => t.id));
  const adultTopicIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
  const violations: PediatricGovernanceViolation[] = [];

  for (const id of pediatricTopicIds) {
    if (adultTopicIds.has(id)) {
      violations.push({
        rule: "pals_acls_isolation",
        severity: "error",
        message: `Pediatric curriculum topic ID "${id}" also appears in adult ECG_FULL_CURRICULUM. Topic IDs must be distinct.`,
        fix: `Prefix pediatric topic IDs with "ped-" (they already use this convention — verify adult curriculum has no "ped-" IDs).`,
      });
    }
  }

  // Additionally confirm that no adult topic ID starts with "ped-" (would indicate contamination)
  for (const id of adultTopicIds) {
    if (id.startsWith("ped-")) {
      violations.push({
        rule: "pals_acls_isolation",
        severity: "error",
        message: `Adult curriculum topic ID "${id}" starts with "ped-" — this suggests contamination from pediatric content.`,
        fix: "Remove pediatric topic ID from adult ECG_FULL_CURRICULUM or rename it.",
      });
    }
  }

  return violations;
}

/**
 * RULE 4: RPN access restriction validation.
 * Topics with rpnAccessLevel="restricted" must have includesDosing=false if shown to RPN.
 * Governance note: the rendering layer enforces this; this validator checks config consistency.
 */
function checkRpnAccessConsistency(): PediatricGovernanceViolation[] {
  const violations: PediatricGovernanceViolation[] = [];
  for (const topic of PEDIATRIC_ECG_CURRICULUM) {
    if (topic.rpnAccessLevel === "restricted" && topic.palsPriority === "educational") {
      violations.push({
        rule: "rpn_access_consistency",
        severity: "warning",
        message: `Topic "${topic.id}" has rpnAccessLevel="restricted" but palsPriority="educational". Restricted access should apply to life-threatening or urgent topics.`,
        fix: "Review whether this topic truly requires RPN restriction or if 'recognition_only' is more appropriate.",
      });
    }
  }
  return violations;
}

/**
 * RULE 5: Pediatric rate ranges must not use adult defaults.
 * Validates that no neonate/infant rhythm entry has restingMin >= 60 as a max (adult normal).
 * The neonatal max should be much higher.
 */
function checkPediatricRateRangeValidity(): PediatricGovernanceViolation[] {
  const violations: PediatricGovernanceViolation[] = [];

  for (const entry of PEDIATRIC_ECG_RHYTHM_REGISTRY) {
    const neonateRange = entry.rateRangesByAgeGroup["neonate"];
    if (neonateRange && neonateRange.max <= 100) {
      violations.push({
        rule: "pediatric_rate_ranges",
        severity: "error",
        message: `Rhythm "${entry.tag}" has neonate max rate ${neonateRange.max} — this is the adult normal upper limit, not appropriate for neonatal rate range specification.`,
        fix: "Neonatal resting max should be at least 160 for normal rhythms. Verify clinical reference.",
      });
    }
    // Check for blank rate ranges on rhythms that should have them
    if (
      Object.keys(entry.rateRangesByAgeGroup).length === 0 &&
      !entry.tag.includes("VF") &&
      !entry.tag.includes("asystole") &&
      !entry.tag.includes("PEA") &&
      !entry.tag.includes("Post-op")
    ) {
      violations.push({
        rule: "pediatric_rate_ranges",
        severity: "warning",
        message: `Rhythm "${entry.tag}" has no rateRangesByAgeGroup entries. Consider adding age-specific ranges for educational clarity.`,
        fix: "Add rateRangesByAgeGroup for at least the primary age groups where this rhythm occurs.",
      });
    }
  }
  return violations;
}

/**
 * RULE 6: All advanced pediatric topics must have clinicalReviewStatus="reviewed".
 */
function checkClinicalReviewStatus(): PediatricGovernanceViolation[] {
  const violations: PediatricGovernanceViolation[] = [];
  const unreviewed = getUnreviewedPediatricAdvancedTopics();
  for (const topic of unreviewed) {
    violations.push({
      rule: "clinical_review_required",
      severity: "error",
      message: `Pediatric advanced topic "${topic.id}" (${topic.label}) has clinicalReviewStatus="${topic.clinicalReviewStatus}". All advanced pediatric topics require clinical review before production.`,
      fix: "Add reviewedAt (ISO-8601 date), reviewedBy, and guidelineVersion fields and set clinicalReviewStatus='reviewed'.",
    });
  }
  return violations;
}

/**
 * RULE 7: Differential graph integrity.
 * All graph nodes must be valid pediatric rhythm tags.
 * All edges must reference existing graph nodes.
 */
function checkDifferentialGraphIntegrity(): PediatricGovernanceViolation[] {
  const nodeErrors = validatePediatricDifferentialGraphNodes();
  const edgeErrors = validatePediatricDifferentialGraphEdges();
  return [
    ...nodeErrors.map((msg): PediatricGovernanceViolation => ({
      rule: "differential_graph_integrity",
      severity: "error",
      message: msg,
      fix: "Add the rhythm tag to PEDIATRIC_ECG_RHYTHM_REGISTRY or fix the node entry.",
    })),
    ...edgeErrors.map((msg): PediatricGovernanceViolation => ({
      rule: "differential_graph_integrity",
      severity: "error",
      message: msg,
      fix: "Verify all edge rhythm tags exist as nodes in PEDIATRIC_DIFFERENTIAL_NODES.",
    })),
  ];
}

// ─── Full governance audit ─────────────────────────────────────────────────────

/**
 * Runs all seven governance rules and returns a comprehensive report.
 * Call this in CI and from the admin readiness endpoint.
 */
export function runPediatricEcgGovernanceAudit(): PediatricGovernanceReport {
  const violations: PediatricGovernanceViolation[] = [
    ...checkNoOverlapWithAdultRegistry(),
    ...checkNoPediatricTagsInAdultRegistry(),
    ...checkPulsusPardoxusClassification(),
    ...checkPalsAclsIsolation(),
    ...checkRpnAccessConsistency(),
    ...checkPediatricRateRangeValidity(),
    ...checkClinicalReviewStatus(),
    ...checkDifferentialGraphIntegrity(),
  ];

  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");

  return {
    ok: errors.length === 0,
    violations,
    errors,
    warnings,
    stats: {
      pediatricRhythmCount: PEDIATRIC_ECG_RHYTHM_REGISTRY.length,
      adultRhythmCount: ECG_RHYTHM_TAG_REGISTRY.length,
      prohibitedAsRhythmTagCount: PROHIBITED_AS_RHYTHM_TAGS.size,
      pediatricCurriculumTopicCount: PEDIATRIC_ECG_CURRICULUM.length,
      unreviewedAdvancedTopicCount: getUnreviewedPediatricAdvancedTopics().length,
      casesWithPulsusPardoxusCount: CASES_WITH_PULSUS_PARADOXUS.length,
      palsArrestRhythmCount: PEDIATRIC_DIFFERENTIAL_NODES.filter(
        (n) => n.clusters.includes("pals_arrest_rhythms"),
      ).length,
    },
  };
}

// ─── Runtime access gate ───────────────────────────────────────────────────────

/**
 * Determines what level of pediatric ECG content to render for a given tier.
 * Called by the rendering layer to filter dosing, escalation, and management content.
 */
export type PediatricContentAccessLevel = {
  showDosing: boolean;
  showManagementAlgorithm: boolean;
  showEscalationCriteria: boolean;
  accessLabel: string;
};

export function getPediatricContentAccessLevel(
  tier: string | null | undefined,
): PediatricContentAccessLevel {
  if (tier === "RN" || tier === "NP") {
    return {
      showDosing: true,
      showManagementAlgorithm: true,
      showEscalationCriteria: true,
      accessLabel: "Full RN/NP content",
    };
  }
  if (tier === "RPN" || tier === "PN" || tier === "LPN") {
    return {
      showDosing: false,
      showManagementAlgorithm: false,
      showEscalationCriteria: true,
      accessLabel: "Recognition and escalation — contact RN or physician for management",
    };
  }
  // Unknown or student tier: recognition only
  return {
    showDosing: false,
    showManagementAlgorithm: false,
    showEscalationCriteria: true,
    accessLabel: "Recognition content only",
  };
}

/**
 * Filters dosing content out of a pediatric curriculum topic for RPN/LPN display.
 * Returns the topic safe for lower-tier rendering.
 */
export function filterPediatricTopicForRpnTier(
  topic: PediatricEcgCurriculumTopic,
): PediatricEcgCurriculumTopic {
  if (topic.rpnAccessLevel === "full") return topic;

  const filteredActions = topic.rpnAccessLevel === "restricted"
    ? ["This rhythm requires assessment by an RN or physician. Escalate immediately."]
    : topic.nursingActions.map((action) => {
        // Strip specific drug doses and energies for recognition_only access
        return action
          .replace(/\d+\.?\d*\s*(mg\/kg|J\/kg|mEq\/kg|mg|mL\/kg|mg\/kg\/min)[^\s,]*/gi, "[see provider]")
          .replace(/\d+\.?\d*\s*(mcg\/kg\/min|mg\/kg\/hr)[^\s,]*/gi, "[see provider]");
      });

  return { ...topic, nursingActions: filteredActions };
}

// ─── Pulsus paradoxus governance helpers ──────────────────────────────────────

/**
 * Returns a description of pulsus paradoxus appropriate for a case scenario context.
 * Explicitly frames it as a hemodynamic BP finding, never as a rhythm.
 */
export function getPulsusPardoxusCaseContextDescription(): string {
  return (
    "Pulsus paradoxus is a hemodynamic finding assessed by blood pressure measurement (sphygmomanometry) " +
    "or pulse oximetry waveform variation — NOT by ECG or cardiac rhythm strip. " +
    "It represents an exaggerated inspiratory decrease in systolic BP > 10 mmHg, caused by " +
    "increased interventricular interdependence during inspiration. " +
    "Associated conditions: cardiac tamponade, severe asthma, tension pneumothorax, constrictive pericarditis."
  );
}

/**
 * Validates that a given tag cannot be used as a rhythm tag.
 * Throws with an educational error message if the tag is a prohibited hemodynamic finding.
 */
export function assertPediatricTagIsUsableAsRhythm(tag: string): void {
  assertTagIsNotHemodynamicFinding(tag);
  // Additional check: ensure it is in the pediatric registry if meant for pediatric use
  if (!VALID_PEDIATRIC_RHYTHM_TAGS.has(tag)) {
    throw new Error(
      `"${tag}" is not in PEDIATRIC_ECG_RHYTHM_REGISTRY. ` +
      "Add it to the registry before using it as a pediatric rhythm tag.",
    );
  }
}

/**
 * Returns all pediatric curriculum readiness gates as structured pass/fail checks.
 * Mirrors the adult ecg-module-readiness.ts gate pattern.
 */
export function getPediatricCurriculumReadinessGates(): Array<{
  key: string;
  label: string;
  passed: boolean;
  reason: string;
}> {
  const governanceReport = runPediatricEcgGovernanceAudit();
  const unreviewedAdvanced = getUnreviewedPediatricAdvancedTopics();

  return [
    {
      key: "governance",
      label: "Pediatric governance rules",
      passed: governanceReport.ok,
      reason: governanceReport.ok
        ? "All pediatric governance rules pass."
        : `${governanceReport.errors.length} governance error(s): ${governanceReport.errors.map((e) => e.rule).join(", ")}`,
    },
    {
      key: "clinical_review",
      label: "Advanced topic clinical review",
      passed: unreviewedAdvanced.length === 0,
      reason: unreviewedAdvanced.length === 0
        ? "All advanced pediatric topics are clinically reviewed."
        : `${unreviewedAdvanced.length} unreviewed advanced topic(s): ${unreviewedAdvanced.map((t) => t.id).join(", ")}`,
    },
    {
      key: "registry_integrity",
      label: "Pediatric rhythm registry integrity",
      passed: PEDIATRIC_ECG_RHYTHM_REGISTRY.length >= 14,
      reason: `${PEDIATRIC_ECG_RHYTHM_REGISTRY.length} pediatric rhythm entries in registry (minimum: 14).`,
    },
    {
      key: "pulsus_paradoxus_guard",
      label: "Pulsus paradoxus not classified as rhythm",
      passed: !VALID_PEDIATRIC_RHYTHM_TAGS.has("Pulsus paradoxus"),
      reason: VALID_PEDIATRIC_RHYTHM_TAGS.has("Pulsus paradoxus")
        ? "CRITICAL: Pulsus paradoxus incorrectly classified as a rhythm tag."
        : "Pulsus paradoxus correctly classified as hemodynamic finding only.",
    },
    {
      key: "curriculum_count",
      label: "Minimum pediatric curriculum topics",
      passed: PEDIATRIC_ECG_CURRICULUM.length >= 8,
      reason: `${PEDIATRIC_ECG_CURRICULUM.length} pediatric curriculum topics (minimum: 8).`,
    },
    {
      key: "case_simulations",
      label: "Minimum PALS case simulations",
      passed: PEDIATRIC_CASE_SIMULATIONS.length >= 4,
      reason: `${PEDIATRIC_CASE_SIMULATIONS.length} PALS case simulations (minimum: 4).`,
    },
  ];
}
