import "server-only";

import { prisma } from "@/lib/db";

export type ReserveInboundAutoreplySlotResult = "reserved" | "duplicate";

export async function reserveInboundAutoreplySlot(args: {
  messageId: string;
  senderEmail: string;
  subject: string;
}): Promise<ReserveInboundAutoreplySlotResult> {
  const messageId = args.messageId.trim();
  const r = await prisma.inboundEmailAutoreplyEvent.createMany({
    data: [
      {
        postmarkInboundMessageId: messageId.slice(0, 200),
        senderEmail: args.senderEmail.trim().slice(0, 320),
        subject: args.subject.trim().slice(0, 998),
      },
    ],
    skipDuplicates: true,
  });
  return r.count === 1 ? "reserved" : "duplicate";
}

export async function finalizeInboundAutoreplySkipped(messageId: string, detail: string): Promise<void> {
  await prisma.inboundEmailAutoreplyEvent.updateMany({
    where: { postmarkInboundMessageId: messageId.trim() },
    data: {
      status: "SKIPPED",
      failureReason: detail.slice(0, 8000),
    },
  });
}

export async function finalizeInboundAutoreplyReplied(
  messageId: string,
  args: { outboundMessageId: string; replySentAt?: Date },
): Promise<void> {
  const at = args.replySentAt ?? new Date();
  await prisma.inboundEmailAutoreplyEvent.updateMany({
    where: { postmarkInboundMessageId: messageId.trim() },
    data: {
      status: "REPLIED",
      replySentAt: at,
      postmarkOutboundMessageId: args.outboundMessageId.trim().slice(0, 200),
      failureReason: null,
    },
  });
}

export async function finalizeInboundAutoreplyFailed(messageId: string, detail: string): Promise<void> {
  await prisma.inboundEmailAutoreplyEvent.updateMany({
    where: { postmarkInboundMessageId: messageId.trim() },
    data: {
      status: "FAILED",
      failureReason: detail.slice(0, 8000),
    },
  });
}
