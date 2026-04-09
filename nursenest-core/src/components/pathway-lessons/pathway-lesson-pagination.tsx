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
    <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm" aria-label="Lesson list pages">
      <p className="text-[var(--theme-muted-text)]">
        Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> lessons
      </p>
      <div className="flex flex-wrap gap-2">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="rounded-md border border-[var(--theme-card-border)] bg-card px-3 py-1.5 font-medium text-foreground hover:border-primary/40"
          >
            Previous
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link
            href={href(page + 1)}
            className="rounded-md border border-[var(--theme-card-border)] bg-card px-3 py-1.5 font-medium text-foreground hover:border-primary/40"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
