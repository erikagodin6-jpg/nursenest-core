/**
 * 🔒 Prisma Query Standards
 *
 * Enforced limits and helpers to prevent unbounded queries and
 * ensure predictable performance under load.
 *
 * All learner-facing queries MUST use these standards.
 */

/**
 * Standard pagination sizes
 */
export const STANDARD_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const SMALL_PAGE_SIZE = 10;
export const LARGE_PAGE_SIZE = 50;

/**
 * Include depth limits
 */
export const MAX_INCLUDE_DEPTH = 2;
export const SAFE_INCLUDE_DEPTH = 1;

/**
 * Query timeout standards (milliseconds)
 */
export const PUBLIC_ROUTE_TIMEOUT_MS = 3000;
export const LEARNER_QUERY_TIMEOUT_MS = 5000;
export const OPTIONAL_SYSTEM_TIMEOUT_MS = 2000;
export const ADMIN_QUERY_TIMEOUT_MS = 10000;

/**
 * Payload size limits (bytes)
 */
export const MAX_SERIALIZED_PROPS_KB = 50;
export const MAX_JSON_PAYLOAD_KB = 100;

/**
 * Safe query wrapper with automatic take enforcement
 */
export function enforceTakeLimit<T extends { take?: number }>(
  query: T,
  defaultTake: number = STANDARD_PAGE_SIZE
): T & { take: number } {
  const take = query.take ?? defaultTake;
  
  if (take > MAX_PAGE_SIZE) {
    console.warn(
      `Query take (${take}) exceeds MAX_PAGE_SIZE (${MAX_PAGE_SIZE}), clamping`
    );
  }
  
  return {
    ...query,
    take: Math.min(take, MAX_PAGE_SIZE),
  };
}

/**
 * Cursor pagination helper
 */
export interface CursorPaginationInput {
  cursor?: string;
  take?: number;
}

export interface CursorPaginationQuery {
  take: number;
  skip?: number;
  cursor?: { id: string };
}

export function buildCursorPagination(
  input: CursorPaginationInput
): CursorPaginationQuery {
  const take = Math.min(input.take ?? STANDARD_PAGE_SIZE, MAX_PAGE_SIZE);
  
  if (input.cursor) {
    return {
      take,
      skip: 1, // Skip the cursor itself
      cursor: { id: input.cursor },
    };
  }
  
  return { take };
}

/**
 * Validate include depth
 */
export function validateIncludeDepth(include: unknown, maxDepth: number = MAX_INCLUDE_DEPTH): void {
  const depth = calculateIncludeDepth(include);
  
  if (depth > maxDepth) {
    throw new Error(
      `Include depth (${depth}) exceeds maximum (${maxDepth}). ` +
      `Consider splitting into multiple queries or using select.`
    );
  }
}

function calculateIncludeDepth(obj: unknown, currentDepth: number = 0): number {
  if (!obj || typeof obj !== "object") {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object" && "include" in value) {
      const nestedDepth = calculateIncludeDepth(
        (value as { include: unknown }).include,
        currentDepth + 1
      );
      maxDepth = Math.max(maxDepth, nestedDepth);
    }
  }
  
  return maxDepth;
}

/**
 * Standard learner query limits
 */
export const LEARNER_QUERY_LIMITS = {
  questions: STANDARD_PAGE_SIZE,
  flashcards: STANDARD_PAGE_SIZE,
  lessons: LARGE_PAGE_SIZE,
  practiceTests: SMALL_PAGE_SIZE,
  sessions: STANDARD_PAGE_SIZE,
  progress: LARGE_PAGE_SIZE,
} as const;

/**
 * Standard public query limits
 */
export const PUBLIC_QUERY_LIMITS = {
  blogPosts: STANDARD_PAGE_SIZE,
  pathways: LARGE_PAGE_SIZE,
  lessons: STANDARD_PAGE_SIZE,
  flashcards: STANDARD_PAGE_SIZE,
  searchResults: STANDARD_PAGE_SIZE,
} as const;
