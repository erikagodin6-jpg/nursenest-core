import type { Metadata } from "next";
import { AuthLoginLivePreview } from "@/components/ui-preview/auth-login-live-preview";

export const metadata: Metadata = {
  title: "Auth login — live shell preview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AuthLoginLivePreviewPage() {
  return <AuthLoginLivePreview />;
}
