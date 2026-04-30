"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  EyeOff,
  LayoutGrid,
  LineChart,
  Shuffle,
  Stethoscope,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { buildPracticeAdaptiveCreatePayload } from "@/components/student/pathway-cat-start-payload";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayAppQuestionBankTopicHref } from "@/components/lessons/pathway-lesson-link-practice";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  normalizeQuestionBodySystem,
  practiceHubIdsToCatTopicNames,
  type PracticeBodySystemHubId,
} from "@/lib/questions/normalize-question-body-system";
import type { PracticeBodySystemHubAggregate } from "@/lib/questions/pathway-practice-body-system-aggregates";

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
};

const cardBase =
  "flex min-h-[4rem] flex-col justify-center rounded-[1.25rem] border px-4 py-3 text-left text-sm font-semibold transition sm:min-h-[4.25rem]";

function cardSelected() {
  return `${cardBase} border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]`;
}

const cardUnselected = `${cardBase} border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]`;

function appQuestionsBase(pathwayId: string, qs: Record<string, string>) {
  const p = new URLSearchParams({ pathwayId, ...qs });
  return loginWithCallback(`/app/questions?${p.toString()}`);
}

function appQuestionsSession(pathwayId: string, qs: Record<string, string>) {
  const p = new URLSearchParams({ pathwayId, ...qs });
  return loginWithCallback(`/app/questions/session?${p.toString()}`);
}

export function MarketingPracticeQuestionsHubClient({
  pathway,
  examDisplayName,
  aggregates,
  topicClusters = [],
  lessonsHref,
  marketingCatHref,
}: MarketingPracticeQuestionsHubClientProps) {
  const [selected, setSelected] = useState<Set<PracticeBodySystemHubId>>(new Set());
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [startingAdaptive, setStartingAdaptive] = useState(false);
  const [adaptiveError, setAdaptiveError] = useState<string | null>(null);

  const pid = pathway.id;

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

  const hubIdsParam = useMemo(() => [...selected].sort().join(","), [selected]);

  const startMixedHref = appQuestionsBase(pid, { preset: "pathway_mixed" });
  const startHubDrillHref =
    selected.size > 0 ? appQuestionsBase(pid, { preset: "pathway_mixed", practiceHubIds: hubIdsParam }) : startMixedHref;

  const weakHref = appQuestionsBase(pid, { preset: "pathway_mixed", studyMode: "weak" });
  const incorrectHref = appQuestionsSession(pid, {
    source: "previously_incorrect",
    count: "20",
    mode: "tutor",
    shuffle: "true",
  });
  const unseenHref = appQuestionsSession(pid, {
    source: "not_studied",
    count: "20",
    mode: "tutor",
    shuffle: "true",
  });

  const catAppHref = loginWithCallback(appPathwayCatSessionStartPath(pid));

  async function startAdaptivePractice() {
    if (startingAdaptive) return;
    setAdaptiveError(null);
    setStartingAdaptive(true);
    try {
      const topicNames = practiceHubIdsToCatTopicNames([...selected]);
      const payload = buildPracticeAdaptiveCreatePayload({
        pathwayId: pid,
        topicNames,
        catSelectionBasis: "random",
        questionCount: 30,
        selectionStrictness: "soft",
      });
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-nn-study-launch-surface": "marketing_questions_hub" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (res.ok && data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
        return;
      }
      setAdaptiveError(typeof data.error === "string" && data.error.trim() ? data.error : "Could not start session.");
    } catch {
      setAdaptiveError("Could not start session.");
    } finally {
      setStartingAdaptive(false);
    }
  }

  const modeCards = [
    {
      icon: LayoutGrid,
      title: "Practice by body system",
      description: "Select one or more systems below, then start a focused session.",
      href: "#practice-body-systems",
      accent: "success" as const,
      cta: "Select systems",
    },
    {
      icon: Shuffle,
      title: "Mixed quiz",
      description: "Random items across the full pathway scope.",
      href: startMixedHref,
      accent: "brand" as const,
      cta: "Start mixed quiz",
    },
    {
      icon: TrendingDown,
      title: "Weak areas",
      description: "Prioritize topics where accuracy is lowest (after you have attempt data).",
      href: weakHref,
      accent: "info" as const,
      cta: "Practice weak areas",
    },
    {
      icon: XCircle,
      title: "Incorrect review",
      description: "Replay questions you answered incorrectly recently.",
      href: incorrectHref,
      accent: "warning" as const,
      cta: "Review incorrect",
    },
    {
      icon: EyeOff,
      title: "Unseen questions",
      description: "Bias toward questions you have not opened in this bank yet.",
      href: unseenHref,
      accent: "chart" as const,
      cta: "Start unseen set",
    },
    {
      icon: LineChart,
      title: "CAT exam",
      description: "Computerized adaptive testing for this pathway (signed-in app).",
      href: catAppHref,
      accent: "purple" as const,
      cta: "Launch CAT",
    },
  ];

  return (
    <div className="space-y-8" data-testid="marketing-practice-questions-hub">
      <section aria-labelledby="practice-modes-heading">
        <h2 id="practice-modes-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
          Practice modes
        </h2>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
          Pick how you want to study. Body-system filters apply to mixed practice and adaptive study sessions.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modeCards.map((m) => {
            const Icon = m.icon;
            const accent =
              m.accent === "success"
                ? "border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)]"
                : m.accent === "brand"
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                  : m.accent === "info"
                    ? "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)]"
                    : m.accent === "warning"
                      ? "border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))]"
                      : m.accent === "chart"
                        ? "border-[color-mix(in_srgb,var(--semantic-chart-2)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))]"
                        : "border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))]";
            return (
              <li
                key={m.title}
                className={`flex flex-col rounded-[1.25rem] border p-4 shadow-[var(--semantic-shadow-soft)] ${accent}`}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--semantic-surface)] text-[var(--semantic-brand)] ring-1 ring-[var(--semantic-border-soft)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">{m.description}</p>
                  </div>
                </div>
                <Link
                  href={m.href}
                  className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-brand)] hover:bg-[var(--semantic-panel-muted)] sm:text-sm"
                >
                  {m.cta}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="practice-body-systems" aria-labelledby="body-systems-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="body-systems-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
              Body systems
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--theme-muted-text)]">
              Select one or more systems for {examDisplayName}. Counts reflect the published question bank in this
              pathway&apos;s scope.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] hover:bg-[var(--semantic-panel-muted)]"
              onClick={selectAllFromAggregates}
            >
              Select all
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-muted-text)] hover:bg-[var(--semantic-panel-muted)]"
              onClick={clearSelection}
            >
              Clear
            </button>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="practice-body-system-cards">
          {aggregates
            .filter((a) => a.id !== "uncategorized")
            .map((row) => {
              const isOn = selected.has(row.id);
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => toggle(row.id)}
                    className={isOn ? cardSelected() : cardUnselected}
                    aria-pressed={isOn}
                    data-testid={`practice-hub-card-${row.id}`}
                  >
                    <span className="flex items-center gap-2 text-[var(--semantic-text-primary)]">
                      <Stethoscope className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                      {row.label}
                    </span>
                    <span className="mt-1 text-xs font-normal leading-relaxed text-[var(--semantic-text-secondary)]">
                      {row.description}
                    </span>
                    <span className="mt-2 text-xs font-semibold text-[var(--semantic-info)]">
                      {row.questionCount} questions
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={startHubDrillHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold nn-text-on-solid-fill hover:opacity-90"
            data-testid="start-selected-systems-practice"
          >
            {selected.size > 0 ? "Start practice (selected systems)" : "Start mixed practice (all systems)"}
          </Link>
          <button
            type="button"
            disabled={startingAdaptive}
            onClick={() => void startAdaptivePractice()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[var(--semantic-success)] px-5 py-2 text-sm font-semibold text-[var(--semantic-success-contrast)] hover:opacity-90 disabled:opacity-50"
            data-testid="start-adaptive-selected-systems"
          >
            {startingAdaptive ? "Starting…" : "Start adaptive session (selected)"}
          </button>
          <Link
            href={marketingCatHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 py-2 text-sm font-semibold text-[var(--semantic-brand)] hover:bg-[var(--semantic-panel-muted)]"
          >
            CAT overview (marketing)
          </Link>
        </div>
        {adaptiveError ? <p className="mt-2 text-sm text-[var(--semantic-danger)]">{adaptiveError}</p> : null}

        {topicClusters.length > 0 ? (
          <div className="mt-8 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-[var(--theme-heading-text)]"
              onClick={() => setAdvancedOpen((o) => !o)}
              aria-expanded={advancedOpen}
            >
              <span>Advanced: refine by lesson topic (optional)</span>
              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {advancedOpen ? (
              <div className="mt-3 space-y-2 border-t border-[var(--semantic-border-soft)] pt-3">
                {selected.size !== 1 ? (
                  <p className="text-xs text-[var(--theme-muted-text)]">
                    Select exactly one body system above to narrow lesson-level topics.
                  </p>
                ) : filteredClusters.length === 0 ? (
                  <p className="text-xs text-[var(--theme-muted-text)]">No lesson-topic clusters matched this system.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="advanced-topic-refine-list">
                    {filteredClusters.map((c) => (
                      <li
                        key={c.topicSlug}
                        className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-xs"
                      >
                        <p className="font-semibold text-[var(--theme-heading-text)]">{c.label}</p>
                        <p className="text-[var(--theme-muted-text)]">{c.count} questions</p>
                        <Link
                          href={pathwayAppQuestionBankTopicHref(pathway, c.label, c.topicSlug)}
                          className="mt-1 inline-block font-semibold text-[var(--semantic-brand)] hover:underline"
                        >
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

      <section className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4" aria-label="Quick links">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Quick links</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={lessonsHref} className="text-[var(--semantic-brand)] hover:underline">
            Browse lessons
          </Link>
          <Link href={catAppHref} className="text-[var(--semantic-brand)] hover:underline">
            CAT (app)
          </Link>
          <Link href={startMixedHref} className="text-[var(--semantic-brand)] hover:underline">
            Mixed quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
