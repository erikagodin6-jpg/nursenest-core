/** Shared loader telemetry context for marketing exam hubs (country segment, not UI language). */
export type MarketingHubDataLoadContext = {
  pathname: string;
  /** URL segment: `us` | `canada` (not UI language). */
  locale: string;
  country: string;
  examCode: string;
  pathwayId: string;
  roleTrack?: string;
};
