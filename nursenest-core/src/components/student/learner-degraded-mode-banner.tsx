"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Surfaces durability / degraded / emergency flags without implying the product is “down”.
 * Server passes env-driven flags; client can also read `NEXT_PUBLIC_NN_DEGRADED_MODE` for hydration parity.
 */
export function LearnerDegradedModeBanner({
  serverDegraded,
  serverCoreEmergency,
}: {
  serverDegraded: boolean;
  serverCoreEmergency: boolean;
}) {
  const { t } = useMarketingI18n();
  const clientFlag =
    typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_NN_DEGRADED_MODE === "1" || process.env.NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY === "1");
  const show = serverDegraded || serverCoreEmergency || clientFlag;
  if (!show) return null;

  const emergency = serverCoreEmergency || process.env.NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY === "1";

  return (
    <div
      className="mb-2 rounded-xl border px-3 py-2 text-sm"
      role="status"
      aria-live="polite"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-warning) 32%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-warm) 90%, var(--semantic-surface))",
      }}
    >
      <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.degraded.bannerTitle")}</p>
      <p className="mt-0.5 leading-relaxed text-[var(--semantic-text-secondary)]">
        {emergency ? t("learner.degraded.emergencyBannerBody") : t("learner.degraded.bannerBody")}
      </p>
    </div>
  );
}
