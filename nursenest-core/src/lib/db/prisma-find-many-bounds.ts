/**
 * Defense-in-depth caps for {@link PrismaClient} `findMany` — every list read should set `take`
 * (or use chunked `take` with `id: { in: chunk }`) so a bug or hostile input cannot scan the full table.
 *
 * @see nn-db-final-003
 */
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";

/** Same ceiling as public list APIs — admin `pageSize` / `limit` should stay ≤ this. */
export const PRISMA_ADMIN_LIST_TAKE_MAX = API_LIST_PAGE_SIZE_HARD_MAX;

/** Chunk size for `id: { in: [...] }` hydration (questions, flashcards, etc.). */
export const PRISMA_ID_IN_CHUNK_SIZE = 200;

/** Large internal batches (reconcile, cron) — still bounded; prefer paging for new code. */
export const PRISMA_INTERNAL_BATCH_MAX = 2_000;

/** Hard ceiling for any single `take` when resolving `in`-clause lists (defense if caller passes huge arrays). */
export const PRISMA_FIND_MANY_ABSOLUTE_MAX = 10_000;

/**
 * Flashcard study queue: max cards indexed per deck in one request (orders by position).
 * Decks larger than this are truncated for queue-building — avoids O(n) memory blowups.
 */
export const PRISMA_FLASHCARD_DECK_INDEX_MAX = 10_000;

/**
 * Safe `take` for `where: { id: { in: ids } }` — never exceeds array length or absolute max.
 */
export function takeForIdIn(ids: readonly unknown[], explicitCap = PRISMA_FIND_MANY_ABSOLUTE_MAX): number {
  return Math.min(ids.length, explicitCap);
}
