import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  AccountDeletionError,
  ACCOUNT_DELETION_BILLING_WARNING,
  deleteLearnerAccount,
} from "@/lib/account/delete-learner-account";
import { prisma } from "@/lib/db";
import { JSON_BODY_AUTH_FORM, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const deleteSchema = z.object({
  confirmation: z.string().min(1).max(320),
  userId: z.string().min(1).optional(),
});

function statusForDeletionError(error: AccountDeletionError): number {
  switch (error.code) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
    case "STAFF_FORBIDDEN":
      return 403;
    case "NOT_FOUND":
    case "ALREADY_DELETED":
      return 404;
    case "CONFIRMATION_REQUIRED":
      return 400;
  }
}

export async function DELETE(req: Request) {
  return runWithApiTelemetry(req, "DELETE /api/account/delete", "auth", async () => {
    const correlation = correlationIdFromRequest(req) ?? "";
    const session = await auth();
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;
    const userId = sessionUser?.id?.trim() ?? "";
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Sign in to delete your account.", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_AUTH_FORM);
    if (!bodyRead.ok) return bodyRead.response;

    const parsed = deleteSchema.safeParse(bodyRead.value);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten().formErrors[0] ?? "Invalid request.", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    try {
      const result = await deleteLearnerAccount(prisma, {
        sessionUserId: userId,
        requestedUserId: parsed.data.userId,
        confirmation: parsed.data.confirmation,
      });

      safeServerLog("account_delete", "learner_account_deleted", {
        userIdPrefix: userId.slice(0, 8),
        correlation,
        severity: "info",
      });

      return NextResponse.json({
        ok: true,
        signOutRequired: result.signOutRequired,
        subscriptionCancellationRequired: result.subscriptionCancellationRequired,
        message: ACCOUNT_DELETION_BILLING_WARNING,
        redirectTo: "/login?accountDeleted=1",
      });
    } catch (error) {
      if (error instanceof AccountDeletionError) {
        safeServerLog("account_delete", "learner_account_delete_denied", {
          userIdPrefix: userId.slice(0, 8),
          code: error.code,
          correlation,
          severity: error.code === "CONFIRMATION_REQUIRED" ? "expected_denial" : "warning",
        });
        return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: statusForDeletionError(error) });
      }

      safeServerLogCritical(
        "account_delete",
        "learner_account_delete_failed",
        { userIdPrefix: userId.slice(0, 8), correlation, severity: "error" },
        error,
      );
      return NextResponse.json(
        { ok: false, error: "Unable to delete your account. Try again shortly.", code: "DELETE_FAILED" },
        { status: 503 },
      );
    }
  });
}
