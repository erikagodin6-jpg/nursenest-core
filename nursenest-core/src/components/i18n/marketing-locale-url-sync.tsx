"use client";

import { useEffect, useRef } from "react";
import { preferMarketingLocale } from "@/app/actions/marketing-locale";

/**
 * Keeps MARKETING_LOCALE_COOKIE aligned with URL locale.
 * Fully guarded to avoid repeated calls, loops, or hydration issues.
 */
export function MarketingLocaleUrlSync({ locale }: { locale: string }) {
  const lastSetRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent duplicate calls for same locale
    if (!locale || lastSetRef.current === locale) return;

    lastSetRef.current = locale;

    let cancelled = false;

    (async () => {
      try {
        const res = await preferMarketingLocale(locale);
        if (!res?.ok && !cancelled) {
          // silent fail — never break UI
          console.warn("[MarketingLocaleUrlSync] failed to set locale");
        }
      } catch {
        // never throw in effect
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return null;
}