import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";

/**
 * English canonical programmatic URLs are fully prerendered at build under `/seo/[slug]`.
 * A full locale×slug matrix here (~19 locales × ~23 slugs) dominated `.next` artifact size and
 * contributed to ENOSPC in disk-limited CI. Non-default locales are generated on first request
 * and cached (ISR); URLs and metadata are unchanged, only build-time static output is reduced.
 */
export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams(): { locale: string; slug: string }[] {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getProgrammaticSeoPage(slug);
  if (!page) return {};
  return buildProgrammaticMetadata(page, locale);
}

export default async function ProgrammaticSeoLocaleRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = getProgrammaticSeoPage(slug);
  if (!page) notFound();
  return <ProgrammaticSeoPage page={page} locale={locale} />;
}
