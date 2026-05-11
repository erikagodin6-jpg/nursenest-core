/**
 * MLT / MLS tier readiness inventory — Prisma-backed counts for docs/reports/mlt-tier-readiness-audit.md
 * Run from nursenest-core/: npx tsx scripts/mlt-tier-readiness-inventory.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { medicalLaboratoryTechnologyExamQuestionPoolWhere } from "../src/lib/allied/allied-mlt-pool-scope";
import { pathwayExamQuestionMarketingWhereForAlliedCore } from "../src/lib/allied/allied-respiratory-pool-scope";
import { prismaWhereForAlliedProfessionExamQuestions } from "../src/lib/allied/allied-exam-question-scope";
import { examQuestionWhereMltPremiumBankTag } from "../src/lib/mlt/mlt-premium-content-taxonomy";
import { MLT_PREMIUM_MODULE_DEFINITIONS } from "../src/lib/mlt/mlt-premium-modules-registry";
import { DB_PUBLISHED } from "../src/lib/entitlements/content-access-scope";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "../src/lib/practice-tests/cat-question-completeness";
import { generalStudyBankModuleSurfaceWhere } from "../src/lib/study-question-pool/study-question-pool-gates";
import { US_ALLIED_CORE_PATHWAY_ID } from "../src/lib/allied/allied-hub-program-model";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Repo-root `docs/reports` (scripts live under `nursenest-core/scripts`). */
const REPORT_DIR = join(__dirname, "..", "..", "docs", "reports");
const REPORT_PATH = join(REPORT_DIR, "mlt-tier-readiness-counts.generated.md");

const ALLIED_PATHWAYS = ["us-allied-core", "ca-allied-core"] as const;

async function main() {
  mkdirSync(REPORT_DIR, { recursive: true });

  if (!isDatabaseUrlConfigured()) {
    writeFileSync(
      REPORT_PATH,
      `# MLT tier — readiness counts\n\n_Generated without DATABASE_URL — run locally with a configured DB._\n`,
      "utf-8",
    );
    console.warn("mlt-tier-readiness-inventory: DATABASE_URL not configured; wrote stub report.");
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  }

  const lessonWhereMlt: Prisma.PathwayLessonWhereInput = {
    pathwayId: { in: [...ALLIED_PATHWAYS] },
    alliedProfessionKey: "mlt",
  };
  const lessonWhereFallback: Prisma.PathwayLessonWhereInput = {
    pathwayId: { in: [...ALLIED_PATHWAYS] },
  };

  let lessonTotal = 0;
  let lessonByStatus: { status: ContentStatus; _count: number }[] = [];
  let lessonScopeNote = "";
  try {
    lessonTotal = await prisma.pathwayLesson.count({ where: lessonWhereMlt });
    lessonByStatus = await prisma.pathwayLesson.groupBy({
      by: ["status"],
      where: lessonWhereMlt,
      _count: true,
    });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code?: string }).code) : "";
    const msg = e instanceof Error ? e.message : String(e);
    const missingProfessionColumn =
      code === "P2022" || /allied_profession_key/i.test(msg) || /does not exist/i.test(msg);
    if (missingProfessionColumn) {
      lessonScopeNote =
        "`allied_profession_key` is absent or unreadable in this database — lesson totals are **allied-core pathway only** (not MLT-filtered).";
      lessonTotal = await prisma.pathwayLesson.count({ where: lessonWhereFallback });
      lessonByStatus = await prisma.pathwayLesson.groupBy({
        by: ["status"],
        where: lessonWhereFallback,
        _count: true,
      });
    } else {
      throw e;
    }
  }

  const flashcardDeckWhere = { pathwayId: { in: [...ALLIED_PATHWAYS] }, tier: "ALLIED" as const };
  const flashcardDeckCount = await prisma.flashcardDeck.count({ where: flashcardDeckWhere });
  const flashcardCount = await prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      deck: flashcardDeckWhere,
    },
  });

  const mltPool = medicalLaboratoryTechnologyExamQuestionPoolWhere();
  if (!mltPool) throw new Error("medicalLaboratoryTechnologyExamQuestionPoolWhere returned null");

  const publishedExam = { status: { in: [DB_PUBLISHED, "PUBLISHED"] } } satisfies Prisma.ExamQuestionWhereInput;

  const practiceBase = { AND: [mltPool, publishedExam] } satisfies Prisma.ExamQuestionWhereInput;
  const practiceCount = await prisma.examQuestion.count({ where: practiceBase });

  const catEligibleWhere = {
    AND: [practiceBase, { isAdaptiveEligible: true }],
  } satisfies Prisma.ExamQuestionWhereInput;
  const catEligibleCount = await prisma.examQuestion.count({ where: catEligibleWhere });

  const questionTypes = await prisma.examQuestion.groupBy({
    by: ["questionType"],
    where: practiceBase,
    _count: true,
  });

  const questionFormats = await prisma.examQuestion.groupBy({
    by: ["questionFormat"],
    where: practiceBase,
    _count: true,
    orderBy: { _count: { questionFormat: "desc" } },
    take: 40,
  });

  const examStatuses = await prisma.examQuestion.groupBy({
    by: ["status"],
    where: { AND: [mltPool] },
    _count: true,
  });

  const bodySystems = await prisma.examQuestion.groupBy({
    by: ["bodySystem"],
    where: practiceBase,
    _count: true,
    orderBy: { _count: { bodySystem: "desc" } },
    take: 40,
  });

  const premiumRows: string[] = [];
  for (const mod of MLT_PREMIUM_MODULE_DEFINITIONS) {
    const w = { AND: [practiceBase, examQuestionWhereMltPremiumBankTag(mod.bankTag)] } satisfies Prisma.ExamQuestionWhereInput;
    const n = await prisma.examQuestion.count({ where: w });
    premiumRows.push(`| ${mod.title} (\`${mod.bankTag}\`) | ${n} |`);
  }

  const coreMarketing = pathwayExamQuestionMarketingWhereForAlliedCore();
  const profSlice = prismaWhereForAlliedProfessionExamQuestions(US_ALLIED_CORE_PATHWAY_ID, "mlt");
  let rawMltCareerTypeCount = 0;
  if (coreMarketing && profSlice) {
    const rawWhere = {
      AND: [
        coreMarketing,
        NON_ECG_PRACTICE_EXAM_WHERE,
        generalStudyBankModuleSurfaceWhere(),
        publishedExam,
        { careerType: "mlt" },
      ],
    } satisfies Prisma.ExamQuestionWhereInput;
    rawMltCareerTypeCount = await prisma.examQuestion.count({ where: rawWhere });
  }

  const lines: string[] = [
    `# MLT tier — readiness counts (generated)`,
    ``,
    `_Generated: ${new Date().toISOString().slice(0, 19)}Z. Run: \`npx tsx scripts/mlt-tier-readiness-inventory.mts\`._`,
    ``,
    `## Scope`,
    ``,
    `- **Lessons**: \`pathway_lessons\` with \`pathway_id ∈ {us-allied-core, ca-allied-core}\` and \`allied_profession_key = 'mlt'\` when the column exists.`,
    lessonScopeNote ? `- **Lesson scope note**: ${lessonScopeNote}` : "",
    `- **Flashcard decks**: \`flashcard_decks.pathway_id\` in allied core + \`tier = ALLIED\` (shared allied decks; rows are not keyed by allied profession).`,
    `- **Practice pool**: \`medicalLaboratoryTechnologyExamQuestionPoolWhere()\` + published.`,
    `- **Premium modules**: same pool AND each \`module:mlt-*\` bank tag (published).`,
    `- **Legacy careerType slice** (diagnostic): questions with \`career_type = 'mlt'\` within allied core marketing + study-bank gates + published (subset of profession OR-tag logic).`,
    ``,
    `## Totals`,
    ``,
    `| Asset | Count |`,
    `| --- | ---: |`,
    `| Lessons (total, MLT-filtered when column exists) | ${lessonTotal} |`,
    `| Flashcard decks (allied core / ALLIED tier) | ${flashcardDeckCount} |`,
    `| Flashcards (published, those decks) | ${flashcardCount} |`,
    `| Practice questions (published, MLT pool) | ${practiceCount} |`,
    `| CAT-eligible (published, MLT pool, \`isAdaptiveEligible\`) | ${catEligibleCount} |`,
    `| Diagnostic: published \`career_type = mlt\` (allied core gates) | ${rawMltCareerTypeCount} |`,
    ``,
    `### Premium specialty tagged pools (published)`,
    ``,
    `| Module | Count |`,
    `| --- | ---: |`,
    ...premiumRows,
    ``,
    `### Lessons by status`,
    ``,
    ...(lessonByStatus.length ? lessonByStatus.map((r) => `- **${r.status}**: ${r._count}`) : [`_No rows._`]),
    ``,
    `### Exam questions by status (MLT pool, all statuses)`,
    ``,
    ...(examStatuses.length ? examStatuses.map((r) => `- **${r.status ?? "null"}**: ${r._count}`) : [`_No rows._`]),
    ``,
    `### Question types (\`question_type\`, published MLT pool)`,
    ``,
    ...(questionTypes.length
      ? questionTypes
          .sort((a, b) => b._count - a._count)
          .map((r) => `- **${r.questionType}**: ${r._count}`)
      : [`_No rows._`]),
    ``,
    `### Question formats (\`question_format\`, top 40, published MLT pool)`,
    ``,
    ...(questionFormats.length ? questionFormats.map((r) => `- **${r.questionFormat ?? "null"}**: ${r._count}`) : [`_No rows._`]),
    ``,
    `### Body system / category (top 40, published MLT pool)`,
    ``,
    ...(bodySystems.length ? bodySystems.map((r) => `- **${r.bodySystem ?? "null"}**: ${r._count}`) : [`_No rows._`]),
    ``,
  ];

  writeFileSync(REPORT_PATH, lines.filter(Boolean).join("\n") + "\n", "utf-8");
  console.log(`Wrote ${REPORT_PATH}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
