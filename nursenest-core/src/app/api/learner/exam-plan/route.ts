import { ExamDatePlanType, TierCode } from "@prisma/client";
import { NextResponse } from "next/server";
import { ALLIED_PROFESSION_KEYS, listAlliedProfessionsSorted } from "@/lib/allied/allied-professions-registry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const CADENCE = new Set(["light", "steady", "intensive"]);

function parseYmdToUtcDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return dt;
}

function serializeExamPlan(user: {
  examDate: Date | null;
  examDatePlanType: ExamDatePlanType | null;
  examGoalSetAt: Date | null;
  targetExamPathwayId: string | null;
  studyCadencePreference: string | null;
  alliedProfessionKey: string | null;
  tier: TierCode;
}) {
  return {
    examDate: user.examDate?.toISOString() ?? null,
    examDatePlanType: user.examDatePlanType
      ? user.examDatePlanType.toLowerCase()
      : null,
    examGoalSetAt: user.examGoalSetAt?.toISOString() ?? null,
    targetExamPathwayId: user.targetExamPathwayId,
    studyCadencePreference: user.studyCadencePreference,
    alliedProfessionKey: user.alliedProfessionKey,
    tier: user.tier.toLowerCase(),
  };
}

export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/learner/exam-plan", feature: SERVER_FEATURE.exam, userId: gate.userId });

  try {
    const user = await prisma.user.findUnique({
      where: { id: gate.userId },
      select: {
        examDate: true,
        examDatePlanType: true,
        examGoalSetAt: true,
        targetExamPathwayId: true,
        studyCadencePreference: true,
        alliedProfessionKey: true,
        tier: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pathways = listPathwaysCompatibleWithSubscription(gate.entitlement).map((p) => ({
      id: p.id,
      label: p.displayName,
      shortLabel: p.shortName || p.displayName,
    }));

    const alliedProfessionOptions = listAlliedProfessionsSorted().map((p) => ({
      key: p.professionKey,
      label: p.h1,
    }));

    return NextResponse.json({
      ...serializeExamPlan(user),
      pathways,
      alliedProfessionOptions,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load exam plan." }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/learner/exam-plan", feature: SERVER_FEATURE.exam, userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const typeRaw = typeof b.examDatePlanType === "string" ? b.examDatePlanType.toLowerCase() : null;
  const map: Record<string, ExamDatePlanType> = {
    unsure: ExamDatePlanType.UNSURE,
    proposed: ExamDatePlanType.PROPOSED,
    confirmed: ExamDatePlanType.CONFIRMED,
  };
  if (!typeRaw || !map[typeRaw]) {
    return NextResponse.json(
      { error: "examDatePlanType must be unsure, proposed, or confirmed" },
      { status: 400 },
    );
  }
  const examDatePlanType = map[typeRaw]!;

  let examDate: Date | null = null;
  if (examDatePlanType !== ExamDatePlanType.UNSURE) {
    const ds = b.examDate;
    if (typeof ds !== "string" || !ds.trim()) {
      return NextResponse.json(
        { error: "examDate is required (YYYY-MM-DD) when status is proposed or confirmed" },
        { status: 400 },
      );
    }
    const parsed = parseYmdToUtcDate(ds);
    if (!parsed) {
      return NextResponse.json({ error: "examDate must be YYYY-MM-DD" }, { status: 400 });
    }
    examDate = parsed;
  }

  let targetExamPathwayId: string | null | undefined = undefined;
  if (b.targetExamPathwayId !== undefined) {
    if (b.targetExamPathwayId === null) {
      targetExamPathwayId = null;
    } else if (typeof b.targetExamPathwayId !== "string") {
      return NextResponse.json({ error: "targetExamPathwayId invalid" }, { status: 400 });
    } else {
      const trimmed = b.targetExamPathwayId.trim();
      if (trimmed.length === 0) {
        targetExamPathwayId = null;
      } else {
        const allowed = new Set(listPathwaysCompatibleWithSubscription(gate.entitlement).map((p) => p.id));
        if (!allowed.has(trimmed)) {
          return NextResponse.json({ error: "Pathway not available for your subscription and region." }, { status: 400 });
        }
        targetExamPathwayId = trimmed;
      }
    }
  }

  let alliedProfessionKey: string | null | undefined = undefined;
  if (b.alliedProfessionKey !== undefined) {
    if (b.alliedProfessionKey === null) {
      alliedProfessionKey = null;
    } else if (typeof b.alliedProfessionKey !== "string") {
      return NextResponse.json({ error: "alliedProfessionKey invalid" }, { status: 400 });
    } else {
      const trimmed = b.alliedProfessionKey.trim().toLowerCase();
      if (trimmed.length === 0) {
        alliedProfessionKey = null;
      } else {
        const allowedKeys = new Set(ALLIED_PROFESSION_KEYS);
        if (!allowedKeys.has(trimmed)) {
          return NextResponse.json({ error: "Unknown allied profession key." }, { status: 400 });
        }
        if (String(gate.entitlement.tier) !== TierCode.ALLIED) {
          return NextResponse.json(
            { error: "Allied profession can only be set for allied-tier learners." },
            { status: 400 },
          );
        }
        alliedProfessionKey = trimmed;
      }
    }
  }

  let studyCadencePreference: string | null | undefined = undefined;
  if (b.studyCadencePreference !== undefined) {
    if (b.studyCadencePreference === null) {
      studyCadencePreference = null;
    } else if (typeof b.studyCadencePreference !== "string") {
      return NextResponse.json({ error: "studyCadencePreference invalid" }, { status: 400 });
    } else {
      const c = b.studyCadencePreference.trim().toLowerCase();
      if (c.length === 0) {
        studyCadencePreference = null;
      } else if (!CADENCE.has(c)) {
        return NextResponse.json({ error: "studyCadencePreference must be light, steady, or intensive" }, { status: 400 });
      } else {
        studyCadencePreference = c;
      }
    }
  }

  const now = new Date();

  try {
    const updated = await prisma.user.update({
      where: { id: gate.userId },
      data: {
        examDatePlanType,
        examDate: examDatePlanType === ExamDatePlanType.UNSURE ? null : examDate,
        examGoalSetAt: now,
        ...(targetExamPathwayId !== undefined ? { targetExamPathwayId } : {}),
        ...(studyCadencePreference !== undefined ? { studyCadencePreference } : {}),
        ...(alliedProfessionKey !== undefined ? { alliedProfessionKey } : {}),
      },
      select: {
        examDate: true,
        examDatePlanType: true,
        examGoalSetAt: true,
        targetExamPathwayId: true,
        studyCadencePreference: true,
        alliedProfessionKey: true,
        tier: true,
      },
    });

    const pathways = listPathwaysCompatibleWithSubscription(gate.entitlement).map((p) => ({
      id: p.id,
      label: p.displayName,
      shortLabel: p.shortName || p.displayName,
    }));

    const alliedProfessionOptions = listAlliedProfessionsSorted().map((p) => ({
      key: p.professionKey,
      label: p.h1,
    }));

    return NextResponse.json({
      ok: true,
      ...serializeExamPlan(updated),
      pathways,
      alliedProfessionOptions,
    });
  } catch {
    return NextResponse.json({ error: "Unable to save exam plan." }, { status: 503 });
  }
}
