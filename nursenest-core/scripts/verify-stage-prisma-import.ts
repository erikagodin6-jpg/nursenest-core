#!/usr/bin/env npx tsx
/**
 * verify-stage-prisma-import.ts
 *
 * Post-import verification pass for Stage-I Prisma import pipeline.
 * Read-only — never writes to DB. Exits 1 if critical issues are found.
 *
 * Usage:
 *   npx tsx scripts/verify-stage-prisma-import.ts
 *   npx tsx scripts/verify-stage-prisma-import.ts --file=data/pipeline/runs/np-phase2-prisma-import.json
 */

import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_TIER_CODES = new Set(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]);
const VALID_STATUSES = new Set(["PUBLISHED", "DRAFT", "IN_REVIEW", "ARCHIVED"]);
const VALID_LOCALES = new Set(["en", "fr"]);

// Required lesson fields for render safety
const LESSON_REQUIRED_FIELDS = ["pathwayId", "slug", "title", "topicSlug", "seoTitle", "seoDescription", "locale", "status"];
// Fields that must be non-empty strings
const LESSON_NON_EMPTY = ["title", "seoTitle", "seoDescription", "topicSlug"];

interface Finding {
  severity: "CRITICAL" | "WARNING" | "INFO";
  check: string;
  message: string;
  detail?: unknown;
}

const findings: Finding[] = [];

function crit(check: string, message: string, detail?: unknown) {
  findings.push({ severity: "CRITICAL", check, message, detail });
}
function warn(check: string, message: string, detail?: unknown) {
  findings.push({ severity: "WARNING", check, message, detail });
}
function info(check: string, message: string, detail?: unknown) {
  findings.push({ severity: "INFO", check, message, detail });
}

// ─── 1. Load Stage-I source files ─────────────────────────────────────────────

interface StageFile {
  fileName: string;
  runId: string;
  pathwayLessonsTotal: number;
  examQuestionsTotal: number;
  pathwayIds: string[];
  exams: string[];
  lessonSlugs: string[];
  questionHashes: string[];
}

function loadStageFiles(runsDir: string): StageFile[] {
  const files = fs
    .readdirSync(runsDir)
    .filter((f) => f.endsWith("-prisma-import.json"))
    .map((f) => path.join(runsDir, f));

  const result: StageFile[] = [];

  for (const filePath of files) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const fileName = path.basename(filePath);

    if (raw.stage !== "prisma_import" || raw.schemaVersion !== 1) {
      crit("source_format", `${fileName}: not a valid Stage-I file`, { stage: raw.stage, schemaVersion: raw.schemaVersion });
      continue;
    }

    const lessonSlugs: string[] = (raw.pathwayLessonUpserts ?? []).map(
      (u: { data: { slug: string } }) => u.data.slug,
    );
    const questionHashes: string[] = (raw.examQuestionUpserts ?? [])
      .map((u: { data: { stemHash: string } }) => u.data.stemHash)
      .filter(Boolean);

    result.push({
      fileName,
      runId: raw.runId,
      pathwayLessonsTotal: raw.summary.pathwayLessonsTotal,
      examQuestionsTotal: raw.summary.examQuestionsTotal,
      pathwayIds: Object.keys(raw.summary.byPathwayId ?? {}),
      exams: Object.keys(raw.summary.byExam ?? {}),
      lessonSlugs,
      questionHashes,
    });
  }

  return result;
}

// ─── 2. DB checks ─────────────────────────────────────────────────────────────

async function runDbChecks(stageFiles: StageFile[]) {
  const allPathwayIds = [...new Set(stageFiles.flatMap((f) => f.pathwayIds))];
  const allExams = [...new Set(stageFiles.flatMap((f) => f.exams))];
  const allLessonSlugs = stageFiles.flatMap((f) => f.lessonSlugs);
  const allQuestionHashes = stageFiles.flatMap((f) => f.questionHashes);

  // ── 2a. Count reconciliation ─────────────────────────────────────────────

  for (const sf of stageFiles) {
    for (const pathwayId of sf.pathwayIds) {
      const dbCount = await prisma.pathwayLesson.count({ where: { pathwayId } });
      const expectedMinimum = sf.lessonSlugs.filter((s) =>
        stageFiles.some(
          (f) => f.pathwayIds.includes(pathwayId) && f.lessonSlugs.includes(s),
        ),
      ).length;

      info(
        "count_reconciliation",
        `${sf.fileName} / pathway=${pathwayId}: source=${expectedMinimum} db_total_for_pathway=${dbCount}`,
      );

      if (dbCount < expectedMinimum) {
        crit(
          "count_reconciliation",
          `${pathwayId}: DB has ${dbCount} lessons but source expects at least ${expectedMinimum}`,
        );
      }
    }

    if (sf.examQuestionsTotal > 0) {
      for (const exam of sf.exams) {
        const dbCount = await prisma.examQuestion.count({ where: { exam } });
        info(
          "count_reconciliation",
          `${sf.fileName} / exam=${exam}: source=${sf.examQuestionsTotal} db_total_for_exam=${dbCount}`,
        );
        if (dbCount < sf.examQuestionsTotal) {
          crit(
            "count_reconciliation",
            `${exam}: DB has ${dbCount} questions but source expects at least ${sf.examQuestionsTotal}`,
          );
        }
      }
    }
  }

  // ── 2b. Duplicate lesson identity check ──────────────────────────────────

  const dupLessons = await prisma.$queryRaw<
    Array<{ pathway_id: string; slug: string; locale: string; cnt: bigint }>
  >`
    SELECT pathway_id, slug, locale, COUNT(*)::int as cnt
    FROM pathway_lessons
    WHERE pathway_id = ANY(${allPathwayIds})
    GROUP BY pathway_id, slug, locale
    HAVING COUNT(*) > 1
  `;

  if (dupLessons.length > 0) {
    crit("duplicate_lessons", `Found ${dupLessons.length} duplicate (pathwayId, slug, locale) combos`, dupLessons);
  } else {
    info("duplicate_lessons", "No duplicate lesson identity keys — OK");
  }

  // ── 2c. TierCode validity ────────────────────────────────────────────────

  const tierRows = await prisma.$queryRaw<Array<{ tier_code: string | null; cnt: bigint }>>`
    SELECT tier_code, COUNT(*)::int as cnt
    FROM pathway_lessons
    WHERE pathway_id = ANY(${allPathwayIds})
    GROUP BY tier_code
    ORDER BY tier_code NULLS LAST
  `;

  for (const row of tierRows) {
    const tc = row.tier_code;
    if (tc !== null && !VALID_TIER_CODES.has(tc)) {
      crit("tier_code_validity", `Invalid TierCode '${tc}' found in ${Number(row.cnt)} lessons`, row);
    } else {
      info("tier_code_validity", `tierCode=${tc ?? "null"} count=${Number(row.cnt)}`);
    }
  }

  // ── 2d. ContentStatus validity ───────────────────────────────────────────

  const statusRows = await prisma.$queryRaw<Array<{ status: string; cnt: bigint }>>`
    SELECT status, COUNT(*)::int as cnt
    FROM pathway_lessons
    WHERE pathway_id = ANY(${allPathwayIds})
    GROUP BY status
  `;

  for (const row of statusRows) {
    if (!VALID_STATUSES.has(row.status)) {
      crit("status_validity", `Invalid status '${row.status}' in lessons`, row);
    } else {
      info("status_validity", `status=${row.status} count=${Number(row.cnt)}`);
    }
  }

  // ── 2e. Locale validity ──────────────────────────────────────────────────

  const localeRows = await prisma.$queryRaw<Array<{ locale: string; cnt: bigint }>>`
    SELECT locale, COUNT(*)::int as cnt
    FROM pathway_lessons
    WHERE pathway_id = ANY(${allPathwayIds})
    GROUP BY locale
  `;

  for (const row of localeRows) {
    if (!VALID_LOCALES.has(row.locale)) {
      warn("locale_validity", `Unexpected locale '${row.locale}' in ${Number(row.cnt)} lessons`, row);
    } else {
      info("locale_validity", `locale=${row.locale} count=${Number(row.cnt)}`);
    }
  }

  // ── 2f. Duplicate stemHash in questions ──────────────────────────────────

  if (allExams.length > 0) {
    const dupHashes = await prisma.$queryRaw<
      Array<{ stem_hash: string; cnt: bigint }>
    >`
      SELECT stem_hash, COUNT(*)::int as cnt
      FROM exam_questions
      WHERE exam = ANY(${allExams}) AND stem_hash IS NOT NULL
      GROUP BY stem_hash
      HAVING COUNT(*) > 1
      LIMIT 10
    `;

    if (dupHashes.length > 0) {
      crit("duplicate_question_hashes", `Found ${dupHashes.length} duplicate stemHash values in questions`, dupHashes);
    } else {
      info("duplicate_question_hashes", "No duplicate stemHash values — OK");
    }
  }

  // ── 2g. Lesson render-safety: required field nulls ────────────────────────

  const lessonNulls = await prisma.$queryRaw<
    Array<{
      null_title: bigint; null_slug: bigint; null_topic_slug: bigint;
      null_seo_title: bigint; null_seo_desc: bigint; null_body_system: bigint;
      null_sections: bigint; empty_sections: bigint;
    }>
  >`
    SELECT
      SUM(CASE WHEN title IS NULL OR title = '' THEN 1 ELSE 0 END)::int         as null_title,
      SUM(CASE WHEN slug IS NULL OR slug = '' THEN 1 ELSE 0 END)::int           as null_slug,
      SUM(CASE WHEN topic_slug IS NULL OR topic_slug = '' THEN 1 ELSE 0 END)::int as null_topic_slug,
      SUM(CASE WHEN seo_title IS NULL OR seo_title = '' THEN 1 ELSE 0 END)::int as null_seo_title,
      SUM(CASE WHEN seo_description IS NULL OR seo_description = '' THEN 1 ELSE 0 END)::int as null_seo_desc,
      SUM(CASE WHEN body_system IS NULL OR body_system = '' THEN 1 ELSE 0 END)::int as null_body_system,
      SUM(CASE WHEN sections IS NULL THEN 1 ELSE 0 END)::int                    as null_sections,
      SUM(CASE WHEN jsonb_array_length(sections::jsonb) = 0 THEN 1 ELSE 0 END)::int as empty_sections
    FROM pathway_lessons
    WHERE pathway_id = ANY(${allPathwayIds})
  `;

  const ln = lessonNulls[0];
  const fields = {
    title: Number(ln.null_title),
    slug: Number(ln.null_slug),
    topicSlug: Number(ln.null_topic_slug),
    seoTitle: Number(ln.null_seo_title),
    seoDescription: Number(ln.null_seo_desc),
    bodySystem: Number(ln.null_body_system),
    sectionsNull: Number(ln.null_sections),
    sectionsEmpty: Number(ln.empty_sections),
  };

  for (const [field, count] of Object.entries(fields)) {
    if (count > 0) {
      if (["title", "slug", "topicSlug"].includes(field)) {
        crit("lesson_render_safety", `${count} lessons have null/empty '${field}' — will break routing`, { field, count });
      } else if (field === "sectionsNull" || field === "sectionsEmpty") {
        warn("lesson_render_safety", `${count} lessons have ${field === "sectionsNull" ? "null" : "empty"} sections — renders blank`, { field, count });
      } else {
        warn("lesson_render_safety", `${count} lessons have null/empty '${field}'`, { field, count });
      }
    }
  }

  if (Object.values(fields).every((n) => n === 0)) {
    info("lesson_render_safety", "All required lesson fields populated — OK");
  }

  // ── 2h. Question render-safety ────────────────────────────────────────────

  if (allExams.length > 0) {
    const qNulls = await prisma.$queryRaw<
      Array<{
        null_stem: bigint; empty_rationale: bigint; null_hash: bigint;
        null_options: bigint; null_correct: bigint; null_body_system: bigint;
      }>
    >`
      SELECT
        SUM(CASE WHEN stem IS NULL OR stem = '' THEN 1 ELSE 0 END)::int              as null_stem,
        SUM(CASE WHEN rationale IS NULL OR rationale = '' THEN 1 ELSE 0 END)::int    as empty_rationale,
        SUM(CASE WHEN stem_hash IS NULL THEN 1 ELSE 0 END)::int                      as null_hash,
        SUM(CASE WHEN options IS NULL THEN 1 ELSE 0 END)::int                        as null_options,
        SUM(CASE WHEN correct_answer IS NULL THEN 1 ELSE 0 END)::int                 as null_correct,
        SUM(CASE WHEN body_system IS NULL THEN 1 ELSE 0 END)::int                    as null_body_system
      FROM exam_questions
      WHERE exam = ANY(${allExams})
    `;

    const qn = qNulls[0];
    const qFields = {
      stem: Number(qn.null_stem),
      rationale: Number(qn.empty_rationale),
      stemHash: Number(qn.null_hash),
      options: Number(qn.null_options),
      correctAnswer: Number(qn.null_correct),
      bodySystem: Number(qn.null_body_system),
    };

    for (const [field, count] of Object.entries(qFields)) {
      if (count > 0) {
        if (["stem", "options", "correctAnswer", "stemHash"].includes(field)) {
          crit("question_render_safety", `${count} questions have null/empty '${field}' — will break exam engine`, { field, count });
        } else {
          warn("question_render_safety", `${count} questions have null/empty '${field}'`, { field, count });
        }
      }
    }
    if (Object.values(qFields).every((n) => n === 0)) {
      info("question_render_safety", "All required question fields populated — OK");
    }
  }

  // ── 2i. Specific slug presence check (were all source slugs imported?) ────

  for (const sf of stageFiles) {
    if (sf.lessonSlugs.length === 0) continue;
    // Sample-check first 5 + last 5 slugs
    const sampleSlugs = [
      ...sf.lessonSlugs.slice(0, 5),
      ...sf.lessonSlugs.slice(-5),
    ].filter((v, i, a) => a.indexOf(v) === i);

    const found = await prisma.pathwayLesson.findMany({
      where: { slug: { in: sampleSlugs } },
      select: { slug: true, pathwayId: true, tierCode: true, status: true },
    });

    const foundSlugs = new Set(found.map((r) => r.slug));
    const missingSlugs = sampleSlugs.filter((s) => !foundSlugs.has(s));

    if (missingSlugs.length > 0) {
      crit("slug_presence", `${sf.fileName}: ${missingSlugs.length} sampled slugs NOT in DB`, missingSlugs);
    } else {
      info("slug_presence", `${sf.fileName}: all sampled slugs present in DB`);
    }

    // Check tierCode on found rows
    for (const row of found) {
      if (row.tierCode !== null && !VALID_TIER_CODES.has(row.tierCode)) {
        crit("persisted_tier_code", `Slug '${row.slug}' has invalid tierCode='${row.tierCode}' in DB`, row);
      }
    }
  }

  // ── 2j. Idempotency check ────────────────────────────────────────────────

  // All source slugs should already exist — if we re-ran with --apply, they'd be skipped
  const allLessonDbCount = await prisma.pathwayLesson.count({
    where: { slug: { in: allLessonSlugs.slice(0, 200) } },
  });
  const expectedFound = Math.min(allLessonSlugs.length, 200);
  if (allLessonDbCount === expectedFound) {
    info("idempotency", `All ${expectedFound} sampled lesson slugs exist in DB — rerun would skip all (idempotent)`);
  } else {
    warn("idempotency", `Only ${allLessonDbCount}/${expectedFound} sampled slugs found — some rows may be missing`);
  }

  // ── 2k. Checkpoint file check ────────────────────────────────────────────

  const checkpointDir = path.join(path.dirname(path.dirname(stageFiles[0]?.fileName ?? "")), "data/pipeline/runs/checkpoints");
  const absCheckpointDir = path.resolve(process.cwd(), "data/pipeline/runs/checkpoints");

  if (fs.existsSync(absCheckpointDir)) {
    const checkpointFiles = fs.readdirSync(absCheckpointDir).filter((f) => f.endsWith("-checkpoint.json"));
    for (const cf of checkpointFiles) {
      const checkpoint = JSON.parse(fs.readFileSync(path.join(absCheckpointDir, cf), "utf8"));
      if (!checkpoint.runId || !checkpoint.completedAt) {
        warn("checkpoint_integrity", `${cf}: missing runId or completedAt`, checkpoint);
      } else {
        info("checkpoint_integrity", `${cf}: runId=${checkpoint.runId} completedAt=${checkpoint.completedAt} lessons=${checkpoint.lessonsInserted} questions=${checkpoint.questionsInserted}`);
      }
    }
    if (checkpointFiles.length === 0) {
      warn("checkpoint_integrity", "No checkpoint files found — were --apply runs completed?");
    }
  } else {
    warn("checkpoint_integrity", "Checkpoint directory does not exist — no --apply runs have completed");
  }

  // ── 2l. Section structure validation (sample) ────────────────────────────

  const sampleLessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: allPathwayIds } },
    select: { slug: true, sections: true, pathwayId: true },
    take: 20,
  });

  let malformedSections = 0;
  for (const lesson of sampleLessons) {
    const sections = lesson.sections as unknown;
    if (!Array.isArray(sections)) {
      malformedSections++;
      crit("section_structure", `Slug '${lesson.slug}': sections is not an array`, { type: typeof sections });
      continue;
    }
    for (const s of sections) {
      if (!s || typeof s !== "object") {
        malformedSections++;
        warn("section_structure", `Slug '${lesson.slug}': section is not an object`);
        continue;
      }
      const sec = s as Record<string, unknown>;
      if (!sec.id || !sec.heading || !sec.kind || !sec.body) {
        warn("section_structure", `Slug '${lesson.slug}': section missing id/heading/kind/body`, {
          id: sec.id, heading: sec.heading, kind: sec.kind, hasBody: !!sec.body,
        });
        malformedSections++;
      }
    }
  }
  if (malformedSections === 0) {
    info("section_structure", `Sampled ${sampleLessons.length} lessons — all sections well-formed`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const runsDir = path.resolve(process.cwd(), "data/pipeline/runs");

  process.stderr.write("\nNurseNest Stage-I Verification Pass\n");
  process.stderr.write(`  runs dir : ${runsDir}\n\n`);

  const stageFiles = loadStageFiles(runsDir);

  if (stageFiles.length === 0) {
    crit("source_files", "No Stage-I import files found in data/pipeline/runs/");
  } else {
    info("source_files", `Found ${stageFiles.length} Stage-I files: ${stageFiles.map((f) => f.fileName).join(", ")}`);
    for (const sf of stageFiles) {
      info("source_summary", `${sf.fileName}: ${sf.pathwayLessonsTotal} lessons, ${sf.examQuestionsTotal} questions`);
    }
  }

  if (stageFiles.length > 0) {
    await runDbChecks(stageFiles);
  }

  await prisma.$disconnect();

  // ── Report ────────────────────────────────────────────────────────────────

  const criticals = findings.filter((f) => f.severity === "CRITICAL");
  const warnings = findings.filter((f) => f.severity === "WARNING");
  const infos = findings.filter((f) => f.severity === "INFO");

  const report = {
    verifiedAt: new Date().toISOString(),
    summary: {
      CRITICAL: criticals.length,
      WARNING: warnings.length,
      INFO: infos.length,
      pass: criticals.length === 0,
    },
    findings: {
      CRITICAL: criticals,
      WARNING: warnings,
      INFO: infos,
    },
  };

  console.log(JSON.stringify(report, null, 2));

  if (criticals.length > 0) {
    process.stderr.write(`\n❌ VERIFICATION FAILED: ${criticals.length} critical finding(s)\n`);
    process.exit(1);
  } else {
    process.stderr.write(`\n✅ VERIFICATION PASSED (${warnings.length} warnings, ${infos.length} info)\n`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});
