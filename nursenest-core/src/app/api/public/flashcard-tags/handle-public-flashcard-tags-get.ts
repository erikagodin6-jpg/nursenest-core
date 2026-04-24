import { NextResponse } from "next/server";
import { CACHE_HEADER_PUBLIC_LIST } from "@/lib/cache/public-edge-cache-headers";
import type { PublicFlashcardTagsPayload } from "@/lib/marketing/public-flashcard-tags";
import { classifyHubDbFailure, type HubDbFailureCategory } from "@/lib/db/safe-database";
import { logPublicContentSurfaceFailure } from "@/lib/observability/public-content-surface-failure-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" } as const;

function errorCodeForPublicFlashcardTagsFailure(kind: HubDbFailureCategory): "database_error" | "public_flashcard_tags_unavailable" {
  if (
    kind === "db_missing_url" ||
    kind === "db_timeout" ||
    kind === "db_unreachable" ||
    kind === "db_auth_failure" ||
    kind === "db_error"
  ) {
    return "database_error";
  }
  return "public_flashcard_tags_unavailable";
}

async function defaultFlashcardTagsLoader(): Promise<PublicFlashcardTagsPayload> {
  const { getCachedPublicFlashcardTags } = await import("@/lib/marketing/public-flashcard-tags");
  return getCachedPublicFlashcardTags();
}

/**
 * GET /api/public/flashcard-tags — success returns cache-aligned JSON; failures return **503** JSON
 * (never 200 with an empty `tags` list caused by a thrown loader/cache/DB error).
 *
 * @param loader Injectable for tests; defaults to dynamic import of {@link getCachedPublicFlashcardTags}
 * (dynamic import keeps `node:test` able to load this module without resolving `server-only` from marketing).
 */
export async function handlePublicFlashcardTagsGet(
  loader?: () => Promise<PublicFlashcardTagsPayload>,
): Promise<Response> {
  const load = loader ?? defaultFlashcardTagsLoader;
  try {
    const body = await load();
    if (!body.tags?.length) {
      logPublicContentSurfaceFailure({
        surface: "flashcard_tags",
        reason: "zero_tags_after_successful_loader_response",
        count: 0,
        exampleUrls: [`/api/public/flashcard-tags`],
      });
      safeServerLog("api_public", "public_flashcard_tags_error", {
        route: "/api/public/flashcard-tags",
        stage: "public_flashcard_tags_empty_inventory",
        cacheSource: "getCachedPublicFlashcardTags",
        kind: "empty_result",
        code: "DATA_UNAVAILABLE",
        reasonFailed: "tags array empty — public marketing decks have no linked tags",
      });
      return NextResponse.json(
        {
          error: "DATA_UNAVAILABLE",
          surface: "flashcard_tags",
          retryable: true,
          count: 0,
          code: "DATA_UNAVAILABLE",
        },
        { status: 503, headers: JSON_HEADERS },
      );
    }
    return NextResponse.json(body, { headers: CACHE_HEADER_PUBLIC_LIST });
  } catch (e) {
    const kind = classifyHubDbFailure(e);
    const message = e instanceof Error ? e.message : String(e);
    const code = errorCodeForPublicFlashcardTagsFailure(kind);
    logPublicContentSurfaceFailure({
      surface: "flashcard_tags",
      reason: `loader_throw:${code}:${kind}`,
      count: 0,
      exampleUrls: [`/api/public/flashcard-tags`],
    });
    safeServerLog("api_public", "public_flashcard_tags_error", {
      route: "/api/public/flashcard-tags",
      stage: "public_flashcard_tags_error",
      cacheSource: "getCachedPublicFlashcardTags",
      kind,
      code,
      reasonFailed: message.slice(0, 500),
    });
    return NextResponse.json(
      {
        error: "DATA_UNAVAILABLE",
        surface: "flashcard_tags",
        retryable: true,
        code,
        reasonFailed: `${kind}:${message}`.slice(0, 500),
      },
      { status: 503, headers: JSON_HEADERS },
    );
  }
}
