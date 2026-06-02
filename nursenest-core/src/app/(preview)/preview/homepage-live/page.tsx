import type { Metadata } from "next";
import { HomepageLivePreview } from "@/components/ui-preview/homepage-live-preview";

export const metadata: Metadata = {
  title: "Homepage — live branding preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function HomepageLivePreviewPage() {
  return <HomepageLivePreview />;
}
