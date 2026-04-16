import { CountryCode, TierCode } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { loadPersonalProfilePayload } from "@/lib/learner/load-personal-profile";
import {
  learnerPathIsAllowed,
  listPathwayPicksForProfile,
  subscriptionLocksProfileRegionAndTier,
} from "@/lib/learner/personal-profile-policy";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const patchSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.union([z.string().max(100), z.null()]).optional(),
    displayName: z.union([z.string().max(200), z.null()]).optional(),
    country: z.nativeEnum(CountryCode).optional(),
    tier: z.nativeEnum(TierCode).optional(),
    learnerPath: z.union([z.string().min(1).max(80), z.null()]).optional(),
    studyGoal: z.union([z.string().max(2000), z.null()]).optional(),
    examFocus: z.union([z.string().max(240), z.null()]).optional(),
    dailyQuestionGoal: z.union([z.number().int().min(5).max(120), z.null()]).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field is required." });

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function GET(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/learner/personal-profile", feature: SERVER_FEATURE.api, userId });

  const url = new URL(req.url);
  const qc = url.searchParams.get("country");
  const qt = url.searchParams.get("tier");
  const preview =
    qc && qt && z.nativeEnum(CountryCode).safeParse(qc).success && z.nativeEnum(TierCode).safeParse(qt).success
      ? { country: qc as CountryCode, tier: qt as TierCode }
      : null;

  try {
    const payload = await loadPersonalProfilePayload(userId, preview);
    if (!payload) {
      return NextResponse.json({ error: "Unable to load profile." }, { status: 503 });
    }
    return NextResponse.json(payload);
  } catch (e) {
    safeServerLogCritical("learner_personal_profile", "get_failed", { userIdPrefix: userId.slice(0, 8) }, e);
    return NextResponse.json({ error: "Unable to load profile." }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = await checkRateLimitUnified(`personal-profile:${userId}:${ip}`, { windowMs: 60_000, max: 20 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many updates. Try again shortly." }, { status: 429 });
  }

  setSentryServerContext({ route: "/api/learner/personal-profile", feature: SERVER_FEATURE.api, userId });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors[0] ?? "Invalid body" }, { status: 400 });
  }

  const body = parsed.data;

  try {
    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { country: true, tier: true, learnerPath: true },
      }),
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { status: true, planTier: true, planCountry: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const locked = subscriptionLocksProfileRegionAndTier(subscription);
    if (locked && (body.country !== undefined || body.tier !== undefined)) {
      return NextResponse.json(
        {
          error:
            "Country and exam tier are set by your active subscription. Change them via billing or contact support.",
          code: "region_tier_locked",
        },
        { status: 403 },
      );
    }

    let entitlement: AccessScope;
    try {
      entitlement = await resolveEntitlement(userId);
    } catch (e) {
      safeServerLogCritical("learner_personal_profile", "entitlement_failed", { userIdPrefix: userId.slice(0, 8) }, e);
      return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
    }

    const subscriberAccess = entitlement.hasAccess;
    const nextCountry = body.country ?? user.country;
    const nextTier = body.tier ?? user.tier;

    const pathwayOptions = listPathwayPicksForProfile(entitlement, nextTier, nextCountry, subscriberAccess);
    const nextLearnerPath =
      body.learnerPath !== undefined ? (body.learnerPath === null ? null : body.learnerPath.trim()) : undefined;
    const effectiveLearnerPath = nextLearnerPath !== undefined ? nextLearnerPath : user.learnerPath;

    if (!learnerPathIsAllowed(effectiveLearnerPath, pathwayOptions)) {
      return NextResponse.json(
        {
          error: "Selected exam pathway is not available for your region and tier. Save region/tier first, then pick a pathway.",
          code: "learner_path_invalid",
        },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.firstName !== undefined) data.firstName = body.firstName.trim() || null;
    if (body.lastName !== undefined) data.lastName = body.lastName === null ? null : body.lastName.trim() || null;
    if (body.displayName !== undefined) data.displayName = body.displayName === null ? null : body.displayName.trim() || null;
    if (body.country !== undefined) data.country = body.country;
    if (body.tier !== undefined) data.tier = body.tier;
    if (nextLearnerPath !== undefined) data.learnerPath = nextLearnerPath;
    if (body.studyGoal !== undefined) data.studyGoal = body.studyGoal === null ? null : body.studyGoal.trim() || null;
    if (body.examFocus !== undefined) data.examFocus = body.examFocus === null ? null : body.examFocus.trim() || null;
    if (body.dailyQuestionGoal !== undefined) {
      data.dailyQuestionGoal = body.dailyQuestionGoal;
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    const payload = await loadPersonalProfilePayload(userId);
    if (!payload) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, profile: payload });
  } catch (e) {
    safeServerLogCritical("learner_personal_profile", "patch_failed", { userIdPrefix: userId.slice(0, 8) }, e);
    return NextResponse.json({ error: "Unable to save profile." }, { status: 503 });
  }
}
