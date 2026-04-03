"use client";

import { useEffect } from "react";
import { preferMarketingLocale } from "@/app/actions/marketing-locale";

/** Keeps `MARKETING_LOCALE_COOKIE` aligned with the URL segment on `/{lang}/…` marketing routes (for exam hub navigation). */
export function MarketingLocaleUrlSync({ locale }: { locale: string }) {
  useEffect(() => {
    void preferMarketingLocale(locale);
  }, [locale]);
  return null;
}
