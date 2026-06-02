import type { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk D of `EXAM_PATHWAYS` (allied). */
export const EXAM_PATHWAYS_SEGMENT_D: ExamPathwayDefinition[] = [
  {
    id: "ca-allied-core",
    countrySlug: "canada",
    countryCode: "CA" as CountryCode,
    roleTrack: "allied",
    examCode: "allied-health",
    examFamily: "ALLIED" as ExamFamily,
    examKey: "ALLIED",
    displayName: "Allied Health Certification Prep (Canada)",
    shortName: "Allied Health",
    stripeTier: "ALLIED" as TierCode,
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
    countryCode: "US" as CountryCode,
    roleTrack: "allied",
    examCode: "allied-health",
    examFamily: "ALLIED" as ExamFamily,
    examKey: "ALLIED",
    displayName: "Allied Health Certification Prep (United States)",
    shortName: "Allied Health",
    stripeTier: "ALLIED" as TierCode,
    contentExamKeys: ["ALLIED"],
    seoTitle: "Allied Health Exam Prep | United States | NurseNest",
    seoDescription:
      "US allied health certifications: rapid prioritization, protocol mastery, and timed practice scoped to your discipline.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
