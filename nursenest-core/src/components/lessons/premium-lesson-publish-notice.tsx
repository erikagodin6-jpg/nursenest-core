import type { PathwayLessonPremiumValidation } from "@/lib/lessons/pathway-lesson-types";

/** Shown when a premium-structured lesson fails automated publish-readiness checks (SEO / depth / links). */
export function PremiumLessonPublishNotice({ validation }: { validation: PathwayLessonPremiumValidation | undefined }) {
  if (!validation || validation.premiumReady) return null;
  return (
    <aside
      className="nn-card border p-3 text-xs text-[var(--theme-body-text)]"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-warning) 38%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-warm) 48%, var(--semantic-surface))",
      }}
    >
      <p className="font-semibold text-[var(--theme-heading-text)]">Content standard check</p>
      <p className="mt-1 text-[var(--semantic-text-secondary)]">
        This lesson is flagged for editorial expansion before we treat it as fully publish-ready for premium SEO surfacing.
      </p>
      {validation.issues.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--semantic-text-secondary)]">
          {validation.issues.slice(0, 8).map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
