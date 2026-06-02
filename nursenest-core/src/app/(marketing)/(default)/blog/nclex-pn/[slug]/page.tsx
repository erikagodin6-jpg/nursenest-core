import type { Metadata } from "next";
import { generateRegionalBlogDetailMetadata, RegionalBlogDetailPage } from "@/lib/blog/regional-blog-cluster-page";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateRegionalBlogDetailMetadata("nclex-pn", slug);
}

export default async function BlogNclexPnArticlePage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBlogDetailPage clusterSlug="nclex-pn" postSlug={slug} />;
}
