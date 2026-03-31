import { NextResponse } from "next/server";
import { TrialStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { expireStaleTrialForUser } from "@/lib/trial/expire-stale-trial";

export const runtime = "nodejs";

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

export async function GET() {
  const session = await auth();
  const userId = sessionUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await expireStaleTrialForUser(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      trialStatus: true,
      trialUsedAt: true,
      trialStartedAt: true,
      trialEndsAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const active =
    user.trialStatus === TrialStatus.ACTIVE && user.trialEndsAt != null && user.trialEndsAt > new Date();

  return NextResponse.json({
    trialStatus: user.trialStatus,
    trialUsedAt: user.trialUsedAt?.toISOString() ?? null,
    trialStartedAt: user.trialStartedAt?.toISOString() ?? null,
    trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
    trialActive: active,
  });
}
