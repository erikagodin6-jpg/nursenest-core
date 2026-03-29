import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

type Props = {
  children: React.ReactNode;
  params: Promise<{ countrySlug: string; roleTrack: string; examCode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) return {};
  const origin = resolveCanonicalSiteOrigin().replace(/\/$/, "");
  const path = `/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`;
  return {
    title: pathway.seoTitle,
    description: pathway.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      url: path,
    },
  };
}

export default async function ExamPathwayLayout({ children, params }: Props) {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway || pathway.status === "hidden") {
    notFound();
  }
  return <>{children}</>;
}
