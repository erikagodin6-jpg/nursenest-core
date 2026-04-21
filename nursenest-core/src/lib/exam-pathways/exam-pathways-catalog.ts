/**
 * Lightweight exam pathway catalog: ordered `EXAM_PATHWAYS` + id lookup only.
 * Heavy marketing resolution (NP SEO aliases, pool helpers) stays in `exam-product-registry.ts`.
 */
import type { ExamPathwayDefinition } from "./types";
import { EXAM_PATHWAYS_SEGMENT_A } from "./exam-pathways-data-segment-a";
import { EXAM_PATHWAYS_SEGMENT_B } from "./exam-pathways-data-segment-b";
import { EXAM_PATHWAYS_SEGMENT_C } from "./exam-pathways-data-segment-c";
import { EXAM_PATHWAYS_SEGMENT_D } from "./exam-pathways-data-segment-d";

export const EXAM_PATHWAYS: ExamPathwayDefinition[] = [
  ...EXAM_PATHWAYS_SEGMENT_A,
  ...EXAM_PATHWAYS_SEGMENT_B,
  ...EXAM_PATHWAYS_SEGMENT_C,
  ...EXAM_PATHWAYS_SEGMENT_D,
];

const byId = new Map<string, ExamPathwayDefinition>();
for (const p of EXAM_PATHWAYS) {
  byId.set(p.id, p);
}

export function getExamPathwayById(id: string): ExamPathwayDefinition | undefined {
  return byId.get(id);
}

/** Lowercased marketing `countrySlug` values present in the catalog (for locale-prefixed URL normalization). */
export const EXAM_PATHWAY_COUNTRY_SLUGS = new Set(
  EXAM_PATHWAYS.map((p) => p.countrySlug.trim().toLowerCase()),
);
