import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk A of `EXAM_PATHWAYS` (CA PN → CA RN → CA NP → US PN). Do not reorder without matching `exam-product-registry`. */
export const EXAM_PATHWAYS_SEGMENT_A: ExamPathwayDefinition[] = [
  // —— Canada — RPN / PN ——
  {
    id: "ca-rpn-rex-pn",
    countrySlug: "canada",
    countryCode: CountryCode.CA,
    roleTrack: "rpn",
    examCode: "rex-pn",
    examFamily: ExamFamily.REX_PN,
    examKey: "REX_PN",
    displayName: "REx-PN (Canada RPN)",
    shortName: "REx-PN",
    stripeTier: TierCode.RPN,
    contentExamKeys: ["NCLEX-PN", "REx-PN", "REX-PN"],
    seoTitle: "REx-PN Exam Prep | Canada PN | NurseNest",
    seoDescription:
      "Canada practical nurse exam prep: REx-PN practice questions, lessons, and timed sets scoped for Canadian PN candidates.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— Canada — RN ——
  {
    id: "ca-rn-nclex-rn",
    countrySlug: "canada",
    countryCode: CountryCode.CA,
    roleTrack: "rn",
    examCode: "nclex-rn",
    examFamily: ExamFamily.NCLEX_RN,
    examKey: "NCLEX_RN",
    displayName: "NCLEX-RN (Canada)",
    shortName: "NCLEX-RN",
    stripeTier: TierCode.RN,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "NCLEX-RN Canada | RN Exam Prep | NurseNest",
    seoDescription:
      "RN licensure prep for Canadian candidates: NCLEX-RN-style practice, clinical reasoning, and mock exams aligned to your registration context.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— Canada — NP (transition-ready; extensible) ——
  {
    id: "ca-np-cnple",
    countrySlug: "canada",
    countryCode: CountryCode.CA,
    roleTrack: "np",
    examCode: "cnple",
    examFamily: ExamFamily.NP,
    examKey: "CA_NP_LICENSURE",
    displayName: "Canadian NP licensure (CNPLE track)",
    shortName: "CNPLE",
    stripeTier: TierCode.NP,
    contentExamKeys: ["NP", "CNPLE", "CAN-NP"],
    boardLabel: "Canadian NP licensure pathway",
    seoTitle: "Canadian NP Exam Prep | NurseNest",
    seoDescription:
      "NurseNest supports Canadian NP preparation with pathway-scoped content. National licensure integration is evolving—this hub stays current as requirements finalize.",
    status: "upcoming",
    acquisitionMode: "waitlist",
    internalNotes:
      "2026+ transition: keep status/contentExamKeys configurable; add parallel pathway rows if regulators split exams.",
  },
  // —— US — LVN/LPN ——
  {
    id: "us-lpn-nclex-pn",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "lpn",
    examCode: "nclex-pn",
    examFamily: ExamFamily.NCLEX_PN,
    examKey: "NCLEX_PN",
    displayName: "NCLEX-PN (US LPN / LVN)",
    shortName: "NCLEX-PN",
    stripeTier: TierCode.LVN_LPN,
    contentExamKeys: ["NCLEX-PN", "NCLEX_PN"],
    seoTitle: "NCLEX-PN Exam Prep | US LPN / LVN | NurseNest",
    seoDescription:
      "US practical/vocational nursing: NCLEX-PN practice, safety-first rationales, and timed mocks scoped for LVN/LPN candidates.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
