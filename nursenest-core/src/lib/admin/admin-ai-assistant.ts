import { z } from "zod";
import { AI_SUPPORT_RESPONSE_RULES } from "@/lib/support/ai-support-rules";

export const ADMIN_AI_ASSISTANT_TASK_VALUES = [
  "draft_blog_post",
  "draft_support_reply",
  "summarize_error_logs",
  "suggest_lesson_title_cleanup",
  "suggest_lesson_category_cleanup",
] as const;

export type AdminAiAssistantTaskType = (typeof ADMIN_AI_ASSISTANT_TASK_VALUES)[number];

export const adminAiAssistantRequestSchema = z.object({
  taskType: z.enum(ADMIN_AI_ASSISTANT_TASK_VALUES),
  input: z.string().trim().min(1, "Input is required.").max(12_000, "Input is too long."),
});

export type AdminAiAssistantRequest = z.infer<typeof adminAiAssistantRequestSchema>;

export const ADMIN_AI_ASSISTANT_TASKS: ReadonlyArray<{
  value: AdminAiAssistantTaskType;
  label: string;
  shortLabel: string;
  placeholder: string;
  description: string;
}> = [
  {
    value: "draft_blog_post",
    label: "Draft Blog Post",
    shortLabel: "Blog",
    placeholder: "Topic, exam, audience, angle, and any must-cover points.",
    description: "Generates a draft article outline/body direction for admin review only.",
  },
  {
    value: "draft_support_reply",
    label: "Draft Support Reply",
    shortLabel: "Support",
    placeholder: "Paste the learner message and the context you want the draft to consider.",
    description: "Drafts a cautious support response without making account, billing, or refund decisions.",
  },
  {
    value: "summarize_error_logs",
    label: "Summarize Error / Logs",
    shortLabel: "Logs",
    placeholder: "Paste stack traces, logs, or incident notes to summarize.",
    description: "Summarizes signals, likely causes, and safe next checks without proposing deploy actions.",
  },
  {
    value: "suggest_lesson_title_cleanup",
    label: "Suggest Lesson Title Cleanup",
    shortLabel: "Titles",
    placeholder: "Paste lesson titles that need consistency, grammar, or style cleanup.",
    description: "Suggests cleaner lesson titles while preserving meaning and learner intent.",
  },
  {
    value: "suggest_lesson_category_cleanup",
    label: "Suggest Lesson Category Cleanup",
    shortLabel: "Categories",
    placeholder: "Paste lesson titles plus current categories or problem notes.",
    description: "Suggests category cleanup recommendations and flags uncertainty for human review.",
  },
] as const;

const TASK_INSTRUCTIONS: Record<AdminAiAssistantTaskType, string> = {
  draft_blog_post:
    "Return a draft blog recommendation with a proposed title, audience framing, a tight outline, and 3 to 5 practical notes for the human editor.",
  draft_support_reply:
    "Return a draft support reply that is calm, factual, and clearly non-final. Do not promise refunds, cancellations, account changes, or outcomes.",
  summarize_error_logs:
    "Return a draft incident summary with observed symptoms, likely causes, and low-risk next checks. Do not recommend deploys, migrations, or production changes as completed facts.",
  suggest_lesson_title_cleanup:
    "Return draft title cleanup suggestions as before -> after pairs with a short reason for each change.",
  suggest_lesson_category_cleanup:
    "Return draft category cleanup suggestions with recommended category, confidence, and rationale. If uncertain, explicitly say review required instead of guessing.",
};

export function getAdminAiAssistantTaskMeta(taskType: AdminAiAssistantTaskType) {
  return ADMIN_AI_ASSISTANT_TASKS.find((task) => task.value === taskType) ?? ADMIN_AI_ASSISTANT_TASKS[0];
}

export function buildAdminAiAssistantMessages(input: AdminAiAssistantRequest): Array<{
  role: "system" | "user";
  content: string;
}> {
  const supportEscalations = AI_SUPPORT_RESPONSE_RULES.escalationRequiredFor.join(", ");
  const supportForbidden = AI_SUPPORT_RESPONSE_RULES.mustNotPromise.join(", ");

  const system = [
    "You are the NurseNest Admin AI Assistant.",
    "You help with internal drafts and recommendations only.",
    "Never claim to publish, email, deploy, save, approve, or change production state.",
    "Always label the response as Draft or Recommendation.",
    "Do not make billing promises, refund decisions, cancellation decisions, or account-access decisions.",
    "Do not provide medical advice beyond educational nursing exam-prep framing.",
    "Do not provide code patches, deploy instructions, migration instructions, or claim that any bug is fixed.",
    "If the input requests a risky or final decision, say that human admin review is required.",
    `Support-specific forbidden promises: ${supportForbidden}.`,
    `Support-specific escalation topics: ${supportEscalations}.`,
    TASK_INSTRUCTIONS[input.taskType],
  ].join("\n");

  const user = [
    `Task Type: ${getAdminAiAssistantTaskMeta(input.taskType).label}`,
    "Required response style:",
    "- Start with 'Draft:' or 'Recommendation:'.",
    "- Keep the output practical and ready for admin review.",
    "- If something is uncertain, say so plainly.",
    "",
    "Input:",
    input.input,
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function ensureAdminAiAssistantDraftLabel(output: string): string {
  const trimmed = output.trim();
  if (!trimmed) {
    return "Draft: No content was generated. Human admin review is required.";
  }
  if (/^(draft|recommendation)\s*:/i.test(trimmed)) {
    return trimmed;
  }
  return `Draft:\n${trimmed}`;
}
