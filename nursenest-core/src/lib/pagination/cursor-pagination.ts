/**
 * Cursor-based pagination utilities for Phase 4: Learner Delivery Hardening
 * 
 * Provides consistent, bounded pagination across all learner surfaces.
 * Prevents unbounded queries and enables efficient large result set handling.
 */

/**
 * Cursor pagination parameters
 */
export interface CursorPaginationParams {
  /** Cursor for next page (opaque string) */
  cursor?: string;
  /** Number of items per page (max 100) */
  limit: number;
  /** Sort direction */
  direction?: 'asc' | 'desc';
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  /** Items for current page */
  items: T[];
  /** Cursor for next page (null if no more pages) */
  nextCursor: string | null;
  /** Cursor for previous page (null if first page) */
  prevCursor: string | null;
  /** Total count (optional, expensive to compute) */
  totalCount?: number;
  /** Whether there are more items */
  hasMore: boolean;
}

/**
 * Maximum items per page (hard limit)
 */
export const MAX_PAGE_SIZE = 100;

/**
 * Default page size
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Validate and normalize pagination params
 */
export function normalizePaginationParams(
  params: Partial<CursorPaginationParams>
): CursorPaginationParams {
  const limit = Math.min(
    Math.max(1, params.limit || DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  return {
    cursor: params.cursor,
    limit,
    direction: params.direction || 'desc'
  };
}

/**
 * Encode cursor (base64 JSON)
 */
export function encodeCursor(data: Record<string, any>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * Decode cursor
 */
export function decodeCursor(cursor: string): Record<string, any> | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

/**
 * Apply cursor pagination to Prisma query
 * 
 * Example usage:
 * ```typescript
 * const result = await paginateQuery(
 *   prisma.flashcard,
 *   { cursor: req.query.cursor, limit: 20 },
 *   { where: { userId }, orderBy: { createdAt: 'desc' } }
 * );
 * ```
 */
export async function paginateQuery<T extends { id: string }>(
  model: any, // Prisma model delegate
  params: CursorPaginationParams,
  query: {
    where?: any;
    orderBy?: any;
    select?: any;
    include?: any;
  }
): Promise<PaginatedResult<T>> {
  const { cursor, limit, direction } = normalizePaginationParams(params);
  
  // Decode cursor if provided
  const cursorData = cursor ? decodeCursor(cursor) : null;
  
  // Build Prisma query
  const prismaQuery: any = {
    ...query,
    take: limit + 1, // Fetch one extra to check if there are more
    orderBy: query.orderBy || { createdAt: direction }
  };
  
  // Add cursor if provided
  if (cursorData?.id) {
    prismaQuery.cursor = { id: cursorData.id };
    prismaQuery.skip = 1; // Skip the cursor item itself
  }
  
  // Execute query
  const items = await model.findMany(prismaQuery);
  
  // Check if there are more items
  const hasMore = items.length > limit;
  const resultItems = hasMore ? items.slice(0, limit) : items;
  
  // Generate next cursor
  const nextCursor = hasMore && resultItems.length > 0
    ? encodeCursor({ id: resultItems[resultItems.length - 1].id })
    : null;
  
  // Generate previous cursor (simplified - in production, track both directions)
  const prevCursor = cursorData?.id ? encodeCursor({ id: resultItems[0]?.id }) : null;
  
  return {
    items: resultItems as T[],
    nextCursor,
    prevCursor,
    hasMore,
  };
}

/**
 * Paginate array (for in-memory data)
 */
export function paginateArray<T>(
  items: T[],
  params: CursorPaginationParams
): PaginatedResult<T> {
  const { limit } = normalizePaginationParams(params);
  const { cursor } = params;
  
  // Simple offset-based pagination for arrays
  const offset = cursor ? parseInt(cursor, 10) : 0;
  const resultItems = items.slice(offset, offset + limit);
  const hasMore = offset + limit < items.length;
  
  return {
    items: resultItems,
    nextCursor: hasMore ? String(offset + limit) : null,
    prevCursor: offset > 0 ? String(Math.max(0, offset - limit)) : null,
    hasMore,
    totalCount: items.length
  };
}
