import type { MobileNativeEngagementEvent } from "@nursenest/mobile-shared";
import PostHog from "posthog-react-native";
import { log } from "../lib/logging";

let posthog: PostHog | null = null;

function posthogHost(): string {
  return process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
}

function ensureClient(): PostHog | null {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return null;
  if (!posthog) {
    posthog = new PostHog(key, { host: posthogHost() });
    log.info("posthog_client_ready");
  }
  return posthog;
}

function toProps(event: MobileNativeEngagementEvent): Record<string, string | number | boolean> {
  const base: Record<string, string | number | boolean> = {
    surface: event.surface,
    clientTimestampMs: event.clientTimestampMs,
  };
  if (event.pathwayId) base.pathwayId = event.pathwayId;
  switch (event.name) {
    case "engagement.session_end":
      base.durationMs = event.durationMs;
      break;
    case "engagement.streak_increment":
      base.streakLengthDays = event.streakLengthDays;
      break;
    case "engagement.dal_checkpoint":
      base.dayIndex = event.dayIndex;
      break;
    case "engagement.return_day_n":
      base.n = event.n;
      break;
    default:
      break;
  }
  return base;
}

/**
 * Engagement analytics — mirrors web PostHog patterns (`NEXT_PUBLIC_POSTHOG_*` → `EXPO_PUBLIC_POSTHOG_*`).
 */
export function emitEngagementEvent(event: MobileNativeEngagementEvent): void {
  const client = ensureClient();
  if (!client) {
    if (__DEV__) {
      log.debug("analytics_stub_engagement", { name: event.name, surface: event.surface });
    }
    return;
  }
  try {
    client.capture(event.name, toProps(event));
  } catch (e) {
    log.warn("analytics_capture_failed", { name: event.name, message: String(e) });
  }
}
