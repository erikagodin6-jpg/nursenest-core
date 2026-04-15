"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { isRtlMarketingLocale, localePrimarySubtag } from "@/lib/i18n/marketing-locale-policy";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { validateMarketingHeroNavCriticalKeys } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";

type Params = Record<string, string | number | undefined>;

type MarketingI18nContextValue = {
  locale: string;
  /** Active merged bundle for this layer (shell, shell+pages, etc.). */
  messages: MarketingMessages;
  /** Optional English (or default-locale) bundle for keys missing in the active locale. */
  fallbackMessages?: MarketingMessages;
  /** Flat message key (see `MarketingMessageKey` in `marketing-message-keys.generated.ts` for static keys). */
  t: (key: string, params?: Params) => string;
};

const MarketingI18nContext = createContext<MarketingI18nContextValue | null>(null);

let warnedUseMarketingI18nOutsideProvider = false;

const degradedT = (key: string, params?: Params) =>
  formatMarketingMessage({}, key, params, undefined, { locale: DEFAULT_MARKETING_LOCALE });

/** Safe default when a component calls `useMarketingI18n()` without a provider (never throws). */
const DEGRADED_MARKETING_I18N: MarketingI18nContextValue = {
  locale: DEFAULT_MARKETING_LOCALE,
  messages: {},
  fallbackMessages: undefined,
  t: degradedT,
};

/** Keeps `<html lang>` and `dir` aligned with the active marketing locale (accessibility + SEO + RTL). */
function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    const primary = localePrimarySubtag(locale);
    document.documentElement.lang = primary.length >= 2 ? primary : "en";
    document.documentElement.dir = isRtlMarketingLocale(locale) ? "rtl" : "ltr";
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
  /** When set, missing keys in `messages` resolve from this bundle before `[missing:…]` placeholders. */
  fallbackMessages?: MarketingMessages;
  children: ReactNode;
}) {
  const safeMessages = useMemo(() => normalizeMarketingMessagesRecord(messages), [messages]);
  const safeFallback = useMemo(
    () => (fallbackMessages ? normalizeMarketingMessagesRecord(fallbackMessages) : undefined),
    [fallbackMessages],
  );

  const value = useMemo<MarketingI18nContextValue>(
    () => ({
      locale,
      messages: safeMessages,
      fallbackMessages: safeFallback,
      t: (key: string, params?: Params) =>
        formatMarketingMessage(safeMessages, key, params, safeFallback, { locale }),
    }),
    [locale, safeMessages, safeFallback],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const canonicalEn =
      safeFallback ?? (locale === DEFAULT_MARKETING_LOCALE ? safeMessages : undefined);
    if (!canonicalEn) return;
    const { ok, missing } = validateMarketingHeroNavCriticalKeys(canonicalEn);
    if (!ok) {
      console.error(
        "[MarketingI18nProvider] Canonical English bundle is missing hero/nav critical keys (fix before shipping):\n",
        missing.join("\n"),
      );
    }
  }, [locale, safeMessages, safeFallback]);

  return (
    <MarketingI18nContext.Provider value={value}>
      <HtmlLangSync locale={locale} />
      {children}
    </MarketingI18nContext.Provider>
  );
}

export function useMarketingI18n(): MarketingI18nContextValue {
  const ctx = useContext(MarketingI18nContext);
  if (ctx) return ctx;
  if (process.env.NODE_ENV === "development" && !warnedUseMarketingI18nOutsideProvider) {
    warnedUseMarketingI18nOutsideProvider = true;
    console.warn(
      "[MarketingI18n] useMarketingI18n() outside MarketingI18nProvider — using degraded empty bundle (app continues).",
    );
  }
  return DEGRADED_MARKETING_I18N;
}

export function useMarketingLocale() {
  return useMarketingI18n().locale;
}

/**
 * Merges additional shard maps into the parent {@link MarketingI18nProvider} for a subtree
 * (e.g. `pages.*` under `<main>` while chrome stays on a smaller shell bundle).
 */
export function MarketingI18nShardLayer({
  messages: extraMessages,
  fallbackMessages: extraFallback,
  children,
}: {
  messages: MarketingMessages;
  fallbackMessages?: MarketingMessages;
  children: ReactNode;
}) {
  const parent = useMarketingI18n();
  const mergedMessages = useMemo(
    () =>
      normalizeMarketingMessagesRecord({
        ...parent.messages,
        ...normalizeMarketingMessagesRecord(extraMessages),
      }),
    [parent.messages, extraMessages],
  );
  const mergedFallback = useMemo(() => {
    if (!extraFallback && !parent.fallbackMessages) return undefined;
    return normalizeMarketingMessagesRecord({
      ...(parent.fallbackMessages ?? {}),
      ...(extraFallback ?? {}),
    });
  }, [parent.fallbackMessages, extraFallback]);

  return (
    <MarketingI18nProvider
      locale={parent.locale}
      messages={mergedMessages}
      fallbackMessages={mergedFallback}
    >
      {children}
    </MarketingI18nProvider>
  );
}
