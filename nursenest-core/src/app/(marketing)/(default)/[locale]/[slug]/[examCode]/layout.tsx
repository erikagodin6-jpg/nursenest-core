import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = {
  children: React.ReactNode;
  /** `locale` = pathway countrySlug (`us` / `canada`); `slug` = roleTrack; `examCode` = exam segment. */
  params: Promise<{ locale: string; slug: string; examCode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathway = getExamPathwayByRoute(locale, slug, examCode);
  if (!pathway) return {};
  const path = `/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`;
  return {
    title: pathway.seoTitle,
    description: pathway.seoDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      url: absoluteUrl(path),
    },
  };
}

export default async function ExamPathwayLayout({ children, params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = getExamPathwayByRoute(locale, slug, examCode);
  if (!pathway || pathway.status === "hidden") {
    notFound();
  }
  return <>{children}</>;
}
