import "server-only";

/**
 * Study Coach action model.
 *
 * Each intent maps to a focused, structured guidance request.
 * The coach never appears as a chatbot; it surfaces as contextual
 * actions embedded in existing learning surfaces.
 */

export type CoachIntent =
  | "explain_simply"
  | "why_wrong"
  | "what_next"
  | "weak_summary"
  | "topic_review"
  | "quick_plan"
  | "quiz_concept";

export interface CoachAction {
  intent: CoachIntent;
  label: string;
  description: string;
}

export interface CoachRequest {
  intent: CoachIntent;
  context: CoachContext;
}

export interface CoachContext {
  /** Question stem or lesson content to explain */
  content?: string;
  /** Topic being studied */
  topic?: string;
  /** Subtopic if available */
  subtopic?: string;
  /** Whether the user answered correctly (for review contexts) */
  wasCorrect?: boolean;
  /** Existing rationale to build on */
  rationale?: string;
  /** User's weak topics for personalization */
  weakTopics?: string[];
  /** Exam target (NCLEX_RN, etc.) */
  examTarget?: string;
  /** Days until exam */
  daysUntilExam?: number;
}

export interface CoachResponse {
  intent: CoachIntent;
  title: string;
  content: string;
  /** Structured sections for rich display */
  sections?: CoachSection[];
  /** Suggested follow-up actions */
  followUp?: { label: string; intent: CoachIntent }[];
}

export interface CoachSection {
  heading: string;
  body: string;
}

export const REVIEW_ACTIONS: CoachAction[] = [
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

export const LESSON_ACTIONS: CoachAction[] = [
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

export const DASHBOARD_ACTIONS: CoachAction[] = [
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

/**
 * Build the system prompt for a given intent.
 * Keeps the coach voice human, concise, and structured.
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
  }

  return parts.join("\n");
}

const INTENT_TITLES: Record<CoachIntent, string> = {
  explain_simply: "Simplified Explanation",
  why_wrong: "Why This Was Wrong",
  what_next: "What to Study Next",
  weak_summary: "Focus Areas to Review",
  topic_review: "Key Points",
  quick_plan: "Quick Study Session",
  quiz_concept: "Quick Check",
};

export function titleForIntent(intent: CoachIntent): string {
  return INTENT_TITLES[intent];
}

const FOLLOW_UPS: Record<CoachIntent, { label: string; intent: CoachIntent }[]> = {
  explain_simply: [
    { label: "Quiz Me on This", intent: "quiz_concept" },
    { label: "Key Points Only", intent: "topic_review" },
  ],
  why_wrong: [
    { label: "Simplify This", intent: "explain_simply" },
    { label: "Quiz Me on This", intent: "quiz_concept" },
  ],
  what_next: [
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "Focus Areas to Review", intent: "weak_summary" },
  ],
  weak_summary: [
    { label: "Build a Quick Review", intent: "quick_plan" },
    { label: "What to Study Next", intent: "what_next" },
  ],
  topic_review: [
    { label: "Quiz Me on This", intent: "quiz_concept" },
    { label: "Simplify This", intent: "explain_simply" },
  ],
  quick_plan: [
    { label: "Focus Areas to Review", intent: "weak_summary" },
  ],
  quiz_concept: [
    { label: "Simplify This", intent: "explain_simply" },
    { label: "Key Points Only", intent: "topic_review" },
  ],
};

export function followUpsForIntent(intent: CoachIntent): { label: string; intent: CoachIntent }[] {
  return FOLLOW_UPS[intent] ?? [];
}
