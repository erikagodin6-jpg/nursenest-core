import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityClusterPageView } from "@/components/seo/authority-cluster-page";
import { getAuthorityClusterPage, listAuthorityClusterPages } from "@/lib/seo/authority-cluster-pages";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return listAuthorityClusterPages()
    .filter((page) => page.cluster === "ca-rn" && page.slug !== "overview")
    .map((page) => ({ topic: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = getAuthorityClusterPage("ca-rn", topic);
  if (!page) return {};
  const pathname = page.path;
  return safeGenerateMetadata(
    {
      title: page.title,
      description: page.description,
      alternates: { canonical: absoluteUrl(pathname) },
      robots: { index: true, follow: true },
      openGraph: {
        title: page.title,
        description: page.description,
        url: absoluteUrl(pathname),
        type: "article",
      },
    },
    { pathname, routeGroup: "marketing.authority_cluster.ca_rn" },
  );
}

export default async function CaRnAuthorityGuideTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getAuthorityClusterPage("ca-rn", topic);
  if (!page || page.slug === "overview") notFound();
  return <AuthorityClusterPageView page={page} />;
}
