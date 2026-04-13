import "server-only";

import type {
  CoachActionDefinition,
  CoachContext,
  CoachIntent,
  CoachRequest,
  CoachResponse,
  CoachSection,
} from "./study-coach-types";
import { followUpsForIntent, titleForIntent } from "./study-coach-followups";

export type {
  CoachIntent,
  CoachContext,
  CoachRequest,
  CoachResponse,
  CoachSection,
  CoachFollowUpAction,
} from "./study-coach-types";

export { followUpsForIntent, titleForIntent } from "./study-coach-followups";

/** @deprecated Use CoachActionDefinition */
export type CoachAction = CoachActionDefinition;

export const REVIEW_ACTIONS: CoachActionDefinition[] = [
  {
    intent: "explain_simply",
    label: "Explain This More Clearly",
    description: "Get a clearer breakdown of the concept",
  },
  {
    intent: "why_wrong",
    label: "Why Was This Wrong?",
    description: "Understand the reasoning behind the correct answer",
  },
  {
    intent: "quiz_concept",
    label: "Quiz Me on This",
    description: "Test your understanding with a quick question",
  },
];

export const LESSON_ACTIONS: CoachActionDefinition[] = [
  {
    intent: "explain_simply",
    label: "Simplify This",
    description: "Restate in plain language",
  },
  {
    intent: "topic_review",
    label: "Key Points Only",
    description: "See the most important takeaways",
  },
  {
    intent: "quiz_concept",
    label: "Quick Check",
    description: "Test what you just read",
  },
];

export const DASHBOARD_ACTIONS: CoachActionDefinition[] = [
  {
    intent: "what_next",
    label: "What to Study Next",
    description: "Get a focused recommendation",
  },
  {
    intent: "weak_summary",
    label: "Focus Areas to Review",
    description: "See your top areas to strengthen",
  },
  {
    intent: "quick_plan",
    label: "Build a Quick Review",
    description: "Generate a short study session",
  },
];

const GENERATIVE_INTENTS: CoachIntent[] = [
  "explain_simply",
  "why_wrong",
  "what_next",
  "weak_summary",
  "topic_review",
  "quick_plan",
  "quiz_concept",
];

export function isGenerativeCoachIntent(intent: CoachIntent): boolean {
  return GENERATIVE_INTENTS.includes(intent);
}

/**
 * Build the system prompt for a given intent (generative path only).
 */
export function buildCoachSystemPrompt(intent: CoachIntent): string {
  const base = [
    "You are a study coach for nursing exam preparation.",
    "Be direct, clear, and supportive. Use plain language.",
    "Never say you are an AI. Never use marketing language.",
    "Never use em dashes. Use commas, colons, or periods instead.",
    "Keep responses concise and actionable.",
    "Use proper medical terminology only when it aids understanding.",
    "Do not give clinical advice or diagnose. Focus on study strategy and concept clarity.",
  ].join(" ");

  const intentGuide: Record<CoachIntent, string> = {
    explain_simply: [
      "Restate the concept in simpler terms.",
      "Break it into 2-3 clear points.",
      "Use an analogy if it helps.",
      "End with one sentence summarizing the key takeaway.",
    ].join(" "),
    why_wrong: [
      "Explain why the correct answer is right and why the student's thinking might have gone wrong.",
      "Be constructive, not critical.",
      "Point out the specific concept that matters.",
      "Suggest what to remember for similar questions.",
    ].join(" "),
    what_next: [
      "Based on the student's weak areas and progress, recommend what to study next.",
      "Be specific: name the topic and why it matters.",
      "Keep the recommendation to 2-3 sentences.",
    ].join(" "),
    weak_summary: [
      "Summarize the student's weak areas in a structured format.",
      "For each area, briefly state why it needs attention and one concrete step to improve.",
      "Limit to the top 3-5 areas.",
      "Use this format: topic name, brief assessment, suggested action.",
    ].join(" "),
    topic_review: [
      "Extract the 3-5 most important points from the content.",
      "Present each as a clear, memorable statement.",
      "Focus on exam-relevant facts and clinical reasoning patterns.",
    ].join(" "),
    quick_plan: [
      "Create a focused 15-30 minute study session plan.",
      "Include 3-4 specific steps with time estimates.",
      "Prioritize the student's weakest areas.",
      "End with a suggested next step.",
    ].join(" "),
    quiz_concept: [
      "Generate one NCLEX-style multiple choice question about the concept.",
      "Include 4 options (A through D) with one correct answer.",
      "After the options, provide the correct answer and a brief explanation.",
      "Make the question test understanding, not memorization.",
    ].join(" "),
    readiness_explain: [
      "Polish the following readiness summary without changing any numbers or band labels.",
      "Do not invent metrics. Keep the same structure and bullets.",
    ].join(" "),
    study_priority_ranked: [
      "Polish the following ranked topic list without changing order or scores.",
      "Do not invent topics. Keep bullets intact.",
    ].join(" "),
    pattern_insight: [
      "Polish the following pattern summary without adding new claims.",
      "Do not invent learner data.",
    ].join(" "),
    intervention_alert: [
      "Polish the short intervention note. Keep the same meaning and calm tone.",
      "Do not add new risks or statistics.",
    ].join(" "),
  };

  return `${base}\n\n${intentGuide[intent]}`;
}

/**
 * Build the user prompt from the request context.
 */
export function buildCoachUserPrompt(req: CoachRequest): string {
  const parts: string[] = [];

  switch (req.intent) {
    case "explain_simply":
      parts.push("Explain this concept more clearly:");
      if (req.context.content) parts.push(req.context.content);
      if (req.context.topic) parts.push(`Topic: ${req.context.topic}`);
      break;

    case "why_wrong":
      parts.push("Help me understand why this answer is wrong:");
      if (req.context.content) parts.push(`Question: ${req.context.content}`);
      if (req.context.rationale) parts.push(`Explanation given: ${req.context.rationale}`);
      if (req.context.topic) parts.push(`Topic: ${req.context.topic}`);
      break;

    case "what_next":
      parts.push("Based on my study progress, what should I focus on next?");
      if (req.context.weakTopics?.length) {
        parts.push(`My weak areas: ${req.context.weakTopics.join(", ")}`);
      }
      if (req.context.examTarget) parts.push(`Exam: ${req.context.examTarget.replace(/_/g, " ")}`);
      if (req.context.daysUntilExam != null) {
        parts.push(`Days until exam: ${req.context.daysUntilExam}`);
      }
      break;

    case "weak_summary":
      parts.push("Summarize my weak areas and what I should do about each:");
      if (req.context.weakTopics?.length) {
        parts.push(`Weak topics: ${req.context.weakTopics.join(", ")}`);
      }
      if (req.context.examTarget) parts.push(`Exam: ${req.context.examTarget.replace(/_/g, " ")}`);
      break;

    case "topic_review":
      parts.push("Give me the key points from this content:");
      if (req.context.content) parts.push(req.context.content);
      if (req.context.topic) parts.push(`Topic: ${req.context.topic}`);
      break;

    case "quiz_concept":
      parts.push("Create a practice question about this concept:");
      if (req.context.content) parts.push(req.context.content);
      if (req.context.topic) parts.push(`Topic: ${req.context.topic}`);
      if (req.context.subtopic) parts.push(`Subtopic: ${req.context.subtopic}`);
      break;

    case "quick_plan":
      parts.push("Build me a short focused study session:");
      if (req.context.weakTopics?.length) {
        parts.push(`Focus on: ${req.context.weakTopics.join(", ")}`);
      }
      if (req.context.examTarget) parts.push(`Exam: ${req.context.examTarget.replace(/_/g, " ")}`);
      if (req.context.daysUntilExam != null) {
        parts.push(`Days until exam: ${req.context.daysUntilExam}`);
      }
      break;

    case "readiness_explain":
    case "study_priority_ranked":
    case "pattern_insight":
    case "intervention_alert":
      if (req.context.content) parts.push(req.context.content);
      break;
  }

  return parts.join("\n");
}
