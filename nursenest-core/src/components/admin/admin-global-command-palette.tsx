import "server-only";

import { getStaffSession } from "@/lib/auth/staff-session";
import { AdminGlobalCommandPaletteUi } from "@/components/admin/admin-global-command-palette-ui";

/**
 * Database-backed staff only (Cmd/Ctrl+K). No client chunk for learners. Passes tier so quick links
 * match {@link isNavHrefAllowedForStaffTier} (same rules as admin nav).
 */
export async function AdminGlobalCommandPalette() {
  const staff = await getStaffSession();
  if (!staff) return null;
  return <AdminGlobalCommandPaletteUi staffTier={staff.tier} />;
}
