import type { CountryCode, PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
import { canonicalExamQuestionExamForDbWrite } from "@/lib/content-quality/exam-question-exam-normalization";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { isNonFatalPrismaSchemaError } from "@/lib/prisma/safe-reads";
import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
} from "@/lib/questions/exam-question-bank-sql";

/** Same six pathways as `scripts/audit-exam-question-bank.ts` / `scripts/audit-flashcard-pools.ts`. */
export const CORE_PATHWAY_AUDIT_ROWS = [
  { pathwayId: "ca-rn-nclex-rn", label: "CA RN NCLEX-RN" },
  { pathwayId: "us-rn-nclex-rn", label: "US RN NCLEX-RN" },
  { pathwayId: "ca-rpn-rex-pn", label: "CA RPN REx-PN" },
  { pathwayId: "us-lpn-nclex-pn", label: "US LPN NCLEX-PN" },
  { pathwayId: "us-np-fnp", label: "US NP FNP" },
  { pathwayId: "ca-np-cnple", label: "CA NP CNPLE" },
] as const;

function regionSql(country: string): Prisma.Sql {
  const c = country.trim().toUpperCase();
  return c === "CA"
    ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
    : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
}

async function hasStudyLinkPathwayColumn(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'exam_questions'
        AND column_name = 'study_link_pathway_id'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

function pickTierForPathway(pathwayId: string, tierMatches: string[]): string {
  const s = new Set(tierMatches.map((t) => t.toLowerCase()));
  if (pathwayId.includes("lpn") && s.has("lvn")) return "lvn";
  if (pathwayId.includes("rpn-rex") && s.has("rpn")) return "rpn";
  if (pathwayId.includes("np") && s.has("np")) return "np";
  if (pathwayId.includes("nclex-rn") && s.has("rn")) return "rn";
  return tierMatches[0]!.toLowerCase();
}

function pickExamForPathway(pathwayId: string, examIn: string[]): string {
  const lowerPid = pathwayId.toLowerCase();
  if (lowerPid.includes("rex") || lowerPid.includes("rpn-rex")) {
    const rex = examIn.find((e) => e.replace(/\s+/g, "").toLowerCase().includes("rex"));
    if (rex) return canonicalExamQuestionExamForDbWrite(rex);
  }
  if (lowerPid.includes("cnple")) {
    const cn = examIn.find((e) => /cnple|can-np/i.test(e));
    if (cn) return canonicalExamQuestionExamForDbWrite(cn);
  }
  if (lowerPid.includes("np-fnp")) {
    const fnp = examIn.find((e) => /fnp/i.test(e));
    if (fnp) return canonicalExamQuestionExamForDbWrite(fnp);
  }
  return canonicalExamQuestionExamForDbWrite(examIn[0]!);
}

function poolCountSql(examLower: string[], tierLower: string[], region: Prisma.Sql): Prisma.Sql {
  return Prisma.sql`
    SELECT COUNT(*)::bigint AS n
    FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      AND ${region}
      AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
      AND length(trim(coalesce(stem, ''))) >= 10
      AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
      AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
      AND lower(coalesce(exam, '')) IN (${Prisma.join(examLower)})
      AND lower(coalesce(tier, '')) IN (${Prisma.join(tierLower)})
  `;
}

/** Published pool size for one core pathway (matches flashcard-style gates + exam/tier/region scope). */
export async function countCorePathwayPublishedPool(prisma: PrismaClient, pathwayId: string): Promise<number> {
  const ctx = buildGlobalExamContext(pathwayId, "en");
  if (!ctx) return -1;
  const { examIn, tierMatches } = examQuestionPoolWhereForContext(ctx);
  const examLower = examIn.map((k) => k.toLowerCase());
  const tierLower = tierMatches.map((t) => t.toLowerCase());
  const rows = await prisma.$queryRaw<{ n: bigint }[]>(
    poolCountSql(examLower, tierLower, regionSql(ctx.country)),
  );
  return Number(rows[0]?.n ?? 0n);
}

export type EnsureCorePathwayResult = {
  pathwayId: string;
  poolBefore: number;
  inserted: number;
};

/**
 * For each core pathway, if the published flashcard-style pool count is zero, upserts two
 * canonical MCQs so learner surfaces and audits are non-empty. Idempotent by fixed `id` keys.
 */
export async function ensureCorePathwayPublishedExamQuestions(
  prisma: PrismaClient,
): Promise<{ results: EnsureCorePathwayResult[]; totalInserted: number }> {
  const results: EnsureCorePathwayResult[] = [];
  let totalInserted = 0;
  const linkCol = await hasStudyLinkPathwayColumn(prisma);

  for (const row of CORE_PATHWAY_AUDIT_ROWS) {
    const ctx = buildGlobalExamContext(row.pathwayId, "en");
    if (!ctx) {
      results.push({ pathwayId: row.pathwayId, poolBefore: -1, inserted: 0 });
      continue;
    }
    const { examIn, tierMatches } = examQuestionPoolWhereForContext(ctx);
    const examLower = examIn.map((k) => k.toLowerCase());
    const tierLower = tierMatches.map((t) => t.toLowerCase());
    const reg = regionSql(ctx.country);

    const beforeRows = await prisma.$queryRaw<{ n: bigint }[]>(poolCountSql(examLower, tierLower, reg));
    const poolBefore = Number(beforeRows[0]?.n ?? 0n);
    if (poolBefore > 0) {
      results.push({ pathwayId: row.pathwayId, poolBefore, inserted: 0 });
      continue;
    }

    const exam = pickExamForPathway(row.pathwayId, examIn);
    const tier = pickTierForPathway(row.pathwayId, tierMatches);
    const country = ctx.country as CountryCode;

    const stems = [
      `[${row.label}] A client has a sudden change in status. Which nurse action demonstrates safe prioritization?`,
      `[${row.label}] Before administering a new medication, what is the priority nursing intervention?`,
    ];
    const rationales = [
      "Assess the client first, then intervene per protocol and document findings.",
      "Verify the order, check allergies, and confirm the five rights before administration.",
    ];
    const topics = ["Safety", "Fundamentals"];

    let inserted = 0;
    for (let i = 0; i < stems.length; i++) {
      const id = `ensure_${row.pathwayId}_${i + 1}`.replace(/-/g, "_");
      const stem = stems[i]!;
      const rationale = rationales[i]!;
      const topic = topics[i] ?? "Fundamentals";
      const hash = stemHash(stem);
      const options = [
        "Assess and stabilize using scope-appropriate interventions",
        "Delay assessment until the next shift",
        "Delegate without verifying competency",
        "Proceed without documentation",
      ];
      const correctAnswer = [options[0]!];

      try {
        await prisma.examQuestion.upsert({
          where: { id },
          create: {
            id,
            tier,
            exam,
            questionType: "multiple_choice",
            status: DB_PUBLISHED,
            stem,
            options,
            correctAnswer,
            rationale,
            topic,
            bodySystem: "General",
            countryCode: country,
            careerType: "nursing",
            regionScope: "BOTH",
            stemHash: hash,
            publishedAt: new Date(),
            ...(linkCol ? { studyLinkPathwayId: row.pathwayId } : {}),
          },
          update: {
            stem,
            options,
            correctAnswer,
            rationale,
            topic,
            bodySystem: "General",
            status: DB_PUBLISHED,
            tier,
            exam,
            countryCode: country,
            stemHash: hash,
            publishedAt: new Date(),
            ...(linkCol ? { studyLinkPathwayId: row.pathwayId } : {}),
          },
        });
        inserted += 1;
      } catch (e) {
        if (isNonFatalPrismaSchemaError(e)) {
          await prisma.examQuestion.upsert({
            where: { id },
            create: {
              id,
              tier,
              exam,
              questionType: "multiple_choice",
              status: DB_PUBLISHED,
              stem,
              options,
              correctAnswer,
              rationale,
              topic,
              bodySystem: "General",
              countryCode: country,
              careerType: "nursing",
              regionScope: "BOTH",
              stemHash: hash,
              publishedAt: new Date(),
            },
            update: {
              stem,
              options,
              correctAnswer,
              rationale,
              topic,
              bodySystem: "General",
              status: DB_PUBLISHED,
              tier,
              exam,
              countryCode: country,
              stemHash: hash,
              publishedAt: new Date(),
            },
          });
          inserted += 1;
        } else {
          throw e;
        }
      }
    }

    totalInserted += inserted;
    results.push({ pathwayId: row.pathwayId, poolBefore: 0, inserted });
  }

  return { results, totalInserted };
}
