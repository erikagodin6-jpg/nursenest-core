import type { CasperSessionMode } from "@/lib/casper/casper-session-types";

export type CasperAnalyticsEventName =
  | "casper_marketing_cta_clicked"
  | "casper_mini_simulation_started"
  | "casper_station_completed"
  | "casper_mini_simulation_completed"
  | "casper_premium_cta_viewed"
  | "casper_premium_cta_clicked"
  | "casper_scenario_detail_viewed"
  | "casper_app_dashboard_viewed"
  | "casper_review_viewed";

export type CasperAnalyticsEvent = {
  name: CasperAnalyticsEventName;
  occurredAtIso: string;
  properties: Record<string, string | number | boolean | null>;
};

export function buildCasperAnalyticsEvent(
  name: CasperAnalyticsEventName,
  properties: Record<string, string | number | boolean | null> = {},
): CasperAnalyticsEvent {
  return {
    name,
    occurredAtIso: new Date().toISOString(),
    properties,
  };
}

export function buildCasperSessionStartedEvent(input: {
  mode: CasperSessionMode;
  stationCount: number;
  isPremium: boolean;
}): CasperAnalyticsEvent {
  return buildCasperAnalyticsEvent("casper_mini_simulation_started", {
    mode: input.mode,
    stationCount: input.stationCount,
    isPremium: input.isPremium,
  });
}

export function buildCasperPremiumCtaEvent(input: {
  source: string;
  productKey: string;
}): CasperAnalyticsEvent {
  return buildCasperAnalyticsEvent("casper_premium_cta_clicked", {
    source: input.source,
    productKey: input.productKey,
  });
}
