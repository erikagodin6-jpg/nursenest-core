import type { Metadata } from "next";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

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
    const bundle = await getLearnerMarketingBundle();
    locale = bundle.locale;
    messages = bundle.messages;
    fallbackMessages = bundle.fallbackMessages;
  } catch (e) {
    console.error("[app-segment-layout] failed to load learner marketing bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
    // Fall through with English defaults — the learner app renders without translations rather than crashing.
  }

  return (
    <MarketingI18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      {children}
    </MarketingI18nProvider>
  );
}
