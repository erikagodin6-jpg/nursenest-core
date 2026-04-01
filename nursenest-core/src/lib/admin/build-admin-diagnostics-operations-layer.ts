import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { AdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import type { QuestionBankRemediationIntelligence } from "@/lib/questions/load-question-bank-remediation-intelligence";

export type OperationsSeverity = "critical" | "high" | "medium";

export type OperationsPriorityIssue = {
  id: string;
  title: string;
  detail?: string;
  severity: OperationsSeverity;
  /** True when the issue is likely to erode trust, checkout, or perceived quality. */
  conversionRisk: boolean;
  category: "infrastructure" | "question_bank" | "pathway" | "coverage";
  action: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** Higher sorts first within the same severity band. */
  impactRank: number;
};

export type OperationsScoreDriver = {
  id: string;
  label: string;
  direction: "negative" | "positive";
  /**
   * Negative: points deducted from the 100 baseline (same units as readiness math).
   * Positive: relative strength 1–10 for ranking only (not added into the score formula).
   */
  weight: number;
  severity: OperationsSeverity | "low";
};

export type ReadinessTrend =
  | { available: false; reason: string }
  | {
      available: true;
      direction: "improving" | "stable" | "worsening";
      delta: number;
      priorScore: number;
      priorRecordedAt: string;
    };

export type AdminDiagnosticsOperationsLayer = {
  readinessScore: number;
  readinessSummary: string;
  /** One-line, admin-facing explanation of the largest score deductions. */
  readinessExplanation: string;
  scoreDrivers: {
    negative: OperationsScoreDriver[];
    positive: OperationsScoreDriver[];
  };
  readinessTrend: ReadinessTrend;
  priorityIssues: OperationsPriorityIssue[];
};

export type BuildAdminDiagnosticsOperationsOptions = {
  /** Prior score from instance cache (if any) to compute a lightweight trend. */
  priorReadiness?: { score: number; recordedAt: string } | null;
};

const SEVERITY_RANK: Record<OperationsSeverity, number> = {
  critical: 3,
  high: 2,
  medium: 1,
};

function severitySort(a: OperationsPriorityIssue, b: OperationsPriorityIssue): number {
  const dr = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  if (dr !== 0) return dr;
  return b.impactRank - a.impactRank;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function questionsHrefTopic(topic: string | null): string {
  const t = (topic ?? "").trim();
  if (!t) return "/admin/questions";
  return `/admin/questions?topic=${encodeURIComponent(t)}`;
}

function pushNegative(
  drivers: OperationsScoreDriver[],
  id: string,
  label: string,
  points: number,
  severity: OperationsSeverity,
): void {
  if (points <= 0) return;
  drivers.push({
    id,
    label,
    direction: "negative",
    weight: Math.round(points * 10) / 10,
    severity,
  });
}

function computeReadinessTrend(currentScore: number, prior: { score: number; recordedAt: string } | null | undefined): ReadinessTrend {
  if (!prior) {
    return {
      available: false,
      reason: "No prior score on this instance yet — trend appears after a second diagnostics visit (or API call).",
    };
  }
  const delta = Math.round(currentScore) - prior.score;
  let direction: "improving" | "stable" | "worsening" = "stable";
  if (delta >= 2) direction = "improving";
  else if (delta <= -2) direction = "worsening";
  return {
    available: true,
    direction,
    delta,
    priorScore: prior.score,
    priorRecordedAt: prior.recordedAt,
  };
}

function buildReadinessExplanation(negative: OperationsScoreDriver[], finalScore: number): string {
  const top = [...negative].sort((a, b) => b.weight - a.weight).filter((d) => d.weight > 0).slice(0, 3);
  if (top.length === 0) {
    if (finalScore >= 92) return "Score stays high: no major automated deductions on this snapshot.";
    return "Deductions are minor; see score drivers below for the full breakdown.";
  }
  const parts = top.map((t) => `${t.label} (−${t.weight} pts)`);
  if (parts.length === 1) return `Score reduced mainly by ${parts[0]}.`;
  if (parts.length === 2) return `Score reduced mainly by ${parts[0]} and ${parts[1]}.`;
  return `Score reduced mainly by ${parts[0]}, ${parts[1]}, and ${parts[2]}.`;
}

function buildPositiveDrivers(d: AdminDiagnostics, pub: number, missingRat: number, emptyRegistryCount: number): OperationsScoreDriver[] {
  const out: OperationsScoreDriver[] = [];
  if (d.dbHealth.configured && d.dbHealth.status === "ok") {
    out.push({ id: "db_ok", label: "Database reachable", direction: "positive", weight: 7, severity: "low" });
  }
  if (d.apiHealth.probed && d.apiHealth.liveness.ok && d.apiHealth.readiness.ok) {
    out.push({ id: "api_ok", label: "Public health probes passing", direction: "positive", weight: 6, severity: "low" });
  }
  if (pub >= 500) {
    out.push({ id: "bank_depth", label: "Large published question bank", direction: "positive", weight: 8, severity: "low" });
  } else if (pub >= 120) {
    out.push({ id: "bank_moderate", label: "Published question bank established", direction: "positive", weight: 5, severity: "low" });
  } else if (pub > 0) {
    out.push({ id: "bank_present", label: "Published questions online", direction: "positive", weight: 3, severity: "low" });
  }
  if (d.counts.pathwayLessonsPublished >= 40) {
    out.push({ id: "pathways_depth", label: "Pathway lesson catalog populated", direction: "positive", weight: 7, severity: "low" });
  } else if (d.counts.pathwayLessonsPublished > 0) {
    out.push({ id: "pathways_present", label: "Some pathway lessons published", direction: "positive", weight: 4, severity: "low" });
  }
  if (pub > 0 && missingRat === 0) {
    out.push({ id: "rationale_complete", label: "No published items missing rationale", direction: "positive", weight: 8, severity: "low" });
  } else if (pub > 0 && missingRat > 0 && missingRat / pub < 0.03) {
    out.push({ id: "rationale_mostly", label: "Rationale coverage strong (>97% with text)", direction: "positive", weight: 5, severity: "low" });
  }
  if (d.weakCoverage.length === 0 && pub > 0) {
    out.push({ id: "topic_balance", label: "No thin-topic flags in sampled coverage list", direction: "positive", weight: 4, severity: "low" });
  }
  if (emptyRegistryCount === 0 && d.counts.pathwayLessonsPublished > 0) {
    out.push({ id: "pathways_registry", label: "All registered pathways have some lessons", direction: "positive", weight: 5, severity: "low" });
  }
  return out.sort((a, b) => b.weight - a.weight).slice(0, 5);
}

/**
 * Derives readiness score (0–100) and top priority issues from admin diagnostics (+ optional remediation intel).
 * Intended to layer on top of the raw diagnostics payload without replacing it.
 */
export function buildAdminDiagnosticsOperationsLayer(
  d: AdminDiagnostics,
  remediation: QuestionBankRemediationIntelligence | null,
  options?: BuildAdminDiagnosticsOperationsOptions,
): AdminDiagnosticsOperationsLayer {
  const issues: OperationsPriorityIssue[] = [];
  const negativeDrivers: OperationsScoreDriver[] = [];
  const pub = d.counts.questionsPublished;
  const missingRat = d.counts.questionsPublishedMissingRationale;
  const missingRatPct = pub > 0 ? (missingRat / pub) * 100 : 0;

  let score = 100;

  if (d.dbHealth.status === "error") {
    const pts = 28;
    score -= pts;
    pushNegative(negativeDrivers, "db_unhealthy", "Database health failure", pts, "critical");
    issues.push({
      id: "db_unhealthy",
      title: "Database health check failed",
      detail: d.dbHealth.error,
      severity: "critical",
      conversionRisk: true,
      category: "infrastructure",
      action: { label: "Open operations", href: "/admin/operations" },
      impactRank: 100,
    });
  }

  if (d.dbHealth.configured && d.dbHealth.status === "ok" && pub === 0) {
    const pts = 38;
    score -= pts;
    pushNegative(negativeDrivers, "zero_published_questions", "Empty published question bank", pts, "critical");
    issues.push({
      id: "zero_published_questions",
      title: "No published exam questions",
      detail: "Learners see an empty bank until questions are imported or promoted.",
      severity: "critical",
      conversionRisk: true,
      category: "question_bank",
      action: { label: "AI / import pipeline", href: "/admin/ai/exam-questions" },
      secondaryAction: { label: "Question editor", href: "/admin/questions" },
      impactRank: 95,
    });
  }

  if (d.apiHealth.probed) {
    if (!d.apiHealth.liveness.ok) {
      const pts = 12;
      score -= pts;
      pushNegative(negativeDrivers, "api_liveness", "API liveness probe failed", pts, "high");
      issues.push({
        id: "api_liveness",
        title: "Public API liveness probe failed",
        detail: d.apiHealth.liveness.error ?? `HTTP ${d.apiHealth.liveness.status ?? "—"}`,
        severity: "high",
        conversionRisk: true,
        category: "infrastructure",
        action: { label: "Operations", href: "/admin/operations" },
        impactRank: 72,
      });
    }
    if (!d.apiHealth.readiness.ok) {
      const pts = 12;
      score -= pts;
      pushNegative(negativeDrivers, "api_readiness", "Readiness probe failed", pts, "high");
      issues.push({
        id: "api_readiness",
        title: "Readiness endpoint unhealthy",
        detail: d.apiHealth.readiness.error ?? `HTTP ${d.apiHealth.readiness.status ?? "—"}`,
        severity: "high",
        conversionRisk: true,
        category: "infrastructure",
        action: { label: "Operations", href: "/admin/operations" },
        impactRank: 70,
      });
    }
  }

  if (d.counts.pathwayLessonsPublished === 0 && d.dbHealth.status === "ok") {
    const pts = 14;
    score -= pts;
    pushNegative(negativeDrivers, "no_pathway_lessons", "No published pathway lessons", pts, "high");
    issues.push({
      id: "no_pathway_lessons",
      title: "No published pathway lessons",
      detail: "Learning paths will look empty in the product.",
      severity: "high",
      conversionRisk: true,
      category: "pathway",
      action: { label: "Content & coverage", href: "/admin/content" },
      impactRank: 68,
    });
  }

  const pathwayPub = new Map(d.pathwayCounts.map((p) => [p.pathwayId, p.published]));
  const emptyRegistryPathways = EXAM_PATHWAYS.filter((p) => (pathwayPub.get(p.id) ?? 0) === 0).map((p) => p.displayName);
  if (emptyRegistryPathways.length > 0 && d.counts.pathwayLessonsPublished > 0) {
    const penalty = Math.min(10, emptyRegistryPathways.length * 2);
    score -= penalty;
    const sev: OperationsSeverity = emptyRegistryPathways.length >= 4 ? "high" : "medium";
    pushNegative(negativeDrivers, "pathways_empty_slices", "Registered pathways with zero lessons", penalty, sev);
    issues.push({
      id: "pathways_empty_slices",
      title: `${emptyRegistryPathways.length} registered pathway(s) have zero published lessons`,
      detail: emptyRegistryPathways.slice(0, 6).join(" · ") + (emptyRegistryPathways.length > 6 ? " …" : ""),
      severity: sev,
      conversionRisk: true,
      category: "pathway",
      action: { label: "Content & import", href: "/admin/content" },
      secondaryAction: { label: "Pathway lessons API", href: "/admin/lessons" },
      impactRank: 55 + Math.min(10, emptyRegistryPathways.length),
    });
  }

  if (missingRat > 0) {
    const sev: OperationsSeverity =
      missingRatPct >= 12 || missingRat >= 80 ? "high" : missingRatPct >= 4 || missingRat >= 15 ? "medium" : "medium";
    const pts = Math.min(22, missingRatPct * 0.35 + Math.min(8, missingRat / 25));
    score -= pts;
    pushNegative(negativeDrivers, "missing_rationale", "Published items missing rationale", pts, sev);
    issues.push({
      id: "published_missing_rationale",
      title: `${missingRat} published question(s) lack rationale`,
      detail:
        pub > 0
          ? `${missingRatPct.toFixed(1)}% of the published bank — hurts explanations and trust.`
          : undefined,
      severity: sev,
      conversionRisk: true,
      category: "question_bank",
      action: { label: "Question editor", href: "/admin/questions" },
      secondaryAction: { label: "Content quality", href: "/admin/content-quality" },
      impactRank: 62 + Math.min(15, Math.floor(missingRat / 10)),
    });
  }

  if (d.weakCoverage.length > 0) {
    const worst = d.weakCoverage[0];
    const topicLabel = worst.topic ?? "(untagged)";
    const pts = Math.min(12, 2 + d.weakCoverage.length * 0.35);
    score -= pts;
    const sev: OperationsSeverity = d.weakCoverage.length >= 12 ? "high" : "medium";
    pushNegative(negativeDrivers, "weak_topic_coverage", "Thin topic coverage (below threshold)", pts, sev);
    issues.push({
      id: "weak_topic_coverage",
      title: `${d.weakCoverage.length} topic(s) below ${d.weakCoverageThreshold} published questions`,
      detail: `Thinnest: ${topicLabel} (${worst.publishedQuestions} published).`,
      severity: sev,
      conversionRisk: true,
      category: "coverage",
      action: { label: "Open question queue", href: questionsHrefTopic(worst.topic) },
      secondaryAction: { label: "Import / AI questions", href: "/admin/ai/exam-questions" },
      impactRank: 48 + Math.min(12, d.weakCoverage.length),
    });
  }

  if (remediation?.np.belowFloor) {
    const pts = 8;
    score -= pts;
    pushNegative(negativeDrivers, "np_below_floor", "NP bank below floor target", pts, "high");
    issues.push({
      id: "np_below_floor",
      title: "NP question bank below configured floor",
      detail: `${remediation.np.published} published NP rows — coverage targets not met.`,
      severity: "high",
      conversionRisk: true,
      category: "question_bank",
      action: { label: "Question queue (NP)", href: "/admin/questions?exam=NP" },
      impactRank: 58,
    });
  }

  if (remediation?.alliedCanada.looksMisclassified) {
    const pts = 6;
    score -= pts;
    pushNegative(negativeDrivers, "allied_region_signal", "Allied region tagging inconsistency", pts, "high");
    issues.push({
      id: "allied_region_signal",
      title: "Allied Health region tagging looks inconsistent",
      detail: "CA vs US inventory may not match how the product surfaces exams.",
      severity: "high",
      conversionRisk: true,
      category: "question_bank",
      action: { label: "Review Allied questions", href: "/admin/questions?exam=ALLIED" },
      impactRank: 52,
    });
  }

  if (d.counts.lessonsContentItemsPublished === 0 && d.dbHealth.status === "ok" && pub > 0) {
    const pts = 5;
    score -= pts;
    pushNegative(negativeDrivers, "no_app_lessons", "No published app (content-item) lessons", pts, "medium");
    issues.push({
      id: "no_app_lessons",
      title: "No published app (content-item) lessons",
      severity: "medium",
      conversionRisk: false,
      category: "pathway",
      action: { label: "Content & coverage", href: "/admin/content" },
      impactRank: 28,
    });
  }

  issues.sort(severitySort);
  const priorityIssues = issues.slice(0, 5);

  let readinessSummary = "Content and infrastructure signals look healthy for launch-style readiness.";
  if (priorityIssues.length === 0) {
    readinessSummary = "No prioritized issues from automated checks — spot-check content quality before releases.";
  } else if (priorityIssues[0]?.severity === "critical") {
    readinessSummary = "Critical blockers detected — fix database or published question bank before marketing pushes.";
  } else if (priorityIssues.some((i) => i.severity === "high")) {
    readinessSummary = "High-impact gaps remain — address trust and coverage items before scaling traffic.";
  } else {
    readinessSummary = "Mostly healthy; remaining items are incremental coverage and polish.";
  }

  const finalScore = clampScore(score);
  const negativeSorted = [...negativeDrivers].sort((a, b) => b.weight - a.weight).slice(0, 6);
  const positiveDrivers = buildPositiveDrivers(d, pub, missingRat, emptyRegistryPathways.length);
  const readinessExplanation = buildReadinessExplanation(negativeSorted, finalScore);
  const readinessTrend = computeReadinessTrend(finalScore, options?.priorReadiness ?? null);

  return {
    readinessScore: finalScore,
    readinessSummary,
    readinessExplanation,
    scoreDrivers: {
      negative: negativeSorted,
      positive: positiveDrivers,
    },
    readinessTrend,
    priorityIssues,
  };
}
