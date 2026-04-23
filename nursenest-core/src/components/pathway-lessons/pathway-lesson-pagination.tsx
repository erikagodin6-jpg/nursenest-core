import Link from "next/link";
import { LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT } from "@/lib/lessons/pathway-lesson-scale";

type Props = {
  /** Pathname for this hub (no query string). */
  basePath: string;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  /**
   * When set, the "Showing from–to" range reflects how many rows actually rendered on this page
   * (avoids e.g. "25–30" when the list is empty due to prepare/guard drift).
   */
  lessonsOnPage?: number;
  /** Preserved on prev/next (e.g. hub search). */
  hubSearch?: string;
  /** App lessons list: preserve topic filters. */
  topic?: string;
  topicSlug?: string;
  /** Allied pathway hub: preserve profession filter. */
  alliedProfession?: string;
  /** App lessons: pathway filter. */
  pathwayId?: string;
  /** App lessons: page size (`limit` query); omit when equal to default. */
  limit?: number;
  /** App lessons: full-text filter. */
  q?: string;
};

function hubQuery(
  page: number,
  hubSearch: string | undefined,
  topic: string | undefined,
  topicSlug: string | undefined,
  alliedProfession: string | undefined,
  pathwayId: string | undefined,
  limit: number | undefined,
  q: string | undefined,
  defaultLimit: number,
): string {
  const qs = new URLSearchParams();
  if (page > 1) qs.set("page", String(page));
  const search = (q ?? hubSearch ?? "").trim();
  if (search.length > 0) qs.set("q", search);
  const ts = topicSlug?.trim().toLowerCase();
  if (ts) qs.set("topicSlug", ts);
  else if (topic?.trim()) qs.set("topic", topic.trim());
  const ap = alliedProfession?.trim().toLowerCase();
  if (ap) qs.set("alliedProfession", ap);
  if (pathwayId?.trim()) qs.set("pathwayId", pathwayId.trim());
  if (limit != null && limit !== defaultLimit) qs.set("limit", String(limit));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/** When &gt;10 pages, collapse middle with ellipses. */
function visiblePageNumbers(current: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= 10) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const set = new Set<number>();
  set.add(1);
  set.add(pageCount);
  for (let p = current - 2; p <= current + 2; p += 1) {
    if (p >= 1 && p <= pageCount) set.add(p);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
    out.push(sorted[i]);
  }
  return out;
}

/**
 * Server-rendered lesson list pagination: bounded pages, preserves hub/app filters.
 */
export function PathwayLessonPagination({
  basePath,
  page,
  pageCount,
  total,
  pageSize,
  lessonsOnPage,
  hubSearch,
  topic,
  topicSlug,
  alliedProfession,
  pathwayId,
  limit,
  q,
}: Props) {
  const defaultLimit = LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT;
  const href = (p: number) =>
    `${basePath}${hubQuery(p, hubSearch, topic, topicSlug, alliedProfession, pathwayId, limit, q, defaultLimit)}`;
  const nominalFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const nominalTo = Math.min(page * pageSize, total);
  const from =
    lessonsOnPage != null && lessonsOnPage >= 0
      ? lessonsOnPage === 0 || total === 0
        ? 0
        : nominalFrom
      : total === 0
        ? 0
        : nominalFrom;
  const to =
    lessonsOnPage != null && lessonsOnPage >= 0
      ? lessonsOnPage === 0 || total === 0
        ? 0
        : Math.min(nominalFrom + lessonsOnPage - 1, nominalTo)
      : nominalTo;
  const pages = visiblePageNumbers(page, pageCount);

  if (pageCount <= 1) return null;

  return (
    <nav
      className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--border-subtle)_90%,var(--theme-primary))] pt-8 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
      aria-label="Lesson list pages"
    >
      <p className="text-[var(--theme-muted-text)]">
        {from === 0 && to === 0 && total > 0 ? (
          <>
            No lessons on this page (showing{" "}
            <span className="font-medium text-[var(--theme-heading-text)]">{total}</span> total in this list).
          </>
        ) : (
          <>
            Showing <span className="font-medium text-[var(--theme-heading-text)]">{from}</span>–
            <span className="font-medium text-[var(--theme-heading-text)]">{to}</span> of{" "}
            <span className="font-medium text-[var(--theme-heading-text)]">{total}</span> lessons
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold"
          >
            Previous
          </Link>
        ) : null}
        <div className="flex flex-wrap items-center gap-1" aria-label="Page numbers">
          {pages.map((item, i) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-[var(--theme-muted-text)]">
                …
              </span>
            ) : (
              <Link
                key={item}
                href={href(item)}
                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold ${
                  item === page
                    ? "bg-[color-mix(in_srgb,var(--theme-primary)_18%,transparent)] text-[var(--theme-heading-text)]"
                    : "text-[var(--theme-muted-text)] hover:bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] hover:text-[var(--theme-heading-text)]"
                }`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Link>
            ),
          )}
        </div>
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
