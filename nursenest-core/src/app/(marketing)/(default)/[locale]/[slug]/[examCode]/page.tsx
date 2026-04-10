import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { auth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { HubLessonProgress } from "@/components/exam-pathways/exam-pathway-hub-study-modes";

export const dynamicParams = true;
export const revalidate = 86400;

async function fetchHubLessonProgress(userId: string | undefined, pathwayId: string): Promise<HubLessonProgress | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  try {
    const prefix = `pathway:${pathwayId}:`;
    const [completed, total] = await Promise.all([
      prisma.progress.count({ where: { userId, lessonId: { startsWith: prefix }, completed: true } }),
      prisma.progress.count({ where: { userId, lessonId: { startsWith: prefix } } }),
    ]);
    return { completed, total };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  return safeGenerateMetadata(async () => {
    const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
    if (!pathway) return {};
    const seo = getNpPracticeTestLandingCopy(locale, slug, examCode);
    const requestPath = `/${locale}/${slug}/${examCode}`;
    const requestUrl = absoluteUrl(requestPath);
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: requestUrl },
        openGraph: { title: seo.title, description: seo.description, url: requestUrl, type: "website" },
      };
    }
    const corePath = buildExamPathwayPath(pathway);
    const coreUrl = absoluteUrl(corePath);
    return {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      alternates: { canonical: coreUrl },
      openGraph: {
        title: pathway.seoTitle,
        description: pathway.seoDescription,
        url: coreUrl,
        type: "website",
      },
    };
  }, { pathname, locale, routeGroup: "marketing.exam_hub" });
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isSignedIn = Boolean(userId);
  const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;
  const marketingHubPath = pathname;

  const [{ npInventory, questionSnapshot, pathwayLessonCount }, hubProgress] = await Promise.all([
    loadMarketingExamHubOptionalBlocks(pathway, {
      pathname,
      locale,
      country: locale,
      examCode,
      pathwayId: pathway.id,
      roleTrack: slug,
    }),
    fetchHubLessonProgress(userId, pathway.id),
  ]);

  return (
    <ExamPathwayHub
      pathway={pathway}
      isSignedIn={isSignedIn}
      npInventory={npInventory}
      questionSnapshot={questionSnapshot}
      pathwayLessonCount={pathwayLessonCount}
      heroTitle={npPracticeSeo?.heroTitle}
      heroLead={npPracticeSeo?.heroLead}
      emphasizeCatPracticeTests={Boolean(npPracticeSeo)}
      marketingHubPath={marketingHubPath}
      npPracticeSeo={npPracticeSeo}
      npSeoAliasSegment={npPracticeSeo ? examCode : undefined}
      hubProgress={hubProgress}
    />
  );
}
