/**
 * RT Ventilator premium module — authoring constants for bank tagging & CAT/practice targeting.
 * No DB migrations: align imports with existing `ExamQuestion.tags` / `topic` string shapes.
 */

import type { Prisma } from "@prisma/client";

/**
 * Apply to `ExamQuestion.tags` for items authored for this premium module.
 * CAT / linear pools can AND this with pathway + allied scope when building ventilator-focused sessions.
 */
export const RT_VENTILATOR_BANK_TAG = "module:rt-ventilator" as const;

/**
 * Intended `ExamQuestion.topic` values once respiratory ventilator content ships.
 * Empty bank today — callers should treat zero matches as “pool not ready,” not hard-error.
 */
export const RT_VENTILATOR_EXAM_QUESTION_TOPIC_KEYS = [
  "Mechanical ventilation",
  "Ventilator alarms",
  "ARDS ventilation",
  "COPD ventilation",
  "Weaning readiness",
] as const;

export type RtVentilatorExamQuestionTopicKey = (typeof RT_VENTILATOR_EXAM_QUESTION_TOPIC_KEYS)[number];

export function examQuestionWhereRtVentilatorBankTag(): Prisma.ExamQuestionWhereInput {
  return { tags: { has: RT_VENTILATOR_BANK_TAG } };
}

/** Topic filter fragments for `PickQuestionsInput.topicNames` when targeting this module slice. */
export function rtVentilatorTopicNamesForPickQuestions(): string[] {
  return [...RT_VENTILATOR_EXAM_QUESTION_TOPIC_KEYS];
}
