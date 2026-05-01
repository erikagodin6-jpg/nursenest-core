import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "./types";

/**
 * International RN foundation hubs (UK NMC, Australia IQNM, Philippines PNLE).
 * Marketing-only shells: `GENERIC` exam family, empty `contentExamKeys`, `upcoming` + `waitlist`.
 * Readiness treats these via {@link isIntlRnFoundationPathwayId} — not sitemap-`published` until separately approved.
 */
export const EXAM_PATHWAYS_SEGMENT_E: ExamPathwayDefinition[] = [
  {
    id: "uk-rn-nmc-test-of-competence",
    countrySlug: "uk",
    countryCode: CountryCode.GB,
    roleTrack: "rn",
    examCode: "nmc-test-of-competence",
    examFamily: ExamFamily.GENERIC,
    examKey: "NMC_TOC",
    displayName: "UK RN registration / NMC Test of Competence (CBT + OSCE)",
    shortName: "NMC CBT + OSCE",
    stripeTier: TierCode.RN,
    contentExamKeys: [],
    seoTitle: "UK NMC CBT & OSCE RN Exam Prep | NurseNest",
    seoDescription:
      "Independent preparation context for internationally educated nurses targeting UK NMC registration: CBT and OSCE orientation, transferable clinical judgement practice, and links to official NMC guidance.",
    status: "upcoming",
    acquisitionMode: "waitlist",
    internalNotes:
      "Foundation hub: not affiliated with NMC. OSCE link is product surface when present; verify station rules with the NMC and test centre.",
  },
  {
    id: "au-rn-iqnm-pathway",
    countrySlug: "australia",
    countryCode: CountryCode.AU,
    roleTrack: "rn",
    examCode: "iqnm-pathway",
    examFamily: ExamFamily.GENERIC,
    examKey: "IQNM",
    displayName: "Australia RN registration / NMBA–AHPRA IQNM pathway",
    shortName: "NMBA/AHPRA IQNM pathway",
    stripeTier: TierCode.RN,
    contentExamKeys: [],
    seoTitle: "Australia RN Registration Exam Prep | NurseNest",
    seoDescription:
      "Orientation for internationally qualified nurses on the NMBA/AHPRA IQNM pathway: self-check, portfolio-style evidence, and examination components where applicable — plus transferable study practice; always confirm requirements with AHPRA/NMBA.",
    status: "upcoming",
    acquisitionMode: "waitlist",
    internalNotes:
      "Foundation hub: not affiliated with AHPRA/NMBA. Wording must stay aligned to IQNM stages without claiming to replicate regulator assessments.",
  },
  {
    id: "ph-rn-prc-pnle",
    countrySlug: "philippines",
    countryCode: CountryCode.PH,
    roleTrack: "rn",
    examCode: "prc-pnle",
    examFamily: ExamFamily.GENERIC,
    examKey: "PNLE",
    displayName: "Philippines RN / PRC Nurses Licensure Examination (PNLE)",
    shortName: "PRC PNLE",
    stripeTier: TierCode.RN,
    contentExamKeys: [],
    seoTitle: "Philippines PNLE Nursing Board Exam Prep | NurseNest",
    seoDescription:
      "Independent study support for nurses preparing for the Philippine nursing licensure examination (PNLE) under the PRC: domain-level orientation and transferable clinical reasoning; verify bulletins and tables of specifications with the PRC.",
    status: "upcoming",
    acquisitionMode: "waitlist",
    internalNotes:
      "Foundation hub: not affiliated with PRC. Do not imply a copy of proprietary PNLE item banks.",
  },
];
