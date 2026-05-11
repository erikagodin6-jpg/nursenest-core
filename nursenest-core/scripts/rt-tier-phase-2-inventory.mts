/**
 * RT tier readiness inventory — Prisma-backed counts for docs/reports/rt-tier-phase-2-readiness.md
 * Run from nursenest-core/: npx tsx scripts/rt-tier-phase-2-inventory.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { prismaWhereForAlliedProfessionExamQuestions } from "../src/lib/allied/allied-exam-question-scope";
import {
  pathwayExamQuestionMarketingWhereForAlliedCore,
  respiratoryTherapyExamQuestionPoolWhere,
} from "../src/lib/allied/allied-respiratory-pool-scope";
import { examQuestionWhereRtVentilatorBankTag } from "../src/lib/rt-ventilator/rt-ventilator-content-taxonomy";
import { DB_PUBLISHED } from "../src/lib/entitlements/content-access-scope";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "../src/lib/practice-tests/cat-question-completeness";
import { generalStudyBankModuleSurfaceWhere } from "../src/lib/study-question-pool/study-question-pool-gates";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = join(__dirname, "..", "docs", "reports");
const REPORT_PATH = join(REPORT_DIR, "rt-tier-phase-2-readiness.md");

const RT_PATHWAYS = ["us-allied-core", "ca-allied-core"] as const;

async function main() {
  mkdirSync(REPORT_DIR, { recursive: true });

  if (!isDatabaseUrlConfigured()) {
    writeFileSync(
      REPORT_PATH,
      `# RT tier — Phase 2 readiness inventory\n\n_Generated without DATABASE_URL — run locally with a configured DB._\n`,
      "utf-8",
    );
    console.warn("rt-tier-phase-2-inventory: DATABASE_URL not configured; wrote stub report.");
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  }

  const lessonWhereRt: Prisma.PathwayLessonWhereInput = {
    pathwayId: { in: [...RT_PATHWAYS] },
    alliedProfessionKey: "respiratory",
  };
  const lessonWhereFallback: Prisma.PathwayLessonWhereInput = {
    pathwayId: { in: [...RT_PATHWAYS] },
  };

  let lessonTotal = 0;
  let lessonByStatus: { status: ContentStatus; _count: number }[] = [];
  let lessonScopeNote = "";
  try {
    lessonTotal = await prisma.pathwayLesson.count({ where: lessonWhereRt });
    lessonByStatus = await prisma.pathwayLesson.groupBy({
      by: ["status"],
      where: lessonWhereRt,
      _count: true,
    });
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code?: string }).code) : "";
    if (code === "P2022") {
      lessonScopeNote =
        "`allied_profession_key` is absent in this database — lesson totals are **allied-core pathway only** (not RT-filtered).";
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

  const flashcardDeckWhere = { pathwayId: { in: [...RT_PATHWAYS] }, tier: "ALLIED" as const };
  const flashcardDeckCount = await prisma.flashcardDeck.count({ where: flashcardDeckWhere });
  const flashcardCount = await prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      deck: flashcardDeckWhere,
    },
  });

  const rtPool = respiratoryTherapyExamQuestionPoolWhere();
  if (!rtPool) throw new Error("respiratoryTherapyExamQuestionPoolWhere returned null");

  const publishedExam = { status: { in: [DB_PUBLISHED, "PUBLISHED"] } } satisfies Prisma.ExamQuestionWhereInput;

  const practiceBase = { AND: [rtPool, publishedExam] } satisfies Prisma.ExamQuestionWhereInput;
  const practiceCount = await prisma.examQuestion.count({ where: practiceBase });

  const catEligibleWhere = {
    AND: [practiceBase, { isAdaptiveEligible: true }],
  } satisfies Prisma.ExamQuestionWhereInput;
  const catEligibleCount = await prisma.examQuestion.count({ where: catEligibleWhere });

  const coreMarketing = pathwayExamQuestionMarketingWhereForAlliedCore();
  const profSlice = prismaWhereForAlliedProfessionExamQuestions("us-allied-core", "respiratory");
  if (!coreMarketing || !profSlice) throw new Error("Could not build ventilator slice WHERE");

  const ventilatorWhere = {
    AND: [
      coreMarketing,
      NON_ECG_PRACTICE_EXAM_WHERE,
      generalStudyBankModuleSurfaceWhere(),
      profSlice,
      publishedExam,
      examQuestionWhereRtVentilatorBankTag(),
    ],
  } satisfies Prisma.ExamQuestionWhereInput;
  const ventilatorModuleCount = await prisma.examQuestion.count({ where: ventilatorWhere });

  const questionTypes = await prisma.examQuestion.groupBy({
    by: ["questionType"],
    where: practiceBase,
    _count: true,
  });

  const examStatuses = await prisma.examQuestion.groupBy({
    by: ["status"],
    where: { AND: [rtPool] },
    _count: true,
  });

  const bodySystems = await prisma.examQuestion.groupBy({
    by: ["bodySystem"],
    where: practiceBase,
    _count: true,
    orderBy: { _count: { bodySystem: "desc" } },
    take: 40,
  });

  const lines: string[] = [
    `# RT tier — Phase 2 readiness inventory`,
    ``,
    `_Generated: ${new Date().toISOString().slice(0, 10)} (UTC). Source: \`npx tsx scripts/rt-tier-phase-2-inventory.mts\`._`,
    ``,
    `## Scope`,
    ``,
    `- **Lessons**: \`pathway_lessons\` with \`pathway_id ∈ {us-allied-core, ca-allied-core}\` and \`allied_profession_key = 'respiratory'\` when the column exists.`,
    lessonScopeNote ? `- **Lesson scope note**: ${lessonScopeNote}` : "",
    `- **Flashcard decks**: \`flashcard_decks.pathway_id\` in allied core + \`tier = ALLIED\` (RT-aligned decks; deck rows are not keyed by allied profession).`,
    `- **Flashcards**: published cards on those decks.`,
    `- **Practice pool**: \`respiratoryTherapyExamQuestionPoolWhere()\` + published (hub inventory excludes \`module:rt-ventilator\` from general RT counts).`,
    `- **Ventilator module**: allied core marketing tier/region + exam keys + study-bank gates + respiratory profession slice + \`module:rt-ventilator\` tag.`,
    ``,
    `## Counts`,
    ``,
    `| Asset | Count |`,
    `| --- | ---: |`,
    `| Lessons (total) | ${lessonTotal} |`,
    `| Flashcard decks (allied core / ALLIED tier) | ${flashcardDeckCount} |`,
    `| Flashcards (published, those decks) | ${flashcardCount} |`,
    `| Practice questions (published, RT general pool) | ${practiceCount} |`,
    `| CAT-eligible (published, RT pool, \`isAdaptiveEligible\`) | ${catEligibleCount} |`,
    `| Ventilator module questions (published, tagged) | ${ventilatorModuleCount} |`,
    ``,
    `### Lessons by status`,
    ``,
    ...(lessonByStatus.length ? lessonByStatus.map((r) => `- **${r.status}**: ${r._count}`) : [`_No rows._`]),
    ``,
    `### Exam questions by status (RT pool, all statuses)`,
    ``,
    ...examStatuses.map((r) => `- **${r.status ?? "null"}**: ${r._count}`),
    ``,
    `### Question types (published RT practice pool)`,
    ``,
    ...(questionTypes.length
      ? questionTypes
          .sort((a, b) => b._count - a._count)
          .map((r) => `- **${r.questionType}**: ${r._count}`)
      : [`_No rows._`]),
    ``,
    `### Body system / category (top 40, published RT pool)`,
    ``,
    ...(bodySystems.length ? bodySystems.map((r) => `- **${r.bodySystem ?? "null"}**: ${r._count}`) : [`_No rows._`]),
    ``,
    `## RT core categories (marketing taxonomy)`,
    ``,
    `Eleven pillar categories are defined in \`src/lib/allied/allied-profession-taxonomy.ts\` under \`ALLIED_PROFESSION_TAXONOMIES.respiratory\`.`,
    ``,
  ];

  writeFileSync(REPORT_PATH, lines.join("\n") + "\n", "utf-8");
  console.log(`Wrote ${REPORT_PATH}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
