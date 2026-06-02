import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  generateLocalizedPathwayContentHubMetadata,
  LocalizedPathwayContentHubPage,
} from "@/components/marketing/localized-pathway-content-hub";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string }>;
};

const localizedContentLocales = new Set(["fr", "es"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (localizedContentLocales.has(locale)) {
    return generateLocalizedPathwayContentHubMetadata({ locale, hub: "pn" });
  }
  return {};
}

export default async function PnShortcutPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (localizedContentLocales.has(locale)) {
    const query = (await searchParams) ?? {};
    const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
    return <LocalizedPathwayContentHubPage locale={locale} hub="pn" page={page} />;
  }

  const target = locale === "canada" ? `/${locale}/pn/rex-pn` : `/${locale}/pn/nclex-pn`;
  redirect(target);
}
