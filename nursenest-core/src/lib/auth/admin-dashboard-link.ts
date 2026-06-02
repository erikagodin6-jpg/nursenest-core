import type { MouseEvent } from "react";

export const ADMIN_DASHBOARD_HREF = "/admin" as const;

/**
 * Full document navigation to `/admin` — avoids marketing → admin soft navigations that can fail to load
 * (App Router / middleware / RSC handoff). Modifier keys and non-primary-button clicks keep default behavior.
 */
export function navigateAdminDashboardHard(e: MouseEvent<HTMLAnchorElement>): void {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (e.button !== 0) return;
  e.preventDefault();
  window.location.assign(ADMIN_DASHBOARD_HREF);
}
