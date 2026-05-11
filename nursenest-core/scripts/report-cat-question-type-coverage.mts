#!/usr/bin/env npx tsx
/**
 * Inventory exam_questions by question_type for CAT / practice pool auditing.
 *
 *   cd nursenest-core && npx tsx scripts/report-cat-question-type-coverage.mts
 *   CAT_REPORT_FULL_SCAN=1 CAT_ASSERT_POOL_RENDERERS=1 npx tsx scripts/report-cat-question-type-coverage.mts
 *
 * Requires DATABASE_URL (unless you only need the static renderer matrix stub). Writes reports/cat-question-type-coverage.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outMd = path.join(coreRoot, "reports", "cat-question-type-coverage.md");

type Row = { question_type: string; c: bigint };
type TrioRow = { question_type: string; tier: string; exam: string; c: bigint };

async function main(): Promise<void> {
  mkdirSync(path.dirname(outMd), { recursive: true });

  if (!process.env.DATABASE_URL?.trim()) {
    const { CAT_QUESTION_TYPE_RUNTIME_MATRIX } = await import("@/lib/questions/cat-runner-renderer-coverage");
    const stubLines = [
      `# CAT question-type coverage`,
      ``,
      `**Generated:** ${new Date().toISOString()}`,
      ``,
      `DATABASE_URL not set — run against a configured database for SQL counts.`,
      ``,
      `## Runtime renderer matrix (static)`,
      ``,
      `| Logical format | Example question_type labels | Client renderer | Positive E2E | Notes / exclusion |`,
      `| --- | --- | --- | --- | --- |`,
    ];
    for (const row of CAT_QUESTION_TYPE_RUNTIME_MATRIX) {
      const ex = row.exclusionReason ?? row.positiveE2eNote ?? "—";
      stubLines.push(
        `| ${row.id} | ${row.questionTypeExamples.join(", ")} | ${row.runtimeRenderer} | ${row.positiveE2e} | ${ex.replace(/\|/g, "\\|")} |`,
      );
    }
    writeFileSync(outMd, stubLines.join("\n") + "\n", "utf8");
    console.warn("[report-cat-question-type-coverage] DATABASE_URL missing — wrote stub report.");
    return;
  }

  const { prisma } = await import("@/lib/db");

  const byType = await prisma.$queryRaw<Row[]>`
    SELECT question_type AS question_type, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status IN ('published', 'PUBLISHED')
    AND NOT (LOWER(TRIM(COALESCE(question_format, ''))) = 'ecg_video')
    AND NOT ('ecg-video' = ANY(tags))
    GROUP BY question_type
    ORDER BY c DESC
  `;

  const byTypeTierExam = await prisma.$queryRaw<TrioRow[]>`
    SELECT question_type AS question_type, tier, exam, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status IN ('published', 'PUBLISHED')
    AND NOT (LOWER(TRIM(COALESCE(question_format, ''))) = 'ecg_video')
    AND NOT ('ecg-video' = ANY(tags))
    GROUP BY question_type, tier, exam
    ORDER BY c DESC
    LIMIT 200
  `;

  const missingRationale = await prisma.$queryRaw<Row[]>`
    SELECT question_type AS question_type, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status IN ('published', 'PUBLISHED')
    AND NOT (LOWER(TRIM(COALESCE(question_format, ''))) = 'ecg_video')
    AND NOT ('ecg-video' = ANY(tags))
    AND (rationale IS NULL OR LENGTH(TRIM(rationale)) < 1)
    GROUP BY question_type
    ORDER BY c DESC
  `;

  const notAdaptiveEligible = await prisma.$queryRaw<Row[]>`
    SELECT question_type AS question_type, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status IN ('published', 'PUBLISHED')
    AND NOT (LOWER(TRIM(COALESCE(question_format, ''))) = 'ecg_video')
    AND NOT ('ecg-video' = ANY(tags))
    AND is_adaptive_eligible = false
    GROUP BY question_type
    ORDER BY c DESC
  `;

  type CountryRow = { question_type: string; country: string; c: bigint };
  const byTypeCountry = await prisma.$queryRaw<CountryRow[]>`
    SELECT question_type AS question_type,
           COALESCE(NULLIF(TRIM(country_code), ''), '(unset)') AS country,
           COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status IN ('published', 'PUBLISHED')
    AND NOT (LOWER(TRIM(COALESCE(question_format, ''))) = 'ecg_video')
    AND NOT ('ecg-video' = ANY(tags))
    GROUP BY question_type, COALESCE(NULLIF(TRIM(country_code), ''), '(unset)')
    ORDER BY c DESC
    LIMIT 300
  `;

  /** Optional: scan rows and apply TS \`isCompleteCatQuestionRow\` (CAT pool completeness). */
  const fullScan = process.env.CAT_REPORT_FULL_SCAN === "1";
  const completeByType = new Map<string, { scanned: number; complete: number }>();
  const MAX_SCAN = Math.min(50_000, Number.parseInt(process.env.CAT_REPORT_MAX_SCAN ?? "25000", 10) || 25_000);
  const assertPool = process.env.CAT_ASSERT_POOL_RENDERERS === "1";
  const poolViolations: string[] = [];

  if (assertPool && !fullScan) {
    console.warn(
      "[report-cat-question-type-coverage] CAT_ASSERT_POOL_RENDERERS=1 is ignored unless CAT_REPORT_FULL_SCAN=1 (no row scan scheduled).",
    );
  }

  if (fullScan) {
    const { isCompleteCatQuestionRow, NON_ECG_PRACTICE_EXAM_WHERE } = await import(
      "@/lib/practice-tests/cat-question-completeness",
    );
    const { assertCatCompleteRowRenderableOrThrow } = await import("@/lib/questions/cat-runner-renderer-coverage");
    let cursor: string | undefined;
    let scanned = 0;
    while (scanned < MAX_SCAN) {
      const batch = await prisma.examQuestion.findMany({
        where: {
          AND: [{ status: { in: ["published", "PUBLISHED"] } }, NON_ECG_PRACTICE_EXAM_WHERE],
        },
        select: {
          id: true,
          questionType: true,
          stem: true,
          options: true,
          correctAnswer: true,
          rationale: true,
        },
        orderBy: { id: "asc" },
        take: 500,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });
      if (batch.length === 0) break;
      for (const r of batch) {
        const qt = r.questionType ?? "UNKNOWN";
        const agg = completeByType.get(qt) ?? { scanned: 0, complete: 0 };
        agg.scanned += 1;
        const complete = isCompleteCatQuestionRow({
          questionType: r.questionType,
          stem: r.stem,
          options: r.options,
          correctAnswer: r.correctAnswer,
          rationale: r.rationale,
        });
        if (complete) {
          agg.complete += 1;
          if (assertPool) {
            try {
              assertCatCompleteRowRenderableOrThrow(
                {
                  id: r.id,
                  questionType: r.questionType,
                  stem: r.stem,
                  options: r.options,
                },
                { questionTypeLabel: String(r.questionType ?? "") },
              );
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              poolViolations.push(msg);
            }
          }
        }
        completeByType.set(qt, agg);
      }
      scanned += batch.length;
      cursor = batch[batch.length - 1]!.id;
      if (batch.length < 500) break;
    }
  }

  await prisma.$disconnect();

  if (assertPool && poolViolations.length > 0) {
    console.error(
      `[report-cat-question-type-coverage] CAT_ASSERT_POOL_RENDERERS=1 found ${poolViolations.length} complete row(s) that are not runner-renderable.`,
    );
    for (const v of poolViolations.slice(0, 40)) console.error(v);
    process.exit(1);
  }

  const { CAT_QUESTION_TYPE_RUNTIME_MATRIX } = await import("@/lib/questions/cat-runner-renderer-coverage");

  const lines: string[] = [];
  lines.push(`# CAT / practice pool — question_type inventory`);
  lines.push("");
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Scope notes`);
  lines.push("");
  lines.push(
    `- **Practice/CAT pool** (app): \`questionAccessWhereWithPathway\` / \`questionAccessWhere\` + \`NON_ECG_PRACTICE_EXAM_WHERE\` + \`generalStudyBankModuleSurfaceWhere()\` + completeness (\`isCompleteCatQuestionRow\` — requires non-empty rationale).`,
  );
  lines.push(
    `- **NP CAT API** (\`/api/cat/np/session\`): additionally filters \`isAdaptiveEligible: true\` — RN/PN practice CAT pool in \`fetchCatPracticePool\` does **not** apply that flag (documented gap vs NP-only endpoint).`,
  );
  lines.push(
    `- **Renderer**: MCQ, SATA, Bowtie/Trend; structured/matrix/cloze rows surface \`runnerUnsupportedQuestionFallback\` until dedicated UI ships.`,
  );
  lines.push(
    `- **Positive E2E**: \`tests/e2e/cat/cat-question-type-positive-matrix.spec.ts\` (run via \`npm run test:e2e:cat-question-types\`).`,
  );
  lines.push(
    `- **Pool assert**: \`CAT_ASSERT_POOL_RENDERERS=1\` with \`CAT_REPORT_FULL_SCAN=1\` fails the script when any \`isCompleteCatQuestionRow\` row still requires the unsupported fallback (see \`assertCatCompleteRowRenderableOrThrow\`).`,
  );
  lines.push("");
  lines.push(
    `> **Inventory vs learner CAT pool:** SQL counts are **all** published, non-ECG \`exam_questions\` rows. At runtime, \`questionAccessWhere\` / \`questionAccessWhereWithPathway\` (tier, exam keys, country, draft/publish), \`generalStudyBankModuleSurfaceWhere()\`, secondary session filters, and \`isCompleteCatQuestionRow\` can **exclude** additional rows per session.`,
  );
  lines.push("");
  lines.push(`### Schema note`);
  lines.push("");
  lines.push(
    `- \`ExamQuestion.question_type\` is a **string** (many legacy/import variants — see counts below). The Prisma \`QuestionType\` enum (MCQ, SATA, NGN_CASE, …) applies elsewhere (e.g. flashcard items), not to this column.`,
  );
  lines.push("");
  lines.push(`## Counts by question_type (published, non-ECG)`);
  lines.push("");
  lines.push(`| question_type | count |`);
  lines.push(`|---|---:|`);
  for (const r of byType) {
    lines.push(`| ${r.question_type} | ${r.c} |`);
  }
  lines.push("");
  lines.push(`## Top combinations (question_type × tier × exam)`);
  lines.push("");
  lines.push(`| question_type | tier | exam | count |`);
  lines.push(`|---|---|---|---:|`);
  for (const r of byTypeTierExam) {
    lines.push(`| ${r.question_type} | ${r.tier} | ${r.exam} | ${r.c} |`);
  }
  lines.push("");
  lines.push(`## Approximate CAT completeness exclusions — missing rationale`);
  lines.push("");
  lines.push(`| question_type | count |`);
  lines.push(`|---|---:|`);
  for (const r of missingRationale) {
    lines.push(`| ${r.question_type} | ${r.c} |`);
  }
  lines.push("");
  lines.push(`## is_adaptive_eligible = false (informational; not applied in fetchCatPracticePool)`);
  lines.push("");
  lines.push(`| question_type | count |`);
  lines.push(`|---|---:|`);
  for (const r of notAdaptiveEligible) {
    lines.push(`| ${r.question_type} | ${r.c} |`);
  }
  lines.push("");
  lines.push(`## Country / region code (top slices)`);
  lines.push("");
  lines.push(`| question_type | country_code | count |`);
  lines.push(`|---|---|---:|`);
  for (const r of byTypeCountry) {
    lines.push(`| ${r.question_type} | ${r.country} | ${r.c} |`);
  }
  lines.push("");
  if (fullScan && completeByType.size > 0) {
    lines.push(`## CAT completeness scan (\`isCompleteCatQuestionRow\`) — CAT_REPORT_FULL_SCAN=1`);
    lines.push("");
    lines.push(`Scanned up to ${MAX_SCAN} published non-ECG rows (see CAT_REPORT_MAX_SCAN).`);
    lines.push("");
    lines.push(`| question_type | scanned | passes_completeness |`);
    lines.push(`|---|---:|---:|`);
    const sorted = [...completeByType.entries()].sort((a, b) => b[1].scanned - a[1].scanned);
    for (const [qt, v] of sorted) {
      lines.push(`| ${qt} | ${v.scanned} | ${v.complete} |`);
    }
    lines.push("");
  } else {
    lines.push(`## CAT completeness scan`);
    lines.push("");
    lines.push(`Set \`CAT_REPORT_FULL_SCAN=1\` to batch-scan rows and count \`isCompleteCatQuestionRow\` passes per \`question_type\`.`);
    lines.push("");
  }

  lines.push(`## Runtime renderer matrix (product + exclusions)`);
  lines.push("");
  lines.push(
    "| Logical format | Example question_type labels | Client renderer | Positive E2E | Notes / exclusion |",
  );
  lines.push("| --- | --- | --- | --- | --- |");
  for (const row of CAT_QUESTION_TYPE_RUNTIME_MATRIX) {
    const ex = row.exclusionReason ?? row.positiveE2eNote ?? "—";
    lines.push(
      `| ${row.id} | ${row.questionTypeExamples.join(", ")} | ${row.runtimeRenderer} | ${row.positiveE2e} | ${ex.replace(/\|/g, "\\|")} |`,
    );
  }
  lines.push("");

  writeFileSync(outMd, lines.join("\n"), "utf8");
  console.log(`[report-cat-question-type-coverage] wrote ${outMd}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
