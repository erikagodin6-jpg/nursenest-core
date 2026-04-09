import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminUserSearch } from "@/lib/admin/load-admin-user-search";

/**
 * GET ?q= — search learners by email, name, username, or id (cuid).
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ ok: true, users: [], hint: "Query must be at least 2 characters." });
  }

  const users = await loadAdminUserSearch(q);
  return NextResponse.json({ ok: true, users });
}
