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
    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_2.5%,var(--bg-card))] p-4 shadow-[var(--shadow-card)] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-heading-text)]">Find a lesson</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">
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
          className="min-h-11 w-full flex-1 rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_8%,var(--border-subtle))] bg-card px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            Search
          </button>
          {initialQuery ? (
            <Link
              href={basePath}
              className="min-h-11 rounded-full border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/25 hover:bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--bg-card))]"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
