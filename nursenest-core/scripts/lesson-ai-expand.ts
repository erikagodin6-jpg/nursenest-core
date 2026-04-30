#!/usr/bin/env npx tsx
/**
 * Unified lesson AI expansion entry (RN, RPN/PN, NP).
 *
 * Examples:
 *   npx tsx scripts/lesson-ai-expand.ts
 *   npx tsx scripts/lesson-ai-expand.ts --tier np --legacy-first --dry-run --limit 5
 *   npx tsx scripts/lesson-ai-expand.ts --tier rn,rpn,np --slug some-lesson-slug
 *
 * NP (`ca-np-cnple`) lessons are read/written from `src/content/lessons/lesson-library.json`.
 */
import { runLessonAiExpandMain } from "@/lib/lessons/lesson-ai-expand-runner";

void runLessonAiExpandMain(process.argv.slice(2), { defaultTiers: new Set(["rn", "rpn"]) });
