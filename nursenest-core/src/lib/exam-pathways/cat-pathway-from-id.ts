import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Resolve catalog row for id; undefined when unknown */
export function tryCatPathwayFromId(pathwayId: string | null | undefined): ExamPathwayDefinition | undefined {
  const id = pathwayId?.trim();
  if (!id) return undefined;
  return getExamPathwayById(id);
}
