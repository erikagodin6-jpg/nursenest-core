/**
 * Unified RN + RPN/PN lesson clinical expansion (shared contract + validators).
 *
 * Run from nursenest-core:
 *   npx tsx scripts/lesson-ai-expand-lessons.ts [--tier rn|rpn|rn,rpn] [--dry-run] [--slug SLUG] [--limit N] [--force]
 *
 * Defaults: both RN and RPN/PN tiers when `--tier` is omitted.
 * Model: LESSON_OPENAI_MODEL → AI_INTEGRATIONS_OPENAI_MODEL → gpt-4.1-mini (see getLessonOpenAiChatModel).
 */
import { runLessonAiExpandMain } from "@/lib/lessons/lesson-ai-expand-runner";

void runLessonAiExpandMain(process.argv.slice(2), { defaultTiers: new Set(["rn", "rpn"]) });
