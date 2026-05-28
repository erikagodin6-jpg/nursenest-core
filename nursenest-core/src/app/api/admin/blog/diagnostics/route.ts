import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildBlogPersistenceDiagnosticsFailure,
  getBlogPersistenceDiagnostics,
} from "@/lib/blog/blog-persistence-integrity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const diagnostics = await getBlogPersistenceDiagnostics().catch((error) =>
    buildBlogPersistenceDiagnosticsFailure(error),
  );
  return NextResponse.json(
    { ok: diagnostics.ok, diagnostics },
    {
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    },
  );
}
