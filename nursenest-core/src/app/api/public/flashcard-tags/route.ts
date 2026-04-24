import type { NextRequest } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeJsonRoute } from "@/lib/server/safe-api-route";
import { handlePublicFlashcardTagsGet } from "./handle-public-flashcard-tags-get";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_DEFAULT_SEC`). */
export const maxDuration = 25;

/** Topic tags that appear on at least one public-scope deck (for learner hub filters). Cached server-side + CDN. */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/public/flashcard-tags", "public", async () => {
    return safeJsonRoute("GET /api/public/flashcard-tags", async () => handlePublicFlashcardTagsGet());
  });
}
