import type { ReactNode } from "react";
import { requireEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

export const dynamic = "force-dynamic";

export default async function EcgModuleLayout({ children }: { children: ReactNode }) {
  await requireEcgModuleAccess();
  return children;
}

