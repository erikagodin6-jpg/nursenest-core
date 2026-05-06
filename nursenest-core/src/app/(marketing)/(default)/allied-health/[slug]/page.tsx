import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import {
  getPathwayOrThrow,
  isAlliedHeroExamPrepSlug,
  resolveAlliedProfessionFromRouteSlug,
} from "@/lib/allied/allied-professions-registry";
import { alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { alliedProfessionBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
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
      const prof = resolveAlliedProfessionFromRouteSlug(slug);
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
  const prof = resolveAlliedProfessionFromRouteSlug(slug);
  if (!prof) notFound();

  if (!isAlliedHeroExamPrepSlug(slug)) {
    redirect(alliedHealthSegmentPath(prof.segment));
  }

  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) notFound();

  const professionHeroPath = alliedHealthSegmentPath(prof.segment);

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
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd title={prof.title} description={prof.description} path={professionHeroPath} />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
        <AlliedHealthPathwayHub
          pathway={pathway}
          hubPath={professionHeroPath}
          profession={prof}
          sampleQuestionStem={sampleStem}
        />
      </div>
    </div>
  );
}
