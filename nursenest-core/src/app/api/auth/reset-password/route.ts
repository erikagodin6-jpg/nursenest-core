import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { strongPasswordSchema } from "@/lib/auth/password-policy";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { prisma } from "@/lib/db";
import { hashPasswordResetToken } from "@/lib/password-reset-crypto";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const bodySchema = z.object({
  token: z.string().min(20).max(512),
  password: strongPasswordSchema,
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`reset-password:${ip}`, { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const hint =
      typeof first?.message === "string" && first.message.length > 0 && first.message !== "Required"
        ? first.message
        : "Invalid token or password.";
    return NextResponse.json({ ok: false, error: hint }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = hashPasswordResetToken(token);

  try {
    const row = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true },
    });

    if (!row || row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
    ]);

    return NextResponse.json({ ok: true, message: "Password updated. You can sign in now." });
  } catch (e) {
    safeServerLogCritical("auth", "reset_password_failed", { surface: "api" }, e);
    return NextResponse.json(
      { ok: false, error: "Unable to reset password. Try again shortly." },
      { status: 503 },
    );
  }
}
