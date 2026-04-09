import Link from "next/link";

type Props = {
  /** Pathname for this hub (no query string). */
  basePath: string;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  /** Preserved on prev/next (e.g. hub search). */
  hubSearch?: string;
  /** App lessons list: preserve topic filters. */
  topic?: string;
  topicSlug?: string;
};

function hubQuery(page: number, hubSearch?: string, topic?: string, topicSlug?: string): string {
  const qs = new URLSearchParams();
  if (page > 1) qs.set("page", String(page));
  if (hubSearch && hubSearch.length > 0) qs.set("q", hubSearch);
  const ts = topicSlug?.trim().toLowerCase();
  if (ts) qs.set("topicSlug", ts);
  else if (topic?.trim()) qs.set("topic", topic.trim());
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/**
 * Server-rendered prev/next for pathway lesson lists. Keeps each page bounded (no infinite scroll of huge sets).
 */
export function PathwayLessonPagination({ basePath, page, pageCount, total, pageSize, hubSearch, topic, topicSlug }: Props) {
  if (pageCount <= 1) return null;
  const href = (p: number) => `${basePath}${hubQuery(p, hubSearch, topic, topicSlug)}`;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav
      className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--border-subtle)_90%,var(--theme-primary))] pt-8 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
      aria-label="Lesson list pages"
    >
      <p className="text-[var(--theme-muted-text)]">
        Showing <span className="font-medium text-[var(--theme-heading-text)]">{from}</span>–
        <span className="font-medium text-[var(--theme-heading-text)]">{to}</span> of{" "}
        <span className="font-medium text-[var(--theme-heading-text)]">{total}</span> lessons
      </p>
      <div className="flex flex-wrap gap-2">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold"
          >
            Previous
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link
            href={href(page + 1)}
            className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
