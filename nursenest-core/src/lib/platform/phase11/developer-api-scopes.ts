/**
 * Phase 11 — OAuth-style **permission scopes** for future API tokens (planning identifiers only).
 *
 * Runtime enforcement must still call `getUserAccess` / staff session / org row checks per route.
 * Scopes never replace server-side entitlement resolution.
 *
 * See reports/phase-11-developer-platform.md
 */

export const DeveloperApiScope = {
  /** Read-only self progress aggregates (no item-level PII export without narrower future scope). */
  learnerSelfProgressRead: "nn:learner:self:progress:read",
  /** Institution-scoped cohort analytics (aggregate); requires org match + staff/instructor token class. */
  institutionCohortAnalyticsRead: "nn:institution:cohort:analytics:read",
  /** Assignment publish to cohorts the token org owns. */
  institutionAssignmentWrite: "nn:institution:assignment:write",
  /** Server-mediated content ingestion staging (no direct DB from partner). */
  externalContentIngestWrite: "nn:integration:content_ingest:write",
  /** Webhook management for verified integrations only. */
  integrationWebhookManage: "nn:integration:webhook:manage",
  /** Read-only analytics export job lifecycle (no raw row dump scope here). */
  analyticsExportJobRead: "nn:analytics:export_job:read",
  /** AI tutoring session metadata (no model prompt injection scope at this tier). */
  aiTutorSessionMetaRead: "nn:ai_tutor:session:read",
  /** Simulation module launch ticket (short-lived, pathway-bound). */
  simulationLaunchTicketRead: "nn:simulation:launch_ticket:read",
} as const;

export type DeveloperApiScope = (typeof DeveloperApiScope)[keyof typeof DeveloperApiScope];
