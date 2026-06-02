"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ClinicalImageViewer } from "@/components/clinical-images/clinical-image-viewer";
import {
  CLINICAL_IMAGE_CATEGORY_LABELS,
  type ClinicalImageCategory,
  type ClinicalImageLibraryItem,
} from "@/lib/clinical-images/clinical-image-library";

export function ClinicalImageLibraryClient({
  items,
  coverage,
}: {
  items: ClinicalImageLibraryItem[];
  coverage: Array<{ category: ClinicalImageCategory; label: string; count: number }>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClinicalImageCategory | "all">("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return [
        item.title,
        item.topic,
        CLINICAL_IMAGE_CATEGORY_LABELS[item.category],
        ...item.clinicalConcepts,
        ...item.nclexObjectives,
      ].join(" ").toLowerCase().includes(q);
    });
  }, [category, items, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
          Visual Learning
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          Clinical Image Library
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
          Verified clinical images for image-based questions, hotspot questions, SATA image prompts, and clinical judgment cases across RN, RPN, and NP pathways.
        </p>
        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4">
            <Search className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
            <span className="sr-only">Search clinical images</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dermatology, eye conditions, ECG..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--semantic-text-primary)] outline-none placeholder:text-[var(--semantic-text-muted)]"
            />
          </label>
          <label className="sr-only" htmlFor="clinical-image-category">Category</label>
          <select
            id="clinical-image-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ClinicalImageCategory | "all")}
            className="min-h-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)]"
          >
            <option value="all">All categories</option>
            {coverage.map((row) => (
              <option key={row.category} value={row.category}>
                {row.label} ({row.count})
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Clinical image category coverage">
        {coverage.map((row) => (
          <article
            key={row.category}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
          >
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{row.label}</p>
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
              {row.count > 0 ? `${row.count} verified image${row.count === 1 ? "" : "s"}` : "Needs asset upload"}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2" aria-label="Clinical image results">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]"
          >
            <ClinicalImageViewer
              image={{
                url: item.url,
                alt: item.alt,
                title: item.title,
                caption: item.caption,
              }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {item.audiences.map((audience) => (
                <span key={audience} className="rounded-full bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
                  {audience}
                </span>
              ))}
              <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
                {CLINICAL_IMAGE_CATEGORY_LABELS[item.category]}
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Question Use</dt>
                <dd className="mt-1 text-[var(--semantic-text-secondary)]">{item.questionIntegrations.map((v) => v.replace(/_/g, " ")).join(", ")}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Accessibility</dt>
                <dd className="mt-1 text-[var(--semantic-text-secondary)]">{item.accessibilityNote}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
