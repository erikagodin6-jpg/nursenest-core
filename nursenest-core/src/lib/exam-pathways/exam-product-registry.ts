import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { CountrySlug, ExamPathwayDefinition, ExamPathwayStatus, RoleTrackSlug } from "@/lib/exam-pathways/types";

/**
 * Central exam / product catalog. Add rows here to expose new pathways without rewiring the app.
 * User.learnerPath should eventually store `ExamPathwayDefinition.id` for granular NP tracks.
 */
export const EXAM_PATHWAYS: ExamPathwayDefinition[] = [
  // —— Canada — RPN / PN ——
  {
    id: "ca-rpn-rex-pn",
    countrySlug: "canada",
    countryCode: CountryCode.CA,
    roleTrack: "rpn",
    examCode: "rex-pn",
    examFamily: ExamFamily.REX_PN,
    examKey: "REX_PN",
    displayName: "REx-PN (Canada Practical Nurse)",
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
    displayName: "NCLEX-PN (US LVN/LPN)",
    shortName: "NCLEX-PN",
    stripeTier: TierCode.LVN_LPN,
    contentExamKeys: ["NCLEX-PN", "NCLEX_PN"],
    seoTitle: "NCLEX-PN Exam Prep | US LVN/LPN | NurseNest",
    seoDescription:
      "US practical/vocational nursing: NCLEX-PN practice, safety-first rationales, and timed mocks scoped for LVN/LPN candidates.",
    status: "active",
    acquisitionMode: "subscribe",
  },
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
  // —— US — NP tracks (never collapse to one generic NP product) ——
  {
    id: "us-np-fnp",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "np",
    examCode: "fnp",
    examFamily: ExamFamily.NP,
    examKey: "NP_FNP",
    displayName: "FNP certification prep",
    shortName: "FNP",
    stripeTier: TierCode.NP,
    contentExamKeys: ["NP", "FNP", "NP-FNP"],
    boardLabel: "ANCC / AANP — Family NP",
    seoTitle: "FNP Exam Prep | Family Nurse Practitioner | NurseNest",
    seoDescription:
      "Family NP track: advanced practice items, differential depth, and management rigor—scoped to FNP preparation (not interchangeable with other NP specialties).",
    status: "active",
    acquisitionMode: "subscribe",
  },
  {
    id: "us-np-agpcnp",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "np",
    examCode: "agpcnp",
    examFamily: ExamFamily.NP,
    examKey: "NP_AGPCNP",
    displayName: "AGPCNP certification prep",
    shortName: "AGPCNP",
    stripeTier: TierCode.NP,
    contentExamKeys: ["NP", "AGPCNP", "AGNP"],
    boardLabel: "Adult-Gerontology Primary Care NP",
    seoTitle: "AGPCNP Exam Prep | NurseNest",
    seoDescription:
      "Adult-gerontology primary care NP preparation—content and copy are AGPCNP-specific; not shared with FNP or PMHNP hubs.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  {
    id: "us-np-pmhnp",
    countrySlug: "us",
    countryCode: CountryCode.US,
    roleTrack: "np",
    examCode: "pmhnp",
    examFamily: ExamFamily.NP,
    examKey: "NP_PMHNP",
    displayName: "PMHNP certification prep",
    shortName: "PMHNP",
    stripeTier: TierCode.NP,
    contentExamKeys: ["NP", "PMHNP", "PSYCH-NP"],
    boardLabel: "Psychiatric-Mental Health NP",
    seoTitle: "PMHNP Exam Prep | NurseNest",
    seoDescription:
      "Psychiatric-mental health NP track: assessment, psychopharmacology, and therapeutic standards scoped to PMHNP preparation.",
    status: "active",
    acquisitionMode: "subscribe",
  },
  // —— Allied (parallel architecture, same route pattern) ——
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

const byRoute = new Map<string, ExamPathwayDefinition>();
const byId = new Map<string, ExamPathwayDefinition>();

function routeKey(countrySlug: CountrySlug, roleTrack: RoleTrackSlug, examCode: string): string {
  return `${countrySlug}/${roleTrack}/${examCode}`;
}

for (const p of EXAM_PATHWAYS) {
  byRoute.set(routeKey(p.countrySlug, p.roleTrack, p.examCode), p);
  byId.set(p.id, p);
}

export function getExamPathwayByRoute(
  countrySlug: string,
  roleTrack: string,
  examCode: string,
): ExamPathwayDefinition | undefined {
  return byRoute.get(`${countrySlug}/${roleTrack}/${examCode}`);
}

export function getExamPathwayById(id: string): ExamPathwayDefinition | undefined {
  return byId.get(id);
}

export function listExamPathways(filter?: { status?: ExamPathwayStatus | ExamPathwayStatus[] }): ExamPathwayDefinition[] {
  if (!filter?.status) return [...EXAM_PATHWAYS];
  const s = Array.isArray(filter.status) ? filter.status : [filter.status];
  return EXAM_PATHWAYS.filter((p) => s.includes(p.status));
}

/** Sitemap + static generation: public indexable pathways */
export function listPublicExamPathways(): ExamPathwayDefinition[] {
  return EXAM_PATHWAYS.filter((p) => p.status !== "hidden");
}

export function buildExamPathwayPath(
  p: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  subpath?: string,
): string {
  const base = `/${p.countrySlug}/${p.roleTrack}/${p.examCode}`;
  if (!subpath) return base;
  return `${base}/${subpath.replace(/^\//, "")}`;
}
