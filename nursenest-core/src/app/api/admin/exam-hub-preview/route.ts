import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { EXAM_HUB_PREVIEW_COOKIE, EXAM_HUB_PREVIEW_MAX_AGE_SEC } from "@/lib/admin/exam-hub-preview-cookie";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";

export const dynamic = "force-dynamic";

/**
 * Sets an HttpOnly cookie so Edge `proxy` allows viewing an unpublished `/exams/…` hub (staff only).
 * Does not change public behavior for learners.
 */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const region = body && typeof body === "object" && "region" in body ? String((body as { region?: string }).region ?? "").trim() : "";
  if (!region || !isGlobalRegionSlug(region)) {
    return NextResponse.json({ error: "region must be a valid GlobalRegionSlug" }, { status: 400 });
  }

  /** Matches `globalRegionSlugFromExpansionExamsPathname` for shared hubs (e.g. middle-east → uae). */
  const cookieRegion = region === "saudi-arabia" ? "uae" : region;

  const res = NextResponse.json({ ok: true, region: cookieRegion });
  res.cookies.set(EXAM_HUB_PREVIEW_COOKIE, cookieRegion, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: EXAM_HUB_PREVIEW_MAX_AGE_SEC,
  });
  return res;
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(EXAM_HUB_PREVIEW_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
