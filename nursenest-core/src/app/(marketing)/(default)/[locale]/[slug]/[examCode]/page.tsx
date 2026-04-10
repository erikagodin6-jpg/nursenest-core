import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { auth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeExamHubMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  return safeExamHubMetadata(async () => {
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
  }, { pathname, locale });
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();

  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode) ?? null;
  const marketingHubPath = pathname;

  const { npInventory, questionSnapshot, pathwayLessonCount } = await loadMarketingExamHubOptionalBlocks(pathway, {
    pathname,
    locale,
    country: locale,
    examCode,
    pathwayId: pathway.id,
    roleTrack: slug,
  });

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
    />
  );
}
