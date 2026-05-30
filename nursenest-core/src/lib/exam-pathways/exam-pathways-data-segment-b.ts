import type { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk B of `EXAM_PATHWAYS` (US RN + new grad). */
export const EXAM_PATHWAYS_SEGMENT_B: ExamPathwayDefinition[] = [
  // —— US — RN ——
  {
    id: "us-rn-nclex-rn",
    countrySlug: "us",
    countryCode: "US" as CountryCode,
    roleTrack: "rn",
    examCode: "nclex-rn",
    examFamily: "NCLEX_RN" as ExamFamily,
    examKey: "NCLEX_RN",
    displayName: "NCLEX-RN (United States)",
    shortName: "NCLEX-RN",
    stripeTier: "RN" as TierCode,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "NCLEX-RN Practice Questions, Lessons & CAT Exam Prep | NurseNest",
    seoDescription:
      "200 lessons and 480+ NCLEX-RN practice questions with rationales, Next Generation NCLEX (NGN) clinical judgment, and adaptive CAT simulation. Study smarter for your RN exam.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— US — New grad RN (transition-to-practice lessons; NEW_GRAD tier) ——
  {
    id: "us-rn-new-grad-transition",
    countrySlug: "us",
    countryCode: "US" as CountryCode,
    roleTrack: "rn",
    examCode: "new-grad-transition",
    examFamily: "NCLEX_RN" as ExamFamily,
    examKey: "NEW_GRAD_TRANSITION",
    displayName: "New Grad RN: Transition to Practice",
    shortName: "New Grad",
    stripeTier: "NEW_GRAD" as TierCode,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "New Grad RN Transition | First Year on the Floor | NurseNest",
    seoDescription:
      "Practical lessons for new graduate RNs: prioritization, delegation, communication, and time management for your first year of practice.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
