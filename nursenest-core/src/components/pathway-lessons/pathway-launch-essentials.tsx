import Link from "next/link";
import { LAUNCH_BUNDLE_DIMENSION_LABEL } from "@/lib/lessons/pathway-launch-bundle";
import type { ResolvedPathwayLaunchBundle } from "@/lib/lessons/pathway-lesson-loader";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";

type Props = {
  bundle: ResolvedPathwayLaunchBundle;
  lessonsBasePath: string;
};

function lessonHref(lessonsBasePath: string, lesson: PathwayLessonRecord): string | null {
  if (!pathwayLessonHasRenderableHubSlug(lesson)) return null;
  return pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
}

/**
 * Premium “start here” deck above the paginated library. Links resolve independently of hub page slice.
 */
export function PathwayLaunchEssentials({ bundle, lessonsBasePath }: Props) {
  const { spec, resolved } = bundle;
  if (resolved.length === 0) return null;

  return (
    <section
      className="nn-study-card border border-primary/25 bg-[color-mix(in_srgb,var(--theme-primary)_6%,transparent)] p-5 sm:p-6"
      aria-labelledby="pathway-launch-essentials-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="nn-marketing-label text-primary">Recommended first</p>
          <h2 id="pathway-launch-essentials-heading" className="nn-marketing-h3 mt-1 text-[var(--theme-heading-text)]">
            {spec.headline}
          </h2>
          <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">{spec.subhead}</p>
        </div>
        <Link
          href="#pathway-lesson-library"
          className="nn-marketing-body-sm shrink-0 font-semibold text-primary underline underline-offset-2 hover:text-primary/90"
        >
          Jump to full library
        </Link>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {resolved.map(({ entry, lesson }) => {
          const href = lessonHref(lessonsBasePath, lesson);
          const dim = LAUNCH_BUNDLE_DIMENSION_LABEL[entry.dimension];
          const inner = (
            <>
              <span className="nn-marketing-caption block text-primary">{dim}</span>
              <span className="mt-1 block font-semibold text-[var(--theme-heading-text)]">{lesson.title}</span>
            </>
          );
          return (
            <li key={entry.slug}>
              {href ? (
                <Link
                  href={href}
                  className="block rounded-lg border border-border bg-card/80 p-4 transition hover:border-primary/35 hover:bg-card"
                >
                  {inner}
                </Link>
              ) : (
                <div className="rounded-lg border border-border bg-card/50 p-4 opacity-80">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="nn-marketing-caption mt-5 text-muted">
        Beyond this list: every other published lesson in this pathway — search, topic clusters, and pagination below.
      </p>
    </section>
  );
}
