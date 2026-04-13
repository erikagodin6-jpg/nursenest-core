import Link from "next/link";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";

type Props = {
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  maxItems?: number;
};

export function PathwayHighYieldStart({ lessons, lessonsBasePath, maxItems = 6 }: Props) {
  const mustKnow = lessons
    .filter((lesson) => lesson.activeExamMeta?.yieldLevel === "must_know")
    .filter(pathwayLessonHasRenderableHubSlug)
    .slice(0, Math.max(1, maxItems));

  if (mustKnow.length === 0) return null;

  return (
    <section className="nn-study-card nn-study-card--wash p-5 sm:p-6" aria-labelledby="pathway-high-yield-start-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="nn-marketing-label text-primary">Recommended first</p>
          <h2 id="pathway-high-yield-start-heading" className="nn-marketing-h3 mt-1 text-[var(--theme-heading-text)]">
            Start with high-yield topics
          </h2>
        </div>
        <Link
          href="#pathway-lesson-library"
          className="nn-marketing-body-sm shrink-0 font-semibold text-primary underline underline-offset-2 hover:text-primary/90"
        >
          Jump to full library
        </Link>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {mustKnow.map((lesson) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
          if (!href) return null;
          return (
            <li key={lesson.slug}>
              <Link
                href={href}
                className="block rounded-lg border border-border bg-card/80 p-4 transition hover:border-primary/35 hover:bg-card"
              >
                <span className="nn-marketing-caption block text-primary">Must Know</span>
                <span className="mt-1 block font-semibold text-[var(--theme-heading-text)]">{lesson.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

