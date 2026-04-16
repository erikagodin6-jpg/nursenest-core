import { NextResponse } from "next/server";
import { CACHE_HEADER_PUBLIC_LIST } from "@/lib/cache/public-edge-cache";
import { getCachedPublicFlashcardTags } from "@/lib/marketing/public-flashcard-tags";
import { safeJsonReadRoute } from "@/lib/server/safe-api-route";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_DEFAULT_SEC`). */
export const maxDuration = 25;

/** Topic tags that appear on at least one public-scope deck (for learner hub filters). Cached server-side + CDN. */
export async function GET() {
  return safeJsonReadRoute(
    "GET /api/public/flashcard-tags",
    async () => {
      const body = await getCachedPublicFlashcardTags();
      return NextResponse.json(body, { headers: CACHE_HEADER_PUBLIC_LIST });
    },
    { tags: [] },
  );
}
