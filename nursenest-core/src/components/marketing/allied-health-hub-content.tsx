import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Globe2, MapPin, Route, Sparkles } from "lucide-react";
import type {
  AlliedHubCategoryId,
  AlliedProfessionMarketing,
} from "@/lib/allied/allied-professions-registry";
import { ALLIED_HUB_CATEGORY_META, ALLIED_HUB_CATEGORY_ORDER } from "@/lib/allied/allied-professions-registry";

function professionChipLabel(key: string): string {
  return key
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Above-the-fold scan of every track; same links as the grid below. */
export function AlliedHeroProfessionScan({
  grouped,
}: {
  grouped: Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>;
}) {
  const flat = ALLIED_HUB_CATEGORY_ORDER.flatMap((id) => grouped.get(id) ?? []);
  if (flat.length === 0) return null;
  return (
    <div className="relative mt-10 border-t border-[color-mix(in_srgb,var(--theme-primary)_18%,transparent)] pt-8">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--theme-muted-text)]">Allied tracks here</p>
      <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
        {flat.map((p) => (
          <Link
            key={p.segment}
            href={`/allied-health/${p.segment}`}
            className="rounded-full border border-[var(--border-medium)] bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--theme-card-bg))] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-sm transition hover:border-primary/45 hover:bg-[var(--surface-interactive-hover)] hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-halo-strong)]"
          >
            {professionChipLabel(p.professionKey)}
          </Link>
        ))}
      </div>
    </div>
  );
}

type RegionLinks = {
  label: string;
  countryLine: string;
  overviewHref: string;
  questionsHref: string;
  pricingHint: string;
};

export function AlliedHealthRegionStrip({ us, ca }: { us: RegionLinks; ca: RegionLinks }) {
  return (
    <section
      className="mt-16 rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-section)] p-6 shadow-[var(--shadow-card)] sm:p-10"
      aria-labelledby="allied-region-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[var(--accent-soft)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
            <Globe2 className="h-3.5 w-3.5" aria-hidden />
            Region first
          </div>
          <h2 id="allied-region-heading" className="mt-4 text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            Where are you testing?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)] sm:text-[0.9375rem]">
            Allied content is scoped by country at signup and checkout. Pick your region first, then your profession below.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <RegionCard {...us} />
        <RegionCard {...ca} />
      </div>
    </section>
  );
}

function RegionCard({ label, countryLine, overviewHref, questionsHref, pricingHint }: RegionLinks) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/35 hover:shadow-[var(--shadow-card-hover)]">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent opacity-90"
        aria-hidden
      />
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-primary shadow-sm ring-1 ring-primary/10">
          <MapPin className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">{countryLine}</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-snug text-[var(--theme-heading-text)]">{label}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">{pricingHint}</p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Link
          href={overviewHref}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
        >
          Pathway overview
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={questionsHref}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-medium)] bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-[var(--surface-interactive-hover)]"
        >
          <ClipboardList className="h-4 w-4" aria-hidden />
          Question bank hub
        </Link>
      </div>
    </div>
  );
}

const CATEGORY_ACCENT: Record<AlliedHubCategoryId, string> = {
  therapy: "from-primary/75 via-primary/40 to-transparent",
  lab: "from-primary/65 via-primary/35 to-transparent",
  acute: "from-primary/85 via-primary/45 to-transparent",
  clinical: "from-primary/55 via-primary/30 to-transparent",
};

export function AlliedHubProfessionSections({
  grouped,
}: {
  grouped: Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>;
}) {
  return (
    <section className="mt-20" aria-labelledby="allied-professions-heading">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[var(--accent-soft)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          By practice area
        </div>
        <h2 id="allied-professions-heading" className="mt-4 text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl">
          Choose your profession
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)] sm:text-[0.9375rem]">
          Each track has a dedicated prep guide plus a paginated lesson hub. Content stays on the allied tier, separate from
          nursing NCLEX and NP depth.
        </p>
      </div>
      <div className="mt-12 space-y-16 sm:space-y-20">
        {ALLIED_HUB_CATEGORY_ORDER.map((categoryId, sectionIndex) => {
          const professions = grouped.get(categoryId) ?? [];
          if (professions.length === 0) return null;
          const meta = ALLIED_HUB_CATEGORY_META[categoryId];
          const accent = CATEGORY_ACCENT[categoryId];
          const n = String(sectionIndex + 1).padStart(2, "0");
          return (
            <div key={categoryId}>
              <header className="flex flex-col gap-4 border-b border-[var(--border-medium)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    className="select-none font-mono text-3xl font-bold leading-none text-[color-mix(in_srgb,var(--theme-primary)_45%,var(--theme-muted-text))] sm:text-4xl"
                    aria-hidden
                  >
                    {n}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">{meta.label}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--theme-muted-text)]">{meta.sublabel}</p>
                  </div>
                </div>
              </header>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
                {professions.map((p) => (
                  <li key={p.segment} className="min-h-0">
                    <article className="relative flex h-full min-h-[14rem] flex-col overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-card p-6 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)]">
                      <div
                        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`}
                        aria-hidden
                      />
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary/90">
                        {professionChipLabel(p.professionKey)}
                      </p>
                      <h4 className="mt-2 text-base font-bold leading-snug text-[var(--theme-heading-text)]">{p.h1}</h4>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">{p.description}</p>
                      <div className="mt-6 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-5">
                        <Link
                          href={`/allied-health/${p.segment}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2"
                        >
                          Open prep guide
                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                        </Link>
                        <Link
                          href={`/allied-health/${p.professionKey}/lessons`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-muted-text)] transition hover:text-primary"
                        >
                          <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                          Browse lessons
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AlliedHealthTrustStrip() {
  const items = [
    {
      icon: Route,
      title: "Discipline-first routing",
      body: "Pick your profession and land on guides and lessons written for that scope, not generic nursing copy.",
    },
    {
      icon: Globe2,
      title: "Country-aware pathways",
      body: "United States and Canada each have a dedicated allied hub so entitlements and checkout match your exam market.",
    },
    {
      icon: Sparkles,
      title: "Study loop in one tier",
      body: "Lessons, questions, and practice stay inside the allied plan you select. Upgrade paths are explicit, not mixed in by accident.",
    },
  ] as const;
  return (
    <section
      className="mt-20 rounded-[1.75rem] border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-section-alt)] to-[var(--bg-section)] px-5 py-10 shadow-[var(--shadow-card)] sm:px-10 sm:py-12"
      aria-label="Why allied learners use NurseNest"
    >
      <h2 className="max-w-xl text-xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
        Built for allied certification prep
      </h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Confidence cues before you commit to a plan.</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
        {items.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] transition hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)] sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-primary ring-1 ring-primary/10">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-bold text-[var(--theme-heading-text)]">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
