import * as Sentry from "@sentry/react-native";
import { log } from "./logging";

let initialized = false;

/**
 * Initializes Sentry when `EXPO_PUBLIC_SENTRY_DSN` is present. Never commit the DSN.
 * For native symbolication and release health, add the Sentry Expo config plugin in a follow-up.
 */
export function initSentryFromEnv(): void {
  if (initialized) return;
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) {
    log.debug("sentry_disabled_no_dsn");
    return;
  }
  Sentry.init({
    dsn,
    enabled: !__DEV__,
    debug: __DEV__,
  });
  initialized = true;
  log.info("sentry_initialized");
}
