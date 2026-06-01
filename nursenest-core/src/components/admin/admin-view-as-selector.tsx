"use client";

/**
 * AdminViewAsSelector — unified client UI for the View As User system.
 *
 * Two tabs:
 *  1. Real Users — search any existing account, click "View As User"
 *  2. Simulated Profiles — pick track + lifecycle + country, click "Simulate"
 *
 * Each successful action sets ADMIN_LEARNER_QA_COOKIE and redirects to /app.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Search, User, UserCog } from "lucide-react";

// ─── Type definitions ─────────────────────────────────────────────────────────

type Tab = "real_user" | "simulated";

type UserSearchResult = {
  id: string;
  email: string;
  name: string | null;
  tier: string | null;
  country: string | null;
  subscriptionStatus: string | null;
  planCode: string | null;
  trialStatus: string | null;
};

type Track = "RN" | "RPN" | "LVN_LPN" | "NP" | "ALLIED" | "NEW_GRAD" | "PRE_NURSING";
type Lifecycle =
  | "paid_active" | "paid_monthly" | "paid_annual"
  | "none" | "expired" | "trial" | "trial_expired" | "canceled" | "past_due";
type Country = "US" | "CA";
type NpSpecialty = "FNP" | "AGPCNP" | "PMHNP" | "WHNP" | "PNP_PC";
type AlliedCareer = "paramedic" | "rrt" | "mlt" | "imaging" | "ota_pta" | "pharmtech" | "socialwork";
type ExperienceLevel = "new" | "active" | "returning";

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACKS: { value: Track; label: string }[] = [
  { value: "RN", label: "RN — Registered Nurse" },
  { value: "RPN", label: "RPN/PN — Practical Nurse" },
  { value: "LVN_LPN", label: "LVN/LPN — Licensed Practical Nurse" },
  { value: "NP", label: "NP — Nurse Practitioner" },
  { value: "ALLIED", label: "Allied Health" },
  { value: "NEW_GRAD", label: "New Graduate" },
  { value: "PRE_NURSING", label: "Pre-Nursing" },
];

const LIFECYCLES: { value: Lifecycle; label: string; color: string }[] = [
  { value: "paid_active", label: "Active Subscriber", color: "#22c55e" },
  { value: "paid_monthly", label: "Active Monthly Subscriber", color: "#22c55e" },
  { value: "paid_annual", label: "Active Annual Subscriber", color: "#22c55e" },
  { value: "trial", label: "Active Trial User", color: "#3b82f6" },
  { value: "none", label: "Free User (no subscription)", color: "#6b7280" },
  { value: "canceled", label: "Cancelled Subscriber", color: "#f59e0b" },
  { value: "expired", label: "Expired Subscriber", color: "#f59e0b" },
  { value: "trial_expired", label: "Expired Trial", color: "#f59e0b" },
  { value: "past_due", label: "Failed Payment / Past Due", color: "#ef4444" },
];

const NP_SPECIALTIES: { value: NpSpecialty; label: string }[] = [
  { value: "FNP", label: "FNP — Family" },
  { value: "AGPCNP", label: "AGPCNP — Adult-Gero" },
  { value: "PMHNP", label: "PMHNP — Psych Mental Health" },
  { value: "WHNP", label: "WHNP — Women's Health" },
  { value: "PNP_PC", label: "PNP-PC — Pediatric Primary Care" },
];

const ALLIED_CAREERS: { value: AlliedCareer; label: string }[] = [
  { value: "paramedic", label: "Paramedic/EMT" },
  { value: "rrt", label: "Respiratory Therapist" },
  { value: "mlt", label: "Medical Lab Tech" },
  { value: "imaging", label: "Imaging Tech" },
  { value: "ota_pta", label: "OTA/PTA" },
  { value: "pharmtech", label: "Pharmacy Tech" },
  { value: "socialwork", label: "Social Work" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "new", label: "New User (just signed up)" },
  { value: "active", label: "Active User (regular studier)" },
  { value: "returning", label: "Returning User (lapsed)" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function subscriptionStatusBadge(status: string | null): string {
  if (!status) return "None";
  switch (status) {
    case "active": return "Active ✓";
    case "canceled": return "Cancelled";
    case "grace": return "Grace period";
    case "past_due": return "Past due";
    default: return status;
  }
}

// ─── Real User Panel ──────────────────────────────────────────────────────────

function RealUserPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [started, setStarted] = useState<string | null>(null);
  const [startErr, setStartErr] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    setSearchErr(null);
    try {
      const res = await fetch(`/api/admin/view-as/user-search?q=${encodeURIComponent(q.trim())}`, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json() as { ok?: boolean; users?: UserSearchResult[]; error?: string };
      if (!res.ok) { setSearchErr(json.error ?? `HTTP ${res.status}`); return; }
      setResults(json.users ?? []);
    } catch (e) {
      setSearchErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void search(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const startViewAs = useCallback(async (userId: string) => {
    setStarting(userId);
    setStartErr(null);
    try {
      const res = await fetch("/api/admin/view-as/real-user", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const json = await res.json() as { ok?: boolean; redirectTo?: string; error?: string };
      if (!res.ok) { setStartErr(json.error ?? `HTTP ${res.status}`); return; }
      setStarted(userId);
      setTimeout(() => router.push(json.redirectTo ?? "/app"), 800);
    } catch (e) {
      setStartErr(e instanceof Error ? e.message : "Failed to start session");
    } finally {
      setStarting(null);
    }
  }, [router]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        Search any existing NurseNest account. The learner app will use that user's actual subscription tier and status. Study data (progress, scores) is NOT loaded — entitlements only.
      </p>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--semantic-text-tertiary)]" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email or name…"
          className="w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] py-2.5 pl-9 pr-4 text-sm focus:border-[var(--semantic-brand)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]"
          autoFocus
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--semantic-brand)]" aria-hidden />
        )}
      </div>

      {searchErr && (
        <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-error)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-error)_5%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-error)]">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {searchErr}
        </div>
      )}

      {startErr && (
        <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-error)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-error)_5%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-error)]">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {startErr}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ul className="divide-y divide-[var(--semantic-border-soft)] overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          {results.map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)]">
                <User className="h-4 w-4 text-[var(--semantic-brand)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--semantic-text-primary)]">{user.email}</p>
                <p className="truncate text-xs text-[var(--semantic-text-secondary)]">
                  {[user.tier, user.country, subscriptionStatusBadge(user.subscriptionStatus)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void startViewAs(user.id)}
                disabled={Boolean(starting ?? started)}
                className="flex-shrink-0 rounded-xl bg-[var(--semantic-brand)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                data-testid={`view-as-real-user-${user.id}`}
              >
                {started === user.id ? (
                  <><CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />Launching…</>
                ) : starting === user.id ? (
                  <><Loader2 className="inline h-3.5 w-3.5 mr-1 animate-spin" />Starting…</>
                ) : "View As User"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && !searching && results.length === 0 && !searchErr && (
        <p className="text-sm text-[var(--semantic-text-tertiary)]">No users found for "{query}".</p>
      )}
    </div>
  );
}

// ─── Simulated Profile Panel ──────────────────────────────────────────────────

function SimulatedPanel() {
  const router = useRouter();
  const [track, setTrack] = useState<Track>("RN");
  const [lifecycle, setLifecycle] = useState<Lifecycle>("paid_active");
  const [country, setCountry] = useState<Country>("US");
  const [npSpec, setNpSpec] = useState<NpSpecialty>("FNP");
  const [allied, setAllied] = useState<AlliedCareer>("paramedic");
  const [expLevel, setExpLevel] = useState<ExperienceLevel>("active");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const simulate = useCallback(async () => {
    setBusy(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = { track, lifecycle, country, confirm: true, experienceLevel: expLevel };
      if (track === "NP") body.npSpecialty = npSpec;
      if (track === "ALLIED") body.alliedCareer = allied;
      const res = await fetch("/api/admin/learner-qa/simulate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json() as { ok?: boolean; error?: string; hint?: string };
      if (!res.ok) { setErr(json.hint ? `${json.error} — ${json.hint}` : (json.error ?? `HTTP ${res.status}`)); return; }
      setDone(true);
      setTimeout(() => router.push("/app"), 800);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }, [track, lifecycle, country, npSpec, allied, expLevel, router]);

  const selectedLifecycle = LIFECYCLES.find((l) => l.value === lifecycle);

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        Create a virtual profile without modifying any database records. The learner app will use a synthetic entitlement matching the selected state.
      </p>

      {/* Track */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Pathway</legend>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
          {TRACKS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTrack(value)}
              className="rounded-xl border px-3 py-2 text-xs font-semibold text-left transition"
              data-testid={`sim-track-${value.toLowerCase()}`}
              style={{
                background: track === value ? "var(--semantic-brand)" : "var(--semantic-surface)",
                borderColor: track === value ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                color: track === value ? "#fff" : "var(--semantic-text-primary)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* NP specialty */}
      {track === "NP" && (
        <fieldset>
          <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">NP Specialty</legend>
          <div className="flex flex-wrap gap-1.5">
            {NP_SPECIALTIES.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => setNpSpec(value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  background: npSpec === value ? "var(--semantic-brand)" : "var(--semantic-surface)",
                  borderColor: npSpec === value ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                  color: npSpec === value ? "#fff" : "var(--semantic-text-primary)",
                }}>{label}</button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Allied career */}
      {track === "ALLIED" && (
        <fieldset>
          <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Allied Career</legend>
          <div className="flex flex-wrap gap-1.5">
            {ALLIED_CAREERS.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => setAllied(value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  background: allied === value ? "var(--semantic-brand)" : "var(--semantic-surface)",
                  borderColor: allied === value ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                  color: allied === value ? "#fff" : "var(--semantic-text-primary)",
                }}>{label}</button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Subscription state */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Subscription State</legend>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLES.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLifecycle(value)}
              data-testid={`sim-lifecycle-${value}`}
              className="rounded-xl border px-3 py-2 text-xs font-semibold text-left transition"
              style={{
                background: lifecycle === value ? color + "18" : "var(--semantic-surface)",
                borderColor: lifecycle === value ? color : "var(--semantic-border-soft)",
                color: lifecycle === value ? color : "var(--semantic-text-primary)",
              }}
            >
              <span className="block font-bold">{label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Country */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Country</legend>
        <div className="flex gap-2">
          {(["US", "CA"] as Country[]).map((c) => (
            <button key={c} type="button" onClick={() => setCountry(c)}
              className="rounded-xl border px-4 py-2 text-sm font-semibold transition"
              style={{
                background: country === c ? "var(--semantic-brand)" : "var(--semantic-surface)",
                borderColor: country === c ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                color: country === c ? "#fff" : "var(--semantic-text-primary)",
              }}>
              {c === "US" ? "🇺🇸 United States" : "🇨🇦 Canada"}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Experience level */}
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Experience Level</legend>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => setExpLevel(value)}
              className="rounded-xl border px-3 py-2 text-xs font-semibold transition"
              style={{
                background: expLevel === value ? "var(--semantic-brand)" : "var(--semantic-surface)",
                borderColor: expLevel === value ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
                color: expLevel === value ? "#fff" : "var(--semantic-text-primary)",
              }}>{label}</button>
          ))}
        </div>
      </fieldset>

      {err && (
        <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-error)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-error)_5%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-error)]">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {err}
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Preview</p>
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {track} · {selectedLifecycle?.label ?? lifecycle} · {country}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void simulate()}
          disabled={busy || done}
          data-testid="simulate-launch-btn"
          className="flex items-center gap-2 rounded-xl bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {done ? (
            <><CheckCircle2 className="h-4 w-4" />Launching…</>
          ) : busy ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Starting…</>
          ) : (
            <><UserCog className="h-4 w-4" />Simulate</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminViewAsSelector() {
  const [tab, setTab] = useState<Tab>("real_user");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted,var(--semantic-surface))] p-1">
        <button
          type="button"
          onClick={() => setTab("real_user")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
          style={{
            background: tab === "real_user" ? "var(--semantic-surface)" : "transparent",
            color: tab === "real_user" ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
            boxShadow: tab === "real_user" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
          data-testid="tab-real-user"
        >
          <User className="h-4 w-4" />
          Real Users
        </button>
        <button
          type="button"
          onClick={() => setTab("simulated")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
          style={{
            background: tab === "simulated" ? "var(--semantic-surface)" : "transparent",
            color: tab === "simulated" ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
            boxShadow: tab === "simulated" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
          data-testid="tab-simulated"
        >
          <UserCog className="h-4 w-4" />
          Simulated Profiles
        </button>
      </div>

      {/* Tab content */}
      {tab === "real_user" ? <RealUserPanel /> : <SimulatedPanel />}
    </div>
  );
}
