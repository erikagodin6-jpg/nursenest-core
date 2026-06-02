/**
 * SATA malformed-card audit script.
 *
 * Detects flashcards where:
 *   1. examItemKind = SATA but no valid correctLetters (plural) can be resolved
 *   2. canonicalOptions exist but correctCount < 2 (MCQ stored as SATA kind)
 *   3. JSON answerOptions have > 1 matching correctAnswer letter (SATA stored under MCQ kind)
 *   4. Distractor rationale missing or stub for any published SATA option
 *   5. Duplicate optionKeys in canonical rows for the same card
 *
 * Usage:
 *   npx tsx scripts/audit-sata-malformed.ts [--fix-kind] [--limit 1000]
 *
 * Flags:
 *   --fix-kind   Auto-correct examItemKind (MCQ→SATA or SATA→MCQ) when safe
 *   --limit N    Max cards to inspect (default 2000)
 */

import { PrismaClient, ContentStatus } from "@prisma/client";
import {
  normalizeLegacyAnswerPayload,
  validateCanonicalOptions,
  fromDbRows,
} from "../src/lib/flashcards/flashcard-option-normalize";
import type { FlashcardOptionRow } from "../src/lib/flashcards/flashcard-option-normalize";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const fixKind = args.includes("--fix-kind");
const limitArg = Number(args[args.indexOf("--limit") + 1] ?? "2000");
const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : 2000;

type AuditIssue = {
  cardId: string;
  tier: string;
  examItemKind: string | null;
  issues: string[];
  suggestedKind?: string | null;
};

async function main() {
  console.log(`\nSATA Malformed Card Audit`);
  console.log(`=========================`);
  console.log(`Fix-kind: ${fixKind ? "ENABLED" : "disabled"} | Limit: ${limit}\n`);

  const cards = await prisma.flashcard.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      examItemKind: { not: null },
    },
    select: {
      id: true,
      tier: true,
      examItemKind: true,
      questionStem: true,
      answerOptions: true,
      correctAnswer: true,
      rationaleCorrect: true,
      rationaleIncorrect: true,
      options: {
        select: {
          id: true,
          optionKey: true,
          content: true,
          isCorrect: true,
          rationale: true,
          displayOrder: true,
          selectCount: true,
          correctSelectCount: true,
        },
        orderBy: { displayOrder: "asc" },
      },
    },
    take: limit,
  });

  console.log(`Auditing ${cards.length} exam-style flashcards...\n`);

  const issues: AuditIssue[] = [];

  for (const card of cards) {
    const cardIssues: string[] = [];
    let suggestedKind: string | null = null;

    const hasCanonical = card.options.length >= 3;
    let canonicalOpts = hasCanonical ? fromDbRows(card.options as FlashcardOptionRow[]) : null;
    let jsonOpts = null;

    if (!hasCanonical) {
      jsonOpts = normalizeLegacyAnswerPayload({
        answerOptions: card.answerOptions,
        correctAnswer: card.correctAnswer,
        rationaleIncorrect: card.rationaleIncorrect,
      });
    }

    const workingOpts = canonicalOpts ?? jsonOpts;

    if (!workingOpts) {
      cardIssues.push("no_parseable_options");
    } else {
      const validation = validateCanonicalOptions(workingOpts);
      const correctCount = workingOpts.filter((o) => o.isCorrect).length;

      if (!validation.ok) {
        cardIssues.push(`validation_failed:${validation.code}`);
      }

      // Kind mismatch
      if (card.examItemKind === "SATA" && correctCount === 1) {
        cardIssues.push("sata_kind_but_one_correct_option");
        suggestedKind = "CLINICAL";
      } else if (card.examItemKind !== "SATA" && correctCount > 1) {
        cardIssues.push(`mcq_kind_but_${correctCount}_correct_options`);
        suggestedKind = "SATA";
      }

      // Missing SATA distractor rationale
      if (card.examItemKind === "SATA" || correctCount > 1) {
        const wrongMissingRationale = workingOpts.filter(
          (o) => !o.isCorrect && (!o.rationale || o.rationale.trim().length < 16),
        );
        if (wrongMissingRationale.length > 0) {
          cardIssues.push(`missing_distractor_rationale:${wrongMissingRationale.map((o) => o.optionKey).join(",")}`);
        }
      }

      // Duplicate option keys in canonical rows
      if (hasCanonical) {
        const keys = card.options.map((o) => o.optionKey);
        const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
        if (dupKeys.length > 0) {
          cardIssues.push(`duplicate_canonical_keys:${[...new Set(dupKeys)].join(",")}`);
        }
      }
    }

    if (cardIssues.length > 0) {
      issues.push({ cardId: card.id, tier: card.tier, examItemKind: card.examItemKind, issues: cardIssues, suggestedKind });
    }
  }

  console.log(`✅ Clean: ${cards.length - issues.length} / ${cards.length}`);
  console.log(`⚠️  Issues: ${issues.length} / ${cards.length}\n`);

  // Issue breakdown
  const issueCounts: Record<string, number> = {};
  for (const r of issues) {
    for (const issue of r.issues) {
      issueCounts[issue] = (issueCounts[issue] ?? 0) + 1;
    }
  }
  if (Object.keys(issueCounts).length > 0) {
    console.log("Issue breakdown:");
    for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${issue.padEnd(55)} ${count}`);
    }
    console.log("");
  }

  // First 20 cards with issues
  if (issues.length > 0) {
    console.log("Cards with issues (first 20):");
    for (const r of issues.slice(0, 20)) {
      console.log(`  [${r.cardId.slice(0, 12)}] ${r.tier} kind=${r.examItemKind}${r.suggestedKind ? ` → suggest:${r.suggestedKind}` : ""}`);
      console.log(`    → ${r.issues.join(", ")}`);
    }
    if (issues.length > 20) console.log(`  ... and ${issues.length - 20} more.\n`);
  }

  // Auto-fix kind when --fix-kind flag is set
  if (fixKind) {
    const fixable = issues.filter((r) => r.suggestedKind);
    console.log(`\nAuto-fixing examItemKind for ${fixable.length} card(s)...`);
    for (const r of fixable) {
      try {
        await prisma.flashcard.update({
          where: { id: r.cardId },
          data: { examItemKind: r.suggestedKind as never },
        });
        console.log(`  FIXED [${r.cardId.slice(0, 12)}] ${r.examItemKind} → ${r.suggestedKind}`);
      } catch (e) {
        console.error(`  FAIL  [${r.cardId.slice(0, 12)}] — ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  const exitCode = issues.length > 0 ? 1 : 0;
  console.log(`\n${exitCode === 0 ? "✅ Audit passed.\n" : `❌ Audit found ${issues.length} issue(s).\n`}`);
  await prisma.$disconnect();
  process.exit(exitCode);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
