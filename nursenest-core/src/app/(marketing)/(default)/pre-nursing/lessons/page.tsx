import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { AlliedMarketingPagination } from "@/components/marketing/allied-pagination";
import { PreNursingMilestoneStrip } from "@/components/pre-nursing/pre-nursing-milestone-strip";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { PRE_NURSING_LESSON_HUB_PAGE_SIZE } from "@/lib/pre-nursing/pre-nursing-constants";
import { preNursingLessonsHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  EditableHeading,
  EditableText,
  preloadInlineContentMap,
} from "@/components/inline-content";

let preNursingStringsCache: Record<string, string> | null = null;

function getPreNursingStrings(): Record<string, string> {
  if (preNursingStringsCache) return preNursingStringsCache;
  preNursingStringsCache = require("@/content/pre-nursing/pre-nursing-strings-en.json") as Record<string, string>;
  return preNursingStringsCache;
}

const PRE_NURSING_LESSONS_INLINE_KEYS = [
  "inline.marketing.preNursing.lessons.kicker",
  "inline.marketing.preNursing.lessons.h1",
  "inline.marketing.preNursing.lessons.intro",
] as const;

// 🧊 ISR: revalidate: 86400 already set below
export const revalidate = 86400;

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const sp = await searchParams;
      const page = Math.max(1, Number(sp.page ?? "1") || 1);
      const title =
        page > 1
          ? `Pre-Nursing lessons (page ${page}) | NurseNest`
          : "Free Pre-Nursing lessons & modules | NurseNest";
      const description =
        "Free interactive Pre-Nursing modules: sciences, terminology, communication, and clinical reasoning with fast loading. No subscription required.";
      const path = page > 1 ? `/pre-nursing/lessons?page=${page}` : "/pre-nursing/lessons";
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: { title, description, url: absoluteUrl(path), type: "website" },
        twitter: { card: "summary_large_image", title, description },
        ...(page > 1 ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: "/pre-nursing/lessons", routeGroup: "marketing.default.pre_nursing.lessons" },
  );
}

export default async function PreNursingLessonsHubPage({ searchParams }: Props) {
  const dict = getPreNursingStrings();
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const all = [...PRE_NURSING_MODULE_REGISTRY].filter(pathwayLessonHasRenderableHubSlug);
  const pageSize = PRE_NURSING_LESSON_HUB_PAGE_SIZE;
  const total = all.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageRequested, pageCount);
  if (pageRequested > pageCount) {
    redirect(pageCount > 1 ? `/pre-nursing/lessons?page=${pageCount}` : "/pre-nursing/lessons");
  }
  const skip = (page - 1) * pageSize;
  const slice = all.slice(skip, skip + pageSize);

  const { crumbs, schemaItems } = preNursingLessonsHubBreadcrumbs(page);
  const preNursingLessonsInlinePreloaded = await preloadInlineContentMap([...PRE_NURSING_LESSONS_INLINE_KEYS]);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="lessons_hub" />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <header className="mb-6">
          <EditableText
            as="p"
            className="text-xs font-medium uppercase tracking-wide text-primary"
            contentKey="inline.marketing.preNursing.lessons.kicker"
            defaultText="Pre-Nursing"
            preloaded={preNursingLessonsInlinePreloaded}
          />
          <EditableHeading
            as="h1"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl"
            contentKey="inline.marketing.preNursing.lessons.h1"
            defaultText="Lesson Library"
            preloaded={preNursingLessonsInlinePreloaded}
          />
          <EditableText
            as="p"
            className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-[var(--theme-body-text)] sm:text-base"
            contentKey="inline.marketing.preNursing.lessons.intro"
            defaultText="Review concepts by topic. Open any lesson to study, then move into flashcards, practice questions, and exams."
            preloaded={preNursingLessonsInlinePreloaded}
          />
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-normal">
            <Link href="/pre-nursing" className="text-primary hover:underline">
              ← Pre-Nursing overview
            </Link>
            <Link href="/pre-nursing/study-plan" className="text-[var(--theme-muted-text)] hover:text-primary hover:underline">
              Study planning
            </Link>
          </div>
        </header>

        <ul className="grid list-none grid-cols-1 items-stretch gap-4 p-0 sm:grid-cols-2">
          {slice.map((m) => (
            <li key={m.slug} className="flex min-h-[12.5rem] sm:min-h-[13.5rem]">
              <Link
                href={`/pre-nursing/lessons/${m.slug}`}
                className="nn-card nn-card-interactive group flex w-full flex-1 flex-col p-5"
                data-testid={`pre-nursing-lesson-${m.slug}`}
              >
                <h2 className="line-clamp-2 shrink-0 text-lg font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
                  {dict[m.titleKey] ?? m.slug}
                </h2>
                <p className="mt-2 min-h-0 flex-1 text-sm font-normal leading-relaxed text-[var(--theme-body-text)] line-clamp-3">
                  {dict[m.subtitleKey] ?? ""}
                </p>
                <p className="mt-auto border-t border-[var(--semantic-border-soft)] pt-3 text-xs font-normal text-[var(--semantic-brand)]">
                  {m.lessons} {dict["preNursing.interactiveLessons"] ?? "interactive lessons"}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <AlliedMarketingPagination
          basePath="/pre-nursing/lessons"
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={pageSize}
          label="modules"
        />

        <section className="mt-10">
          <PreNursingMilestoneStrip sourceSurface="lessons_hub" />
        </section>
      </div>
    </div>
  );
}
