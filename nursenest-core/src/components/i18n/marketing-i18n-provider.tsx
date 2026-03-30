"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";

type Params = Record<string, string | number | undefined>;

type MarketingI18nContextValue = {
  locale: string;
  /** Optional English (or default-locale) bundle for keys missing in the active locale. */
  fallbackMessages?: MarketingMessages;
  t: (key: string, params?: Params) => string;
};

const MarketingI18nContext = createContext<MarketingI18nContextValue | null>(null);

/** Keeps `<html lang>` aligned with the active marketing locale (accessibility + SEO). */
function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    const primary = locale.split(/[-_]/)[0]?.trim() || "en";
    document.documentElement.lang = primary.length >= 2 ? primary : "en";
  }, [locale]);
  return null;
}

export function MarketingI18nProvider({
  locale,
  messages,
  fallbackMessages,
  children,
}: {
  locale: string;
  messages: MarketingMessages;
  /** When set, missing keys in `messages` resolve from this bundle (usually English). */
  fallbackMessages?: MarketingMessages;
  children: ReactNode;
}) {
  const value = useMemo<MarketingI18nContextValue>(
    () => ({
      locale,
      fallbackMessages,
      t: (key: string, params?: Params) => formatMarketingMessage(messages, key, params, fallbackMessages),
    }),
    [locale, messages, fallbackMessages],
  );
  return (
    <MarketingI18nContext.Provider value={value}>
      <HtmlLangSync locale={locale} />
      {children}
    </MarketingI18nContext.Provider>
  );
}

export function useMarketingI18n() {
  const ctx = useContext(MarketingI18nContext);
  if (!ctx) {
    throw new Error("useMarketingI18n must be used within MarketingI18nProvider");
  }
  return ctx;
}

export function useMarketingLocale() {
  return useMarketingI18n().locale;
}
