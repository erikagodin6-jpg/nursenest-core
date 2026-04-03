import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

/** Shared marketing/locale dictionary for all `/app/*` routes (learner shell, exams, practice). */
export default async function AppSegmentLayout({ children }: { children: React.ReactNode }) {
  const { locale, messages, fallbackMessages } = await getLearnerMarketingBundle();
  return (
    <MarketingI18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      {children}
    </MarketingI18nProvider>
  );
}
