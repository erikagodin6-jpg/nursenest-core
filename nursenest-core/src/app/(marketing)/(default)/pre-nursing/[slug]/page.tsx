import { notFound, permanentRedirect } from "next/navigation";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingModuleComponent } from "@/content/pre-nursing/pre-nursing-module-map";

const RESERVED = new Set(["lessons", "study-plan"]);

type Props = { params: Promise<{ slug: string }> };

/**
 * Legacy module URLs `/pre-nursing/:slug` → canonical `/pre-nursing/lessons/:slug`.
 * Reserved segments are handled by more specific routes.
 */
export default async function PreNursingLegacyModuleRedirect({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  if (!getPreNursingModuleComponent(slug)) notFound();
  if (!PRE_NURSING_MODULE_REGISTRY.some((m) => m.slug === slug)) notFound();
  permanentRedirect(`/pre-nursing/lessons/${slug}`);
}
