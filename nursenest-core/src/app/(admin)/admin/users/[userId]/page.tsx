import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminUserSupportDetail } from "@/lib/admin/load-admin-user-support-detail";

export const dynamic = "force-dynamic";

function isLikelyCuid(id: string): boolean {
  return /^c[a-z0-9]{8,}$/i.test(id);
}

export default async function AdminUserSupportDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  await requireAdmin();
  const { userId } = await params;
  if (!isLikelyCuid(userId)) {
    notFound();
  }

  const data = await loadAdminUserSupportDetail(userId);
  if (!data.found) {
    notFound();
  }

  const d = data;
  const u = d.user;

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · User support</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">{u.name}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{u.id}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/users" className="text-primary underline">
            ← User search
          </Link>
          <Link href="/admin" className="text-muted-foreground underline">
            Overview
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
        <strong>Support view</strong> — read-only troubleshooting data. No password resets or subscription changes here.
        Use Stripe Dashboard or your documented admin runbooks for destructive or billing actions.
      </div>

      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
        {d.supportNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="nn-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-mono text-xs break-all">{u.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Username</dt>
              <dd>{u.username ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Role</dt>
              <dd>{u.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Country / tier</dt>
              <dd>
                {u.country} · {u.tier}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="text-xs">{new Date(u.createdAt).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="text-xs">{new Date(u.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="nn-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Entitlement (computed)</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Access</dt>
              <dd>{d.entitlement.hasAccess ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Reason</dt>
              <dd>{d.entitlement.reason}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Effective tier / country</dt>
              <dd>
                {d.entitlement.tier ?? "—"} · {d.entitlement.country ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pathway &amp; goals</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Target pathway</dt>
            <dd className="font-medium">{u.targetPathwayLabel ?? u.targetExamPathwayId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Learner path</dt>
            <dd>{u.learnerPath ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Exam focus</dt>
            <dd>{u.examFocus ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Allied profession</dt>
            <dd>{u.alliedProfessionKey ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Study goal / cadence</dt>
            <dd>
              {u.studyGoal ?? "—"} {u.dailyStudyMinutes != null ? `· ${u.dailyStudyMinutes} min/day` : ""}{" "}
              {u.studyCadencePreference ? `· ${u.studyCadencePreference}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Exam date</dt>
            <dd>{u.examDate ? new Date(u.examDate).toLocaleDateString() : "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Trial &amp; free tier usage</h2>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Trial</dt>
            <dd>
              {u.trialStatus}
              {u.trialEndsAt ? ` · ends ${new Date(u.trialEndsAt).toLocaleString()}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Free views</dt>
            <dd>
              Questions {u.freeQuestionViews} · Lessons {u.freeLessonOpens}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Subscriptions (masked)</h2>
        {d.subscriptions.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No subscription rows.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Plan</th>
                  <th className="py-2 pr-2">Stripe (masked)</th>
                  <th className="py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {d.subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="py-2 pr-2">{s.status}</td>
                    <td className="py-2 pr-2">
                      {s.planTier ?? "—"} / {s.planCountry ?? "—"}
                    </td>
                    <td className="py-2 pr-2 font-mono text-xs">
                      cust {s.stripeCustomerMasked ?? "—"} · sub {s.stripeSubscriptionMasked ?? "—"}
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">{new Date(s.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account safety (non-secret)</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          <li>Password set: {d.accountSafety.hasPassword ? "yes" : "no (OAuth / magic link only?)"}</li>
          <li>Credential version: {d.accountSafety.credentialVersion}</li>
          <li>Active password reset tokens: {d.accountSafety.activePasswordResetTokens}</li>
          <li>Trial device bindings: {d.accountSafety.trialDeviceBindings}</li>
        </ul>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Usage summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Exam attempts (all)</p>
            <p className="text-2xl font-bold tabular-nums">{d.usage.examAttempts}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Exam sessions</p>
            <p className="text-2xl font-bold tabular-nums">{d.usage.examSessions}</p>
            <p className="text-xs text-muted-foreground">With adaptive state: {d.usage.examSessionsWithAdaptiveState}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Practice tests</p>
            <p className="text-2xl font-bold tabular-nums">{d.usage.practiceTests}</p>
            <p className="text-xs text-muted-foreground">CAT-like (adaptive JSON): {d.usage.practiceTestsWithAdaptiveState}</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Lesson progress rows</p>
            <p className="text-2xl font-bold tabular-nums">{d.usage.progressRows}</p>
            <p className="text-xs text-muted-foreground">
              Completed {d.usage.progressCompleted} · engaged {d.usage.progressEngaged}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Flashcards</p>
            <p className="text-sm">
              Progress rows {d.usage.flashcardProgressRows} · study sessions {d.usage.flashcardStudySessions}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Topic stats / notes</p>
            <p className="text-sm">
              Topic rows {d.usage.topicStatRows} · learner notes {d.usage.learnerNotesCount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Topic performance (top)</h2>
        {d.topicTop.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No topic stats yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 text-left">Topic</th>
                  <th className="py-2 text-right">Correct</th>
                  <th className="py-2 text-right">Wrong</th>
                  <th className="py-2 text-left">Last attempt</th>
                </tr>
              </thead>
              <tbody>
                {d.topicTop.map((t) => (
                  <tr key={t.topic} className="border-b border-border/50">
                    <td className="py-2 pr-2">{t.topic}</td>
                    <td className="py-2 text-right tabular-nums">{t.correctCount}</td>
                    <td className="py-2 text-right tabular-nums">{t.wrongCount}</td>
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

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent exam attempts</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {d.recent.examAttempts.length === 0 ? (
              <li className="text-muted-foreground">None.</li>
            ) : (
              d.recent.examAttempts.map((a) => (
                <li key={a.id} className="border-b border-border/40 pb-2">
                  <span className="font-medium">{a.examTitle}</span> · {a.score}/{a.total} ·{" "}
                  <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="nn-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent practice tests</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {d.recent.practiceTests.length === 0 ? (
              <li className="text-muted-foreground">None.</li>
            ) : (
              d.recent.practiceTests.map((p) => (
                <li key={p.id} className="border-b border-border/40 pb-2">
                  {p.title ?? "(untitled)"} · {p.status}
                  {p.hasAdaptiveState ? " · adaptive/CAT" : ""} ·{" "}
                  <span className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent exam sessions</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {d.recent.examSessions.length === 0 ? (
            <li className="text-muted-foreground">None.</li>
          ) : (
            d.recent.examSessions.map((s) => (
              <li key={s.id} className="font-mono text-xs">
                {s.id.slice(0, 12)}… · mode {s.examMode} · {s.status}
                {s.hasAdaptiveState ? " · adaptive" : ""} · {new Date(s.updatedAt).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent lesson progress (app lessons)</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {d.recent.progress.length === 0 ? (
            <li className="text-muted-foreground">None.</li>
          ) : (
            d.recent.progress.map((p) => (
              <li key={`${p.lessonId}-${p.updatedAt}`} className="font-mono text-xs">
                {p.lessonId} · {p.completed ? "done" : "in progress"} · updated {new Date(p.updatedAt).toLocaleString()}
                {p.engagedAt ? ` · engaged ${new Date(p.engagedAt).toLocaleString()}` : ""}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Email notification log (recent kinds)</h2>
        <p className="mt-1 text-xs text-muted-foreground">Kinds only — no message bodies.</p>
        <ul className="mt-2 space-y-1 text-sm">
          {d.notifications.length === 0 ? (
            <li className="text-muted-foreground">None.</li>
          ) : (
            d.notifications.map((n, i) => (
              <li key={`${n.kind}-${i}`}>
                <span className="font-medium">{n.kind}</span> · {new Date(n.createdAt).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-6 nn-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Policies &amp; onboarding</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          <li>Onboarding completed: {u.onboardingCompletedAt ? new Date(u.onboardingCompletedAt).toLocaleString() : "—"}</li>
          <li>Baseline assessment: completed {u.baselineAssessmentCompletedAt ? "yes" : "no"} · skipped{" "}
            {u.baselineAssessmentSkippedAt ? new Date(u.baselineAssessmentSkippedAt).toLocaleString() : "—"}
          </li>
          <li>
            Legal policies: {u.legalPoliciesAcceptedAt ? new Date(u.legalPoliciesAcceptedAt).toLocaleString() : "—"}{" "}
            {u.legalPoliciesVersion ? `(v ${u.legalPoliciesVersion})` : ""}
          </li>
        </ul>
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        JSON:{" "}
        <Link className="text-primary underline" href={`/api/admin/users/${encodeURIComponent(u.id)}/support`}>
          /api/admin/users/…/support
        </Link>
      </p>
    </main>
  );
}
