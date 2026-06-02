"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { ElementType, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Target,
  Users,
} from "lucide-react";
import type { EducatorAnalyticsData } from "@/lib/admin/load-educator-analytics-dashboard";
import { Progress } from "@/components/ui/progress";

type Query = { fromDay: string; toDay: string; pathwayId: string };
type AssignmentRecommendation = EducatorAnalyticsData["assignmentRecommendations"][number];

function MetricCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "risk" | "success" | "info";
}) {
  const toneClass =
    tone === "risk"
      ? "border-rose-500/25 bg-rose-500/10"
      : tone === "success"
        ? "border-emerald-500/25 bg-emerald-500/10"
        : tone === "info"
          ? "border-sky-500/25 bg-sky-500/10"
          : "border-border/70 bg-[var(--theme-card-bg)]";
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function WeaknessRow({
  label,
  sublabel,
  pct,
  trailing,
}: {
  label: string;
  sublabel: string;
  pct: number;
  trailing: string;
}) {
  const value = Math.max(0, Math.min(100, pct));
  return (
    <div className="space-y-2 rounded-xl border border-border/50 bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--theme-heading-text)]">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{trailing}</span>
      </div>
      <Progress value={value} variant="accent" className="h-2 border-0 bg-muted/70" />
    </div>
  );
}

function priorityClass(priority: "critical" | "high" | "moderate") {
  if (priority === "critical") return "border-rose-500/30 bg-rose-500/10 text-rose-700";
  if (priority === "high") return "border-amber-500/30 bg-amber-500/10 text-amber-700";
  return "border-sky-500/30 bg-sky-500/10 text-sky-700";
}

export function AdminEducatorAnalyticsDashboard({
  initialData,
  initialQuery,
}: {
  initialData: EducatorAnalyticsData | null;
  initialQuery: Query;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Query>(initialQuery);
  const [assignmentLog, setAssignmentLog] = useState<string[]>([]);
  const [assigningTitle, setAssigningTitle] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const d = initialData;

  const href = useMemo(() => {
    const params = new URLSearchParams();
    params.set("from", form.fromDay);
    params.set("to", form.toDay);
    if (form.pathwayId.trim()) params.set("pathwayId", form.pathwayId.trim());
    return `/admin/analytics/educator?${params.toString()}`;
  }, [form]);

  function applyFilters() {
    startTransition(() => router.push(href));
  }

  async function refresh() {
    setBusy(true);
    try {
      router.refresh();
    } finally {
      window.setTimeout(() => setBusy(false), 250);
    }
  }

  async function assignRemediation(assignment: AssignmentRecommendation) {
    setAssigningTitle(assignment.title);
    setAssignmentError(null);
    try {
      const response = await fetch("/api/admin/educator/remediation-assignments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          title: assignment.title,
          topic: assignment.topic,
          pathwayId: d?.query.pathwayId ?? null,
          priorityScore: assignment.priority === "critical" ? 95 : assignment.priority === "high" ? 82 : 68,
          dueDays: assignment.priority === "critical" ? 0 : 1,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { assignedCount?: number; error?: string } | null;
      if (!response.ok || !payload) {
        throw new Error(payload?.error ?? "Unable to assign remediation.");
      }
      const label = `${assignment.title} · ${payload.assignedCount ?? 0} learner${
        payload.assignedCount === 1 ? "" : "s"
      }`;
      setAssignmentLog((existing) => [label, ...existing.filter((x) => x !== label)].slice(0, 6));
      router.refresh();
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : "Unable to assign remediation.");
    } finally {
      setAssigningTitle(null);
    }
  }

  if (!d) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold">Educator analytics unavailable</p>
        <p className="mt-2 text-muted-foreground">
          The database is not configured or the runtime is in safe mode. Check{" "}
          <Link href="/admin/operations" className="underline">
            Operations
          </Link>
          .
        </p>
      </div>
    );
  }

  const overview = d.overview;
  const confidenceTotal =
    d.confidenceCalibration.highConfidenceWrong +
    d.confidenceCalibration.lowConfidenceWrong +
    d.confidenceCalibration.unsureOrGuessingWrong +
    d.confidenceCalibration.confidenceMissing;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <label className="text-xs font-medium text-muted-foreground">
              From
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                value={form.fromDay}
                onChange={(event) => setForm((f) => ({ ...f, fromDay: event.target.value }))}
              />
            </label>
            <label className="text-xs font-medium text-muted-foreground">
              To
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                value={form.toDay}
                onChange={(event) => setForm((f) => ({ ...f, toDay: event.target.value }))}
              />
            </label>
            <label className="min-w-[16rem] text-xs font-medium text-muted-foreground">
              Pathway filter
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                placeholder="us-rn-nclex-rn, ca-rpn-rex-pn..."
                value={form.pathwayId}
                onChange={(event) => setForm((f) => ({ ...f, pathwayId: event.target.value }))}
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              disabled={pending}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </button>
            <button
              type="button"
              onClick={refresh}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Window {d.query.fromDay} → {d.query.toDay}
          {d.query.pathwayId ? ` · pathway ${d.query.pathwayId}` : " · all pathways"} · generated{" "}
          {new Date(d.generatedAt).toLocaleString()}
        </p>
      </div>

      {d.warnings.length ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold">Partial data</p>
          <ul className="mt-2 list-inside list-disc text-muted-foreground">
            {d.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Active learners" value={overview.activeLearners.toLocaleString()} detail="Answered questions in window" tone="info" />
        <MetricCard label="Question attempts" value={overview.questionAttempts.toLocaleString()} detail="Practice, CAT, quiz, remediation" />
        <MetricCard label="Avg accuracy" value={overview.avgAccuracyPct != null ? `${overview.avgAccuracyPct}%` : "—"} detail="Persisted answer attempts" tone={overview.avgAccuracyPct != null && overview.avgAccuracyPct < 65 ? "risk" : "success"} />
        <MetricCard label="Readiness" value={overview.avgReadinessScore != null ? `${overview.avgReadinessScore}%` : "—"} detail="Average learner profile score" />
        <MetricCard label="Safety signals" value={overview.highRiskRemediationEvents.toLocaleString()} detail="Safety, priority, pharm, delegation" tone="risk" />
        <MetricCard label="Open remediation" value={overview.unresolvedRemediationItems.toLocaleString()} detail="Unresolved queue items" tone="risk" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Section
          title="Class-wide weaknesses"
          subtitle="Lowest-performing topic clusters with learner counts and NCLEX risk domain mapping."
          icon={Target}
        >
          <div className="grid gap-3 lg:grid-cols-2">
            {d.classWeaknesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No topic weakness data in this window.</p>
            ) : (
              d.classWeaknesses.slice(0, 12).map((row) => (
                <WeaknessRow
                  key={row.topic}
                  label={row.topic}
                  sublabel={`${row.riskDomain} · ${row.learnerCount} learner${row.learnerCount === 1 ? "" : "s"}`}
                  pct={row.accuracyPct}
                  trailing={`${row.accuracyPct}% · ${row.attempts} att`}
                />
              ))
            )}
          </div>
        </Section>

        <Section
          title="Unsafe reasoning trends"
          subtitle="Mistake taxonomy from remediation captures, grouped for educator intervention."
          icon={ShieldAlert}
        >
          <div className="space-y-3">
            {d.unsafeReasoningTrends.length === 0 ? (
              <p className="text-sm text-muted-foreground">No captured remediation events in this window.</p>
            ) : (
              d.unsafeReasoningTrends.map((trend) => (
                <div key={trend.mistakeType} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold capitalize text-[var(--theme-heading-text)]">
                      {trend.mistakeType.replace(/_/g, " ")}
                    </p>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {trend.events} events · {trend.learners} learners
                    </span>
                  </div>
                  {trend.topTopic ? <p className="mt-1 text-xs text-muted-foreground">Top topic: {trend.topTopic}</p> : null}
                  <p className="mt-2 text-sm text-muted-foreground">{trend.educatorAction}</p>
                </div>
              ))
            )}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section title="Pharmacology gaps" subtitle="Medication safety topics needing reinforcement." icon={BookOpenCheck}>
          <div className="space-y-3">
            {d.pharmacologyGaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pharmacology-specific weak topics detected.</p>
            ) : (
              d.pharmacologyGaps.map((row) => (
                <WeaknessRow
                  key={row.topic}
                  label={row.topic}
                  sublabel={`${row.wrongCount} wrong answers · ${row.learnerCount} learners`}
                  pct={row.accuracyPct}
                  trailing={`${row.accuracyPct}%`}
                />
              ))
            )}
          </div>
        </Section>

        <Section title="Delegation issues" subtitle="Scope and assignment signals." icon={Users}>
          <div className="space-y-3">
            {d.delegationIssues.length === 0 ? (
              <p className="text-sm text-muted-foreground">No delegation-specific remediation events detected.</p>
            ) : (
              d.delegationIssues.map((row) => (
                <div key={row.topic} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                  <p className="font-semibold text-[var(--theme-heading-text)]">{row.topic}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {row.events} events across {row.learners} learner{row.learners === 1 ? "" : "s"}
                  </p>
                </div>
              ))
            )}
          </div>
        </Section>

        <Section title="Confidence calibration" subtitle={d.confidenceCalibration.note} icon={AlertTriangle}>
          <div className="space-y-3">
            {[
              ["High confidence + wrong", d.confidenceCalibration.highConfidenceWrong, "Dangerous misconception risk"],
              ["Low confidence + wrong", d.confidenceCalibration.lowConfidenceWrong, "Knowledge gap"],
              ["Unsure/guessing + wrong", d.confidenceCalibration.unsureOrGuessingWrong, "Confidence building needed"],
              ["Missing confidence", d.confidenceCalibration.confidenceMissing, "Older or untracked surfaces"],
            ].map(([label, value, detail]) => {
              const count = Number(value);
              const pct = confidenceTotal > 0 ? Math.round((count / confidenceTotal) * 100) : 0;
              return (
                <WeaknessRow key={String(label)} label={String(label)} sublabel={String(detail)} pct={pct} trailing={`${count} events`} />
              );
            })}
          </div>
        </Section>
      </div>

      <Section
        title="High-risk NCLEX domains"
        subtitle="Domains where unsafe patterns should trigger instructor review or required remediation."
        icon={ClipboardList}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {d.highRiskDomains.length === 0 ? (
            <p className="text-sm text-muted-foreground">No high-risk domain events detected.</p>
          ) : (
            d.highRiskDomains.map((domain) => (
              <div key={domain.domain} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-[var(--theme-heading-text)]">{domain.domain}</p>
                  <span className="rounded-full bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-700">
                    {domain.eventCount}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{domain.recommendedRemediation}</p>
                <p className="mt-3 text-xs text-muted-foreground">{domain.learnerCount} affected learners</p>
              </div>
            ))
          )}
        </div>
      </Section>

      <Section
        title="Assignment recommendations"
        subtitle="Assign targeted remediation into learner queues based on active weak-topic and safety signals."
        icon={GraduationCap}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {d.assignmentRecommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations yet. More learner activity will create targeted assignments.</p>
          ) : (
            d.assignmentRecommendations.map((assignment) => (
              <div key={`${assignment.title}-${assignment.reason}`} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--theme-heading-text)]">{assignment.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{assignment.audience}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${priorityClass(assignment.priority)}`}>
                    {assignment.priority}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{assignment.reason}</p>
                <p className="mt-2 text-sm">{assignment.suggestedActivity}</p>
                <button
                  type="button"
                  onClick={() => assignRemediation(assignment)}
                  disabled={assigningTitle === assignment.title}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {assigningTitle === assignment.title ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Assign remediation
                </button>
              </div>
            ))
          )}
        </div>
        {assignmentError ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700">
            {assignmentError}
          </div>
        ) : null}
        {assignmentLog.length ? (
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
            <p className="text-sm font-semibold">Assigned remediation</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              {assignmentLog.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section
        title="Struggling learners"
        subtitle="Early warning roster based on readiness, incorrect balance, and unresolved remediation load."
        icon={Users}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3">Learner</th>
                <th className="py-2 pr-3">Tier</th>
                <th className="py-2 pr-3">Readiness</th>
                <th className="py-2 pr-3">Accuracy</th>
                <th className="py-2 pr-3">Open remediation</th>
                <th className="py-2 pr-3">Last active</th>
                <th className="py-2 pr-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {d.strugglingLearners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-muted-foreground">
                    No struggling learners matched the current criteria.
                  </td>
                </tr>
              ) : (
                d.strugglingLearners.map((learner) => (
                  <tr key={learner.userId} className="border-b border-border/40">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-[var(--theme-heading-text)]">{learner.name ?? "Unnamed learner"}</p>
                      <p className="text-xs text-muted-foreground">{learner.email}</p>
                    </td>
                    <td className="py-3 pr-3 text-xs">
                      {learner.country} · {learner.tier}
                    </td>
                    <td className="py-3 pr-3 tabular-nums">
                      {learner.readinessScore != null ? `${learner.readinessScore}%` : "—"}
                      {learner.readinessLevel ? <p className="text-xs text-muted-foreground">{learner.readinessLevel}</p> : null}
                    </td>
                    <td className="py-3 pr-3 tabular-nums">
                      {learner.accuracyPct != null ? `${learner.accuracyPct}%` : "—"}
                      <p className="text-xs text-muted-foreground">{learner.totalQuestions} questions</p>
                    </td>
                    <td className="py-3 pr-3 tabular-nums">{learner.openRemediationItems}</td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground">
                      {learner.lastActiveAt ? new Date(learner.lastActiveAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 pr-3">
                      <Link href={`/admin/users/${learner.userId}`} className="font-semibold text-primary underline">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Data notes" icon={BookOpenCheck}>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {d.dataNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
