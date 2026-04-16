import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { hashLoginIdentifierForLog } from "@/lib/auth/log-auth-identifier";
import { isLoginLocked } from "@/lib/auth/login-lockout";
import {
  isEmailLikeIdentifier,
  normalizeLoginIdentifier,
  sanitizeRawLoginIdentifier,
} from "@/lib/auth/normalize-login-identifier";
import { prisma } from "@/lib/db";
import type { DatabaseHealthClassification } from "@/lib/db/db-error-classification";
import { classifyDatabaseErrorMessage } from "@/lib/db/db-error-classification";
import { boundedSelectOne } from "@/lib/db/prisma-readiness";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const PROBE_TIMEOUT_MS = 3000;

function probeEnabled(): boolean {
  return process.env.NN_E2E_ACCOUNT_PROBE?.trim() === "1";
}

/**
 * RN full-content QA only: safe account facts for Playwright (no passwords).
 * Gated by NN_E2E_ACCOUNT_PROBE=1 — enable via playwright.rn-full-content webServer.env.
 */
export async function POST(req: Request) {
  if (!probeEnabled()) {
    return NextResponse.json({ error: "not_enabled" }, { status: 404, headers: NO_STORE });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: NO_STORE });
  }
  const emailRaw = typeof body === "object" && body && typeof (body as { email?: unknown }).email === "string"
    ? (body as { email: string }).email
    : "";
  const entered = sanitizeRawLoginIdentifier(emailRaw);
  const enteredLower = normalizeLoginIdentifier(entered);
  if (!enteredLower || !isEmailLikeIdentifier(enteredLower)) {
    return NextResponse.json({ error: "email_required" }, { status: 400, headers: NO_STORE });
  }

  let databaseClassification: DatabaseHealthClassification = "OK";
  if (!isDatabaseUrlConfigured()) {
    databaseClassification = "DATABASE_URL_NOT_CONFIGURED";
    return NextResponse.json(
      {
        databaseClassification,
        userPresent: null,
        hasPasswordHash: null,
        accountLockedOut: null,
        activePaidSubscription: null,
      },
      { status: 200, headers: NO_STORE },
    );
  }

  try {
    const ping = await boundedSelectOne(PROBE_TIMEOUT_MS);
    if (!ping.ok) {
      databaseClassification = ping.classification;
      return NextResponse.json(
        {
          databaseClassification,
          userPresent: null,
          hasPasswordHash: null,
          accountLockedOut: null,
          activePaidSubscription: null,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: enteredLower, mode: "insensitive" } },
      select: { id: true, passwordHash: true },
    });

    const idHash = hashLoginIdentifierForLog(enteredLower);
    const lockKey = `login-lock:${idHash}`;
    let accountLockedOut = false;
    try {
      const lock = await isLoginLocked(lockKey);
      accountLockedOut = lock.locked;
    } catch {
      accountLockedOut = false;
    }

    let activePaidSubscription: boolean | null = null;
    if (user) {
      const sub = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] },
        },
        select: { id: true },
      });
      activePaidSubscription = sub != null;
    }

    return NextResponse.json(
      {
        databaseClassification: "OK" satisfies DatabaseHealthClassification,
        userPresent: user != null,
        hasPasswordHash: Boolean(user?.passwordHash && String(user.passwordHash).length > 0),
        accountLockedOut,
        activePaidSubscription,
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    databaseClassification = classifyDatabaseErrorMessage(msg.slice(0, 400));
    return NextResponse.json(
      {
        databaseClassification,
        userPresent: null,
        hasPasswordHash: null,
        accountLockedOut: null,
        activePaidSubscription: null,
      },
      { status: 200, headers: NO_STORE },
    );
  }
}
