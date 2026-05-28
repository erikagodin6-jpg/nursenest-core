"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Baby,
  Brain,
  Droplets,
  HeartPulse,
  Leaf,
  Pill,
  ShieldCheck,
  Syringe,
  Wind,
} from "lucide-react";
import { SharedStudySetupLayout, SharedStudySetupSurface } from "@/components/learner-study-ui";
import { LearnerCategoryCard } from "@/components/learner-study-ui/learner-category-card";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { LeafWatermark } from "@/components/brand/leaf-watermark";
import {
  PHARMACOLOGY_CATEGORIES,
  pharmacologyFlashcardsHref,
  pharmacologyLessonsHref,
  type PharmacologyCategory,
} from "@/lib/pharmacology/pharmacology-learning-system";

const ICONS = {
  activity: Activity,
  baby: Baby,
  brain: Brain,
  droplet: Droplets,
  heart: HeartPulse,
  leaf: Leaf,
  pill: Pill,
  shield: ShieldCheck,
  syringe: Syringe,
  wind: Wind,
} as const;

function categorySearchMatch(category: PharmacologyCategory, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return `${category.title} ${category.description} ${category.safetyFocus} ${category.lessonTopic}`
    .toLowerCase()
    .includes(q);
}

export function PharmacologyHubClient({
  pathwayId,
  pathwayDisplayName,
}: {
  pathwayId: string;
  pathwayDisplayName: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selected = useMemo(
    () => PHARMACOLOGY_CATEGORIES.find((category) => category.id === selectedId) ?? null,
    [selectedId],
  );
  const filtered = useMemo(
    () => PHARMACOLOGY_CATEGORIES.filter((category) => categorySearchMatch(category, search)),
    [search],
  );
  const poolMax = Math.max(1, ...PHARMACOLOGY_CATEGORIES.map((category) => category.estimatedCards));
  const startHref = pharmacologyFlashcardsHref(pathwayId, selected, selected?.id === "high-alert" ? 25 : 20);
  const lessonHref = pharmacologyLessonsHref(pathwayId, selected);
  const selectedTitle = selected?.title ?? "All medication safety categories";

  return (
    <SharedStudySetupLayout
      mode="flashcards"
      className="nn-pharmacology-hub nn-flashcards-hub-premium space-y-5 py-2 pb-24 sm:space-y-6 sm:py-3 md:pb-6"
      data-nn-premium-flashcard-convergence
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="pharmacology"
    >
      <h1 className="sr-only">Pharmacology Practice</h1>

      <header className="nn-flashcards-hub-workspace nn-flashcards-hub-hero nn-pharmacology-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--semantic-chart-2)_12%,var(--semantic-surface))_0%,var(--semantic-surface)_46%,color-mix(in_srgb,var(--semantic-chart-3)_10%,var(--semantic-surface))_100%)] px-5 py-6 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-2)_16%,transparent)] blur-3xl"
          aria-hidden
        />
        <LeafWatermark className="-right-8 -top-8 opacity-[0.13] sm:-right-12 sm:-top-12" imageClassName="opacity-90" size={220} />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-secondary))]">
              {pathwayDisplayName} · Medication safety mastery
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.9rem]">
              Pharmacology Practice
            </h2>
            <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.95rem]">
              Study medication classes through the same NurseNest flashcard workflow, with safety-first rationales,
              patient teaching, contraindications, and adaptive weak-medication review.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] px-3 py-1 text-[var(--semantic-text-primary)]">
                NCLEX medication reasoning
              </span>
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-3 py-1 text-[var(--semantic-text-primary)]">
                High-alert safety
              </span>
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-1 text-[var(--semantic-text-primary)]">
                Spaced repetition ready
              </span>
            </div>
          </div>

          <div className="nn-pharmacology-master-card rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_82%,transparent)] p-4 shadow-[var(--semantic-shadow-soft)] backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
              Today’s focus
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">{selectedTitle}</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {selected?.safetyFocus ?? "Medication safety, interactions, adverse effects, and patient teaching."}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] p-2">
                <strong className="block text-base text-[var(--semantic-text-primary)]">{selected?.estimatedCards ?? 780}</strong>
                cards
              </div>
              <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,var(--semantic-surface))] p-2">
                <strong className="block text-base text-[var(--semantic-text-primary)]">{selected?.masteryPct ?? 58}%</strong>
                mastery
              </div>
              <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] p-2">
                <strong className="block text-base text-[var(--semantic-text-primary)]">3</strong>
                due
              </div>
            </div>
          </div>
        </div>
      </header>

      <SharedStudySetupSurface className="nn-flashcards-deck-library-surface nn-pharmacology-system-surface">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
              Choose a medication system
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              The layout is familiar on purpose: pick a class, start a flashcard run, then review lessons and rationales
              in the same NurseNest study flow.
            </p>
          </div>
          <input
            type="search"
            placeholder="Search medications, risks, teaching..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-primary)] placeholder:text-[var(--semantic-text-muted)] sm:max-w-xs"
          />
        </div>

        <div className="nn-qa-pathway-lessons-grid mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((category) => {
            const Icon = ICONS[category.icon];
            return (
              <LearnerCategoryCard
                key={category.id}
                id={category.id}
                label={category.title}
                count={category.estimatedCards}
                poolMax={poolMax}
                selected={selectedId === category.id}
                onToggle={() => setSelectedId((current) => (current === category.id ? null : category.id))}
                icon={Icon}
                accentVar={category.accentVar}
                metaLine={`${category.masteryPct}% mastery · ${category.safetyFocus}`}
                showWeakBadge={category.masteryPct < 55 || category.id === "high-alert"}
                strengthPctOverride={category.masteryPct}
              />
            );
          })}
        </div>
      </SharedStudySetupSurface>

      <section className="nn-flashcards-deck-match-band nn-pharmacology-action-band rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_20%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-2)_86%,var(--semantic-text-secondary))]">
              Adaptive medication coaching
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">{selectedTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Start a focused pharmacology run, then use the paired lesson path to connect mechanism, adverse effects,
              nursing implications, and patient teaching.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <LearnerCtaLink href={startHref} className="inline-flex min-h-12 items-center justify-center px-7 text-base font-bold">
              Start Pharmacology Practice
            </LearnerCtaLink>
            <Link
              href={lessonHref}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            >
              Open lessons
            </Link>
          </div>
        </div>
      </section>
    </SharedStudySetupLayout>
  );
}
