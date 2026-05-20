#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";

import { PrismaClient, ContentStatus, TierCode } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { stemHash } from "@/lib/content/stem-hash";

const prisma = new PrismaClient();

const PHASE_FILES = [
  "data/materialized/rn-phase1-pilot-content.json",
  "data/materialized/rn-phase2-content.json",
  "data/materialized/rn-phase3-content.json",
  "data/materialized/rn-phase4-content.json",
  "data/materialized/rn-phase5-content.json",
];

const TOTALS_FILE = "data/reports/rn-full-program-totals.json";
const QA_FILE = "data/reports/rn-final-preimport-qa-report.json";
const REPORT_FILE = "data/reports/rn-production-import-report.json";

const RN_PATHWAY_ID = "us-rn-nclex-rn";
const RN_LOCALE = "en";

type PhaseLesson = {
  lessonId: string;
  topicSlug: string;
  title: string;
  domain: string;
  bodySystem: string;
  sections: unknown;
};

type PhaseQuestion = {
  questionId: string;
  topicSlug: string;
  stem: string;
  options: string[];
  correctAnswer: string | string[];
  questionType: string;
  rationale?: string;
  tags?: string[];
  bodySystem?: string;
  priorityWeight?: number;
  pathwayTags?: string[];
};

type PhaseArtifact = {
  meta: {
    phase: string;
    totalTopics: number;
    totalLessons: number;
    totalQuestions: number;
  };
  lessons: PhaseLesson[];
  questions: PhaseQuestion[];
};

function parseArgs() {
  const argv = process.argv.slice(2);
  return { apply: argv.includes("--apply") };
}

function readJson<T>(relPath: string): T {
  const abs = path.join(process.cwd(), relPath);
  return JSON.parse(fs.readFileSync(abs, "utf8")) as T;
}

function questionDifficulty(priorityWeight?: number): number {
  if (!priorityWeight) return 3;
  if (priorityWeight >= 5) return 4;
  if (priorityWeight === 4) return 3;
  return 2;
}

function inferCognitiveLevel(questionType: string): string {
  if (questionType === "Bowtie" || questionType === "Trend" || questionType === "Matrix") return "analyze";
  if (questionType === "Priority") return "apply";
  if (questionType === "SATA") return "apply";
  return "understand";
}

async function main() {
  const { apply } = parseArgs();

  const totalsTarget = readJson<{
    fullProgram: { totalTopics: number; totalLessons: number; totalQuestions: number; uniqueTopicSlugs: number };
  }>(TOTALS_FILE);
  const bp = readJson<{ topics: Array<{ topicSlug: string; topic: string; domain: string; tags: string[] }> }>(
    "data/blueprints/rn-content-blueprint.json",
  );
  const preQa = readJson<{ status: string; blockersBeforeProductionImport: string[] }>(QA_FILE);

  const artifacts = PHASE_FILES.map((f) => readJson<PhaseArtifact>(f));
  const lessons = artifacts.flatMap((a) => a.lessons.map((l) => ({ ...l, phase: a.meta.phase })));
  const questions = artifacts.flatMap((a) => a.questions.map((q) => ({ ...q, phase: a.meta.phase })));

  const sourceTotals = {
    topics: artifacts.reduce((s, a) => s + a.meta.totalTopics, 0),
    lessons: lessons.length,
    questions: questions.length,
    uniqueTopicSlugs: new Set(lessons.map((l) => l.topicSlug)).size,
  };

  const report: Record<string, unknown> = {
    mode: apply ? "apply" : "dry-run",
    sourceArtifacts: PHASE_FILES,
    preImportQaStatus: preQa.status,
    preImportQaBlockers: preQa.blockersBeforeProductionImport,
    sourceTotals,
    targetTotals: totalsTarget.fullProgram,
    importSummary: {
      lessonsProcessed: 0,
      questionsProcessed: 0,
      lessonsFailed: [] as Array<{ lessonId: string; error: string }>,
      questionsFailed: [] as Array<{ questionId: string; error: string }>,
    },
    postImportVerification: {},
  };

  if (preQa.status !== "PASS" || (preQa.blockersBeforeProductionImport?.length ?? 0) > 0) {
    throw new Error("Pre-import QA report is not PASS; refusing production import.");
  }

  if (
    sourceTotals.topics !== totalsTarget.fullProgram.totalTopics ||
    sourceTotals.lessons !== totalsTarget.fullProgram.totalLessons ||
    sourceTotals.questions !== totalsTarget.fullProgram.totalQuestions ||
    sourceTotals.uniqueTopicSlugs !== totalsTarget.fullProgram.uniqueTopicSlugs
  ) {
    throw new Error("Source artifact totals do not match approved totals.");
  }

  if (apply) {
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i]!;
      try {
        const sortOrder = i;
        await prisma.pathwayLesson.upsert({
          where: { pathwayId_slug_locale: { pathwayId: RN_PATHWAY_ID, slug: l.lessonId, locale: RN_LOCALE } },
          create: {
            pathwayId: RN_PATHWAY_ID,
            slug: l.lessonId,
            locale: RN_LOCALE,
            title: l.title,
            topic: `${l.domain} | ${l.topicSlug}`,
            topicSlug: l.topicSlug,
            bodySystem: l.bodySystem,
            previewSectionCount: 1,
            seoTitle: l.title.slice(0, 120),
            seoDescription: `RN lesson for ${l.topicSlug} (${l.phase})`.slice(0, 160),
            sections: l.sections as object,
            status: ContentStatus.PUBLISHED,
            sortOrder,
            tierCode: TierCode.RN,
          },
          update: {
            title: l.title,
            topic: `${l.domain} | ${l.topicSlug}`,
            topicSlug: l.topicSlug,
            bodySystem: l.bodySystem,
            previewSectionCount: 1,
            seoTitle: l.title.slice(0, 120),
            seoDescription: `RN lesson for ${l.topicSlug} (${l.phase})`.slice(0, 160),
            sections: l.sections as object,
            status: ContentStatus.PUBLISHED,
            sortOrder,
            tierCode: TierCode.RN,
          },
        });
        (report.importSummary as any).lessonsProcessed += 1;
      } catch (e) {
        (report.importSummary as any).lessonsFailed.push({ lessonId: l.lessonId, error: e instanceof Error ? e.message : String(e) });
      }
    }

    for (const q of questions) {
      try {
        const tags = Array.from(new Set([...(q.tags ?? []), ...(q.pathwayTags ?? []), `topicSlug:${q.topicSlug}`, "rn-finalized-program"]));
        const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        await prisma.$executeRaw`
          INSERT INTO exam_questions (
            id, tier, exam, question_type, status, stem, options, correct_answer, rationale,
            difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, career_type,
            cognitive_level, question_format, is_adaptive_eligible, is_mock_exam_eligible, language_code, source_version,
            updated_at
          ) VALUES (
            ${q.questionId}, ${"RN"}, ${"NCLEX-RN"}, ${q.questionType}, ${"published"}, ${q.stem},
            ${JSON.stringify(q.options)}::jsonb, ${JSON.stringify(correct)}::jsonb, ${q.rationale ?? ""},
            ${questionDifficulty(q.priorityWeight)}, ${tags}, ${q.bodySystem ?? null}, ${q.topicSlug}, ${q.topicSlug},
            ${"BOTH"}, ${stemHash(q.stem)}, ${"nursing"}, ${inferCognitiveLevel(q.questionType)}, ${q.questionType},
            ${true}, ${true}, ${"en"}, ${1}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            tier = EXCLUDED.tier,
            exam = EXCLUDED.exam,
            question_type = EXCLUDED.question_type,
            status = EXCLUDED.status,
            stem = EXCLUDED.stem,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            rationale = EXCLUDED.rationale,
            difficulty = EXCLUDED.difficulty,
            tags = EXCLUDED.tags,
            body_system = EXCLUDED.body_system,
            topic = EXCLUDED.topic,
            subtopic = EXCLUDED.subtopic,
            region_scope = EXCLUDED.region_scope,
            stem_hash = EXCLUDED.stem_hash,
            career_type = EXCLUDED.career_type,
            cognitive_level = EXCLUDED.cognitive_level,
            question_format = EXCLUDED.question_format,
            is_adaptive_eligible = EXCLUDED.is_adaptive_eligible,
            is_mock_exam_eligible = EXCLUDED.is_mock_exam_eligible,
            language_code = EXCLUDED.language_code,
            source_version = EXCLUDED.source_version,
            updated_at = NOW()
        `;
        (report.importSummary as any).questionsProcessed += 1;
      } catch (e) {
        (report.importSummary as any).questionsFailed.push({ questionId: q.questionId, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }

  // Post-import/live-set verification (works for dry-run too against current DB state)
  const lessonSlugs = lessons.map((l) => l.lessonId);
  const questionIds = questions.map((q) => q.questionId);

  const liveLessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId: RN_PATHWAY_ID, locale: RN_LOCALE, slug: { in: lessonSlugs } },
    select: { slug: true, topicSlug: true },
  });

  const liveQuestions = await prisma.examQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, topic: true, subtopic: true },
  });

  const lessonIdSet = new Set(liveLessons.map((l) => l.slug));
  const questionIdSet = new Set(liveQuestions.map((q) => q.id));
  const lessonTopicSlugs = new Set(liveLessons.map((l) => l.topicSlug));

  const duplicateLessonIds = liveLessons.length - lessonIdSet.size;
  const duplicateQuestionIds = liveQuestions.length - questionIdSet.size;
  const questionTopicIntegrityFailures = liveQuestions
    .filter((q) => !lessonTopicSlugs.has((q.subtopic || q.topic || "").trim()))
    .map((q) => ({ questionId: q.id, topicRef: q.subtopic || q.topic || null }));

  const boundaryChecks = {
    acuteMiFirst60Only: !!(bySlug(bp, "acute-mi-emergency")?.tags?.includes("scope-mi-acute-only") && /first 60-minute/i.test(bySlug(bp, "acute-mi-emergency")?.topic ?? "")),
    myocardialPostAcute: !!(bySlug(bp, "myocardial-infarction")?.tags?.includes("scope-post-mi-ongoing-care") && /post-mi|post-acute/i.test(bySlug(bp, "myocardial-infarction")?.topic ?? "")),
    dvtOnlyCardiac: !!(bySlug(bp, "deep-vein-thrombosis-management")?.domain === "Cardiac" && bySlug(bp, "deep-vein-thrombosis-management")?.tags?.includes("scope-dvt-only")),
    peAcuteRespOnly: !!(bySlug(bp, "pulmonary-embolism")?.domain === "Respiratory" && bySlug(bp, "pulmonary-embolism")?.tags?.includes("scope-acute-pe-only")),
  };

  const post = {
    lessonsInsertedCount: liveLessons.length,
    questionsInsertedCount: liveQuestions.length,
    uniqueTopicSlugCount: lessonTopicSlugs.size,
    duplicateLessonIds,
    duplicateQuestionIds,
    questionToLessonTopicSlugFailures: questionTopicIntegrityFailures,
    countReconciliation: {
      expected: totalsTarget.fullProgram,
      actual: {
        topics: lessonTopicSlugs.size,
        lessons: liveLessons.length,
        questions: liveQuestions.length,
      },
      matches: {
        topics: lessonTopicSlugs.size === totalsTarget.fullProgram.totalTopics,
        lessons: liveLessons.length === totalsTarget.fullProgram.totalLessons,
        questions: liveQuestions.length === totalsTarget.fullProgram.totalQuestions,
      },
    },
    miPeBoundaryAssertions: boundaryChecks,
  };

  report.postImportVerification = post;
  report.blockers = [
    ...((report.importSummary as any).lessonsFailed.length ? ["One or more lesson rows failed during import."] : []),
    ...((report.importSummary as any).questionsFailed.length ? ["One or more question rows failed during import."] : []),
    ...(duplicateLessonIds > 0 ? ["Duplicate lesson IDs found in live imported set."] : []),
    ...(duplicateQuestionIds > 0 ? ["Duplicate question IDs found in live imported set."] : []),
    ...(questionTopicIntegrityFailures.length > 0 ? ["Question-to-lesson topicSlug integrity failures found."] : []),
    ...(!post.countReconciliation.matches.topics || !post.countReconciliation.matches.lessons || !post.countReconciliation.matches.questions
      ? ["Post-import counts do not reconcile to approved totals."]
      : []),
    ...(!Object.values(boundaryChecks).every(Boolean) ? ["MI/PE boundary assertions failed in validation."] : []),
  ];

  const reportPath = path.join(process.cwd(), REPORT_FILE);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
}

function bySlug(bp: { topics: Array<{ topicSlug: string }> }, slug: string) {
  return bp.topics.find((t: any) => t.topicSlug === slug) as any;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
