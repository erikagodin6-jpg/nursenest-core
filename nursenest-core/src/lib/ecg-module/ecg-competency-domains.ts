/**
 * ECG Competency Domain System
 *
 * Separates ECG mastery into eight clinically distinct competency areas.
 * Each domain maps to a specific set of curriculum topics and tracks
 * mastery independently — a learner may be "proficient" in rhythm recognition
 * but "struggling" in STEMI localization.
 *
 * Architecture:
 *   - Domains are the unit of spaced-repetition scheduling
 *   - Clinical readiness scores are computed per-domain
 *   - NCLEX ECG readiness requires minimum threshold across all domains
 *   - ACLS readiness requires "proficient" or higher on critical domains
 *
 * Domain selection rationale:
 *   The eight domains correspond to the discrete clinical judgment areas tested
 *   by NCLEX-RN ECG items, ACLS provider certification, and bedside telemetry
 *   competency checklists (AHA 2023, AACN CCRN exam blueprint 2024).
 */

import { ECG_FULL_CURRICULUM, type EcgRemediationPriority } from "@/lib/ecg-module/ecg-curriculum-config";

// ─── Domain definitions ────────────────────────────────────────────────────────

export type EcgCompetencyDomainId =
  | "rhythm_recognition"
  | "interval_analysis"
  | "ischemia_stemi"
  | "acls_critical_rhythms"
  | "telemetry_interpretation"
  | "conduction_disorders"
  | "paced_rhythms"
  | "electrolyte_abnormalities";

export type EcgCompetencyDomain = {
  id: EcgCompetencyDomainId;
  label: string;
  description: string;
  /**
   * Curriculum topic IDs that contribute to this domain's mastery score.
   * Mastery score = weighted average of topic scores within the domain.
   */
  topicIds: readonly string[];
  /**
   * Clinical importance weight [1–5].
   * Used to weight domains in the overall ECG readiness score.
   *   5 = patient-safety critical (ACLS, STEMI)
   *   4 = high-yield NCLEX + bedside
   *   3 = standard clinical competency
   *   2 = supplementary
   */
  clinicalWeight: 1 | 2 | 3 | 4 | 5;
  /** Minimum score [0–1] required to reach "proficient" state in this domain. */
  proficiencyThreshold: number;
  /** Score at which this domain is considered "mastered" in the adaptive queue. */
  masteryThreshold: number;
  /** Whether this domain is required for ACLS-readiness certification. */
  requiredForAcls: boolean;
  /** Whether this domain is required for NCLEX ECG readiness. */
  requiredForNclex: boolean;
  /** Remediation priority when a learner is weak in this domain. */
  remediationPriority: EcgRemediationPriority;
};

export const ECG_COMPETENCY_DOMAINS: readonly EcgCompetencyDomain[] = [
  {
    id: "rhythm_recognition",
    label: "Rhythm Recognition",
    description: "Identifies common cardiac rhythms from 6-second strips: NSR, sinus brady/tach, AFib, AFL, junctional, escape rhythms.",
    topicIds: ["rate", "rhythm", "p-waves", "rhythm-diagnosis"],
    clinicalWeight: 4,
    proficiencyThreshold: 0.75,
    masteryThreshold: 0.90,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "high",
  },
  {
    id: "interval_analysis",
    label: "Interval Analysis",
    description: "Measures and interprets PR interval, QRS width, QT/QTc accurately from the strip without categorical shortcuts.",
    topicIds: ["pr-interval", "qrs", "qt-qtc"],
    clinicalWeight: 4,
    proficiencyThreshold: 0.78,
    masteryThreshold: 0.90,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "high",
  },
  {
    id: "ischemia_stemi",
    label: "Ischemia & STEMI Interpretation",
    description: "Identifies ST elevation, reciprocal changes, hyperacute T-waves, Wellens pattern, and localizes culprit coronary territory.",
    topicIds: ["st-t-changes", "stemi-localization", "ischemia-injury-infarction"],
    clinicalWeight: 5,
    proficiencyThreshold: 0.80,
    masteryThreshold: 0.92,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "critical",
  },
  {
    id: "acls_critical_rhythms",
    label: "ACLS-Critical Rhythm Recognition",
    description: "Identifies and correctly differentiates VT, VF, PEA, asystole, torsades, and the wide-complex tachycardia differential.",
    topicIds: ["rhythm-diagnosis", "torsades", "av-blocks-advanced", "wpw", "brugada"],
    clinicalWeight: 5,
    proficiencyThreshold: 0.82,
    masteryThreshold: 0.93,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "critical",
  },
  {
    id: "telemetry_interpretation",
    label: "Telemetry & Bedside Monitoring",
    description: "Distinguishes artifact from true arrhythmias, recognizes rate-related changes, understands alarm context in the ICU/step-down environment.",
    topicIds: ["icu-telemetry", "rhythm-diagnosis", "rate"],
    clinicalWeight: 4,
    proficiencyThreshold: 0.76,
    masteryThreshold: 0.88,
    requiredForAcls: false,
    requiredForNclex: true,
    remediationPriority: "high",
  },
  {
    id: "conduction_disorders",
    label: "Conduction Disorders & Blocks",
    description: "Identifies first-, second- (Mobitz I/II), and third-degree AV blocks; recognizes RBBB and LBBB morphology; applies Sgarbossa criteria.",
    topicIds: ["pr-interval", "qrs", "av-blocks-advanced", "bundle-branch-blocks"],
    clinicalWeight: 4,
    proficiencyThreshold: 0.78,
    masteryThreshold: 0.90,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "critical",
  },
  {
    id: "paced_rhythms",
    label: "Pacemaker & Device Interpretation",
    description: "Identifies ventricular and dual-chamber pacing, recognizes failure-to-capture, failure-to-pace, and failure-to-sense patterns.",
    topicIds: ["paced-rhythms", "qrs"],
    clinicalWeight: 3,
    proficiencyThreshold: 0.75,
    masteryThreshold: 0.88,
    requiredForAcls: false,
    requiredForNclex: true,
    remediationPriority: "high",
  },
  {
    id: "electrolyte_abnormalities",
    label: "Electrolyte-Induced ECG Changes",
    description: "Identifies hyperkalemia progression (peaked T → sine wave), hypokalemia (flat T, prominent U), hypocalcemia flat ST, and QT-prolonging drug effects.",
    topicIds: ["electrolyte-ecg", "qt-qtc", "torsades"],
    clinicalWeight: 4,
    proficiencyThreshold: 0.77,
    masteryThreshold: 0.89,
    requiredForAcls: true,
    requiredForNclex: true,
    remediationPriority: "critical",
  },
] as const;

// ─── Domain lookup utilities ───────────────────────────────────────────────────

export function getEcgCompetencyDomain(id: EcgCompetencyDomainId): EcgCompetencyDomain | undefined {
  return ECG_COMPETENCY_DOMAINS.find((d) => d.id === id);
}

/** Returns which domains are required for a given certification type. */
export function getEcgDomainsForCertification(
  cert: "acls" | "nclex",
): EcgCompetencyDomain[] {
  return ECG_COMPETENCY_DOMAINS.filter((d) =>
    cert === "acls" ? d.requiredForAcls : d.requiredForNclex,
  );
}

/** Returns domains that contain a given curriculum topic ID. */
export function getEcgDomainsForTopic(topicId: string): EcgCompetencyDomain[] {
  return ECG_COMPETENCY_DOMAINS.filter((d) => d.topicIds.includes(topicId));
}

/**
 * Returns the weighted overall ECG readiness score [0–1] from per-domain scores.
 *
 * @param domainScores - Map of domainId → accuracy score [0–1]
 * @param missingDomainsScore - Score assigned to domains not yet attempted (default 0)
 */
export function computeEcgOverallReadinessScore(
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
  missingDomainsScore = 0,
): number {
  const totalWeight = ECG_COMPETENCY_DOMAINS.reduce((s, d) => s + d.clinicalWeight, 0);
  const weightedSum = ECG_COMPETENCY_DOMAINS.reduce((s, d) => {
    const score = domainScores[d.id] ?? missingDomainsScore;
    return s + score * d.clinicalWeight;
  }, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * ACLS readiness: all ACLS-required domains at proficiency threshold or above.
 */
export function isEcgAclsReady(
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
): boolean {
  return getEcgDomainsForCertification("acls").every((d) => {
    const score = domainScores[d.id] ?? 0;
    return score >= d.proficiencyThreshold;
  });
}

/**
 * NCLEX ECG readiness: all NCLEX-required domains at proficiency threshold or above.
 */
export function isEcgNclexReady(
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
): boolean {
  return getEcgDomainsForCertification("nclex").every((d) => {
    const score = domainScores[d.id] ?? 0;
    return score >= d.proficiencyThreshold;
  });
}

/**
 * Returns the weakest domains, sorted by score ascending.
 * Used to prioritize adaptive queue scheduling.
 */
export function getWeakEcgDomains(
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
  threshold = 0.70,
): EcgCompetencyDomain[] {
  return ECG_COMPETENCY_DOMAINS
    .filter((d) => (domainScores[d.id] ?? 0) < threshold)
    .sort((a, b) => (domainScores[a.id] ?? 0) - (domainScores[b.id] ?? 0));
}

/**
 * Validates that all topicIds in ECG_COMPETENCY_DOMAINS exist in ECG_FULL_CURRICULUM.
 * Returns array of missing topic IDs. Called by contract tests.
 */
export function validateEcgCompetencyDomainTopics(): string[] {
  const allTopicIds = new Set(ECG_FULL_CURRICULUM.map((t) => t.id));
  const missing: string[] = [];
  for (const domain of ECG_COMPETENCY_DOMAINS) {
    for (const topicId of domain.topicIds) {
      if (!allTopicIds.has(topicId)) {
        missing.push(`domain "${domain.id}": topicId "${topicId}" not in ECG_FULL_CURRICULUM`);
      }
    }
  }
  return missing;
}
