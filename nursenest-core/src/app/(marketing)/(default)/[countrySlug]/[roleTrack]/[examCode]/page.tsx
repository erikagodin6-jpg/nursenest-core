import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ countrySlug: string; roleTrack: string; examCode: string }> };

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();
  return <ExamPathwayHub pathway={pathway} />;
}
