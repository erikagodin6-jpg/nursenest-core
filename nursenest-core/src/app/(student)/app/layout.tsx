import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { getStaffSession } from "@/lib/auth/staff-session";

/** Shared marketing/locale dictionary for all `/app/*` routes (learner shell, exams, practice). */
export const dynamic = "force-dynamic";

/** Learner app is auth-gated; keep subscriber lesson/question payloads out of search indexes even when metadata is missing on a leaf route. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppSegmentLayout({ children }: { children: React.ReactNode }) {
  let locale = "en";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    const { getLearnerShellMarketingBundle } = await import("@/lib/learner/learner-marketing-server");
    const bundle = await getLearnerShellMarketingBundle();
    locale = bundle.locale;
    messages = bundle.messages;
    fallbackMessages = bundle.fallbackMessages;
  } catch (e) {
    console.error("[app-segment-layout] failed to load learner marketing bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
    // Fall through with English defaults — the learner app renders without translations rather than crashing.
  }

  let adminPalette: ReactNode = null;
  try {
    const staff = await getStaffSession();
    if (staff) {
      const { AdminGlobalCommandPalette } = await import("@/components/admin/admin-global-command-palette");
      adminPalette = (
        <Suspense fallback={null}>
          <AdminGlobalCommandPalette />
        </Suspense>
      );
    }
  } catch (e) {
    console.error("[app-segment-layout] staff session / admin palette skipped", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return (
    <MarketingI18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      {children}
      {adminPalette}
    </MarketingI18nProvider>
  );
}
