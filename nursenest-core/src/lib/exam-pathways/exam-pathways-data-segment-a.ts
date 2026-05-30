import type { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/** Ordered chunk A of `EXAM_PATHWAYS` (CA PN → CA RN → CA NP → US PN). Do not reorder without matching `exam-product-registry`. */
export const EXAM_PATHWAYS_SEGMENT_A: ExamPathwayDefinition[] = [
  // —— Canada — RPN / PN ——
  {
    id: "ca-rpn-rex-pn",
    countrySlug: "canada",
    countryCode: "CA" as CountryCode,
    roleTrack: "rpn",
    examCode: "rex-pn",
    examFamily: "REX_PN" as ExamFamily,
    examKey: "REX_PN",
    displayName: "REx-PN (Canada RPN)",
    shortName: "REx-PN",
    stripeTier: "RPN" as TierCode,
    contentExamKeys: ["NCLEX-PN", "REx-PN", "REX-PN"],
    seoTitle: "REx-PN practice questions for Canada | NurseNest",
    seoDescription:
      "Practice REx-PN questions with realistic items, rationales, and adaptive tests. Built for Canadian nurses.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— Canada — RN ——
  {
    id: "ca-rn-nclex-rn",
    countrySlug: "canada",
    countryCode: "CA" as CountryCode,
    roleTrack: "rn",
    examCode: "nclex-rn",
    examFamily: "NCLEX_RN" as ExamFamily,
    examKey: "NCLEX_RN",
    displayName: "NCLEX-RN (Canada)",
    shortName: "NCLEX-RN",
    stripeTier: "RN" as TierCode,
    contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
    seoTitle: "NCLEX-RN Exam Prep Canada — Practice Questions & CAT",
    seoDescription:
      "Practice NCLEX-RN questions with rationales and adaptive tests. Built for Canadian nurses.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— Canada — NP (CNPLE; single-classification model; LOFT format; live May 2026) ——
  {
    id: "ca-np-cnple",
    countrySlug: "canada",
    countryCode: "CA" as CountryCode,
    roleTrack: "np",
    examCode: "cnple",
    examFamily: "NP" as ExamFamily,
    examKey: "CA_NP_LICENSURE",
    displayName: "Canadian Nurse Practitioner Licensure Examination",
    shortName: "CNPLE",
    stripeTier: "NP" as TierCode,
    contentExamKeys: ["NP", "CNPLE", "CAN-NP"],
    boardLabel: "CCRNR / Canadian NP licensure pathway",
    seoTitle: "CNPLE exam prep — Canadian NP | NurseNest",
    seoDescription:
      "Prepare for the Canadian Nurse Practitioner Licensure Examination (CNPLE). Practice clinical judgment across lifespan, primary care, prescribing, diagnostics, and professional practice. Built for Canada's single-classification NP model.",
    status: "active",
    acquisitionMode: "subscribe",
    internalNotes:
      "CNPLE: LOFT (linear on-the-fly testing), not CAT. Canada single NP classification model (CCRNR). Launched May 2026. All CNPLE SEO cluster pages live. Do NOT label as CAT.",
  },
  // —— US — LVN/LPN ——
  {
    id: "us-lpn-nclex-pn",
    countrySlug: "us",
    countryCode: "US" as CountryCode,
    roleTrack: "lpn",
    examCode: "nclex-pn",
    examFamily: "NCLEX_PN" as ExamFamily,
    examKey: "NCLEX_PN",
    displayName: "NCLEX-PN (US LPN / LVN)",
    shortName: "NCLEX-PN",
    stripeTier: "LVN_LPN" as TierCode,
    contentExamKeys: ["NCLEX-PN", "NCLEX_PN"],
    seoTitle: "NCLEX-PN Exam Prep | US LPN / LVN | NurseNest",
    seoDescription:
      "US practical/vocational nursing: NCLEX-PN practice, safety-first rationales, and timed mocks scoped for LVN/LPN candidates.",
    status: "active",
    acquisitionMode: "subscribe",
  },
];
