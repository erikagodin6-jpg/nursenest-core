"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type DisplayModule = {
  slug: string;
  title: string;
  subtitle: string;
  lessons: number;
};

type Props = {
  modules: DisplayModule[];
  initialQuery?: string;
  initialSort?: "recommended" | "title_asc" | "title_desc";
};

type SortOption = NonNullable<Props["initialSort"]>;

function sortModules(modules: DisplayModule[], sortBy: SortOption) {
  if (sortBy === "title_asc") {
    return [...modules].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  }
  if (sortBy === "title_desc") {
    return [...modules].sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: "base" }));
  }
  return modules;
}

export function PreNursingLessonsBrowser({ modules, initialQuery, initialSort = "recommended" }: Props) {
  const [search, setSearch] = useState((initialQuery ?? "").trim());
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const q = search.trim();
    if (q.length >= 2) qs.set("q", q);
    else qs.delete("q");
    if (sortBy !== "recommended") qs.set("sort", sortBy);
    else qs.delete("sort");
    const next = qs.toString();
    window.history.replaceState(null, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }, [search, sortBy]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base =
      q.length === 0
        ? modules
        : modules.filter((module) => `${module.title} ${module.subtitle}`.toLowerCase().includes(q));
    return sortModules(base, sortBy);
  }, [modules, search, sortBy]);

  return (
    <div className="space-y-4">
      <div className="sticky top-20 z-20 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,white)] p-3 shadow-[var(--semantic-shadow-soft)] backdrop-blur sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label htmlFor="pre-nursing-module-search" className="sr-only">
            Search modules
          </label>
          <div className="relative min-w-[14rem] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-text)]"
              aria-hidden
            />
            <input
              id="pre-nursing-module-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pre-nursing modules"
              autoComplete="off"
              className="min-h-10 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] py-2 pl-10 pr-3 text-sm text-[var(--theme-heading-text)] placeholder:text-[var(--theme-muted-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as NonNullable<Props["initialSort"]>)}
            className="min-h-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--theme-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            aria-label="Sort modules"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="title_asc">Sort: Title A-Z</option>
            <option value="title_desc">Sort: Title Z-A</option>
          </select>
        </div>
        <p className="mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-xs text-[var(--theme-muted-text)] sm:text-sm">
          <span className="font-semibold text-[var(--theme-heading-text)]">{modules.length.toLocaleString()}</span> modules
          {" · "}
          <span className="font-semibold text-[var(--theme-heading-text)]">{filtered.length.toLocaleString()}</span> matching
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 sm:p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-heading-text)]">Module library</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((module) => (
            <li key={module.slug}>
              <Link
                href={`/pre-nursing/lessons/${module.slug}`}
                className="block rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:bg-[var(--semantic-surface)]"
                data-testid={`pre-nursing-lesson-${module.slug}`}
              >
                <h3 className="line-clamp-2 text-sm font-semibold text-[var(--theme-heading-text)]">{module.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--theme-muted-text)]">{module.subtitle}</p>
                <p className="mt-2 text-xs font-semibold text-[var(--semantic-brand)]">
                  {module.lessons} {module.lessons === 1 ? "interactive lesson" : "interactive lessons"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
