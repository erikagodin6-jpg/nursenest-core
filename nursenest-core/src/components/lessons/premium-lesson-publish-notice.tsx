import type { PathwayLessonPremiumValidation } from "@/lib/lessons/pathway-lesson-types";

/** Shown when a premium-structured lesson fails automated publish-readiness checks (SEO / depth / links). */
export function PremiumLessonPublishNotice({ validation }: { validation: PathwayLessonPremiumValidation | undefined }) {
  if (!validation || validation.premiumReady) return null;
  return (
    <aside className="nn-card border-amber-200/80 bg-amber-50/40 p-3 text-xs text-[var(--theme-body-text)] dark:border-amber-900/40 dark:bg-amber-950/20">
      <p className="font-semibold text-amber-950 dark:text-amber-100">Content standard check</p>
      <p className="mt-1 text-muted-foreground">
        This lesson is flagged for editorial expansion before we treat it as fully publish-ready for premium SEO surfacing.
      </p>
      {validation.issues.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          {validation.issues.slice(0, 8).map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
