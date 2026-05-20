import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/**
 * Internal QA-only admissions exam pathways (HESI A2, HESI Exit, ATI TEAS).
 *
 * - `status: "hidden"` → excluded from public nav, sitemap, and {@link resolveExamPathwayFromMarketingHubSegment}.
 * - Resolved at runtime only when `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` (see {@link resolveExamPathwaySafe}).
 * - **No partial public launch:** keep hidden + flag-off in prod until every item in
 *   `docs/governance/admissions-prep-launch-gate.md` is signed off (commerce, SEO, content, QA).
 */
export const EXAM_PATHWAYS_SEGMENT_F_INTERNAL_ADMISSIONS: ExamPathwayDefinition[] = [
  {
    id: "us-allied-hesi-a2",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "allied",
    examCode: "hesi-a2",
    examFamily: ExamFamily.GENERIC,
    examKey: "HESI_A2",
    displayName: "HESI A2 Admissions Assessment (internal scaffold)",
    shortName: "HESI A2",
    stripeTier: TierCode.PRE_NURSING,
    contentExamKeys: [],
    seoTitle: "HESI A2 prep (internal) | NurseNest",
    seoDescription:
      "Internal pathway scaffold for future HESI A2 admissions preparation — not publicly indexed until launch-approved.",
    status: "hidden",
    acquisitionMode: "info_only",
    internalNotes:
      "Phase 1 scaffold only. Requires NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1 for URL resolution. Map contentExamKeys when question tagging exists.",
  },
  {
    id: "us-allied-hesi-exit",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "allied",
    examCode: "hesi-exit",
    examFamily: ExamFamily.GENERIC,
    examKey: "HESI_EXIT",
    displayName: "HESI Exit Exam (internal scaffold)",
    shortName: "HESI Exit",
    stripeTier: TierCode.PRE_NURSING,
    contentExamKeys: [],
    seoTitle: "HESI Exit prep (internal) | NurseNest",
    seoDescription:
      "Internal pathway scaffold for future HESI Exit preparation — not publicly indexed until launch-approved.",
    status: "hidden",
    acquisitionMode: "info_only",
    internalNotes:
      "Phase 1 scaffold only. Requires NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1 for URL resolution.",
  },
  {
    id: "us-allied-ati-teas",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "allied",
    examCode: "ati-teas",
    examFamily: ExamFamily.GENERIC,
    examKey: "ATI_TEAS",
    displayName: "ATI TEAS (internal scaffold)",
    shortName: "ATI TEAS",
    stripeTier: TierCode.PRE_NURSING,
    contentExamKeys: [],
    seoTitle: "ATI TEAS prep (internal) | NurseNest",
    seoDescription:
      "Internal pathway scaffold for future ATI TEAS admissions preparation — not publicly indexed until launch-approved.",
    status: "hidden",
    acquisitionMode: "info_only",
    internalNotes:
      "Phase 1 scaffold only. Requires NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1 for URL resolution.",
  },
];
