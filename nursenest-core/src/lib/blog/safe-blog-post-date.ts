/** Fallback when CMS/static rows lack a valid publish date (avoids Invalid Date throws in cards). */
export const BLOG_POST_FALLBACK_CREATED_AT = new Date("2020-01-01T12:00:00.000Z");

export function parseBlogPostCreatedAt(value: string | Date | null | undefined): Date {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? BLOG_POST_FALLBACK_CREATED_AT : value;
  }
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return BLOG_POST_FALLBACK_CREATED_AT;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00.000Z` : raw;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? BLOG_POST_FALLBACK_CREATED_AT : d;
}

export function blogPostCreatedAtIso(value: string | Date | null | undefined): string {
  return parseBlogPostCreatedAt(value).toISOString();
}
