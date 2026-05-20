import "server-only";

import { notFound } from "next/navigation";
import { getAdminModulePreviewAccess, type AdminModulePreviewAccess } from "@/lib/modules/admin-module-preview-access";
import { isLabValuesModuleEnabled } from "@/lib/lab-values/lab-values-module";

export async function getCurrentLabValuesModuleAccess(): Promise<AdminModulePreviewAccess> {
  return getAdminModulePreviewAccess({
    publicEnabled: isLabValuesModuleEnabled(),
    surface: "auth.lab_values_module_preview",
  });
}

export async function requireLabValuesModuleAccess(): Promise<Extract<AdminModulePreviewAccess, { ok: true }>> {
  const gate = await getCurrentLabValuesModuleAccess();
  if (!gate.ok) notFound();
  return gate;
}
