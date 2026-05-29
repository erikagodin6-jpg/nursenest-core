"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserMinus,
  Users,
} from "lucide-react";
import {
  INSTITUTION_TYPES,
  institutionTypeLabel,
  type InstitutionalDashboardData,
} from "@/lib/institutional/licensing-types";
import { Progress } from "@/components/ui/progress";

type Props = {
  data: InstitutionalDashboardData | null;
  selectedOrganizationId: string | null;
  canMutate: boolean;
};

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-[var(--theme-card-bg)] p-8 text-center">
      <Building2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
      <h2 className="mt-4 text-xl font-semibold text-[var(--theme-heading-text)]">No institutional licenses yet</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
        Create the first organization when a school, hospital, residency program, or health system is ready to manage
        NurseNest seats. This screen only reports persisted institutional rows; it does not use demo data.
      </p>
    </div>
  );
}

async function postJson(url: string, method: "POST" | "PATCH", body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || payload?.ok === false) throw new Error(payload?.error ?? "Request failed.");
  return payload;
}

export function InstitutionalLicensingDashboard({ data, selectedOrganizationId, canMutate }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newOrg, setNewOrg] = useState({ name: "", type: "nursing_school", seatCap: "25", renewalAt: "" });
  const [license, setLicense] = useState({ seatCap: "", renewalAt: "", status: "active", stripeCustomerId: "", stripeSubscriptionId: "" });
  const [seat, setSeat] = useState({ email: "", role: "learner" });

  const selected = data?.selectedOrganization ?? null;
  const selectedHref = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedOrganizationId) params.set("organizationId", selectedOrganizationId);
    return `/admin/institutions${params.size ? `?${params.toString()}` : ""}`;
  }, [selectedOrganizationId]);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function run(label: string, action: () => Promise<void>) {
    setBusyLabel(label);
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(label);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The institutional action failed.");
    } finally {
      setBusyLabel(null);
    }
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">Institutional licensing tables are not available</p>
        <p className="mt-2 text-muted-foreground">
          Apply the institutional licensing migration before using seat management. The admin route is live, but it will
          not synthesize institution data until the database is ready.
        </p>
      </div>
    );
  }

  const utilizationPct = selected && selected.seatCap > 0 ? Math.round((selected.assignedSeats / selected.seatCap) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Institutions" value={String(data.totals.organizations)} detail="Active licensing accounts." />
        <StatCard
          label="Seats"
          value={`${data.totals.seatsAssigned}/${data.totals.seatsPurchased}`}
          detail={`${data.totals.seatsAvailable} seats available.`}
        />
        <StatCard
          label="Readiness"
          value={data.totals.avgReadinessScore == null ? "—" : `${data.totals.avgReadinessScore}%`}
          detail="Average institutional learner readiness."
        />
        <StatCard
          label="Active 7d"
          value={String(data.totals.activeLearners7d)}
          detail="Learners with recorded study activity."
        />
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <aside className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Organizations</h2>
              <p className="text-sm text-muted-foreground">Seat licenses by institution.</p>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={pending}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted/50"
              aria-label="Refresh institutions"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          </div>

          {data.organizations.length === 0 ? (
            <div className="mt-5">
              <EmptyState />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {data.organizations.map((org) => {
                const active = selected?.id === org.id;
                return (
                  <Link
                    key={org.id}
                    href={`/admin/institutions?organizationId=${org.id}`}
                    className={`block rounded-xl border p-3 transition ${
                      active
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/60 bg-muted/20 hover:border-primary/25 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--theme-heading-text)]">{org.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{institutionTypeLabel(org.type)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200">
                        {org.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>Seats</span>
                        <span>{org.assignedSeats}/{org.seatCap}</span>
                      </div>
                      <Progress value={org.seatCap > 0 ? (org.assignedSeats / org.seatCap) * 100 : 0} className="h-2" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {canMutate ? (
            <form
              className="mt-5 space-y-3 rounded-xl border border-border/70 bg-background/60 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run("Institution created", async () => {
                  await postJson("/api/admin/institutions", "POST", newOrg);
                  setNewOrg({ name: "", type: "nursing_school", seatCap: "25", renewalAt: "" });
                });
              }}
            >
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Create institution</h3>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Institution name"
                value={newOrg.name}
                onChange={(event) => setNewOrg((v) => ({ ...v, name: event.target.value }))}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={newOrg.type}
                  onChange={(event) => setNewOrg((v) => ({ ...v, type: event.target.value }))}
                >
                  {INSTITUTION_TYPES.map((type) => (
                    <option key={type} value={type}>{institutionTypeLabel(type)}</option>
                  ))}
                </select>
                <input
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  type="number"
                  min="0"
                  placeholder="Seats"
                  value={newOrg.seatCap}
                  onChange={(event) => setNewOrg((v) => ({ ...v, seatCap: event.target.value }))}
                />
              </div>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                type="date"
                value={newOrg.renewalAt}
                onChange={(event) => setNewOrg((v) => ({ ...v, renewalAt: event.target.value }))}
              />
              <button
                type="submit"
                disabled={Boolean(busyLabel)}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                {busyLabel === "Institution created" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create licensing account"}
              </button>
            </form>
          ) : null}
        </aside>

        <div className="space-y-6">
          {!selected ? (
            <EmptyState />
          ) : (
            <>
              <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Institution</p>
                    <h2 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">{selected.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {institutionTypeLabel(selected.type)} · {selected.primaryTimezone ?? "UTC"} ·{" "}
                      {selected.renewalAt ? `renews ${new Date(selected.renewalAt).toLocaleDateString()}` : "renewal date not set"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                      <Users className="h-4 w-4 text-primary" />
                      <p className="mt-2 font-semibold">{selected.learnerCount}</p>
                      <p className="text-xs text-muted-foreground">Learners</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <p className="mt-2 font-semibold">{selected.facultyCount}</p>
                      <p className="text-xs text-muted-foreground">Faculty</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <p className="mt-2 font-semibold">{selected.avgReadinessScore == null ? "—" : `${selected.avgReadinessScore}%`}</p>
                      <p className="text-xs text-muted-foreground">Readiness</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                      <CalendarClock className="h-4 w-4 text-primary" />
                      <p className="mt-2 font-semibold">{selected.activeLearners7d}</p>
                      <p className="text-xs text-muted-foreground">Active 7d</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-[var(--theme-heading-text)]">Seat utilization</span>
                    <span className="tabular-nums text-muted-foreground">{selected.assignedSeats}/{selected.seatCap} seats</span>
                  </div>
                  <Progress value={utilizationPct} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selected.availableSeats} seats available. Learner memberships consume seats; faculty and institutional admins do not.
                  </p>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                {canMutate ? (
                  <>
                    <form
                      className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void run("License updated", async () => {
                          await postJson(`/api/admin/institutions/${selected.id}/license`, "PATCH", license);
                        });
                      }}
                    >
                      <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Purchase / renew seats</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Update the institutional license mirror after Stripe seat purchase or renewal.</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" type="number" min="0" placeholder={`Seats (${selected.seatCap})`} value={license.seatCap} onChange={(event) => setLicense((v) => ({ ...v, seatCap: event.target.value }))} />
                        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={license.status} onChange={(event) => setLicense((v) => ({ ...v, status: event.target.value }))}>
                          {["active", "trial", "past_due", "suspended", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" type="date" value={license.renewalAt} onChange={(event) => setLicense((v) => ({ ...v, renewalAt: event.target.value }))} />
                        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Stripe customer ID" value={license.stripeCustomerId} onChange={(event) => setLicense((v) => ({ ...v, stripeCustomerId: event.target.value }))} />
                        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" placeholder="Stripe subscription ID" value={license.stripeSubscriptionId} onChange={(event) => setLicense((v) => ({ ...v, stripeSubscriptionId: event.target.value }))} />
                      </div>
                      <button type="submit" disabled={Boolean(busyLabel)} className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        {busyLabel === "License updated" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update license"}
                      </button>
                    </form>

                    <form
                      className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void run("Seat assignment updated", async () => {
                          await postJson(`/api/admin/institutions/${selected.id}/seats`, "POST", seat);
                          setSeat({ email: "", role: "learner" });
                        });
                      }}
                    >
                      <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Assign seats</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Assign an existing NurseNest account as learner, faculty, or institution admin.</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem]">
                        <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" type="email" placeholder="user@example.com" value={seat.email} onChange={(event) => setSeat((v) => ({ ...v, email: event.target.value }))} />
                        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={seat.role} onChange={(event) => setSeat((v) => ({ ...v, role: event.target.value }))}>
                          <option value="learner">Learner seat</option>
                          <option value="faculty">Faculty</option>
                          <option value="institution_admin">Institution admin</option>
                        </select>
                      </div>
                      <button type="submit" disabled={Boolean(busyLabel)} className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        {busyLabel === "Seat assignment updated" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign account"}
                      </button>
                    </form>
                  </>
                ) : null}
              </section>

              <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Faculty dashboard</h3>
                    <p className="text-sm text-muted-foreground">Readiness, weak areas, CAT performance, lessons, flashcards, and clinical skills by learner.</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div className="mt-4 overflow-auto">
                  <table className="w-full min-w-[920px] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="py-2">Learner</th>
                        <th className="py-2">Pathway</th>
                        <th className="py-2">Readiness</th>
                        <th className="py-2">Weak areas</th>
                        <th className="py-2">CAT</th>
                        <th className="py-2">Lessons</th>
                        <th className="py-2">Flashcards</th>
                        <th className="py-2">Clinical skills</th>
                        <th className="py-2">Last active</th>
                        {canMutate ? <th className="py-2">Seat</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {data.learners.map((learner) => (
                        <tr key={learner.userId} className="border-b border-border/50 align-top">
                          <td className="py-3">
                            <p className="font-medium text-[var(--theme-heading-text)]">{learner.name ?? "Unnamed learner"}</p>
                            <p className="font-mono text-xs text-muted-foreground">{learner.email}</p>
                          </td>
                          <td className="py-3">{learner.learnerPath ?? learner.tier}</td>
                          <td className="py-3 tabular-nums">{learner.readinessScore == null ? "—" : `${learner.readinessScore}%`}<br /><span className="text-xs text-muted-foreground">{learner.readinessLevel ?? "not enough data"}</span></td>
                          <td className="py-3">{learner.weakAreas.length ? learner.weakAreas.join(", ") : "—"}</td>
                          <td className="py-3 tabular-nums">{learner.catCompleted}</td>
                          <td className="py-3 tabular-nums">{learner.lessonsCompleted}</td>
                          <td className="py-3 tabular-nums">{learner.flashcardsCompleted}</td>
                          <td className="py-3 tabular-nums">{learner.clinicalSkillsActivity}</td>
                          <td className="py-3 text-xs">{learner.lastActiveAt ? new Date(learner.lastActiveAt).toLocaleString() : "—"}</td>
                          {canMutate ? (
                            <td className="py-3">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-200"
                                onClick={() => void run("Seat removed", async () => {
                                  await postJson(`/api/admin/institutions/${selected.id}/seats`, "POST", { action: "remove", userId: learner.userId });
                                })}
                              >
                                <UserMinus className="h-3.5 w-3.5" /> Remove
                              </button>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.learners.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No active learner seats are assigned to this institution.</p>
                  ) : null}
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Cohort reporting</h3>
                  <div className="mt-4 space-y-3">
                    {data.cohorts.map((cohort) => (
                      <div key={cohort.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                        <div className="flex justify-between gap-3">
                          <p className="font-medium text-[var(--theme-heading-text)]">{cohort.name}</p>
                          <span className="text-xs text-muted-foreground">{cohort.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{cohort.learnerCount} learners · readiness {cohort.avgReadinessScore == null ? "—" : `${cohort.avgReadinessScore}%`} · completion {cohort.completionRatePct == null ? "—" : `${cohort.completionRatePct}%`}</p>
                      </div>
                    ))}
                    {data.cohorts.length === 0 ? <p className="text-sm text-muted-foreground">No cohorts have been created for this institution.</p> : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">License events</h3>
                  <div className="mt-4 space-y-3">
                    {data.recentEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                        <div>
                          <p className="text-sm font-medium text-[var(--theme-heading-text)]">{event.eventType.replace(/_/g, " ")}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()} · seat delta {event.seatDelta ?? "—"}</p>
                        </div>
                      </div>
                    ))}
                    {data.recentEvents.length === 0 ? <p className="text-sm text-muted-foreground">No license events recorded yet.</p> : null}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Generated {new Date(data.generatedAt).toLocaleString()} · <Link href={selectedHref} className="underline">permalink</Link>
      </p>
    </div>
  );
}
