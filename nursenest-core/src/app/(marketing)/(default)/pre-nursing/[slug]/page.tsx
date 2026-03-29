import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PreNursingModuleView } from "@/components/pre-nursing/pre-nursing-module-view";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";

const dict = strings as Record<string, string>;

type Props = { params: Promise<{ slug: string }> };

/** Avoid prerendering every module at build (disk pressure on CI / small volumes). */
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
  const description = dict[meta.subtitleKey] ?? "";
  return {
    title: `${title} | Pre-Nursing`,
    description,
    alternates: { canonical: `/pre-nursing/${slug}` },
  };
}

export default async function PreNursingModulePage({ params }: Props) {
  const { slug } = await params;
  if (!getPreNursingModuleComponent(slug)) notFound();
  const meta = PRE_NURSING_MODULE_REGISTRY.find((m) => m.slug === slug);
  const title = meta ? dict[meta.titleKey] ?? slug : slug;

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/pre-nursing"
          className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict["preNursing.backToModules"] ?? "Back to modules"}
        </Link>
        <p className="sr-only">{title}</p>
      </div>
      <PreNursingModuleView slug={slug} />
    </div>
  );
}
