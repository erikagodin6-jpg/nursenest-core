"use client";

import { StudyCard } from "@/components/ui/study-card";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";

export function AlliedPathwayHubCatCard({
  professionKey,
  catHref,
}: {
  professionKey: string | null | undefined;
  catHref: string;
}) {
  const { t } = useMarketingI18n();
  const unlocked = alliedHubCatSurfaceUnlocked(professionKey);

  if (!unlocked) {
    return (
      <StudyCard
        surface="hub"
        variant="locked"
        href="/"
        className="nn-exam-hub-study-card--cat nn-qa-allied-hub-cat nn-qa-allied-hub-cat-locked"
        title={t("components.alliedPathwayHub.catAdaptiveLockedTitle")}
        description={t("components.alliedPathwayHub.catAdaptiveLockedDescription")}
        cta={t("components.alliedPathwayHub.catAdaptiveLockedCta")}
      />
    );
  }

  return (
    <StudyCard
      surface="hub"
      variant="featured"
      href={catHref}
      className="nn-exam-hub-study-card--cat nn-qa-allied-hub-cat"
      title={t("components.alliedPathwayHub.catAdaptiveTitle")}
      description={t("components.alliedPathwayHub.catAdaptiveDescription")}
      cta={t("components.alliedPathwayHub.catAdaptiveCta")}
    />
  );
}
