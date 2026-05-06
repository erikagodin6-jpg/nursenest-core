import { NextResponse } from "next/server";
import { z } from "zod";
import { RESET_PROGRESS_CONFIRMATION_PHRASE, USER_PROGRESS_RESET_ACTION } from "@/lib/learner/reset-progress-confirmation";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { resetProgressRouteDeps } from "@/app/api/learner/reset-progress/route-deps";

const bodySchema = z.object({
  /** Must match {@link RESET_PROGRESS_CONFIRMATION_PHRASE} exactly (trimmed). */
  confirmation: z.string().trim(),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/reset-progress", "content", async () => {
    const deps = resetProgressRouteDeps;
    const session = await deps.auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!deps.isDatabaseUrlConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    if (parsed.data.confirmation !== RESET_PROGRESS_CONFIRMATION_PHRASE) {
      return NextResponse.json(
        { error: `Type ${RESET_PROGRESS_CONFIRMATION_PHRASE} exactly to confirm.` },
        { status: 400 },
      );
    }

    try {
      await deps.resetUserLearningProgress(deps.prisma, userId);

      deps.safeServerLog("learner", USER_PROGRESS_RESET_ACTION, { userId });

      await deps.invalidateLearnerPrivateReadCache(userId);
      deps.revalidatePath("/app");
      deps.revalidatePath("/app/account");
      deps.revalidatePath("/app/account/overview");
      deps.revalidatePath("/app/account/progress");
      deps.revalidatePath("/app/account/study-preferences");

      return NextResponse.json({ ok: true, action: USER_PROGRESS_RESET_ACTION });
    } catch (e) {
      deps.safeServerLog("learner", "USER_PROGRESS_RESET_FAILED", {
        userId,
        detail: (e instanceof Error ? e.message : String(e)).slice(0, 400),
      });
      return NextResponse.json({ error: "Unable to reset progress." }, { status: 503 });
    }
  });
}
