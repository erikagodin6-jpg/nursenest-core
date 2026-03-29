import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AdminSession = {
  userId: string;
  role: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return null;
  return { userId: user.id, role: user.role };
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAdmin() {
  const a = await getAdminSession();
  if (!a) return { ok: false as const, response: forbidden() };
  return { ok: true as const, admin: a };
}
