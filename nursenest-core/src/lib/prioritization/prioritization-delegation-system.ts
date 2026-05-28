import { buildAppFlashcardsTopicHref, buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";

export type PrioritizationActivityType =
  | "priority-round"
  | "delegation-drill"
  | "escalation-sequence"
  | "assignment-balance"
  | "rapid-response"
  | "safety-risk";

export type PrioritizationActivity = {
  id: string;
  title: string;
  description: string;
  activityType: PrioritizationActivityType;
  topicSlug: string;
  acuity: "stable" | "watch" | "urgent" | "high-acuity";
  timePressure: string;
  decisions: number;
  safetyFocus: string;
  tags: readonly string[];
  accentVar: string;
};

export const PRIORITIZATION_ACTIVITIES: readonly PrioritizationActivity[] = [
  {
    id: "who-first",
    title: "Who do you see first?",
    description: "Compare four patients, identify instability, and decide which assessment cannot wait.",
    activityType: "priority-round",
    topicSlug: "prioritization",
    acuity: "urgent",
    timePressure: "90 seconds",
    decisions: 6,
    safetyFocus: "Unstable vs. stable, acute vs. chronic, ABCs",
    tags: ["multi-patient", "first action", "deterioration"],
    accentVar: "--semantic-danger",
  },
  {
    id: "delegation-safety",
    title: "Delegation decision drill",
    description: "Sort tasks by RN, LPN/RPN, and UAP fit while catching unsafe delegation traps.",
    activityType: "delegation-drill",
    topicSlug: "delegation",
    acuity: "watch",
    timePressure: "Untimed",
    decisions: 8,
    safetyFocus: "Scope, predictability, assessment, teaching",
    tags: ["scope", "assignment", "team nursing"],
    accentVar: "--semantic-info",
  },
  {
    id: "escalation-chain",
    title: "Escalation sequencing",
    description: "Order the assessment, immediate intervention, provider notification, and reassessment steps.",
    activityType: "escalation-sequence",
    topicSlug: "escalation",
    acuity: "high-acuity",
    timePressure: "2 minutes",
    decisions: 7,
    safetyFocus: "When to call, what to say, what to monitor",
    tags: ["SBAR", "rapid response", "reassessment"],
    accentVar: "--semantic-warning",
  },
  {
    id: "assignment-balance",
    title: "Shift assignment balance",
    description: "Build a safe assignment with acuity, workload, isolation needs, and staffing constraints.",
    activityType: "assignment-balance",
    topicSlug: "assignment",
    acuity: "watch",
    timePressure: "3 minutes",
    decisions: 10,
    safetyFocus: "Workload, acuity, continuity, infection control",
    tags: ["charge nurse", "workload", "staffing"],
    accentVar: "--semantic-success",
  },
  {
    id: "rapid-response",
    title: "Rapid-response case",
    description: "Recognize the cue cluster, choose the next best action, and escalate before the patient crashes.",
    activityType: "rapid-response",
    topicSlug: "deterioration",
    acuity: "high-acuity",
    timePressure: "60 seconds",
    decisions: 5,
    safetyFocus: "Respiratory decline, sepsis, neuro change",
    tags: ["high acuity", "early warning", "rescue"],
    accentVar: "--semantic-danger",
  },
  {
    id: "safety-risk",
    title: "Most concerning finding",
    description: "Scan chart cues and identify the result, order, or symptom that changes the priority.",
    activityType: "safety-risk",
    topicSlug: "patient-safety",
    acuity: "urgent",
    timePressure: "75 seconds",
    decisions: 6,
    safetyFocus: "Safety risk, medication holds, contraindications",
    tags: ["chart review", "orders", "safety"],
    accentVar: "--semantic-brand",
  },
] as const;

export function prioritizationHubHref(pathwayId: string | null | undefined): string {
  const pid = pathwayId?.trim();
  return pid ? `/app/prioritization-delegation?pathwayId=${encodeURIComponent(pid)}` : "/app/prioritization-delegation";
}

export function prioritizationPracticeHref(pathwayId: string, activity: PrioritizationActivity | null): string {
  return buildAppPracticeTestsTopicHref(pathwayId, activity?.topicSlug ?? "prioritization");
}

export function prioritizationFlashcardsHref(pathwayId: string, activity: PrioritizationActivity | null): string {
  return buildAppFlashcardsTopicHref(pathwayId, activity?.topicSlug ?? "prioritization");
}
