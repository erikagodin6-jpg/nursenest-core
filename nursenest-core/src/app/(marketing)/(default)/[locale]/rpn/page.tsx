import type { Metadata } from "next";
import {
  generateLocalizedPathwayContentHubMetadata,
  LocalizedPathwayContentHubPage,
} from "@/components/marketing/localized-pathway-content-hub";

export const dynamicParams = true;
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedPathwayContentHubMetadata({ locale, hub: "rpn" });
}

export default async function LocalizedRpnHubPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  return <LocalizedPathwayContentHubPage locale={locale} hub="rpn" page={page} />;
}
