import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicalInterpretationGuidePage } from "@/components/clinical-interpretation/clinical-interpretation-guide-page";
import {
  clinicalInterpretationGuidePath,
  clinicalInterpretationRobotsDirective,
  getClinicalInterpretationBySlug,
  isClinicalInterpretationIndexable,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getClinicalInterpretationBySlug(slug);
  if (!entry || !isClinicalInterpretationIndexable(entry)) {
    return { title: "Clinical interpretation guide | NurseNest", robots: { index: false, follow: false } };
  }
  return seoPageMetadata({
    title: entry.seoTitle,
    description: entry.metaDescription,
    path: clinicalInterpretationGuidePath(entry.slug),
    robots: clinicalInterpretationRobotsDirective(entry),
    ogType: "article",
  });
}

export default async function ClinicalInterpretationDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getClinicalInterpretationBySlug(slug);
  if (!entry || !isClinicalInterpretationIndexable(entry)) notFound();
  return <ClinicalInterpretationGuidePage entry={entry} />;
}
