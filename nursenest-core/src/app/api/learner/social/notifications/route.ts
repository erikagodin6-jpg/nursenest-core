import { NextResponse } from "next/server";
import { SocialChallengeStatus, SocialConnectionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/social/notifications", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const [friendRequests, acceptedFriends, challengeInvites, completedChallenges] = await Promise.all([
      prisma.socialConnection.findMany({
        where: { addresseeUserId: gate.userId, status: SocialConnectionStatus.PENDING },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          updatedAt: true,
          requester: { select: { name: true } },
        },
      }),
      prisma.socialConnection.findMany({
        where: {
          OR: [{ requesterUserId: gate.userId }, { addresseeUserId: gate.userId }],
          status: SocialConnectionStatus.ACCEPTED,
        },
        orderBy: { respondedAt: "desc" },
        take: 5,
        select: {
          id: true,
          respondedAt: true,
          requesterUserId: true,
          addresseeUserId: true,
          requester: { select: { name: true } },
          addressee: { select: { name: true } },
        },
      }),
      prisma.socialChallengeParticipant.findMany({
        where: { userId: gate.userId, status: SocialChallengeStatus.PENDING },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          updatedAt: true,
          challenge: { select: { id: true, title: true, type: true } },
        },
      }),
      prisma.socialChallengeParticipant.findMany({
        where: { status: SocialChallengeStatus.COMPLETED, challenge: { participants: { some: { userId: gate.userId } } } },
        orderBy: { completedAt: "desc" },
        take: 10,
        select: {
          id: true,
          userId: true,
          completedAt: true,
          challenge: { select: { id: true, title: true } },
        },
      }),
    ]);

    const notifications = [
      ...friendRequests.map((row) => ({
        id: `friend-request:${row.id}`,
        type: "friend_request",
        title: "Friend request",
        body: `${row.requester.name?.trim() || "A learner"} sent you a friend request.`,
        createdAt: row.updatedAt,
      })),
      ...acceptedFriends.map((row) => {
        const other = row.requesterUserId === gate.userId ? row.addressee : row.requester;
        return {
          id: `friend-accepted:${row.id}`,
          type: "friend_accepted",
          title: "Friend connected",
          body: `${other.name?.trim() || "A learner"} is now connected with you.`,
          createdAt: row.respondedAt ?? new Date(0),
        };
      }),
      ...challengeInvites.map((row) => ({
        id: `challenge-invite:${row.id}`,
        type: "challenge_invite",
        title: "Challenge invite",
        body: `${row.challenge.title} is waiting for your response.`,
        createdAt: row.updatedAt,
      })),
      ...completedChallenges
        .filter((row) => row.userId !== gate.userId)
        .map((row) => ({
          id: `challenge-complete:${row.id}`,
          type: "challenge_completed",
          title: "Challenge progress",
          body: `A friend completed ${row.challenge.title}.`,
          createdAt: row.completedAt ?? new Date(0),
        })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);

    return NextResponse.json({ notifications }, { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
