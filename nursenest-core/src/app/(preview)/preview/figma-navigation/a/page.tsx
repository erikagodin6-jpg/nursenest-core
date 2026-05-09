import type { Metadata } from "next";
import { Suspense } from "react";
import { FigmaPreviewNavVariantA } from "@/components/preview/figma-navigation/FigmaPreviewNavVariantA";
import { FigmaPreviewControlStrip } from "@/components/preview/figma-navigation/FigmaPreviewControlStrip";
import type { FigmaPreviewAuthMode } from "@/components/preview/figma-navigation/figma-preview-nav-types";

export const metadata: Metadata = {
  title: "Nav preview — Variant A",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function FigmaNavPreviewVariantAPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const sp = await searchParams;
  const authMode: FigmaPreviewAuthMode = sp.auth === "learner" ? "learner" : "anon";

  return (
    <>
      <Suspense fallback={<div className="min-h-[50vh] bg-[var(--background)]" aria-busy />}>
        <FigmaPreviewNavVariantA authMode={authMode} />
      </Suspense>
      <FigmaPreviewControlStrip variant="a" />
    </>
  );
}
