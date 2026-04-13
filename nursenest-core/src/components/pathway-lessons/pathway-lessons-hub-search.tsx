import Link from "next/link";

type Props = {
  /** Pathname for this hub, e.g. `/us/rn/nclex-rn/lessons` */
  basePath: string;
  /** Active normalized query (from `normalizePathwayHubSearchQuery`) */
  initialQuery?: string;
  showHelperCopy?: boolean;
};

/**
 * GET form — server filters paginated results; links stay crawlable in the list below.
 */
export function PathwayLessonsHubSearch({ basePath, initialQuery, showHelperCopy = false }: Props) {
  return (
    <div className="space-y-2">
      {showHelperCopy ? (
        <p className="text-xs leading-relaxed text-[var(--theme-muted-text)]">
          Searches title, topic, and URL slug across this pathway. Results stay fast while you browse.
        </p>
      ) : null}
      <form method="get" action={basePath} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="hub-lesson-q" className="sr-only">
          Search lessons
        </label>
        <input
          id="hub-lesson-q"
          name="q"
          type="search"
          defaultValue={initialQuery ?? ""}
          placeholder="e.g. diabetes, delegation, pediatric"
          autoComplete="off"
          maxLength={80}
          className="min-h-11 w-full flex-1 rounded-full border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--semantic-border-soft))] bg-[var(--theme-page-bg)] px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
          >
            Search
          </button>
          {initialQuery ? (
            <Link
              href={basePath}
              className="nn-study-pill-secondary min-h-11 px-4 py-2 text-sm font-semibold"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
