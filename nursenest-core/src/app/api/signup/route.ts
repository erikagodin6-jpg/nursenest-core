import { hash } from "bcryptjs";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { strongPasswordSchema } from "@/lib/auth/password-policy";
import { createAndSendVerificationEmail, normalizeEmailForDedup } from "@/lib/auth/email-verification";
import { validateUsernameForSignup } from "@/lib/auth/username-rules";
import { isTurnstileEnforced, verifyTurnstileToken } from "@/lib/captcha/verify-turnstile";
import { DEMO_USER_EMAIL_DOMAIN } from "@/lib/demo-users/create-demo-user";
import { prisma } from "@/lib/db";
import { JSON_BODY_SIGNUP, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { tightenPublicCap } from "@/lib/config/rate-limit-tightening";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { API_SIGNUP_PER_IP_RATE_LIMIT } from "@/lib/server/rate-limit";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { productEvent } from "@/lib/observability/product-events";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { triggerWelcomeEmailRequested } from "@/lib/server/inngest";

function signupStructuredFailed(req: Request, errorClass: string, severity: "warn" | "error" = "warn"): void {
  emitStructuredLog("signup_failed", severity, {
    correlationId: correlationIdFromRequest(req),
    route: "/api/signup",
    method: "POST",
    flow: "auth",
    errorClass,
    message: `signup failed: ${errorClass}`,
  });
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

const emptyToUndef = (v: unknown) => (v === "" || v === null ? undefined : v);

const schema = z.object({
  email: z.preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), z.string().email()),
  password: strongPasswordSchema,
  username: z.string(),
  name: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().min(1).max(200)),
  firstName: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(100).optional().nullable()),
  lastName: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(100).optional().nullable()),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  examFocus: z.preprocess(emptyToUndef, z.string().max(120).optional()),
  studyGoal: z.preprocess(emptyToUndef, z.string().max(120).optional()),
  dailyStudyMinutes: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.number().int().min(5).max(600).optional(),
  ),
  learnerPath: z.preprocess(emptyToUndef, z.enum(["new_grad", "experienced", "career_change"]).optional()),
  captchaToken: z.string().optional(),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/signup", "auth", async () => {
  setSentryServerContext({ route: "/api/signup", feature: SERVER_FEATURE.signup });
  const ip = clientIp(req);
  const rl = await checkRateLimitUnified(API_SIGNUP_PER_IP_RATE_LIMIT.rateLimitKeyForIp(ip), {
    windowMs: API_SIGNUP_PER_IP_RATE_LIMIT.windowMs,
    max: tightenPublicCap(API_SIGNUP_PER_IP_RATE_LIMIT.max),
  });
  if (!rl.ok) {
    signupStructuredFailed(req, "rate_limited");
    productEvent("signup_rate_limited", {});
    Sentry.captureMessage("signup_rate_limited", {
      level: "warning",
      tags: { flow: "auth", kind: "signup_rate_limit" },
    });
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_SIGNUP);
  if (!bodyRead.ok) {
    signupStructuredFailed(req, "invalid_json");
    safeServerLog("signup", "invalid_json_body", {});
    return bodyRead.response;
  }

  const parsed = schema.safeParse(bodyRead.value);
  if (!parsed.success) {
    signupStructuredFailed(req, "validation");
    safeServerLog("signup", "validation_failed", {
      issueCount: parsed.error.issues.length,
      codes: parsed.error.issues
        .map((i) => i.code)
        .slice(0, 8)
        .join(","),
    });
    const first = parsed.error.issues[0];
    const hint =
      typeof first?.message === "string" && first.message.length > 0 && first.message !== "Required"
        ? first.message
        : "Invalid payload";
    return NextResponse.json({ error: hint, code: "validation" }, { status: 400 });
  }

  const signupEmail = parsed.data.email.toLowerCase();
  if (signupEmail.endsWith(`@${DEMO_USER_EMAIL_DOMAIN}`)) {
    signupStructuredFailed(req, "reserved_email");
    return NextResponse.json(
      { error: "This email domain is reserved for internal demo accounts.", code: "reserved_email" },
      { status: 400 },
    );
  }

  const usernameCheck = validateUsernameForSignup(parsed.data.username);
  if (!usernameCheck.ok) {
    signupStructuredFailed(req, "invalid_username");
    const msg =
      usernameCheck.reason === "empty"
        ? "Enter a username."
        : usernameCheck.reason === "length"
          ? "Username must be 3–30 characters."
          : usernameCheck.reason === "chars"
            ? "Username may only use letters, numbers, underscores, and dots."
            : usernameCheck.reason === "dots"
              ? "Username cannot start or end with a dot or contain consecutive dots."
              : "That username is reserved.";
    return NextResponse.json({ error: msg, code: "invalid_username" }, { status: 400 });
  }
  const normalizedUsername = usernameCheck.normalized;

  if (isTurnstileEnforced()) {
    const ok = await verifyTurnstileToken(parsed.data.captchaToken);
    if (!ok) {
      signupStructuredFailed(req, "captcha");
      productEvent("signup_captcha_failed", {});
      return NextResponse.json(
        { error: "Captcha verification failed. Refresh and try again.", code: "captcha" },
        { status: 400 },
      );
    }
  }

  let exists: { id: string } | null;
  try {
    exists = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { id: true },
    });
  } catch (e) {
    signupStructuredFailed(req, "email_lookup_db", "error");
    safeServerLogCritical("signup", "email_lookup_failed", { surface: "api" }, e, { flow: "signup" });
    return NextResponse.json({ error: "Unable to sign up. Try again shortly.", code: "db" }, { status: 503 });
  }
  if (exists) {
    return NextResponse.json({ error: "Email already in use", code: "duplicate_email" }, { status: 409 });
  }

  let usernameTaken: { id: string } | null;
  try {
    usernameTaken = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    });
  } catch (e) {
    signupStructuredFailed(req, "username_lookup_db", "error");
    safeServerLogCritical("signup", "username_lookup_failed", { surface: "api" }, e, { flow: "signup" });
    return NextResponse.json({ error: "Unable to sign up. Try again shortly.", code: "db" }, { status: 503 });
  }
  if (usernameTaken) {
    return NextResponse.json({ error: "Username already taken", code: "duplicate_username" }, { status: 409 });
  }

  const { email, name, firstName, lastName, password, country, tier, examFocus, studyGoal, dailyStudyMinutes, learnerPath } = parsed.data;
  const passwordHash = await hash(password, 12);

  let createdId: string;
  try {
    const created = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        normalizedEmail: normalizeEmailForDedup(email),
        username: normalizedUsername,
        name,
        firstName: firstName || null,
        lastName: lastName || null,
        passwordHash,
        country,
        tier,
        role: "LEARNER",
        authProvider: "credentials",
        signupIp: ip !== "unknown" ? ip.slice(0, 64) : null,
        examFocus: examFocus ?? null,
        studyGoal: studyGoal ?? null,
        dailyStudyMinutes: dailyStudyMinutes ?? null,
        learnerPath: learnerPath ?? null,
        onboardingCompletedAt:
          examFocus && studyGoal && dailyStudyMinutes && learnerPath ? new Date() : null,
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (e) {
    signupStructuredFailed(req, "user_create_failed", "error");
    const prismaCode = e instanceof Prisma.PrismaClientKnownRequestError ? e.code : undefined;
    const prismaMeta = e instanceof Prisma.PrismaClientKnownRequestError ? e.meta : undefined;
    safeServerLogCritical(
      "signup",
      "user_create_failed",
      { surface: "api", prismaCode, prismaMeta: prismaMeta ? JSON.stringify(prismaMeta).slice(0, 400) : undefined },
      e,
      { flow: "signup" },
    );
    if (e instanceof Error) {
      safeServerLog("signup", "user_create_failed_message", { detail: e.message.slice(0, 800) });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const target = Array.isArray(e.meta?.target) ? (e.meta?.target as string[]).join(",") : "";
      if (target.includes("email")) {
        return NextResponse.json({ error: "Email already in use", code: "duplicate_email" }, { status: 409 });
      }
      if (target.includes("username")) {
        return NextResponse.json({ error: "Username already taken", code: "duplicate_username" }, { status: 409 });
      }
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
      return NextResponse.json(
        { error: "Account service is not ready. Try again later.", code: "missing_table" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Unable to create account. Try again shortly.", code: prismaCode ?? "unknown" },
      { status: 503 },
    );
  }

  productEvent("signup_ok", {});
  safeServerLog("signup", "user_created_ok", {
    tier: String(parsed.data.tier),
    country: String(parsed.data.country),
  });
  await captureServerEvent(analyticsDistinctId(createdId), "signup_completed", {
    tier: String(parsed.data.tier),
    country: String(parsed.data.country),
  });

  createAndSendVerificationEmail(createdId, email.toLowerCase()).catch((e) => {
    safeServerLog("signup", "verification_email_fire_and_forget_error", {
      detail: e instanceof Error ? e.message.slice(0, 200) : "unknown",
    });
  });
  void triggerWelcomeEmailRequested(createdId);

  return NextResponse.json({ ok: true, verificationSent: true }, { status: 201 });
  });
}
