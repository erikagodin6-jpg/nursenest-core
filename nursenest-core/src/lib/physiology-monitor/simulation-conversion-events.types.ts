/**
 * Shared simulation conversion event types (client + server safe).
 */

export type SimulationConversionEvent =
  | "simulation_viewed"
  | "simulation_started"
  | "simulation_completed"
  | "simulation_abandoned"
  | "simulation_replay_opened"
  | "simulation_replay_completed"
  | "clearance_page_viewed"
  | "clearance_attempted"
  | "clearance_earned"
  | "readiness_dashboard_viewed"
  | "simulation_center_viewed"
  | "simulation_remediation_clicked"
  | "simulation_upsell_clicked"
  | "subscription_upgraded_after_simulation"
  | "subscription_renewed_after_simulation";

export interface SimulationEventProperties {
  conditionKey?: string;
  compositeScore?: number;
  harmColor?: "green" | "yellow" | "red";
  mode?: string;
  sessionId?: string;
  domain?: string;
  source?: string;
  tier?: string;
  clearanceId?: string;
  readinessDomain?: string;
  subscriptionPlan?: string;
  upgradePath?: string;
}
