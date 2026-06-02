import { AUTH_TRANSITION_EN_FIXTURES } from "@/lib/auth/auth-transition-en-fixtures";
import type { AuthTransitionTranslate } from "@/lib/auth/auth-transition-types";

/**
 * Prevents blank states and raw `auth.transition.*` key leakage when a locale shard is incomplete.
 */
export function createAuthTransitionTranslate(base: AuthTransitionTranslate): AuthTransitionTranslate {
  return (key: string, options?) => {
    const raw = base(key, options);
    if (typeof raw === "string" && raw.trim().length > 0 && raw !== key && !raw.startsWith("auth.transition.")) {
      return raw;
    }
    const fallback = AUTH_TRANSITION_EN_FIXTURES[key];
    if (typeof fallback === "string" && fallback.trim().length > 0) {
      if (!options) return fallback;
      return Object.entries(options).reduce(
        (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
        fallback,
      );
    }
    return typeof raw === "string" && raw.trim().length > 0 ? raw : key;
  };
}
