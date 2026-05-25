"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Layers, SlidersHorizontal } from "lucide-react";

type SystemOption = {
  id: string;
  label: string;
};

type FilterId = "weak" | "unstudied" | "incorrect" | "recent";

const SYSTEM_OPTIONS: SystemOption[] = [
  { id: "respiratory", label: "Respiratory" },
  { id: "cardiovascular", label: "Cardiac" },
  { id: "pharmacology", label: "Pharmacology" },
  { id: "reproductive_maternal_newborn", label: "Maternity" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "mental_health", label: "Mental Health" },
  { id: "fundamentals_safety", label: "Fundamentals" },
  { id: "gastrointestinal", label: "Med-Surg" },
  { id: "renal_urinary", label: "Renal" },
  { id: "neurological", label: "Neurology" },
  { id: "endocrine", label: "Endocrine" },
  { id: "infection_control", label: "Infection Control" },
];

const FILTER_OPTIONS: Array<{ id: FilterId | "all"; label: string }> = [
  { id: "weak", label: "Weak Areas" },
  { id: "unstudied", label: "Unstudied" },
  { id: "incorrect", label: "Incorrect Cards" },
  { id: "recent", label: "Recently Missed" },
  { id: "all", label: "All Cards" },
];

const CARD_COUNT_PRESETS = [10, 25, 50, 100, 250] as const;

type Props = {
  pathwayId: string;
  loginBaseHref: string;
  callbackParam: string;
};

export function PublicFlashcardsStudyLauncher({
  pathwayId,
  loginBaseHref,
  callbackParam,
}: Props) {
  const [selectedSystems, setSelectedSystems] = useState<string[]>(["respiratory"]);
  const [selectedFilters, setSelectedFilters] = useState<FilterId[]>([]);
  const [cardCount, setCardCount] = useState<(typeof CARD_COUNT_PRESETS)[number]>(25);

  const startHref = useMemo(() => {
    const study = new URLSearchParams();
    study.set("pathwayId", pathwayId);
    study.set("includeCards", "1");
    study.set("shuffle", "1");
    study.set("cardLimit", String(cardCount));
    study.set("sourceKind", "all");

    if (selectedSystems.length > 0 && selectedSystems.length < SYSTEM_OPTIONS.length) {
      study.set("categories", selectedSystems.join(","));
    }
    if (selectedFilters.includes("weak")) study.set("weakOnly", "1");
    if (selectedFilters.includes("unstudied")) study.set("notStudiedOnly", "1");
    if (selectedFilters.includes("incorrect") || selectedFilters.includes("recent")) {
      study.set("incorrectOnly", "1");
    }
    if (selectedFilters.includes("recent")) {
      study.set("recentStudiedOnly", "1");
      study.set("recentDays", "14");
    }

    const callbackPath = `/app/flashcards/custom?${study.toString()}`;
    const login = new URLSearchParams();
    login.set(callbackParam, callbackPath);
    return `${loginBaseHref}?${login.toString()}`;
  }, [callbackParam, cardCount, loginBaseHref, pathwayId, selectedFilters, selectedSystems]);

  function toggleSystem(id: string) {
    setSelectedSystems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleFilter(id: FilterId | "all") {
    if (id === "all") {
      setSelectedFilters([]);
      return;
    }
    setSelectedFilters((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const allCardsActive = selectedFilters.length === 0;
  const selectedSystemLabel =
    selectedSystems.length === 0 || selectedSystems.length === SYSTEM_OPTIONS.length
      ? "All systems"
      : `${selectedSystems.length} ${selectedSystems.length === 1 ? "system" : "systems"}`;

  return (
    <section
      className="mx-auto max-w-5xl rounded-[1.5rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.85)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8"
      aria-labelledby="flashcards-setup-title"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="nn-premium-home-eyebrow justify-center">Flashcards</p>
        <h1
          id="flashcards-setup-title"
          className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl"
        >
          Choose What to Study
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base">
          Select a system, target the cards that need attention, and begin.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        <section aria-labelledby="flashcards-systems-title">
          <div className="mb-4 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                1. Systems & Categories
              </p>
              <h2 id="flashcards-systems-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
                Pick your focus
              </h2>
            </div>
            <p className="text-sm font-medium text-[var(--theme-muted-text)]">{selectedSystemLabel}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SYSTEM_OPTIONS.map((system) => {
              const active = selectedSystems.includes(system.id);
              return (
                <button
                  key={system.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSystem(system.id)}
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
                  <span className="leading-snug">{system.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="flashcards-filters-title">
          <div className="mb-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
              2. Study Filters
            </p>
            <h2 id="flashcards-filters-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
              Target your review
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {FILTER_OPTIONS.map((filter) => {
              const active = filter.id === "all" ? allCardsActive : selectedFilters.includes(filter.id);
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

        <section aria-labelledby="flashcards-count-title">
          <div className="mb-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
              3. Card Count
            </p>
            <h2 id="flashcards-count-title" className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
              Set session size
            </h2>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(15,23,42,0.06)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="flex flex-wrap justify-center gap-2">
              {CARD_COUNT_PRESETS.map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={cardCount === count}
                  onClick={() => setCardCount(count)}
                  className={`inline-flex h-11 min-w-[68px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                    cardCount === count
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
              {cardCount} cards selected
            </p>
          </div>
        </section>

        <section className="text-center" aria-label="Start flashcards">
          <Link
            href={startHref}
            className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-7 text-sm font-semibold nn-text-on-solid-fill shadow-[0_16px_34px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
          >
            Start Flashcards
          </Link>
        </section>
      </div>
    </section>
  );
}
