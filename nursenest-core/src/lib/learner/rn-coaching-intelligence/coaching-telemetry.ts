import { trackClientEvent } from "@/lib/observability/posthog-client";

export function recordCoachingTelemetry(event: string, props?: Record<string, string | number | boolean>): void {
  void trackClientEvent(event, props);
}
