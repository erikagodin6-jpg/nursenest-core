import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getBlogAiRuntimeDiagnostics } from "@/lib/ai/blog-ai-env-resolution";

/**
 * Staff-only, **non-secret** snapshot of blog AI env resolution (presence flags + provider/model ids).
 * Route Handlers run in the Node.js server runtime on App Platform — same `process.env` as generation jobs.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  return NextResponse.json(getBlogAiRuntimeDiagnostics(), {
    headers: { "Cache-Control": "private, no-store, must-revalidate" },
  });
}
