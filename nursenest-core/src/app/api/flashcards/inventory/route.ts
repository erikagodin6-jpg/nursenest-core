import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadFlashcardsExamInventoryForPathway } from "@/lib/flashcards/load-flashcards-exam-inventory.server";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

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

      const inv = await loadFlashcardsExamInventoryForPathway({
        userId: gate.userId,
        entitlement: gate.entitlement,
        pathway,
      });

      if (!inv.ok) {
        if (inv.code === "pathway_not_entitled") {
          return NextResponse.json(
            { success: false, code: inv.code, message: inv.message, categories: [], total: 0, categoryOptions: [] },
            { status: 403, headers },
          );
        }
        if (inv.code === "CRITICAL_EMPTY_POOL") {
          safeServerLog("flashcards", "inventory_critical_empty_pool", {
            pathwayId: pathway.id,
            userIdPrefix: gate.userId.slice(0, 8),
          });
          return NextResponse.json(
            {
              success: false,
              code: inv.code,
              message: inv.message,
              categories: [],
              total: 0,
              categoryOptions: [],
            },
            { status: 500, headers },
          );
        }
        return NextResponse.json(
          { success: false, code: inv.code, message: inv.message, categories: [], total: 0, categoryOptions: [] },
          { status: 500, headers },
        );
      }

      const categories = Object.entries(inv.countsByBuilderId).map(([name, count]) => ({ name, count }));

      return NextResponse.json(
        {
          success: true,
          total: inv.total,
          categoryOptions: inv.categoryOptions,
          categories,
        },
        { headers },
      );
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
