import Link from "next/link";
import type { Prisma, UserFeedbackSeverity, UserFeedbackStatus } from "@prisma/client";
import { UserFeedbackCategory as CatEnum, UserFeedbackSeverity as SevEnum } from "@prisma/client";
import {
  adminFeedbackInboxHref,
} from "@/lib/admin/feedback-inbox-url";
import {
  labelCategory,
  labelStatus,
  severityChipClass,
  statusChipClass,
} from "@/lib/admin/feedback-inbox-labels";
import {
  clearUserFeedbackDuplicate,
  linkUserFeedbackDuplicate,
  saveUserFeedbackInternalNotes,
  updateUserFeedbackReportStatus,
} from "@/app/(admin)/admin/feedback/actions";
import { AdminFeedbackStatusForm } from "@/components/admin/admin-feedback-status-form";

const CATEGORY_LIST = Object.values(CatEnum);
const STATUS_LIST = Object.values(StatEnum);
const SEVERITY_LIST = Object.values(SevEnum);

type ListRow = Prisma.UserFeedbackReportGetPayload<{
  include: { user: { select: { id: true; email: true; name: true } } };
}>;

type DetailRow = Prisma.UserFeedbackReportGetPayload<{
  include: {
    user: { select: { id: true; email: true; name: true } };
    duplicateOf: { select: { id: true; summary: true; createdAt: true; status: true } };
    childDuplicates: { select: { id: true; summary: true; createdAt: true; status: true } };
  };
}>;

function parseEnum<T extends string>(raw: string | undefined, allowed: readonly T[]): T | null {
  if (!raw) return null;
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : null;
}

export function buildFeedbackWhere(sp: Record<string, string | undefined>): Prisma.UserFeedbackReportWhereInput {
  const where: Prisma.UserFeedbackReportWhereInput = {};
  const cat = parseEnum(sp.category, CATEGORY_LIST);
  if (cat) where.category = cat;
  const st = parseEnum(sp.status, STATUS_LIST);
  if (st) where.status = st;
  const sev = parseEnum(sp.severity, SEVERITY_LIST);
  if (sev) where.severity = sev;
  if (sp.userId?.trim()) {
    where.userId = sp.userId.trim();
  } else {
    const vis = sp.vis?.trim();
    if (vis === "anon") {
      where.userId = null;
    } else if (vis === "in" || sp.signedIn === "1") {
      where.userId = { not: null };
    }
  }
  const pageQ = sp.pageQ?.trim();
  if (pageQ) {
    where.OR = [
      { routeKey: { contains: pageQ, mode: "insensitive" } },
      { pageUrl: { contains: pageQ, mode: "insensitive" } },
    ];
  }
  return where;
}

function fmtWhen(d: Date): string {
  return d.toISOString().replace("T", " ").slice(0, 16);
}

function jsonBlock(label: string, value: unknown) {
  if (value == null || (typeof value === "object" && value !== null && !Object.keys(value as object).length)) {
    return null;
  }
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <pre className="mt-2 max-h-48 overflow-auto text-[11px] leading-relaxed text-foreground/90">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function StatusPill({ status }: { status: UserFeedbackStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight ${statusChipClass(status)}`}
    >
      {labelStatus(status)}
    </span>
  );
}

function SeverityPill({ severity }: { severity: UserFeedbackSeverity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight ${severityChipClass(severity)}`}
    >
      {severity}
    </span>
  );
}

export function AdminFeedbackInboxView({
  sp,
  page,
  pageSize,
  total,
  rows,
  selected,
}: {
  sp: Record<string, string | undefined>;
  page: number;
  pageSize: number;
  total: number;
  rows: ListRow[];
  selected: DetailRow | null;
}) {
  const selectedId = sp.r?.trim() ?? "";
  const skip = (page - 1) * pageSize;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = skip + rows.length < total ? page + 1 : null;

  const statusPills: { key: UserFeedbackStatus; label: string }[] = [
    { key: "NEW", label: "New" },
    { key: "UNDER_REVIEW", label: "Under review" },
    { key: "FIXED", label: "Fixed" },
    { key: "DISMISSED", label: "Dismissed" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Operations</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Feedback inbox</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Bug reports, content issues, and product signals from learners and marketing. Triage with status and internal
            notes; link duplicates to a canonical thread. Ready to join PostHog / session exports by user id and
            timestamp.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex min-h-[40px] items-center rounded-xl border border-border/80 bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:bg-muted/30"
        >
          Admin home
        </Link>
      </header>

      {/* Filters */}
      <section className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-gradient-to-br from-card/90 via-card/60 to-muted/15 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">Status</h2>
          <span className="text-xs text-muted-foreground">{total} reports</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={adminFeedbackInboxHref(sp, { status: null, p: null })}
            className={`inline-flex min-h-[36px] items-center rounded-full border px-3.5 text-xs font-semibold transition ${
              !sp.status ? "border-primary/40 bg-primary/10 text-foreground" : "border-border/80 bg-background/80 text-muted-foreground hover:border-border"
            }`}
          >
            All
          </Link>
          {statusPills.map(({ key, label }) => {
            const active = sp.status === key;
            return (
              <Link
                key={key}
                href={adminFeedbackInboxHref(sp, { status: active ? null : key, p: null })}
                className={`inline-flex min-h-[36px] items-center rounded-full border px-3.5 text-xs font-semibold transition ${
                  active ? "border-primary/40 bg-primary/10 text-foreground" : "border-border/80 bg-background/80 text-muted-foreground hover:border-primary/25"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <form method="get" className="grid gap-4 border-t border-border/50 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {sp.r ? <input type="hidden" name="r" value={sp.r} /> : null}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="fb-cat">
              Category
            </label>
            <select
              id="fb-cat"
              name="category"
              defaultValue={sp.category ?? ""}
              className="min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm shadow-sm"
            >
              <option value="">All types</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c} value={c}>
                  {labelCategory(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="fb-sev">
              Severity
            </label>
            <select
              id="fb-sev"
              name="severity"
              defaultValue={sp.severity ?? ""}
              className="min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm shadow-sm"
            >
              <option value="">All</option>
              {SEVERITY_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="fb-page">
              Page / route contains
            </label>
            <input
              id="fb-page"
              name="pageQ"
              defaultValue={sp.pageQ ?? ""}
              placeholder="/app/lessons/… or URL fragment"
              className="min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="fb-vis">
              Submitter
            </label>
            <select
              id="fb-vis"
              name="vis"
              defaultValue={sp.vis ?? (sp.signedIn === "1" ? "in" : "")}
              className="min-h-[42px] rounded-xl border border-border bg-background px-3 text-sm shadow-sm"
            >
              <option value="">Anyone</option>
              <option value="in">Signed-in</option>
              <option value="anon">Anonymous</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="fb-uid">
              User id
            </label>
            <input
              id="fb-uid"
              name="userId"
              defaultValue={sp.userId ?? ""}
              placeholder="Exact id…"
              className="min-h-[42px] rounded-xl border border-border bg-background px-3 font-mono text-xs shadow-sm"
            />
          </div>
          <div className="flex flex-wrap items-end gap-2 sm:col-span-2 xl:col-span-1">
            <button
              type="submit"
              className="min-h-[42px] rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              Apply
            </button>
            <Link
              href="/admin/feedback"
              className="inline-flex min-h-[42px] items-center rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted/40"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,520px)]">
        {/* List */}
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Queue</h2>
            <p className="text-xs text-muted-foreground">
              Page {page} · {rows.length} shown · newest first
            </p>
          </div>
          <ul className="space-y-3">
            {rows.map((r) => {
              const active = r.id === selectedId;
              return (
                <li key={r.id}>
                  <Link
                    href={adminFeedbackInboxHref(sp, { r: r.id })}
                    scroll={false}
                    className={`group block rounded-2xl border bg-card/80 p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md ${
                      active ? "border-primary/50 ring-2 ring-primary/20" : "border-border/70"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={r.status} />
                          <SeverityPill severity={r.severity} />
                          <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {labelCategory(r.category)}
                          </span>
                          {r.duplicateOfId ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Duplicate
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary">{r.summary}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                          <span>{fmtWhen(r.createdAt)}</span>
                          {r.pathwayId ? <span>Pathway · {r.pathwayId}</span> : null}
                          {r.user ? (
                            <span className="truncate" title={r.user.email}>
                              {r.user.email}
                            </span>
                          ) : (
                            <span>Anonymous</span>
                          )}
                        </div>
                        <p className="line-clamp-2 font-mono text-[11px] leading-relaxed text-muted-foreground/90">
                          {r.routeKey ?? r.pageUrl}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 px-6 py-14 text-center text-sm text-muted-foreground">
              No reports match these filters.
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 pt-2 text-sm font-semibold">
            {prevPage ? (
              <Link className="text-primary underline underline-offset-2" href={adminFeedbackInboxHref(sp, { p: String(prevPage) })}>
                Previous
              </Link>
            ) : null}
            {nextPage ? (
              <Link className="text-primary underline underline-offset-2" href={adminFeedbackInboxHref(sp, { p: String(nextPage) })}>
                Next
              </Link>
            ) : null}
          </div>
        </div>

        {/* Detail */}
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/10 p-5 shadow-md">
            {!selectedId ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Select a report from the queue to review details, metadata, and triage actions.
              </div>
            ) : !selected ? (
              <div className="py-12 text-center text-sm text-destructive">
                Report not found or no longer available.
                <div className="mt-4">
                  <Link href={adminFeedbackInboxHref(sp, { r: null })} className="font-semibold text-primary underline">
                    Clear selection
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={selected.status} />
                      <SeverityPill severity={selected.severity} />
                    </div>
                    <p className="text-base font-semibold leading-snug text-foreground">{selected.summary}</p>
                    <p className="text-xs text-muted-foreground">Submitted {fmtWhen(selected.createdAt)}</p>
                  </div>
                  <Link
                    href={adminFeedbackInboxHref(sp, { r: null })}
                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted/50"
                  >
                    Close
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={updateUserFeedbackReportStatus} className="inline">
                    <input type="hidden" name="reportId" value={selected.id} />
                    <input type="hidden" name="status" value="UNDER_REVIEW" />
                    <button
                      type="submit"
                      className="rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-950 hover:bg-sky-500/15 dark:text-sky-50"
                    >
                      Under review
                    </button>
                  </form>
                  <form action={updateUserFeedbackReportStatus} className="inline">
                    <input type="hidden" name="reportId" value={selected.id} />
                    <input type="hidden" name="status" value="FIXED" />
                    <button
                      type="submit"
                      className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-500/15 dark:text-emerald-50"
                    >
                      Mark fixed
                    </button>
                  </form>
                  <form action={updateUserFeedbackReportStatus} className="inline">
                    <input type="hidden" name="reportId" value={selected.id} />
                    <input type="hidden" name="status" value="DISMISSED" />
                    <button
                      type="submit"
                      className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/60"
                    >
                      Dismiss
                    </button>
                  </form>
                  <form action={updateUserFeedbackReportStatus} className="inline">
                    <input type="hidden" name="reportId" value={selected.id} />
                    <input type="hidden" name="status" value="NEW" />
                    <button
                      type="submit"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/30"
                    >
                      Re-open as new
                    </button>
                  </form>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <AdminFeedbackStatusForm reportId={selected.id} status={selected.status} />
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reporter</h3>
                  {selected.user ? (
                    <dl className="mt-3 space-y-2 text-sm">
                      <div>
                        <dt className="text-[11px] text-muted-foreground">Email</dt>
                        <dd className="break-all font-medium">{selected.user.email}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-muted-foreground">User id</dt>
                        <dd className="break-all font-mono text-xs">{selected.user.id}</dd>
                      </div>
                      {selected.user.name ? (
                        <div>
                          <dt className="text-[11px] text-muted-foreground">Name</dt>
                          <dd>{selected.user.name}</dd>
                        </div>
                      ) : null}
                      <div className="pt-2">
                        <Link
                          href={`/admin/users?q=${encodeURIComponent(selected.user.email)}`}
                          className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
                        >
                          Search in Users
                        </Link>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Anonymous session (no user id captured).</p>
                  )}
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    For session trails, correlate <span className="font-mono">userId</span> +{" "}
                    <span className="font-mono">createdAt</span> with PostHog or warehouse events (planned integration).
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Page</h3>
                  <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-foreground/90">{selected.routeKey ?? "—"}</p>
                  <a
                    href={selected.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Open submitted URL
                  </a>
                  {selected.pathwayId ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Pathway: <span className="font-medium text-foreground">{selected.pathwayId}</span>
                    </p>
                  ) : null}
                </div>

                {selected.details ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full message</h3>
                    <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-border/60 bg-background/80 p-3 text-sm leading-relaxed text-foreground">
                      {selected.details}
                    </div>
                  </div>
                ) : null}

                {selected.screenshotDataUrl ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Screenshot</h3>
                    <a
                      href={selected.screenshotDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block max-w-full overflow-hidden rounded-xl border border-border/70 bg-background"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- data URL from reporter */}
                      <img src={selected.screenshotDataUrl} alt="Reporter attachment" className="max-h-64 w-auto max-w-full object-contain" />
                    </a>
                  </div>
                ) : null}

                {jsonBlock("Exam context", selected.examContextJson)}
                {jsonBlock("Client metadata", selected.clientMetaJson)}
                {(selected.userAgent || selected.deviceHint) ? (
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-xs">
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">Device</p>
                    {selected.deviceHint ? <p className="mt-2 text-foreground/90">{selected.deviceHint}</p> : null}
                    {selected.userAgent ? (
                      <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">{selected.userAgent}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-900/80 dark:text-amber-100/90">
                    Duplicates
                  </h3>
                  {selected.duplicateOf ? (
                    <div className="mt-2 space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Linked to{" "}
                        <Link href={adminFeedbackInboxHref(sp, { r: selected.duplicateOf.id })} className="font-mono font-semibold text-primary">
                          {selected.duplicateOf.id.slice(0, 10)}…
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{selected.duplicateOf.summary}</p>
                      <form action={clearUserFeedbackDuplicate}>
                        <input type="hidden" name="reportId" value={selected.id} />
                        <button type="submit" className="mt-2 text-xs font-semibold text-primary underline">
                          Unlink duplicate
                        </button>
                      </form>
                    </div>
                  ) : (
                    <form action={linkUserFeedbackDuplicate} className="mt-3 space-y-2">
                      <input type="hidden" name="reportId" value={selected.id} />
                      <label className="block text-[11px] font-medium text-muted-foreground" htmlFor="primaryReportId">
                        Canonical report id
                      </label>
                      <input
                        id="primaryReportId"
                        name="primaryReportId"
                        placeholder="Paste primary report cuid"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted/40"
                      >
                        Mark as duplicate of…
                      </button>
                    </form>
                  )}
                  {selected.childDuplicates.length > 0 ? (
                    <div className="mt-4 border-t border-amber-500/20 pt-3">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">Linked duplicates</p>
                      <ul className="mt-2 space-y-2">
                        {selected.childDuplicates.map((c) => (
                          <li key={c.id}>
                            <Link href={adminFeedbackInboxHref(sp, { r: c.id })} className="text-xs font-medium text-primary hover:underline">
                              {c.id.slice(0, 10)}…
                            </Link>
                            <span className="mx-1 text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{c.summary}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Internal notes</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">Visible only to staff. Not sent to the reporter.</p>
                  <form action={saveUserFeedbackInternalNotes} className="mt-3 space-y-2">
                    <input type="hidden" name="reportId" value={selected.id} />
                    <textarea
                      name="internalNotes"
                      defaultValue={selected.internalNotes ?? ""}
                      rows={5}
                      className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm leading-relaxed shadow-inner"
                      placeholder="Triage notes, owner, related ticket, hypothesis…"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                    >
                      Save notes
                    </button>
                  </form>
                </div>

                <p className="font-mono text-[10px] text-muted-foreground">id:{selected.id}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
