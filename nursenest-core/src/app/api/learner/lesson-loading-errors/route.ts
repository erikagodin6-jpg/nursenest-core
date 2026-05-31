import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

function trimField(value: unknown, max = 500): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
}

export async function POST(req: Request) {
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  safeServerLog("page_lessons", "lesson_system_client_load_failed", {
    user_id: userId ?? "anonymous",
    route: trimField(body.route, 300),
    topic: trimField(body.topic, 120),
    topic_slug: trimField(body.topicSlug, 120),
    pathway_id: trimField(body.pathwayId, 120),
    page: trimField(body.page, 20),
    error_message: trimField(body.error, 500),
    stack: trimField(body.stack, 1200),
  });

  return NextResponse.json({ ok: true });
}
