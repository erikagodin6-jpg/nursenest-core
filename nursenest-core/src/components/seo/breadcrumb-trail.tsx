import Link from "next/link";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";

/**
 * Visible breadcrumb UI (marketing + app). Use without JSON-LD on non-indexable /app routes.
 */
export function BreadcrumbTrail({ items }: { items: BreadcrumbCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--theme-muted-text)]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex min-w-0 items-center gap-2">
              {i > 0 ? (
                <span aria-hidden className="shrink-0 text-[var(--theme-separator)]">
                  /
                </span>
              ) : null}
              {isLast || !c.href ? (
                <span className="truncate font-medium text-[var(--theme-heading-text)]" aria-current={isLast ? "page" : undefined}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="truncate text-primary hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
