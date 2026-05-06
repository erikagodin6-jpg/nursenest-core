import "server-only";

import { NextResponse } from "next/server";
import { isPrintableAdminApiAllowed } from "@/lib/printables/printable-store-flags";

export function printableAdminSurfaceForbidden(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      code: "printable_admin_disabled",
      error: "Printable admin is disabled (set ADMIN_PRINTABLES_ENABLED=true while PRINTABLE_STORE_ENABLED=false).",
    },
    { status: 403 },
  );
}

export function assertPrintableAdminSurface(): NextResponse | null {
  if (!isPrintableAdminApiAllowed()) return printableAdminSurfaceForbidden();
  return null;
}
