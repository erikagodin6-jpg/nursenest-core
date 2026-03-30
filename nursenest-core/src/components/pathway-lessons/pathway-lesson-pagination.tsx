import Link from "next/link";

type Props = {
  /** Pathname for this hub (no query string). */
  basePath: string;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
};

/**
 * Server-rendered prev/next for pathway lesson lists. Keeps each page bounded (no infinite scroll of huge sets).
 */
export function PathwayLessonPagination({ basePath, page, pageCount, total, pageSize }: Props) {
  if (pageCount <= 1) return null;
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
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
