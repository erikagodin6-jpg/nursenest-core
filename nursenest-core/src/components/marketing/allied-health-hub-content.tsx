import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Globe2, MapPin, Route, Sparkles } from "lucide-react";
import type {
  AlliedHubCategoryId,
  AlliedProfessionMarketing,
} from "@/lib/allied/allied-professions-registry";
import { ALLIED_HUB_CATEGORY_META, ALLIED_HUB_CATEGORY_ORDER } from "@/lib/allied/allied-professions-registry";
import {
  MARKETING_PRIMARY_CTA_COMPACT_CLASS,
  MARKETING_SECONDARY_CTA_COMPACT_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { alliedHealthLessonsIndexPath, alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { formatTitleCase } from "@/lib/format/text-case";

/** Marketing copy for `/allied-health` (loaded from `pages.alliedHealthHub.*`). */
export type AlliedHealthHubCopy = {
  scanTracksLabel: string;
  region: {
    badgeLabel: string;
    h2: string;
    intro: string;
    pathwayOverviewCta: string;
    questionBankCta: string;
  };
  professions: {
    badge: string;
    h2: string;
    intro: string;
    openPrepGuide: string;
    browseLessons: string;
  };
  trust: {
    h2: string;
    sub: string;
    tile1: { title: string; body: string };
    tile2: { title: string; body: string };
    tile3: { title: string; body: string };
  };
};

function professionChipLabel(key: string): string {
  return formatTitleCase(key.replace(/-/g, " "));
}

/** Above-the-fold scan of every track; same links as the grid below. */
export function AlliedHeroProfessionScan({
  grouped,
  scanTracksLabel,
}: {
  grouped: Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>;
  scanTracksLabel: string;
}) {
  const flat = ALLIED_HUB_CATEGORY_ORDER.flatMap((id) => grouped.get(id) ?? []);
  if (flat.length === 0) return null;
  return (
    <div className="relative mt-10 border-t border-[color-mix(in_srgb,var(--theme-primary)_18%,transparent)] pt-8">
      <p className="nn-marketing-label">{scanTracksLabel}</p>
      <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
        {flat.map((p) => (
          <Link
            key={p.segment}
            href={alliedHealthSegmentPath(p.segment)}
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

export function AlliedHealthRegionStrip({
  us,
  ca,
  copy,
}: {
  us: RegionLinks;
  ca: RegionLinks;
  copy: AlliedHealthHubCopy["region"];
}) {
  return (
    <section
      className="mt-16 rounded-[1.75rem] border border-[var(--trust-surface-border)] bg-[var(--trust-surface)] p-6 shadow-[var(--shadow-card)] sm:p-10"
      aria-labelledby="allied-region-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[var(--accent-soft)] px-3 py-1">
            <Globe2 className="h-3.5 w-3.5 text-[var(--theme-primary)]" aria-hidden />
            <span className="nn-marketing-label nn-marketing-label--accent">{copy.badgeLabel}</span>
          </div>
          <h2 id="allied-region-heading" className="nn-marketing-h2 mt-4">
            {copy.h2}
          </h2>
          <p className="nn-marketing-body-sm mt-2 leading-relaxed text-[var(--theme-muted-text)]">{copy.intro}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <RegionCard
          {...us}
          pathwayOverviewCta={copy.pathwayOverviewCta}
          questionBankCta={copy.questionBankCta}
        />
        <RegionCard
          {...ca}
          pathwayOverviewCta={copy.pathwayOverviewCta}
          questionBankCta={copy.questionBankCta}
        />
      </div>
    </section>
  );
}

function RegionCard({
  label,
  countryLine,
  overviewHref,
  questionsHref,
  pricingHint,
  pathwayOverviewCta,
  questionBankCta,
}: RegionLinks & { pathwayOverviewCta: string; questionBankCta: string }) {
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
        <span className="nn-marketing-label nn-marketing-label--accent">{countryLine}</span>
      </div>
      <p className="nn-marketing-h3 mt-4 leading-snug">{label}</p>
      <p className="nn-marketing-body-sm mt-2 flex-1 leading-relaxed text-[var(--theme-muted-text)]">{pricingHint}</p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Link href={overviewHref} className={`${MARKETING_PRIMARY_CTA_COMPACT_CLASS} gap-1.5 shadow-sm transition hover:opacity-95`}>
          {pathwayOverviewCta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={questionsHref}
          className={`${MARKETING_SECONDARY_CTA_COMPACT_CLASS} gap-1.5 border-[var(--border-medium)] bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] text-foreground transition hover:border-primary/30 hover:bg-[var(--surface-interactive-hover)]`}
        >
          <ClipboardList className="h-4 w-4" aria-hidden />
          {questionBankCta}
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
  copy,
}: {
  grouped: Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>;
  copy: AlliedHealthHubCopy["professions"];
}) {
  return (
    <section className="mt-20" aria-labelledby="allied-professions-heading">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[var(--accent-soft)] px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-[var(--theme-primary)]" aria-hidden />
          <span className="nn-marketing-label nn-marketing-label--accent">{copy.badge}</span>
        </div>
        <h2 id="allied-professions-heading" className="nn-marketing-h2 mt-4">
          {copy.h2}
        </h2>
        <p className="nn-marketing-body-sm mt-3 leading-relaxed text-[var(--theme-muted-text)]">{copy.intro}</p>
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
                    <h3 className="nn-marketing-h3">{meta.label}</h3>
                    <p className="nn-marketing-body-sm mt-1.5 max-w-xl leading-relaxed text-[var(--theme-muted-text)]">
                      {meta.sublabel}
                    </p>
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
                      <p className="nn-marketing-label nn-marketing-label--accent opacity-90">{professionChipLabel(p.professionKey)}</p>
                      <h4 className="nn-marketing-h4 mt-2 leading-snug">{p.h1}</h4>
                      <p className="nn-marketing-body-sm mt-3 flex-1 leading-relaxed text-[var(--theme-muted-text)]">
                        {p.description}
                      </p>
                      <div className="mt-6 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-5">
                        <Link
                          href={alliedHealthSegmentPath(p.segment)}
                          className="nn-link-quiet inline-flex items-center gap-1.5 font-semibold text-[var(--theme-primary)] transition hover:gap-2"
                        >
                          {copy.openPrepGuide}
                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                        </Link>
                        <Link
                          href={alliedHealthLessonsIndexPath(p.professionKey)}
                          className="nn-link-quiet inline-flex items-center gap-2 font-medium text-[var(--theme-muted-text)] transition hover:text-[var(--theme-primary)]"
                        >
                          <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                          {copy.browseLessons}
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

export function AlliedHealthTrustStrip({ copy }: { copy: AlliedHealthHubCopy["trust"] }) {
  const items = [
    { icon: Route, title: copy.tile1.title, body: copy.tile1.body },
    { icon: Globe2, title: copy.tile2.title, body: copy.tile2.body },
    { icon: Sparkles, title: copy.tile3.title, body: copy.tile3.body },
  ] as const;
  return (
    <section
      className="mt-20 rounded-[1.75rem] border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-section-alt)] to-[var(--bg-section)] px-5 py-10 shadow-[var(--shadow-card)] sm:px-10 sm:py-12"
      aria-label="Why allied learners use NurseNest"
    >
      <h2 className="nn-marketing-h2 max-w-xl">{copy.h2}</h2>
      <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{copy.sub}</p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
        {items.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] transition hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)] sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-primary ring-1 ring-primary/10">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="nn-marketing-h4 mt-4">{title}</p>
            <p className="nn-marketing-body-sm mt-2 leading-relaxed text-[var(--theme-body-text)]">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
