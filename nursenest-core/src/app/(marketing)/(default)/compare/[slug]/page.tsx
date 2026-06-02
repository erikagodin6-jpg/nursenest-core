import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityComparisonPageView } from "@/components/seo/authority-comparison-page";
import {
  getAuthorityComparisonPage,
  listAuthorityComparisonPages,
} from "@/lib/seo/authority-comparison-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listAuthorityComparisonPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAuthorityComparisonPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "article" },
  };
}

export default async function AuthorityComparisonRoute({ params }: Props) {
  const { slug } = await params;
  const page = getAuthorityComparisonPage(slug);
  if (!page) notFound();
  return <AuthorityComparisonPageView page={page} />;
}
