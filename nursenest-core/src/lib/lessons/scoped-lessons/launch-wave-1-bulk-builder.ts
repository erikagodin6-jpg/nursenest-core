/**
 * Builder for bulk Launch Wave 1 lessons — shared variant shells + row→spec mapping.
 */
import { rel, RELATED_CORE } from "@/lib/lessons/scoped-lessons/launch-wave-1-rel";
import type { Wave1LessonSpec, Wave1VariantBlock, Wave1VariantKey } from "@/lib/lessons/scoped-lessons/launch-wave-1-shared";

export type BulkRow = {
  slug: string;
  shortTitle: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  npTitleStem: string;
  npSeoDescription: string;
  sharedCore: string;
  labsDiagnostics?: string;
  labsOmitReason?: string;
  pn: string;
  caRpn: string;
  usRn: string;
  caRn: string;
  np: string;
  examRelevance: string;
  scenario: string;
  takeaways: string;
  related: (keyof typeof RELATED_CORE)[];
  preTest: import("@/lib/lessons/pathway-lesson-types").PathwayLessonQuizItem[];
  postTest: import("@/lib/lessons/pathway-lesson-types").PathwayLessonQuizItem[];
};

function block(
  _tier: Wave1VariantKey,
  row: BulkRow,
  title: string,
  seoTitle: string,
  seoDescription: string,
  clinical_meaning: string,
): Wave1VariantBlock {
  return {
    title,
    seoTitle,
    seoDescription,
    clinical_meaning,
    exam_relevance: row.examRelevance,
    clinical_scenario: row.scenario,
    takeaways: row.takeaways,
  };
}

export function bulkRowToSpec(row: BulkRow): Wave1LessonSpec {
  const { relatedSlugs, relatedTitlesBySlug } = rel(...row.related);
  const v: Record<Wave1VariantKey, Wave1VariantBlock> = {
    us_pn: block(
      "us_pn",
      row,
      `${row.shortTitle} (NCLEX-PN, US)`,
      `${row.shortTitle} | NCLEX-PN US | NurseNest`,
      `US PN: ${row.topic} — safe scope, ordered care, escalation, and teaching boundaries aligned to NCLEX-PN.`,
      row.pn,
    ),
    ca_rpn: block(
      "ca_rpn",
      row,
      `${row.shortTitle} (REx-PN, Canada)`,
      `${row.shortTitle} | REx-PN Canada | NurseNest`,
      `Canada RPN: ${row.topic} with college-aligned scope, metric labs when shown, and collaborative escalation.`,
      row.caRpn,
    ),
    us_rn: block(
      "us_rn",
      row,
      `${row.shortTitle} (NCLEX-RN, US)`,
      `${row.shortTitle} | NCLEX-RN US | NurseNest`,
      `US RN: ${row.topic} — clinical judgment, prioritization, monitoring, and interprofessional communication.`,
      row.usRn,
    ),
    ca_rn: block(
      "ca_rn",
      row,
      `${row.shortTitle} (NCLEX-RN, Canada)`,
      `${row.shortTitle} | NCLEX-RN Canada | NurseNest`,
      `Canada RN: ${row.topic} with SI/metric context and the same prioritization spine as US NCLEX-RN.`,
      row.caRn,
    ),
    us_np: block(
      "us_np",
      row,
      `${row.npTitleStem} (NP placeholder)`,
      "placeholder",
      row.npSeoDescription,
      row.np,
    ),
  };
  return {
    slug: row.slug,
    topic: row.topic,
    topicSlug: row.topicSlug,
    bodySystem: row.bodySystem,
    npTitleStem: row.npTitleStem,
    npSeoDescription: row.npSeoDescription,
    sharedCore: row.sharedCore,
    labsDiagnostics: row.labsDiagnostics,
    labsOmitReason: row.labsOmitReason,
    relatedSlugs,
    relatedTitlesBySlug,
    variants: v,
    preTest: row.preTest,
    postTest: row.postTest,
  };
}
