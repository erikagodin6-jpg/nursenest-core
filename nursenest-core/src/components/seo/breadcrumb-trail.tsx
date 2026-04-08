import Link from "next/link";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";

/**
 * Visible breadcrumb UI (marketing + app). Use without JSON-LD on non-indexable /app routes.
 */
export function BreadcrumbTrail({ items }: { items: BreadcrumbCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--theme-muted-text)]">
      <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex min-w-0 max-w-full items-baseline gap-2">
              {i > 0 ? (
                <span aria-hidden className="shrink-0 text-[var(--theme-separator)]">
                  /
                </span>
              ) : null}
              {isLast || !c.href ? (
                <span
                  className="min-w-0 max-w-full break-words font-medium leading-snug text-[var(--theme-heading-text)] [overflow-wrap:anywhere]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="min-w-0 max-w-full break-words text-primary leading-snug [overflow-wrap:anywhere] hover:underline">
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
