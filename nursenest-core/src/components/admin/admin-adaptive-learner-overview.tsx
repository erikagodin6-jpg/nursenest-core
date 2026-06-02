import type { ReactNode } from "react";
import type { AdaptiveLearnerAdminSummary } from "@/lib/admin/adaptive-learner-summary.server";

function EmptyP({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm text-muted-foreground">{children}</p>;
}

export function AdminAdaptiveLearnerOverview({ data }: { data: AdaptiveLearnerAdminSummary | null }) {
  if (!data) {
    return (
      <section className="mt-6 nn-card border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Study &amp; adaptive visibility</h2>
        <EmptyP>Summary unavailable (database or learner not loaded).</EmptyP>
      </section>
    );
  }

  const e = data.subscriptionAccess.entitlement;

  return (
    <div className="mt-6 space-y-6">
      <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What this learner is studying</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Target pathway</dt>
            <dd className="font-medium">{data.studying.targetPathwayLabel ?? data.studying.targetExamPathwayId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Learner path</dt>
            <dd>{data.studying.learnerPath ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Exam focus</dt>
            <dd>{data.studying.examFocus ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Study goal / cadence</dt>
            <dd>
              {data.studying.studyGoal ?? "—"}
              {data.studying.dailyStudyMinutes != null ? ` · ${data.studying.dailyStudyMinutes} min/day` : ""}
              {data.studying.studyCadencePreference ? ` · ${data.studying.studyCadencePreference}` : ""}
            </dd>
          </div>
        </dl>
      </section>

      <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Subscription and access</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-muted-foreground">Paid subscription (ACTIVE / GRACE)</dt>
            <dd className="font-medium">{data.subscriptionAccess.paidSubscriptionActive ? "Yes" : "No"}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-muted-foreground">Effective access</dt>
            <dd className="font-medium">{e.hasAccess ? "Yes" : "No"}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-muted-foreground">Entitlement reason</dt>
            <dd>{e.reason}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-muted-foreground">Tier / country (resolved)</dt>
            <dd>
              {e.tier ?? "—"} · {e.country ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Weakest topics (aggregates only)</h2>
        {data.weakestTopics.length === 0 ? (
          <EmptyP>No topic-level stats yet.</EmptyP>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 text-left">Topic</th>
                  <th className="py-2 text-right">Accuracy %</th>
                  <th className="py-2 text-right">Wrong</th>
                  <th className="py-2 text-right">Streak</th>
                  <th className="py-2 text-left">Last attempt</th>
                </tr>
              </thead>
              <tbody>
                {data.weakestTopics.map((t) => (
                  <tr key={t.topic} className="border-b border-border/50">
                    <td className="py-2 pr-2">{t.topic}</td>
                    <td className="py-2 text-right tabular-nums">{t.accuracyPct != null ? `${t.accuracyPct}%` : "—"}</td>
                    <td className="py-2 text-right tabular-nums">{t.wrongCount}</td>
                    <td className="py-2 text-right tabular-nums">{t.wrongStreak}</td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {t.lastAttemptAt ? new Date(t.lastAttemptAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recommended next steps</h2>
        {data.recommendedNextSteps.length === 0 ? (
          <EmptyP>No automated suggestions — insufficient context.</EmptyP>
        ) : (
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {data.recommendedNextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent activity</h2>
        {data.recentActivity.length === 0 ? (
          <EmptyP>No recent progress, tests, or flashcard sessions in the bounded window.</EmptyP>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.recentActivity.map((a, i) => (
              <li key={`${a.kind}-${i}`} className="border-b border-border/40 pb-2">
                <span className="font-medium capitalize">{a.kind.replace(/_/g, " ")}</span> — {a.label}
                <span className="ml-2 text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!data.adaptivePanel.visible ? (
        <section className="nn-card border border-border/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Adaptive recommendations</h2>
          <EmptyP>
            Adaptive admin panel is off (`ADAPTIVE_LEARNING_ENABLED`). Enable the flag to show readiness and generation
            eligibility.
          </EmptyP>
        </section>
      ) : !data.adaptivePanel.sufficientSignals ? (
        <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Adaptive recommendations</h2>
          <EmptyP>Not enough practice, topic stats, or CAT snapshot data to evaluate adaptive generation yet.</EmptyP>
          <p className="mt-2 text-xs text-muted-foreground">
            System bands (non-clinical):{" "}
            {data.adaptivePanel.systemSummary.hasMeaningfulPracticeHistory
              ? "some CAT dimension signal"
              : "insufficient CAT profile"}
          </p>
        </section>
      ) : (
        <section className="nn-card border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Adaptive recommendations</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <dt className="text-muted-foreground">Can generate (pathway + access + signals)</dt>
              <dd className="font-medium">{data.adaptivePanel.canGenerateRecommendations ? "Yes" : "No"}</dd>
            </div>
            {data.adaptivePanel.readinessScore != null ? (
              <div className="flex flex-wrap justify-between gap-4">
                <dt className="text-muted-foreground">Last snapshot readiness</dt>
                <dd>
                  {data.adaptivePanel.readinessScore} ({data.adaptivePanel.readinessBand ?? "—"})
                </dd>
              </div>
            ) : null}
            {data.adaptivePanel.nextFocusAreas.length > 0 ? (
              <div>
                <dt className="text-muted-foreground">Snapshot focus areas</dt>
                <dd className="mt-1">{data.adaptivePanel.nextFocusAreas.slice(0, 5).join(" · ")}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Weaker systems (bands)</p>
              <ul className="mt-2 space-y-1 text-sm">
                {data.adaptivePanel.systemSummary.weakestSystems.length === 0 ? (
                  <li className="text-muted-foreground">—</li>
                ) : (
                  data.adaptivePanel.systemSummary.weakestSystems.map((s) => (
                    <li key={s.systemTag}>
                      {s.systemTag}{" "}
                      <span className="text-muted-foreground">
                        ({s.band}
                        {s.recentAccuracyPct != null ? ` · ${s.recentAccuracyPct}%` : ""})
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Stronger systems (bands)</p>
              <ul className="mt-2 space-y-1 text-sm">
                {data.adaptivePanel.systemSummary.strongestSystems.length === 0 ? (
                  <li className="text-muted-foreground">—</li>
                ) : (
                  data.adaptivePanel.systemSummary.strongestSystems.map((s) => (
                    <li key={s.systemTag}>
                      {s.systemTag}{" "}
                      <span className="text-muted-foreground">
                        ({s.band}
                        {s.recentAccuracyPct != null ? ` · ${s.recentAccuracyPct}%` : ""})
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
