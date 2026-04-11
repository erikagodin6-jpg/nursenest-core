import Link from "next/link";
import { CountrySwitcher, type CountrySwitcherOption } from "@/components/pathway-lessons/country-switcher";

type Props = {
  searchBasePath: string;
  initialQuery?: string;
  countryOptions?: CountrySwitcherOption[];
};

export function LessonsToolbar({ searchBasePath, initialQuery, countryOptions }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {countryOptions ? <CountrySwitcher options={countryOptions} /> : <div />}
        <form method="get" action={searchBasePath} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-[32rem]">
          <label htmlFor="lessons-toolbar-q" className="sr-only">
            Search lessons
          </label>
          <input
            id="lessons-toolbar-q"
            name="q"
            type="search"
            defaultValue={initialQuery ?? ""}
            placeholder="Search lessons"
            autoComplete="off"
            maxLength={80}
            className="min-h-11 w-full flex-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 text-sm text-[var(--theme-heading-text)] placeholder:text-[var(--theme-muted-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="min-h-11 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            >
              Search
            </button>
            {initialQuery ? (
              <Link
                href={searchBasePath}
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-cool)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
