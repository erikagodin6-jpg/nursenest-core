import "server-only";

import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { SubscriberSessionResult } from "@/lib/entitlements/require-subscriber-session";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";

/**
 * Study-tool APIs require an active learner entitlement **and** either public launch
 * or DB-backed staff preview (mirrors {@link requireStudyToolsRouteAccess}).
 */
export async function requireStudyToolsApiSession(): Promise<SubscriberSessionResult> {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate;
  if (isStudyToolsPubliclyEnabled()) return gate;
  const staff = await getStaffSession();
  if (!staff) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          code: "study_tools_preview_only",
          message: "Study tools are in staff preview until NEXT_PUBLIC_ENABLE_STUDY_TOOLS=true.",
        },
        { status: 403, headers: mergeSubscriberPrivateCacheHeaders() },
      ),
    };
  }
  return gate;
}
