"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

export function NpInventoryHeading() {
  const { t } = useMarketingI18n();
  return <p className="nn-marketing-h4">{t("components.examPathwayHub.npInventoryHeading")}</p>;
}
