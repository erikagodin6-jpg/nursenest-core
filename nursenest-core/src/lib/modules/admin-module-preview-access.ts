import type { Session } from "next-auth";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession, type StaffSession } from "@/lib/auth/staff-session";

export type AdminModulePreviewAccess =
  | { ok: true; mode: "admin-preview"; userId: string }
  | { ok: false; reason: "module-disabled" | "not-signed-in" | "not-admin" };

function resolveUserId(session: Session | null): string {
  const user = session?.user as { id?: string | null; email?: string | null; sub?: string | null } | undefined;
  return user?.id?.trim() || user?.sub?.trim() || user?.email?.trim() || "";
}

export function isAdminModulePreviewEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_ADMIN_MODULE_PREVIEW?.trim().toLowerCase();
  return raw == null || raw === "" || raw === "1" || raw === "true";
}

export async function getAdminModulePreviewAccess(options: {
  publicEnabled: boolean;
  surface: string;
  loadSession?: () => Promise<Session | null>;
  loadStaffSession?: () => Promise<StaffSession | null>;
  env?: Record<string, string | undefined>;
}): Promise<AdminModulePreviewAccess> {
  if (options.publicEnabled) {
    return { ok: false, reason: "module-disabled" };
  }
  if (!isAdminModulePreviewEnabled(options.env)) {
    return { ok: false, reason: "module-disabled" };
  }

  const session = await getProtectedRouteSession(options.surface, options.loadSession);
  const userId = resolveUserId(session);
  if (!userId) return { ok: false, reason: "not-signed-in" };

  const staff = options.loadStaffSession ? await options.loadStaffSession() : await getStaffSession();
  if (!staff) return { ok: false, reason: "not-admin" };

  return { ok: true, mode: "admin-preview", userId };
}
