/**
 * Simulation Study Plan Bridge
 *
 * Converts simulation session outcomes into DailyStudyPlan items and
 * UserRemediationQueue entries, feeding simulation data directly into
 * the existing learner study plan and adaptive coach.
 *
 * Integration points:
 *   - POST /api/learner/monitor-session-reports → calls this after save
 *   - DailyStudyPlan (existing) → adds simulation recommendations
 *   - UserRemediationQueue (existing) → adds simulation-driven remediation
 *   - Study coach messages → adds simulation-specific coaching notes
 */

import type { RemediationSurface } from "./adaptive-remediation";

// ─── Study plan item from simulation outcome ──────────────────────────────────

export interface SimulationStudyPlanItem {
  type: "simulation" | "ecg" | "flashcards" | "questions" | "lesson";
  title: string;
  description: string;
  href: string;
  estimatedMinutes: number;
  priority: "critical" | "high" | "medium";
  reason: string;
  conditionKey: string;
  contentTag: string;
}

// ─── Coaching message ─────────────────────────────────────────────────────────

export interface SimulationCoachingMessage {
  type: "progress" | "gap" | "action" | "readiness";
  text: string;
  metric?: number;
  conditionKey?: string;
}

// ─── Session outcome → study plan items ──────────────────────────────────────

export function buildStudyPlanItemsFromSimulation(params: {
  conditionKey: string;
  compositeScore: number;
  clinicalJudgmentScore: number;
  harmColor: "green" | "yellow" | "red";
  escalationTimely: boolean;
  missedOpportunityCount: number;
  sessionId: string;
  mode: string;
}): SimulationStudyPlanItem[] {
  const items: SimulationStudyPlanItem[] = [];
  const {
    conditionKey, compositeScore, clinicalJudgmentScore,
    harmColor, escalationTimely, missedOpportunityCount, sessionId,
  } = params;

  const condLabel = conditionKey.replace(/_/g, " ");

  // ── Replay — always recommended if score < 80 ─────────────────────────────
  if (compositeScore < 80 || harmColor !== "green" || missedOpportunityCount > 0) {
    items.push({
      type: "simulation",
      title: `Review ${condLabel} session replay`,
      description: "Identify missed opportunities and compare your decisions to the optimal path.",
      href: `/app/simulation-center/replay/${sessionId}`,
      estimatedMinutes: 8,
      priority: harmColor === "red" ? "critical" : "high",
      reason: harmColor === "red"
        ? "Red Harm Index — review harm events before next session"
        : missedOpportunityCount > 0
        ? `${missedOpportunityCount} missed opportunities identified`
        : "Performance below 80 — replay helps identify improvement areas",
      conditionKey,
      contentTag: `replay:${sessionId}`,
    });
  }

  // ── ECG drill — for rhythm-heavy conditions ───────────────────────────────
  const rhythmConditions = ["stemi", "afib_rvr", "svt", "vt_to_vf", "hyperkalemia", "acs_differential"];
  if (rhythmConditions.includes(conditionKey) && clinicalJudgmentScore < 75) {
    items.push({
      type: "ecg",
      title: `${condLabel} ECG recognition drill`,
      description: "Practice identifying the characteristic ECG pattern for this condition.",
      href: `/app/ecg-video-quiz?condition=${conditionKey}`,
      estimatedMinutes: 10,
      priority: "high",
      reason: `Clinical judgment score ${clinicalJudgmentScore}/100 — ECG pattern review needed`,
      conditionKey,
      contentTag: `ecg:${conditionKey}`,
    });
  }

  // ── Escalation drill ──────────────────────────────────────────────────────
  if (!escalationTimely) {
    items.push({
      type: "lesson",
      title: "Rapid response escalation practice",
      description: "Practice SBAR communication and rapid response activation timing.",
      href: `/app/clinical-skills?scenario=escalation`,
      estimatedMinutes: 10,
      priority: "high",
      reason: "Escalation was delayed or absent — practice SBAR and escalation protocol",
      conditionKey,
      contentTag: "rapid-response-escalation",
    });
  }

  // ── Condition-specific flashcards ─────────────────────────────────────────
  if (compositeScore < 70) {
    items.push({
      type: "flashcards",
      title: `${condLabel} key concepts`,
      description: "Review the critical clinical concepts for this condition.",
      href: `/app/flashcards?topic=${conditionKey.replace(/_/g, "-")}`,
      estimatedMinutes: 8,
      priority: "medium",
      reason: `Composite score ${compositeScore}/100 — reinforce foundational knowledge`,
      conditionKey,
      contentTag: conditionKey.replace(/_/g, "-"),
    });
  }

  // ── Practice questions ────────────────────────────────────────────────────
  if (clinicalJudgmentScore < 65) {
    items.push({
      type: "questions",
      title: `${condLabel} practice questions`,
      description: "Answer 10 NCLEX-style questions targeting your weak NCJMM domains.",
      href: `/app/practice?topic=${conditionKey.replace(/_/g, "-")}`,
      estimatedMinutes: 15,
      priority: "medium",
      reason: `Clinical judgment score ${clinicalJudgmentScore}/100 — NCJMM domain reinforcement needed`,
      conditionKey,
      contentTag: conditionKey.replace(/_/g, "-"),
    });
  }

  // ── Run same simulation again at higher difficulty ────────────────────────
  if (compositeScore >= 70 && compositeScore < 85) {
    items.push({
      type: "simulation",
      title: `Repeat ${condLabel} simulation`,
      description: "Practice this condition again to consolidate your learning and improve timing.",
      href: `/app/physiology-monitor?condition=${conditionKey}`,
      estimatedMinutes: 15,
      priority: "medium",
      reason: `Score ${compositeScore}/100 — one more session will push you over 85`,
      conditionKey,
      contentTag: `simulation:${conditionKey}`,
    });
  }

  return items.slice(0, 5);
}

// ─── Coaching messages from simulation ────────────────────────────────────────

export function buildSimulationCoachingMessages(params: {
  conditionKey: string;
  compositeScore: number;
  harmColor: "green" | "yellow" | "red";
  escalationTimely: boolean;
  prevCompositeScore?: number;
  clearanceNearDomains?: string[];
}): SimulationCoachingMessage[] {
  const msgs: SimulationCoachingMessage[] = [];
  const { conditionKey, compositeScore, harmColor, escalationTimely, prevCompositeScore, clearanceNearDomains } = params;
  const condLabel = conditionKey.replace(/_/g, " ");

  // Progress message
  if (prevCompositeScore && compositeScore > prevCompositeScore) {
    const delta = compositeScore - prevCompositeScore;
    msgs.push({
      type: "progress",
      text: `You improved ${delta} points in ${condLabel} compared to your last session.`,
      metric: delta,
      conditionKey,
    });
  }

  // Harm praise
  if (harmColor === "green") {
    msgs.push({
      type: "progress",
      text: `No patient harm events in this ${condLabel} session — excellent safe practice.`,
      conditionKey,
    });
  }

  // Escalation gap
  if (!escalationTimely) {
    msgs.push({
      type: "gap",
      text: `Escalation was delayed in this session. Rapid response should be activated before the severe stage.`,
      conditionKey,
    });
  }

  // Clearance near
  if (clearanceNearDomains && clearanceNearDomains.length > 0) {
    msgs.push({
      type: "readiness",
      text: `You are close to earning ${clearanceNearDomains[0]!.replace(/_/g, " ")} clearance. Complete ${compositeScore >= 75 ? "one more session" : "two more sessions"} to qualify.`,
      conditionKey,
    });
  }

  // Low score action
  if (compositeScore < 65) {
    msgs.push({
      type: "action",
      text: `Your ${condLabel} score of ${compositeScore} indicates knowledge gaps. Review the session replay and complete the flashcard set before repeating.`,
      metric: compositeScore,
      conditionKey,
    });
  }

  return msgs.slice(0, 3);
}

// ─── Remediation queue rows ───────────────────────────────────────────────────

export function buildSimulationRemediationRows(
  userId: string,
  pathwayId: string,
  items: SimulationStudyPlanItem[],
): Array<{
  userId: string;
  pathwayKey: string;
  topicKey: string;
  bodySystemKey: string;
  priorityScore: number;
  nextReviewAt: Date;
  source: "question";
}> {
  const now = new Date();
  return items.map((item) => ({
    userId,
    pathwayKey: pathwayId,
    topicKey: item.contentTag.slice(0, 200),
    bodySystemKey: item.conditionKey,
    priorityScore: item.priority === "critical" ? 100 : item.priority === "high" ? 72 : 45,
    nextReviewAt: new Date(now.getTime() + (item.priority === "critical" ? 0 : 24 * 60 * 60 * 1000)),
    source: "question" as const,
  }));
}
