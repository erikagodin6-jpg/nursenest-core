import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { loadUserRoleFromDbIdentity } from "@/lib/auth/admin-role-source";

function debugMeEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ADMIN_ACCESS_DEBUG === "1" ||
    process.env.ADMIN_ACCESS_DEBUG === "true" ||
    process.env.PLAYWRIGHT_DEBUG_ME === "1"
  );
}

export async function GET() {
  if (!debugMeEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  const user = session?.user as { id?: string; email?: string | null } | undefined;
  const userId = typeof user?.id === "string" && user.id.trim().length > 0 ? user.id.trim() : null;
  const email = typeof user?.email === "string" && user.email.trim().length > 0 ? user.email.trim() : null;

  if (!userId && !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roleRecord = await loadUserRoleFromDbIdentity({ userId, email });
  return NextResponse.json({
    email,
    role: roleRecord?.role ?? null,
    isAdmin: Boolean(roleRecord?.isAdmin),
  });
}
