/**
 * CAT results "coach" layer: presentation + light analytics only.
 * Does not modify theta, SE, stopping rules, or item selection.
 */
import type { CatExamReport, CatPresentationMode } from "@/lib/exams/cat-types";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";

export type CatCoachStudyLinkKind = "lesson" | "flashcards" | "drill";

export type CatCoachStudyLink = {
  label: string;
  href: string;
  kind: CatCoachStudyLinkKind;
};

export type CatCoachStudyNextTopic = {
  /** Display title (topic or client-needs label). */
  title: string;
  /** Why this topic was chosen for this run. */
  reason: string;
  links: CatCoachStudyLink[];
};

export type CatCoachErrorPattern = {
  code: string;
  title: string;
  detail: string;
};

export type CatResultsCoachSnapshot = {
  generatedAt: string;
  /** Mirrors report readiness score (0–100); labeled as outlook in UI, not a licensure guarantee. */
  passOutlookPercent: number;
  passOutlookDisclaimer: string;
  confidenceLevel: "low" | "medium" | "high";
  confidenceSummary: string;
  /** Single headline line for anxiety-friendly scanning. */
  readinessHeadline: string;
  strongestDomains: string[];
  weakestDomains: string[];
  keyRiskFactor: string | null;
  studyNext: CatCoachStudyNextTopic[];
  difficultySeries: number[];
  difficultyTrendLabel: "rising" | "falling" | "mixed" | "flat";
  passingBandRelative: "above" | "below" | "uncertain";
  passingBandCopy: string;
  weaknessInsights: string[];
  errorPatterns: CatCoachErrorPattern[];
};

export type CatCoachIncorrectRow = {
  questionType: string;
  topic: string | null;
  subtopic: string | null;
  stem: string | null;
};

function flashcardsHref(pathwayId: string | null, topicLabel: string): string {
  const code = normalizeTopicKey(topicLabel);
  if (pathwayId && code.length > 1) {
    return `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}&topicCode=${encodeURIComponent(code)}`;
  }
  return "/app/flashcards";
}

function drillHref(pathwayId: string | null, topicLabel: string): string {
  const code = normalizeTopicKey(topicLabel);
  if (pathwayId) {
    const qs = new URLSearchParams({
      pathwayId,
      preset: "topic_drill",
      topic: topicLabel.trim(),
    });
    if (code.length > 1) qs.set("topicCode", code);
    return `/app/questions?${qs.toString()}`;
  }
  return remediationTopicDrillHref(topicLabel);
}

function lessonHubHref(topicLabel: string): string {
  return remediationLessonsTopicHref(topicLabel);
}

function linksForTopic(title: string, pathwayId: string | null): CatCoachStudyLink[] {
  return [
    { label: "Lessons for this topic", href: lessonHubHref(title), kind: "lesson" },
    { label: "Flashcards", href: flashcardsHref(pathwayId, title), kind: "flashcards" },
    { label: "Targeted questions", href: drillHref(pathwayId, title), kind: "drill" },
  ];
}

function difficultyTrend(difficultyHistory: number[]): CatResultsCoachSnapshot["difficultyTrendLabel"] {
  const s = difficultyHistory.filter((n) => Number.isFinite(n));
  if (s.length < 4) return "flat";
  const third = Math.max(1, Math.floor(s.length / 3));
  const a = s.slice(0, third);
  const b = s.slice(-third);
  const ma = a.reduce((x, y) => x + y, 0) / a.length;
  const mb = b.reduce((x, y) => x + y, 0) / b.length;
  const d = mb - ma;
  if (d > 0.35) return "rising";
  if (d < -0.35) return "falling";
  if (Math.abs(d) < 0.12) return "flat";
  return "mixed";
}

function pickStudyTopics(report: CatExamReport): Array<{ title: string; reason: string }> {
  const weakCats = report.categoryBreakdown
    .filter((c) => c.total > 0 && c.strength !== "strong")
    .map((c) => ({
      title: c.category,
      acc: c.correct / c.total,
      total: c.total,
      missed: c.total - c.correct,
    }))
    .sort((x, y) => x.acc - y.acc || y.missed - x.missed);

  const fromBreakdown = weakCats.slice(0, 3).map((c) => ({
    title: c.title,
    reason:
      c.missed > 0
        ? `You missed ${c.missed} of ${c.total} items mapped to this area on this run.`
        : `Mixed signal in ${c.title} — tighten fundamentals before moving on.`,
  }));

  if (fromBreakdown.length >= 3) return fromBreakdown;

  const seen = new Set(fromBreakdown.map((x) => x.title));
  for (const w of report.weakAreas) {
    const t = w.trim();
    if (!t || t === "—" || seen.has(t)) continue;
    seen.add(t);
    fromBreakdown.push({
      title: t,
      reason: "Topic appeared in your weak list for this session.",
    });
    if (fromBreakdown.length >= 3) break;
  }

  while (fromBreakdown.length < 3 && fromBreakdown.length < weakCats.length) {
    const next = weakCats[fromBreakdown.length];
    if (next) {
      fromBreakdown.push({
        title: next.title,
        reason: `Review depth in ${next.title} to balance your blueprint.`,
      });
    } else break;
  }

  return fromBreakdown.slice(0, 3);
}

function errorPatternsFromIncorrect(rows: CatCoachIncorrectRow[]): CatCoachErrorPattern[] {
  const patterns: CatCoachErrorPattern[] = [];
  if (rows.length === 0) return patterns;

  const isSata = (t: string) => {
    const u = t.toUpperCase();
    return u === "SATA" || u === "SELECT_ALL_THAT_APPLY" || u.includes("SELECT_ALL");
  };
  const sataWrong = rows.filter((r) => isSata(r.questionType));
  const mcqWrong = rows.length - sataWrong.length;

  if (sataWrong.length >= 2 && sataWrong.length >= mcqWrong) {
    patterns.push({
      code: "sata",
      title: "Select-all-that-apply (SATA) misses",
      detail: `${sataWrong.length} of your incorrect items were SATA-style. Slow down, treat each option independently, and avoid partial credit traps.`,
    });
  }

  const prioHay = (r: CatCoachIncorrectRow) => {
    const blob = `${r.topic ?? ""} ${r.subtopic ?? ""} ${r.stem ?? ""}`.toLowerCase();
    return (
      /\bpriorit/i.test(blob) ||
      /\bfirst\b/.test(blob) ||
      /\binitial\b/.test(blob) ||
      /\burgent\b/.test(blob) ||
      /\bmost important\b/.test(blob)
    );
  };
  const prio = rows.filter(prioHay);
  if (prio.length >= 2) {
    patterns.push({
      code: "prioritization",
      title: "Prioritization-style stems",
      detail: `${prio.length} misses involved prioritization language. Re-read what the stem is asking for (first action, worst finding, etc.) before selecting.`,
    });
  }

  return patterns;
}

function weaknessInsights(report: CatExamReport, incorrect: CatCoachIncorrectRow[]): string[] {
  const out: string[] = [];
  const weakest = report.categoryBreakdown
    .filter((c) => c.total > 0 && c.correct < c.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  if (weakest) {
    out.push(
      `You struggled most in ${weakest.category} (${weakest.correct}/${weakest.total} correct this run).`,
    );
  }

  const byTopic = new Map<string, number>();
  for (const r of incorrect) {
    const k = (r.topic ?? "").trim() || "General";
    byTopic.set(k, (byTopic.get(k) ?? 0) + 1);
  }
  const topTopic = [...byTopic.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topTopic && topTopic[1] >= 2) {
    out.push(`Multiple misses clustered under “${topTopic[0]}” — worth a focused block there before your next CAT.`);
  }

  if (report.trajectory === "slipping") {
    out.push("Accuracy cooled in the second half of this session — watch fatigue and timing on longer runs.");
  } else if (report.trajectory === "improving") {
    out.push("You finished stronger than you started — carry that pacing into the next session.");
  }

  return out.slice(0, 5);
}

function plainHeadline(args: {
  report: CatExamReport;
  presentationMode?: CatPresentationMode;
}): string {
  const { report, presentationMode } = args;
  const sim = presentationMode === "exam_simulation";
  const prefix = sim ? "Exam simulation: " : "";
  const { decision, confidenceLevel, readinessScore } = report;

  if (decision === "pass" && readinessScore >= 58 && (confidenceLevel === "high" || confidenceLevel === "medium")) {
    return `${prefix}If you wrote today, you would likely pass — based on this practice estimate, not a score report.`;
  }
  if (
    (decision === "fail" || readinessScore < 42) &&
    (confidenceLevel === "high" || confidenceLevel === "medium")
  ) {
    return `${prefix}You are not yet safe to pass based on this run — use the study plan below and re-check with another CAT.`;
  }
  if (confidenceLevel === "low") {
    return `${prefix}Keep going — the pass outlook will firm up after a few more adaptive items.`;
  }
  return `${prefix}Mixed signals today; one session does not decide exam day — focus on the weakest areas listed below.`;
}

function passingBandCopy(report: CatExamReport, presentationMode?: CatPresentationMode): {
  relative: CatResultsCoachSnapshot["passingBandRelative"];
  copy: string;
} {
  const sim = presentationMode === "exam_simulation";
  const prefix = sim ? "Simulation: " : "";
  if (report.decision === "pass") {
    return {
      relative: "above",
      copy: `${prefix}Your estimated ability for this session sits above our practice passing band, with the confidence level shown above.`,
    };
  }
  if (report.decision === "fail") {
    return {
      relative: "below",
      copy: `${prefix}Your estimated ability for this session sits below our practice passing band — prioritize remediation before another full CAT.`,
    };
  }
  return {
    relative: "uncertain",
    copy: `${prefix}The engine has not yet separated you cleanly from the passing band — more items or another session will sharpen this.`,
  };
}

function keyRisk(report: CatExamReport, patterns: CatCoachErrorPattern[]): string | null {
  if (patterns[0]) return patterns[0].title;
  const w = report.categoryBreakdown
    .filter((c) => c.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  if (w && w.correct < w.total) return `Weakest domain right now: ${w.category}.`;
  if (report.confidenceLevel === "low") return "Estimate still volatile — stopping early can misread readiness.";
  return null;
}

/**
 * Build a serializable coach snapshot from an existing CAT report and light item metadata.
 */
export function buildCatResultsCoach(args: {
  report: CatExamReport;
  presentationMode?: CatPresentationMode;
  pathwayId: string | null;
  difficultyHistory: number[];
  incorrectRows: CatCoachIncorrectRow[];
}): CatResultsCoachSnapshot {
  const { report, presentationMode, pathwayId, difficultyHistory, incorrectRows } = args;
  const sim = presentationMode === "exam_simulation";
  const patterns = errorPatternsFromIncorrect(incorrectRows);

  const strongestDomains = report.categoryBreakdown
    .filter((c) => c.strength === "strong" && c.total > 0)
    .map((c) => c.category)
    .slice(0, 4);

  const weakestDomains = report.categoryBreakdown
    .filter((c) => c.total > 0 && (c.strength === "weak" || c.correct < c.total))
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .map((c) => c.category)
    .slice(0, 4);

  const studyTopics = pickStudyTopics(report);
  const studyNext: CatCoachStudyNextTopic[] = studyTopics.map((s) => ({
    title: s.title,
    reason: s.reason,
    links: linksForTopic(s.title, pathwayId),
  }));

  const band = passingBandCopy(report, presentationMode);

  return {
    generatedAt: new Date().toISOString(),
    passOutlookPercent: report.readinessScore,
    passOutlookDisclaimer: sim
      ? "Exam simulations mirror pacing and stop rules; they are not a prediction of NCLEX, AANP, or board outcomes."
      : "Practice CAT uses the same adaptive engine as test mode, but no home platform can guarantee your licensure result.",
    confidenceLevel: report.confidenceLevel,
    confidenceSummary: report.confidenceText,
    readinessHeadline: plainHeadline({ report, presentationMode }),
    strongestDomains,
    weakestDomains,
    keyRiskFactor: keyRisk(report, patterns),
    studyNext,
    difficultySeries: [...difficultyHistory],
    difficultyTrendLabel: difficultyTrend(difficultyHistory),
    passingBandRelative: band.relative,
    passingBandCopy: band.copy,
    weaknessInsights: weaknessInsights(report, incorrectRows),
    errorPatterns: patterns,
  };
}
