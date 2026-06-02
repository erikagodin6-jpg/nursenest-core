import { MobileApiError } from "./mobile-api-client";

/** Hard stop: show upgrade / re-auth — do not retry in-app without user action. */
export function isHardEntitlementStop(error: unknown): boolean {
  if (!(error instanceof MobileApiError)) return false;
  return error.status === 401 || error.status === 403;
}

export function entitlementStopMessage(error: unknown): string {
  if (error instanceof MobileApiError) {
    if (error.status === 401) return "Session expired. Sign in again to continue.";
    if (error.status === 403) return "This content needs an active subscription for your pathway.";
  }
  return "Access could not be verified.";
}
