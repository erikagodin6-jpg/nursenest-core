"use client";

import dynamic from "next/dynamic";
import type { StaffTier } from "@/lib/auth/staff-roles";

const AdminCommandPaletteClient = dynamic(
  () => import("./admin-command-palette-client").then((m) => m.AdminCommandPaletteClient),
  { ssr: false },
);

/** Client boundary for staff-only palette — `ssr: false` must not run in a Server Component file. */
export function AdminGlobalCommandPaletteUi({ staffTier }: { staffTier: StaffTier }) {
  return <AdminCommandPaletteClient staffTier={staffTier} />;
}
