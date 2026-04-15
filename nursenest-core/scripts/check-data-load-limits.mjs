#!/usr/bin/env node
/**
 * CI helper: verifies documented hard caps for learner list APIs.
 * See `src/lib/server/pagination.ts` and `api-pagination-limits.ts`.
 */
import { readFileSync } from "fs";
import { join } from "path";

try {
  const limits = readFileSync(join(process.cwd(), "src", "lib", "api", "api-pagination-limits.ts"), "utf8");
  if (!/LESSON_API_OFFSET_LIMIT[\s\S]*?max:\s*100/.test(limits)) {
    console.error("[check-data-load-limits] LESSON_API_OFFSET_LIMIT.max must be 100");
    process.exit(1);
  }
  if (!/FLASHCARD_DECK_PAGE[\s\S]*?max:\s*100/.test(limits)) {
    console.error("[check-data-load-limits] FLASHCARD_DECK_PAGE.max must be 100");
    process.exit(1);
  }
  const qf = readFileSync(join(process.cwd(), "src", "lib", "questions", "question-api-limits.ts"), "utf8");
  if (!/MAX_QUESTION_PAGE_SIZE\s*=\s*50/.test(qf)) {
    console.error("[check-data-load-limits] MAX_QUESTION_PAGE_SIZE must remain 50");
    process.exit(1);
  }
  console.log("[check-data-load-limits] OK — list caps configured.");
} catch (e) {
  console.error("[check-data-load-limits]", e);
  process.exit(1);
}
