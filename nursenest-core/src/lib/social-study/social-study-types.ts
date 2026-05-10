import type {
  SocialChallengeStatus,
  SocialChallengeType,
  SocialCodeAudience,
  SocialConnectionStatus,
  SocialGroupKind,
  SocialGroupRole,
  SocialStatKey,
  SocialVisibilityScope,
} from "@prisma/client";

export type SocialUserRow = {
  id: string;
  email: string;
  displayName: string | null;
};

export type SocialPrivacyRow = {
  userId: string;
  socialEnabled: boolean;
  statsHidden: boolean;
  visibilityScope: SocialVisibilityScope;
  visibleStatKeys: SocialStatKey[];
  pausedUntil: Date | null;
  leaderboardOptIn: boolean;
  allowFriendChallenges: boolean;
  allowGroupChallenges: boolean;
};

export type SocialInviteCodeRow = {
  id: string;
  userId: string;
  codeHash: string;
  displayCode: string;
  enabled: boolean;
  audience: SocialCodeAudience;
  disabledAt: Date | null;
};

export type SocialConnectionRow = {
  id: string;
  requesterUserId: string;
  addresseeUserId: string;
  status: SocialConnectionStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  removedAt: Date | null;
  blockedAt: Date | null;
};

export type SocialGroupRow = {
  id: string;
  kind: SocialGroupKind;
  name: string;
  description: string | null;
  codeHash: string;
  displayCode: string;
  active: boolean;
  leaderboardEnabled: boolean;
  createdByUserId: string;
  ownerUserId: string | null;
};

export type SocialGroupMembershipRow = {
  id: string;
  groupId: string;
  userId: string;
  role: SocialGroupRole;
  active: boolean;
  joinedAt: Date;
  leftAt: Date | null;
};

export type SocialChallengeRow = {
  id: string;
  creatorUserId: string;
  groupId: string | null;
  type: SocialChallengeType;
  status: SocialChallengeStatus;
  title: string;
  prompt: string | null;
  expiresAt: Date;
  completedAt: Date | null;
};

export type SocialChallengeParticipantRow = {
  id: string;
  challengeId: string;
  userId: string;
  status: SocialChallengeStatus;
  completionSummary: unknown;
};

export type SocialStatSnapshotRow = {
  id: string;
  userId: string;
  audienceScope: SocialVisibilityScope;
  statKey: SocialStatKey;
  value: Record<string, unknown>;
  generatedAt: Date;
  expiresAt: Date | null;
};

export type SocialStudyDb = {
  user: {
    findUnique(args: { where: { id: string }; select?: unknown }): Promise<SocialUserRow | null>;
  };
  socialPrivacySetting: {
    upsert(args: {
      where: { userId: string };
      create: Partial<SocialPrivacyRow> & { userId: string };
      update: Partial<SocialPrivacyRow>;
    }): Promise<SocialPrivacyRow>;
    findUnique(args: { where: { userId: string } }): Promise<SocialPrivacyRow | null>;
  };
  socialInviteCode: {
    create(args: { data: Omit<SocialInviteCodeRow, "id" | "disabledAt"> & { disabledAt?: Date | null } }): Promise<SocialInviteCodeRow>;
    update(args: { where: { id: string }; data: Partial<SocialInviteCodeRow> }): Promise<SocialInviteCodeRow>;
    findFirst(args: { where: Partial<SocialInviteCodeRow> }): Promise<SocialInviteCodeRow | null>;
  };
  socialConnection: {
    upsert(args: {
      where: { requesterUserId_addresseeUserId: { requesterUserId: string; addresseeUserId: string } };
      create: Omit<SocialConnectionRow, "id" | "requestedAt" | "respondedAt" | "removedAt" | "blockedAt"> &
        Partial<Pick<SocialConnectionRow, "respondedAt" | "removedAt" | "blockedAt">>;
      update: Partial<SocialConnectionRow>;
    }): Promise<SocialConnectionRow>;
    findFirst(args: { where: Partial<SocialConnectionRow> & { OR?: Array<Partial<SocialConnectionRow>> } }): Promise<SocialConnectionRow | null>;
    update(args: { where: { id: string }; data: Partial<SocialConnectionRow> }): Promise<SocialConnectionRow>;
  };
  socialGroup: {
    create(args: { data: Omit<SocialGroupRow, "id"> }): Promise<SocialGroupRow>;
    findFirst(args: { where: Partial<SocialGroupRow> }): Promise<SocialGroupRow | null>;
  };
  socialGroupMembership: {
    upsert(args: {
      where: { groupId_userId: { groupId: string; userId: string } };
      create: Omit<SocialGroupMembershipRow, "id" | "joinedAt" | "leftAt"> & Partial<Pick<SocialGroupMembershipRow, "leftAt">>;
      update: Partial<SocialGroupMembershipRow>;
    }): Promise<SocialGroupMembershipRow>;
    findFirst(args: { where: Partial<SocialGroupMembershipRow> }): Promise<SocialGroupMembershipRow | null>;
    findMany(args: { where: Partial<SocialGroupMembershipRow>; take?: number }): Promise<SocialGroupMembershipRow[]>;
    update(args: { where: { id: string }; data: Partial<SocialGroupMembershipRow> }): Promise<SocialGroupMembershipRow>;
  };
  socialChallenge: {
    create(args: { data: Omit<SocialChallengeRow, "id" | "completedAt"> & { participants?: { create: Array<{ userId: string; status: SocialChallengeStatus }> } } }): Promise<SocialChallengeRow>;
  };
  socialChallengeParticipant: {
    findMany(args: { where: Partial<SocialChallengeParticipantRow>; take?: number }): Promise<SocialChallengeParticipantRow[]>;
  };
  socialStatSnapshot: {
    createMany(args: {
      data: Array<{
        userId: string;
        audienceScope: SocialVisibilityScope;
        statKey: SocialStatKey;
        value: Record<string, unknown>;
        expiresAt?: Date | null;
      }>;
    }): Promise<{ count: number }>;
    findMany(args: { where: Partial<SocialStatSnapshotRow>; take?: number; orderBy?: unknown }): Promise<SocialStatSnapshotRow[]>;
  };
};
