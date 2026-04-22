import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CountryCode, Prisma, TierCode } from "@prisma/client";
import { z } from "zod";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { lessonAccessWhere, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { examQuestionTierStringsForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";

export const dynamic = "force-dynamic";

const MAX_IDS = 40;

const bodySchema = z.object({
  ids: z.array(z.string().min(8).max(80)).min(1).max(MAX_IDS),
  tier: z.string().min(1).max(32),
  countryCode: z.enum(["US", "CA"]),
  system: z.string().min(1).max(120).optional(),
  lessonId: z.string().min(1).max(200).optional(),
});

function regionWhereForCountry(country: CountryCode): Prisma.ExamQuestionWhereInput {
  return {
    OR: [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }],
  };
}

const byIdsSelect = {
  id: true,
  stem: true,
  questionType: true,
  options: true,
  correctAnswer: true,
  rationale: true,
  difficulty: true,
  exam: true,
  topic: true,
  subtopic: true,
  bodySystem: true,
  distractorRationales: true,
  incorrectAnswerRationale: true,
  clinicalPearl: true,
  keyTakeaway: true,
} as const;

/**
 * POST /api/exam-questions/by-ids
 *
 * Strict, subscriber-only fetch: tier + country are required and must match each returned row.
 * No broadening / fallback pool — if any id is out of scope, the whole request fails.
 */
export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/exam-questions/by-ids", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", code: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
    }

    const { ids: rawIds, tier: tierRaw, countryCode, system, lessonId } = parsed.data;

    const tierLower = tierRaw.trim().toLowerCase();
    const ent = gate.entitlement;
    const profileTier = ent.tier as TierCode | null;
    if (!profileTier) {
      return NextResponse.json({ error: "Missing profile tier", code: "tier_required" }, { status: 400 });
    }

    const allowedExamTiers = new Set(examQuestionTierStringsForProfileTier(profileTier));
    if (!allowedExamTiers.has(tierLower)) {
      return NextResponse.json(
        { error: "Requested tier is not allowed for this account", code: "tier_not_allowed", tier: tierLower },
        { status: 403 },
      );
    }

    if (!accessScopeIsStaffLearnerEntitlementBypass(ent)) {
      if (!ent.country || ent.country !== countryCode) {
        return NextResponse.json(
          { error: "countryCode must match the learner account region", code: "country_mismatch" },
          { status: 400 },
        );
      }
    } else if (ent.country && ent.country !== countryCode) {
      return NextResponse.json(
        { error: "countryCode must match the staff learner preview region", code: "country_mismatch" },
        { status: 400 },
      );
    }

    if (lessonId) {
      const allowedLesson = await prisma.contentItem.findFirst({
        where: { AND: [{ id: lessonId }, { type: "lesson" }, lessonAccessWhere(ent)] },
        select: { id: true },
      });
      if (!allowedLesson) {
        return NextResponse.json(
          { error: "lessonId is not a lesson you can access in this session", code: "lesson_invalid" },
          { status: 400 },
        );
      }
    }

    const uniq: string[] = [];
    const seen = new Set<string>();
    for (const id of rawIds) {
      if (seen.has(id)) continue;
      seen.add(id);
      uniq.push(id);
    }

    const baseAccess = questionAccessWhere(ent);
    // Body `tier` must sit on the subscriber ladder; row tiers are already constrained by `baseAccess`
    // (do not require every row to match a single requested tier string — lessons may mix PN/RN depth).
    const strict: Prisma.ExamQuestionWhereInput = {
      AND: [
        baseAccess,
        { id: { in: uniq } },
        regionWhereForCountry(countryCode),
        ...(system?.trim() ? [{ bodySystem: system.trim() } satisfies Prisma.ExamQuestionWhereInput] : []),
      ],
    };

    const rows = await prisma.examQuestion.findMany({
      where: strict,
      select: byIdsSelect,
    });

    if (rows.length !== uniq.length) {
      const got = new Set(rows.map((r) => r.id));
      const missing = uniq.filter((id) => !got.has(id));
      return NextResponse.json(
        {
          error: "One or more questions are unavailable for this tier, country, or filters",
          code: "questions_not_all_matched",
          missingIds: missing,
        },
        { status: 404 },
      );
    }

    const educationalLocale = getMarketingLocaleFromRequestCookie(req);
    const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);
    const order = new Map(uniq.map((id, i) => [id, i]));
    const sorted = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    const questions = sorted.map((q) =>
      mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
        teachingExposure: "full",
      }),
    );

    return NextResponse.json({ questions, count: questions.length });
  });
}
