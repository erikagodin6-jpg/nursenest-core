import type { CasperAnalyticsEvent } from "@/lib/casper/casper-analytics";

export type CasperAnalyticsIngestionProvider = {
  providerKey: string;
  ingest(event: CasperAnalyticsEvent): Promise<void>;
};

export const consoleCasperAnalyticsProvider: CasperAnalyticsIngestionProvider = {
  providerKey: "console",

  async ingest(event) {
    console.info("[CASPER_ANALYTICS]", {
      name: event.name,
      occurredAtIso: event.occurredAtIso,
      properties: event.properties,
    });
  },
};

export let activeCasperAnalyticsProvider: CasperAnalyticsIngestionProvider =
  consoleCasperAnalyticsProvider;

export function setCasperAnalyticsProvider(
  provider: CasperAnalyticsIngestionProvider,
) {
  activeCasperAnalyticsProvider = provider;
}

export async function ingestCasperAnalyticsEvent(
  event: CasperAnalyticsEvent,
): Promise<void> {
  await activeCasperAnalyticsProvider.ingest(event);
}
