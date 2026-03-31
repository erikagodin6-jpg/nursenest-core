#!/usr/bin/env npx tsx
/**
 * Verifies tables required by Replit import / allied pipelines (read-only).
 * Run: npx tsx scripts/verify-import-schema-tables.ts
 *   or: npm run db:verify-import-schema
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRaw<Array<{ relname: string }>>`
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname IN ('flashcard_decks', 'allied_blueprints', 'Flashcard', 'flashcard_bank', 'exam_questions')
    ORDER BY c.relname
  `;
  const found = new Set(rows.map((r) => r.relname));
  const required = ["flashcard_decks", "allied_blueprints", "Flashcard"] as const;
  const report = {
    note: "deck_flashcards.json imports into Prisma model Flashcard (table \"Flashcard\"), not a table named deck_flashcards.",
    tables_found: [...found].sort(),
    required_present: Object.fromEntries(required.map((t) => [t, found.has(t)])) as Record<
      (typeof required)[number],
      boolean
    >,
    all_required: required.every((t) => found.has(t)),
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.all_required) {
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
