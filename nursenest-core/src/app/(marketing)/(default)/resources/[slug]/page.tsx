import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityResourcePageView } from "@/components/seo/authority-resource-page";
import {
  getAuthorityResourcePage,
  listAuthorityResourcePages,
} from "@/lib/seo/authority-resource-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listAuthorityResourcePages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAuthorityResourcePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "article" },
  };
}

export default async function AuthorityResourceRoute({ params }: Props) {
  const { slug } = await params;
  const page = getAuthorityResourcePage(slug);
  if (!page) notFound();
  return <AuthorityResourcePageView page={page} />;
}
