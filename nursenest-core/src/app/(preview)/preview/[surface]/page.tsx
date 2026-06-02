import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NurseNestPremiumPreview } from "@/components/ui-preview/nursenest-premium-preview";
import { previewSurfaceSlugs, resolvePreviewSurface } from "@/lib/ui-preview/preview-surfaces";

export const metadata: Metadata = {
  title: "NurseNest UI Preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return previewSurfaceSlugs.map((surface) => ({ surface }));
}

export default async function PreviewSurfacePage({
  params,
}: {
  params: Promise<{ surface: string }>;
}) {
  const { surface } = await params;
  const preview = resolvePreviewSurface(surface);
  if (!preview) notFound();
  return <NurseNestPremiumPreview surface={preview} />;
}
