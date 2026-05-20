import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { StudySettings } from "@/lib/learner/study-settings";
import {
  ALLOWED_STUDY_SESSION_LENGTHS,
  rowToStudySettings,
  studySettingsToPersistenceInput,
  studySettingsUserSelect,
} from "@/lib/learner/study-settings";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

const patchSchema = z.object({
  enableAdaptivePlan: z.boolean().optional(),
  enableSpacedRepetition: z.boolean().optional(),
  enableConfidenceTracking: z.boolean().optional(),
  enablePrePostQuizzes: z.boolean().optional(),
  lessonStudyLoopEnabled: z.boolean().optional(),
  showHeatmap: z.boolean().optional(),
  showAdvancedInsights: z.boolean().optional(),
  enableWeaknessAlerts: z.boolean().optional(),
  enableDecayAlerts: z.boolean().optional(),
  preferredSessionLength: z
    .number()
    .int()
    .refine((value) => (ALLOWED_STUDY_SESSION_LENGTHS as readonly number[]).includes(value))
    .optional(),
});

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/study-settings", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: studySettingsUserSelect,
    });
    return NextResponse.json({ settings: rowToStudySettings(row) });
  } catch {
    return NextResponse.json({ error: "Unable to load study settings." }, { status: 503 });
  }
  });
}

export async function PATCH(req: Request) {
  return runWithApiTelemetry(req, "PATCH /api/learner/study-settings", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors[0] ?? "Invalid body" }, { status: 400 });
  }

  try {
    const data = studySettingsToPersistenceInput(parsed.data as Partial<StudySettings>);
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: studySettingsUserSelect,
    });
    return NextResponse.json({ ok: true, settings: rowToStudySettings(updated) });
  } catch {
    return NextResponse.json({ error: "Unable to save study settings." }, { status: 503 });
  }
  });
}
