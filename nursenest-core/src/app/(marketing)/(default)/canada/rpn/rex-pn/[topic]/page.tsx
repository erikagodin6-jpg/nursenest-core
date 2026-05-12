import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityClusterPageView } from "@/components/seo/authority-cluster-page";
import { getAuthorityClusterPage, listAuthorityClusterPages } from "@/lib/seo/authority-cluster-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return listAuthorityClusterPages()
    .filter((page) => page.cluster === "rex-pn" && page.slug !== "overview")
    .map((page) => ({ topic: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = getAuthorityClusterPage("rex-pn", topic);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "article" },
  };
}

export default async function RexPnAuthorityTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getAuthorityClusterPage("rex-pn", topic);
  if (!page || page.slug === "overview") notFound();
  return <AuthorityClusterPageView page={page} />;
}
