import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import {
  ECG_VIDEO_QUESTION_FORMAT,
  ECG_VIDEO_TAG,
  isEcgVideoQuestion,
  parseEcgVideoExhibit,
  validateEcgVideoQuestionForPublish,
} from "../src/lib/ecg-video-quiz/ecg-video-question";
import { loadRuntimeEnv, isRuntimeEnvError } from "./lib/load-runtime-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const reportsDir = join(root, "reports");
const jsonPath = join(reportsDir, "ecg-video-quiz-audit.json");
const mdPath = join(reportsDir, "ecg-video-quiz-audit.md");

function statusIsPublic(status: string | null | undefined, publishAt: Date | null | undefined): boolean {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized !== "published") return false;
  return !publishAt || publishAt.getTime() <= Date.now();
}

function asTextList(items: string[]): string {
  if (items.length === 0) return "None";
  return items.map((x) => `- ${x}`).join("\n");
}

async function main() {
  try {
    loadRuntimeEnv({ purpose: "audit:ecg-video-quiz" });
  } catch (error) {
    if (isRuntimeEnvError(error)) {
      console.error(`[audit:ecg-video-quiz] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: [{ questionFormat: ECG_VIDEO_QUESTION_FORMAT }, { tags: { has: ECG_VIDEO_TAG } }],
      },
      select: {
        id: true,
        stem: true,
        status: true,
        publishAt: true,
        tier: true,
        exam: true,
        topic: true,
        subtopic: true,
        questionType: true,
        questionFormat: true,
        options: true,
        correctAnswer: true,
        rationale: true,
        tags: true,
        exhibitData: true,
        images: true,
      },
      orderBy: [{ tier: "asc" }, { topic: "asc" }, { updatedAt: "desc" }],
    });

    const items = rows.map((row) => {
      const exhibit = parseEcgVideoExhibit(row.exhibitData, row.images);
      const validation = validateEcgVideoQuestionForPublish(row);
      const publicVisible = statusIsPublic(row.status, row.publishAt);
      const malformedOptions = !Array.isArray(row.options) || row.options.length < 2;
      return {
        id: row.id,
        tier: row.tier,
        exam: row.exam,
        topic: row.topic,
        subtopic: row.subtopic,
        status: row.status,
        publicVisible,
        publicReady: publicVisible && validation.ok,
        isEcgVideoQuestion: isEcgVideoQuestion(row),
        rhythmCategory: exhibit?.rhythmCategory ?? null,
        hasVideoAsset: Boolean(exhibit?.asset.url || exhibit?.asset.assetId),
        hasRationale: Boolean(row.rationale?.trim()),
        hasCorrectAnswer: Array.isArray(row.correctAnswer) ? row.correctAnswer.length > 0 : Boolean(row.correctAnswer),
        hasLinkedLesson: Boolean(exhibit?.linkedLesson?.href || exhibit?.linkedLesson?.slug),
        malformedOptions,
        blockers: validation.reasons,
        warnings: validation.warnings,
      };
    });

    const summary = {
      totalEcgVideoQuestions: items.length,
      publicEcgVideoQuestions: items.filter((x) => x.publicVisible).length,
      draftEcgVideoQuestions: items.filter((x) => !x.publicVisible).length,
      missingVideoAsset: items.filter((x) => !x.hasVideoAsset).length,
      missingRationale: items.filter((x) => !x.hasRationale).length,
      missingCorrectAnswer: items.filter((x) => !x.hasCorrectAnswer).length,
      missingLinkedLesson: items.filter((x) => !x.hasLinkedLesson).length,
      malformedAnswerOptions: items.filter((x) => x.malformedOptions).length,
      publicReadyCount: items.filter((x) => x.publicReady).length,
    };

    const report = {
      generatedAt: new Date().toISOString(),
      summary,
      items,
    };

    const md = [
      "# ECG Video Quiz Audit",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      "## Summary",
      "",
      `- Total ECG video questions: ${summary.totalEcgVideoQuestions}`,
      `- Public ECG video questions: ${summary.publicEcgVideoQuestions}`,
      `- Draft ECG video questions: ${summary.draftEcgVideoQuestions}`,
      `- Public-ready ECG video questions: ${summary.publicReadyCount}`,
      `- Missing video asset: ${summary.missingVideoAsset}`,
      `- Missing rationale: ${summary.missingRationale}`,
      `- Missing correct answer: ${summary.missingCorrectAnswer}`,
      `- Missing linked lesson: ${summary.missingLinkedLesson}`,
      `- Malformed answer options: ${summary.malformedAnswerOptions}`,
      "",
      "## Blocked Items",
      "",
      items.filter((x) => x.blockers.length > 0).length
        ? items
            .filter((x) => x.blockers.length > 0)
            .map((x) => `### ${x.id}\n\n- Tier/exam: ${x.tier} / ${x.exam}\n- Topic: ${x.topic ?? "None"}\n- Status: ${x.status ?? "None"}\n\n${asTextList(x.blockers)}`)
            .join("\n\n")
        : "None",
      "",
      "## PASS/FAIL",
      "",
      summary.publicEcgVideoQuestions === summary.publicReadyCount
        ? "PASS: all public ECG video questions pass readiness."
        : "FAIL: at least one public ECG video question is incomplete.",
    ].join("\n");

    await mkdir(reportsDir, { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(mdPath, `${md}\n`);
    console.log("[audit:ecg-video-quiz] wrote reports/ecg-video-quiz-audit.{json,md}");
    if (summary.publicEcgVideoQuestions !== summary.publicReadyCount) process.exitCode = 1;
  } catch (error) {
    console.error("[audit:ecg-video-quiz] failed without converting counts to zero:");
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
