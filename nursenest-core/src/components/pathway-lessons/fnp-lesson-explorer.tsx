"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
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

function appQuestionsHref(pathwayId: string, topic?: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topic) q.set("topic", topic);
  return `/app/questions?${q.toString()}`;
}

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  /** Server-built: metadata + short preview snippets only (no full lesson sections). */
  explorerLessons: FnpExplorerLesson[];
  excludeSlug?: string | null;
};

const HASH_TO_LIFESPAN: Record<string, FnpLifespanGroup> = {
  "#fnp-prenatal": "prenatal_womens",
  "#fnp-pediatric": "pediatric",
  "#fnp-adolescent": "adolescent",
  "#fnp-adult": "adult",
  "#fnp-geriatric": "geriatric",
  "#fnp-lifespan": "lifespan_mixed",
};

export function FnpLessonExplorer({ pathway, lessonsBasePath, explorerLessons, excludeSlug }: Props) {
  const [lifespan, setLifespan] = useState<FnpLifespanFilter>("all");
  const [domain, setDomain] = useState<FnpDomainFilter>("all");

  useEffect(() => {
    const h = window.location.hash;
    const mapped = HASH_TO_LIFESPAN[h];
    if (mapped) setLifespan(mapped);
  }, []);

  const filtered = useMemo(() => {
    return explorerLessons.filter((e) => {
      if (excludeSlug && e.meta.slug === excludeSlug) return false;
      return fnpExplorerMatchesFilters(e, lifespan, domain);
    });
  }, [explorerLessons, lifespan, domain, excludeSlug]);

  return (
    <div id="fnp-explorer" className="scroll-mt-24 space-y-5">
      <div className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Filter lessons</p>
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
              <FilterChip active={lifespan === "all"} onClick={() => setLifespan("all")}>
                All
              </FilterChip>
              {FNP_LIFESPAN_ORDER.map((row) => (
                <FilterChip key={row.id} active={lifespan === row.id} onClick={() => setLifespan(row.id)}>
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
              <FilterChip active={domain === "all"} onClick={() => setDomain("all")}>
                All
              </FilterChip>
              {FNP_DOMAIN_ORDER.map((row) => (
                <FilterChip key={row.id} active={domain === row.id} onClick={() => setDomain(row.id)}>
                  {row.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted" aria-live="polite">
          Showing <strong className="text-foreground">{filtered.length}</strong> lesson
          {filtered.length === 1 ? "" : "s"}
          {lifespan !== "all" || domain !== "all" ? " (filtered)" : ""}.
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card p-4 text-sm text-[var(--theme-muted-text)]">
          No lessons match this combination. Clear one filter or browse another population lane.
        </p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((e) => (
            <FnpLessonCard
              key={e.meta.slug}
              pathway={pathway}
              lessonsBasePath={lessonsBasePath}
              enriched={e}
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
      className={`rounded-full border px-3 py-1.5 text-left text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-[var(--theme-muted-text)] hover:border-primary/40"
      }`}
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
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  enriched: FnpExplorerLesson;
}) {
  const l = enriched.meta;
  const p = enriched.clinicalPreview;
  const detailHref = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
  return (
    <li className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
        <span className="rounded-full bg-[var(--theme-muted-surface)] px-2 py-0.5 text-[11px] font-medium text-muted">
          {lifespanLabel(enriched.primaryLifespan)}
        </span>
      </div>
      {detailHref ? (
        <Link href={detailHref} className="mt-1 block text-lg font-semibold text-primary hover:underline">
          {l.title}
        </Link>
      ) : (
        <p className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{l.title}</p>
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
        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
          <p className="text-xs font-semibold text-muted">Mini patient scenario</p>
          <p className="mt-1 text-foreground">{p.miniScenario}</p>
        </div>
        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
          <p className="text-xs font-semibold text-muted">Sample clinical decision</p>
          <p className="mt-1 text-foreground">{p.sampleDecision}</p>
        </div>
        <div className="sm:col-span-2 rounded-lg border border-border bg-card/80 p-3">
          <p className="text-xs font-semibold text-muted">Rationale snippet</p>
          <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{p.rationaleSnippet}&rdquo;</p>
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-1.5">
          {enriched.domains.map((d: FnpClinicalDomain) => (
            <span key={d} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
              {FNP_DOMAIN_ORDER.find((x) => x.id === d)?.label ?? d}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {detailHref ? (
          <Link href={detailHref} className="text-sm font-semibold text-primary">
            Open lesson →
          </Link>
        ) : null}
        <Link href={appQuestionsHref(pathway.id, l.topic)} className="text-sm font-semibold text-primary">
          Case-based questions →
        </Link>
        <Link href="/app/flashcards" className="text-sm font-semibold text-muted hover:text-primary">
          Flashcards →
        </Link>
        <Link href="/app/exams" className="text-sm font-semibold text-muted hover:text-primary">
          Exam simulations →
        </Link>
      </div>
    </li>
  );
}
