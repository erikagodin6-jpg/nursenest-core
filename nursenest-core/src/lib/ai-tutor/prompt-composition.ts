import { TUTORING_SAFETY_DISCLAIMERS } from "@/lib/ai-tutor/safety-copy";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";

const MAX_LABEL_LEN = 120;
const MAX_TOPIC_KEYS = 12;
const MAX_IDS = 8;
const MAX_SIGNALS = 16;

/** Strip angle-brackets and collapse whitespace so user-originating labels cannot inject pseudo-tags. */
export function escapePlainTextForPromptFragment(input: string): string {
  const trimmed = input.trim().slice(0, MAX_LABEL_LEN);
  return trimmed.replace(/[<>]/g, "").replace(/\s+/g, " ");
}

function truncateList(items: string[], max: number): string[] {
  return items.slice(0, max).map((s) => escapePlainTextForPromptFragment(s));
}

/**
 * Builds a single plain-text system-style block from structured fields only.
 * Callers must not pass HTML, stems, rationales, or free-form user essays.
 */
export function composeTutoringPromptEnvelope(ctx: TutoringPromptContext): string {
  const lines: string[] = [
    "ROLE: nursing exam tutor (educational framing only).",
    `DISCLAIMERS: ${TUTORING_SAFETY_DISCLAIMERS.educationalOnly} ${TUTORING_SAFETY_DISCLAIMERS.aiMayErr}`,
    `PATHWAY_ID: ${escapePlainTextForPromptFragment(ctx.entitlementSnapshot.pathwayId)}`,
    `LOCALE: ${escapePlainTextForPromptFragment(ctx.locale ?? "en")}`,
    `TOPIC_KEYS: ${truncateList(ctx.topicKeys, MAX_TOPIC_KEYS).join(" | ") || "(none)"}`,
    `SIGNALS: ${truncateList(ctx.signalNames, MAX_SIGNALS).join(", ") || "(none)"}`,
    `FOCUS_IDS: ${truncateList(ctx.focusContentIds, MAX_IDS).join(", ") || "(none)"}`,
    `FOCUS_LABELS: ${truncateList(ctx.focusContentLabels, MAX_IDS).join(" | ") || "(none)"}`,
  ];
  return lines.join("\n");
}
