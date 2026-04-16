import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * **Claim** `evt_…` before running handlers so two instances cannot apply the same event concurrently.
 * On handler failure, call {@link releaseStripeWebhookEventClaim} so Stripe retries are not permanently deduped.
 *
 * Stripe may still redeliver after a successful claim if the process dies mid-handler — rare; handlers use
 * upserts; ops can delete the row by id if needed.
 */
export async function claimStripeWebhookEventOrDuplicate(eventId: string): Promise<"claimed" | "duplicate"> {
  try {
    await prisma.stripeWebhookEvent.create({ data: { id: eventId } });
    return "claimed";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return "duplicate";
    }
    throw e;
  }
}

/** Remove claim so a failed handler can be retried by Stripe (best-effort). */
export async function releaseStripeWebhookEventClaim(eventId: string): Promise<void> {
  try {
    await prisma.stripeWebhookEvent.delete({ where: { id: eventId } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return;
    throw e;
  }
}
