"use client";

import { useEffect, useMemo, useState } from "react";
import { SocialChallengeType, SocialStatKey, SocialVisibilityScope } from "@prisma/client";

type Props = {
  initialSettings: {
    socialEnabled: boolean;
    statsHidden: boolean;
    visibilityScope: SocialVisibilityScope;
    visibleStatKeys: SocialStatKey[];
    pausedUntil: string | null;
    leaderboardOptIn: boolean;
    allowFriendChallenges: boolean;
    allowGroupChallenges: boolean;
  };
  initialCode: { id: string; displayCode: string; enabled: boolean } | null;
};

const STAT_LABELS: Record<SocialStatKey, string> = {
  READINESS_BAND: "Readiness band",
  READINESS_RANGE: "Readiness range",
  WEEKLY_STREAK: "Weekly study streak",
  PRACTICE_SCORE_RANGE: "Practice score range",
  FLASHCARD_PROGRESS: "Flashcard progress",
  WEAK_AREA_OVERLAP: "Weak-area overlap",
  CAT_COMPLETION: "CAT completion status",
};

const VISIBLE_KEYS = Object.values(SocialStatKey);

type FriendRow = {
  id: string;
  requesterUserId: string;
  addresseeUserId: string;
  status: string;
  direction: "incoming" | "outgoing";
  otherUser: { id: string; displayName: string };
};

type GroupRow = {
  id: string;
  role: string;
  group: {
    id: string;
    kind: string;
    name: string;
    description: string | null;
    displayCode: string;
    leaderboardEnabled: boolean;
  };
};

type ChallengeRow = {
  id: string;
  status: string;
  challenge: {
    id: string;
    type: SocialChallengeType;
    status: string;
    title: string;
    prompt: string | null;
    expiresAt: string;
    groupId: string | null;
  };
};

type SocialNotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
};

type ComparePayload = {
  friendStats?: Array<{ statKey: SocialStatKey; value: Record<string, unknown> }>;
  viewerStats?: Array<{ statKey: SocialStatKey; value: Record<string, unknown> }>;
};

type LeaderboardPayload = {
  groupId: string;
  entries: Array<{ userId: string; stats: Array<{ statKey: SocialStatKey; value: Record<string, unknown> }> }>;
};

const CHALLENGE_LABELS: Record<SocialChallengeType, string> = {
  FLASHCARD_SPRINT: "Flashcard sprint",
  PRACTICE_QUIZ: "Question challenge",
  WEAK_AREA_RECOVERY: "Weak-area recovery",
  DAILY_STREAK: "Weekly streak challenge",
  READINESS_IMPROVEMENT: "CAT / readiness challenge",
};

function statValueLabel(value: Record<string, unknown>): string {
  const v = value.range ?? value.band ?? value.completedBand ?? value.count;
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(value.topicCodes)) return `${value.topicCodes.length} shared weak topics`;
  return "Shared";
}

export function SocialStudySettingsClient({ initialSettings, initialCode }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [code, setCode] = useState(initialCode);
  const [message, setMessage] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [challenges, setChallenges] = useState<ChallengeRow[]>([]);
  const [notifications, setNotifications] = useState<SocialNotificationRow[]>([]);
  const [compare, setCompare] = useState<ComparePayload | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPayload | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [challengeType, setChallengeType] = useState<SocialChallengeType>(SocialChallengeType.FLASHCARD_SPRINT);
  const [groupName, setGroupName] = useState("");

  const acceptedFriends = useMemo(() => friends.filter((friend) => friend.status === "ACCEPTED"), [friends]);

  async function refreshSocialData() {
    const [friendsRes, groupsRes, challengesRes, notificationsRes] = await Promise.all([
      fetch("/api/learner/social/friends", { cache: "no-store" }),
      fetch("/api/learner/social/groups", { cache: "no-store" }),
      fetch("/api/learner/social/challenges", { cache: "no-store" }),
      fetch("/api/learner/social/notifications", { cache: "no-store" }),
    ]);
    const [friendsPayload, groupsPayload, challengesPayload, notificationsPayload] = await Promise.all([
      friendsRes.json().catch(() => ({})),
      groupsRes.json().catch(() => ({})),
      challengesRes.json().catch(() => ({})),
      notificationsRes.json().catch(() => ({})),
    ]);
    setFriends(Array.isArray(friendsPayload.friends) ? friendsPayload.friends : []);
    setGroups(Array.isArray(groupsPayload.memberships) ? groupsPayload.memberships : []);
    setChallenges(Array.isArray(challengesPayload.challenges) ? challengesPayload.challenges : []);
    setNotifications(Array.isArray(notificationsPayload.notifications) ? notificationsPayload.notifications : []);
  }

  useEffect(() => {
    void refreshSocialData();
  }, []);

  async function save(next: Partial<Props["initialSettings"]>) {
    const updated = { ...settings, ...next };
    setSettings(updated);
    const res = await fetch("/api/learner/social/privacy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setMessage(res.ok ? "Social privacy saved." : "Unable to save social privacy.");
  }

  async function regenerate() {
    const res = await fetch("/api/learner/social/invite-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    const payload = await res.json().catch(() => null);
    if (payload?.ok) {
      setCode(payload.code);
      setMessage("Invite code regenerated.");
    } else {
      setMessage("Unable to regenerate invite code.");
    }
  }

  async function disableCode() {
    if (!code) return;
    const res = await fetch("/api/learner/social/invite-code", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeId: code.id, enabled: false }),
    });
    if (res.ok) setCode({ ...code, enabled: false });
    setMessage(res.ok ? "Invite code disabled." : "Unable to disable invite code.");
  }

  async function updateFriend(connectionId: string, action: "accept" | "decline" | "remove" | "block") {
    const res = await fetch(`/api/learner/social/friends/${encodeURIComponent(connectionId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setMessage(res.ok ? "Friend list updated." : "Unable to update this friend request.");
    await refreshSocialData();
  }

  async function compareWith(friendUserId: string) {
    const res = await fetch(`/api/learner/social/compare/${encodeURIComponent(friendUserId)}`, { cache: "no-store" });
    const payload = (await res.json().catch(() => null)) as ComparePayload | null;
    setCompare(payload);
    setMessage(res.ok ? "Comparison refreshed." : "Unable to compare stats. Check privacy settings.");
  }

  async function createChallenge() {
    const friendId = selectedFriendId || acceptedFriends[0]?.otherUser.id;
    if (!friendId) {
      setMessage("Connect with a friend before creating a challenge.");
      return;
    }
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch("/api/learner/social/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantUserIds: [friendId],
        type: challengeType,
        title: CHALLENGE_LABELS[challengeType],
        prompt: "Complete this together this week and compare privacy-safe progress ranges.",
        expiresAt,
      }),
    });
    setMessage(res.ok ? "Challenge created." : "Unable to create challenge.");
    await refreshSocialData();
  }

  async function updateChallenge(challengeId: string, status: "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED") {
    const res = await fetch(`/api/learner/social/challenges/${encodeURIComponent(challengeId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        completionSummary: status === "COMPLETED" ? { completedFrom: "social_settings" } : undefined,
      }),
    });
    setMessage(res.ok ? "Challenge updated." : "Unable to update challenge.");
    await refreshSocialData();
  }

  async function createGroup() {
    const name = groupName.trim();
    if (!name) return;
    const res = await fetch("/api/learner/social/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, leaderboardEnabled: true }),
    });
    if (res.ok) setGroupName("");
    setMessage(res.ok ? "Study group created." : "Unable to create group.");
    await refreshSocialData();
  }

  async function leaveGroup(groupId: string) {
    const res = await fetch(`/api/learner/social/groups/${encodeURIComponent(groupId)}/membership`, { method: "DELETE" });
    setMessage(res.ok ? "Group left." : "Unable to leave group.");
    await refreshSocialData();
  }

  async function loadLeaderboard(groupId: string) {
    const res = await fetch(`/api/learner/social/groups/${encodeURIComponent(groupId)}/leaderboard`, { cache: "no-store" });
    const payload = await res.json().catch(() => null) as { entries?: LeaderboardPayload["entries"] } | null;
    setLeaderboard({ groupId, entries: Array.isArray(payload?.entries) ? payload.entries : [] });
    setMessage(res.ok ? "Leaderboard refreshed." : "Leaderboard is unavailable for this group.");
  }

  function toggleStat(key: SocialStatKey) {
    const visible = new Set(settings.visibleStatKeys);
    if (visible.has(key)) visible.delete(key);
    else visible.add(key);
    void save({ visibleStatKeys: Array.from(visible) });
  }

  return (
    <div className="space-y-5" data-testid="social-study-settings">
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Privacy defaults</h2>
        <p className="mt-1 text-sm text-muted-foreground">Stats stay private unless social is enabled and specific stat keys are selected.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
            Enable social features
            <input type="checkbox" checked={settings.socialEnabled} onChange={(e) => void save({ socialEnabled: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
            Hide my stats
            <input type="checkbox" checked={settings.statsHidden} onChange={(e) => void save({ statsHidden: e.target.checked })} />
          </label>
          <label className="flex flex-col gap-2 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium sm:col-span-2">
            Visibility scope
            <select
              value={settings.visibilityScope}
              onChange={(e) => void save({ visibilityScope: e.target.value as SocialVisibilityScope })}
              className="min-h-11 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3"
            >
              <option value={SocialVisibilityScope.PRIVATE}>Private</option>
              <option value={SocialVisibilityScope.FRIENDS}>Visible to friends</option>
              <option value={SocialVisibilityScope.GROUPS_CLASSROOMS}>Visible to groups/classrooms</option>
              <option value={SocialVisibilityScope.FRIENDS_AND_GROUPS}>Visible to friends and groups</option>
              <option value={SocialVisibilityScope.PAUSED}>Paused</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Visible stats</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {VISIBLE_KEYS.map((key) => (
            <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
              {STAT_LABELS[key]}
              <input type="checkbox" checked={settings.visibleStatKeys.includes(key)} onChange={() => toggleStat(key)} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Invite code</h2>
        <p className="mt-2 rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 font-mono text-lg font-bold tracking-[0.18em]">
          {code?.enabled ? code.displayCode : "Disabled"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={regenerate} className="min-h-10 rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-bold text-white">
            Regenerate code
          </button>
          <button type="button" onClick={disableCode} disabled={!code?.enabled} className="min-h-10 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold disabled:opacity-50">
            Disable code
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Friends</h2>
            <p className="mt-1 text-sm text-muted-foreground">Accept requests, remove friends, or compare privacy-safe study ranges.</p>
          </div>
          <button type="button" onClick={() => void refreshSocialData()} className="min-h-10 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold">
            Refresh
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {friends.length === 0 ? (
            <p className="rounded-xl bg-[var(--semantic-panel-muted)] p-4 text-sm text-muted-foreground">No friend connections yet. Share your invite code from this page or enter a friend's code on the dashboard.</p>
          ) : (
            friends.map((friend) => (
              <article key={friend.id} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--semantic-text-primary)]">{friend.otherUser.displayName}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{friend.status.toLowerCase()} · {friend.direction}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {friend.status === "PENDING" && friend.direction === "incoming" ? (
                      <>
                        <button type="button" onClick={() => void updateFriend(friend.id, "accept")} className="min-h-9 rounded-full bg-[var(--semantic-success)] px-3 text-xs font-bold text-white">Accept</button>
                        <button type="button" onClick={() => void updateFriend(friend.id, "decline")} className="min-h-9 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold">Decline</button>
                      </>
                    ) : null}
                    {friend.status === "ACCEPTED" ? (
                      <>
                        <button type="button" onClick={() => void compareWith(friend.otherUser.id)} className="min-h-9 rounded-full bg-[var(--semantic-info)] px-3 text-xs font-bold text-white">Compare</button>
                        <button type="button" onClick={() => void updateFriend(friend.id, "remove")} className="min-h-9 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold">Remove</button>
                        <button type="button" onClick={() => void updateFriend(friend.id, "block")} className="min-h-9 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold">Block</button>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        {compare ? (
          <div className="mt-4 grid gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Your shared ranges</h3>
              {(compare.viewerStats ?? []).length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {(compare.viewerStats ?? []).map((row) => <li key={row.statKey}>{STAT_LABELS[row.statKey]}: {statValueLabel(row.value)}</li>)}
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">No current snapshot yet.</p>}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Friend shared ranges</h3>
              {(compare.friendStats ?? []).length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {(compare.friendStats ?? []).map((row) => <li key={row.statKey}>{STAT_LABELS[row.statKey]}: {statValueLabel(row.value)}</li>)}
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">This friend has not shared comparable stats.</p>}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Challenges and leaderboards</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
            Friend challenges
            <input type="checkbox" checked={settings.allowFriendChallenges} onChange={(e) => void save({ allowFriendChallenges: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
            Group challenges
            <input type="checkbox" checked={settings.allowGroupChallenges} onChange={(e) => void save({ allowGroupChallenges: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm font-medium">
            Leaderboards
            <input type="checkbox" checked={settings.leaderboardOptIn} onChange={(e) => void save({ leaderboardOptIn: e.target.checked })} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Create a friend challenge</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <select value={selectedFriendId} onChange={(e) => setSelectedFriendId(e.target.value)} className="min-h-11 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm">
            <option value="">Choose accepted friend</option>
            {acceptedFriends.map((friend) => <option key={friend.id} value={friend.otherUser.id}>{friend.otherUser.displayName}</option>)}
          </select>
          <select value={challengeType} onChange={(e) => setChallengeType(e.target.value as SocialChallengeType)} className="min-h-11 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm">
            {Object.values(SocialChallengeType).map((type) => <option key={type} value={type}>{CHALLENGE_LABELS[type]}</option>)}
          </select>
          <button type="button" onClick={() => void createChallenge()} className="min-h-11 rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-bold text-white">Create</button>
        </div>
        <div className="mt-4 grid gap-3">
          {challenges.length === 0 ? (
            <p className="rounded-xl bg-[var(--semantic-panel-muted)] p-4 text-sm text-muted-foreground">No challenges yet. Create a flashcard sprint, question challenge, CAT/readiness challenge, or weekly streak challenge with an accepted friend.</p>
          ) : challenges.map((row) => (
            <article key={row.id} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{row.challenge.title}</p>
                  <p className="text-xs text-muted-foreground">{CHALLENGE_LABELS[row.challenge.type]} · {row.status.toLowerCase()} · due {new Date(row.challenge.expiresAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.status === "PENDING" ? (
                    <>
                      <button type="button" onClick={() => void updateChallenge(row.challenge.id, "ACCEPTED")} className="min-h-9 rounded-full bg-[var(--semantic-success)] px-3 text-xs font-bold text-white">Accept</button>
                      <button type="button" onClick={() => void updateChallenge(row.challenge.id, "DECLINED")} className="min-h-9 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold">Decline</button>
                    </>
                  ) : null}
                  <button type="button" onClick={() => void updateChallenge(row.challenge.id, "COMPLETED")} className="min-h-9 rounded-full bg-[var(--semantic-info)] px-3 text-xs font-bold text-white">Mark complete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Groups and leaderboards</h2>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Create a private study group" className="min-h-11 min-w-0 flex-1 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm" />
          <button type="button" onClick={() => void createGroup()} className="min-h-11 rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-bold text-white">Create group</button>
        </div>
        <div className="mt-4 grid gap-3">
          {groups.length === 0 ? (
            <p className="rounded-xl bg-[var(--semantic-panel-muted)] p-4 text-sm text-muted-foreground">No groups yet. Create a private group or join a classroom using its code.</p>
          ) : groups.map((row) => (
            <article key={row.id} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{row.group.name}</p>
                  <p className="text-xs text-muted-foreground">{row.group.kind.toLowerCase()} · code {row.group.displayCode} · leaderboard {row.group.leaderboardEnabled ? "on" : "off"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void loadLeaderboard(row.group.id)} className="min-h-9 rounded-full bg-[var(--semantic-info)] px-3 text-xs font-bold text-white">Leaderboard</button>
                  <button type="button" onClick={() => void leaveGroup(row.group.id)} className="min-h-9 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold">Leave</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {leaderboard ? (
          <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Leaderboard entries</h3>
            {leaderboard.entries.length > 0 ? (
              <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                {leaderboard.entries.map((entry, index) => (
                  <li key={entry.userId} className="rounded-lg bg-[var(--semantic-surface)] p-3">
                    <span className="font-semibold text-[var(--semantic-text-primary)]">#{index + 1}</span>{" "}
                    Learner {entry.userId.slice(0, 6)} · {entry.stats.map((stat) => `${STAT_LABELS[stat.statKey]} ${statValueLabel(stat.value)}`).join(" · ")}
                  </li>
                ))}
              </ol>
            ) : <p className="mt-2 text-sm text-muted-foreground">No opted-in leaderboard stats for this group yet.</p>}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Social notifications</h2>
        <div className="mt-4 grid gap-2">
          {notifications.length === 0 ? (
            <p className="rounded-xl bg-[var(--semantic-panel-muted)] p-4 text-sm text-muted-foreground">No friend or challenge updates right now.</p>
          ) : notifications.map((notification) => (
            <article key={notification.id} className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{notification.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
            </article>
          ))}
        </div>
      </section>

      {message ? <p className="text-sm font-semibold text-[var(--semantic-info-contrast)]">{message}</p> : null}
    </div>
  );
}
