"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Shared, regulator-safe disclosures for country exam hubs (path + i18n).
 * Keep local exam sections first elsewhere; this block states global limits consistently.
 */
export function RegionalHubTruthStrip() {
  const { t } = useMarketingI18n();
  return (
    <section className="mt-12" aria-labelledby="regional-hub-truth">
      <h2 id="regional-hub-truth" className="nn-marketing-h2">
        {t("regionalHub.standard.truthTitle")}
      </h2>
      <div className="space-y-4 text-[var(--theme-body-text)]">
        <p>{t("regionalHub.standard.truthIntro")}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t("regionalHub.standard.bulletNotAuthority")}</li>
          <li>{t("regionalHub.standard.bulletNotBank")}</li>
          <li>{t("regionalHub.standard.bulletNotLegal")}</li>
        </ul>
      </div>
    </section>
  );
}

/** Optional compact note when a hub does not yet have a dedicated language-honesty section. */
export function RegionalHubLanguageNoteStrip() {
  const { t } = useMarketingI18n();
  return (
    <section className="mt-12" aria-labelledby="regional-hub-lang-note">
      <h2 id="regional-hub-lang-note" className="nn-marketing-h2">
        {t("regionalHub.standard.languageNoteTitle")}
      </h2>
      <p className="text-[var(--theme-body-text)]">{t("regionalHub.standard.languageNoteBody")}</p>
    </section>
  );
}
