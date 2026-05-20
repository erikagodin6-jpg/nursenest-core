import type { PathwayLessonListLocaleInfo } from "@/lib/lessons/pathway-lesson-loader";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";

type Props = {
  listLocale: PathwayLessonListLocaleInfo;
};

/**
 * Shown when list/topic lesson cards are not in the requested content language (DB fallback or English catalog).
 */
export function PathwayLessonContentLocaleBanner({ listLocale }: Props) {
  const req = normalizePathwayLessonLocale(listLocale.requested);
  const eff = normalizePathwayLessonLocale(listLocale.effective);

  if (listLocale.catalogEnglishOnlySource && req !== "en") {
    return (
      <aside
        className="nn-card mb-6 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-muted"
        data-testid="pathway-lesson-list-locale-notice"
      >
        <p>
          Lesson titles and previews below are in <span className="font-medium text-foreground">English</span> (bundled
          catalog or import) while <span className="font-medium text-foreground">{req}</span> rows are not yet published
          for this pathway.
        </p>
      </aside>
    );
  }

  if (listLocale.usedEnglishFallback) {
    return (
      <aside
        className="nn-card mb-6 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-muted"
        data-testid="pathway-lesson-list-locale-notice"
      >
        <p>
          No published lessons matched <span className="font-medium text-foreground">{req}</span> for this pathway;
          showing <span className="font-medium text-foreground">{eff}</span> content instead.
        </p>
      </aside>
    );
  }

  return null;
}
