import type { Metadata } from "next";
import { generateRegionalBlogIndexMetadata, RegionalBlogIndexPage } from "@/lib/blog/regional-blog-cluster-page";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generateRegionalBlogIndexMetadata("rex-pn");
}

type Props = { searchParams: Promise<{ page?: string }> };

export default function BlogRexPnHubPage({ searchParams }: Props) {
  return <RegionalBlogIndexPage clusterSlug="rex-pn" searchParams={searchParams} />;
}
