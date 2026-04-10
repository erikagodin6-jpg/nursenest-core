import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { validateLearnerCopyForExamContext as validateCopyForContext } from "@/lib/exam-context/content-guardrails";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type LearnerCopySurface =
  | "hub_hero"
  | "hub_trust"
  | "lesson_header"
  | "cat_coach"
  | "cat_rationale"
  | "recommendation_card"
  | "topic_cluster";

export function validateLearnerCopyForExamContext(
  pathway: ExamPathwayDefinition,
  text: string | null | undefined,
  surface: LearnerCopySurface,
): void {
  if (text == null || typeof text !== "string") return;
  const t = text.trim();
  if (t.length < 8) return;
  const examContext = buildGlobalExamContext(pathway.id, "en");
  if (!examContext) return;

  for (const violation of validateCopyForContext(t, examContext)) {
    safeServerLog("learner_copy", "learner_copy_context_mismatch", {
      event: "learner_copy_context_mismatch",
      rule_id: violation.code,
      pathway_id: pathway.id,
      expected_exam: pathway.shortName,
      surface,
      mismatch_label: violation.detail,
      snippet: t.slice(0, 160),
    });
  }
}
