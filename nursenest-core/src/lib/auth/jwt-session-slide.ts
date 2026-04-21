import type { JWT } from "next-auth/jwt";
import {
  JWT_SESSION_BRIEF_MAX_AGE_SEC,
  JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC,
  JWT_SESSION_REMEMBER_MAX_AGE_SEC,
  JWT_SESSION_UPDATE_AGE_SEC,
} from "@/lib/auth/auth-session-constants";

/**
 * Bumps JWT `exp` for "stay signed in" sessions on a throttled cadence so active users are not
 * cut off at a fixed wall from login, while still bounded by {@link JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC}
 * from first login.
 *
 * Brief (no stay signed in) sessions keep a fixed `exp` from login — no extension.
 *
 * @param nowOverrideSec — deterministic tests only; production callers omit.
 */
export function rollSlidingJwtExpiry(token: JWT, nowOverrideSec?: number): void {
  const nowSec = typeof nowOverrideSec === "number" ? nowOverrideSec : Math.floor(Date.now() / 1000);
  const exp = typeof token.exp === "number" ? token.exp : 0;
  if (typeof token.sub !== "string" || token.sub.length === 0 || exp <= nowSec) return;

  const rememberLong = token.rememberLong !== false;

  let loginAt =
    typeof token.loginAtSec === "number" && token.loginAtSec > 0 ? token.loginAtSec : 0;
  if (loginAt <= 0) {
    const windowGuess = rememberLong ? JWT_SESSION_REMEMBER_MAX_AGE_SEC : JWT_SESSION_BRIEF_MAX_AGE_SEC;
    loginAt = Math.max(0, exp - windowGuess);
    token.loginAtSec = loginAt;
  }

  const lastRoll =
    typeof token.activityRollAtSec === "number" && token.activityRollAtSec > 0
      ? token.activityRollAtSec
      : loginAt;
  if (nowSec - lastRoll < JWT_SESSION_UPDATE_AGE_SEC) return;

  if (!rememberLong) {
    token.activityRollAtSec = nowSec;
    return;
  }

  const rememberAbsolute = loginAt + JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC;
  const proposed = nowSec + JWT_SESSION_REMEMBER_MAX_AGE_SEC;
  const capped = Math.min(proposed, rememberAbsolute);
  if (capped > exp) {
    token.exp = capped;
  }
  token.activityRollAtSec = nowSec;
}
