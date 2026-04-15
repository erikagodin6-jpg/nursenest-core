/**
 * Structured logs for auth incident response. Single prefix for grep / log drains.
 * Never log secrets, raw passwords, or full session tokens.
 */
import { redactMetaForLog } from "@/lib/env/redact-secrets";

export const AUTH_INCIDENT_LOG_PREFIX = "[auth-incident]";

export function logAuthIncidentLine(payload: Record<string, unknown>): void {
  const safe = redactMetaForLog(payload);
  console.error(`${AUTH_INCIDENT_LOG_PREFIX} ${JSON.stringify(safe)}`);
}
