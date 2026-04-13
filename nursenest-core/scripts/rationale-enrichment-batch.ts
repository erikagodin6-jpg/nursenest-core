import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  buildControlledRationaleEnrichment,
  HIGH_YIELD_RATIONALE_BATCHES,
  type HighYieldRationaleBatchId,
} from "@/lib/content-quality/controlled-rationale-enrichment";

type Args = {
  batch?: HighYieldRationaleBatchId;
  maxItems: number;
  pathwayId?: string;
  includeFlashcards: boolean;
  apply: boolean;
  trace: number;
};

type QuestionSkipReason =
  | "no_question_match"
  | "no_source_anchor"
  | "source_content_too_weak"
  | "below_minimum_substance_threshold"
  | "target_already_has_quality_rationale"
  | "persistence_write_blocked"
  | "schema_validation_failed";

type QuestionAction = "applied" | "eligible_dry_run" | "skipped";

type QuestionTraceRow = {
  questionId: string;
  topic: string | null;
  sourceMatched: boolean;
  sourceAnchorCount: number;
  sourceAnchorWordCount: number;
  thresholdScore: number;
  eligible: boolean;
  finalAction: QuestionAction;
  rejectionReason: QuestionSkipReason | null;
};

function parseArgs(argv: string[]): Args {
  const out: Args = {
    maxItems: 25,
    includeFlashcards: true,
    apply: false,
    trace: 0,
  };
  for (const raw of argv) {
    if (raw.startsWith("--batch=")) {
      const v = raw.slice("--batch=".length).trim() as HighYieldRationaleBatchId;
      if (HIGH_YIELD_RATIONALE_BATCHES.some((b) => b.id === v)) out.batch = v;
    } else if (raw.startsWith("--max=")) {
      const n = Number(raw.slice("--max=".length));
      if (Number.isFinite(n) && n > 0) out.maxItems = Math.max(1, Math.min(200, Math.floor(n)));
    } else if (raw.startsWith("--pathway=")) {
      const v = raw.slice("--pathway=".length).trim();
      if (v) out.pathwayId = v;
    } else if (raw === "--questions-only") {
      out.includeFlashcards = false;
    } else if (raw === "--apply") {
      out.apply = true;
    } else if (raw.startsWith("--trace=")) {
      const n = Number(raw.slice("--trace=".length));
      if (Number.isFinite(n) && n > 0) out.trace = Math.max(1, Math.min(200, Math.floor(n)));
    }
  }
  return out;
}

function qualityFlags(text: string): string[] {
  const flags: string[] = [];
  const plain = text.trim();
  const wc = plain.split(/\s+/).filter(Boolean).length;
  if (wc < 14) flags.push("too_short");
  if (wc > 120) flags.push("too_long");
  if (/this is important because nurses must know|it is important to remember/i.test(plain)) {
    flags.push("generic_filler");
  }
  return flags;
}

function questionSubstanceScore(seed: {
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
}): number {
  const fields = [seed.correctAnswerExplanation, seed.rationale, seed.clinicalReasoning, seed.keyTakeaway]
    .map((x) => (x ?? "").trim())
    .filter(Boolean);
  let score = 0;
  for (const text of fields) {
    const wc = text.split(/\s+/).filter(Boolean).length;
    if (wc >= 24) score += 3;
    else if (wc >= 14) score += 2;
    else if (wc >= 8) score += 1;
  }
  return score;
}

function hasQualityRationaleTarget(q: {
  rationale: string | null;
  correctAnswerExplanation: string | null;
  incorrectAnswerRationale?: unknown;
  clinicalPearl: string | null;
}): boolean {
  const rationaleWc = (q.rationale ?? "").trim().split(/\s+/).filter(Boolean).length;
  const explainWc = (q.correctAnswerExplanation ?? "").trim().split(/\s+/).filter(Boolean).length;
  const pearlWc = (q.clinicalPearl ?? "").trim().split(/\s+/).filter(Boolean).length;
  const wrongText =
    typeof q.incorrectAnswerRationale === "string"
      ? q.incorrectAnswerRationale
      : q.incorrectAnswerRationale != null
        ? JSON.stringify(q.incorrectAnswerRationale)
        : "";
  const wrongWc = wrongText.trim().split(/\s+/).filter(Boolean).length;
  return rationaleWc >= 24 && explainWc >= 18 && pearlWc >= 8 && wrongWc >= 10;
}

function hasSchemaValidationFailure(payload: {
  whyCorrect: string;
  clinicalPearl: string;
}): boolean {
  return qualityFlags(payload.whyCorrect).includes("generic_filler") || qualityFlags(payload.clinicalPearl).includes("generic_filler");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const DB_PUBLISHED = "published";

  const questions = await prisma.examQuestion.findMany({
    where: {
      status: DB_PUBLISHED,
      ...(args.pathwayId ? { pathwayId: args.pathwayId } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 25000,
    select: {
      id: true,
      stem: true,
      topic: true,
      subtopic: true,
      bodySystem: true,
      tags: true,
      questionType: true,
      rationale: true,
      correctAnswerExplanation: true,
      clinicalReasoning: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
      keyTakeaway: true,
      clinicalPearl: true,
      examStrategy: true,
      updatedAt: true,
    },
  });

  const questionBreakdown = {
    totalScanned: questions.length,
    candidateQuestionsMatched: 0,
    candidatesWithUsableSourceAnchors: 0,
    rejectedNoQuestionMatch: 0,
    rejectedNoSourceAnchor: 0,
    rejectedWeakSource: 0,
    rejectedThreshold: 0,
    rejectedTargetAlreadyQuality: 0,
    rejectedWriteBlocked: 0,
    rejectedSchemaValidation: 0,
    candidatesSuccessfullyApplied: 0,
    eligibleDryRun: 0,
  };

  const questionRows: Array<Record<string, unknown>> = [];
  const questionTrace: QuestionTraceRow[] = [];
  let applyAttemptCount = 0;
  for (const q of questions) {
    const enrichment = buildControlledRationaleEnrichment({
      stem: q.stem,
      topic: q.topic,
      subtopic: q.subtopic,
      bodySystem: q.bodySystem,
      tags: q.tags,
      questionType: q.questionType,
      rationale: q.rationale,
      correctAnswerExplanation: q.correctAnswerExplanation,
      clinicalReasoning: q.clinicalReasoning,
      distractorNotes:
        typeof q.distractorRationales === "string" ? q.distractorRationales : JSON.stringify(q.distractorRationales ?? ""),
      keyTakeaway: q.keyTakeaway,
      examStrategy: q.examStrategy,
    });

    const sourceMatched = args.batch ? enrichment.batchId === args.batch : enrichment.batchId !== null;
    if (!sourceMatched) {
      questionBreakdown.rejectedNoQuestionMatch += 1;
      continue;
    }
    questionBreakdown.candidateQuestionsMatched += 1;

    const sourceAnchorCount = enrichment.diagnostics?.sourceAnchorCount ?? 0;
    const sourceAnchorWordCount = enrichment.diagnostics?.sourceAnchorWordCount ?? 0;
    const thresholdScore = questionSubstanceScore({
      rationale: q.rationale,
      correctAnswerExplanation: q.correctAnswerExplanation,
      clinicalReasoning: q.clinicalReasoning,
      keyTakeaway: q.keyTakeaway,
    });

    if (sourceAnchorCount > 0 && sourceAnchorWordCount >= 12) {
      questionBreakdown.candidatesWithUsableSourceAnchors += 1;
    }

    let action: QuestionAction = "skipped";
    let rejectionReason: QuestionSkipReason | null = null;
    let writeError: string | null = null;

    if (hasQualityRationaleTarget(q)) {
      rejectionReason = "target_already_has_quality_rationale";
      questionBreakdown.rejectedTargetAlreadyQuality += 1;
    } else if (!enrichment.applied) {
      if (enrichment.skippedReason === "no_source_anchor") {
        rejectionReason = "no_source_anchor";
        questionBreakdown.rejectedNoSourceAnchor += 1;
      } else if (enrichment.skippedReason === "source_content_too_weak") {
        rejectionReason = "source_content_too_weak";
        questionBreakdown.rejectedWeakSource += 1;
      } else if (enrichment.skippedReason === "below_minimum_substance_threshold") {
        rejectionReason = "below_minimum_substance_threshold";
        questionBreakdown.rejectedThreshold += 1;
      } else {
        rejectionReason = "schema_validation_failed";
        questionBreakdown.rejectedSchemaValidation += 1;
      }
    } else if (hasSchemaValidationFailure({ whyCorrect: enrichment.whyCorrect, clinicalPearl: enrichment.clinicalPearl })) {
      rejectionReason = "schema_validation_failed";
      questionBreakdown.rejectedSchemaValidation += 1;
    } else {
      const nextCorrect = enrichment.whyCorrect;
      const nextWrong = enrichment.whyWrong;
      const nextPearl = enrichment.clinicalPearl;
      const nextRationale = (q.rationale ?? "").trim() ? q.rationale : enrichment.whyCorrect;
      const updateData = {
        rationale: nextRationale,
        correctAnswerExplanation: nextCorrect,
        incorrectAnswerRationale: nextWrong,
        clinicalPearl: nextPearl,
      };
      const hasDiff =
        (q.rationale ?? null) !== updateData.rationale ||
        (q.correctAnswerExplanation ?? null) !== updateData.correctAnswerExplanation ||
        JSON.stringify(q.incorrectAnswerRationale ?? null) !== JSON.stringify(updateData.incorrectAnswerRationale ?? null) ||
        (q.clinicalPearl ?? null) !== updateData.clinicalPearl;

      if (!hasDiff) {
        rejectionReason = "persistence_write_blocked";
        questionBreakdown.rejectedWriteBlocked += 1;
      } else if (!args.apply) {
        action = "eligible_dry_run";
        questionBreakdown.eligibleDryRun += 1;
      } else if (applyAttemptCount >= args.maxItems) {
        rejectionReason = "persistence_write_blocked";
        questionBreakdown.rejectedWriteBlocked += 1;
      } else {
        applyAttemptCount += 1;
        try {
          await prisma.$executeRaw`
            UPDATE "exam_questions"
            SET
              "rationale" = ${updateData.rationale},
              "correct_answer_explanation" = ${updateData.correctAnswerExplanation},
              "incorrect_answer_rationale" = jsonb_build_object('summary', ${updateData.incorrectAnswerRationale}),
              "clinical_pearl" = ${updateData.clinicalPearl},
              "updated_at" = NOW()
            WHERE "id" = ${q.id}
          `;
          action = "applied";
          questionBreakdown.candidatesSuccessfullyApplied += 1;
        } catch (error) {
          rejectionReason = "persistence_write_blocked";
          writeError = error instanceof Error ? error.message : String(error);
          questionBreakdown.rejectedWriteBlocked += 1;
        }
      }
    }

    if (questionRows.length < args.maxItems) {
      questionRows.push({
        id: q.id,
        topic: q.topic,
        subtopic: q.subtopic,
        updatedAt: q.updatedAt.toISOString(),
        batchId: enrichment.batchId,
        applied: action === "applied" || action === "eligible_dry_run",
        action,
        whyCorrect: enrichment.whyCorrect,
        whyWrong: enrichment.whyWrong,
        clinicalPearl: enrichment.clinicalPearl,
        topicAnchor: enrichment.topicAnchor,
        skippedReason: rejectionReason,
        flags: [
          ...qualityFlags(enrichment.whyCorrect),
          ...qualityFlags(enrichment.clinicalPearl),
          ...(enrichment.whyWrong.includes("not available") ? ["honest_distractor_fallback"] : []),
        ],
        diagnostics: enrichment.diagnostics ?? null,
        ...(writeError ? { writeError } : {}),
      });
    }

    if (args.trace > 0 && questionTrace.length < args.trace) {
      questionTrace.push({
        questionId: q.id,
        topic: q.topic,
        sourceMatched,
        sourceAnchorCount,
        sourceAnchorWordCount,
        thresholdScore,
        eligible: action === "applied" || action === "eligible_dry_run",
        finalAction: action,
        rejectionReason,
      });
    }
  }

  let flashcardRows: Array<Record<string, unknown>> = [];
  if (args.includeFlashcards) {
    const flashcards = await prisma.flashcard.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(args.pathwayId ? { deck: { pathwayId: args.pathwayId } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 25000,
      select: {
        id: true,
        front: true,
        back: true,
        updatedAt: true,
        category: { select: { name: true, topicCode: true } },
      },
    });

    flashcardRows = flashcards
      .map((c) => {
        const enrichment = buildControlledRationaleEnrichment({
          stem: c.front,
          rationale: c.back,
          topic: c.category.name,
          subtopic: c.category.topicCode,
          keyTakeaway: c.back,
        });
        return {
          id: c.id,
          topic: c.category.name,
          subtopic: c.category.topicCode,
          updatedAt: c.updatedAt.toISOString(),
          batchId: enrichment.batchId,
          applied: enrichment.applied,
          whyCorrect: enrichment.whyCorrect,
          clinicalPearl: enrichment.clinicalPearl,
          topicAnchor: enrichment.topicAnchor,
          skippedReason: enrichment.skippedReason ?? null,
          flags: [...qualityFlags(enrichment.whyCorrect), ...qualityFlags(enrichment.clinicalPearl)],
        };
      })
      .filter((row) => (args.batch ? row.batchId === args.batch : row.batchId !== null))
      .slice(0, args.maxItems);
  }

  const outDir = path.join(process.cwd(), "reports", "rationale-enrichment");
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const batchLabel = args.batch ?? "all-high-yield";
  const jsonPath = path.join(outDir, `batch-${batchLabel}-${stamp}.json`);
  const mdPath = path.join(outDir, `batch-${batchLabel}-${stamp}.md`);

  const payload = {
    generatedAt: new Date().toISOString(),
    config: args,
    questionBreakdown,
    questionCount: questionRows.length,
    flashcardCount: flashcardRows.length,
    questions: questionRows,
    flashcards: flashcardRows,
    questionTrace,
  };
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");

  const md = [
    `# Rationale Enrichment Batch`,
    ``,
    `- Batch: ${batchLabel}`,
    `- Max items: ${args.maxItems}`,
    `- Pathway filter: ${args.pathwayId ?? "none"}`,
    `- Questions sampled: ${questionRows.length}`,
    `- Flashcards sampled: ${flashcardRows.length}`,
    `- Question candidates matched: ${questionBreakdown.candidateQuestionsMatched}`,
    `- Question applied: ${questionBreakdown.candidatesSuccessfullyApplied}`,
    `- Question eligible dry-run: ${questionBreakdown.eligibleDryRun}`,
    ``,
    `## Notes`,
    `- This report is deterministic and source-anchored.`,
    `- Items with weak source anchors are marked with a skip reason.`,
    `- Distractor fallbacks stay explicit when option-level rationale is unavailable.`,
    ``,
  ].join("\n");
  writeFileSync(mdPath, md, "utf8");

  console.log(JSON.stringify({ ok: true, batch: batchLabel, questionCount: questionRows.length, flashcardCount: flashcardRows.length, jsonPath, mdPath }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
