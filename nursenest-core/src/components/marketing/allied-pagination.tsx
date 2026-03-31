import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  label?: string;
};

/** Generic marketing pagination (profession grid, etc.). */
export function AlliedMarketingPagination({ basePath, page, pageCount, total, pageSize, label = "items" }: Props) {
  if (pageCount <= 1) return null;
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm" aria-label="Pagination">
      <p className="text-[var(--theme-muted-text)]">
        Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> {label}
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
