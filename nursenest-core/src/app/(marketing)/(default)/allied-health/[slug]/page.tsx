import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  getPathwayOrThrow,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonsIndexPath, alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { alliedProfessionBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return safeGenerateMetadata(
    async () => {
      const prof =
        getAlliedProfessionByHeroSegment(slug) ?? getAlliedProfessionByProfessionKey(slug);
      if (!prof) return { title: "Not found" };
      const path = alliedHealthSegmentPath(prof.segment);
      return {
        title: prof.title,
        description: prof.description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: { title: prof.title, description: prof.description, url: absoluteUrl(path), type: "website" },
      };
    },
    { pathname: `/allied-health/${slug}`, routeGroup: "marketing.default.allied_health.slug" },
  );
}

export default async function AlliedHealthSlugPage({ params }: Props) {
  const { slug } = await params;
  const prof = isAlliedHeroExamPrepSlug(slug)
    ? getAlliedProfessionByHeroSegment(slug)
    : getAlliedProfessionByProfessionKey(slug);
  if (!prof) notFound();

  if (!isAlliedHeroExamPrepSlug(slug)) {
    redirect(alliedHealthSegmentPath(prof.segment));
  }

  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) notFound();

  const professionHeroPath = alliedHealthSegmentPath(prof.segment);
  const lessonsPath = alliedHealthLessonsIndexPath(prof.professionKey);
  const pathwayHub = buildExamPathwayPath(pathway);

  let sampleStem: string | null = null;
  if (isDatabaseUrlConfigured()) {
    try {
      const row = await prisma.examQuestion.findFirst({
        where: {
          status: "published",
          careerType: "allied",
          exam: "ALLIED",
        },
        select: { stem: true },
      });
      sampleStem = row?.stem ? row.stem.slice(0, 280) + (row.stem.length > 280 ? "…" : "") : null;
    } catch {
      sampleStem = null;
    }
  }

  const { crumbs, schemaItems } = alliedProfessionBreadcrumbs(prof.h1, professionHeroPath);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link href="/allied-health" className="text-sm font-medium text-primary hover:underline">
          ← Allied health hub
        </Link>
        <p className="mt-4 text-xs font-semibold uppercase text-primary">Allied health · {pathway.shortName}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[var(--theme-heading-text)]">{prof.h1}</h1>
        <p className="mt-4 text-muted">{prof.description}</p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Exam overview</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
            {prof.examOverview.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">How NurseNest supports this track</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
            {prof.features.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        {sampleStem ? (
          <section className="mt-10 rounded-xl border border-border bg-muted/20 p-5">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Sample question stem (preview)</h2>
            <p className="mt-2 text-sm text-muted">{sampleStem}</p>
            <p className="mt-2 text-xs text-muted">Full items and rationales unlock with a matching allied plan in the app.</p>
          </section>
        ) : null}

        <section className="mt-10 nn-card p-6">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Next step</h2>
          <p className="mt-2 text-sm text-muted">{prof.ctaLine}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={lessonsPath}
              className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              Paginated lessons
            </Link>
            <Link
              href={`/allied-health/${prof.professionKey}/blog`}
              className="inline-flex rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted/80"
            >
              Blog
            </Link>
            <Link
              href={pathwayHub}
              className="inline-flex rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted/80"
            >
              Official pathway hub
            </Link>
            <Link href="/pricing" className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted/80">
              Plans
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
