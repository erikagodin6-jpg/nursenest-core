import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityClusterPageView } from "@/components/seo/authority-cluster-page";
import { getAuthorityClusterPage } from "@/lib/seo/authority-cluster-pages";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

const page = getAuthorityClusterPage("respiratory-therapy", "overview");

export const metadata: Metadata = page
  ? {
      title: page.title,
      description: page.description,
      alternates: { canonical: absoluteUrl(page.path) },
      robots: { index: true, follow: true },
      openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "website" },
    }
  : {};

export default function RespiratoryTherapyAuthorityHubPage() {
  if (!page) notFound();
  return <AuthorityClusterPageView page={page} />;
}
