"use client";

import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { isRtlMarketingLocale, localePrimarySubtag, DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { validateMarketingHeroNavCriticalKeys } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { humanizedMarketingKeyFallback } from "@/lib/marketing-i18n/marketing-message-value-policy";
import { warnMissingMarketingMessageKeyDev } from "@/lib/marketing-i18n/marketing-missing-key-dev-warn";
import { looksLikeRawI18nKey } from "@/lib/ui/format-display-label";

type Params = Record<string, string | number | undefined>;

type MarketingI18nContextValue = {
  locale: string;
  messages: MarketingMessages;
  fallbackMessages?: MarketingMessages;
  t: (key: string, params?: Params) => string;
};

const MarketingI18nContext = createContext<MarketingI18nContextValue | null>(null);

let warnedUseMarketingI18nOutsideProvider = false;

function safeFormat(
  messages: MarketingMessages,
  key: string,
  params?: Params,
  fallback?: MarketingMessages,
  locale?: string
): string {
  try {
    const resolved = formatMarketingMessage(messages, key, params, fallback, { locale }).trim();
    if (!resolved) {
      const fb = humanizedMarketingKeyFallback(key);
      warnMissingMarketingMessageKeyDev(key, fb, {
        hasCatalog: hasNonEmptyMarketingCatalog(messages, fallback),
      });
      return fb;
    }
    if (process.env.NODE_ENV === "development" && looksLikeRawI18nKey(resolved)) {
      console.warn("[MarketingI18n] Resolved copy looks like a raw message key — check catalog value", {
        key,
        resolved: resolved.slice(0, 120),
      });
    }
    return resolved;
  } catch (e) {
    const fb = humanizedMarketingKeyFallback(key);
    const isMissingRequiredCopy =
      e instanceof Error && e.message.includes("missing required marketing copy");
    if (isMissingRequiredCopy) {
      warnMissingMarketingMessageKeyDev(key, fb, {
        hasCatalog: hasNonEmptyMarketingCatalog(messages, fallback),
      });
    }
    return fb;
  }
}

const DEGRADED_MARKETING_I18N: MarketingI18nContextValue = {
  locale: DEFAULT_MARKETING_LOCALE,
  messages: {},
  fallbackMessages: undefined,
  t: (key: string) => humanizedMarketingKeyFallback(key),
};

/** Matches dotted message keys that should never appear verbatim in rendered marketing HTML. */
const RENDERED_I18N_KEY_PREFIX_PATTERN =
  /\b(?:pages|footer|blog|admin|content|learner|app|nav|components|marketing|errors|forms)\.[A-Za-z0-9_.-]+/;

function hasNonEmptyMarketingCatalog(messages: MarketingMessages, fallback?: MarketingMessages): boolean {
  return Object.keys(messages).length > 0 || Boolean(fallback && Object.keys(fallback).length > 0);
}

function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    try {
      const primary = localePrimarySubtag(locale);
      document.documentElement.lang = primary.length >= 2 ? primary : "en";
      document.documentElement.dir = isRtlMarketingLocale(locale) ? "rtl" : "ltr";
    } catch {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    }
  }, [locale]);

  return null;
}

function RenderedI18nKeyLeakGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return undefined;
    let lastLogged = "";

    function checkRenderedText() {
      try {
        const renderedText = document.body?.innerText ?? "";
        const match = renderedText.match(RENDERED_I18N_KEY_PREFIX_PATTERN)?.[0] ?? "";
        if (match && match !== lastLogged) {
          lastLogged = match;
          console.warn("[MarketingI18n] Rendered text matches a dotted message key pattern", { key: match });
        }
      } catch {
        // never break app rendering
      }
    }

    checkRenderedText();
    if (!document.body) return undefined;
    const observer = new MutationObserver(checkRenderedText);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

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
  fallbackMessages?: MarketingMessages;
  children: ReactNode;
}) {
  const safeMessages = useMemo(() => {
    try {
      return normalizeMarketingMessagesRecord(messages);
    } catch {
      return {};
    }
  }, [messages]);

  const safeFallback = useMemo(() => {
    try {
      return fallbackMessages ? normalizeMarketingMessagesRecord(fallbackMessages) : undefined;
    } catch {
      return undefined;
    }
  }, [fallbackMessages]);

  const value = useMemo<MarketingI18nContextValue>(() => {
    return {
      locale,
      messages: safeMessages,
      fallbackMessages: safeFallback,
      t: (key: string, params?: Params) =>
        safeFormat(safeMessages, key, params, safeFallback, locale),
    };
  }, [locale, safeMessages, safeFallback]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    try {
      const canonicalEn =
        safeFallback ?? (locale === DEFAULT_MARKETING_LOCALE ? safeMessages : undefined);

      if (!canonicalEn) return;

      const { ok, missing } = validateMarketingHeroNavCriticalKeys(canonicalEn);

      if (!ok) {
        console.error(
          "[MarketingI18nProvider] Missing hero/nav keys:\n",
          missing.join("\n")
        );
      }
    } catch {
      // never break app
    }
  }, [locale, safeMessages, safeFallback]);

  return (
    <MarketingI18nContext.Provider value={value}>
      <HtmlLangSync locale={locale} />
      <RenderedI18nKeyLeakGuard />
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
      "[MarketingI18n] Used outside provider — falling back to safe mode."
    );
  }

  return DEGRADED_MARKETING_I18N;
}

export function useMarketingLocale() {
  return useMarketingI18n().locale;
}

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

  const mergedMessages = useMemo(() => {
    try {
      return normalizeMarketingMessagesRecord({
        ...parent.messages,
        ...normalizeMarketingMessagesRecord(extraMessages),
      });
    } catch {
      return parent.messages;
    }
  }, [parent.messages, extraMessages]);

  const mergedFallback = useMemo(() => {
    try {
      if (!extraFallback && !parent.fallbackMessages) return undefined;

      return normalizeMarketingMessagesRecord({
        ...(parent.fallbackMessages ?? {}),
        ...(extraFallback ?? {}),
      });
    } catch {
      return parent.fallbackMessages;
    }
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
