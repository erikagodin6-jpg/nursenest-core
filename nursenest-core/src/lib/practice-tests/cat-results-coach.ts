/**
 * CAT results "coach" layer: presentation + light analytics only.
 * Does not modify theta, SE, stopping rules, or item selection.
 */
import type { CatExamReport, CatPresentationMode } from "@/lib/exams/cat-types";
import { getLearnerExamFraming } from "@/lib/learner/learner-exam-framing";
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
  /** Grounded paragraph — strengths, gaps, and what the estimate can / cannot claim. */
  readinessNarrative: string;
  strongestDomains: string[];
  weakestDomains: string[];
  keyRiskFactor: string | null;
  studyNext: CatCoachStudyNextTopic[];
  /** Short, specific “do this next” lines tied to weaknesses and patterns. */
  specificStudyActions: string[];
  difficultySeries: number[];
  difficultyTrendLabel: "rising" | "falling" | "mixed" | "flat";
  /** How θ moved within this session (from persisted history), not a licensure guarantee. */
  stabilityTrendLabel: "improving" | "cooling" | "steady" | "insufficient";
  stabilityInterpretation: string;
  passingBandRelative: "above" | "below" | "uncertain";
  passingBandCopy: string;
  weaknessInsights: string[];
  errorPatterns: CatCoachErrorPattern[];
  /** Honest note when comparing multiple CAT attempts is more reliable than one sitting. */
  multiSessionGuidance: string;
  /** Exam pathway context — presentation only. */
  examPassingStandardLine?: string;
};

export type CatCoachIncorrectRow = {
  questionType: string;
  topic: string | null;
  subtopic: string | null;
  stem: string | null;
  tags: string[];
  bodySystem: string | null;
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
    { label: "Review this topic (lessons)", href: lessonHubHref(title), kind: "lesson" },
    { label: "Flashcards for this topic", href: flashcardsHref(pathwayId, title), kind: "flashcards" },
    { label: "Practice questions (targeted drill)", href: drillHref(pathwayId, title), kind: "drill" },
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

function rowHaystack(r: CatCoachIncorrectRow): string {
  const tagBlob = (r.tags ?? []).join(" ");
  return `${r.topic ?? ""} ${r.subtopic ?? ""} ${r.bodySystem ?? ""} ${tagBlob} ${r.stem ?? ""}`.toLowerCase();
}

function pickStudyTopics(report: CatExamReport, patterns: CatCoachErrorPattern[]): Array<{ title: string; reason: string }> {
  const weakCats = report.categoryBreakdown
    .filter((c) => c.total > 0 && c.strength !== "strong")
    .map((c) => ({
      title: c.category,
      acc: c.correct / c.total,
      total: c.total,
      missed: c.total - c.correct,
    }))
    .sort((x, y) => x.acc - y.acc || y.missed - x.missed);

  const patternHint = patterns[0];
  const fromBreakdown = weakCats.slice(0, 3).map((c) => ({
    title: c.title,
    reason:
      c.missed > 0
        ? `Focus next: ${c.title}. You missed ${c.missed} of ${c.total} items tagged here — rehearse the decision rule, not just facts.`
        : `Reinforce ${c.title}: performance was mixed; consolidate before adding new topics.`,
  }));

  if (patternHint && fromBreakdown[0]) {
    fromBreakdown[0] = {
      ...fromBreakdown[0],
      reason: `${fromBreakdown[0].reason} Pattern note: ${patternHint.title.toLowerCase()} showed up in this run.`,
    };
  }

  if (fromBreakdown.length >= 3) return fromBreakdown;

  const seen = new Set(fromBreakdown.map((x) => x.title));
  for (const w of report.weakAreas) {
    const t = w.trim();
    if (!t || t === "—" || seen.has(t)) continue;
    seen.add(t);
    fromBreakdown.push({
      title: t,
      reason: `Your weak-area list includes “${t}” from this session — schedule a short lesson + drill block before the next CAT.`,
    });
    if (fromBreakdown.length >= 3) break;
  }

  while (fromBreakdown.length < 3 && fromBreakdown.length < weakCats.length) {
    const next = weakCats[fromBreakdown.length];
    if (next) {
      fromBreakdown.push({
        title: next.title,
        reason: `Balance your blueprint: add structured review in ${next.title} so one strong area does not mask another gap.`,
      });
    } else break;
  }

  if (fromBreakdown.length === 0) {
    fromBreakdown.push({
      title: "Targeted remediation",
      reason:
        "Use the incorrect review and pattern notes below — then rerun CAT after a short lesson + drill block on those areas.",
    });
  }

  return fromBreakdown.slice(0, 3);
}

function specificStudyActions(
  report: CatExamReport,
  patterns: CatCoachErrorPattern[],
  weakestLabel: string | null,
  pathwayId: string | null,
): string[] {
  const framing = getLearnerExamFraming(pathwayId);
  const actions: string[] = [];
  for (const p of patterns.slice(0, 2)) {
    if (p.code === "sata") {
      actions.push("Practice SATA with a checklist: evaluate each option as true/false against the stem before submitting.");
    } else if (p.code === "prioritization") {
      actions.push(
        "Drill prioritization: identify the most unstable patient or the first nursing action before reading distractors.",
      );
    } else if (p.code === "infection_control") {
      actions.push("Review droplet vs airborne vs contact precautions and when each applies — then retry isolation-style items.");
    } else if (p.code === "delegation") {
      actions.push(framing.delegationRemediationHint);
    } else if (p.code === "labs") {
      actions.push("Study critical labs (electrolytes, renal, coagulation) with numeric thresholds tied to interventions.");
    } else if (p.code === "medication_safety") {
      actions.push("Focus on adverse effects, contraindications, and monitoring for high-risk medication classes you missed.");
    }
  }
  if (weakestLabel && actions.length < 3) {
    actions.push(`Schedule a focused block on ${weakestLabel}: lesson recap, then 10–15 targeted questions in that domain.`);
  }
  if (report.trajectory === "slipping" && actions.length < 3) {
    actions.push("Next CAT: plan for exam-length stamina (timed mode) so late-session accuracy does not drop.");
  }
  return [...new Set(actions)].slice(0, 5);
}

function errorPatternsFromIncorrect(rows: CatCoachIncorrectRow[], pathwayId: string | null): CatCoachErrorPattern[] {
  const patterns: CatCoachErrorPattern[] = [];
  if (rows.length === 0) return patterns;
  const framing = getLearnerExamFraming(pathwayId);

  const need = rows.length <= 4 ? 1 : 2;

  const isSata = (t: string) => {
    const u = t.toUpperCase();
    return u === "SATA" || u === "SELECT_ALL_THAT_APPLY" || u.includes("SELECT_ALL");
  };
  const sataWrong = rows.filter((r) => isSata(r.questionType));

  if (sataWrong.length >= need) {
    patterns.push({
      code: "sata",
      title: "SATA / select-all-that-apply",
      detail: `${sataWrong.length} incorrect item(s) were SATA-style. Treat each line as its own true/false decision; partial credit items reward every safe step you omit.`,
    });
  }

  const prio = rows.filter((r) => {
    const h = rowHaystack(r);
    return (
      /\bpriorit/i.test(h) ||
      /\bfirst\b.*\b(action|step|intervention)/i.test(h) ||
      /\bmost (critical|important|urgent)\b/i.test(h) ||
      /\bwhich (client|patient|response)\b/i.test(h)
    );
  });
  if (prio.length >= need) {
    patterns.push({
      code: "prioritization",
      title: "Prioritization and first-action framing",
      detail: `${prio.length} miss(es) look like priority or “first action” judgment. Name the risk (airway, bleeding, neuro) before comparing answers.`,
    });
  }

  const isolation = rows.filter((r) => {
    const h = rowHaystack(r);
    return (
      /\b(isolation|precaution|ppe|n95|airborne|droplet|contact)\b/i.test(h) ||
      /\b(transmission)\b/i.test(h)
    );
  });
  if (isolation.length >= need) {
    patterns.push({
      code: "infection_control",
      title: "Isolation and infection control",
      detail: `${isolation.length} miss(es) touch precautions or transmission. Reconcile the organism or symptom with the required precaution.`,
    });
  }

  const deleg = rows.filter((r) => {
    const h = rowHaystack(r);
    const caAssist = /\bUCP\b|\bcare aide\b|\bpsw\b|\bunregulated care\b/i.test(h);
    return /\bdelegat/i.test(h) || /\bUAP\b|\bCNA\b|\bunlicensed assist/i.test(h) || (framing.region === "ca" && caAssist);
  });
  if (deleg.length >= need) {
    const detail =
      framing.region === "ca"
        ? `${deleg.length} miss(es) involve delegation or assistive roles. Unstable clients and assessments that require nursing judgment typically stay with the RN or RPN per provincial scope—not delegated to unregulated providers.`
        : `${deleg.length} miss(es) involve delegation. Unstable patients and assessments typically stay with the RN.`;
    patterns.push({
      code: "delegation",
      title: "Delegation and scope",
      detail,
    });
  }

  const labs = rows.filter((r) => {
    const h = rowHaystack(r);
    return /\b(lab|labs|creatinine|potassium|sodium|inr|ptt|hemoglobin|glucose|abg|lactate|troponin)\b/i.test(h);
  });
  if (labs.length >= need) {
    patterns.push({
      code: "labs",
      title: "Labs and numeric interpretation",
      detail: `${labs.length} miss(es) hinge on lab values or trends. Pair each abnormal value with the expected intervention.`,
    });
  }

  const meds = rows.filter((r) => {
    const h = rowHaystack(r);
    return /\b(medication|drug|dose|adverse|side effect|contraindication|interaction|antidote)\b/i.test(h);
  });
  if (meds.length >= need) {
    patterns.push({
      code: "medication_safety",
      title: "Medication safety",
      detail: `${meds.length} miss(es) involve medications. Slow down for black-box risks, monitoring, and hold parameters.`,
    });
  }

  const matPed = rows.filter((r) => {
    const h = rowHaystack(r);
    return (
      /\b(pregnancy|prenatal|labor|postpartum|gestation|newborn|pediatric|child|adolescent)\b/i.test(h) ||
      /\b(milestone|immunization)\b/i.test(h)
    );
  });
  if (matPed.length >= need) {
    patterns.push({
      code: "lifespan",
      title: "Maternity or pediatric context",
      detail: `${matPed.length} miss(es) are lifespan-specific. Compare expected vs urgent findings for that stage.`,
    });
  }

  const comm = rows.filter((r) => /\b(therapeutic communication|rapport|de-escalat|cultural)\b/i.test(rowHaystack(r)));
  if (comm.length >= need) {
    patterns.push({
      code: "communication",
      title: "Therapeutic communication",
      detail: `${comm.length} miss(es) involve communication cues. Choose responses that address emotion without false reassurance.`,
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
    return `${prefix}You are trending above the practice passing standard for this session — still one piece of the picture, not a guarantee.`;
  }
  if (
    (decision === "fail" || readinessScore < 42) &&
    (confidenceLevel === "high" || confidenceLevel === "medium")
  ) {
    return `${prefix}You are close in some areas, but not yet consistently safe against our practice band — focus on the risks below, then rerun CAT.`;
  }
  if (confidenceLevel === "low") {
    return `${prefix}The outlook is still forming — with more adaptive items (or another session), we can speak more confidently about readiness.`;
  }
  return `${prefix}Mixed performance today; use the domains and patterns below to guide the next study block before your next CAT.`;
}

function thetaStability(thetaHistory: number[]): Pick<CatResultsCoachSnapshot, "stabilityTrendLabel" | "stabilityInterpretation"> {
  const t = thetaHistory.filter((x) => typeof x === "number" && Number.isFinite(x));
  if (t.length < 5) {
    return {
      stabilityTrendLabel: "insufficient",
      stabilityInterpretation:
        "There were not enough scored steps in this session to describe an ability trend — try a longer CAT when you can.",
    };
  }
  const k = Math.max(2, Math.floor(t.length / 3));
  const early = t.slice(0, k);
  const late = t.slice(-k);
  const me = early.reduce((a, b) => a + b, 0) / early.length;
  const ml = late.reduce((a, b) => a + b, 0) / late.length;
  const delta = ml - me;
  if (delta > 0.12) {
    return {
      stabilityTrendLabel: "improving",
      stabilityInterpretation:
        "Within this session, your estimated ability moved upward as you progressed — a reassuring sign when it lines up with your study goals.",
    };
  }
  if (delta < -0.12) {
    return {
      stabilityTrendLabel: "cooling",
      stabilityInterpretation:
        "Estimated ability softened toward the end of this run — check fatigue, pacing, or the domains that appeared late.",
    };
  }
  return {
    stabilityTrendLabel: "steady",
    stabilityInterpretation:
      "Your estimate stayed relatively level across items — performance was steady within this CAT, not wildly swinging.",
  };
}

function readinessNarrative(args: {
  report: CatExamReport;
  strongest: string[];
  weakest: string[];
  patterns: CatCoachErrorPattern[];
  presentationMode?: CatPresentationMode;
}): string {
  const { report, strongest, weakest, patterns, presentationMode } = args;
  const sim = presentationMode === "exam_simulation";
  const strongLine =
    strongest.length > 0
      ? `Strengths this run include ${strongest.slice(0, 2).join(" and ")}.`
      : "We did not see clearly dominant strengths in this short window.";
  const weakLine =
    weakest.length > 0
      ? `The shakiest areas were ${weakest.slice(0, 2).join(" and ")}.`
      : "Domain balance still looks mixed — use the list below for detail.";
  const risk =
    patterns[0] != null
      ? ` A recurring pattern: ${patterns[0].title.toLowerCase()} — worth addressing before test day.`
      : "";
  const conf =
    report.confidenceLevel === "low"
      ? " Confidence is still limited because the estimate has not stabilized — that is normal after shorter sessions."
      : "";
  const simNote = sim ? " This simulation follows NurseNest stop rules; it is not a board score report." : "";
  return `${strongLine} ${weakLine}${risk}${conf}${simNote}`;
}

function passingBandCopy(
  report: CatExamReport,
  presentationMode: CatPresentationMode | undefined,
  pathwayId: string | null,
): {
  relative: CatResultsCoachSnapshot["passingBandRelative"];
  copy: string;
} {
  const sim = presentationMode === "exam_simulation";
  const prefix = sim ? "Simulation: " : "";
  const framing = getLearnerExamFraming(pathwayId);
  const band = framing.passingStandardPhrase;
  if (report.decision === "pass") {
    return {
      relative: "above",
      copy: `${prefix}You appear above our practice passing band for this session (${band}), at the confidence level shown — use it as a signal, not a promise.`,
    };
  }
  if (report.decision === "fail") {
    return {
      relative: "below",
      copy: `${prefix}You appear below our practice passing band on this run (${band}) — that is a remediation signal, not a verdict on your career.`,
    };
  }
  return {
    relative: "uncertain",
    copy: `${prefix}The estimate has not locked in clearly above or below the practice band (${band}) — another CAT or more items will narrow this.`,
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
  thetaHistory: number[];
  incorrectRows: CatCoachIncorrectRow[];
}): CatResultsCoachSnapshot {
  const { report, presentationMode, pathwayId, difficultyHistory, thetaHistory, incorrectRows } = args;
  const sim = presentationMode === "exam_simulation";
  const framing = getLearnerExamFraming(pathwayId);
  const patterns = errorPatternsFromIncorrect(incorrectRows, pathwayId);

  const strongestDomains = report.categoryBreakdown
    .filter((c) => c.strength === "strong" && c.total > 0)
    .map((c) => c.category)
    .slice(0, 4);

  const weakestDomains = report.categoryBreakdown
    .filter((c) => c.total > 0 && (c.strength === "weak" || c.correct < c.total))
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .map((c) => c.category)
    .slice(0, 4);

  const studyTopics = pickStudyTopics(report, patterns);
  const studyNext: CatCoachStudyNextTopic[] = studyTopics.map((s) => ({
    title: s.title,
    reason: s.reason,
    links: linksForTopic(s.title, pathwayId),
  }));

  const band = passingBandCopy(report, presentationMode, pathwayId);
  const stability = thetaStability(thetaHistory);
  const narrative = readinessNarrative({
    report,
    strongest: strongestDomains,
    weakest: weakestDomains,
    patterns,
    presentationMode,
  });
  const weakestLabel = weakestDomains[0] ?? null;
  const specificStudyActionsList = specificStudyActions(report, patterns, weakestLabel, pathwayId);

  return {
    generatedAt: new Date().toISOString(),
    passOutlookPercent: report.readinessScore,
    passOutlookDisclaimer: sim
      ? "Exam simulations mirror pacing and stop rules; they are not a prediction of NCLEX, AANP, or board outcomes."
      : "Practice CAT uses the same adaptive engine as test mode, but no home platform can guarantee your licensure result.",
    confidenceLevel: report.confidenceLevel,
    confidenceSummary: report.confidenceText,
    readinessHeadline: plainHeadline({ report, presentationMode }),
    readinessNarrative: narrative,
    strongestDomains,
    weakestDomains,
    keyRiskFactor: keyRisk(report, patterns),
    studyNext,
    specificStudyActions: specificStudyActionsList,
    difficultySeries: [...difficultyHistory],
    difficultyTrendLabel: difficultyTrend(difficultyHistory),
    stabilityTrendLabel: stability.stabilityTrendLabel,
    stabilityInterpretation: stability.stabilityInterpretation,
    passingBandRelative: band.relative,
    passingBandCopy: band.copy,
    weaknessInsights: weaknessInsights(report, incorrectRows),
    errorPatterns: patterns,
    multiSessionGuidance:
      "Readiness is most reliable when you compare several CAT runs over time — use the CAT readiness dashboard to see whether your outlook is trending up.",
    examPassingStandardLine:
      framing.region === "unknown"
        ? undefined
        : `Performance is interpreted relative to ${framing.passingStandardPhrase}.`,
  };
}
