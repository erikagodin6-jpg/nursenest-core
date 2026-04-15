/**
 * Structured logs for auth incident response. Single prefix for grep / log drains.
 * Never log secrets, raw passwords, or full session tokens.
 */
export const AUTH_INCIDENT_LOG_PREFIX = "[auth-incident]";

export function logAuthIncidentLine(payload: Record<string, unknown>): void {
  console.error(`${AUTH_INCIDENT_LOG_PREFIX} ${JSON.stringify(payload)}`);
}
