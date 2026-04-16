import "server-only";

import dynamic from "next/dynamic";
import { getStaffSession } from "@/lib/auth/staff-session";

const AdminCommandPaletteClient = dynamic(
  () => import("./admin-command-palette-client").then((m) => m.AdminCommandPaletteClient),
  { ssr: false },
);

/**
 * Staff-only command palette entry (keyboard + invisible hotspot). Rendered only when
 * {@link getStaffSession} resolves — no markup or client bundle for learners.
 */
export async function AdminGlobalCommandPalette() {
  const staff = await getStaffSession();
  if (!staff) return null;
  return <AdminCommandPaletteClient />;
}
