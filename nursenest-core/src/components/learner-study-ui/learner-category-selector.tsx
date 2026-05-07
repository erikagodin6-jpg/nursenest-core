import { useMemo } from "react";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { LearnerCategoryCard } from "@/components/learner-study-ui/learner-category-card";

function hubVisualKeyForCanonical(id: string): string {
  const s = id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return s.length > 0 ? s : "fundamentals";
}

export function LearnerCategorySelector({
  countsBySystem,
  selectedCanonicalIds,
  onToggleCanonical,
  search,
  onSearchChange,
  heading = "Exam categories & body systems",
  headingId,
  intro,
  searchPlaceholder = "Search categories…",
}: {
  countsBySystem: Record<CanonicalStudyCategoryId, number>;
  selectedCanonicalIds: string[];
  onToggleCanonical: (id: CanonicalStudyCategoryId) => void;
  search: string;
  onSearchChange: (v: string) => void;
  heading?: string;
  /** Optional stable id for `aria-labelledby` on wrapping layouts. */
  headingId?: string;
  intro?: string;
  searchPlaceholder?: string;
}) {
  const allIds = CANONICAL_STUDY_CATEGORIES.map((s) => s.id);
  const isCardSelected = (id: CanonicalStudyCategoryId) =>
    selectedCanonicalIds.length === 0 ? true : selectedCanonicalIds.includes(id);

  const filtered = CANONICAL_STUDY_CATEGORIES.filter((s) =>
    search ? s.label.toLowerCase().includes(search.toLowerCase()) : true,
  );

  const poolMax = useMemo(() => {
    let m = 0;
    for (const s of CANONICAL_STUDY_CATEGORIES) {
      const n = countsBySystem[s.id] ?? 0;
      if (n > m) m = n;
    }
    return Math.max(1, m);
  }, [countsBySystem]);

  return (
    <section className="space-y-3 sm:space-y-4" data-nn-learner-category-selector>
      <div>
        <h3
          id={headingId}
          className="text-lg font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-xl"
        >
          {heading}
        </h3>
        {intro ? <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{intro}</p> : null}
      </div>
      <input
        type="search"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--semantic-surface)_70%,transparent)] placeholder:text-[var(--semantic-text-muted)]"
        data-nn-e2e-body-system-search
      />
      <div className="nn-qa-pathway-lessons-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((s) => {
          const visual = getLessonHubSystemVisual(hubVisualKeyForCanonical(s.id));
          const Icon = visual.icon;
          const count = countsBySystem[s.id] ?? 0;
          return (
            <LearnerCategoryCard
              key={s.id}
              id={s.id}
              label={s.label}
              count={count}
              poolMax={poolMax}
              selected={isCardSelected(s.id)}
              onToggle={() => onToggleCanonical(s.id)}
              icon={Icon}
              accentVar={visual.accentVar}
            />
          );
        })}
      </div>
    </section>
  );
}
