import Link from "next/link";
import { KeyRound, Shield, ShieldCheck, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";

export const dynamic = "force-dynamic";

function tierLabel(tier: StaffTier): string {
  switch (tier) {
    case "super":
      return "Super admin (full console)";
    case "content":
      return "Content admin";
    case "support":
      return "Support / viewer";
    default:
      return "Staff";
  }
}

export default async function AdminAccessPage() {
  await requireAdmin();
  const staff = await getStaffSession();
  const tier: StaffTier = staff?.tier ?? "super";
  const role = staff?.role ?? "—";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Security</p>
      <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Access &amp; roles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        NurseNest uses database-backed staff roles. The JWT may lag briefly after a role change; navigation and APIs enforce
        the same rules server-side.
      </p>

      <div className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-[var(--theme-card-bg)] to-emerald-500/[0.06] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <ShieldCheck className="h-8 w-8 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your session</p>
            <p className="text-lg font-semibold text-[var(--theme-heading-text)]">{tierLabel(tier)}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Role: {role}</p>
          </div>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        <li className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-5">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-semibold text-[var(--theme-heading-text)]">Super admin</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Full operational access: publishing, AI generation, billing lists, user support, premium protection, i18n
                tooling, and dangerous APIs. Legacy <code className="rounded bg-muted px-1">ADMIN</code> in the database maps
                here.
              </p>
            </div>
          </div>
        </li>
        <li className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-5">
          <div className="flex items-start gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-semibold text-[var(--theme-heading-text)]">Content admin</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lessons, blog, SEO, media, question drafts, and most analytics — but not raw user PII tables, subscription
                revenue drill-downs, or account-wide billing exports. Suited for editorial and generation workflows.
              </p>
            </div>
          </div>
        </li>
        <li className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-5">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-semibold text-[var(--theme-heading-text)]">Support / viewer</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Allowlisted read-heavy routes: user lookup, diagnostics, operations health, subscription analytics views, and
                automation logs. Publishing, generation hubs, and super-only tools are blocked at the server.
              </p>
            </div>
          </div>
        </li>
      </ul>

      <p className="mt-8 text-xs text-muted-foreground">
        Non-staff users are redirected away from <code className="rounded bg-muted px-1">/admin</code> and{" "}
        <code className="rounded bg-muted px-1">/api/admin/*</code>. Learner-app premium preview overrides apply only to
        super/content-class roles — not support staff.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin" className="text-primary underline">
          ← Command center
        </Link>
        <Link href="/admin/operations" className="text-muted-foreground underline">
          Operations
        </Link>
      </div>
    </main>
  );
}
