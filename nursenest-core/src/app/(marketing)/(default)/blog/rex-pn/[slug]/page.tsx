import type { Metadata } from "next";
import { generateRegionalBlogDetailMetadata, RegionalBlogDetailPage } from "@/lib/blog/regional-blog-cluster-page";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateRegionalBlogDetailMetadata("rex-pn", slug);
}

export default async function BlogRexPnArticlePage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBlogDetailPage clusterSlug="rex-pn" postSlug={slug} />;
}
