import Link from "next/link";

type Props = {
  /** Pathname for this hub, e.g. `/us/rn/nclex-rn/lessons` */
  basePath: string;
  /** Active normalized query (from `normalizePathwayHubSearchQuery`) */
  initialQuery?: string;
};

/**
 * GET form — server filters paginated results; links stay crawlable in the list below.
 */
export function PathwayLessonsHubSearch({ basePath, initialQuery }: Props) {
  return (
    <div className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Find a lesson</p>
      <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
        Searches title, topic, and URL slug across this pathway. Results stay paginated for fast loads.
      </p>
      <form method="get" action={basePath} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
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
          className="min-h-11 w-full flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Search
          </button>
          {initialQuery ? (
            <Link
              href={basePath}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/30"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
