import type { Metadata } from "next";
import { generateRegionalBlogDetailMetadata, RegionalBlogDetailPage } from "@/lib/blog/regional-blog-cluster-page";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateRegionalBlogDetailMetadata("us-rn", slug);
}

export default async function BlogUsRnArticlePage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBlogDetailPage clusterSlug="us-rn" postSlug={slug} />;
}
