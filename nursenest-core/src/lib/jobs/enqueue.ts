import type { Prisma } from "@prisma/client";
import { JobStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function enqueueJob(type: string, payload: Prisma.InputJsonValue, scheduledFor = new Date()) {
  return prisma.backgroundJob.create({
    data: {
      type,
      payload,
      status: JobStatus.PENDING,
      scheduledFor,
    },
  });
}
