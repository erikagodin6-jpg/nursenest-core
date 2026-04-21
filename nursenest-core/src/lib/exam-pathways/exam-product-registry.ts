import { ExamFamily } from "@prisma/client";
import { getNpPracticeTestLandingCopy } from "./np-practice-test-segments";
import type { CountrySlug, ExamPathwayDefinition, ExamPathwayStatus, RoleTrackSlug } from "./types";
import { EXAM_PATHWAYS_SEGMENT_A } from "./exam-pathways-data-segment-a";
import { EXAM_PATHWAYS_SEGMENT_B } from "./exam-pathways-data-segment-b";
import { EXAM_PATHWAYS_SEGMENT_C } from "./exam-pathways-data-segment-c";
import { EXAM_PATHWAYS_SEGMENT_D } from "./exam-pathways-data-segment-d";


/**
 * Central exam / product catalog — concatenates ordered segments from `exam-pathways-data-segment-*.ts`.
 * Add or edit pathway rows in those modules (preserve segment order) to expose new pathways without rewiring the app.
 * User.learnerPath should eventually store `ExamPathwayDefinition.id` for granular NP tracks.
 */
export const EXAM_PATHWAYS: ExamPathwayDefinition[] = [
  ...EXAM_PATHWAYS_SEGMENT_A,
  ...EXAM_PATHWAYS_SEGMENT_B,
  ...EXAM_PATHWAYS_SEGMENT_C,
  ...EXAM_PATHWAYS_SEGMENT_D,
];


/** Distinct `exam_questions.exam` values used across NP pathways (diagnostics + pool scoping). */
export function npPoolExamColumnValues(): string[] {
  const s = new Set<string>();
  for (const p of EXAM_PATHWAYS) {
    if (p.examFamily === ExamFamily.NP) {
      for (const k of p.contentExamKeys) s.add(k);
    }
  }
  if (s.size === 0) s.add("NP");
  return [...s];
}

const byRoute = new Map<string, ExamPathwayDefinition>();
const byId = new Map<string, ExamPathwayDefinition>();

function routeKey(countrySlug: CountrySlug, roleTrack: RoleTrackSlug, examCode: string): string {
  return `${countrySlug}/${roleTrack}/${examCode}`;
}

for (const p of EXAM_PATHWAYS) {
  byRoute.set(routeKey(p.countrySlug, p.roleTrack, p.examCode), p);
  byId.set(p.id, p);
}

/** Normalize marketing hub URL segments (case/whitespace) so registry lookups match Prisma-backed rows. */
function normalizeMarketingHubSegment(segment: string): string {
  return segment.trim().toLowerCase();
}

function normalizeRoleTrackSegmentForCountry(countrySlug: string, roleTrack: string, examCode: string): string {
  const country = normalizeMarketingHubSegment(countrySlug);
  const role = normalizeMarketingHubSegment(roleTrack);
  const exam = normalizeMarketingHubSegment(examCode);
  if (role !== "pn") return role;
  if (country === "canada" || exam === "rex-pn") return "rpn";
  return "lpn";
}

export function getExamPathwayByRoute(
  countrySlug: string,
  roleTrack: string,
  examCode: string,
): ExamPathwayDefinition | undefined {
  const normalizedCountry = normalizeMarketingHubSegment(countrySlug);
  const normalizedRole = normalizeRoleTrackSegmentForCountry(countrySlug, roleTrack, examCode);
  const normalizedExam = normalizeMarketingHubSegment(examCode);
  return byRoute.get(
    `${normalizedCountry}/${normalizedRole}/${normalizedExam}`,
  );
}

/**
 * Resolves marketing hub URLs where the third segment may be a canonical `examCode` (`fnp`, `pmhnp`, …)
 * or an NP SEO alias (`aanp-practice-test`, …).
 */
export function resolveExamPathwayFromMarketingHubSegment(
  countrySlug: string,
  roleTrack: string,
  segment: string,
): ExamPathwayDefinition | undefined {
  const direct = getExamPathwayByRoute(countrySlug, roleTrack, segment);
  if (direct) {
    if (direct.status === "hidden") return undefined;
    return direct;
  }
  const seo = getNpPracticeTestLandingCopy(
    normalizeMarketingHubSegment(countrySlug),
    normalizeMarketingHubSegment(roleTrack),
    normalizeMarketingHubSegment(segment),
  );
  if (!seo) return undefined;
  const aliased = getExamPathwayById(seo.pathwayId);
  if (!aliased || aliased.status === "hidden") return undefined;
  return aliased;
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
  const roleSlug = p.roleTrack === "lpn" || p.roleTrack === "rpn" ? "pn" : p.roleTrack;
  const base = `/${p.countrySlug}/${roleSlug}/${p.examCode}`;
  if (!subpath) return base;
  return `${base}/${subpath.replace(/^\//, "")}`;
}
