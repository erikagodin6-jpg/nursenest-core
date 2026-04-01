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

export type AdminDiagnosticsOperationsLayer = {
  readinessScore: number;
  readinessSummary: string;
  priorityIssues: OperationsPriorityIssue[];
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

/**
 * Derives readiness score (0–100) and top priority issues from admin diagnostics (+ optional remediation intel).
 * Intended to layer on top of the raw diagnostics payload without replacing it.
 */
export function buildAdminDiagnosticsOperationsLayer(
  d: AdminDiagnostics,
  remediation: QuestionBankRemediationIntelligence | null,
): AdminDiagnosticsOperationsLayer {
  const issues: OperationsPriorityIssue[] = [];
  const pub = d.counts.questionsPublished;
  const missingRat = d.counts.questionsPublishedMissingRationale;
  const missingRatPct = pub > 0 ? (missingRat / pub) * 100 : 0;

  let score = 100;

  if (d.dbHealth.status === "error") {
    score -= 28;
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
    score -= 38;
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
      score -= 12;
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
      score -= 12;
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
    score -= 14;
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
    issues.push({
      id: "pathways_empty_slices",
      title: `${emptyRegistryPathways.length} registered pathway(s) have zero published lessons`,
      detail: emptyRegistryPathways.slice(0, 6).join(" · ") + (emptyRegistryPathways.length > 6 ? " …" : ""),
      severity: emptyRegistryPathways.length >= 4 ? "high" : "medium",
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
    score -= Math.min(22, missingRatPct * 0.35 + Math.min(8, missingRat / 25));
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
    score -= Math.min(12, 2 + d.weakCoverage.length * 0.35);
    issues.push({
      id: "weak_topic_coverage",
      title: `${d.weakCoverage.length} topic(s) below ${d.weakCoverageThreshold} published questions`,
      detail: `Thinnest: ${topicLabel} (${worst.publishedQuestions} published).`,
      severity: d.weakCoverage.length >= 12 ? "high" : "medium",
      conversionRisk: true,
      category: "coverage",
      action: { label: "Open question queue", href: questionsHrefTopic(worst.topic) },
      secondaryAction: { label: "Import / AI questions", href: "/admin/ai/exam-questions" },
      impactRank: 48 + Math.min(12, d.weakCoverage.length),
    });
  }

  if (remediation?.np.belowFloor) {
    score -= 8;
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
    score -= 6;
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
    score -= 5;
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

  return {
    readinessScore: clampScore(score),
    readinessSummary,
    priorityIssues,
  };
}
