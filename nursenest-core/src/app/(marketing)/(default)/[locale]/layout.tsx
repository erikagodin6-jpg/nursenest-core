import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  MARKETING_LOCALE_COOKIE,
  normalizePreferredMarketingLocale,
} from "@/lib/i18n/marketing-locale-cookie";
import { isExamPathwayCountrySlug } from "@/lib/i18n/exam-hub-path";
import { loadMarketingMessages, loadMarketingMessagesSync } from "@/lib/marketing-i18n/load-marketing-messages";
import { cookies } from "next/headers";

type Props = {
  children: React.ReactNode;
  /** Pathway country segment (`us` / `canada`), not BCP-47 marketing language. */
  params: Promise<{ locale: string }>;
};

/**
 * Exam hubs live at `/us/…` and `/canada/…` without a `/{lang}/…` prefix. Overlay marketing UI locale
 * from `MARKETING_LOCALE_COOKIE` so language selection + refresh/navigation keep translated chrome.
 */
export default async function ExamPathwayMarketingChromeLayout({ children, params }: Props) {
  const { locale: countrySlug } = await params;
  if (!isExamPathwayCountrySlug(countrySlug)) {
    return <>{children}</>;
  }

  const jar = await cookies();
  const raw = jar.get(MARKETING_LOCALE_COOKIE)?.value;
  const uiLocale = normalizePreferredMarketingLocale(raw);

  const messages = await loadMarketingMessages(uiLocale);
  const fallbackMessages = loadMarketingMessagesSync(DEFAULT_MARKETING_LOCALE);

  return (
    <MarketingI18nProvider
      key={uiLocale}
      locale={uiLocale}
      messages={messages}
      fallbackMessages={fallbackMessages}
    >
      {children}
    </MarketingI18nProvider>
  );
}
