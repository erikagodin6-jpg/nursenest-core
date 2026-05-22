import "server-only";

import { captureServerEvent } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export function trackAuthCallbackRejected(reason: string, surface: string): void {
  safeServerLog("auth", "auth_callback_rejected", {
    reason: reason.slice(0, 80),
    surface: surface.slice(0, 40),
  });
  captureServerEvent("anonymous", "auth_callback_rejected", {
    reason: reason.slice(0, 80),
    surface: surface.slice(0, 40),
  });
}
