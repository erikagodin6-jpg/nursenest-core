import Link from "next/link";
import type { Prisma } from "@prisma/client";
import {
  UserFeedbackCategory,
  UserFeedbackSeverity,
  UserFeedbackStatus,
} from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { AdminFeedbackStatusForm } from "@/components/admin/admin-feedback-status-form";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 60;

const CATEGORY_LIST = Object.values(UserFeedbackCategory);
const STATUS_LIST = Object.values(UserFeedbackStatus);
const SEVERITY_LIST = Object.values(UserFeedbackSeverity);

function parseEnum<T extends string>(raw: string | undefined, allowed: readonly T[]): T | null {
  if (!raw) return null;
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : null;
}

function buildWhere(sp: Record<string, string | undefined>): Prisma.UserFeedbackReportWhereInput {
  const where: Prisma.UserFeedbackReportWhereInput = {};
  const cat = parseEnum(sp.category, CATEGORY_LIST);
  if (cat) where.category = cat;
  const st = parseEnum(sp.status, STATUS_LIST);
  if (st) where.status = st;
  const sev = parseEnum(sp.severity, SEVERITY_LIST);
  if (sev) where.severity = sev;
  if (sp.userId?.trim()) {
    where.userId = sp.userId.trim();
  } else if (sp.signedIn === "1") {
    where.userId = { not: null };
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

function labelCategory(c: UserFeedbackCategory): string {
  return c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
}

function qsWithPage(sp: Record<string, string | undefined>, page: number): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v != null && v !== "") u.set(k, v);
  }
  u.set("p", String(page));
  return u.toString();
}

export default async function AdminUserFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const where = buildWhere(sp);
  const page = Math.max(1, Number.parseInt(sp.p ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">User feedback</h1>
        <p className="mt-2 text-sm text-muted-foreground">Database is not configured in this environment.</p>
      </main>
    );
  }

  const [rows, total] = await Promise.all([
    prisma.userFeedbackReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.userFeedbackReport.count({ where }),
  ]);

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v) qs.set(k, v);
  }
  const baseQs = qs.toString();
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = skip + rows.length < total ? page + 1 : null;

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">User feedback</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Bug reports and product messages from learners and marketing pages. Tie rows to analytics by user id, route,
            and timestamp.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          Admin home
        </Link>
      </div>

      <form method="get" className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 shadow-sm">
        <div className="flex min-w-[10rem] flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="f-category">
            Category
          </label>
          <select
            id="f-category"
            name="category"
            defaultValue={sp.category ?? ""}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {CATEGORY_LIST.map((c) => (
              <option key={c} value={c}>
                {labelCategory(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[10rem] flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="f-status">
            Status
          </label>
          <select
            id="f-status"
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[9rem] flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="f-severity">
            Severity
          </label>
          <select
            id="f-severity"
            name="severity"
            defaultValue={sp.severity ?? ""}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {SEVERITY_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[12rem] flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="f-pageQ">
            Page / route contains
          </label>
          <input
            id="f-pageQ"
            name="pageQ"
            defaultValue={sp.pageQ ?? ""}
            placeholder="/app/…"
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
          />
        </div>
        <div className="flex min-w-[11rem] flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="f-userId">
            User id
          </label>
          <input
            id="f-userId"
            name="userId"
            defaultValue={sp.userId ?? ""}
            placeholder="Exact cuid…"
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm font-mono"
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input id="f-signed" type="checkbox" name="signedIn" value="1" defaultChecked={sp.signedIn === "1"} />
          <label htmlFor="f-signed" className="text-sm text-foreground">
            Signed-in only
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-[40px] items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Apply filters
        </button>
        <Link href="/admin/feedback" className="pb-2 text-sm font-semibold text-primary underline">
          Clear
        </Link>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing {rows.length} of {total} (newest first). Page {page}.
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border/80 bg-card/30 shadow-sm">
        <table className="min-w-[960px] w-full border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3 font-semibold">When</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Severity</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">User</th>
              <th className="px-3 py-3 font-semibold">Route / URL</th>
              <th className="px-3 py-3 font-semibold">Summary</th>
              <th className="px-3 py-3 font-semibold">Shot</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 align-top hover:bg-muted/20">
                <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">
                  {r.createdAt.toISOString().replace("T", " ").slice(0, 19)}
                </td>
                <td className="px-3 py-3 text-xs font-medium">{labelCategory(r.category)}</td>
                <td className="px-3 py-3 text-xs">{r.severity}</td>
                <td className="px-3 py-3">
                  <AdminFeedbackStatusForm reportId={r.id} status={r.status} />
                </td>
                <td className="max-w-[12rem] px-3 py-3 text-xs">
                  {r.user ? (
                    <div className="space-y-1">
                      <div className="font-mono text-[11px] leading-tight break-all">{r.user.id}</div>
                      <div className="break-words text-muted-foreground">{r.user.email}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Guest</span>
                  )}
                </td>
                <td className="max-w-[14rem] px-3 py-3 text-xs">
                  <div className="font-mono text-[11px] leading-snug break-all text-muted-foreground">{r.routeKey ?? "—"}</div>
                  <div className="mt-1 break-all text-[11px] text-foreground/80">{r.pageUrl}</div>
                  {r.pathwayId ? (
                    <div className="mt-1 text-[11px] text-primary">Pathway: {r.pathwayId}</div>
                  ) : null}
                </td>
                <td className="max-w-[18rem] px-3 py-3 text-xs leading-snug">
                  <span className="line-clamp-4">{r.summary}</span>
                  {r.details ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-primary">Details</summary>
                      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-[11px]">
                        {r.details}
                      </pre>
                    </details>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-xs">
                  {r.screenshotDataUrl ? (
                    <a
                      href={r.screenshotDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline"
                    >
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No reports match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        {prevPage ? (
          <Link className="text-primary underline" href={`/admin/feedback?${qsWithPage(sp, prevPage)}`}>
            Previous
          </Link>
        ) : null}
        {nextPage ? (
          <Link className="text-primary underline" href={`/admin/feedback?${qsWithPage(sp, nextPage)}`}>
            Next
          </Link>
        ) : null}
      </div>

      {baseQs ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Active query: <span className="font-mono">{baseQs}</span>
        </p>
      ) : null}
    </main>
  );
}
