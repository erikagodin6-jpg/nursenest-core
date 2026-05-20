/**
 * RN-only entrypoint — forwards to shared nursing expansion with default tier `rn`.
 *
 * Run from nursenest-core:
 *   npx tsx scripts/rn-ai-expand-lessons.ts [--dry-run] [--slug SLUG] [--limit N] [--force]
 *   npx tsx scripts/rn-ai-expand-lessons.ts --tier rn,rpn …   # optional override
 *
 * Unified CLI (RN + RPN/PN defaults): `npx tsx scripts/lesson-ai-expand-lessons.ts` or `npm run expand:lessons`.
 */
import { runLessonAiExpandMain } from "@/lib/lessons/lesson-ai-expand-runner";

void runLessonAiExpandMain(process.argv.slice(2), { defaultTiers: new Set(["rn"]) });
