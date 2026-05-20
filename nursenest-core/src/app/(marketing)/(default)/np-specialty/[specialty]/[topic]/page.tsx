import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityClusterPageView } from "@/components/seo/authority-cluster-page";
import { getAuthorityClusterPage, listAuthorityClusterPages, type AuthorityClusterKey } from "@/lib/seo/authority-cluster-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

type Props = { params: Promise<{ specialty: string; topic: string }> };

const SPECIALTY_TO_CLUSTER: Record<string, AuthorityClusterKey> = {
  fnp: "np-fnp",
  agpcnp: "np-agpcnp",
  pmhnp: "np-pmhnp",
  whnp: "np-whnp",
  "pnp-pc": "np-pnp-pc",
};

export function generateStaticParams() {
  const clusters: AuthorityClusterKey[] = ["np-fnp", "np-agpcnp", "np-pmhnp", "np-whnp", "np-pnp-pc"];
  const specialtyFromCluster: Record<AuthorityClusterKey, string> = {
    "np-fnp": "fnp",
    "np-agpcnp": "agpcnp",
    "np-pmhnp": "pmhnp",
    "np-whnp": "whnp",
    "np-pnp-pc": "pnp-pc",
    cnple: "",
    "rex-pn": "",
    "respiratory-therapy": "",
    "ca-rn": "",
  };
  return listAuthorityClusterPages()
    .filter((page) => clusters.includes(page.cluster as AuthorityClusterKey) && page.slug !== "overview")
    .map((page) => ({ specialty: specialtyFromCluster[page.cluster], topic: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { specialty, topic } = await params;
  const cluster = SPECIALTY_TO_CLUSTER[specialty];
  if (!cluster) return {};
  const page = getAuthorityClusterPage(cluster, topic);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "article" },
  };
}

export default async function NpSpecialtyAuthorityTopicPage({ params }: Props) {
  const { specialty, topic } = await params;
  const cluster = SPECIALTY_TO_CLUSTER[specialty];
  if (!cluster) notFound();
  const page = getAuthorityClusterPage(cluster, topic);
  if (!page || page.slug === "overview") notFound();
  return <AuthorityClusterPageView page={page} />;
}
