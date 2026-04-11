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
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { PRE_NURSING_LESSON_HUB_PAGE_SIZE } from "@/lib/pre-nursing/pre-nursing-constants";
import { preNursingLessonsHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const dict = strings as Record<string, string>;

export const dynamic = "force-dynamic";
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
        "Free interactive Pre-Nursing modules: sciences, terminology, communication, and clinical reasoning, paginated for fast loads. No subscription required.";
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

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="lessons_hub" />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <PreNursingMilestoneStrip sourceSurface="lessons_hub" />

        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Free · Pre-Nursing</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            Pre-nursing lessons &amp; modules
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Every card opens a full interactive module. This list is paginated so we never ship the entire catalog in one
            HTML response.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/pre-nursing" className="font-semibold text-primary hover:underline">
              ← Pre-Nursing overview
            </Link>
            <Link href="/pre-nursing/study-plan" className="font-semibold text-muted-foreground hover:text-primary hover:underline">
              Study planning
            </Link>
          </div>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {slice.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/pre-nursing/lessons/${m.slug}`}
                className="nn-card nn-card-interactive block p-5"
                data-testid={`pre-nursing-lesson-${m.slug}`}
              >
                <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{dict[m.titleKey] ?? m.slug}</h2>
                <p className="mt-2 text-sm text-muted">{dict[m.subtitleKey] ?? ""}</p>
                <p className="mt-3 text-xs font-medium text-primary">
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
      </div>
    </div>
  );
}
