import {
  SocialChallengeStatus,
  SocialCodeAudience,
  SocialConnectionStatus,
  SocialGroupRole,
  SocialVisibilityScope,
} from "@prisma/client";
import type {
  SocialChallengeParticipantRow,
  SocialChallengeRow,
  SocialConnectionRow,
  SocialGroupMembershipRow,
  SocialGroupRow,
  SocialInviteCodeRow,
  SocialPrivacyRow,
  SocialStatSnapshotRow,
  SocialStudyDb,
  SocialUserRow,
} from "@/lib/social-study/social-study-types";

function id(prefix: string, size: number): string {
  return `${prefix}_${size + 1}`;
}

function matches<T extends Record<string, unknown>>(row: T, where: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(value)) {
      if (!value.some((clause) => matches(row, clause as Record<string, unknown>))) return false;
      continue;
    }
    if (value !== undefined && row[key] !== value) return false;
  }
  return true;
}

export function createMemorySocialStudyDb(): SocialStudyDb & {
  addUser(user: SocialUserRow): void;
  _state: {
    users: SocialUserRow[];
    privacy: SocialPrivacyRow[];
    codes: SocialInviteCodeRow[];
    connections: SocialConnectionRow[];
    groups: SocialGroupRow[];
    memberships: SocialGroupMembershipRow[];
    challenges: SocialChallengeRow[];
    participants: SocialChallengeParticipantRow[];
    snapshots: SocialStatSnapshotRow[];
  };
} {
  const state = {
    users: [] as SocialUserRow[],
    privacy: [] as SocialPrivacyRow[],
    codes: [] as SocialInviteCodeRow[],
    connections: [] as SocialConnectionRow[],
    groups: [] as SocialGroupRow[],
    memberships: [] as SocialGroupMembershipRow[],
    challenges: [] as SocialChallengeRow[],
    participants: [] as SocialChallengeParticipantRow[],
    snapshots: [] as SocialStatSnapshotRow[],
  };

  return {
    _state: state,
    addUser(user) {
      state.users.push(user);
    },
    user: {
      async findUnique({ where }) {
        return state.users.find((u) => u.id === where.id) ?? null;
      },
    },
    socialPrivacySetting: {
      async upsert({ where, create, update }) {
        let row = state.privacy.find((p) => p.userId === where.userId);
        if (!row) {
          row = {
            userId: create.userId,
            socialEnabled: create.socialEnabled ?? false,
            statsHidden: create.statsHidden ?? true,
            visibilityScope: create.visibilityScope ?? SocialVisibilityScope.PRIVATE,
            visibleStatKeys: create.visibleStatKeys ?? [],
            pausedUntil: create.pausedUntil ?? null,
            leaderboardOptIn: create.leaderboardOptIn ?? false,
            allowFriendChallenges: create.allowFriendChallenges ?? false,
            allowGroupChallenges: create.allowGroupChallenges ?? false,
          };
          state.privacy.push(row);
        } else {
          Object.assign(row, update);
        }
        return row;
      },
      async findUnique({ where }) {
        return state.privacy.find((p) => p.userId === where.userId) ?? null;
      },
    },
    socialInviteCode: {
      async create({ data }) {
        const row: SocialInviteCodeRow = {
          id: id("code", state.codes.length),
          disabledAt: null,
          ...data,
        };
        state.codes.push(row);
        return row;
      },
      async update({ where, data }) {
        const row = state.codes.find((c) => c.id === where.id);
        if (!row) throw new Error("code_not_found");
        Object.assign(row, data);
        return row;
      },
      async findFirst({ where }) {
        return state.codes.find((c) => matches(c as unknown as Record<string, unknown>, where as Record<string, unknown>)) ?? null;
      },
    },
    socialConnection: {
      async upsert({ where, create, update }) {
        const key = where.requesterUserId_addresseeUserId;
        let row = state.connections.find((c) => c.requesterUserId === key.requesterUserId && c.addresseeUserId === key.addresseeUserId);
        if (!row) {
          row = {
            id: id("conn", state.connections.length),
            requestedAt: new Date(),
            respondedAt: null,
            removedAt: null,
            blockedAt: null,
            ...create,
          };
          state.connections.push(row);
        } else {
          Object.assign(row, update);
        }
        return row;
      },
      async findFirst({ where }) {
        return state.connections.find((c) => matches(c as unknown as Record<string, unknown>, where as Record<string, unknown>)) ?? null;
      },
      async update({ where, data }) {
        const row = state.connections.find((c) => c.id === where.id);
        if (!row) throw new Error("connection_not_found");
        Object.assign(row, data);
        return row;
      },
    },
    socialGroup: {
      async create({ data }) {
        const row: SocialGroupRow = { id: id("group", state.groups.length), ...data };
        state.groups.push(row);
        return row;
      },
      async findFirst({ where }) {
        return state.groups.find((g) => matches(g as unknown as Record<string, unknown>, where as Record<string, unknown>)) ?? null;
      },
    },
    socialGroupMembership: {
      async upsert({ where, create, update }) {
        const key = where.groupId_userId;
        let row = state.memberships.find((m) => m.groupId === key.groupId && m.userId === key.userId);
        if (!row) {
          row = {
            id: id("member", state.memberships.length),
            joinedAt: new Date(),
            leftAt: null,
            ...create,
          };
          state.memberships.push(row);
        } else {
          Object.assign(row, update);
        }
        return row;
      },
      async findFirst({ where }) {
        return state.memberships.find((m) => matches(m as unknown as Record<string, unknown>, where as Record<string, unknown>)) ?? null;
      },
      async findMany({ where, take = 50 }) {
        return state.memberships.filter((m) => matches(m as unknown as Record<string, unknown>, where as Record<string, unknown>)).slice(0, take);
      },
      async update({ where, data }) {
        const row = state.memberships.find((m) => m.id === where.id);
        if (!row) throw new Error("membership_not_found");
        Object.assign(row, data);
        return row;
      },
    },
    socialChallenge: {
      async create({ data }) {
        const { participants, ...challengeData } = data;
        const row: SocialChallengeRow = {
          id: id("challenge", state.challenges.length),
          completedAt: null,
          ...challengeData,
        };
        state.challenges.push(row);
        for (const p of participants?.create ?? []) {
          state.participants.push({
            id: id("participant", state.participants.length),
            challengeId: row.id,
            userId: p.userId,
            status: p.status ?? SocialChallengeStatus.PENDING,
            completionSummary: null,
          });
        }
        return row;
      },
    },
    socialChallengeParticipant: {
      async findMany({ where, take = 50 }) {
        return state.participants.filter((p) => matches(p as unknown as Record<string, unknown>, where as Record<string, unknown>)).slice(0, take);
      },
    },
    socialStatSnapshot: {
      async createMany({ data }) {
        for (const row of data) {
          state.snapshots.push({
            id: id("snapshot", state.snapshots.length),
            generatedAt: new Date(),
            expiresAt: row.expiresAt ?? null,
            ...row,
          });
        }
        return { count: data.length };
      },
      async findMany({ where, take = 50 }) {
        return state.snapshots.filter((s) => matches(s as unknown as Record<string, unknown>, where as Record<string, unknown>)).slice(0, take);
      },
    },
  };
}

export const MEMORY_SOCIAL_DEFAULTS = {
  audience: SocialCodeAudience.FRIEND_OR_GROUP,
  connectionStatus: SocialConnectionStatus.PENDING,
  membershipRole: SocialGroupRole.MEMBER,
};
