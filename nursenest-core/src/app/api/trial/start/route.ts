import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { attemptStartTrial } from "@/lib/trial/attempt-start-trial";
import { TRIAL_DEVICE_COOKIE } from "@/lib/trial/trial-constants";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { getTrustedClientIp } from "@/lib/http/client-ip";

export const runtime = "nodejs";

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = sessionUserId(session);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized", code: "unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/trial/start", feature: SERVER_FEATURE.trial, userId });

  const jar = await cookies();
  let deviceId = jar.get(TRIAL_DEVICE_COOKIE)?.value;
  const newDevice = !deviceId;
  if (!deviceId) deviceId = randomUUID();

  const result = await attemptStartTrial({ userId, deviceId, ip: getTrustedClientIp(req) });

  if (result.ok) {
    const res = NextResponse.json({ ok: true, trialEndsAt: result.trialEndsAt });
    if (newDevice) {
      res.cookies.set(TRIAL_DEVICE_COOKIE, deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 400,
      });
    }
    return res;
  }

  return NextResponse.json(
    { ok: false, error: result.message, code: result.code },
    { status: result.status },
  );
}
