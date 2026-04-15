import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Records successful processing of `evt_…` for deduplication. Call **only** after handlers succeed.
 * Concurrent deliveries: second insert gets P2002 → treat as success (replay / duplicate worker).
 */
export async function recordStripeWebhookEventProcessed(eventId: string): Promise<"inserted" | "duplicate"> {
  try {
    await prisma.stripeWebhookEvent.create({ data: { id: eventId } });
    return "inserted";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return "duplicate";
    }
    throw e;
  }
}
