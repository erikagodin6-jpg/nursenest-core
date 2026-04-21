"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import {
  type FnpClinicalDomain,
  type FnpDomainFilter,
  type FnpExplorerLesson,
  type FnpLifespanFilter,
  type FnpLifespanGroup,
  FNP_DOMAIN_ORDER,
  FNP_LIFESPAN_ORDER,
  fnpExplorerMatchesFilters,
} from "@/lib/lessons/fnp-us-lesson-enrichment";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { LessonCardChip } from "@/components/student/product/lesson-card";
import { PathwayLessonRecordChips } from "@/components/pathway-lessons/pathway-lesson-record-chips";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

function marketingQuestionsTopicHref(pathway: ExamPathwayDefinition, topic: string): string {
  const base = buildExamPathwayPath(pathway, "questions");
  const t = topic.trim();
  if (!t) return base;
  return `${base}?topic=${encodeURIComponent(t)}`;
}

function pickRelatedPeers(peers: FnpExplorerLesson[], current: FnpExplorerLesson, max: number): FnpExplorerLesson[] {
  const topic = current.meta.topic.trim();
  const sameTopic = peers.filter(
    (e) => e.meta.slug !== current.meta.slug && e.meta.topic.trim() === topic && topic.length > 0,
  );
  const pool = sameTopic.length > 0 ? sameTopic : peers.filter((e) => e.meta.slug !== current.meta.slug);
  return pool.slice(0, max);
}

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  /** Server-built: metadata + short preview snippets only (no full lesson sections). */
  explorerLessons: FnpExplorerLesson[];
  excludeSlug?: string | null;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

const HASH_TO_LIFESPAN: Record<string, FnpLifespanGroup> = {
  "#fnp-prenatal": "prenatal_womens",
  "#fnp-pediatric": "pediatric",
  "#fnp-adolescent": "adolescent",
  "#fnp-adult": "adult",
  "#fnp-geriatric": "geriatric",
  "#fnp-lifespan": "lifespan_mixed",
};

export function FnpLessonExplorer({ pathway, lessonsBasePath, explorerLessons, excludeSlug, progressMap = {} }: Props) {
  const pathname = usePathname() ?? "";
  const [lifespan, setLifespan] = useState<FnpLifespanFilter>("all");
  const [domain, setDomain] = useState<FnpDomainFilter>("all");
  const [textQ, setTextQ] = useState("");
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstFilterEffect = useRef(true);

  useEffect(() => {
    const h = window.location.hash;
    const mapped = HASH_TO_LIFESPAN[h];
    if (mapped) startTransition(() => setLifespan(mapped));
  }, []);

  useEffect(() => {
    if (skipFirstFilterEffect.current) {
      skipFirstFilterEffect.current = false;
      return;
    }
    if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    filterDebounceRef.current = setTimeout(() => {
      trackClientEvent(PH.pathwayExplorerFilterApplied, {
        actor: pathname.startsWith("/app") ? "authenticated" : "anonymous",
        pathway_id: pathway.id,
        lifespan: String(lifespan),
        domain: String(domain),
        text_active: textQ.trim().length >= 2,
      });
    }, 900);
    return () => {
      if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    };
  }, [pathname, pathway.id, lifespan, domain, textQ]);

  const filtered = useMemo(() => {
    const t = textQ.trim().toLowerCase();
    const useText = t.length >= 2;
    return explorerLessons.filter((e) => {
      if (excludeSlug && e.meta.slug === excludeSlug) return false;
      if (!fnpExplorerMatchesFilters(e, lifespan, domain)) return false;
      if (!useText) return true;
      const hay = `${e.meta.title} ${e.meta.topic} ${e.meta.slug}`.toLowerCase();
      return hay.includes(t);
    });
  }, [explorerLessons, lifespan, domain, excludeSlug, textQ]);

  return (
    <div id="fnp-explorer" className="scroll-mt-24 space-y-5">
      <div className="nn-study-card nn-study-card--wash p-4 sm:p-5">
        <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-muted">Filter lessons</p>
        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
          Combine a <strong className="text-foreground">population</strong> lane with a{" "}
          <strong className="text-foreground">competency</strong> lane: mirrors how board items layer age and task.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <p id="fnp-filter-age" className="text-xs font-semibold text-foreground">
              Population / age focus
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-labelledby="fnp-filter-age"
            >
              <FilterChip
                active={lifespan === "all"}
                onClick={() => startTransition(() => setLifespan("all"))}
              >
                All
              </FilterChip>
              {FNP_LIFESPAN_ORDER.map((row) => (
                <FilterChip
                  key={row.id}
                  active={lifespan === row.id}
                  onClick={() => startTransition(() => setLifespan(row.id))}
                >
                  {row.shortLabel}
                </FilterChip>
              ))}
            </div>
          </div>

          <div>
            <p id="fnp-filter-domain" className="text-xs font-semibold text-foreground">
              Clinical domain (AANP/ANCC lanes)
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-labelledby="fnp-filter-domain"
            >
              <FilterChip active={domain === "all"} onClick={() => startTransition(() => setDomain("all"))}>
                All
              </FilterChip>
              {FNP_DOMAIN_ORDER.map((row) => (
                <FilterChip
                  key={row.id}
                  active={domain === row.id}
                  onClick={() => startTransition(() => setDomain(row.id))}
                >
                  {row.label}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="fnp-lesson-text" className="text-xs font-semibold text-foreground">
              Search this page
            </label>
            <input
              id="fnp-lesson-text"
              type="search"
              value={textQ}
              onChange={(ev) => {
                const v = ev.target.value;
                startTransition(() => setTextQ(v));
              }}
              placeholder="Title, topic, or slug (min 2 characters)"
              autoComplete="off"
              maxLength={80}
              className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <p className="mt-1 text-[11px] text-muted">Filters the current page of lessons only; use topic clusters or pagination for the full library.</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted" aria-live="polite">
          Showing <strong className="text-foreground">{filtered.length}</strong> lesson
          {filtered.length === 1 ? "" : "s"}
          {lifespan !== "all" || domain !== "all" || textQ.trim().length >= 2 ? " (filtered)" : ""}.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="space-y-3">
          {(() => {
            const noResultsCopy = emptyStateCopy.noSearchResults({
              query: textQ.trim() || undefined,
              pathwayLine: pathway.shortName,
            });
            return (
          <PremiumEmptyState
            data-nn-empty="fnp-explorer-filters"
            tone="default"
            density="compact"
            visualLayout="stack"
            headline={emptyStateCopy.noFilterResults.headline}
            body={textQ.trim().length >= 2 ? noResultsCopy.body : emptyStateCopy.noFilterResults.body}
            hint="Try clearing filters, widening your search, or returning to the full lesson view for this pathway."
            primaryCta={{ label: "View all lessons on this page", href: lessonsBasePath, variant: "primary" }}
            secondaryCtas={[
              { label: "Practice questions", href: pathwayHubAppQuestionsHref(pathway.id), variant: "secondary" },
            ]}
            className="border-[var(--semantic-border-soft)]"
          />
            );
          })()}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="nn-chip px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40"
              onClick={() => startTransition(() => {
                setLifespan("all");
                setDomain("all");
                setTextQ("");
              })}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-6">
          {filtered.map((e) => (
            <FnpLessonCard
              key={e.meta.slug}
              pathway={pathway}
              lessonsBasePath={lessonsBasePath}
              enriched={e}
              pagePeers={filtered}
              progressStatus={progressMap[e.meta.slug] ?? "not_started"}
              showProgress={Object.keys(progressMap).length > 0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nn-chip px-3 py-1.5 text-left text-sm font-medium transition-colors hover:border-primary/40"
      data-selected={active ? "true" : undefined}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function lifespanLabel(primary: FnpLifespanGroup): string {
  return FNP_LIFESPAN_ORDER.find((x) => x.id === primary)?.label ?? primary;
}

function FnpLessonCard({
  pathway,
  lessonsBasePath,
  enriched,
  pagePeers,
  progressStatus,
  showProgress,
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  enriched: FnpExplorerLesson;
  pagePeers: FnpExplorerLesson[];
  progressStatus: PathwayLessonProgressStatus;
  showProgress: boolean;
}) {
  const l = enriched.meta;
  const p = enriched.clinicalPreview;
  const detailHref = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
  const related = useMemo(() => pickRelatedPeers(pagePeers, enriched, 3), [pagePeers, enriched]);
  const topicHubSlug = l.topicSlug?.trim();
  const topicHubHref =
    topicHubSlug && !topicHubSlug.startsWith("_")
      ? `${lessonsBasePath}/topics/${encodeURIComponent(topicHubSlug)}`
      : null;
  const gridCols = topicHubHref ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <li className="nn-study-card nn-lesson-list-card border-[var(--semantic-border-soft)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <PathwayLessonRecordChips lesson={l} />
          <LessonCardChip variant="neutral">{lifespanLabel(enriched.primaryLifespan)}</LessonCardChip>
        </div>
        {showProgress ? <PathwayLessonProgressBadge status={progressStatus} className="shrink-0" /> : null}
      </div>
      {detailHref ? (
        <Link href={detailHref} className="mt-1 block text-lg font-semibold text-primary hover:underline">
          {cleanLessonTitleForDisplay(l.title)}
        </Link>
      ) : (
        <p className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
          {cleanLessonTitleForDisplay(l.title)}
        </p>
      )}

      <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase text-muted">What this lesson prepares you to do clinically</p>
          <p className="mt-1 text-foreground">{p.providerTasks}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Likely item styles</p>
          <p className="mt-0.5 text-[var(--theme-muted-text)]">{p.likelyQuestionTypes}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Why it appears on boards</p>
          <p className="mt-0.5 text-[var(--theme-muted-text)]">{p.whyBoards}</p>
        </div>
        <div className="sm:col-span-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-info-soft)] p-3">
          <p className="text-xs font-semibold text-[var(--theme-heading-text)]">Mini patient scenario</p>
          <p className="mt-1 text-foreground">{p.miniScenario}</p>
        </div>
        <div className="sm:col-span-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-success-soft)] p-3">
          <p className="text-xs font-semibold text-[var(--semantic-success-contrast)]">Sample clinical decision</p>
          <p className="mt-1 text-foreground">{p.sampleDecision}</p>
        </div>
        <div className="sm:col-span-2 nn-surface-inset rounded-xl p-3">
          <p className="text-xs font-semibold text-muted">Rationale snippet</p>
          <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{p.rationaleSnippet}&rdquo;</p>
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-1.5">
          {enriched.domains.map((d: FnpClinicalDomain) => (
            <span key={d} className="nn-accent-pill rounded-full px-2.5 py-0.5 text-xs font-medium">
              {FNP_DOMAIN_ORDER.find((x) => x.id === d)?.label ?? d}
            </span>
          ))}
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-4 border-t border-border/50 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-heading-text)]">Related on this page</p>
          <ul className="mt-2 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((peer) => {
              const rh = pathwayLessonMarketingDetailHref(lessonsBasePath, peer.meta.slug);
              if (!rh) return null;
              return (
                <li key={peer.meta.slug}>
                  <Link
                    href={rh}
                    className="nn-surface-inset block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/35"
                  >
                    {cleanLessonTitleForDisplay(peer.meta.title)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className={`mt-4 grid gap-2 ${gridCols}`}>
        {topicHubHref ? (
          <Link href={topicHubHref} className="nn-surface-elevated block rounded-xl p-3 transition-colors hover:border-primary/35">
            <p className="text-xs font-semibold text-[var(--theme-primary)]">Topic hub</p>
            <p className="mt-0.5 text-sm text-[var(--theme-muted-text)]">Curated lessons for this cluster</p>
          </Link>
        ) : null}
        <Link
          href={marketingQuestionsTopicHref(pathway, l.topic)}
          className="nn-surface-elevated block rounded-xl p-3 transition-colors hover:border-primary/35"
        >
          <p className="text-xs font-semibold text-[var(--theme-primary)]">Question bank</p>
          <p className="mt-0.5 text-sm text-[var(--theme-muted-text)]">Hub practice for this topic</p>
        </Link>
        <Link
          href={loginWithCallback(pathwayHubAppQuestionsHref(pathway.id, l.topic))}
          className="nn-surface-elevated block rounded-xl p-3 transition-colors hover:border-primary/35"
        >
          <p className="text-xs font-semibold text-[var(--theme-primary)]">App practice</p>
          <p className="mt-0.5 text-sm text-[var(--theme-muted-text)]">Cases with full rationales</p>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
        {detailHref ? (
          <Link href={detailHref} className="inline-flex min-h-10 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none">
            Open lesson
          </Link>
        ) : null}
        <Link
          href="/flashcards"
          className="inline-flex min-h-10 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
        >
          Flashcards
        </Link>
        <Link
          href={buildExamPathwayPath(pathway, "cat")}
          className="inline-flex min-h-10 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
        >
          Exam simulations
        </Link>
      </div>
    </li>
  );
}
