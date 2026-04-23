import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_LEARNER_QA_COOKIE,
  ADMIN_LEARNER_QA_MAX_AGE_SEC,
  publicQaStateFromPayload,
  qaSigningSecret,
  signAdminLearnerQaCookieValue,
  type AdminLearnerQaPayloadV1,
} from "@/lib/admin/admin-learner-qa-simulation";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { productEvent } from "@/lib/observability/product-events";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const payloadSchema = z.object({
  track: z.enum(["RN", "RPN", "LVN_LPN", "NP", "ALLIED", "NEW_GRAD"]),
  lifecycle: z.enum(["paid_active", "none", "expired", "trial"]),
  country: z.enum(["US", "CA"]).default("US"),
  npSpecialty: z.enum(["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP_PC"]).optional(),
  alliedCareer: z
    .enum(["paramedic", "rrt", "mlt", "imaging", "ota_pta", "pharmtech", "socialwork"])
    .optional(),
  planVariant: z.enum(["monthly", "6-month", "yearly"]).optional(),
});

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const raw = await req.json().catch(() => ({}));
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields(raw as Record<string, unknown>);
  const parsed = payloadSchema.safeParse(stripped);
  if (!parsed.success) {
    safeServerLog("admin_learner_qa", "simulate_parse_failed", { detail: "invalid_body" });
    return NextResponse.json({ ok: false, error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const payload: AdminLearnerQaPayloadV1 = {
    v: 1,
    sub: gate.admin.userId,
    exp: Math.floor(Date.now() / 1000) + ADMIN_LEARNER_QA_MAX_AGE_SEC,
    track: d.track,
    lifecycle: d.lifecycle,
    country: d.country,
    ...(d.track === "NP" && d.npSpecialty ? { npSpecialty: d.npSpecialty } : {}),
    ...(d.track === "ALLIED" && d.alliedCareer ? { alliedCareer: d.alliedCareer } : {}),
    ...(d.planVariant ? { planVariant: d.planVariant } : {}),
  };

  if (intent.dryRun) {
    safeServerLog("admin_learner_qa", "simulate_dry_run", {
      userIdPrefix: gate.admin.userId.slice(0, 8),
      track: d.track,
      lifecycle: d.lifecycle,
      admin_learner_qa_simulated: 0,
    });
    return NextResponse.json({
      ok: true,
      dryRun: true,
      state: publicQaStateFromPayload(payload),
    });
  }

  if (!qaSigningSecret()) {
    safeServerLog("admin_learner_qa", "simulate_misconfigured", { reason: "missing_signing_secret" });
    return NextResponse.json(
      {
        ok: false,
        error: "QA simulation signing is not configured",
        code: "admin_learner_qa_misconfigured",
        hint: "Set ADMIN_LEARNER_QA_SECRET (16+ chars) or ensure AUTH_SECRET / NEXTAUTH_SECRET is present.",
      },
      { status: 503 },
    );
  }

  const value = signAdminLearnerQaCookieValue(payload);
  if (!value) {
    safeServerLog("admin_learner_qa", "simulate_sign_failed", { userIdPrefix: gate.admin.userId.slice(0, 8) });
    return NextResponse.json({ ok: false, error: "Could not sign QA cookie" }, { status: 500 });
  }

  const jar = await cookies();
  jar.set(ADMIN_LEARNER_QA_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_LEARNER_QA_MAX_AGE_SEC,
  });

  productEvent("admin_learner_qa_started", {
    track: d.track,
    lifecycle: d.lifecycle,
    country: d.country,
    userIdPrefix: gate.admin.userId.slice(0, 8),
    admin_learner_qa_simulated: 1,
    npSpecialty: d.npSpecialty,
    alliedCareer: d.alliedCareer,
    planVariant: d.planVariant,
  });
  safeServerLog("admin_learner_qa", "simulate_cookie_set", {
    userIdPrefix: gate.admin.userId.slice(0, 8),
    track: d.track,
    lifecycle: d.lifecycle,
    country: d.country,
    admin_learner_qa_simulated: 1,
    npSpecialty: d.npSpecialty,
    alliedCareer: d.alliedCareer,
    planVariant: d.planVariant,
  });

  return NextResponse.json({ ok: true, dryRun: false, state: publicQaStateFromPayload(payload) });
}
