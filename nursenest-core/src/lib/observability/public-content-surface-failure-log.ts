import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";

export type PublicMarketingContentSurface = "lessons" | "blog" | "flashcards" | "flashcard_tags";

/**
 * Structured failure log for marketing study surfaces — **no** generic one-line errors.
 * Call from route handlers, loaders, and ops scripts when inventory gates fail.
 */
export function logPublicContentSurfaceFailure(args: {
  surface: PublicMarketingContentSurface;
  reason: string;
  count: number;
  exampleUrls?: readonly string[];
}): void {
  const urls = args.exampleUrls?.length ? args.exampleUrls.slice(0, 12).join("|") : "";
  safeServerLog("public_content", "surface_data_unavailable", {
    event: "surface_data_unavailable",
    surface: args.surface,
    reason: args.reason.slice(0, 500),
    count: String(args.count),
    example_urls: urls.slice(0, 2000),
  });
}
