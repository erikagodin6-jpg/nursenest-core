/**
 * CNPLE domain readiness scoring from learner topic history.
 *
 * Computes per-domain readiness across the five CNPLE competency areas:
 *   1. Diagnostics & Assessment
 *   2. Prescribing & Pharmacology
 *   3. Lifespan Care
 *   4. Escalation & Referral
 *   5. Clinical Judgment
 *
 * Input: aggregated UserTopicStat rows (no DB calls here).
 * Output: CnpleReadinessReport — safe to cache and include in study-plan API.
 */

import type { CnpleDomainCode } from "@/lib/remediation/topic-taxonomy";
import {
  CNPLE_DOMAIN_META,
  canonicalEntriesForDomain,
  resolveCanonicalTopic,
} from "@/lib/remediation/topic-taxonomy";
import { presentCnpleReadinessForPathway } from "@/lib/testing/policies/readiness-policy";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

export type CnpleDomainReadiness = {
  domain: CnpleDomainCode;
  label: string;
  correctCount: number;
  attemptCount: number;
  /** Raw miss rate 0–1 (recency-adjusted). */
  missRate: number;
  /** 0–100 readiness score (higher = better prepared). */
  readinessScore: number;
  readinessLevel: "ready" | "developing" | "needs_work";
  /** Topics where miss rate < 20% and attempts ≥ 3. */
  strongTopics: string[];
  /** Topics where miss rate > 40%. */
  weakTopics: string[];
  /** Prescribing-safety topics that are currently weak. */
  prescribingSafetyFlags: string[];
};

export type CnpleReadinessReport = {
  generatedAt: string;
  /** 0–100 weighted across all domains. */
  overallReadinessScore: number;
  domains: Record<CnpleDomainCode, CnpleDomainReadiness>;
  /**
   * Canonical topic IDs with critical danger level AND miss rate > 40%.
   * These must surface first in any remediation queue.
   */
  criticalGaps: string[];
  /**
   * True only when: no critical gaps AND every domain is "ready" or "developing",
   * AND prescribing domain is "ready" (safety gating).
   */
  readyForExam: boolean;
};

/** Caller-supplied topic stat (mirrors UserTopicStat Prisma model fields). */
export type TopicStatInput = {
  topic: string;
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastWrongAt: Date | null;
};

const ALL_DOMAINS: CnpleDomainCode[] = [
  "diagnostics",
  "prescribing",
  "lifespan_care",
  "escalation_referral",
  "clinical_judgment",
];

/**
 * Recency weight for a miss: decays over 30 days.
 * Recent misses carry full weight; old misses count at 50%.
 */
function recencyWeight(lastWrongAt: Date | null): number {
  if (!lastWrongAt) return 0;
  const ageDays = (Date.now() - lastWrongAt.getTime()) / 86_400_000;
  if (ageDays > 30) return 0.5;
  if (ageDays > 14) return 0.75;
  return 1.0;
}

/**
 * Compute the adjusted miss rate for a topic incorporating:
 *
 *  1. Recency weight — old misses count at 50%.
 *  2. Wrong-streak penalty — active repeat failures increase effective miss rate:
 *       streak=1 → +5%, streak=2 → +10%, streak≥3 → +15% (capped).
 *  3. Prescribing-safety amplifier — pharmacology/dosing/controlled-substance misses
 *       carry 20% extra weight to reflect real-world consequence severity.
 *  4. Recent-trend softener — when the learner is demonstrating clear recovery
 *       (correctRate > 75%, no active streak, ≥5 attempts) the miss rate is
 *       softened by up to 8% to avoid over-penalising historical data.
 *
 * Output is clamped to [0, 1]. The formula is deterministic and monotonic:
 * more recent misses and higher streaks always increase the adjusted rate.
 */
function adjustedMissRate(
  stat: TopicStatInput,
  prescribingSafety: boolean,
): number {
  const rawAttempts = stat.correctCount + stat.wrongCount;
  if (rawAttempts === 0) return 0;

  const rw = recencyWeight(stat.lastWrongAt);
  const baseMissRate = (stat.wrongCount * rw) / rawAttempts;

  // (2) Wrong-streak penalty — monotonically increasing, capped at 15%.
  const streakPenalty = Math.min(stat.wrongStreak * 0.05, 0.15);

  // (3) Prescribing-safety amplifier — applied to the post-streak miss rate.
  const amplifier = prescribingSafety ? 1.2 : 1.0;

  // (4) Recent-trend softener — only when clearly improving and no active streak.
  const correctRate = stat.correctCount / rawAttempts;
  const trendBonus =
    correctRate > 0.75 && stat.wrongStreak === 0 && rawAttempts >= 5 ? 0.08 : 0;

  const raw = (baseMissRate + streakPenalty - trendBonus) * amplifier;
  return Math.max(0, Math.min(1, raw));
}

/**
 * Compute CNPLE readiness from topic stats.
 * Pure function — all DB reads must be done by the caller.
 */
export function computeCnpleReadiness(topicStats: TopicStatInput[]): CnpleReadinessReport {
  let totalCorrect = 0;
  let totalAttempts = 0;
  const criticalGaps: string[] = [];

  const domains = {} as Record<CnpleDomainCode, CnpleDomainReadiness>;

  for (const domain of ALL_DOMAINS) {
    const meta = CNPLE_DOMAIN_META[domain];
    const entries = canonicalEntriesForDomain(domain);
    const entryIds = new Set(entries.map((e) => e.id));

    let domainCorrect = 0;
    let domainAttempts = 0;
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];
    const prescribingSafetyFlags: string[] = [];

    for (const stat of topicStats) {
      const entry = resolveCanonicalTopic(stat.topic);
      if (!entry || !entryIds.has(entry.id)) continue;

      const rawAttempts = stat.correctCount + stat.wrongCount;
      if (rawAttempts === 0) continue;

      const missRate = adjustedMissRate(stat, entry.prescribingSafety === true);

      domainCorrect += stat.correctCount;
      domainAttempts += rawAttempts;

      if (missRate > 0.4) {
        weakTopics.push(entry.label);
        if (entry.prescribingSafety) prescribingSafetyFlags.push(entry.label);
        if (entry.dangerLevel === "critical") criticalGaps.push(entry.id);
      } else if (missRate < 0.2 && rawAttempts >= 3) {
        strongTopics.push(entry.label);
      }
    }

    totalCorrect += domainCorrect;
    totalAttempts += domainAttempts;

    const rawMissRate =
      domainAttempts > 0 ? (domainAttempts - domainCorrect) / domainAttempts : 0.5;
    const readinessScore = Math.round(Math.max(0, Math.min(100, (1 - rawMissRate) * 100)));

    const passingPct = Math.round(meta.passingThreshold * 100);
    let readinessLevel: CnpleDomainReadiness["readinessLevel"];
    if (readinessScore >= passingPct + 8) {
      readinessLevel = "ready";
    } else if (readinessScore >= passingPct - 10) {
      readinessLevel = "developing";
    } else {
      readinessLevel = "needs_work";
    }

    domains[domain] = {
      domain,
      label: meta.label,
      correctCount: domainCorrect,
      attemptCount: domainAttempts,
      missRate: rawMissRate,
      readinessScore,
      readinessLevel,
      strongTopics,
      weakTopics,
      prescribingSafetyFlags,
    };
  }

  const overallReadinessScore =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Prescribing must be "ready" (safety gate) before declaring exam-ready.
  const prescribingLevel = domains["prescribing"]?.readinessLevel;
  const readyForExam =
    criticalGaps.length === 0 &&
    prescribingLevel === "ready" &&
    ALL_DOMAINS.every((d) => domains[d]?.readinessLevel !== "needs_work");

  return {
    generatedAt: new Date().toISOString(),
    overallReadinessScore,
    domains,
    criticalGaps,
    readyForExam,
  };
}

/**
 * Summarize a readiness report for API/UI consumption.
 * Returns ordered domains (weakest first) and top critical gaps.
 */
export function summarizeReadinessReport(report: CnpleReadinessReport): {
  orderedDomains: CnpleDomainReadiness[];
  topCriticalGaps: string[];
  prescribingSafetyWarnings: string[];
} {
  const orderedDomains = ALL_DOMAINS.map((d) => report.domains[d]).sort(
    (a, b) => a.readinessScore - b.readinessScore,
  );

  const prescribingSafetyWarnings = ALL_DOMAINS.flatMap(
    (d) => report.domains[d]?.prescribingSafetyFlags ?? [],
  );

  return {
    orderedDomains,
    topCriticalGaps: report.criticalGaps.slice(0, 5),
    prescribingSafetyWarnings,
  };
}

/** Governed presentation wrapper — delegates pass-outlook framing to readiness-policy. */
export function presentGovernedCnpleReadinessReport(report: CnpleReadinessReport) {
  const summary = summarizeReadinessReport(report);
  const presentation = presentCnpleReadinessForPathway(CNPLE_PATHWAY_ID, report);
  return { ...summary, presentation };
}
