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
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div>
          {backHref && backLabel ? (
            <Link
              href={backHref}
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              {backLabel}
            </Link>
          ) : null}
          <p className={`${backHref ? "mt-5" : ""} text-sm font-semibold uppercase tracking-[0.18em] text-[var(--semantic-text-secondary)]`}>
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--theme-muted-text)] sm:text-[0.96rem]">
            {description}
          </p>
          {stats.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2.5">
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
        </div>

        <aside className="rounded-[1.6rem] border border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-text-secondary)]">Country</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--theme-heading-text)]">Match the lesson catalog to your exam context</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
            Keep the same clean layout while switching the pathway scope between Canada and the United States.
          </p>
          {countryOptions ? <div className="mt-4"><CountrySwitcher options={countryOptions} /></div> : null}
        </aside>
      </div>

      <div className="mt-6 border-t border-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-border-soft))] pt-6">
        <PathwayLessonsHubSearch basePath={searchBasePath} initialQuery={initialQuery} />
      </div>
    </header>
  );
}
