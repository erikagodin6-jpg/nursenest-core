import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, MapPin } from "lucide-react";
import type {
  AlliedHubCategoryId,
  AlliedProfessionMarketing,
} from "@/lib/allied/allied-professions-registry";
import { ALLIED_HUB_CATEGORY_META, ALLIED_HUB_CATEGORY_ORDER } from "@/lib/allied/allied-professions-registry";

type RegionLinks = {
  label: string;
  countryLine: string;
  overviewHref: string;
  questionsHref: string;
  pricingHint: string;
};

export function AlliedHealthRegionStrip({ us, ca }: { us: RegionLinks; ca: RegionLinks }) {
  return (
    <section className="mt-10" aria-labelledby="allied-region-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="allied-region-heading" className="text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">
            Where are you testing?
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--theme-muted-text)]">
            Allied content is scoped by country at signup and checkout. Pick your region first, then your profession below.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <RegionCard {...us} />
        <RegionCard {...ca} />
      </div>
    </section>
  );
}

function RegionCard({ label, countryLine, overviewHref, questionsHref, pricingHint }: RegionLinks) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide">{countryLine}</span>
      </div>
      <p className="mt-2 text-base font-semibold text-[var(--theme-heading-text)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{pricingHint}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={overviewHref}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
        >
          Pathway overview
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={questionsHref}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--border-medium)] bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-foreground hover:bg-[var(--surface-interactive-hover)]"
        >
          <ClipboardList className="h-4 w-4" aria-hidden />
          Question bank hub
        </Link>
      </div>
    </div>
  );
}

export function AlliedHubProfessionSections({
  grouped,
}: {
  grouped: Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>;
}) {
  return (
    <section className="mt-14" aria-labelledby="allied-professions-heading">
      <h2 id="allied-professions-heading" className="text-xl font-bold text-[var(--theme-heading-text)] sm:text-2xl">
        Choose your profession
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)]">
        Each track has a dedicated prep guide plus a paginated lesson hub. Content stays on the allied tier, separate from
        nursing NCLEX and NP depth.
      </p>
      <div className="mt-10 space-y-14">
        {ALLIED_HUB_CATEGORY_ORDER.map((categoryId) => {
          const professions = grouped.get(categoryId) ?? [];
          if (professions.length === 0) return null;
          const meta = ALLIED_HUB_CATEGORY_META[categoryId];
          return (
            <div key={categoryId}>
              <header className="border-b border-[var(--border-subtle)] pb-3">
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{meta.label}</h3>
                <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{meta.sublabel}</p>
              </header>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {professions.map((p) => (
                  <li key={p.segment}>
                    <article className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                      <h4 className="text-base font-semibold leading-snug text-[var(--theme-heading-text)]">{p.h1}</h4>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">{p.description}</p>
                      <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4">
                        <Link
                          href={`/allied-health/${p.segment}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          Open prep guide
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                        <Link
                          href={`/allied-health/${p.professionKey}/lessons`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary hover:underline"
                        >
                          <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
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
  return (
    <section
      className="mt-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section-alt)] px-6 py-8 sm:px-8"
      aria-label="Why allied learners use NurseNest"
    >
      <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Built for allied certification prep</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        <li className="text-sm text-[var(--theme-body-text)]">
          <span className="font-semibold text-[var(--theme-heading-text)]">Discipline-first routing. </span>
          Pick your profession and land on guides and lessons written for that scope, not generic nursing copy.
        </li>
        <li className="text-sm text-[var(--theme-body-text)]">
          <span className="font-semibold text-[var(--theme-heading-text)]">Country-aware pathways. </span>
          United States and Canada each have a dedicated allied hub so entitlements and checkout match your exam market.
        </li>
        <li className="text-sm text-[var(--theme-body-text)]">
          <span className="font-semibold text-[var(--theme-heading-text)]">Study loop in one tier. </span>
          Lessons, questions, and practice stay inside the allied plan you select. Upgrade paths are explicit, not mixed in by
          accident.
        </li>
      </ul>
    </section>
  );
}
