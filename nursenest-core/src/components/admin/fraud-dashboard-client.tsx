"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Eye,
  Fingerprint,
  Globe,
  Mail,
  MailWarning,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type {
  FraudDashboardSummary,
  FraudScoredUser,
  FraudSignal,
  RiskLevel,
} from "@/lib/admin/fraud-scoring";

type Props = {
  summary: FraudDashboardSummary;
  accounts: FraudScoredUser[];
};

const RISK_CONFIG: Record<RiskLevel, {
  bg: string;
  text: string;
  label: string;
  strip: string;
  iconColor: string;
}> = {
  high: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-400",
    label: "High Risk",
    strip: "bg-red-500",
    iconColor: "text-red-500",
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    label: "Medium",
    strip: "bg-amber-500",
    iconColor: "text-amber-500",
  },
  low: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Low",
    strip: "bg-emerald-500",
    iconColor: "text-emerald-500",
  },
};

const SIGNAL_ICONS: Record<string, React.ElementType> = {
  shared_ip: Globe,
  shared_device: Fingerprint,
  unverified: MailWarning,
  no_engagement: Clock,
  rapid_trial: Zap,
  disposable_email: Mail,
};

function relativeTime(date: Date | string): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconColor,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  accent?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
      {accent && <div className={`h-1 ${accent}`} />}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--semantic-panel-cool)]">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const c = RISK_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color =
    pct >= 50 ? "bg-red-500" : pct >= 25 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--semantic-panel-cool)]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{score}</span>
    </div>
  );
}

function SignalRow({ signal }: { signal: FraudSignal }) {
  const Icon = SIGNAL_ICONS[signal.key] ?? AlertTriangle;
  return (
    <div className="flex items-start gap-3 rounded-lg bg-[var(--semantic-panel-cool)]/40 px-3 py-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning)]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-[var(--theme-heading-text)]">{signal.label}</span>
          <span className="shrink-0 rounded bg-[var(--semantic-panel-warm)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
            +{signal.weight}
          </span>
        </div>
        {signal.detail && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{signal.detail}</p>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-xs text-[var(--theme-heading-text)] ${mono ? "font-mono" : ""}`}>{children}</p>
    </div>
  );
}

function AccountRow({ account }: { account: FraudScoredUser }) {
  const [expanded, setExpanded] = useState(false);
  const risk = RISK_CONFIG[account.riskLevel];

  function handleExpand() {
    setExpanded((prev) => !prev);
    if (!expanded) {
      trackClientEvent("fraud_case_viewed", { userId: account.id, score: account.score });
    }
  }

  const displayName = account.firstName || account.name?.split(" ")[0] || null;

  return (
    <div className="group overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm transition-shadow hover:shadow-md">
      <div className="flex">
        {/* Risk strip */}
        <div className={`w-1 shrink-0 ${risk.strip}`} />

        <button
          type="button"
          onClick={handleExpand}
          className="flex flex-1 items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--semantic-panel-cool)]/20 sm:px-5"
        >
          {/* Left: identity + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-semibold text-[var(--theme-heading-text)] truncate max-w-[16rem]">
                {account.email}
              </span>
              <RiskBadge level={account.riskLevel} />
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
              {displayName && (
                <span>{displayName}</span>
              )}
              <span>{relativeTime(account.createdAt)}</span>
              <span className="capitalize">{account.trialStatus.toLowerCase().replace(/_/g, " ")}</span>
              {account.relatedAccountCount > 0 && (
                <span className="rounded bg-[var(--semantic-panel-warm)] px-1.5 py-0.5 text-[10px] font-semibold">
                  +{account.relatedAccountCount} linked
                </span>
              )}
            </div>
          </div>

          {/* Right: score bar + chevron */}
          <div className="flex items-center gap-3 shrink-0">
            <ScoreBar score={account.score} />
            {expanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[var(--semantic-border-soft)]">
          {/* Account details grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-[var(--semantic-border-soft)] px-5 py-4 sm:grid-cols-5">
            <DetailField label="Signup IP" mono>
              {account.signupIp ?? "Not recorded"}
            </DetailField>
            <DetailField label="Last Login IP" mono>
              {account.lastLoginIp ?? "Not recorded"}
            </DetailField>
            <DetailField label="Last Seen">
              {account.lastLoginAt ? relativeTime(account.lastLoginAt) : "Never"}
            </DetailField>
            <DetailField label="Email Verified">
              <span className="inline-flex items-center gap-1">
                {account.emailVerified
                  ? <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Yes</>
                  : <><XCircle className="h-3 w-3 text-red-400" /> No</>
                }
              </span>
            </DetailField>
            <DetailField label="Subscriptions">
              {account.subscriptionCount}
            </DetailField>
          </div>

          {/* Signals */}
          <div className="px-5 py-4">
            <p className="mb-2.5 text-xs font-semibold text-[var(--theme-heading-text)]">
              Why This Was Flagged
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {account.signals.map((s) => (
                <SignalRow key={s.key} signal={s} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-[var(--semantic-brand)] text-white shadow-sm"
          : "bg-[var(--semantic-panel-cool)] text-muted-foreground hover:bg-[var(--semantic-panel-warm)]"
      }`}
    >
      {label}
      <span className={`tabular-nums ${active ? "text-white/70" : "text-muted-foreground/60"}`}>
        {count}
      </span>
    </button>
  );
}

export function FraudDashboardClient({ summary, accounts }: Props) {
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const filtered = filter === "all"
    ? accounts
    : accounts.filter((a) => a.riskLevel === filter);

  const counts = {
    all: accounts.length,
    high: accounts.filter((a) => a.riskLevel === "high").length,
    medium: accounts.filter((a) => a.riskLevel === "medium").length,
    low: accounts.filter((a) => a.riskLevel === "low").length,
  };

  return (
    <div className="space-y-10">
      {/* Executive Summary */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Today at a Glance</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            label="Unverified Signups"
            value={summary.suspiciousToday}
            icon={UserX}
            iconColor="text-amber-500"
            accent="bg-amber-400"
          />
          <SummaryCard
            label="High Risk Accounts"
            value={summary.highRiskCount}
            icon={ShieldAlert}
            iconColor="text-red-500"
            accent="bg-red-500"
          />
          <SummaryCard
            label="Pending Review"
            value={summary.unreviewedCount}
            icon={Eye}
            iconColor="text-blue-500"
            accent="bg-blue-500"
          />
          <SummaryCard
            label="Trial Blocks"
            value={summary.trialBlocksToday}
            icon={ShieldCheck}
            iconColor="text-emerald-500"
            accent="bg-emerald-500"
          />
        </div>
      </section>

      {/* Risk Queue */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Risk Queue</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ranked by composite score. Expand any row for full detail.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <FilterTab label="All" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterTab label="High" count={counts.high} active={filter === "high"} onClick={() => setFilter("high")} />
            <FilterTab label="Medium" count={counts.medium} active={filter === "medium"} onClick={() => setFilter("medium")} />
            <FilterTab label="Low" count={counts.low} active={filter === "low"} onClick={() => setFilter("low")} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-6 py-12 text-center">
            <Shield className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No accounts match this filter</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {filter !== "all" ? "Try a different risk level, or check back later." : "No flagged accounts found."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
