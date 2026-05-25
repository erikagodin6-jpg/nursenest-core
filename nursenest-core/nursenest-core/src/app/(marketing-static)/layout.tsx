import type { ReactNode } from "react";

import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { StaticMarketingFooter } from "@/components/marketing-static/static-marketing-footer";
import { StaticMarketingHeader } from "@/components/marketing-static/static-marketing-header";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";

import "../(marketing)/marketing-styles.css";

export const revalidate = 300;

export default function StaticMarketingLayout({ children }: { children: ReactNode }) {
  const messages = mergeMinimalMarketingLayoutShellMessages({});

  return (
    <MarketingI18nProvider
      key={DEFAULT_MARKETING_LOCALE}
      locale={DEFAULT_MARKETING_LOCALE}
      messages={messages}
      fallbackMessages={undefined}
    >
      <NursenestRegionRoot serverRegion="CA" trustClientPersistedRegion={false}>
        <MarketingCountryChromeProvider country="canada">
          <div className="flex min-h-screen flex-col bg-[color-mix(in_srgb,var(--theme-surface)_92%,transparent)] text-[var(--theme-body-text)]">
            <StaticMarketingHeader />
            <main className="flex-1">
              {children}
            </main>
            <StaticMarketingFooter />
          </div>
        </MarketingCountryChromeProvider>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
