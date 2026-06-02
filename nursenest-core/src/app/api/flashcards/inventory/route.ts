import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadSharedFlashcardsHubInventoryForPathway } from "@/lib/flashcards/load-shared-flashcards-hub-inventory.server";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { isTransientDatabaseError } from "@/lib/resilience/with-retry";
import { buildServerTimingHeader } from "@/lib/performance/server-timing";
import {
  loadWithManifest,
  flashcardInventoryManifestKey,
  flashcardInventorySnapshotPath,
  type FlashcardInventoryManifestPayload,
} from "@/lib/server/manifest-loader";

export const dynamic = "force-dynamic";

type InventoryTimingSegment = { name: string; durationMs: number };

function jsonWithInventoryTiming(
  body: unknown,
  init: {
    status: number;
    headers: Headers;
    startedAt: number;
    segments?: InventoryTimingSegment[];
    cacheDisposition?: "hit" | "miss" | "stale" | "bypass" | "none";
  },
) {
  const headers = new Headers(init.headers);
  const payload = JSON.stringify(body);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("x-nn-payload-bytes", String(new TextEncoder().encode(payload).length));
  const serverTiming = buildServerTimingHeader({
    totalMs: Math.round(performance.now() - init.startedAt),
    segments: init.segments,
    cacheDisposition: init.cacheDisposition,
  });
  if (serverTiming) headers.set("Server-Timing", serverTiming);
  return new NextResponse(payload, { status: init.status, headers });
}

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
    const routeStarted = performance.now();
    const timings: InventoryTimingSegment[] = [];
    const mark = (name: string, startedAt: number) => {
      timings.push({ name, durationMs: Math.round(performance.now() - startedAt) });
    };
    const headers = mergeSubscriberPrivateCacheHeaders();
    try {
      const gateStarted = performance.now();
      const gate = await requireSubscriberSession();
      mark("auth_gate", gateStarted);
      if (!gate.ok) return gate.response;

      if (!gate.entitlement.hasAccess) {
        return jsonWithInventoryTiming(
          { success: false, error: "subscription_required", categories: [], total: 0, categoryOptions: [] },
          { status: 403, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "none" },
        );
      }

      const pathwayIdRaw = req.nextUrl.searchParams.get("pathwayId")?.trim();
      if (!pathwayIdRaw) {
        return jsonWithInventoryTiming(
          {
            success: false,
            code: "pathway_id_required",
            message: "pathwayId query parameter is required",
            categories: [],
            total: 0,
            categoryOptions: [],
          },
          { status: 400, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "none" },
        );
      }

      const pathwayId = normalizeLearnerFlashcardsPathwayQueryId(pathwayIdRaw, gate.entitlement.country);
      const pathway = getExamPathwayById(pathwayId);
      if (!pathway) {
        return jsonWithInventoryTiming(
          {
            success: false,
            code: "unknown_pathway",
            message: "Unknown pathwayId",
            categories: [],
            total: 0,
            categoryOptions: [],
          },
          { status: 400, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "none" },
        );
      }

      // ── Phase 2.5: manifest-loader — Redis → snapshot → live ──────────────
      const tier = String(gate.entitlement.tier ?? "");
      const country = String(gate.entitlement.country ?? "");
      if (tier && country) {
        const manifestStarted = performance.now();
        const manifestResult = await loadWithManifest<FlashcardInventoryManifestPayload>({
          redisKey: flashcardInventoryManifestKey(tier, country, pathway.id),
          redisTtl: 60 * 60,
          snapshotPath: flashcardInventorySnapshotPath(tier, country, pathway.id),
          buildLive: async () => {
            const inv = await loadSharedFlashcardsHubInventoryForPathway({
              userId: gate.userId,
              entitlement: gate.entitlement,
              pathway,
            });
            if (!inv.ok) throw new Error(inv.code);
            return {
              tier, country, pathwayId: pathway.id,
              total: inv.payload.matchingTotal,
              categoryOptions: inv.payload.categoryOptions,
              categories: inv.categories,
              diagnostics: inv.payload.poolDiagnostics ?? undefined,
              lessonVirtualDiagnostics: inv.payload.lessonVirtualDiagnostics ?? undefined,
            };
          },
          isValid: (d) => d.total > 0,
        }).catch(() => null);
        mark("manifest", manifestStarted);

        if (manifestResult) {
          const mp = manifestResult.data;
          const inventoryBody = {
            success: true as const,
            total: mp.total,
            categoryOptions: mp.categoryOptions,
            categories: mp.categories,
            diagnostics: mp.diagnostics,
            lessonVirtualDiagnostics: mp.lessonVirtualDiagnostics,
          };
          const h = new Headers(headers);
          h.set("x-nn-inventory-cache", manifestResult.source === "redis" ? "redis-hit" : "redis-backfill");
          h.set("x-nn-inventory-manifest", manifestResult.source);
          return jsonWithInventoryTiming(inventoryBody, {
            status: 200,
            headers: h,
            startedAt: routeStarted,
            segments: timings,
            cacheDisposition: manifestResult.source === "redis" ? "hit" : "miss",
          });
        }
      }
      // ── End Phase 2.5 ──────────────────────────────────────────────────────

      const invStarted = performance.now();
      let inv;
      try {
        inv = await loadSharedFlashcardsHubInventoryForPathway({
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

        return jsonWithInventoryTiming(
          {
            success: false,
            code: "inventory_unavailable",
            message: "Flashcard inventory is temporarily unavailable. Please retry.",
            categories: [],
            total: 0,
            categoryOptions: [],
            retryable: true,
          },
          { status: 503, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "miss" },
        );
      }

      const inventoryRouteMs = Math.round(performance.now() - invStarted);
      timings.push({ name: "live_inventory", durationMs: inventoryRouteMs });

      if (!inv.ok) {
        safeServerLog("flashcards", "inventory_route_load_failed", {
          pathwayId: pathway.id,
          inventoryRouteMs,
          code: inv.code,
        });
        if (inv.code === "pathway_not_entitled") {
          return jsonWithInventoryTiming(
            { success: false, code: inv.code, message: inv.message, categories: [], total: 0, categoryOptions: [] },
            { status: 403, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "miss" },
          );
        }
        return jsonWithInventoryTiming(
          {
            success: false,
            code: inv.code,
            message: inv.message,
            categories: [],
            total: 0,
            categoryOptions: [],
            retryable: true,
          },
          { status: 503, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "miss" },
        );
      }

      safeServerLog("flashcards", "inventory_route_ok", {
        pathwayId: pathway.id,
        inventoryRouteMs,
        total: inv.payload.matchingTotal,
        categoriesReturned: inv.payload.categoryOptions.length,
        matchingCards: inv.payload.matchingTotal,
        lessonVirtualCards: inv.payload.lessonVirtualDiagnostics?.totalGeneratedVirtualCards ?? 0,
      });

      const body = {
        success: true as const,
        total: inv.payload.matchingTotal,
        categoryOptions: inv.payload.categoryOptions,
        categories: inv.categories,
        diagnostics: inv.payload.poolDiagnostics,
        lessonVirtualDiagnostics: inv.payload.lessonVirtualDiagnostics,
      };

      const h = new Headers(headers);
      h.set("x-nn-inventory-cache", "live-no-memory-fallback");

      return jsonWithInventoryTiming(body, {
        status: 200,
        headers: h,
        startedAt: routeStarted,
        segments: timings,
        cacheDisposition: "miss",
      });
    } catch (error) {
      safeServerLogCritical("flashcards", "inventory_route_error", {}, error);
      return jsonWithInventoryTiming(
        {
          success: false,
          error: "inventory_failed",
          categories: [],
          total: 0,
          categoryOptions: [],
        },
        { status: 500, headers, startedAt: routeStarted, segments: timings, cacheDisposition: "none" },
      );
    }
  });
}
