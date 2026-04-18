import "server-only";

import { getStaffSession } from "@/lib/auth/staff-session";
import { safeAwait } from "@/lib/async/safe-await";
import { renderTrace } from "@/lib/observability/render-trace";
import { AdminGlobalCommandPaletteUi } from "@/components/admin/admin-global-command-palette-ui";

const ADMIN_GLOBAL_COMMAND_PALETTE_TIMEOUT_MS = 1000;

/**
 * Database-backed staff only (Cmd/Ctrl+K). No client chunk for learners. Passes tier so quick links
 * match {@link isNavHrefAllowedForStaffTier} (same rules as admin nav).
 */
export async function AdminGlobalCommandPalette() {
  renderTrace("admin palette start", { route: "shared-root-layout" });
  const staff = await safeAwait(
    getStaffSession(),
    "admin_global_command_palette.staff_session",
    ADMIN_GLOBAL_COMMAND_PALETTE_TIMEOUT_MS,
  );
  renderTrace("admin palette after session", {
    route: "shared-root-layout",
    hasStaff: Boolean(staff),
  });
  if (!staff) return null;
  return <AdminGlobalCommandPaletteUi staffTier={staff.tier} />;
}
