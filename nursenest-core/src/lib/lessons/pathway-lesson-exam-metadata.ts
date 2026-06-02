import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  buildExamPathwayRuntimeMetadata,
  type ExamPathwayRuntimeMetadata,
} from "@/lib/exam-context/exam-pathway-metadata";

/**
 * Canonical runtime metadata for pathway lesson authoring, routing, and client payloads.
 * Lesson content must be scoped to the learner's selected exam pathway instead of inferred
 * from loose topic titles or historical shared lesson tags.
 */
export function getPathwayLessonExamMetadata(
  pathwayId: string | null | undefined,
): ExamPathwayRuntimeMetadata | null {
  const key = pathwayId?.trim();
  if (!key) return null;
  const pathway = getExamPathwayById(key);
  return pathway ? buildExamPathwayRuntimeMetadata(pathway) : null;
}
