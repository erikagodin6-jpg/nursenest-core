"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  EyeOff,
  LayoutGrid,
  LineChart,
  Shuffle,
  Stethoscope,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  buildPracticeAdaptiveCreatePayload,
  type PracticeAdaptiveSelectionBasis,
} from "@/components/student/pathway-cat-start-payload";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayAppQuestionBankTopicHref } from "@/components/lessons/pathway-lesson-link-practice";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  normalizeQuestionBodySystem,
  practiceHubIdsToCatTopicNames,
  type PracticeBodySystemHubId,
} from "@/lib/questions/normalize-question-body-system";
import type { PracticeBodySystemHubAggregate } from "@/lib/questions/pathway-practice-body-system-aggregates";
import {
  PRACTICE_SESSION_STUDY_FILTERS,
  type PracticeSessionStudyFilter,
} from "@/lib/practice-question-session/constants";

export type MarketingPracticeQuestionsTopicCluster = {
  topicSlug: string;
  label: string;
  count: number;
};

export type MarketingPracticeQuestionsHubClientProps = {
  pathway: ExamPathwayDefinition;
  examDisplayName: string;
  aggregates: PracticeBodySystemHubAggregate[];
  /** Optional lesson-topic clusters for the advanced drawer only. */
  topicClusters?: MarketingPracticeQuestionsTopicCluster[];
  lessonsHref: string;
  marketingCatHref: string;
  /** Canonical allied occupation filter for app question / CAT entry URLs. */
  alliedProfessionKey?: string;
  /** Mirrors server snapshot — hide mixed/linear entry when the pathway bank is empty. */
  linearPracticePoolUsable: boolean;
  /** Mirrors server snapshot — hide CAT / adaptive when complete adaptive pool is below floor. */
  catCompletePoolUsable: boolean;
};

const categoryCardBase =
  "group flex min-h-[9.5rem] h-full w-full flex-col rounded-[1.35rem] border px-4 py-4 text-left text-sm transition duration-200 sm:min-h-[10.25rem]";

function cardSelected() {
  return `${categoryCardBase} -translate-y-0.5 border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,white)] text-[var(--semantic-text-primary)] shadow-[0_16px_34px_-26px_color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]`;
}

const cardUnselected = `${categoryCardBase} border-[var(--semantic-border-soft)] bg-white text-[var(--semantic-text-secondary)] shadow-sm hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_3%,white)] hover:shadow-[0_16px_34px_-28px_rgba(15,23,42,0.34)]`;

function appQuestionsBase(pathwayId: string, qs: Record<string, string>, alliedProfession?: string) {
  const p = new URLSearchParams({ pathwayId });
  for (const [k, v] of Object.entries(qs)) {
    if (!v) continue;
    if (k === "studyFilter" && v === "all") continue;
    p.set(k, v);
  }
  const ap = alliedProfession?.trim().toLowerCase();
  if (ap) p.set("alliedProfession", ap);
  return loginWithCallback(`/app/questions?${p.toString()}`);
}

function appQuestionsSession(pathwayId: string, qs: Record<string, string>, alliedProfession?: string) {
  const p = new URLSearchParams({ pathwayId });
  for (const [k, v] of Object.entries(qs)) {
    if (!v) continue;
    if (k === "studyFilter" && v === "all") continue;
    p.set(k, v);
  }
  const ap = alliedProfession?.trim().toLowerCase();
  if (ap) p.set("alliedProfession", ap);
  return loginWithCallback(`/app/questions/session?${p.toString()}`);
}

function catBasisFromStudyFilter(sf: PracticeSessionStudyFilter): PracticeAdaptiveSelectionBasis {
  if (sf === "weak") return "weak";
  if (sf === "incorrect") return "missed";
  /** CAT API has no `unseen` basis; `studyLaunchPayload` carries unseen intent. */
  if (sf === "unseen") return "random";
  if (sf === "bookmarked") return "starred";
  return "random";
}

const FILTER_ICONS: Record<PracticeSessionStudyFilter, typeof LayoutGrid> = {
  all: LayoutGrid,
  weak: TrendingDown,
  incorrect: XCircle,
  unseen: EyeOff,
  bookmarked: Bookmark,
};

const FILTER_LABELS: Record<PracticeSessionStudyFilter, string> = {
  all: "All",
  weak: "Weak Areas",
  incorrect: "Incorrect Review",
  unseen: "Unseen",
  bookmarked: "Bookmarked",
};

const modeAccentClass = {
  success: "text-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_9%,white)]",
  brand: "text-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,white)]",
  info: "text-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_9%,white)]",
  warning: "text-[var(--semantic-warning)] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,white)]",
  chart: "text-[var(--semantic-chart-2)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_9%,white)]",
  purple: "text-[var(--semantic-chart-5)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_9%,white)]",
};

export function MarketingPracticeQuestionsHubClient({
  pathway,
  examDisplayName,
  aggregates,
  topicClusters = [],
  lessonsHref,
  marketingCatHref,
  alliedProfessionKey = "",
  linearPracticePoolUsable,
  catCompletePoolUsable,
}: MarketingPracticeQuestionsHubClientProps) {
  const [selected, setSelected] = useState<Set<PracticeBodySystemHubId>>(new Set());
  const [studyFilter, setStudyFilter] = useState<PracticeSessionStudyFilter>("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [startingAdaptive, setStartingAdaptive] = useState(false);
  const [adaptiveError, setAdaptiveError] = useState<string | null>(null);
  const { status: authStatus } = useSession();

  const pid = pathway.id;
  const apForApp =
    alliedProfessionKey.trim() && isAlliedMarketingCorePathwayId(pid) ? alliedProfessionKey.trim().toLowerCase() : "";

  const hubIdsParam = useMemo(() => [...selected].sort().join(","), [selected]);

  const withHubRecord = useCallback(
    (o: Record<string, string>) => {
      const next = { ...o };
      if (hubIdsParam) next.practiceHubIds = hubIdsParam;
      if (studyFilter !== "all") next.studyFilter = studyFilter;
      return next;
    },
    [hubIdsParam, studyFilter],
  );

  const startMixedHref = appQuestionsBase(pid, { preset: "pathway_mixed" }, apForApp);
  const weakHref = appQuestionsBase(pid, withHubRecord({ preset: "pathway_mixed", studyMode: "weak" }), apForApp);
  const incorrectHref = appQuestionsSession(
    pid,
    withHubRecord({ source: "previously_incorrect", count: "20", mode: "tutor", shuffle: "true" }),
    apForApp,
  );
  const unseenHref = appQuestionsSession(
    pid,
    withHubRecord({ source: "not_studied", count: "20", mode: "tutor", shuffle: "true" }),
    apForApp,
  );
  const bookmarkedHref = appQuestionsBase(pid, withHubRecord({ preset: "pathway_mixed", studyFilter: "bookmarked" }), apForApp);

  const startPrimaryHref = useMemo(() => {
    if (studyFilter === "incorrect") return incorrectHref;
    if (studyFilter === "unseen") return unseenHref;
    if (studyFilter === "weak") return weakHref;
    if (studyFilter === "bookmarked") return bookmarkedHref;
    if (selected.size > 0) return appQuestionsBase(pid, withHubRecord({ preset: "pathway_mixed" }), apForApp);
    return startMixedHref;
  }, [
    studyFilter,
    incorrectHref,
    unseenHref,
    weakHref,
    bookmarkedHref,
    selected.size,
    pid,
    withHubRecord,
    startMixedHref,
    apForApp,
  ]);

  const catAppHref = loginWithCallback(
    appPathwayCatSessionStartPath(pid, apForApp ? { alliedProfession: apForApp } : undefined),
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const total = aggregates.reduce((s, a) => s + a.questionCount, 0);
    const unc = aggregates.find((a) => a.id === "uncategorized")?.questionCount ?? 0;
    const normalized = aggregates.filter((a) => a.questionCount > 0).map((a) => a.id);
    console.info("[nn-practice-questions-hub]", {
      pathwayId: pid,
      categoryRowCount: aggregates.length,
      totalQuestionCount: total,
      uncategorizedCount: unc,
      normalizedCategoryUsage: normalized,
      studyFilter,
      selectedCategoryCount: selected.size,
      hydrationStatus: aggregates.length > 0 ? "ok" : "empty",
    });
  }, [pid, aggregates, studyFilter, selected.size]);

  const filteredClusters = useMemo(() => {
    if (selected.size !== 1) return [];
    const only = [...selected][0]!;
    return topicClusters.filter(
      (c) => normalizeQuestionBodySystem({ topic: c.label }) === only,
    );
  }, [selected, topicClusters]);

  const toggle = useCallback((id: PracticeBodySystemHubId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllFromAggregates = useCallback(() => {
    setSelected(new Set(aggregates.map((a) => a.id).filter((id) => id !== "uncategorized")));
  }, [aggregates]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  async function startAdaptivePractice() {
    if (startingAdaptive) return;
    setAdaptiveError(null);
    if (authStatus === "unauthenticated") {
      window.location.assign(catAppHref);
      return;
    }
    if (authStatus === "loading") {
      setAdaptiveError("Checking your sign-in status. Try again in a moment.");
      return;
    }
    setStartingAdaptive(true);
    try {
      const topicNames = practiceHubIdsToCatTopicNames([...selected]);
      const selectedCategories = [...selected].sort();
      const payload = buildPracticeAdaptiveCreatePayload({
        pathwayId: pid,
        topicNames,
        catSelectionBasis: catBasisFromStudyFilter(studyFilter),
        questionCount: 30,
        selectionStrictness: "soft",
        studyLaunchPayload: {
          pathwayId: pid,
          mode: "adaptive_practice",
          selectedCategories,
          filters: {
            studyFilter,
            weakOnly: studyFilter === "weak",
            incorrectOnly: studyFilter === "incorrect",
            unseenOnly: studyFilter === "unseen",
            bookmarkedOnly: studyFilter === "bookmarked",
          },
          count: 30,
          shuffle: true,
        },
      });
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-nn-study-launch-surface": "practice_exams" },
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let data: { id?: string; error?: string };
      try {
        data = JSON.parse(raw) as { id?: string; error?: string };
      } catch {
        setAdaptiveError("Invalid server response.");
        return;
      }
      if (res.ok && data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
        return;
      }
      const rawErr = typeof data.error === "string" && data.error.trim() ? data.error : "";
      setAdaptiveError(rawErr && rawErr !== "INVALID_SURFACE" ? rawErr : "Could not start session.");
    } catch {
      setAdaptiveError("Could not start session.");
    } finally {
      setStartingAdaptive(false);
    }
  }

  const modeCardsAll = [
    {
      icon: LayoutGrid,
      title: "Practice by Category",
      description: "Select body-system hubs below, then start a focused session.",
      href: "#practice-body-systems",
      accent: "success" as const,
      cta: "Select categories",
      needsLinear: false,
      needsCat: false,
    },
    {
      icon: Shuffle,
      title: "Mixed Quiz",
      description: "Random items across the full pathway scope.",
      href: startMixedHref,
      accent: "brand" as const,
      cta: "Start",
      needsLinear: true,
      needsCat: false,
    },
    {
      icon: TrendingDown,
      title: "Weak Areas",
      description: "Prioritize topics where accuracy is lowest after you have attempt data.",
      href: weakHref,
      accent: "info" as const,
      cta: "Practice",
      needsLinear: true,
      needsCat: false,
    },
    {
      icon: XCircle,
      title: "Incorrect Review",
      description: "Replay questions you answered incorrectly recently.",
      href: incorrectHref,
      accent: "warning" as const,
      cta: "Review",
      needsLinear: true,
      needsCat: false,
    },
    {
      icon: EyeOff,
      title: "Unseen Questions",
      description: "Bias toward questions you have not opened yet.",
      href: unseenHref,
      accent: "chart" as const,
      cta: "Start",
      needsLinear: true,
      needsCat: false,
    },
    {
      icon: LineChart,
      title: "CAT Exam",
      description: "Computerized adaptive testing for this pathway.",
      href: catAppHref,
      accent: "purple" as const,
      cta: "Start",
      needsLinear: false,
      needsCat: true,
    },
  ];

  const modeCards = modeCardsAll.filter(
    (m) => (!m.needsLinear || linearPracticePoolUsable) && (!m.needsCat || catCompletePoolUsable),
  );

  return (
    <div className="space-y-8" data-testid="marketing-practice-questions-hub">
      <section aria-labelledby="practice-modes-heading" className="rounded-[2rem] border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">Practice Modes</p>
          <h2 id="practice-modes-heading" className="mt-1 text-[1.35rem] font-bold leading-tight tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
            Choose How to Study
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
            Start broadly, focus by body system, or review weak areas once you have attempt history.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modeCards.map((m) => {
            const Icon = m.icon;
            const accent = modeAccentClass[m.accent];
            return (
              <li key={m.title} className="flex min-h-[10.5rem] flex-col rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] hover:shadow-[0_16px_34px_-28px_rgba(15,23,42,0.34)]">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">{m.description}</p>
                  </div>
                </div>
                <Link
                  href={m.href}
                  className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-full bg-[var(--semantic-surface)] px-4 py-2 text-xs font-bold text-[var(--semantic-brand)] ring-1 ring-[var(--semantic-border-soft)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_4%,white)] sm:text-sm"
                >
                  {m.cta}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="practice-body-systems" aria-labelledby="body-systems-heading" className="rounded-[2rem] border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">Question Categories</p>
            <h2 id="body-systems-heading" className="mt-1 text-[1.35rem] font-bold leading-tight tracking-tight text-[var(--theme-heading-text)] sm:text-2xl">
              Body Systems & Categories
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
              Select one or more hubs for {examDisplayName}. Counts reflect the published question bank for this pathway.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-[36px] rounded-full border border-[var(--semantic-border-soft)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] transition hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_4%,white)]"
              onClick={selectAllFromAggregates}
            >
              Select All
            </button>
            <button
              type="button"
              className="min-h-[36px] rounded-full border border-[var(--semantic-border-soft)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--theme-muted-text)] transition hover:-translate-y-0.5 hover:bg-[var(--semantic-surface)]"
              onClick={clearSelection}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 border-b border-[var(--semantic-border-soft)] pb-4" data-testid="practice-hub-filter-strip" role="toolbar" aria-label="Question filters">
          {PRACTICE_SESSION_STUDY_FILTERS.map((id) => {
            const Icon = FILTER_ICONS[id];
            const on = studyFilter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                data-testid={`practice-hub-filter-${id}`}
                onClick={() => setStudyFilter(id)}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 ${
                  on
                    ? "-translate-y-0.5 border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,white)] text-[var(--semantic-text-primary)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--semantic-brand)_16%,transparent)]"
                    : "border-[var(--semantic-border-soft)] bg-white text-[var(--semantic-text-secondary)] hover:-translate-y-0.5 hover:bg-[var(--semantic-surface)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {FILTER_LABELS[id]}
              </button>
            );
          })}
        </div>

        <ul className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="practice-body-system-cards">
          {aggregates
            .filter((a) => a.id !== "uncategorized")
            .map((row) => {
              const isOn = selected.has(row.id);
              return (
                <li key={row.id} className="flex">
                  <button type="button" onClick={() => toggle(row.id)} className={isOn ? cardSelected() : cardUnselected} aria-pressed={isOn} data-testid={`practice-hub-card-${row.id}`}>
                    <span className="flex items-start gap-2.5 text-[var(--semantic-text-primary)]">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_8%,white)] text-[var(--semantic-brand)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_16%,transparent)]">
                        <Stethoscope className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 pt-1 text-sm font-semibold leading-snug">{row.label}</span>
                    </span>
                    <span className="mt-3 line-clamp-3 text-xs font-normal leading-relaxed text-[var(--semantic-text-secondary)]">{row.description}</span>
                    <span className="mt-auto pt-3 text-xs font-semibold text-[var(--semantic-brand)]">{row.questionCount} questions</span>
                  </button>
                </li>
              );
            })}
        </ul>

        {aggregates.filter((a) => a.id !== "uncategorized").length === 0 ? (
          <div
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm shadow-sm"
            data-testid="practice-body-system-empty-state"
            role="status"
          >
            <p className="font-semibold text-[var(--theme-heading-text)]">
              Question categories are still loading or unavailable.
            </p>
            <p className="mt-1 leading-relaxed text-[var(--theme-muted-text)]">
              You can still continue through the connected study destinations while category counts refresh.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href={lessonsHref} className="font-bold text-[var(--semantic-brand)] hover:underline">
                Browse lessons
              </Link>
              <Link href={marketingCatHref} className="font-bold text-[var(--semantic-brand)] hover:underline">
                CAT overview
              </Link>
            </div>
          </div>
        ) : null}

        {aggregates.some((a) => a.id === "uncategorized" && a.questionCount > 0) ? (
          <p className="mt-3 text-xs text-[var(--theme-muted-text)]">
            Other / multi-topic: <span className="font-semibold text-[var(--semantic-text-secondary)]">{aggregates.find((a) => a.id === "uncategorized")?.questionCount ?? 0} questions</span> are available in mixed practice.
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {linearPracticePoolUsable ? (
            <div className="flex min-w-[8.5rem] flex-col gap-1.5">
              <Link href={startPrimaryHref} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 py-2.5 text-sm font-semibold nn-text-on-solid-fill shadow-sm transition hover:opacity-90" data-testid="start-selected-systems-practice">
                Start
              </Link>
              <p className="text-center text-[11px] leading-snug text-[var(--theme-muted-text)] sm:text-left">
                {studyFilter !== "all"
                  ? FILTER_LABELS[studyFilter]
                  : selected.size > 0
                    ? `${selected.size} ${selected.size === 1 ? "category" : "categories"} selected`
                    : "Mixed pathway practice"}
              </p>
            </div>
          ) : (
            <Link href={lessonsHref} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold nn-text-on-solid-fill shadow-sm transition hover:opacity-90" data-testid="start-selected-systems-practice">
              Browse Clinical Lessons
            </Link>
          )}
          {catCompletePoolUsable ? (
            <button type="button" disabled={startingAdaptive || authStatus === "loading"} onClick={() => void startAdaptivePractice()} className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[var(--semantic-surface)] disabled:opacity-50" data-testid="start-adaptive-selected-systems">
              {startingAdaptive ? "Starting…" : authStatus === "loading" ? "Checking…" : "Start"}
            </button>
          ) : null}
          {catCompletePoolUsable ? (
            <Link href={marketingCatHref} className="inline-flex min-h-[44px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,transparent)]" data-testid="marketing-cat-overview-link">
              CAT Overview
            </Link>
          ) : null}
        </div>
        {adaptiveError ? <p className="mt-2 text-sm text-[var(--semantic-danger)]">{adaptiveError}</p> : null}

        {topicClusters.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-white p-4 shadow-sm">
            <button type="button" className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-[var(--theme-heading-text)]" onClick={() => setAdvancedOpen((o) => !o)} aria-expanded={advancedOpen}>
              <span>Advanced: Refine by Lesson Topic</span>
              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {advancedOpen ? (
              <div className="mt-3 space-y-2 border-t border-[var(--semantic-border-soft)] pt-3">
                {selected.size !== 1 ? (
                  <p className="text-xs text-[var(--theme-muted-text)]">Select exactly one body system above to narrow lesson-level topics.</p>
                ) : filteredClusters.length === 0 ? (
                  <p className="text-xs text-[var(--theme-muted-text)]">No lesson-topic clusters matched this system.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="advanced-topic-refine-list">
                    {filteredClusters.map((c) => (
                      <li key={c.topicSlug} className="rounded-xl border border-[var(--semantic-border-soft)] bg-white px-3 py-2 text-xs shadow-sm">
                        <p className="font-bold text-[var(--theme-heading-text)]">{c.label}</p>
                        <p className="text-[var(--theme-muted-text)]">{c.count} questions</p>
                        <Link href={pathwayAppQuestionBankTopicHref(pathway, c.label, c.topicSlug, { alliedProfession: apForApp || undefined })} className="mt-1 inline-block font-bold text-[var(--semantic-brand)] hover:underline">
                          Open in question bank
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-white p-4 shadow-sm" aria-label="Quick links">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Quick Links</p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href={lessonsHref} className="text-[var(--semantic-brand)] hover:underline">Browse Lessons</Link>
          {catCompletePoolUsable ? <Link href={catAppHref} className="text-[var(--semantic-brand)] hover:underline" data-testid="quick-cat-app-link">CAT App</Link> : null}
          {linearPracticePoolUsable ? <Link href={startMixedHref} className="text-[var(--semantic-brand)] hover:underline">Mixed Quiz</Link> : null}
        </div>
      </section>
    </div>
  );
}
