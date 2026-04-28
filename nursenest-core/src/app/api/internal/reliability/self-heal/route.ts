import { NextResponse } from "next/server";
import { isReliabilityRequestAuthorized } from "@/lib/reliability/internal-reliability-guard";
import { executeRevalidateCriticalPaths, parseSelfHealBody } from "@/lib/reliability/self-heal-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isReliabilityRequestAuthorized(request)) {
    return new NextResponse(null, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const parsed = parseSelfHealBody(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 },
    );
  }

  const revalidated = await executeRevalidateCriticalPaths();

  return NextResponse.json({
    ok: true,
    action: parsed.action,
    revalidated,
  });
}
