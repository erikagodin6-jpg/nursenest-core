/**
 * PHASE 1 — Source-of-truth audit: legacy client flashcard TS files + optional DB counts.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/run-legacy-flashcard-questionbank-full-audit.mts
 *
 * Writes:
 * - data/audit/legacy-flashcard-questionbank-source-audit.json
 * - data/audit/legacy-flashcard-questionbank-source-audit.md
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { extractLegacyFlashcardExports } from "../legacy/legacy-flashcard-ts-extract.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(PKG_ROOT, "..");
const CLIENT_DATA = join(REPO_ROOT, "client", "src", "data");
const OUT_JSON = join(REPO_ROOT, "data", "audit", "legacy-flashcard-questionbank-source-audit.json");
const OUT_MD = join(REPO_ROOT, "data", "audit", "legacy-flashcard-questionbank-source-audit.md");

function inferTierFromFileName(base: string): { tier: string; examFamilyHint: string } {
  const b = base.toLowerCase();
  if (b.includes("rpn") || b.includes("pn") && !b.includes("np")) return { tier: "PN/RPN/LVN_LPN", examFamilyHint: "NCLEX_PN / REX_PN" };
  if (b.includes("np")) return { tier: "NP", examFamilyHint: "NP" };
  if (b.includes("rn") || b.includes("community") || b.includes("icu") || b.includes("labor") || b.includes("postpartum") || b.includes("public"))
    return { tier: "RN", examFamilyHint: "NCLEX_RN" };
  return { tier: "RN", examFamilyHint: "NCLEX_RN (default)" };
}

async function prismaCounts(): Promise<{
  flashcardDecks: number | null;
  flashcards: number;
  examQuestionsPublished: number | null;
  dbError: string | null;
}> {
  try {
    if (!process.env.DATABASE_URL) {
      return { flashcardDecks: null, flashcards: 0, examQuestionsPublished: null, dbError: "DATABASE_URL not set" };
    }
    const { PrismaClient, ContentStatus } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const [decks, cards, questions] = await Promise.all([
        prisma.flashcardDeck.count(),
        prisma.flashcard.count(),
        prisma.examQuestion.count({ where: { status: ContentStatus.PUBLISHED } }),
      ]);
      return { flashcardDecks: decks, flashcards: cards, examQuestionsPublished: questions, dbError: null };
    } finally {
      await prisma.$disconnect();
    }
  } catch (e) {
    return {
      flashcardDecks: null,
      flashcards: 0,
      examQuestionsPublished: null,
      dbError: e instanceof Error ? e.message : String(e),
    };
  }
}

async function main() {
  const flashcardFiles = existsSync(CLIENT_DATA)
    ? readdirSync(CLIENT_DATA).filter((f) => f.startsWith("flashcards") && f.endsWith(".ts"))
    : [];

  const perFile: Array<{
    file: string;
    exportBlocks: number;
    cardCount: number;
    tierGuess: string;
    examFamilyHint: string;
    parseError?: string;
  }> = [];

  let legacyFlashcardTotal = 0;
  let legacyDeckFiles = 0;

  for (const f of flashcardFiles.sort()) {
    const fp = join(CLIENT_DATA, f);
    let text: string;
    try {
      text = readFileSync(fp, "utf8");
    } catch (e) {
      perFile.push({
        file: f,
        exportBlocks: 0,
        cardCount: 0,
        tierGuess: "?",
        examFamilyHint: "?",
        parseError: e instanceof Error ? e.message : String(e),
      });
      continue;
    }
    try {
      const blocks = extractLegacyFlashcardExports(text, f);
      const cardCount = blocks.reduce((n, b) => n + b.cards.length, 0);
      const { tier, examFamilyHint } = inferTierFromFileName(f.replace(/\.ts$/, ""));
      if (cardCount > 0) legacyDeckFiles += 1;
      legacyFlashcardTotal += cardCount;
      perFile.push({
        file: f,
        exportBlocks: blocks.length,
        cardCount,
        tierGuess: tier,
        examFamilyHint,
      });
    } catch (e) {
      perFile.push({
        file: f,
        exportBlocks: 0,
        cardCount: 0,
        tierGuess: "?",
        examFamilyHint: "?",
        parseError: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const db = await prismaCounts();
  const payload = {
      generatedAt: new Date().toISOString(),
      methodology:
        "Legacy: TypeScript AST parse of `client/src/data/flashcards*.ts` exported arrays. DB: Prisma counts when DATABASE_URL is available.",
      paths: { clientData: CLIENT_DATA, repoRoot: REPO_ROOT },
      totals: {
        legacyFlashcardSourceFiles: flashcardFiles.length,
        legacyFlashcardExportsParsed: legacyDeckFiles,
        legacyFlashcardCardsExact: legacyFlashcardTotal,
        note: "One export file ≈ one logical deck group in legacy monolith; multiple `export const` arrays in a file are merged for counting.",
      },
      database: db,
      perFile,
      gapAnalysis: {
        legacyCardsInTs: legacyFlashcardTotal,
        importedToDbDependOnRun:
          "Run import-legacy-client-flashcards.mts with DATABASE_URL, then re-run this audit or validation report.",
      },
    };

    mkdirSync(dirname(OUT_JSON), { recursive: true });
    writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

    const md = [
      `# Legacy flashcard & question-bank source audit`,
      ``,
      `Generated: ${payload.generatedAt}`,
      ``,
      `## Totals (legacy TypeScript sources)`,
      ``,
      `| Metric | Value |`,
      `|--------|------:|`,
      `| Legacy flashcard TS files | ${flashcardFiles.length} |`,
      `| Files with ≥1 parsed card | ${legacyDeckFiles} |`,
      `| **Total flashcard cards (AST count)** | **${legacyFlashcardTotal}** |`,
      ``,
      `## Database (current environment)`,
      ``,
      db.dbError
        ? `Could not query DB: ${db.dbError}`
        : `| Flashcard decks | ${db.flashcardDecks ?? "n/a"} |`,
      db.dbError ? "" : `| Flashcards | ${db.flashcards} |`,
      db.dbError ? "" : `| Published exam_questions | ${db.examQuestionsPublished ?? "n/a"} |`,
      ``,
      `## Per-file`,
      ``,
      `| File | Cards | Tier (guess) |`,
      `|------|------:|--------------|`,
      ...perFile.map((r) => `| ${r.file} | ${r.cardCount} | ${r.tierGuess} |`),
      ``,
      `Question bank items in legacy repo also live in hundreds of \`career-questions/*\` and \`advanced-questions/*\` TS modules — use \`data/audit/legacy-questions-inventory.json\` for file-level inventory; full AST count is run in a separate job due to volume.`,
      ``,
    ].join("\n");

    writeFileSync(OUT_MD, md);
    console.log(`Wrote ${OUT_JSON}`);
    console.log(`Wrote ${OUT_MD}`);
  console.log(`Legacy flashcard cards (exact AST): ${legacyFlashcardTotal}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
