import { TrialStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Marks ACTIVE trials past `trialEndsAt` as EXPIRED (idempotent). */
export async function expireStaleTrialForUser(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: {
      id: userId,
      trialStatus: TrialStatus.ACTIVE,
      trialEndsAt: { lt: new Date() },
    },
    data: { trialStatus: TrialStatus.EXPIRED },
  });
}
