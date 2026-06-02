import { NextResponse } from "next/server";
import { z } from "zod";
import { JSON_BODY_TINY, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { stampCheckoutGlobalRegionContextFromPathname } from "@/lib/region/stamp-checkout-global-region-context-from-pathname.server";

const bodySchema = z.object({
  pathname: z.string().max(4096),
});

/**
 * Path-derived checkout region cookie stamp for marketing navigation.
 * Replaces a prior Server Action so ISR/cached shells + rolling deploys do not break with
 * "Failed to find Server Action" on `POST /(marketing)/(default)/page`.
 */
export async function POST(req: Request) {
  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_TINY);
  if (!bodyRead.ok) return bodyRead.response;

  const parsed = bodySchema.safeParse(bodyRead.value);
  if (!parsed.success) {
    return NextResponse.json({ ok: false as const, error: "invalid_body" }, { status: 400 });
  }

  const result = await stampCheckoutGlobalRegionContextFromPathname(parsed.data.pathname);
  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}
