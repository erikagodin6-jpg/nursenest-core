import { ContentAutomationLogCategory, ContentAutomationLogStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type ContentAutomationLogCreate = {
  category: ContentAutomationLogCategory;
  jobType: string;
  status: ContentAutomationLogStatus;
  topic?: string | null;
  summary?: string | null;
  error?: string | null;
  metadata?: Prisma.InputJsonValue | Record<string, unknown> | null;
  blogPostId?: string | null;
  correlationId?: string | null;
  sourceItemId?: string | null;
  retryOfId?: string | null;
  createdById?: string | null;
  completedAt?: Date | null;
};

export async function createContentAutomationLogSafe(row: ContentAutomationLogCreate): Promise<void> {
  try {
    const now = row.completedAt ?? new Date();
    await prisma.contentAutomationLog.create({
      data: {
        category: row.category,
        jobType: row.jobType,
        status: row.status,
        topic: row.topic ?? null,
        summary: row.summary ?? null,
        error: row.error ?? null,
        metadata:
          row.metadata === undefined ? undefined
          : row.metadata === null ? Prisma.JsonNull
          : (row.metadata as Prisma.InputJsonValue),
        blogPostId: row.blogPostId ?? null,
        correlationId: row.correlationId ?? null,
        sourceItemId: row.sourceItemId ?? null,
        retryOfId: row.retryOfId ?? null,
        createdById: row.createdById ?? null,
        completedAt: now,
      },
    });
  } catch (e) {
    safeServerLog("content_automation_log", "create_failed", {
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
