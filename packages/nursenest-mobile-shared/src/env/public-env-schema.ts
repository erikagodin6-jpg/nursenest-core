/**
 * Documented EXPO_PUBLIC_* keys for mobile — values come from EAS env / .env (not committed).
 * Mirrors web naming where possible (PostHog host/key).
 */
export type MobilePublicEnv = {
  EXPO_PUBLIC_API_ORIGIN?: string;
  EXPO_PUBLIC_APP_ORIGIN?: string;
  EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN?: string;
  EXPO_PUBLIC_POSTHOG_KEY?: string;
  EXPO_PUBLIC_POSTHOG_HOST?: string;
  EXPO_PUBLIC_SENTRY_DSN?: string;
  EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE?: string;
  EXPO_PUBLIC_FEATURE_FLAGS_STUB?: string;
};

export const MOBILE_PUBLIC_ENV_KEYS: (keyof MobilePublicEnv)[] = [
  "EXPO_PUBLIC_API_ORIGIN",
  "EXPO_PUBLIC_APP_ORIGIN",
  "EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN",
  "EXPO_PUBLIC_POSTHOG_KEY",
  "EXPO_PUBLIC_POSTHOG_HOST",
  "EXPO_PUBLIC_SENTRY_DSN",
  "EXPO_PUBLIC_ENABLE_QUERY_PERSISTENCE",
  "EXPO_PUBLIC_FEATURE_FLAGS_STUB",
];
