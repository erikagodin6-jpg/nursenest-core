"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_PRACTICE_COUNT,
  DEFAULT_PRACTICE_MODE,
  DEFAULT_PRACTICE_SOURCE,
  DEFAULT_SHUFFLE,
  PRACTICE_CATEGORY_LABEL,
  PRACTICE_CATEGORY_SLUGS,
  PRACTICE_QUESTION_COUNTS,
  type PracticeCategorySlug,
  type PracticeSessionMode,
  type PracticeSessionSource,
} from "@/lib/practice-question-session/constants";
import { practiceSessionUrl } from "@/lib/practice-question-session/parse-session-search-params";

const SOURCE_META: { id: PracticeSessionSource; label: string; hint: string }[] = [
  { id: "body_systems", label: "Body systems", hint: "Organize by physiologic system." },
  { id: "nursing_categories", label: "Nursing categories", hint: "Clinical domains and NCLEX-style groupings." },
  { id: "weak_areas", label: "Weak areas", hint: "Prioritize topics trending incorrect in your history." },
  { id: "previously_incorrect", label: "Previously incorrect", hint: "Reuse items you have missed before." },
  { id: "not_studied", label: "Not studied", hint: "Favor questions you have not attempted in this browser." },
  { id: "mixed_review", label: "Mixed review", hint: "Balanced draw across your eligible pathway pool." },
];

function needsCategory(source: PracticeSessionSource): boolean {
  return source === "body_systems" || source === "nursing_categories";
}

export function PracticeQuestionSessionSetupClient({
  defaultPathwayId,
  pathwayOptions,
}: {
  defaultPathwayId: string | null;
  pathwayOptions: { id: string; label: string }[];
}) {
  const router = useRouter();
  const urlParams = useSearchParams();
  const [pathwayId, setPathwayId] = useState<string | null>(() => {
    const fromUrl = urlParams.get("pathwayId")?.trim();
    if (fromUrl && pathwayOptions.some((p) => p.id === fromUrl)) return fromUrl;
    return defaultPathwayId;
  });

  const [source, setSource] = useState<PracticeSessionSource>(DEFAULT_PRACTICE_SOURCE);
  const [categorySlug, setCategorySlug] = useState<PracticeCategorySlug>("cardiovascular");
  const [count, setCount] = useState<number>(DEFAULT_PRACTICE_COUNT);
  const [mode, setMode] = useState<PracticeSessionMode>(DEFAULT_PRACTICE_MODE);
  const [shuffle, setShuffle] = useState(DEFAULT_SHUFFLE);

  const effectivePathwayId = pathwayId ?? defaultPathwayId;

  const reset = useCallback(() => {
    setSource(DEFAULT_PRACTICE_SOURCE);
    setCategorySlug("cardiovascular");
    setCount(DEFAULT_PRACTICE_COUNT);
    setMode(DEFAULT_PRACTICE_MODE);
    setShuffle(DEFAULT_SHUFFLE);
    setPathwayId(defaultPathwayId);
  }, [defaultPathwayId]);

  const startHref = useMemo(
    () =>
      practiceSessionUrl({
        pathwayId: effectivePathwayId,
        source,
        categorySlug: needsCategory(source) ? categorySlug : null,
        count,
        mode,
        shuffle,
      }),
    [effectivePathwayId, source, categorySlug, count, mode, shuffle],
  );

  const start = useCallback(() => {
    if (!effectivePathwayId) return;
    router.push(startHref);
  }, [router, startHref, effectivePathwayId]);

  const categoryPick = needsCategory(source);

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
          Practice Question Session
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mx-0">
          Build a focused quiz by system, category, weak area, or previous mistakes.
        </p>
      </header>

      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] p-5 shadow-sm sm:p-8">
        {pathwayOptions.length > 1 ? (
          <section className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Exam track</p>
            <select
              className="w-full max-w-md rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--semantic-text-primary)]"
              value={pathwayId ?? ""}
              onChange={(e) => setPathwayId(e.target.value || null)}
            >
              {pathwayOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </section>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              A. Choose practice source
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SOURCE_META.map((s) => {
                const on = source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSource(s.id)}
                    className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                      on
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)] shadow-sm"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    <span className="font-semibold">{s.label}</span>
                    <span className="mt-1 block text-xs font-normal text-[var(--semantic-text-muted)]">{s.hint}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              B. Choose system / category
            </p>
            {categoryPick ? (
              <div className="grid max-h-[14rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:max-h-[18rem]">
                {PRACTICE_CATEGORY_SLUGS.map((slug) => {
                  const on = categorySlug === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setCategorySlug(slug)}
                      className={`rounded-lg border px-2.5 py-2 text-left text-xs font-semibold sm:text-sm ${
                        on
                          ? "border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))]"
                          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                      }`}
                    >
                      {PRACTICE_CATEGORY_LABEL[slug]}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]/80 px-4 py-6 text-sm text-[var(--semantic-text-muted)]">
                Source does not require a single category. The session will use your other filters instead.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              C. Choose question count
            </p>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_QUESTION_COUNTS.map((n) => {
                const on = count === n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCount(n)}
                    className={`min-h-11 min-w-[4.5rem] rounded-full border px-4 text-sm font-semibold ${
                      on
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">D. Choose mode</p>
            <div className="space-y-2">
              {(
                [
                  { id: "tutor" as const, title: "Tutor mode", body: "Show rationale after each question." },
                  { id: "exam" as const, title: "Exam mode", body: "Hold rationales until you finish the set." },
                  { id: "weak_area" as const, title: "Weak-area mode", body: "Bias selection toward your weak topics." },
                ] as const
              ).map((row) => {
                const on = mode === row.id;
                return (
                  <button
                    key={row.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setMode(row.id)}
                    className={`flex w-full flex-col rounded-xl border px-4 py-3 text-left text-sm transition ${
                      on
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{row.title}</span>
                    <span className="text-xs text-[var(--semantic-text-muted)]">{row.body}</span>
                  </button>
                );
              })}
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm">
              <input
                type="checkbox"
                className="size-5 rounded border-[var(--semantic-border-soft)]"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
              />
              <span className="font-medium text-[var(--semantic-text-primary)]">Shuffle questions</span>
            </label>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--semantic-border-soft)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={!effectivePathwayId}
            onClick={() => start()}
            className="nn-btn-primary inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-full px-8 text-base font-semibold shadow-md disabled:opacity-50"
          >
            Start Practice
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}
