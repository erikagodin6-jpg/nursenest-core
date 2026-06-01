import { NextResponse } from "next/server";

import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadLearnerActivityContext } from "@/lib/learner/load-learner-activity-context";
import { loadLearnerPathwayNavMetadata } from "@/lib/learner/load-learner-shell-pathway-metadata";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { cacheSet } from "@/lib/server/content-cache";
import {
  activityManifestCacheKey,
  buildActivityManifest,
  instantLoadPathwayFromTier,
} from "@/lib/performance/instant-load-architecture";
import {
  ecgManifestKey,
  ecgManifestSnapshotPath,
  flashcardInventoryManifestKey,
  flashcardInventorySnapshotPath,
  lessonManifestKey,
  lessonManifestSnapshotPath,
  loadWithManifest,
  questionDiscoveryManifestKey,
  questionDiscoverySnapshotPath,
  type FlashcardInventoryManifestPayload,
  type LessonManifestPayload,
  type QuestionDiscoveryManifestPayload,
} from "@/lib/server/manifest-loader";

export const dynamic = "force-dynamic";

const WARM_CACHE_BUDGET_MS = 1500;
const ACTIVITY_MANIFEST_TTL_SECONDS = 60 * 60;

function withWarmBudget<T>(label: string, work: Promise<T>): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    work
      .then((value) => value)
      .catch((error) => {
        safeServerLog("activity_warm_cache", "warm_task_failed", {
          label,
          detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
        });
        return null;
      })
      .finally(() => {
        if (timer !== undefined) clearTimeout(timer);
      }),
    new Promise<null>((resolve) => {
      timer = setTimeout(() => {
        safeServerLog("activity_warm_cache", "warm_task_timeout", { label, timeoutMs: WARM_CACHE_BUDGET_MS });
        resolve(null);
      }, WARM_CACHE_BUDGET_MS);
    }),
  ]);
}

async function resolveWarmPathway(userId: string, fallbackTier: string | null | undefined): Promise<string | null> {
  const nav = await withWarmBudget("pathway_nav", loadLearnerPathwayNavMetadata(userId));
  if (nav?.pathwayId) return nav.pathwayId;

  const learnerContext = await withWarmBudget(
    "pathway_user_fallback",
    loadLearnerActivityContext(userId),
  );
  if (learnerContext?.learnerPath?.trim()) return learnerContext.learnerPath.trim();
  if (fallbackTier === "NP") return "ca-np-cnple";
  if (fallbackTier === "RPN" || fallbackTier === "LVN_LPN") return learnerContext?.country === "US" ? "us-lpn-nclex-pn" : "ca-rpn-rex-pn";
  return "us-rn-nclex-rn";
}

export async function POST() {
  const started = performance.now();
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;
  if (!gate.entitlement.hasAccess) {
    return NextResponse.json({ ok: false, code: "subscription_required" }, { status: 403 });
  }

  const tier = String(gate.entitlement.tier ?? "");
  const country = String(gate.entitlement.country ?? "US");
  const pathway = instantLoadPathwayFromTier(tier);
  const pathwayId = await resolveWarmPathway(gate.userId, tier);
  const manifest = buildActivityManifest({ pathway, pathwayId, tier });

  await cacheSet(activityManifestCacheKey(pathway, manifest.pathwayId), manifest, ACTIVITY_MANIFEST_TTL_SECONDS);

  const tasks = [
    withWarmBudget(
      "activity_manifest",
      cacheSet(activityManifestCacheKey(pathway, manifest.pathwayId), manifest, ACTIVITY_MANIFEST_TTL_SECONDS),
    ),
    withWarmBudget(
      "questions_manifest",
      loadWithManifest<QuestionDiscoveryManifestPayload>({
        redisKey: questionDiscoveryManifestKey(tier, country, manifest.pathwayId),
        redisTtl: 60 * 60,
        snapshotPath: questionDiscoverySnapshotPath(tier, country, manifest.pathwayId),
        buildLive: async () => {
          throw new Error("question_manifest_snapshot_missing");
        },
      }),
    ),
    withWarmBudget(
      "flashcard_inventory_manifest",
      loadWithManifest<FlashcardInventoryManifestPayload>({
        redisKey: flashcardInventoryManifestKey(tier, country, manifest.pathwayId),
        redisTtl: 60 * 60,
        snapshotPath: flashcardInventorySnapshotPath(tier, country, manifest.pathwayId),
        buildLive: async () => {
          throw new Error("flashcard_manifest_snapshot_missing");
        },
      }),
    ),
    withWarmBudget(
      "lesson_manifest",
      loadWithManifest<LessonManifestPayload>({
        redisKey: lessonManifestKey(tier, country),
        redisTtl: 60 * 60,
        snapshotPath: lessonManifestSnapshotPath(tier, country),
        buildLive: async () => {
          throw new Error("lesson_manifest_snapshot_missing");
        },
      }),
    ),
    withWarmBudget(
      "ecg_manifest",
      loadWithManifest({
        redisKey: ecgManifestKey(),
        redisTtl: 60 * 60,
        snapshotPath: ecgManifestSnapshotPath(),
        buildLive: async () => {
          throw new Error("ecg_manifest_snapshot_missing");
        },
      }),
    ),
  ];

  const settled = await Promise.allSettled(tasks);
  const warmed = settled.filter((r) => r.status === "fulfilled" && r.value !== null).length;
  const durationMs = Math.round(performance.now() - started);

  safeServerLog("activity_warm_cache", "completed", {
    pathway,
    pathwayId: manifest.pathwayId,
    warmed,
    durationMs,
  });

  return NextResponse.json(
    { ok: true, warmed, durationMs },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
