import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";

/** Build-time prerender disabled: full slug list inflates `.next` on disk-limited hosts; pages are ISR on demand. */
export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getProgrammaticSeoPage(slug);
  if (!page) return {};
  return buildProgrammaticMetadata(page, DEFAULT_MARKETING_LOCALE);
}

export default async function ProgrammaticSeoRewriteTarget({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getProgrammaticSeoPage(slug);
  if (!page) notFound();
  return <ProgrammaticSeoPage page={page} locale={DEFAULT_MARKETING_LOCALE} />;
}
