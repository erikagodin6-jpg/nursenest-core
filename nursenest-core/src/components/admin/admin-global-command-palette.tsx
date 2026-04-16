import "server-only";

import { getStaffSession } from "@/lib/auth/staff-session";
import { AdminGlobalCommandPaletteUi } from "@/components/admin/admin-global-command-palette-ui";

/**
 * Staff-only command palette entry (keyboard + invisible hotspot). Rendered only when
 * {@link getStaffSession} resolves — no markup or client bundle for learners.
 */
export async function AdminGlobalCommandPalette() {
  const staff = await getStaffSession();
  if (!staff) return null;
  return <AdminGlobalCommandPaletteUi />;
}
