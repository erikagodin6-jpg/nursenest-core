import Link from "next/link";
import { Search } from "lucide-react";
import { CountrySwitcher, type CountrySwitcherOption } from "@/components/pathway-lessons/country-switcher";

type Props = {
  searchBasePath: string;
  initialQuery?: string;
  /** Preserved on GET search (pathway lessons hub topic filter). */
  preservedTopicSlug?: string;
  countryOptions?: CountrySwitcherOption[];
  /** Optional total lesson count shown as a result indicator. */
  totalCount?: number;
};

export function LessonsToolbar({
  searchBasePath,
  initialQuery,
  preservedTopicSlug,
  countryOptions,
  totalCount,
}: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3 sm:p-4">
      <div
        className={`flex flex-col gap-3 ${countryOptions ? "lg:flex-row lg:items-center lg:justify-between" : ""}`}
      >
        {countryOptions ? <CountrySwitcher options={countryOptions} /> : null}
        <form
          method="get"
          action={searchBasePath}
          className={`flex w-full flex-col gap-2 sm:flex-row ${countryOptions ? "lg:max-w-[32rem]" : ""}`}
        >
          {preservedTopicSlug ? <input type="hidden" name="topicSlug" value={preservedTopicSlug} /> : null}
          <label htmlFor="lessons-toolbar-q" className="sr-only">
            Search lessons
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-text)]"
              aria-hidden
            />
            <input
              id="lessons-toolbar-q"
              name="q"
              type="search"
              defaultValue={initialQuery ?? ""}
              placeholder="Search lessons…"
              autoComplete="off"
              maxLength={80}
              className="min-h-11 w-full rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] py-2 pl-10 pr-4 text-sm text-[var(--theme-heading-text)] placeholder:text-[var(--theme-muted-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="min-h-11 rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            >
              Search
            </button>
            {initialQuery ? (
              <Link
                href={
                  preservedTopicSlug
                    ? `${searchBasePath.replace(/\/$/, "")}?topicSlug=${encodeURIComponent(preservedTopicSlug)}`
                    : searchBasePath
                }
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-cool)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </div>

      {/* Result count strip — shown when a query is active or always if count provided */}
      {(initialQuery || totalCount !== undefined) && (
        <div className="flex items-center gap-2 border-t border-[var(--semantic-border-soft)] pt-3">
          <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
          <p className="text-xs font-medium text-[var(--theme-muted-text)]">
            {initialQuery && totalCount !== undefined
              ? <><strong className="text-[var(--theme-heading-text)]">{totalCount.toLocaleString()}</strong> {totalCount === 1 ? "lesson matches" : "lessons match"} <span className="italic">&ldquo;{initialQuery}&rdquo;</span></>
              : totalCount !== undefined
                ? <><strong className="text-[var(--theme-heading-text)]">{totalCount.toLocaleString()}</strong> {totalCount === 1 ? "lesson" : "lessons"} in this pathway</>
                : initialQuery
                  ? `Showing results for "${initialQuery}"`
                  : null}
          </p>
        </div>
      )}
    </div>
  );
}
