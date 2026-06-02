import { NextResponse } from "next/server";
import { CACHE_HEADER_PUBLIC_LIST } from "@/lib/cache/public-edge-cache-headers";
import type { PublicFlashcardTagsPayload } from "@/lib/marketing/public-flashcard-tags";
import { classifyHubDbFailure, type HubDbFailureCategory } from "@/lib/db/safe-database";
import { logPublicContentSurfaceFailure } from "@/lib/observability/public-content-surface-failure-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" } as const;

const CACHE_SOURCE_LABEL = "getCachedPublicFlashcardTags" as const;

/** Hard contract marker on every JSON response (prod smoke + CDN stale detection). */
export const PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION = "flashcard-tags-v3" as const;

/**
 * Branch diagnostic `source` for clients and smoke.
 * - `db` — tags from join-table inventory (or empty-inventory / error paths that queried the loader).
 * - `fallback` — tags derived from public deck slug/title list when join tags are empty.
 * - `cache` — reserved for future use when we can reliably observe Next.js Data Cache / edge hits at the handler.
 */
export type PublicFlashcardTagsBranchSource = "db" | "cache" | "fallback";

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

function mapInventoryToBranchSource(payload: PublicFlashcardTagsPayload): Exclude<PublicFlashcardTagsBranchSource, "cache"> {
  return payload.inventorySource === "fallback" ? "fallback" : "db";
}

/** Common fields on every JSON body (success + error). */
function contractEnvelope(
  branch: {
    source: PublicFlashcardTagsBranchSource;
    tagCount: number;
    cacheHit?: boolean | null;
  },
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  const env: Record<string, unknown> = {
    contractVersion: PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION,
    source: branch.source,
    tagCount: branch.tagCount,
    ...extra,
  };
  if (branch.cacheHit !== undefined && branch.cacheHit !== null) {
    env.cacheHit = branch.cacheHit;
  }
  return env;
}

async function defaultFlashcardTagsLoader(): Promise<PublicFlashcardTagsPayload> {
  const { getCachedPublicFlashcardTags } = await import("@/lib/marketing/public-flashcard-tags");
  return getCachedPublicFlashcardTags();
}

/**
 * GET /api/public/flashcard-tags — success returns JSON with `tags` + contract fields.
 * **Never** returns `200` with `tags: []`. Empty inventory → **503** `DATA_UNAVAILABLE` without a `tags` key.
 *
 * @param loader Injectable for tests; defaults to dynamic import of {@link getCachedPublicFlashcardTags}.
 */
export async function handlePublicFlashcardTagsGet(
  loader?: () => Promise<PublicFlashcardTagsPayload>,
): Promise<Response> {
  const load = loader ?? defaultFlashcardTagsLoader;
  try {
    const body = await load();
    if (!body || !Array.isArray(body.tags)) {
      throw new Error("INVALID_TAG_PAYLOAD");
    }
    if (!body.tags.length) {
      logPublicContentSurfaceFailure({
        surface: "flashcard_tags",
        reason: "zero_tags_after_successful_loader_response",
        count: 0,
        exampleUrls: [`/api/public/flashcard-tags`],
      });
      safeServerLog("api_public", "public_flashcard_tags_error", {
        route: "/api/public/flashcard-tags",
        stage: "public_flashcard_tags_empty",
        tagCount: "0",
        cacheSource: CACHE_SOURCE_LABEL,
        reason: "tags array empty — no public marketing decks/tags in inventory",
        code: "DATA_UNAVAILABLE",
      });
      return NextResponse.json(
        {
          code: "DATA_UNAVAILABLE",
          message: "No public flashcard tags available",
          ...contractEnvelope({ source: "db", tagCount: 0 }),
        },
        { status: 503, headers: JSON_HEADERS },
      );
    }

    const branchSource = mapInventoryToBranchSource(body) as PublicFlashcardTagsBranchSource;
    const { inventorySource: _inv, ...tagsOnly } = body;
    return NextResponse.json(
      {
        ...tagsOnly,
        ...contractEnvelope({ source: branchSource, tagCount: body.tags.length }),
      },
      { headers: CACHE_HEADER_PUBLIC_LIST },
    );
  } catch (e) {
    if (e instanceof Error && e.message === "INVALID_TAG_PAYLOAD") {
      logPublicContentSurfaceFailure({
        surface: "flashcard_tags",
        reason: "invalid_tag_payload",
        count: 0,
        exampleUrls: [`/api/public/flashcard-tags`],
      });
      safeServerLog("api_public", "public_flashcard_tags_error", {
        route: "/api/public/flashcard-tags",
        stage: "public_flashcard_tags_invalid_payload",
        tagCount: "0",
        cacheSource: CACHE_SOURCE_LABEL,
        reason: "INVALID_TAG_PAYLOAD",
        code: "public_flashcard_tags_unavailable",
      });
      return NextResponse.json(
        {
          error: "Public flashcard tags could not be loaded",
          code: "public_flashcard_tags_unavailable",
          reasonFailed: "INVALID_TAG_PAYLOAD",
          ...contractEnvelope({ source: "db", tagCount: 0 }),
        },
        { status: 503, headers: JSON_HEADERS },
      );
    }
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
      tagCount: "0",
      cacheSource: CACHE_SOURCE_LABEL,
      reason: message.slice(0, 500),
      kind,
      code,
    });
    return NextResponse.json(
      {
        error: "DATA_UNAVAILABLE",
        surface: "flashcard_tags",
        retryable: true,
        code,
        reasonFailed: `${kind}:${message}`.slice(0, 500),
        ...contractEnvelope({ source: "db", tagCount: 0 }),
      },
      { status: 503, headers: JSON_HEADERS },
    );
  }
}
