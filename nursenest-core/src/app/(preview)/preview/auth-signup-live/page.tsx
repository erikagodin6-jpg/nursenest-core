import type { Metadata } from "next";
import { AuthSignupLivePreview } from "@/components/ui-preview/auth-signup-live-preview";

export const metadata: Metadata = {
  title: "Auth signup — live shell preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AuthSignupLivePreviewPage() {
  return <AuthSignupLivePreview />;
}
