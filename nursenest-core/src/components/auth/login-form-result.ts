export type LoginSubmitResultLike = {
  error?: string;
  code?: string;
  status?: number;
  ok?: boolean;
} | null;

export type LoginSubmitOutcome = "success" | "invalid_credentials" | "generic_error" | "rate_limited";

export function resolveLoginSubmitOutcome(
  result: LoginSubmitResultLike,
  hasConfirmedSession: boolean,
): LoginSubmitOutcome {
  if (hasConfirmedSession) return "success";
  if (!result) return "generic_error";
  /** Auth.js returns `ok: true` on successful credential exchange; treat that as success even if `error` is empty string. */
  if (result.ok === true && !result.error) return "success";
  if (result.error) {
    if (result.code === "rate_limit_exceeded") {
      return "rate_limited";
    }
    /** Auth.js v5: `error` query = type (`CredentialsSignin`); `code` = subcode (`credentials`). */
    if (
      result.error === "CredentialsSignin" ||
      result.code === "CredentialsSignin" ||
      result.code === "credentials" ||
      result.status === 401
    ) {
      return "invalid_credentials";
    }
    return "generic_error";
  }
  if (result.ok === false) {
    /** Credential POST hit proxy 429 before URL parsing in some edge builds — still rate-limited. */
    if (result.status === 429) return "rate_limited";
    return "generic_error";
  }
  return "success";
}
