import { PreNursingDatePlanType } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import type { PreNursingFuturePathwayHint } from "@/lib/pre-nursing/pre-nursing-conversion-links";

const HINTS = new Set<PreNursingFuturePathwayHint>(["rn", "rpn", "pn", "np", "unsure"]);

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

function serialize(user: {
  preNursingTargetDate: Date | null;
  preNursingDatePlanType: PreNursingDatePlanType | null;
  preNursingGoalSetAt: Date | null;
  preNursingFuturePathwayHint: string | null;
}) {
  return {
    preNursingTargetDate: user.preNursingTargetDate?.toISOString() ?? null,
    preNursingDatePlanType: user.preNursingDatePlanType
      ? user.preNursingDatePlanType.toLowerCase()
      : null,
    preNursingGoalSetAt: user.preNursingGoalSetAt?.toISOString() ?? null,
    preNursingFuturePathwayHint: user.preNursingFuturePathwayHint,
  };
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/learner/pre-nursing-plan", feature: "lesson", userId });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preNursingTargetDate: true,
        preNursingDatePlanType: true,
        preNursingGoalSetAt: true,
        preNursingFuturePathwayHint: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const futurePathwayOptions: { value: PreNursingFuturePathwayHint; label: string }[] = [
      { value: "unsure", label: "Not sure yet" },
      { value: "rn", label: "Registered Nurse (RN)" },
      { value: "pn", label: "Practical / Vocational Nurse (PN/LPN)" },
      { value: "rpn", label: "Registered Practical Nurse — Canada (RPN)" },
      { value: "np", label: "Nurse Practitioner (NP)" },
    ];

    return NextResponse.json({
      ...serialize(user),
      futurePathwayOptions,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load plan." }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/learner/pre-nursing-plan", feature: "lesson", userId });

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
  const typeRaw = typeof b.preNursingDatePlanType === "string" ? b.preNursingDatePlanType.toLowerCase() : null;
  const map: Record<string, PreNursingDatePlanType> = {
    unsure: PreNursingDatePlanType.UNSURE,
    proposed: PreNursingDatePlanType.PROPOSED,
  };
  if (!typeRaw || !map[typeRaw]) {
    return NextResponse.json(
      { error: "preNursingDatePlanType must be unsure or proposed" },
      { status: 400 },
    );
  }
  const preNursingDatePlanType = map[typeRaw]!;

  let preNursingTargetDate: Date | null = null;
  if (preNursingDatePlanType !== PreNursingDatePlanType.UNSURE) {
    const ds = b.preNursingTargetDate;
    if (typeof ds !== "string" || !ds.trim()) {
      return NextResponse.json(
        { error: "preNursingTargetDate is required (YYYY-MM-DD) when status is proposed" },
        { status: 400 },
      );
    }
    const parsed = parseYmdToUtcDate(ds);
    if (!parsed) {
      return NextResponse.json({ error: "preNursingTargetDate must be YYYY-MM-DD" }, { status: 400 });
    }
    preNursingTargetDate = parsed;
  }

  let preNursingFuturePathwayHint: string | null | undefined = undefined;
  if (b.preNursingFuturePathwayHint !== undefined) {
    if (b.preNursingFuturePathwayHint === null) {
      preNursingFuturePathwayHint = null;
    } else if (typeof b.preNursingFuturePathwayHint !== "string") {
      return NextResponse.json({ error: "preNursingFuturePathwayHint invalid" }, { status: 400 });
    } else {
      const h = b.preNursingFuturePathwayHint.trim().toLowerCase() as PreNursingFuturePathwayHint;
      if (!HINTS.has(h)) {
        return NextResponse.json({ error: "Invalid future pathway hint" }, { status: 400 });
      }
      preNursingFuturePathwayHint = h;
    }
  }

  const now = new Date();

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        preNursingDatePlanType,
        preNursingTargetDate:
          preNursingDatePlanType === PreNursingDatePlanType.UNSURE ? null : preNursingTargetDate,
        preNursingGoalSetAt: now,
        ...(preNursingFuturePathwayHint !== undefined ? { preNursingFuturePathwayHint } : {}),
      },
      select: {
        preNursingTargetDate: true,
        preNursingDatePlanType: true,
        preNursingGoalSetAt: true,
        preNursingFuturePathwayHint: true,
      },
    });

    const futurePathwayOptions: { value: PreNursingFuturePathwayHint; label: string }[] = [
      { value: "unsure", label: "Not sure yet" },
      { value: "rn", label: "Registered Nurse (RN)" },
      { value: "pn", label: "Practical / Vocational Nurse (PN/LPN)" },
      { value: "rpn", label: "Registered Practical Nurse — Canada (RPN)" },
      { value: "np", label: "Nurse Practitioner (NP)" },
    ];

    return NextResponse.json({
      ok: true,
      ...serialize(updated),
      futurePathwayOptions,
    });
  } catch {
    return NextResponse.json({ error: "Unable to save plan." }, { status: 503 });
  }
}
