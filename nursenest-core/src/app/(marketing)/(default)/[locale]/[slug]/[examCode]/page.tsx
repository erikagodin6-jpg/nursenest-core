import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { auth } from "@/lib/auth";
import { loadNpCanadaInventoryGate } from "@/lib/np/np-pathway-inventory-gate";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) return {};
  const seo = getNpPracticeTestLandingCopy(locale, slug, examCode);
  if (!seo) return {};
  const path = `/${locale}/${slug}/${examCode}`;
  const url = absoluteUrl(path);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: { title: seo.title, description: seo.description, url, type: "website" },
  };
}

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) notFound();
  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  const npInventory = pathway.id === "ca-np-cnple" ? await loadNpCanadaInventoryGate() : null;
  const npPracticeSeo = getNpPracticeTestLandingCopy(locale, slug, examCode);
  return (
    <ExamPathwayHub
      pathway={pathway}
      isSignedIn={isSignedIn}
      npInventory={npInventory}
      heroTitle={npPracticeSeo?.heroTitle}
      heroLead={npPracticeSeo?.heroLead}
      emphasizeCatPracticeTests={Boolean(npPracticeSeo)}
    />
  );
}
