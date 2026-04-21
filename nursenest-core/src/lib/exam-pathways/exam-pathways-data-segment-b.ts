import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk B of `EXAM_PATHWAYS` (US RN + new grad). */
export const EXAM_PATHWAYS_SEGMENT_B: ExamPathwayDefinition[] = [
  // —— US — RN ——
  {
    id: "us-rn-nclex-rn",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "rn",
    examCode: "nclex-rn",
    examFamily: ExamFamily.NCLEX_RN,
    examKey: "NCLEX_RN",
    displayName: "NCLEX-RN (United States)",
    shortName: "NCLEX-RN",
    stripeTier: TierCode.RN,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "NCLEX-RN Exam Prep | United States | NurseNest",
    seoDescription:
      "US RN prep: clinical judgment practice, NGN-style items where available, and full-length mocks filtered for US candidates.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— US — New grad RN (transition-to-practice lessons; NEW_GRAD tier) ——
  {
    id: "us-rn-new-grad-transition",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "rn",
    examCode: "new-grad-transition",
    examFamily: ExamFamily.NCLEX_RN,
    examKey: "NEW_GRAD_TRANSITION",
    displayName: "New Grad RN: transition to practice",
    shortName: "New Grad",
    stripeTier: TierCode.NEW_GRAD,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "New Grad RN Transition | First Year on the Floor | NurseNest",
    seoDescription:
      "Practical lessons for new graduate RNs: prioritization, delegation, communication, and time management for your first year of practice.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
