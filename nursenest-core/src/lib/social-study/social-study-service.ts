import { createHash, randomBytes } from "node:crypto";
import {
  SocialChallengeStatus,
  SocialCodeAudience,
  SocialConnectionStatus,
  SocialGroupKind,
  SocialGroupRole,
  SocialStatKey,
  SocialVisibilityScope,
  type SocialChallengeType,
} from "@prisma/client";
import type {
  SocialConnectionRow,
  SocialGroupRow,
  SocialInviteCodeRow,
  SocialPrivacyRow,
  SocialStatSnapshotRow,
  SocialStudyDb,
} from "@/lib/social-study/social-study-types";

const DEFAULT_VISIBLE_KEYS: SocialStatKey[] = [];

function hashCode(code: string): string {
  return createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}

function makeDisplayCode(prefix = "NN"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  const bytes = randomBytes(6);
  for (const b of bytes) body += alphabet[b % alphabet.length];
  return `${prefix}-${body.slice(0, 4)}-${body.slice(4, 6)}`;
}

function normalizePair(a: string, b: string): { requesterUserId: string; addresseeUserId: string } {
  return a < b ? { requesterUserId: a, addresseeUserId: b } : { requesterUserId: b, addresseeUserId: a };
}

async function privacyFor(db: SocialStudyDb, userId: string): Promise<SocialPrivacyRow> {
  return (
    (await db.socialPrivacySetting.findUnique({ where: { userId } })) ??
    (await db.socialPrivacySetting.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }))
  );
}

export async function updateSocialPrivacySettings(
  db: SocialStudyDb,
  userId: string,
  input: Partial<Omit<SocialPrivacyRow, "userId">>,
): Promise<SocialPrivacyRow> {
  return db.socialPrivacySetting.upsert({
    where: { userId },
    create: {
      userId,
      socialEnabled: input.socialEnabled ?? false,
      statsHidden: input.statsHidden ?? true,
      visibilityScope: input.visibilityScope ?? SocialVisibilityScope.PRIVATE,
      visibleStatKeys: input.visibleStatKeys ?? DEFAULT_VISIBLE_KEYS,
      pausedUntil: input.pausedUntil ?? null,
      leaderboardOptIn: input.leaderboardOptIn ?? false,
      allowFriendChallenges: input.allowFriendChallenges ?? false,
      allowGroupChallenges: input.allowGroupChallenges ?? false,
    },
    update: input,
  });
}

export async function generateSocialInviteCode(
  db: SocialStudyDb,
  userId: string,
  options?: { enabled?: boolean; audience?: SocialCodeAudience },
): Promise<SocialInviteCodeRow> {
  const displayCode = makeDisplayCode("NN");
  return db.socialInviteCode.create({
    data: {
      userId,
      displayCode,
      codeHash: hashCode(displayCode),
      enabled: options?.enabled ?? false,
      audience: options?.audience ?? SocialCodeAudience.FRIEND_OR_GROUP,
    },
  });
}

export async function disableSocialInviteCode(
  db: SocialStudyDb,
  userId: string,
  codeId: string,
): Promise<{ ok: boolean; code?: "not_found" }> {
  const code = await db.socialInviteCode.findFirst({ where: { id: codeId, userId } });
  if (!code) return { ok: false, code: "not_found" };
  await db.socialInviteCode.update({ where: { id: code.id }, data: { enabled: false, disabledAt: new Date() } });
  return { ok: true };
}

export async function connectWithSocialCode(
  db: SocialStudyDb,
  viewerUserId: string,
  displayCode: string,
): Promise<
  | { ok: true; kind: "friend"; connection: SocialConnectionRow }
  | { ok: true; kind: "group" | "classroom"; group: SocialGroupRow }
  | { ok: false; code: "code_disabled_or_missing" | "self_code" }
> {
  const codeHash = hashCode(displayCode);
  const invite = await db.socialInviteCode.findFirst({ where: { codeHash, enabled: true } });
  if (invite) {
    if (invite.userId === viewerUserId) return { ok: false, code: "self_code" };
    const pair = normalizePair(viewerUserId, invite.userId);
    const connection = await db.socialConnection.upsert({
      where: { requesterUserId_addresseeUserId: pair },
      create: {
        ...pair,
        status: SocialConnectionStatus.PENDING,
      },
      update: { status: SocialConnectionStatus.PENDING, removedAt: null },
    });
    return { ok: true, kind: "friend", connection };
  }

  const group = await db.socialGroup.findFirst({ where: { codeHash, active: true } });
  if (group) {
    await joinSocialGroupByCode(db, viewerUserId, displayCode);
    return { ok: true, kind: group.kind === SocialGroupKind.CLASSROOM ? "classroom" : "group", group };
  }

  return { ok: false, code: "code_disabled_or_missing" };
}

export async function acceptSocialConnection(
  db: SocialStudyDb,
  userId: string,
  connectionId: string,
): Promise<{ ok: boolean; connection?: SocialConnectionRow; code?: "not_found" | "forbidden" }> {
  const connection = await db.socialConnection.findFirst({ where: { id: connectionId } });
  if (!connection) return { ok: false, code: "not_found" };
  if (connection.requesterUserId !== userId && connection.addresseeUserId !== userId) return { ok: false, code: "forbidden" };
  return {
    ok: true,
    connection: await db.socialConnection.update({
      where: { id: connection.id },
      data: { status: SocialConnectionStatus.ACCEPTED, respondedAt: new Date(), removedAt: null, blockedAt: null },
    }),
  };
}

export async function blockSocialConnection(
  db: SocialStudyDb,
  blockerUserId: string,
  blockedUserId: string,
): Promise<{ ok: boolean; connection?: SocialConnectionRow }> {
  const pair = normalizePair(blockerUserId, blockedUserId);
  const connection = await db.socialConnection.upsert({
    where: { requesterUserId_addresseeUserId: pair },
    create: { ...pair, status: SocialConnectionStatus.BLOCKED, blockedAt: new Date() },
    update: { status: SocialConnectionStatus.BLOCKED, blockedAt: new Date() },
  });
  return { ok: true, connection };
}

function visibilityAllows(privacy: SocialPrivacyRow, audience: "friend" | "group"): boolean {
  if (!privacy.socialEnabled || privacy.statsHidden) return false;
  if (privacy.pausedUntil && privacy.pausedUntil.getTime() > Date.now()) return false;
  if (privacy.visibilityScope === SocialVisibilityScope.PAUSED || privacy.visibilityScope === SocialVisibilityScope.PRIVATE) return false;
  if (privacy.visibilityScope === SocialVisibilityScope.FRIENDS_AND_GROUPS) return true;
  if (audience === "friend") return privacy.visibilityScope === SocialVisibilityScope.FRIENDS;
  return privacy.visibilityScope === SocialVisibilityScope.GROUPS_CLASSROOMS;
}

async function areAcceptedFriends(db: SocialStudyDb, a: string, b: string): Promise<boolean> {
  const pair = normalizePair(a, b);
  const connection = await db.socialConnection.findFirst({ where: { ...pair, status: SocialConnectionStatus.ACCEPTED } });
  return connection != null;
}

export async function resolveVisibleSocialStats(
  db: SocialStudyDb,
  args: { viewerUserId: string; subjectUserId: string; audience: "friend" | "group" },
): Promise<SocialStatSnapshotRow[]> {
  const privacy = await privacyFor(db, args.subjectUserId);
  if (!visibilityAllows(privacy, args.audience)) return [];
  if (args.audience === "friend" && !(await areAcceptedFriends(db, args.viewerUserId, args.subjectUserId))) return [];

  const allowed = new Set(privacy.visibleStatKeys);
  if (allowed.size === 0) return [];
  const rows = await db.socialStatSnapshot.findMany({
    where: { userId: args.subjectUserId },
    take: 20,
    orderBy: { generatedAt: "desc" },
  });
  return rows.filter((r) => allowed.has(r.statKey) && (!r.expiresAt || r.expiresAt.getTime() > Date.now()));
}

export async function createSocialChallenge(
  db: SocialStudyDb,
  creatorUserId: string,
  input: {
    participantUserIds: string[];
    type: SocialChallengeType;
    title: string;
    prompt?: string | null;
    groupId?: string | null;
    expiresAt: Date;
  },
): Promise<{ ok: boolean; challenge?: Awaited<ReturnType<SocialStudyDb["socialChallenge"]["create"]>>; participants: unknown[] }> {
  const participantUserIds = [...new Set([creatorUserId, ...input.participantUserIds])].slice(0, 20);
  const challenge = await db.socialChallenge.create({
    data: {
      creatorUserId,
      groupId: input.groupId ?? null,
      type: input.type,
      status: SocialChallengeStatus.PENDING,
      title: input.title.trim(),
      prompt: input.prompt?.trim() || null,
      expiresAt: input.expiresAt,
      participants: { create: participantUserIds.map((userId) => ({ userId, status: SocialChallengeStatus.PENDING })) },
    },
  });
  const participants = await db.socialChallengeParticipant.findMany({ where: { challengeId: challenge.id }, take: 25 });
  return { ok: true, challenge, participants };
}

export async function createSocialGroup(
  db: SocialStudyDb,
  createdByUserId: string,
  input: {
    kind: SocialGroupKind;
    name: string;
    description?: string | null;
    ownerUserId?: string | null;
    leaderboardEnabled?: boolean;
  },
): Promise<{ ok: boolean; group?: SocialGroupRow }> {
  const displayCode = makeDisplayCode(input.kind === SocialGroupKind.CLASSROOM ? "CL" : "GR");
  const group = await db.socialGroup.create({
    data: {
      kind: input.kind,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      displayCode,
      codeHash: hashCode(displayCode),
      active: true,
      leaderboardEnabled: input.leaderboardEnabled ?? false,
      createdByUserId,
      ownerUserId: input.ownerUserId === undefined ? createdByUserId : input.ownerUserId,
    },
  });
  await db.socialGroupMembership.upsert({
    where: { groupId_userId: { groupId: group.id, userId: createdByUserId } },
    create: { groupId: group.id, userId: createdByUserId, role: SocialGroupRole.OWNER, active: true },
    update: { active: true, leftAt: null },
  });
  return { ok: true, group };
}

export async function joinSocialGroupByCode(
  db: SocialStudyDb,
  userId: string,
  displayCode: string,
): Promise<{ ok: boolean; group?: SocialGroupRow; code?: "not_found" }> {
  const group = await db.socialGroup.findFirst({ where: { codeHash: hashCode(displayCode), active: true } });
  if (!group) return { ok: false, code: "not_found" };
  await db.socialGroupMembership.upsert({
    where: { groupId_userId: { groupId: group.id, userId } },
    create: { groupId: group.id, userId, role: SocialGroupRole.MEMBER, active: true },
    update: { active: true, leftAt: null },
  });
  return { ok: true, group };
}

export async function leaveSocialGroup(
  db: SocialStudyDb,
  userId: string,
  groupId: string,
): Promise<{ ok: boolean; code?: "not_found" }> {
  const membership = await db.socialGroupMembership.findFirst({ where: { groupId, userId, active: true } });
  if (!membership) return { ok: false, code: "not_found" };
  await db.socialGroupMembership.update({ where: { id: membership.id }, data: { active: false, leftAt: new Date() } });
  return { ok: true };
}

export async function listSocialGroupLeaderboard(
  db: SocialStudyDb,
  viewerUserId: string,
  groupId: string,
): Promise<{ ok: boolean; entries: Array<{ userId: string; stats: SocialStatSnapshotRow[] }>; code?: "forbidden" }> {
  const viewerMembership = await db.socialGroupMembership.findFirst({ where: { groupId, userId: viewerUserId, active: true } });
  if (!viewerMembership) return { ok: false, code: "forbidden", entries: [] };
  const memberships = await db.socialGroupMembership.findMany({ where: { groupId, active: true }, take: 50 });
  const entries = [];
  for (const membership of memberships) {
    const privacy = await privacyFor(db, membership.userId);
    if (!privacy.leaderboardOptIn) continue;
    const stats = await resolveVisibleSocialStats(db, { viewerUserId, subjectUserId: membership.userId, audience: "group" });
    if (stats.length > 0) entries.push({ userId: membership.userId, stats });
  }
  return { ok: true, entries };
}
