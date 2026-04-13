"use server";

import { revalidatePath } from "next/cache";
import { UserFeedbackStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";

const STATUSES: UserFeedbackStatus[] = ["NEW", "UNDER_REVIEW", "FIXED", "DISMISSED"];

function isStatus(v: string): v is UserFeedbackStatus {
  return (STATUSES as readonly string[]).includes(v);
}

export async function updateUserFeedbackReportStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  if (!id || !isStatus(statusRaw)) {
    return;
  }
  await prisma.userFeedbackReport.update({
    where: { id },
    data: { status: statusRaw },
  });
  revalidatePath("/admin/feedback");
}
