import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import { ADMIN_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";

export const dynamic = "force-dynamic";

/** Heavy DB-backed admin UIs; avoid platform timeouts during cold DB + large aggregates. */
export const maxDuration = 120;

/**
 * Do not call `getStaffSession()` in this layout: it is wrapped in React `cache()` and an early read can
 * pin `null` (cold DB / transient Prisma / timeout) before `requireAdmin()` runs in `admin/layout.tsx`,
 * causing redirects or fragile follow-up renders. Header/footer infer staff from JWT when needed.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type AdminGlobalCommandPaletteFn =
  (typeof import("@/components/admin/admin-global-command-palette"))["AdminGlobalCommandPalette"];
type LoadMarketingMessageShardsFn =
  (typeof import("@/lib/marketing-i18n/load-marketing-message-shards"))["loadMarketingMessageShards"];

async function adminGlobalCommandPaletteImportFallback() {
  return null;
}

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  let AdminGlobalCommandPalette: AdminGlobalCommandPaletteFn;
  let loadMarketingMessageShards: LoadMarketingMessageShardsFn;
  try {
    const [paletteMod, shardsMod] = await Promise.all([
      import("@/components/admin/admin-global-command-palette"),
      import("@/lib/marketing-i18n/load-marketing-message-shards"),
    ]);
    AdminGlobalCommandPalette = paletteMod.AdminGlobalCommandPalette;
    loadMarketingMessageShards = shardsMod.loadMarketingMessageShards;
  } catch (e) {
    safeServerLog("admin_shell", "admin_group_layout_import_failed", {
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 200),
    });
    AdminGlobalCommandPalette = adminGlobalCommandPaletteImportFallback as AdminGlobalCommandPaletteFn;
    loadMarketingMessageShards = async () => ({});
  }
  let messages: Awaited<ReturnType<typeof loadMarketingMessageShards>> = {};
  try {
    messages = await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, ADMIN_LAYOUT_MESSAGE_SHARDS);
  } catch (e) {
    console.error("[AdminGroupLayout] loadMarketingMessageShards", e);
  }
  const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry();
  /** Align with default marketing layout: no cookie → CA-first; trust LS only when cookie set. */
  const serverRegion: MarketingRegionToggle = marketingRegionCookie ?? "CA";
  const trustClientPersistedRegion = marketingRegionCookie !== undefined;
  return (
    <MarketingI18nProvider key={DEFAULT_MARKETING_LOCALE} locale={DEFAULT_MARKETING_LOCALE} messages={messages}>
      <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
        <MarketingFeedbackShell>
          <div className="nn-marketing-surface flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <Suspense fallback={null}>
              <AdminGlobalCommandPalette />
            </Suspense>
            <SiteFooter />
          </div>
        </MarketingFeedbackShell>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
