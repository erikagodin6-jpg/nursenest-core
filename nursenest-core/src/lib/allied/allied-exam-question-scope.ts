import type { Prisma } from "@prisma/client";
import { ALLIED_PROFESSION_KEYS, getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

/**
 * Legacy monolith + import pipeline (`scripts/import-allied-json-to-prisma.ts`) store allied items
 * under `ExamQuestion.careerType` using these camelCase keys (see `server/allied-questions-api.ts` PROFESSIONS).
 *
 * When a marketing profession has no entry here, `/api/questions` cannot safely narrow the shared `exam: ALLIED`
 * pool yet — migration should tag rows (`profession:{professionKey}`) or extend this map.
 */
export const ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES: Readonly<Record<string, readonly string[]>> = {
  pta: ["physicalTherapy"],
  ota: ["occupationalTherapy"],
  mlt: ["mlt"],
  "lab-assistant": ["mlt"],
  imaging: ["imaging"],
  /** RRT / respiratory certification bank in legacy exports. */
  respiratory: ["rrt"],
  paramedic: ["paramedic"],
  "pharmacy-tech": ["pharmacyTech"],
  sonography: ["diagnosticSonography"],
  /** Sonography + general imaging overlap for radiography prep until radiography-specific rows exist. */
  radiography: ["imaging", "diagnosticSonography"],
  emt: ["paramedic"],
};

const TAG_PREFIX = "profession:" as const;
const TAG_ALLIED_PREFIX = "alliedProfession:" as const;

/**
 * When learners open `/app/questions` from an occupation hub (`?alliedProfession=` + allied core pathway),
 * constrain the Prisma pool to that discipline's legacy `careerType` values and optional profession tags.
 */
export function prismaWhereForAlliedProfessionExamQuestions(
  pathwayId: string | null | undefined,
  alliedProfessionRaw: string | null | undefined,
): Prisma.ExamQuestionWhereInput | null {
  const pid = pathwayId?.trim() ?? "";
  const raw = alliedProfessionRaw?.trim().toLowerCase() ?? "";
  if (!pid || !raw || !isAlliedMarketingCorePathwayId(pid)) return null;
  const prof = getAlliedProfessionByProfessionKey(raw);
  if (!prof) return null;
  const careerTypes = ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES[prof.professionKey];
  if (!careerTypes || careerTypes.length === 0) return null;
  const pk = prof.professionKey;
  return {
    OR: [
      { careerType: { in: [...careerTypes] } },
      { tags: { has: `${TAG_PREFIX}${pk}` } },
      { tags: { has: `${TAG_ALLIED_PREFIX}${pk}` } },
    ],
  };
}

/**
 * When an ALLIED subscriber has **no** locked occupation metadata, they must not draw another
 * occupation’s legacy career slices or profession tags — only items outside those exclusive OR-clauses
 * (shared Allied core bank + untagged rows) remain eligible.
 */
export function prismaWhereForAlliedSharedCoreExamQuestionsOnly(
  pathwayId: string | null | undefined,
): Prisma.ExamQuestionWhereInput | null {
  const pid = pathwayId?.trim() ?? "";
  if (!pid || !isAlliedMarketingCorePathwayId(pid)) return null;

  const exclusiveSlices: Prisma.ExamQuestionWhereInput[] = [];
  for (const key of ALLIED_PROFESSION_KEYS) {
    const slice = prismaWhereForAlliedProfessionExamQuestions(pid, key);
    if (slice) exclusiveSlices.push(slice);
  }
  if (exclusiveSlices.length === 0) return null;

  return {
    NOT: { OR: exclusiveSlices },
  };
}
