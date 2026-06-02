import type { ParsedQs } from "qs";

/** Default page when missing or invalid (1-based). */
export const DEFAULT_ADMIN_PAGE = 1;
/** Default page size when missing or invalid. */
export const DEFAULT_ADMIN_LIMIT = 20;
/** Hard cap for admin list endpoints. */
export const MAX_ADMIN_LIMIT = 100;

export interface AdminPaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface AdminPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const raw =
    typeof value === "string"
      ? Number.parseInt(value, 10)
      : typeof value === "number"
        ? Math.trunc(value)
        : Number.NaN;
  if (!Number.isFinite(raw) || raw < 1) return fallback;
  return raw;
}

/**
 * Parse `page` / `limit` from query string. Invalid values coerce to defaults; limit is capped at MAX_ADMIN_LIMIT.
 */
export function parseAdminPaginationParams(query: ParsedQs): AdminPaginationParams {
  const page = parsePositiveInt(query.page, DEFAULT_ADMIN_PAGE);
  const limitUncapped = parsePositiveInt(query.limit, DEFAULT_ADMIN_LIMIT);
  const limit = Math.min(limitUncapped, MAX_ADMIN_LIMIT);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildAdminPaginationMeta(
  page: number,
  limit: number,
  total: number,
): AdminPaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, total, totalPages };
}
