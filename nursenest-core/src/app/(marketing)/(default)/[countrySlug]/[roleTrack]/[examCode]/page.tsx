import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { getExamPathwayByRoute, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";

export function generateStaticParams() {
  return listPublicExamPathways().map((p) => ({
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
    examCode: p.examCode,
  }));
}

type Props = { params: Promise<{ countrySlug: string; roleTrack: string; examCode: string }> };

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();
  return <ExamPathwayHub pathway={pathway} />;
}
