import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PreNursingAccountCapture } from "@/components/pre-nursing/pre-nursing-account-capture";
import { PreNursingMilestoneStrip } from "@/components/pre-nursing/pre-nursing-milestone-strip";
import { PreNursingModuleView } from "@/components/pre-nursing/pre-nursing-module-view";
import { PreNursingModuleEngagement } from "@/components/pre-nursing/pre-nursing-module-engagement";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { preNursingModuleBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

const dict = strings as Record<string, string>;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = PRE_NURSING_MODULE_REGISTRY.find((m) => m.slug === slug);
  if (!meta || !getPreNursingModuleComponent(slug)) return { title: "Not found" };
  const title = dict[meta.titleKey] ?? slug;
  const rawDesc = (dict[meta.subtitleKey] ?? "").trim();
  const description =
    rawDesc ||
    `Free Pre-Nursing module: ${title}. Interactive foundations before nursing school, part of NurseNest’s free catalog.`;
  const metaTitle = `${title} | Free Pre-Nursing | NurseNest`;
  const path = `/pre-nursing/lessons/${slug}`;
  return {
    title: metaTitle,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title: metaTitle, description, url: absoluteUrl(path), type: "article" },
    twitter: { card: "summary_large_image", title: metaTitle, description },
  };
}

export default async function PreNursingLessonModulePage({ params }: Props) {
  const { slug } = await params;
  if (!getPreNursingModuleComponent(slug)) notFound();
  const meta = PRE_NURSING_MODULE_REGISTRY.find((m) => m.slug === slug);
  const title = meta ? dict[meta.titleKey] ?? slug : slug;
  const { crumbs, schemaItems } = preNursingModuleBreadcrumbs(title, slug);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="module" moduleSlug={slug} />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-4">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link
          href="/pre-nursing/lessons"
          className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict["preNursing.backToModules"] ?? "Back to lessons"}
        </Link>
        <p className="sr-only">{title}</p>
        <PreNursingMilestoneStrip sourceSurface="module" currentSlug={slug} />
      </div>
      <PreNursingModuleView slug={slug} />
      <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6 lg:px-8">
        <PreNursingAccountCapture sourceSurface="module" />
      </div>
      <PreNursingModuleEngagement slug={slug} moduleTitle={title} />
    </div>
  );
}
