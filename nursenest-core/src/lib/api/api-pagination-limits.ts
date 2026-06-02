/**
 * Central pagination and depth limits for list APIs (questions use {@link MAX_QUESTION_PAGE_SIZE} in question-api-limits).
 * Prevents unbounded skip scans and keeps payloads predictable.
 */

/** Hard ceiling for REST list `pageSize` / `take` (subscriber APIs, admin JSON lists, defense-in-depth). */
export const API_LIST_PAGE_SIZE_HARD_MAX = 50;

/** Align with {@link MAX_QUESTION_LIST_SKIP_ROWS} in `/api/questions` (deep pagination abuse). */
export const MAX_LIST_SKIP_ROWS_DEFAULT = 4_000;

export const LESSON_PAGE = {
  min: 5,
  max: 36,
  default: 12,
} as const;

/** GET `/api/lessons` offset mode: `limit` or `pageSize` (reject above max with 400). */
export const LESSON_API_OFFSET_LIMIT = {
  min: 1,
  max: API_LIST_PAGE_SIZE_HARD_MAX,
  default: 20,
} as const;

/** `/app/lessons` `limit` query — aligned with {@link LESSON_API_OFFSET_LIMIT}. */
export function parseLessonLibraryLimit(raw: string | null | undefined): number {
  if (raw == null || raw === "") return LESSON_API_OFFSET_LIMIT.default;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return LESSON_API_OFFSET_LIMIT.default;
  return Math.min(LESSON_API_OFFSET_LIMIT.max, Math.max(LESSON_API_OFFSET_LIMIT.min, n));
}

export const FLASHCARD_PAGE = {
  min: 5,
  max: 30,
  default: 12,
} as const;

/** Deck list API: default 20, capped at {@link API_LIST_PAGE_SIZE_HARD_MAX}. */
export const FLASHCARD_DECK_PAGE = {
  min: 6,
  max: API_LIST_PAGE_SIZE_HARD_MAX,
  default: 20,
} as const;

/** Admin GET list endpoints (`/api/admin/questions`, `/api/admin/lessons`, …) — same hard max as public list APIs. */
export const ADMIN_API_LIST_PAGE = {
  min: 10,
  max: API_LIST_PAGE_SIZE_HARD_MAX,
  default: 25,
} as const;

export type PageSizeParseError = {
  code: "invalid_page_size" | "page_size_limit";
  message: string;
  maxPageSize?: number;
};

/**
 * Parse `page` (1-based, integer).
 */
export function parseListPage(raw: string | null): { ok: true; page: number } | { ok: false; error: string } {
  const n = Number(raw ?? "1");
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
    return { ok: false, error: "page must be a positive integer" };
  }
  return { ok: true, page: n };
}

/**
 * Parse bounded pageSize (or similar list limit) with explicit 400-ready errors (matches `/api/questions` behavior).
 * @param paramName — used in error messages (e.g. `"take"` for background jobs).
 */
export function parseBoundedPageSize(
  raw: string | null,
  opts: { min: number; max: number; default: number },
  paramName: string = "pageSize",
): { ok: true; pageSize: number } | { ok: false; error: PageSizeParseError } {
  const pageSizeParsed = raw === null || raw === "" ? opts.default : Number(raw);
  if (!Number.isFinite(pageSizeParsed) || !Number.isInteger(pageSizeParsed)) {
    return {
      ok: false,
      error: { code: "invalid_page_size", message: `${paramName} must be an integer` },
    };
  }
  if (pageSizeParsed < opts.min || pageSizeParsed > opts.max) {
    return {
      ok: false,
      error: {
        code: "page_size_limit",
        message: `${paramName} must be between ${opts.min} and ${opts.max}.`,
        maxPageSize: opts.max,
      },
    };
  }
  return { ok: true, pageSize: pageSizeParsed };
}

export function listSkipRows(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export function isSkipBeyondLimit(skipRows: number, maxSkipRows: number = MAX_LIST_SKIP_ROWS_DEFAULT): boolean {
  return skipRows > maxSkipRows;
}

/**
 * Largest valid 1-based `page` for offset pagination so `(page - 1) * pageSize <= maxSkipRows`.
 * Keeps list endpoints and Prisma `skip` in a bounded range as catalogs grow toward 500+ rows.
 */
export function maxSafeOffsetPage(pageSize: number, maxSkipRows: number = MAX_LIST_SKIP_ROWS_DEFAULT): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) return 1;
  return Math.max(1, Math.floor(maxSkipRows / pageSize) + 1);
}
