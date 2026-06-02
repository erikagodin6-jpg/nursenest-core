/**
 * Flashcard content quality audit script.
 *
 * Checks all PUBLISHED flashcards for:
 *   - placeholder text (todo, lorem ipsum, etc.)
 *   - front/back too short
 *   - missing question stem when examItemKind is set
 *   - missing correct rationale
 *   - missing or stub distractor rationales
 *
 * Usage:
 *   npx tsx scripts/audit-flashcard-content-quality.ts [--tier RN] [--limit 500]
 *
 * Outputs a summary table and exits 1 if any cards have issues.
 */

import { PrismaClient, ContentStatus } from "@prisma/client";
import { auditPublishedCard } from "../src/lib/flashcards/flashcard-creation-guardrails";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const tierFilter = args[args.indexOf("--tier") + 1]?.toUpperCase() ?? null;
const limitArg = Number(args[args.indexOf("--limit") + 1] ?? "1000");
const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : 1000;

async function main() {
  console.log(`\nFlashcard Content Quality Audit`);
  console.log(`================================`);
  console.log(`Tier filter: ${tierFilter ?? "ALL"} | Limit: ${limit}\n`);

  const rows = await prisma.flashcard.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      ...(tierFilter ? { tier: tierFilter as never } : {}),
    },
    select: {
      id: true,
      front: true,
      back: true,
      examItemKind: true,
      questionStem: true,
      rationaleCorrect: true,
      rationaleIncorrect: true,
      tier: true,
      country: true,
      category: { select: { name: true } },
      deck: { select: { slug: true } },
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });

  console.log(`Auditing ${rows.length} published flashcards...\n`);

  type IssueRow = {
    cardId: string;
    tier: string;
    deckSlug: string;
    category: string;
    issues: string[];
  };

  const withIssues: IssueRow[] = [];
  const issueCounts: Record<string, number> = {};

  for (const row of rows) {
    const result = auditPublishedCard({
      id: row.id,
      front: row.front,
      back: row.back,
      examItemKind: row.examItemKind,
      questionStem: row.questionStem,
      rationaleCorrect: row.rationaleCorrect,
      rationaleIncorrect: row.rationaleIncorrect as unknown,
    });

    if (result.issues.length > 0) {
      withIssues.push({
        cardId: row.id,
        tier: row.tier,
        deckSlug: row.deck?.slug ?? "(no deck)",
        category: row.category.name,
        issues: result.issues,
      });
      for (const issue of result.issues) {
        issueCounts[issue] = (issueCounts[issue] ?? 0) + 1;
      }
    }
  }

  const cleanCount = rows.length - withIssues.length;
  console.log(`✅ Clean: ${cleanCount} / ${rows.length}`);
  console.log(`⚠️  Issues: ${withIssues.length} / ${rows.length}\n`);

  if (Object.keys(issueCounts).length > 0) {
    console.log("Issue breakdown:");
    for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${issue.padEnd(45)} ${count}`);
    }
    console.log("");
  }

  if (withIssues.length > 0) {
    console.log("Cards with issues (first 30):");
    for (const row of withIssues.slice(0, 30)) {
      console.log(`  [${row.cardId.slice(0, 12)}] ${row.tier} | ${row.deckSlug} | ${row.category}`);
      console.log(`    → ${row.issues.join(", ")}`);
    }
    if (withIssues.length > 30) {
      console.log(`  ... and ${withIssues.length - 30} more.\n`);
    }
    console.log("");
  }

  const exitCode = withIssues.length > 0 ? 1 : 0;
  console.log(exitCode === 0 ? "✅ Audit passed — no quality issues found.\n" : `❌ Audit failed — ${withIssues.length} card(s) need attention.\n`);
  await prisma.$disconnect();
  process.exit(exitCode);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
