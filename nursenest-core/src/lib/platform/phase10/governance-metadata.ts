/**
 * Phase 10 governance metadata contracts.
 * See reports/phase-10-ecosystem-platform.md
 */

export type ModuleOwnershipRecord = {
  moduleKey: string;
  owningTeam: string;
  slackOrTicketRouter?: string;
  escalationTier: "l1" | "l2" | "security";
};

export type ContentLineageRef = {
  canonicalSlug: string;
  pathwayId: string;
  upstreamSources: readonly { system: string; externalId: string; ingestedAtIso: string }[];
};

export type IntegrationAuditLogEntry = {
  occurredAtIso: string;
  actorUserId: string | null;
  actorStaffTier: string | null;
  action: "register_webhook" | "rotate_secret" | "disable_integration" | "export_analytics";
  targetIntegrationId: string;
  credentialRef?: string;
};
