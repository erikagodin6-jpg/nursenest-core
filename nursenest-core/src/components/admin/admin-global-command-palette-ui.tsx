"use client";

import dynamic from "next/dynamic";

const AdminCommandPaletteClient = dynamic(
  () => import("./admin-command-palette-client").then((m) => m.AdminCommandPaletteClient),
  { ssr: false },
);

/** Client boundary for staff-only palette — `ssr: false` must not run in a Server Component file. */
export function AdminGlobalCommandPaletteUi() {
  return <AdminCommandPaletteClient />;
}
