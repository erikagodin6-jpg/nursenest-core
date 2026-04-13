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
};

function parseArgs(argv: string[]): Args {
  const out: Args = {
    maxItems: 25,
    includeFlashcards: true,
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const questions = await prisma.examQuestion.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      ...(args.pathwayId ? { pathwayId: args.pathwayId } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 4000,
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
      keyTakeaway: true,
      examStrategy: true,
      updatedAt: true,
    },
  });

  const questionRows = questions
    .map((q) => {
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
      return {
        id: q.id,
        topic: q.topic,
        subtopic: q.subtopic,
        updatedAt: q.updatedAt.toISOString(),
        batchId: enrichment.batchId,
        applied: enrichment.applied,
        whyCorrect: enrichment.whyCorrect,
        whyWrong: enrichment.whyWrong,
        clinicalPearl: enrichment.clinicalPearl,
        topicAnchor: enrichment.topicAnchor,
        skippedReason: enrichment.skippedReason ?? null,
        flags: [
          ...qualityFlags(enrichment.whyCorrect),
          ...qualityFlags(enrichment.clinicalPearl),
          ...(enrichment.whyWrong.includes("not available") ? ["honest_distractor_fallback"] : []),
        ],
      };
    })
    .filter((row) => (args.batch ? row.batchId === args.batch : row.batchId !== null))
    .slice(0, args.maxItems);

  let flashcardRows: Array<Record<string, unknown>> = [];
  if (args.includeFlashcards) {
    const flashcards = await prisma.flashcard.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(args.pathwayId ? { deck: { pathwayId: args.pathwayId } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 4000,
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
    questionCount: questionRows.length,
    flashcardCount: flashcardRows.length,
    questions: questionRows,
    flashcards: flashcardRows,
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
