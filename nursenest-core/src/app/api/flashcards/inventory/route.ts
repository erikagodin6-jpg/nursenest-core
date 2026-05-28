import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadFlashcardsExamInventoryForPathway } from "@/lib/flashcards/load-flashcards-exam-inventory.server";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { isTransientDatabaseError } from "@/lib/resilience/with-retry";
import {
  loadWithManifest,
  flashcardInventoryManifestKey,
  flashcardInventorySnapshotPath,
  type FlashcardInventoryManifestPayload,
} from "@/lib/server/manifest-loader";

type InventoryCacheEntry = {
  cachedAtMs: number;
  body: {
    success: true;
    total: number;
    categoryOptions: unknown[];
    categories: unknown[];
    diagnostics?: unknown;
  };
};

const inventoryCache = new Map<string, InventoryCacheEntry>();
const INVENTORY_CACHE_TTL_MS = 30_000;
const INVENTORY_CACHE_MAX = 2000;

function inventoryCacheKey(userId: string, pathwayId: string): string {
  return `${userId}::${pathwayId}`;
}

export const dynamic = "force-dynamic";

/**
 * GET /api/flashcards/inventory?pathwayId=...
 *
 * Returns pool counts from ExamQuestion — the same pathway-scoped source as CAT practice
 * (`questionAccessWhereWithPathway` + non-ECG + general study-bank gates).
 *
 * Response (success):
 *   { success: true, total, categoryOptions, categories }
 * `categories` mirrors `{ name, count }` with `name` = builder category id (stable key).
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/inventory", "content", async () => {
    const headers = mergeSubscriberPrivateCacheHeaders();
    try {
      const gate = await requireSubscriberSession();
      if (!gate.ok) return gate.response;

      if (!gate.entitlement.hasAccess) {
        return NextResponse.json(
          { success: false, error: "subscription_required", categories: [], total: 0, categoryOptions: [] },
          { status: 403, headers },
        );
      }

      const pathwayIdRaw = req.nextUrl.searchParams.get("pathwayId")?.trim();
      if (!pathwayIdRaw) {
        return NextResponse.json(
          {
            success: false,
            code: "pathway_id_required",
            message: "pathwayId query parameter is required",
            categories: [],
            total: 0,
            categoryOptions: [],
          },
          { status: 400, headers },
        );
      }

      const pathwayId = normalizeLearnerFlashcardsPathwayQueryId(pathwayIdRaw, gate.entitlement.country);
      const pathway = getExamPathwayById(pathwayId);
      if (!pathway) {
        return NextResponse.json(
          {
            success: false,
            code: "unknown_pathway",
            message: "Unknown pathwayId",
            categories: [],
            total: 0,
            categoryOptions: [],
          },
          { status: 400, headers },
        );
      }

      const cacheKey = inventoryCacheKey(gate.userId, pathway.id);
      const cached = inventoryCache.get(cacheKey);
      if (cached && Date.now() - cached.cachedAtMs < INVENTORY_CACHE_TTL_MS) {
        const h = new Headers(headers);
        h.set("x-nn-inventory-cache", "hit");
        return NextResponse.json(cached.body, { status: 200, headers: h });
      }

      // ── Phase 2.5: manifest-loader — Redis → snapshot → live ──────────────
      const tier = String(gate.entitlement.tier ?? "");
      const country = String(gate.entitlement.country ?? "");
      if (tier && country) {
        const manifestResult = await loadWithManifest<FlashcardInventoryManifestPayload>({
          redisKey: flashcardInventoryManifestKey(tier, country, pathway.id),
          redisTtl: 60 * 60,
          snapshotPath: flashcardInventorySnapshotPath(tier, country, pathway.id),
          buildLive: async () => {
            const inv = await loadFlashcardsExamInventoryForPathway({
              userId: gate.userId,
              entitlement: gate.entitlement,
              pathway,
            });
            if (!inv.ok) throw new Error(inv.code);
            return {
              tier, country, pathwayId: pathway.id,
              total: inv.total,
              categoryOptions: inv.categoryOptions,
              categories: Object.entries(inv.countsByBuilderId).map(([name, count]) => ({ name, count })),
            };
          },
          isValid: (d) => d.total > 0,
        }).catch(() => null);

        if (manifestResult) {
          const mp = manifestResult.data;
          const inventoryBody = {
            success: true as const,
            total: mp.total,
            categoryOptions: mp.categoryOptions,
            categories: mp.categories,
          };
          const h = new Headers(headers);
          h.set("x-nn-inventory-cache", "miss");
          h.set("x-nn-inventory-manifest", manifestResult.source);
          if (inventoryCache.size > INVENTORY_CACHE_MAX) inventoryCache.clear();
          inventoryCache.set(cacheKey, { cachedAtMs: Date.now(), body: inventoryBody });
          return NextResponse.json(inventoryBody, { status: 200, headers: h });
        }
      }
      // ── End Phase 2.5 ──────────────────────────────────────────────────────

      const invStarted = performance.now();
      let inv;
      try {
        inv = await loadFlashcardsExamInventoryForPathway({
          userId: gate.userId,
          entitlement: gate.entitlement,
          pathway,
        });
      } catch (e) {
        safeServerLog("flashcards", "inventory_route_db_threw", {
          pathwayId: pathway.id,
          inventoryRouteMs: Math.round(performance.now() - invStarted),
          transient: isTransientDatabaseError(e) ? 1 : 0,
        });

        return NextResponse.json(
          {
            success: false,
            code: "inventory_unavailable",
            message: "Flashcard inventory is temporarily unavailable. Please retry.",
            categories: [],
            total: 0,
            categoryOptions: [],
            retryable: true,
          },
          { status: 503, headers },
        );
      }

      const inventoryRouteMs = Math.round(performance.now() - invStarted);

      if (!inv.ok) {
        safeServerLog("flashcards", "inventory_route_load_failed", {
          pathwayId: pathway.id,
          inventoryRouteMs,
          code: inv.code,
        });
        if (inv.code === "pathway_not_entitled") {
          return NextResponse.json(
            { success: false, code: inv.code, message: inv.message, categories: [], total: 0, categoryOptions: [] },
            { status: 403, headers },
          );
        }
        return NextResponse.json(
          {
            success: false,
            code: inv.code,
            message: inv.message,
            categories: [],
            total: 0,
            categoryOptions: [],
            retryable: true,
          },
          { status: 503, headers },
        );
      }

      const categories = Object.entries(inv.countsByBuilderId).map(([name, count]) => ({ name, count }));

      safeServerLog("flashcards", "inventory_route_ok", {
        pathwayId: pathway.id,
        inventoryRouteMs,
        total: inv.total,
        categoriesReturned: inv.categoryOptions.length,
        matchingCards: inv.total,
      });

      const body = {
        success: true as const,
        total: inv.total,
        categoryOptions: inv.categoryOptions,
        categories,
        diagnostics: inv.diagnostics,
      };

      if (inventoryCache.size > INVENTORY_CACHE_MAX) inventoryCache.clear();
      inventoryCache.set(cacheKey, { cachedAtMs: Date.now(), body });

      const h = new Headers(headers);
      h.set("x-nn-inventory-cache", "miss");

      return NextResponse.json(body, { headers: h });
    } catch (error) {
      safeServerLogCritical("flashcards", "inventory_route_error", {}, error);
      return NextResponse.json(
        {
          success: false,
          error: "inventory_failed",
          categories: [],
          total: 0,
          categoryOptions: [],
        },
        { status: 500, headers },
      );
    }
  });
}
