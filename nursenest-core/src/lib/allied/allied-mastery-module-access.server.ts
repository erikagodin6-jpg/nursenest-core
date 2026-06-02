import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import { isAdminModulePreviewEnabled, isAlliedMasteryModulesPublicEnabled } from "@/lib/allied/allied-mastery-modules";

export type AlliedMasteryModuleAccess =
  | { ok: true; mode: "admin-preview"; userId: string }
  | { ok: false; reason: "module-disabled" | "not-signed-in" | "not-admin" };

export async function getCurrentAlliedMasteryModuleAccess(): Promise<AlliedMasteryModuleAccess> {
  if (isAlliedMasteryModulesPublicEnabled()) {
    return { ok: false, reason: "module-disabled" };
  }
  if (!isAdminModulePreviewEnabled()) {
    return { ok: false, reason: "module-disabled" };
  }

  const session = await getProtectedRouteSession("auth.allied_mastery_module_preview").catch(() => null);
  const user = session?.user as { id?: string | null; email?: string | null; sub?: string | null } | undefined;
  const userId = user?.id?.trim() || user?.sub?.trim() || user?.email?.trim() || "";
  if (!userId) return { ok: false, reason: "not-signed-in" };

  const staff = await getStaffSession().catch(() => null);
  if (!staff) return { ok: false, reason: "not-admin" };

  return { ok: true, mode: "admin-preview", userId };
}
