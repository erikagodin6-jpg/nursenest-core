"use client";

import { useState } from "react";
import { SocialStatKey, SocialVisibilityScope } from "@prisma/client";

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

export function SocialStudySettingsClient({ initialSettings, initialCode }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [code, setCode] = useState(initialCode);
  const [message, setMessage] = useState<string | null>(null);

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

      {message ? <p className="text-sm font-semibold text-[var(--semantic-info-contrast)]">{message}</p> : null}
    </div>
  );
}
