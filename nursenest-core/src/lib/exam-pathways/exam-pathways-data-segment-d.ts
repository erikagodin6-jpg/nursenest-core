import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk D of `EXAM_PATHWAYS` (allied). */
export const EXAM_PATHWAYS_SEGMENT_D: ExamPathwayDefinition[] = [
  {
    id: "ca-allied-core",
    countrySlug: "canada",
    countryCode: CountryCode.CA,
    roleTrack: "allied",
    examCode: "allied-health",
    examFamily: ExamFamily.ALLIED,
    examKey: "ALLIED",
    displayName: "Allied health certification prep (Canada)",
    shortName: "Allied health",
    stripeTier: TierCode.ALLIED,
    contentExamKeys: ["ALLIED"],
    seoTitle: "Allied Health Exam Prep | Canada | NurseNest",
    seoDescription:
      "Allied health exam preparation with reasoning-heavy items and protocol edges matched to Canadian certification contexts.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  {
    id: "us-allied-core",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "allied",
    examCode: "allied-health",
    examFamily: ExamFamily.ALLIED,
    examKey: "ALLIED",
    displayName: "Allied health certification prep (United States)",
    shortName: "Allied health",
    stripeTier: TierCode.ALLIED,
    contentExamKeys: ["ALLIED"],
    seoTitle: "Allied Health Exam Prep | United States | NurseNest",
    seoDescription:
      "US allied health certifications: rapid prioritization, protocol mastery, and timed practice scoped to your discipline.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
