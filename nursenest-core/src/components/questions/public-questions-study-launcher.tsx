"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, Layers, SlidersHorizontal } from "lucide-react";
import type { PracticeBodySystemHubAggregate } from "@/lib/questions/pathway-practice-body-system-aggregates";
import type { PracticeBodySystemHubId } from "@/lib/questions/normalize-question-body-system";
import type { PracticeSessionStudyFilter } from "@/lib/practice-question-session/constants";

const FILTER_OPTIONS: Array<{ id: PracticeSessionStudyFilter; label: string }> = [
  { id: "weak", label: "Weak Areas" },
  { id: "unseen", label: "Unseen" },
  { id: "incorrect", label: "Incorrect Questions" },
  { id: "bookmarked", label: "Bookmarked" },
  { id: "all", label: "All Questions" },
];

const QUESTION_COUNT_PRESETS = [10, 20, 30, 50] as const;

type Props = {
  pathwayId: string;
  examDisplayName: string;
  aggregates: PracticeBodySystemHubAggregate[];
  loginBaseHref: string;
  callbackParam: string;
  alliedProfessionKey?: string;
  linearPracticePoolUsable: boolean;
};

export function PublicQuestionsStudyLauncher({
  pathwayId,
  examDisplayName,
  aggregates,
  loginBaseHref,
  callbackParam,
  alliedProfessionKey = "",
  linearPracticePoolUsable,
}: Props) {
  const visibleAggregates = aggregates.filter((row) => row.id !== "uncategorized");
  const defaultHub = visibleAggregates.find((row) => row.questionCount > 0)?.id ?? visibleAggregates[0]?.id;
  const [selectedHubs, setSelectedHubs] = useState<PracticeBodySystemHubId[]>(defaultHub ? [defaultHub] : []);
  const [selectedFilters, setSelectedFilters] = useState<PracticeSessionStudyFilter[]>([]);
  const [questionCount, setQuestionCount] = useState<(typeof QUESTION_COUNT_PRESETS)[number]>(20);

  const startHref = useMemo(() => {
    const study = new URLSearchParams();
    study.set("pathwayId", pathwayId);
    study.set("preset", "pathway_mixed");
    study.set("count", String(questionCount));
    study.set("shuffle", "true");

    if (selectedHubs.length > 0 && selectedHubs.length < visibleAggregates.length) {
      study.set("practiceHubIds", selectedHubs.join(","));
    }
    if (selectedFilters.includes("weak")) study.set("studyFilter", "weak");
    if (selectedFilters.includes("unseen")) study.set("studyFilter", "unseen");
    if (selectedFilters.includes("incorrect")) study.set("studyFilter", "incorrect");
    if (selectedFilters.includes("bookmarked")) study.set("studyFilter", "bookmarked");
    if (alliedProfessionKey.trim()) study.set("alliedProfession", alliedProfessionKey.trim().toLowerCase());
    if (selectedHubs.length > 0 && selectedHubs.length < visibleAggregates.length) {
      const topics = new Set<string>();
      const byId = new Map(visibleAggregates.map((row) => [row.id, row]));
      for (const hubId of selectedHubs) {
        const row = byId.get(hubId);
        if (!row) continue;
        for (const topic of row.matchingTopics) {
          if (topic.trim()) topics.add(topic.trim());
        }
      }
      if (topics.size > 0) study.set("topicNames", [...topics].join(","));
    }

    const callbackPath = `/app/questions/start?${study.toString()}`;
    const login = new URLSearchParams();
    login.set(callbackParam, callbackPath);
    return `${loginBaseHref}?${login.toString()}`;
  }, [
    alliedProfessionKey,
    callbackParam,
    loginBaseHref,
    pathwayId,
    questionCount,
    selectedFilters,
    selectedHubs,
    visibleAggregates.length,
  ]);

  function toggleHub(id: PracticeBodySystemHubId) {
    setSelectedHubs((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleFilter(id: PracticeSessionStudyFilter) {
    if (id === "all") {
      setSelectedFilters([]);
      return;
    }
    setSelectedFilters((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const selectedHubLabel =
    selectedHubs.length === 0 || selectedHubs.length === visibleAggregates.length
      ? "All categories"
      : `${selectedHubs.length} ${selectedHubs.length === 1 ? "category" : "categories"}`;
  const allQuestionsActive = selectedFilters.length === 0;

  return (
    <section
      className="mx-auto max-w-5xl rounded-[1.5rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.85)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8"
      aria-labelledby="questions-setup-title"
      data-testid="public-questions-study-launcher"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="nn-premium-home-eyebrow justify-center">Practice Questions</p>
        <h1
          id="questions-setup-title"
          className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl"
        >
          Choose What to Practice
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base">
          Select categories, target the question types that need attention, and begin {examDisplayName} practice.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        <section aria-labelledby="questions-categories-title">
          <div className="mb-4 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                1. Systems & Categories
              </p>
              <h2 id="questions-categories-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
                Pick your focus
              </h2>
            </div>
            <p className="text-sm font-medium text-[var(--theme-muted-text)]">{selectedHubLabel}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleAggregates.map((row) => {
              const active = selectedHubs.includes(row.id);
              const countLabel = row.questionCount > 0 ? `${row.questionCount} questions` : "Building";
              return (
                <button
                  key={row.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleHub(row.id)}
                  className={`group flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border p-4 text-center text-sm font-semibold transition ${
                    active
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] text-[var(--theme-heading-text)] shadow-[0_12px_28px_rgba(15,23,42,0.07)]"
                      : "border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.82)] text-[var(--theme-heading-text)] shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))]"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                      active
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--theme-muted-text)]"
                    }`}
                    aria-hidden
                  >
                    {active ? <Check className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                  </span>
                  <span className="leading-snug">{row.label}</span>
                  <span className="text-[11px] font-medium leading-none text-[var(--theme-muted-text)]">{countLabel}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="questions-filters-title">
          <div className="mb-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
              2. Study Filters
            </p>
            <h2 id="questions-filters-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
              Target your review
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {FILTER_OPTIONS.map((filter) => {
              const active = filter.id === "all" ? allQuestionsActive : selectedFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFilter(filter.id)}
                  className={`inline-flex min-h-[42px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                    active
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] nn-text-on-solid-fill shadow-[0_10px_22px_color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]"
                      : "border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.82)] text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="questions-count-title">
          <div className="mb-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
              3. Question Count
            </p>
            <h2 id="questions-count-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
              Set session size
            </h2>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="flex flex-wrap justify-center gap-2">
              {QUESTION_COUNT_PRESETS.map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={questionCount === count}
                  onClick={() => setQuestionCount(count)}
                  className={`inline-flex h-11 min-w-[68px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                    questionCount === count
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[var(--theme-muted-text)]">
              <SlidersHorizontal className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
              {questionCount} questions selected
            </p>
          </div>
        </section>

        <section className="text-center" aria-label="Start practice questions">
          {linearPracticePoolUsable ? (
            <Link
              href={startHref}
              className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-7 text-sm font-semibold nn-text-on-solid-fill shadow-[0_16px_34px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
            >
              Start Questions
            </Link>
          ) : (
            <p className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] px-4 py-3 text-sm font-medium text-[var(--theme-muted-text)]">
              <ClipboardList className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
              This question bank is still filling in. Lessons and flashcards remain available while publishing continues.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
