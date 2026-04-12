import { NextResponse, type NextRequest } from "next/server";
import { consumeVerificationToken } from "@/lib/auth/email-verification";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function appOrigin(): string {
  return (
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`verify-email:${ip}`, { windowMs: 60_000, max: 15 });
  if (!rl.ok) {
    return NextResponse.redirect(`${appOrigin()}/login?verify=rate_limited`);
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length < 20) {
    return NextResponse.redirect(`${appOrigin()}/login?verify=invalid`);
  }

  const result = await consumeVerificationToken(token);

  if (!result.ok) {
    safeServerLog("auth", "email_verify_failed", { reason: result.reason, ip: ip.slice(0, 64) });
    return NextResponse.redirect(`${appOrigin()}/login?verify=${result.reason}`);
  }

  await captureServerEvent(analyticsDistinctId(result.userId), "email_verified", {}).catch(() => {});

  return NextResponse.redirect(`${appOrigin()}/login?verify=success`);
}
