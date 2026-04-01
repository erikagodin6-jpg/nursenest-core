import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userHasAdminRoleInDatabase } from "@/lib/auth/admin-authority";

export type AdminSession = {
  userId: string;
  role: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id) return null;
  /** Prisma `UserRole.ADMIN` — must match session JWT / callback (not lowercase `admin`). */
  if (user.role === "ADMIN") {
    return { userId: user.id, role: user.role };
  }
  if (await userHasAdminRoleInDatabase(user.id)) {
    return { userId: user.id, role: "ADMIN" };
  }
  return null;
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAdmin() {
  const a = await getAdminSession();
  if (!a) return { ok: false as const, response: forbidden() };
  return { ok: true as const, admin: a };
}
