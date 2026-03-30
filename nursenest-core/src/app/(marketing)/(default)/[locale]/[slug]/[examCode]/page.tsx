import { notFound } from "next/navigation";
import { ExamPathwayHub } from "@/components/exam-pathways/exam-pathway-hub";
import { getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { auth } from "@/lib/auth";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export default async function ExamPathwayOverviewPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = getExamPathwayByRoute(locale, slug, examCode);
  if (!pathway) notFound();
  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  return <ExamPathwayHub pathway={pathway} isSignedIn={isSignedIn} />;
}
