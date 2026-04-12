#!/usr/bin/env npx tsx
/**
 * Lesson ↔ bank link coverage: report, conservative DB salvage (topic/tags), optional AI drafts.
 *
 * From nursenest-core/:
 *   npx tsx scripts/lesson-question-gap-fill.ts                    # coverage JSON + salvage dry-run
 *   npx tsx scripts/lesson-question-gap-fill.ts --apply            # apply salvage + write report
 *   npx tsx scripts/lesson-question-gap-fill.ts --apply --ai-drafts # salvage then AI drafts for remaining gaps
 *   npx tsx scripts/lesson-question-gap-fill.ts --pathway=us-rn-nclex-rn --max-updates=200
 *
 * Env: LESSON_GAP_FILL_ADMIN_USER_ID (optional) for --ai-drafts; AI_OPENAI_MODEL; AI_ADMIN_GENERATION_ENABLED not enforced here.
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import {
  applyLessonGapSalvagePlan,
  buildLessonGapSalvagePlan,
  recountLessonsAfterSalvage,
} from "@/lib/lessons/lesson-question-gap-fill";
import { runLessonGapAiDrafts, resolveAutomationAdminUserId } from "@/lib/lessons/lesson-question-gap-fill-ai";
import { scanLessonQuestionLinkCoverage } from "@/lib/lessons/lesson-question-link-coverage-core";
import { prisma } from "@/lib/db";

function parseArgs(argv: string[]) {
  let pathway: string | null = null;
  let jsonOut: string | null = path.join(process.cwd(), "reports", "lesson-question-gap-fill.json");
  let apply = false;
  let aiDrafts = false;
  let maxUpdates = 2000;
  let maxAiLessons = 25;
  for (const a of argv) {
    if (a.startsWith("--pathway=")) pathway = a.slice("--pathway=".length).trim() || null;
    if (a.startsWith("--json-out=")) jsonOut = a.slice("--json-out=".length).trim() || null;
    if (a === "--apply") apply = true;
    if (a === "--ai-drafts") aiDrafts = true;
    if (a.startsWith("--max-updates=")) maxUpdates = Math.max(1, Number(a.slice("--max-updates=".length)) || 2000);
    if (a.startsWith("--max-ai-lessons=")) maxAiLessons = Math.max(1, Number(a.slice("--max-ai-lessons=".length)) || 25);
  }
  return { pathway, jsonOut, apply, aiDrafts, maxUpdates, maxAiLessons };
}

async function main() {
  const { pathway, jsonOut, apply, aiDrafts, maxUpdates, maxAiLessons } = parseArgs(process.argv.slice(2));

  const scanBefore = await scanLessonQuestionLinkCoverage(pathway);
  console.log("Lesson ↔ question link coverage (before)");
  console.log(JSON.stringify(scanBefore.summary, null, 2));

  const { items: salvagePlan, notes: salvageNotes } = await buildLessonGapSalvagePlan({
    pathwayFilter: pathway,
    maxQuestionUpdates: maxUpdates,
  });
  console.log(`\nSalvage plan: ${salvagePlan.length} exam_question row(s) to align (topic + tags)`);
  if (!apply && salvagePlan.length) {
    console.log("Preview (first 8):");
    for (const s of salvagePlan.slice(0, 8)) {
      console.log(
        `  ${s.examQuestionId.slice(0, 8)}… → ${s.pathwayId}/${s.lessonSlug} topic="${s.setTopic}" +tag ${s.mergeTags.at(-1)}`,
      );
    }
  }

  let applied = 0;
  let failures: Array<{ id: string; message: string }> = [];
  let recount: Awaited<ReturnType<typeof recountLessonsAfterSalvage>> = [];

  if (apply && salvagePlan.length) {
    const r = await applyLessonGapSalvagePlan(salvagePlan);
    applied = r.applied;
    failures = r.failures;
    recount = await recountLessonsAfterSalvage(salvagePlan);
    console.log(`\nApplied salvage: ${applied} update(s); failures: ${failures.length}`);
    if (failures.length) console.log(failures.slice(0, 5));
    if (recount.length) {
      const stillLow = recount.filter((x) => x.relatedQuestionCount < 8);
      console.log(`Recount touched lessons: ${recount.length}; still <8: ${stillLow.length}`);
    }
  }

  const scanAfterSalvage = await scanLessonQuestionLinkCoverage(pathway);

  let aiJobs: Awaited<ReturnType<typeof runLessonGapAiDrafts>>["jobs"] = [];
  if (aiDrafts) {
    if (!isAdminAiGenerationEnabled()) {
      console.error("AI drafts skipped: set AI_ADMIN_GENERATION_ENABLED=true");
    } else {
      const adminId = await resolveAutomationAdminUserId();
      if (!adminId) {
        console.error("No admin user for drafts: set LESSON_GAP_FILL_ADMIN_USER_ID or seed a CONTENT_ADMIN user.");
      } else {
        const gaps = scanAfterSalvage.rows.filter((r) => r.relatedQuestionCount < 8);
        console.log(`\nAI drafts: up to ${maxAiLessons} lesson(s), ${gaps.length} below min`);
        const { jobs } = await runLessonGapAiDrafts({
          gaps,
          adminUserId: adminId,
          maxLessons: maxAiLessons,
        });
        aiJobs = jobs;
        console.log(`AI jobs finished: ${jobs.length}; drafts created: ${jobs.reduce((a, j) => a + j.draftCount, 0)}`);
      }
    }
  }

  const scanFinal = aiDrafts ? await scanLessonQuestionLinkCoverage(pathway) : scanAfterSalvage;

  const payload = {
    generatedAt: new Date().toISOString(),
    pathwayFilter: pathway,
    apply,
    aiDrafts,
    salvageNotes,
    scanBefore: { summary: scanBefore.summary, rowCount: scanBefore.rows.length },
    salvagePlanCount: salvagePlan.length,
    salvageApplied: applied,
    salvageFailures: failures,
    recountAfterSalvage: recount,
    scanAfterSalvage: { summary: scanAfterSalvage.summary },
    aiJobs,
    scanFinal: { summary: scanFinal.summary },
  };

  if (jsonOut) {
    const abs = path.resolve(process.cwd(), jsonOut);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`\nWrote ${abs}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
