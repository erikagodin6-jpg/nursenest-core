"use client";

import { useEffect } from "react";
import { mountGlobalUxListeners, touchUxNavigation } from "@/lib/observability/frontend-ux-tracking";

/**
 * Mounts window listeners (hydration hints, chunk / dynamic import failures) once.
 * Navigation timestamps are updated from {@link AnalyticsProvider} on pathname changes.
 */
export function FrontendUxInit() {
  useEffect(() => {
    mountGlobalUxListeners();
  }, []);
  return null;
}
