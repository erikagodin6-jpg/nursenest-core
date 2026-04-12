"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Eye,
  ShieldAlert,
  ShieldCheck,
  UserX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type {
  FraudDashboardSummary,
  FraudScoredUser,
  RiskLevel,
} from "@/lib/admin/fraud-scoring";

type Props = {
  summary: FraudDashboardSummary;
  accounts: FraudScoredUser[];
};

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/20", text: "text-red-700 dark:text-red-400", label: "High" },
  medium: { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", label: "Medium" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-400", label: "Low" },
};

function SummaryCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="nn-card flex items-center gap-4 px-5 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--semantic-panel-cool)]">
        <Icon className="h-5 w-5 text-[var(--semantic-info)]" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--theme-heading-text)]">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const style = RISK_STYLES[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

function AccountRow({ account }: { account: FraudScoredUser }) {
  const [expanded, setExpanded] = useState(false);

  function handleExpand() {
    setExpanded((prev) => !prev);
    if (!expanded) {
      trackClientEvent("fraud_case_viewed", { userId: account.id, score: account.score });
    }
  }

  return (
    <div className="nn-card overflow-hidden">
      <button
        type="button"
        onClick={handleExpand}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-[var(--semantic-panel-cool)]/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[var(--theme-heading-text)] truncate">{account.email}</span>
            <RiskBadge level={account.riskLevel} />
            {account.relatedAccountCount > 0 && (
              <span className="text-xs text-muted-foreground">
                +{account.relatedAccountCount} related
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>Score: {account.score}</span>
            <span>Trial: {account.trialStatus.toLowerCase().replace(/_/g, " ")}</span>
            <span>Joined: {new Date(account.createdAt).toLocaleDateString()}</span>
            {account.firstName && <span>Name: {account.firstName}</span>}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-[var(--semantic-border-soft)] px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">Signup IP</p>
              <p className="font-mono text-[var(--theme-heading-text)]">{account.signupIp ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Login IP</p>
              <p className="font-mono text-[var(--theme-heading-text)]">{account.lastLoginIp ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Login</p>
              <p className="text-[var(--theme-heading-text)]">
                {account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleString() : "Never"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Email Verified</p>
              <p className="text-[var(--theme-heading-text)]">{account.emailVerified ? "Yes" : "No"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--theme-heading-text)] mb-2">Signals</p>
            <div className="space-y-1.5">
              {account.signals.map((s) => (
                <div key={s.key} className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 text-[var(--semantic-warning)] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[var(--theme-heading-text)]">{s.label}</span>
                    <span className="text-muted-foreground ml-1">(weight: {s.weight})</span>
                    {s.detail && <p className="text-muted-foreground">{s.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FraudDashboardClient({ summary, accounts }: Props) {
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const filtered = filter === "all"
    ? accounts
    : accounts.filter((a) => a.riskLevel === filter);

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <section>
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)] mb-3">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Unverified Today" value={summary.suspiciousToday} icon={UserX} />
          <SummaryCard label="High Risk" value={summary.highRiskCount} icon={ShieldAlert} />
          <SummaryCard label="Unreviewed" value={summary.unreviewedCount} icon={Eye} />
          <SummaryCard label="Trial Blocks Today" value={summary.trialBlocksToday} icon={ShieldCheck} />
        </div>
      </section>

      {/* Risk Queue */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Risk Queue</h2>
          <div className="flex gap-1">
            {(["all", "high", "medium", "low"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilter(level)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  filter === level
                    ? "bg-[var(--semantic-brand)] text-white"
                    : "bg-[var(--semantic-panel-cool)] text-muted-foreground hover:bg-[var(--semantic-panel-warm)]"
                }`}
              >
                {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="nn-card px-5 py-8 text-center text-sm text-muted-foreground">
            No accounts match this filter.
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
