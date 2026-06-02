import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient({ log: ["error"] });

// Check current indexes on exam_questions
const existing = await p.$queryRaw<{indexname: string}[]>`
  SELECT indexname FROM pg_indexes
  WHERE tablename = 'exam_questions'
  AND indexname LIKE '%cat%' OR indexname LIKE '%adaptive%' OR indexname LIKE '%pathway%'
` as {indexname: string}[];
console.log("Existing relevant indexes:", existing.map(r => r.indexname));

const hasCatIdx = existing.some(r => r.indexname === "exam_questions_cat_pool_idx");
if (hasCatIdx) {
  console.log("Index exam_questions_cat_pool_idx already exists — skipping creation.");
} else {
  console.log("Creating index exam_questions_cat_pool_idx...");
  // CREATE INDEX CONCURRENTLY cannot run inside a transaction; Prisma $executeRaw is fine here
  await p.$executeRawUnsafe(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS exam_questions_cat_pool_idx
    ON exam_questions (study_link_pathway_id, is_adaptive_eligible, status)
  `);
  console.log("Index created successfully.");
}

// Verify it exists now
const after = await p.$queryRaw<{indexname: string, indexdef: string}[]>`
  SELECT indexname, indexdef FROM pg_indexes
  WHERE tablename = 'exam_questions' AND indexname = 'exam_questions_cat_pool_idx'
` as {indexname: string, indexdef: string}[];
console.log("Post-creation verification:", JSON.stringify(after, null, 2));

await p.$disconnect();
