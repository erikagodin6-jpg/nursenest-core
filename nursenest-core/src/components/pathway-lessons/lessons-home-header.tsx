import Link from "next/link";
import { CountrySwitcher, type CountrySwitcherOption } from "@/components/pathway-lessons/country-switcher";
import { PathwayLessonsHubSearch } from "@/components/pathway-lessons/pathway-lessons-hub-search";

type HeaderStat = {
  label: string;
  tone?: "default" | "cool" | "positive";
};

function statToneClass(tone: HeaderStat["tone"]): string {
  switch (tone) {
    case "cool":
      return "bg-[var(--semantic-panel-cool)]";
    case "positive":
      return "bg-[var(--semantic-panel-positive)]";
    default:
      return "bg-[var(--semantic-panel-muted)]";
  }
}

export function LessonsHomeHeader({
  eyebrow,
  title,
  description,
  searchBasePath,
  initialQuery,
  countryOptions,
  stats = [],
  showStats = false,
  showSearchHelperCopy = false,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  searchBasePath: string;
  initialQuery?: string;
  countryOptions?: CountrySwitcherOption[];
  stats?: HeaderStat[];
  showStats?: boolean;
  showSearchHelperCopy?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              {backLabel}
            </Link>
          ) : null}
            <p className={`${backHref ? "mt-4" : ""} text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-text-secondary)]`}>
              {eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)]">{description}</p>
          </div>
          {countryOptions ? (
            <div className="shrink-0">
              <CountrySwitcher options={countryOptions} />
            </div>
          ) : null}
        </div>
        {showStats && stats.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className={`inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] px-3.5 text-xs font-semibold text-[var(--semantic-text-secondary)] ${statToneClass(stat.tone)}`}
                >
                  {stat.label}
                </span>
              ))}
          </div>
        ) : null}
        <div className="border-t border-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-border-soft))] pt-5">
          <PathwayLessonsHubSearch
            basePath={searchBasePath}
            initialQuery={initialQuery}
            showHelperCopy={showSearchHelperCopy}
          />
        </div>
      </div>
    </header>
  );
}
