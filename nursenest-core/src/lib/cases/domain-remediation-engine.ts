/**
 * Domain remediation engine — Phase 5.
 *
 * Provides confidence-weighted weak-domain inference, distinguishing
 * isolated mistakes from repeated unsafe reasoning patterns.
 * Integrates prescribing risk weighting and longitudinal penalties.
 */
import type {
  CaseDecisionRecord,
  CaseStepConsequence,
  RemediationPriority,
  RemediationPriorityEntry,
  RemediationPriorityMap,
  PrescribingRiskSeverity,
} from "@/lib/cases/longitudinal-case-types";
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";

// ── Confidence weights ────────────────────────────────────────────────────────

/** Error weight by trajectory label. Harmful errors count more than suboptimal. */
const TRAJECTORY_ERROR_WEIGHT: Record<CaseStepConsequence["trajectory"], number> = {
  optimal: 0,
  acceptable: 0,     // Acceptable is not counted as an error for remediation
  suboptimal: 1.0,
  harmful: 2.5,
};

/**
 * Prescribing risk multiplier applied when the domain is pharmacotherapeutics
 * and a high/critical prescribing error was made.
 */
const PRESCRIBING_RISK_MULTIPLIER: Record<PrescribingRiskSeverity, number> = {
  low: 1.0,
  moderate: 1.3,
  high: 1.8,
  critical: 2.5,
};

// ── Pattern vs isolated detection ────────────────────────────────────────────

/** Minimum weighted error score to classify as a "pattern" rather than isolated mistake. */
const PATTERN_THRESHOLD = 3.0;

// ── Priority thresholds ───────────────────────────────────────────────────────

function assignPriority(weightedScore: number, isPattern: boolean): RemediationPriority {
  if (isPattern && weightedScore >= 4.0) return "urgent";
  if (weightedScore >= 3.5 || (isPattern && weightedScore >= 2.5)) return "high";
  if (weightedScore >= 1.5) return "moderate";
  return "low";
}

// ── Core engine ───────────────────────────────────────────────────────────────

/**
 * Builds a confidence-weighted remediation priority map from all decisions.
 *
 * For each domain:
 * 1. Accumulates weighted error scores (harmful > suboptimal; isolated vs pattern)
 * 2. Applies prescribing risk multiplier where applicable
 * 3. Applies a longitudinal penalty if the same domain appeared twice with errors
 * 4. Classifies as isolated vs pattern
 * 5. Assigns priority: urgent / high / moderate / low
 */
export function buildRemediationPriorityMap(
  decisions: CaseDecisionRecord[],
): RemediationPriorityMap {
  // Per-domain accumulation
  const domainData: Partial<Record<CnpleDomainSlug, {
    errorCount: number;
    weightedScore: number;
    consecutive: number;     // Consecutive errors in this domain
    maxPrescribingRisk: PrescribingRiskSeverity | null;
    trajectories: CaseStepConsequence["trajectory"][];
  }>> = {};

  let prevDomain: CnpleDomainSlug | null = null;

  for (const d of decisions) {
    const weight = TRAJECTORY_ERROR_WEIGHT[d.trajectory];
    if (weight === 0) {
      prevDomain = d.cnpleDomainSlug;
      continue; // No error contribution from optimal/acceptable
    }

    const existing = domainData[d.cnpleDomainSlug] ?? {
      errorCount: 0,
      weightedScore: 0,
      consecutive: 0,
      maxPrescribingRisk: null,
      trajectories: [],
    };

    // Consecutive error bonus in same domain
    const consecutive = prevDomain === d.cnpleDomainSlug ? existing.consecutive + 1 : 0;
    const consecutiveBonus = consecutive >= 1 ? 0.5 : 0;

    // Prescribing risk multiplier
    const prescribingMult =
      d.prescribingRiskSeverity
        ? PRESCRIBING_RISK_MULTIPLIER[d.prescribingRiskSeverity]
        : 1.0;

    const contribution = (weight + consecutiveBonus) * prescribingMult;

    domainData[d.cnpleDomainSlug] = {
      errorCount: existing.errorCount + 1,
      weightedScore: existing.weightedScore + contribution,
      consecutive,
      maxPrescribingRisk: higherPrescribingRisk(
        existing.maxPrescribingRisk,
        d.prescribingRiskSeverity ?? null,
      ),
      trajectories: [...existing.trajectories, d.trajectory],
    };

    prevDomain = d.cnpleDomainSlug;
  }

  // Convert to priority entries
  const entries: RemediationPriorityEntry[] = [];
  for (const [slug, data] of Object.entries(domainData) as [CnpleDomainSlug, NonNullable<typeof domainData[CnpleDomainSlug]>][]) {
    if (!data || data.errorCount === 0) continue;

    const isPattern = data.weightedScore >= PATTERN_THRESHOLD;
    const priority = assignPriority(data.weightedScore, isPattern);

    entries.push({
      domain: slug,
      priority,
      errorCount: data.errorCount,
      isPattern,
      prescribingRisk: data.maxPrescribingRisk ?? undefined,
    });
  }

  // Sort: urgent first, then by weighted score descending
  entries.sort((a, b) => {
    const order: Record<RemediationPriority, number> = { urgent: 4, high: 3, moderate: 2, low: 1 };
    return order[b.priority] - order[a.priority];
  });

  return entries;
}

// ── Weak / strong domain classification ──────────────────────────────────────

/**
 * Derives weak and strong domain arrays from the priority map.
 * Replaces the simple <60% accuracy heuristic with confidence-weighted classification.
 */
export function deriveWeakAndStrongDomains(
  decisions: CaseDecisionRecord[],
  priorityMap: RemediationPriorityMap,
): { weakDomains: CnpleDomainSlug[]; strongDomains: CnpleDomainSlug[] } {
  const weakDomains = priorityMap
    .filter((e) => e.priority === "urgent" || e.priority === "high")
    .map((e) => e.domain);

  // Strong = appeared at least once, zero errors, not in weak list
  const domainsWithErrors = new Set(priorityMap.map((e) => e.domain));
  const allDomains = new Set(decisions.map((d) => d.cnpleDomainSlug));
  const strongDomains = [...allDomains].filter(
    (d) => !domainsWithErrors.has(d) && !weakDomains.includes(d),
  );

  return { weakDomains, strongDomains };
}

// ── Remediation recommendations ───────────────────────────────────────────────

/**
 * Generates targeted recommendations based on the priority map.
 * More precise than the generic recommendations in the base engine.
 */
export function buildTargetedRecommendations(
  score: number,
  priorityMap: RemediationPriorityMap,
  harmfulCount: number,
): string[] {
  const recs: string[] = [];

  const urgentEntries = priorityMap.filter((e) => e.priority === "urgent");
  const patternEntries = priorityMap.filter((e) => e.isPattern);

  if (urgentEntries.length > 0) {
    const domains = urgentEntries.map((e) => e.domain.replace(/-/g, " ")).join(", ");
    recs.push(`Urgent remediation needed in: ${domains}. Complete the linked lesson before reattempting.`);
  }

  if (harmfulCount > 0) {
    recs.push(
      harmfulCount === 1
        ? "One decision led to a harmful patient outcome — review that step's rationale carefully."
        : `${harmfulCount} decisions led to harmful outcomes. Review each rationale and link to relevant lessons.`,
    );
  }

  if (patternEntries.length > 0 && urgentEntries.length === 0) {
    const domains = patternEntries.map((e) => e.domain.replace(/-/g, " ")).join(", ");
    recs.push(`Repeated errors in: ${domains} — this is a reasoning pattern, not an isolated mistake. Targeted flashcard review is recommended.`);
  }

  const prescribingPatterns = priorityMap.filter(
    (e) => e.prescribingRisk === "high" || e.prescribingRisk === "critical",
  );
  if (prescribingPatterns.length > 0) {
    recs.push("High-severity prescribing errors detected. Review the prescribing safety flashcard deck and renal/hepatic dosing guides.");
  }

  if (score >= 80 && priorityMap.length === 0) {
    recs.push("Strong performance. Attempt a higher-difficulty case to continue building clinical judgment depth.");
  } else if (score >= 65 && urgentEntries.length === 0) {
    recs.push("Good performance. Targeted review of your moderate-priority domains will strengthen readiness.");
  } else if (score < 50) {
    recs.push("Case score below 50% — complete the linked lesson module for this case before retrying.");
  }

  return recs;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function higherPrescribingRisk(
  a: PrescribingRiskSeverity | null,
  b: PrescribingRiskSeverity | null,
): PrescribingRiskSeverity | null {
  if (!a) return b;
  if (!b) return a;
  const rank = { low: 1, moderate: 2, high: 3, critical: 4 };
  return rank[a] >= rank[b] ? a : b;
}
