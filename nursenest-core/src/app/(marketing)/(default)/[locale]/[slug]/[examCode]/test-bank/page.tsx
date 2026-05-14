import { notFound } from "next/navigation";
import { HealthcareTestBankPage, metadataForHealthcareTestBankPage } from "@/components/seo/healthcare-test-bank-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { getHealthcareTestBankPageByPath } from "@/lib/seo/healthcare-test-bank-pages";

export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
};

async function resolvePagePath(params: Props["params"]): Promise<string | null> {
  const { locale, slug, examCode } = await params;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, {
    pathname: `/${locale}/${slug}/${examCode}/test-bank`,
  });
  if (!pathway) return null;
  return buildExamPathwayPath(pathway, "test-bank");
}

export async function generateMetadata({ params }: Props) {
  const path = await resolvePagePath(params);
  return metadataForHealthcareTestBankPage(path ?? "");
}

export default async function GenericHealthcareTestBankPage({ params }: Props) {
  const path = await resolvePagePath(params);
  const page = path ? getHealthcareTestBankPageByPath(path) : null;
  if (!page) notFound();
  return <HealthcareTestBankPage page={page} />;
}
