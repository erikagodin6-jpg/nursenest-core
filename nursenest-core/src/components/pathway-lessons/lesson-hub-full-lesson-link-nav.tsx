import Link from "next/link";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

/**
 * Screen-reader + crawler full index of lesson detail links (not limited to per-section card previews).
 * Placed inside `#pathway-lesson-library` so curl/grep and bots see every public lesson URL in initial HTML.
 */
export function LessonHubFullLessonLinkNav(props: {
  lessons: readonly PathwayLessonRecord[];
  lessonsBasePath: string;
}) {
  const { lessons, lessonsBasePath } = props;
  if (lessons.length === 0) return null;

  return (
    <nav aria-label="All lessons in this pathway" className="sr-only">
      <ul>
        {lessons.map((l) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
          if (!href) return null;
          return (
            <li key={l.slug}>
              <Link href={href} tabIndex={-1}>
                {l.title.trim() || l.slug}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
