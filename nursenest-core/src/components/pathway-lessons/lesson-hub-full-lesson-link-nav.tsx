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

  if (!Array.isArray(lessons) || lessons.length === 0) return null;

  return (
    <nav aria-label="All lessons in this pathway" className="sr-only">
      <ul>
        {lessons.map((lesson, index) => {
          const slug =
            typeof lesson.slug === "string" && lesson.slug.trim().length > 0
              ? lesson.slug.trim()
              : "";

          if (!slug) return null;

          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, slug);
          if (!href) return null;

          const title =
            typeof lesson.title === "string" && lesson.title.trim().length > 0
              ? lesson.title.trim()
              : slug;

          return (
            <li key={`${slug}-${index}`}>
              <Link href={href} tabIndex={-1}>
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
