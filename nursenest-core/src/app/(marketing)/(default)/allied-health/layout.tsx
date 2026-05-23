import type { ReactNode } from "react";
import { MarketingAlliedI18nShards } from "@/components/i18n/marketing-allied-i18n-shards";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { traceLayout } from "@/build/tracing";

/** Loads `allied.*` i18n only for this subtree (not for all marketing routes). */
const AlliedHealthI18nLayout = traceLayout(
  import.meta,
  async function AlliedHealthI18nLayout({ children }: { children: ReactNode }) {
    return <MarketingAlliedI18nShards locale={DEFAULT_MARKETING_LOCALE}>{children}</MarketingAlliedI18nShards>;
  },
  { name: "AlliedHealthI18nLayout" },
);

export default AlliedHealthI18nLayout;
