import { aiPromptWithMeasurementGuardrails } from "@/lib/measurements/measurement-ai-boundary";
import { TUTORING_SAFETY_DISCLAIMERS } from "@/lib/ai-tutor/safety-copy";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import { resolvePsychometricContext } from "@/lib/testing/psychometric-orchestrator";

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
  const psych = resolvePsychometricContext(ctx.entitlementSnapshot.pathwayId);
  const lines: string[] = [
    "ROLE: nursing exam tutor (educational framing only).",
    `DISCLAIMERS: ${TUTORING_SAFETY_DISCLAIMERS.educationalOnly} ${TUTORING_SAFETY_DISCLAIMERS.aiMayErr}`,
    `TESTING_MODEL: ${psych.model}`,
    `PSYCHOMETRIC_STYLE: ${psych.definition.psychometricStyle}`,
    `REMEDIATION_STYLE: ${psych.definition.remediationStyle}`,
    psych.model === "LOFT"
      ? "FRAMING: Use blueprint balance and competency readiness language. Do not describe adaptive difficulty, theta, standard error, or CAT-style exam adaptation."
      : psych.model === "CAT"
        ? "FRAMING: Adaptive CAT practice semantics are allowed when clinically appropriate."
        : "FRAMING: Linear practice review semantics; avoid CAT adaptive psychometric jargon unless contrasting formats.",
    `PATHWAY_ID: ${escapePlainTextForPromptFragment(ctx.entitlementSnapshot.pathwayId)}`,
    `LOCALE: ${escapePlainTextForPromptFragment(ctx.locale ?? "en")}`,
    `TOPIC_KEYS: ${truncateList(ctx.topicKeys, MAX_TOPIC_KEYS).join(" | ") || "(none)"}`,
    `SIGNALS: ${truncateList(ctx.signalNames, MAX_SIGNALS).join(", ") || "(none)"}`,
    `FOCUS_IDS: ${truncateList(ctx.focusContentIds, MAX_IDS).join(", ") || "(none)"}`,
    `FOCUS_LABELS: ${truncateList(ctx.focusContentLabels, MAX_IDS).join(" | ") || "(none)"}`,
  ];
  return aiPromptWithMeasurementGuardrails(lines.join("\n"));
}

/**
 * Graph-ordered tutoring prompt — EduGraphStep[] is the sole remediation sequencing authority.
 */
export function composeTutoringPromptFromGraphSteps(
  ctx: TutoringPromptContext,
  graphSteps: readonly EduGraphStep[],
): string {
  const base = composeTutoringPromptEnvelope(ctx);
  if (graphSteps.length === 0) return base;

  const ladder = graphSteps.slice(0, 10).map((s, i) => {
    const rel = s.telemetryMetadata.reasoningRelation ?? s.educationalIntent;
    return [
      `STEP_${i + 1}_KIND: ${s.stepKind}`,
      `STEP_${i + 1}_TITLE: ${escapePlainTextForPromptFragment(s.title)}`,
      `STEP_${i + 1}_REASON: ${escapePlainTextForPromptFragment(s.description)}`,
      `STEP_${i + 1}_HREF: ${escapePlainTextForPromptFragment(s.href)}`,
      `STEP_${i + 1}_RELATION: ${rel}`,
      `STEP_${i + 1}_COMPETENCY: ${s.competencyId ?? "general"}`,
    ].join("\n");
  });

  return aiPromptWithMeasurementGuardrails(
    [
      base,
      "REMEDIATION_GRAPH_ORDER: Follow steps in order; do not invent alternate URLs or parallel ladders.",
      ...ladder,
    ].join("\n\n"),
  );
}
