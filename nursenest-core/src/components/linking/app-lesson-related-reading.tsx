import "server-only";

import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  fetchRelatedBlogReadingLinksForPathwayLesson,
  type PathwayLessonAutoLinkSnapshot,
} from "@/lib/linking/automatic-internal-links";

/**
 * Public blog deep reads on the authenticated lesson page — tier-scoped via the same resolver as
 * marketing auto-links. Does not duplicate {@link PathwayLessonActions} (flashcards / bank / hub).
 */
export async function AppLessonRelatedReading(props: {
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonAutoLinkSnapshot;
  locale: string;
}) {
  const links = await fetchRelatedBlogReadingLinksForPathwayLesson({
    pathway: props.pathway,
    lesson: props.lesson,
    locale: props.locale,
    max: 2,
  });
  if (links.length === 0) return null;

  return (
    <aside
      className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm"
      aria-label="Related reading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
        Related reading
      </p>
      <ul className="mt-2 space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
